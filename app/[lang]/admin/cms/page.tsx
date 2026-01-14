"use client";

import React, { useEffect, useState, useRef } from "react";
import { CMSService, supabase } from "@/services/supabase.conf";
import { SupportedLanguage, locales } from "@/context/adapt";
import { useRouter } from "next/navigation";

export default function CMSAdminPage() {
  const router = useRouter();
  const [structure, setStructure] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [selectedRegion, setSelectedRegion] = useState<string>(''); 
  
  // State for Values
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Preview State
  const [previewRoute, setPreviewRoute] = useState<string>('');
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const sitemapRoutes = ['', '/about', '/staff', '/ministry', '/implicate', '/donate', '/contact'];

  // Load Tree Function (Defined here to be accessible by other functions)
  const fetchTree = () => {
    fetch('/api/cms?type=tree')
      .then(res => res.json())
      .then(data => {
        setStructure(data.structure || {});
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Load Content when selection changes
  useEffect(() => {
    if (!activePage) return;
    
    if (!activeSection) setIsEditorOpen(true);

    const prefix = activeSection ? `${activePage}.${activeSection}` : activePage;
    
    setLoading(true);
    CMSService.getPageContent(prefix, selectedLang, selectedRegion || undefined)
      .then(data => {
        setEditValues(data);
        setOriginalValues(data); // Sync 'Clean' state
        setLoading(false);
        
        if (highlightKey) {
             setTimeout(() => {
                 const el = document.getElementById(`edit-field-${highlightKey}`);
                 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 setHighlightKey(null);
             }, 500); 
        }
      });
  }, [activePage, activeSection, selectedLang, selectedRegion]); 

  // Listen for Visual Editor Requests
  useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'CMS_EDIT_REQUEST' && event.data.key) {
              const fullKey = event.data.key as string;
              const parts = fullKey.split('.');
              
              if (parts.length >= 2) {
                  const items = Object.keys(structure);
                  if (items.includes(parts[0])) {
                      setActivePage(parts[0]);
                      if (structure[parts[0]][parts[1]]) {
                          setActiveSection(parts[1]);
                      } else {
                          setActiveSection(null);
                      }
                      setHighlightKey(fullKey);
                      setIsEditorOpen(true);
                  }
              }
          }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, [structure]);

  // --- Actions ---

  // 1. Handle Input Change (Real-time Preview)
  const handleChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
    
    // Send update to iframe
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ 
            type: 'CMS_PREVIEW_UPDATE', 
            key, 
            value 
        }, '*');
    }
  };

  // 2. Publish (Save to DB)
  const handlePublish = async (key: string) => {
    setSavingKey(key);
    const value = editValues[key];
    
    const { error } = await CMSService.upsertContent({
      key,
      value,
      language: selectedLang,
      country_code: selectedRegion || null,
      content_type: key.includes('image') ? 'image' : key.includes('html') ? 'html' : 'text'
    });
    
    if (error) {
        alert('Error saving: ' + error.message);
    } else {
        // Update original value to match current saved state (removes dirty state)
        setOriginalValues(prev => ({ ...prev, [key]: value }));
    }
    setSavingKey(null);
  };

  // 3. Image Upload
  const handleImageUpload = async (key: string, file: File) => {
      setSavingKey(key);
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `cms/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          // 3a. Upload
          const { error: uploadError } = await supabase.storage
            .from('static') // CHANGED: 'public' -> 'static'
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // 3b. Get Public URL
          const { data: { publicUrl } } = supabase.storage
            .from('static') // CHANGED: 'public' -> 'static'
            .getPublicUrl(fileName);

          // 3c. Update Editor
          handleChange(key, publicUrl);
          
      } catch (e: any) {
          alert("Upload failed: " + e.message);
      } finally {
          setSavingKey(null);
      }
  };

  const createNewItem = async (type: 'word' | 'newsletter') => {
      const id = Date.now();
      const prefix = type === 'word' ? 'weekly_word' : 'newsletter';
      const dateKey = `${prefix}.${id}.date`;
      const titleKey = `${prefix}.${id}.title`;
      const contentKey = `${prefix}.${id}.content`;

      setSavingKey(dateKey);
      await CMSService.upsertContent({ key: dateKey, value: new Date().toISOString().split('T')[0], language: selectedLang, content_type: 'text' });
      await CMSService.upsertContent({ key: titleKey, value: "New Title", language: selectedLang, content_type: 'text' });
      setSavingKey(null);
      
      fetchTree(); // Now this function exists
      setActivePage(prefix);
      setActiveSection(id.toString());
  };

  // Icons
  const IconLeft = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
  const IconRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
  const IconFolder = () => <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
  const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
  const IconUpload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

  if (loading && !structure && !activePage) return <div className="flex items-center justify-center h-screen text-zinc-400">Loading Workspace...</div>;

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-sans">
      {/* Sidebar - Remains fixed */}
      <aside className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col h-screen sticky top-0 overflow-hidden shrink-0">
        {/* Header */}
        <div className="p-4 flex items-center gap-2 border-b border-zinc-100 shrink-0">
            <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs font-bold">A</div>
            <span className="font-semibold text-sm">AEE CMS Workspace</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
             {/* Pages Section */}
            <div className="text-xs font-semibold text-zinc-400 px-3 py-2 uppercase tracking-wider">Pages</div>
            {Object.keys(structure).filter(k => !k.includes('weekly_word') && !k.includes('newsletter')).map((page) => (
                <div key={page}>
                    <button 
                         onClick={() => { setActivePage(page); setActiveSection(null); }}
                        className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${activePage === page && !activeSection ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100'}`}
                    >
                        <IconFolder />
                        <span className="capitalize">{page}</span>
                    </button>
                    {activePage === page && Object.keys(structure[page]).map(section => (
                         <button key={section} onClick={() => setActiveSection(section)} className={`w-full flex items-center pl-8 pr-3 py-1 text-sm rounded-md transition-colors ${activeSection === section ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500 hover:bg-zinc-50'}`}>
                             <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mr-2"></span>
                             <span className="capitalize">{section}</span>
                         </button>
                    ))}
                </div>
            ))}

             {/* Collections Section */}
             <div className="text-xs font-semibold text-zinc-400 px-3 py-2 mt-6 uppercase tracking-wider">Collections</div>
            
            <button onClick={() => createNewItem('word')} className="w-full flex items-center px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 rounded-md group">
                <span className="w-4 h-4 mr-2 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600"><IconPlus /></span>
                New Weekly Word
            </button>
             {structure['weekly_word'] && Object.keys(structure['weekly_word']).map(id => (
                 <button key={id} onClick={() => { setActivePage('weekly_word'); setActiveSection(id); }} className={`w-full flex items-center pl-8 pr-3 py-1 text-sm rounded-md transition-colors ${activePage === 'weekly_word' && activeSection === id ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500 hover:bg-zinc-50'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2"></span> Word #{id.slice(-4)}
                 </button>
            ))}

            <button onClick={() => createNewItem('newsletter')} className="w-full flex items-center px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 rounded-md group mt-2">
                <span className="w-4 h-4 mr-2 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600"><IconPlus /></span>
                New Newsletter
            </button>
             {structure['newsletter'] && Object.keys(structure['newsletter']).map(id => (
                 <button key={id} onClick={() => { setActivePage('newsletter'); setActiveSection(id); }} className={`w-full flex items-center pl-8 pr-3 py-1 text-sm rounded-md transition-colors ${activePage === 'newsletter' && activeSection === id ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500 hover:bg-zinc-50'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 mr-2"></span> News #{id.slice(-4)}
                 </button>
            ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 bg-white/80 backdrop-blur top-0 sticky z-10 shrink-0">
             {/* Breadcrumbs */}
             <div className="flex items-center text-sm text-zinc-500">
                <button 
                  onClick={() => setIsEditorOpen(!isEditorOpen)}
                  className="mr-3 p-1 hover:bg-zinc-100 rounded text-zinc-400 transition-colors"
                  title={isEditorOpen ? "Collapse Editor" : "Expand Editor"}
                >
                    {isEditorOpen ? <IconLeft /> : <IconRight />}
                </button>
                {activePage ? (
                    <>
                        <span className="hover:text-zinc-800 cursor-pointer capitalize">{activePage.replace('_', ' ')}</span>
                        {activeSection && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-zinc-800 font-medium capitalize">{activeSection}</span>
                            </>
                        )}
                    </>
                ) : (
                    <span>Select a page to edit</span>
                )}
            </div>

            {/* Settings - Language, Region, Preview Route */}
            <div className="flex items-center gap-4">
                 <select 
                    value={previewRoute} 
                    onChange={(e) => setPreviewRoute(e.target.value)}
                    className="text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1"
                >
                    {sitemapRoutes.map(r => <option key={r} value={r}>{r === '' ? 'Home' : r}</option>)}
                </select>

                <div className="h-4 w-px bg-zinc-300"></div>

                <select 
                    value={selectedLang} 
                    onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                    className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-zinc-600 hover:text-zinc-900"
                >
                    {locales.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
                <div className="h-4 w-px bg-zinc-300"></div>
                <input 
                    type="text" 
                    placeholder="Region" 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-20 text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1 uppercase placeholder:normal-case"
                />
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            
            {/* Editor Column - Collapsible */}
            <div 
                className={`
                    overflow-y-auto border-r border-zinc-200 transition-all duration-300 ease-in-out bg-white
                    ${isEditorOpen ? 'w-[450px] opacity-100 p-8' : 'w-0 opacity-0 p-0 overflow-hidden'}
                `}
            >
                {!activePage ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-300">
                        <div className="w-16 h-16 bg-zinc-50 rounded-xl mb-4"></div>
                        <p>Select a page from the sidebar to start editing</p>
                    </div>
                ) : (
                    <div className="space-y-12 pb-20">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2 capitalize">
                                {activeSection || activePage.replace('_', ' ')}
                            </h1>
                        </div>

                        {(() => {
                            const keys = Object.keys(editValues).sort();
                            if (keys.length === 0) return <div className="text-zinc-400 italic">No content found. Type keys manually or Create New.</div>

                            return keys.map((key) => {
                                const val = editValues[key];
                                const originalVal = originalValues[key];
                                const isDirty = val !== originalVal;
                                const isSaving = savingKey === key;
                                
                                const isLong = val.length > 50 || key.includes('content') || key.includes('description');
                                const isImage = key.includes('image') || key.includes('src') || key.includes('url');
                                const isHighlighted = highlightKey === key;

                                return (
                                    <div 
                                        key={key} 
                                        id={`edit-field-${key}`}
                                        className={`group relative pl-4 border-l-2 transition-all duration-300 ${isHighlighted ? 'border-blue-500 bg-blue-50 p-2 rounded-r' : 'border-transparent hover:border-zinc-300'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <label className={`block text-xs font-semibold font-mono ${isHighlighted ? 'text-blue-600' : 'text-zinc-400'}`}>{key}</label>
                                            {isDirty && (
                                                <button 
                                                    onClick={() => handlePublish(key)}
                                                    disabled={isSaving}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center scale-100 animate-in fade-in"
                                                >
                                                    {isSaving ? 'Saving...' : 'Publish'}
                                                </button>
                                            )}
                                        </div>
                                        
                                        {isImage ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-4 items-start">
                                                    {val && <img src={val} alt="Preview" className="w-20 h-20 object-cover rounded bg-zinc-100 border border-zinc-200" />}
                                                    <div className="flex-1 space-y-2">
                                                        <input 
                                                            type="text" 
                                                            value={val}
                                                            onChange={(e) => handleChange(key, e.target.value)}
                                                            className="w-full bg-transparent border-b border-zinc-200 pb-1 focus:border-black focus:outline-none text-sm"
                                                            placeholder="https://..."
                                                        />
                                                        <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-blue-600">
                                                            {isSaving ? <span>Uploading...</span> : <><IconUpload /> Upload Image</>}
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*"
                                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(key, e.target.files[0])}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isLong ? (
                                            <textarea 
                                                value={val}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                rows={Math.min(val.split('\n').length + 2, 8)}
                                                className="w-full bg-zinc-50/50 p-3 rounded-md resize-none border-none focus:ring-1 focus:ring-zinc-200 text-zinc-800 leading-relaxed text-sm"
                                            />
                                        ) : (
                                            <input 
                                                type="text" 
                                                value={val}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                className="w-full bg-transparent text-xl font-medium text-zinc-800 placeholder-zinc-300 border-none focus:ring-0 p-0"
                                            />
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>

            {/* Visual Preview Column */}
            <div className="flex-1 bg-zinc-100 p-4 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Visual Editor</span>
                    <span className="text-xs text-zinc-400">Right-click elements to edit</span>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden border border-zinc-200 relative">
                     <iframe 
                        ref={iframeRef}
                        id="preview-frame"
                        src={`/${selectedLang}${previewRoute}?edit_mode=true`}
                        className="w-full h-full border-none"
                        title="Visual Preview"
                     />
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
