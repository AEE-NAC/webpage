"use client";

import React, { useEffect, useState } from "react";
import { CMSService } from "@/services/supabase.conf";
import { SupportedLanguage, locales } from "@/context/adapt";
import { useRouter } from "next/navigation";

// --- Types ---
type NavItem = {
  name: string;
  keys: string[];
  children?: NavItem[];
};

export default function CMSAdminPage() {
  const router = useRouter();
  const [structure, setStructure] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Editor State
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [selectedRegion, setSelectedRegion] = useState<string>(''); // empty = global
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load Tree
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
    
    // Construct prefix based on selection
    const prefix = activeSection ? `${activePage}.${activeSection}` : activePage;
    
    setLoading(true);
    CMSService.getPageContent(prefix, selectedLang, selectedRegion || undefined)
      .then(data => {
        setEditValues(data);
        setLoading(false);
      });
  }, [activePage, activeSection, selectedLang, selectedRegion]);

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    const { error } = await CMSService.upsertContent({
      key,
      value,
      language: selectedLang,
      country_code: selectedRegion || null,
      content_type: key.includes('image') ? 'image' : key.includes('html') ? 'html' : 'text'
    });
    setSaving(false);
    if (error) alert('Error saving: ' + error.message);
  };

  const createNewItem = async (type: 'word' | 'newsletter') => {
      const id = Date.now();
      const prefix = type === 'word' ? 'weekly_word' : 'newsletter';
      const dateKey = `${prefix}.${id}.date`;
      const titleKey = `${prefix}.${id}.title`;
      const contentKey = `${prefix}.${id}.content`;

      setSaving(true);
      // Create defaults
      await handleSave(dateKey, new Date().toISOString().split('T')[0]);
      await handleSave(titleKey, "New Title");
      await handleSave(contentKey, "Content goes here...");
      setSaving(false);
      
      // Refresh structure and select the new item
      fetchTree();
      setActivePage(prefix);
      setActiveSection(id.toString());
  };

  // Icon Components
  const IconFile = () => <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  const IconFolder = () => <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
  const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

  if (loading && !structure && !activePage) return <div className="flex items-center justify-center h-screen text-zinc-400">Loading Workspace...</div>;

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-4 flex items-center gap-2 border-b border-zinc-100 shrink-0">
            <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs font-bold">A</div>
            <span className="font-semibold text-sm">AEE CMS Workspace</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-zinc-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur top-0 sticky z-10">
            <div className="flex items-center text-sm text-zinc-500">
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

            <div className="flex items-center gap-4">
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
                    placeholder="Region (e.g. HT)" 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-20 text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1 uppercase placeholder:normal-case"
                />
            </div>
        </header>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
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
                        <p className="text-zinc-500">
                            Editing content for <span className="font-semibold">{selectedLang.toUpperCase()}</span>
                            {selectedRegion && <span> in <span className="font-semibold">{selectedRegion}</span></span>}
                        </p>
                    </div>

                    {(() => {
                        const keys = Object.keys(editValues).sort();

                        if (keys.length === 0) return <div className="text-zinc-400 italic">No content found. Type keys manually or Create New.</div>

                        return keys.map((key) => {
                            const val = editValues[key];
                            const isLong = val.length > 50 || key.includes('content') || key.includes('description');
                            const isImage = key.includes('image') || key.includes('src') || key.includes('url');

                            return (
                                <div key={key} className="group relative pl-4 border-l-2 border-transparent hover:border-zinc-300 transition-colors">
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1 font-mono">{key}</label>
                                    
                                    {isImage ? (
                                        <div className="flex gap-4 items-start">
                                            {val && <img src={val} alt="Preview" className="w-20 h-20 object-cover rounded bg-zinc-100 border border-zinc-200" />}
                                            <input 
                                                type="text" 
                                                defaultValue={val}
                                                onBlur={(e) => handleSave(key, e.target.value)}
                                                className="flex-1 bg-transparent border-b border-zinc-200 pb-1 focus:border-black focus:outline-none transition-colors text-sm"
                                            />
                                        </div>
                                    ) : isLong ? (
                                        <textarea 
                                            defaultValue={val}
                                            onBlur={(e) => handleSave(key, e.target.value)}
                                            rows={Math.min(val.split('\n').length + 2, 10)}
                                            className="w-full bg-zinc-50/50 p-3 rounded-md resize-none border-none focus:ring-1 focus:ring-zinc-200 text-zinc-800 leading-relaxed"
                                        />
                                    ) : (
                                        <input 
                                            type="text" 
                                            defaultValue={val}
                                            onBlur={(e) => handleSave(key, e.target.value)}
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
      </main>
    </div>
  );
}
