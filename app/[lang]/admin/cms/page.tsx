"use client";

import React, { useEffect, useState, useRef } from "react";
import { CMSService, supabase } from "@/services/supabase.conf";
import { CMSPopover, CMSWeeklyWord, CMSNewsletter } from "@/services/types"; // Import types
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
  
  // Marketing State
  const [marketingList, setMarketingList] = useState<CMSPopover[]>([]);
  const [editingPopover, setEditingPopover] = useState<Partial<CMSPopover> | null>(null);

  // Weekly Word State
  const [wordsList, setWordsList] = useState<CMSWeeklyWord[]>([]);
  const [editingWord, setEditingWord] = useState<Partial<CMSWeeklyWord> | null>(null);

  // Newsletter State
  const [newslettersList, setNewslettersList] = useState<CMSNewsletter[]>([]);
  const [editingNewsletter, setEditingNewsletter] = useState<Partial<CMSNewsletter> | null>(null);

  // Load Tree Function (Defined here to be accessible by other functions)
  const fetchTree = () => {
    fetch('/api/cms?type=tree')
      .then(res => res.json())
      .then((data: any) => { 
        setStructure(data.structure || {});
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Main Loading Logic Switcher
  useEffect(() => {
    if (!activePage) return;
    
    // 1. Marketing View
    if (activePage === '__marketing') {
        setLoading(true);
        CMSService.getPopoversList().then(data => {
            setMarketingList(data);
            setLoading(false);
        });
        return; 
    }

    // 2. Weekly Words View
    if (activePage === '__weekly_words') {
        setLoading(true);
        CMSService.getWeeklyWords().then(data => {
            setWordsList(data);
            setLoading(false);
        }).catch(e => { console.error(e); setLoading(false); });
        return;
    }

    // 3. Newsletters View
    if (activePage === '__newsletters') {
        setLoading(true);
        CMSService.getNewsletters().then(data => {
            setNewslettersList(data);
            setLoading(false);
        }).catch(e => { console.error(e); setLoading(false); });
        return;
    }
    
    // 4. Standard Page Content Editor
    if (!activeSection) setIsEditorOpen(true);
    const prefix = activeSection ? `${activePage}.${activeSection}` : activePage;
    setLoading(true);
    CMSService.getPageContent(prefix, selectedLang, selectedRegion || undefined)
      .then(data => {
        setEditValues(data);
        setOriginalValues(data); 
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
                      if (structure[parts[0]][parts[1]]) setActiveSection(parts[1]);
                      else setActiveSection(null);
                      setHighlightKey(fullKey);
                      setIsEditorOpen(true);
                  }
              }
          }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, [structure]);

  // --- Generic Actions ---
  // 1. Handle Input Change (Real-time Preview)
  const handleChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'CMS_PREVIEW_UPDATE', key, value }, '*');
    }
  };

  // 2. Publish (Save to DB)
  const handlePublish = async (key: string) => {
    setSavingKey(key);
    const value = editValues[key];
    const { error } = await CMSService.upsertContent({
      key, value, language: selectedLang,
      country_code: selectedRegion || null,
      content_type: key.includes('image') ? 'image' : key.includes('html') ? 'html' : 'text'
    });
    if (error) alert('Error: ' + error.message);
    else setOriginalValues(prev => ({ ...prev, [key]: value }));
    setSavingKey(null);
  };

  // 3. Image Upload
  const handleImageUpload = async (key: string, file: File) => {
      setSavingKey(key);
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `cms/${Date.now()}.${fileExt}`;
          const { error } = await supabase.storage.from('static').upload(fileName, file, { cacheControl: '3600', upsert: false });
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from('static').getPublicUrl(fileName);
          handleChange(key, publicUrl);
      } catch (e: any) { alert("Upload failed: " + e.message); } finally { setSavingKey(null); }
  };


  // --- Marketing Actions ---
  const handleCampaignImageUpload = async (file: File) => {
    if (!editingPopover) return;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `campaigns/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('static').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('static').getPublicUrl(fileName);
        setEditingPopover(prev => ({ ...prev!, image_url: publicUrl }));
    } catch (e: any) { alert("Upload failed: " + e.message); }
  };
   const savePopover = async (popover: Partial<CMSPopover>) => {
      const payload = { ...popover, 
          name: popover.name || 'Untitled', 
          type: popover.type || 'template', component_type: popover.component_type || 'modal',
          is_active: popover.is_active ?? false, language: popover.language || 'en',
          frequency_hours: popover.frequency_hours ?? 24, start_at: popover.start_at || new Date().toISOString(),
          end_at: popover.end_at || null, target_pages: popover.target_pages || ['*']
      };
      const { error } = await CMSService.upsertPopover(payload as any);
      if (error) alert("Error: " + error.message);
      else { setEditingPopover(null); setMarketingList(await CMSService.getPopoversList()); }
  };
  const deletePopover = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      await CMSService.deletePopover(id);
      setMarketingList(await CMSService.getPopoversList());
  };


  // --- Weekly Word Actions ---
  const handleWordImageUpload = async (file: File) => {
      if (!editingWord) return;
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `weekly-words/${Date.now()}.${fileExt}`;
          const { error } = await supabase.storage.from('static').upload(fileName, file);
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from('static').getPublicUrl(fileName);
          setEditingWord(prev => ({ ...prev!, image_url: publicUrl }));
      } catch (e: any) { alert("Upload error: " + e.message); }
  };

  const saveWord = async (item: Partial<CMSWeeklyWord>) => {
      if (!item.title || !item.start_date || !item.end_date) return alert("Title and Dates are required");
      const { error } = await CMSService.upsertWeeklyWord(item as any);
      if(error) alert(error.message);
      else { setEditingWord(null); setWordsList(await CMSService.getWeeklyWords()); }
  };

  const deleteWord = async (id: string) => {
      if(!confirm("Delete this word?")) return;
      await CMSService.deleteWeeklyWord(id);
      setWordsList(await CMSService.getWeeklyWords());
  };


  // --- Newsletter Actions ---
  const handleNewsletterPdfUpload = async (file: File) => {
      if (!editingNewsletter) return;
      try {
          const fileExt = file.name.split('.').pop();
          if(fileExt?.toLowerCase() !== 'pdf') return alert("Only PDF allowed");
          const fileName = `newsletters/${Date.now()}.${fileExt}`;
          const { error } = await supabase.storage.from('static').upload(fileName, file);
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from('static').getPublicUrl(fileName);
          setEditingNewsletter(prev => ({ ...prev!, pdf_url: publicUrl }));
      } catch (e: any) { alert("Upload error: " + e.message); }
  };

  const saveNewsletter = async (item: Partial<CMSNewsletter>) => {
       if (!item.title || !item.pdf_url || !item.publication_date) return alert("Title, Date and PDF are required");
       const { error } = await CMSService.upsertNewsletter(item as any);
       if(error) alert(error.message);
       else { setEditingNewsletter(null); setNewslettersList(await CMSService.getNewsletters()); }
  };

  const deleteNewsletter = async (id: string) => {
      if(!confirm("Delete this newsletter?")) return;
      await CMSService.deleteNewsletter(id);
      setNewslettersList(await CMSService.getNewsletters());
  };

  // Icons
  const IconBell = () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
  const IconFolder = () => <svg className="w-4 h-4 mr-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
  const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
  const IconLeft = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
  const IconRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
  const IconUpload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
  const IconBook = () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
  const IconMail = () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

  if (loading && !structure && !activePage) return <div className="flex items-center justify-center h-screen text-zinc-400">Loading Workspace...</div>;

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-sans">
      {/* Sidebar - Remains fixed */}
      <aside className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col h-screen sticky top-0 overflow-hidden shrink-0">
        {/* Header */}
        <div className="p-4 flex items-center gap-2 border-b border-zinc-100 shrink-0">
            <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs font-bold">A</div>
            <span className="font-semibold text-sm">AEE CMS</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
             {/* SPECIALIZED MANAGERS */}
             <div className="text-xs font-semibold text-zinc-400 px-3 py-2 uppercase tracking-wider">Management</div>
             <button 
                 onClick={() => { setActivePage('__marketing'); setActiveSection(null); }}
                 className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${activePage === '__marketing' ? 'bg-purple-100 text-purple-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100'}`}
             >
                 <span className={activePage==='__marketing' ? 'text-purple-600' : 'text-zinc-400'}><IconBell /></span>
                 Popovers & Banners
             </button>
             
             <button 
                 onClick={() => { setActivePage('__weekly_words'); setActiveSection(null); }}
                 className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${activePage === '__weekly_words' ? 'bg-blue-100 text-blue-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100'}`}
             >
                 <span className={activePage==='__weekly_words' ? 'text-blue-600' : 'text-zinc-400'}><IconBook /></span>
                 Weekly Words
             </button>

             <button 
                 onClick={() => { setActivePage('__newsletters'); setActiveSection(null); }}
                 className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${activePage === '__newsletters' ? 'bg-green-100 text-green-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100'}`}
             >
                 <span className={activePage==='__newsletters' ? 'text-green-600' : 'text-zinc-400'}><IconMail /></span>
                 Newsletters
             </button>


             {/* GENERIC PAGES SECTIONS */}
             <div className="text-xs font-semibold text-zinc-400 px-3 py-2 mt-4 uppercase tracking-wider">Pages</div>
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
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Shared */}
        <header className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 bg-white/80 backdrop-blur top-0 sticky z-10 shrink-0">
             {/* Breadcrumbs */}
             <div className="flex items-center text-sm text-zinc-500 gap-2">
                {!activePage?.startsWith('__') && (
                    <button 
                        onClick={() => setIsEditorOpen(!isEditorOpen)}
                        className="mr-3 p-1 hover:bg-zinc-100 rounded text-zinc-400 transition-colors"
                        title={isEditorOpen ? "Collapse Editor" : "Expand Editor"}
                    >
                        {isEditorOpen ? <IconLeft /> : <IconRight />}
                    </button>
                )}
                {activePage === '__marketing' ? <span className="font-semibold text-purple-900">Marketing & Campaigns</span> :
                 activePage === '__weekly_words' ? <span className="font-semibold text-blue-900">Weekly Words Manager</span> :
                 activePage === '__newsletters' ? <span className="font-semibold text-green-900">Newsletters Manager</span> :
                 activePage ? (
                    <>
                        <span className="hover:text-zinc-800 cursor-pointer capitalize">{activePage.replace('_', ' ')}</span>
                        {activeSection && <><span className="mx-2">/</span><span className="text-zinc-800 font-medium capitalize">{activeSection}</span></>}
                    </>
                ) : (
                    <span>Select a tool</span>
                )}
            </div>

            <div className="flex items-center gap-4">
                 {/* Only show preview dropdown for regular pages */}
                 {!activePage?.startsWith('__') && (
                     <>
                        <select 
                            value={previewRoute} 
                            onChange={(e) => setPreviewRoute(e.target.value)}
                            className="text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1"
                        >
                            {sitemapRoutes.map(r => <option key={r} value={r}>{r === '' ? 'Home' : r}</option>)}
                        </select>
                        <div className="h-4 w-px bg-zinc-300"></div>
                     </>
                 )}
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
                <div className="flex items-center gap-2">
                     <span className="text-xs uppercase font-bold text-zinc-400">{selectedLang}</span>
                 </div>
            </div>
        </header>

        {/* --- MAIN CONTENT SWITCH --- */}
        {activePage === '__marketing' ? (
             <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50">
                 {/* MARKETING VIEW */}
                 <div className="max-w-4xl mx-auto">
                     <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Popovers & Banners</h1>
                            <p className="text-zinc-500 text-sm mt-1">Manage site-wide announcements, modals, and alerts.</p>
                        </div>
                        <button onClick={() => setEditingPopover({ name: 'New Campaign', is_active: false })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">+ Create Campaign</button>
                     </div>

                     {editingPopover ? (
                         <div className="bg-white rounded-xl shadow-lg border border-zinc-200 p-6">
                             <div className="flex justify-between items-start mb-6 border-b border-zinc-100 pb-4">
                                 <h2 className="text-lg font-semibold">{editingPopover.id ? 'Edit' : 'New'}</h2>
                                 <button onClick={() => setEditingPopover(null)} className="text-zinc-400 hover:text-zinc-600">Close</button>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-4">
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Internal Name</label>
                                         <input type="text" className="w-full border p-2 rounded" value={editingPopover.name || ''} onChange={e => setEditingPopover({...editingPopover, name: e.target.value})} placeholder="e.g. Easter Promo" />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Display Type</label>
                                         <div className="flex gap-4">
                                             <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                 <input type="radio" name="ctype" checked={editingPopover.component_type !== 'banner'} onChange={() => setEditingPopover({...editingPopover, component_type: 'modal'})} /> 
                                                 Pop-up Modal
                                             </label>
                                             <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                 <input type="radio" name="ctype" checked={editingPopover.component_type === 'banner'} onChange={() => setEditingPopover({...editingPopover, component_type: 'banner'})} /> 
                                                 Top Banner
                                             </label>
                                         </div>
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Target Language</label>
                                         <select className="w-full border p-2 rounded" value={editingPopover.language || 'en'} onChange={e => setEditingPopover({...editingPopover, language: e.target.value as any})}>
                                             {locales.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                                         </select>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-2">
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Start Date</label>
                                            <input 
                                                type="datetime-local" 
                                                className="w-full border p-2 rounded" 
                                                value={editingPopover.start_at ? new Date(editingPopover.start_at).toISOString().slice(0, 16) : ''} 
                                                onChange={e => setEditingPopover({...editingPopover, start_at: new Date(e.target.value).toISOString()})} 
                                            />
                                         </div>
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">End Date</label>
                                            <input 
                                                type="datetime-local" 
                                                className="w-full border p-2 rounded" 
                                                value={editingPopover.end_at ? new Date(editingPopover.end_at).toISOString().slice(0, 16) : ''} 
                                                onChange={e => setEditingPopover({...editingPopover, end_at: e.target.value ? new Date(e.target.value).toISOString() : null})} 
                                            />
                                            <div className="text-[10px] text-zinc-400 mt-1">Leave empty for no end date.</div>
                                         </div>
                                     </div>

                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Frequency (Hours)</label>
                                          <input type="number" className="w-full border p-2 rounded" value={editingPopover.frequency_hours ?? 24} onChange={e => setEditingPopover({...editingPopover, frequency_hours: parseInt(e.target.value)})} />
                                          <div className="text-[10px] text-zinc-400 mt-1">24 = Once/day. 0 = Always show.</div>
                                     </div>
                                      <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Target Pages</label>
                                         <div className="text-[10px] text-zinc-400 mb-2">Use sitemap suggestions. Use '*' for all pages.</div>
                                         <div className="flex flex-wrap gap-2 mb-2">
                                             {sitemapRoutes.map(path => (
                                                 <button 
                                                    key={path} 
                                                    onClick={() => {
                                                        const current = editingPopover.target_pages || [];
                                                        const p = path === '' ? '/' : path;
                                                        const newVal = current.includes(p) ? current.filter(x => x !== p) : [...current, p];
                                                        setEditingPopover({...editingPopover, target_pages: newVal});
                                                    }}
                                                    className={`px-2 py-1 text-xs rounded border ${editingPopover.target_pages?.includes(path === '' ? '/' : path) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600'}`}
                                                 >
                                                     {path === '' ? '/' : path}
                                                 </button>
                                             ))}
                                             <button 
                                                onClick={() => setEditingPopover({...editingPopover, target_pages: ['*']})}
                                                className={`px-2 py-1 text-xs rounded border ${editingPopover.target_pages?.includes('*') ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-zinc-200 text-zinc-600'}`}
                                             >
                                                 * (All)
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-4">
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Title</label>
                                         <input type="text" className="w-full border p-2 rounded" value={editingPopover.title || ''} onChange={e => setEditingPopover({...editingPopover, title: e.target.value})} placeholder="Heading text" />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Body Text (HTML supported)</label>
                                         <textarea className="w-full border p-2 rounded h-32" value={editingPopover.body || ''} onChange={e => setEditingPopover({...editingPopover, body: e.target.value})} placeholder="Message content..." />
                                     </div>
                                     <div className="grid grid-cols-2 gap-2">
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase mb-1">CTA Text</label>
                                            <input type="text" className="w-full border p-2 rounded" value={editingPopover.cta_text || ''} onChange={e => setEditingPopover({...editingPopover, cta_text: e.target.value})} />
                                         </div>
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase mb-1">CTA URL</label>
                                            <input type="text" className="w-full border p-2 rounded" value={editingPopover.cta_url || ''} onChange={e => setEditingPopover({...editingPopover, cta_url: e.target.value})} />
                                         </div>
                                     </div>
                                     <div>
                                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Image</label>
                                          <div className="flex gap-2">
                                              <input 
                                                type="text" 
                                                className="flex-1 border p-2 rounded text-sm" 
                                                value={editingPopover.image_url || ''} 
                                                onChange={e => setEditingPopover({...editingPopover, image_url: e.target.value})} 
                                                placeholder="https://..." 
                                              />
                                              <label className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-2 rounded cursor-pointer border border-zinc-200 flex items-center justify-center min-w-[3rem]" title="Upload Image">
                                                  <IconUpload />
                                                  <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleCampaignImageUpload(e.target.files[0])} />
                                              </label>
                                          </div>
                                          {editingPopover.image_url && (
                                              <img src={editingPopover.image_url} alt="Preview" className="mt-2 h-20 w-auto object-contain rounded border border-zinc-200 bg-zinc-50" />
                                          )}
                                     </div>
                                     
                                     <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
                                          <label className="flex items-center gap-2 cursor-pointer select-none">
                                              <input type="checkbox" checked={editingPopover.is_active || false} onChange={e => setEditingPopover({...editingPopover, is_active: e.target.checked})} className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500" />
                                              <span className={`font-bold text-sm ${editingPopover.is_active ? 'text-green-600' : 'text-zinc-400'}`}>
                                                  {editingPopover.is_active ? 'Active & Published' : 'Draft (Inactive)'}
                                              </span>
                                          </label>
                                          <div className="flex gap-2">
                                              {editingPopover.id && (
                                                  <button onClick={() => deletePopover(editingPopover.id!)} className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded">Delete</button>
                                              )}
                                              <button onClick={() => savePopover(editingPopover)} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded shadow-sm text-sm">
                                                  Save Campaign
                                              </button>
                                          </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="space-y-3">
                             {marketingList.map(p => (
                                 <div key={p.id} onClick={() => setEditingPopover(p)} className="group bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between hover:border-purple-300 hover:shadow-md cursor-pointer transition-all">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-red-300'}`}></div>
                                          <div><div className="font-semibold">{p.name}</div><div className="text-xs text-zinc-500">{p.language} • {p.component_type}</div></div>
                                      </div>
                                      <IconRight />
                                 </div>
                             ))}
                             {marketingList.length === 0 && <div className="text-center text-zinc-400 py-10">No campaigns found.</div>}
                         </div>
                     )}
                 </div>
             </div>
        ) : activePage === '__weekly_words' ? (
            /* WEEKLY WORDS MANAGER */
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Weekly Words</h1>
                            <p className="text-zinc-500 text-sm mt-1">Spiritual content published on a weekly basis.</p>
                        </div>
                        <button onClick={() => setEditingWord({ language: 'en', start_date: new Date().toISOString() } as any)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">+ New Word</button>
                    </div>

                    {editingWord ? (
                        <div className="bg-white rounded-xl shadow-lg border border-zinc-200 p-6 animate-in zoom-in-95 duration-200">
                             <div className="flex justify-between items-start mb-6 border-b border-zinc-100 pb-4">
                                 <h2 className="text-lg font-semibold">{editingWord.id ? 'Edit Word' : 'New Word'}</h2>
                                 <button onClick={() => setEditingWord(null)} className="text-zinc-400 hover:text-zinc-600">Close</button>
                             </div>
                             <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                                         <select className="w-full border p-2 rounded mt-1" value={editingWord.language || 'en'} onChange={e => setEditingWord({...editingWord, language: e.target.value as any})}>{locales.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select>
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                                         <input type="text" className="w-full border p-2 rounded mt-1" value={editingWord.title || ''} onChange={e => setEditingWord({...editingWord, title: e.target.value})} placeholder="e.g. The Power of Faith" />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Start Date</label>
                                            <input type="date" className="w-full border p-2 rounded mt-1" value={editingWord.start_date ? new Date(editingWord.start_date).toISOString().split('T')[0] : ''} onChange={e => setEditingWord({...editingWord, start_date: new Date(e.target.value).toISOString()})} />
                                         </div>
                                         <div>
                                            <label className="text-xs font-bold text-zinc-500 uppercase">End Date</label>
                                            <input type="date" className="w-full border p-2 rounded mt-1" value={editingWord.end_date ? new Date(editingWord.end_date).toISOString().split('T')[0] : ''} onChange={e => setEditingWord({...editingWord, end_date: new Date(e.target.value).toISOString()})} />
                                         </div>
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Author</label>
                                         <div className="grid grid-cols-2 gap-2 mt-1">
                                             <input type="text" className="border p-2 rounded" placeholder="Name" value={editingWord.author_name || ''} onChange={e => setEditingWord({...editingWord, author_name: e.target.value})} />
                                             <input type="text" className="border p-2 rounded" placeholder="Role (e.g. Pastor)" value={editingWord.author_role || ''} onChange={e => setEditingWord({...editingWord, author_role: e.target.value})} />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <div>
                                         <label className="text-xs font-bold text-zinc-500 uppercase">Content</label>
                                         <textarea className="w-full border p-2 rounded mt-1 h-32" value={editingWord.content || ''} onChange={e => setEditingWord({...editingWord, content: e.target.value})} placeholder="Write content here..." />
                                     </div>
                                     <div>
                                          <label className="text-xs font-bold text-zinc-500 uppercase">Cover Image</label>
                                          <div className="flex gap-2 mt-1">
                                              <input type="text" className="flex-1 border p-2 rounded text-sm" value={editingWord.image_url || ''} onChange={e => setEditingWord({...editingWord, image_url: e.target.value})} placeholder="https://..." />
                                              <label className="border p-2 rounded cursor-pointer hover:bg-zinc-50"><IconUpload /><input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleWordImageUpload(e.target.files[0])} /></label>
                                          </div>
                                          {editingWord.image_url && <img src={editingWord.image_url} alt="Preview" className="mt-2 h-24 object-cover rounded bg-zinc-100" />}
                                     </div>
                                     <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100 mt-4">
                                          {editingWord.id && <button onClick={() => deleteWord(editingWord.id!)} className="text-red-500 px-4 py-2 hover:bg-red-50 rounded">Delete</button>}
                                          <button onClick={() => saveWord(editingWord)} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Save Word</button>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {wordsList.map(w => (
                                <div key={w.id} onClick={() => setEditingWord(w)} className="group bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md cursor-pointer transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-100 rounded overflow-hidden flex-shrink-0">
                                            {w.image_url ? <img src={w.image_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><IconBook /></div>}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-zinc-900">{w.title}</div>
                                            <div className="text-xs text-zinc-500 flex gap-2">
                                                <span className="uppercase font-bold">{w.language}</span>
                                                <span>•</span>
                                                <span>{new Date(w.start_date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{w.author_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <IconRight />
                                </div>
                            ))}
                            {wordsList.length === 0 && <div className="text-center text-zinc-400 py-10">No weekly words found.</div>}
                        </div>
                    )}
                </div>
            </div>
        ) : activePage === '__newsletters' ? (
             /* NEWSLETTERS MANAGER */
             <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Newsletters</h1>
                            <p className="text-zinc-500 text-sm mt-1">Upload and manage PDF newsletters.</p>
                        </div>
                        <button onClick={() => setEditingNewsletter({ language: 'en', publication_date: new Date().toISOString() } as any)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">+ Upload Newsletter</button>
                    </div>

                    {editingNewsletter ? (
                        <div className="bg-white rounded-xl shadow-lg border border-zinc-200 p-6 animate-in zoom-in-95 duration-200">
                             <div className="flex justify-between items-start mb-6 border-b border-zinc-100 pb-4">
                                 <h2 className="text-lg font-semibold">{editingNewsletter.id ? 'Edit Newsletter' : 'New Newsletter'}</h2>
                                 <button onClick={() => setEditingNewsletter(null)} className="text-zinc-400 hover:text-zinc-600">Close</button>
                             </div>
                             <div className="max-w-lg mx-auto space-y-6">
                                 <div>
                                     <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                                     <select className="w-full border p-2 rounded mt-1" value={editingNewsletter.language || 'en'} onChange={e => setEditingNewsletter({...editingNewsletter, language: e.target.value as any})}>{locales.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select>
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                                     <input type="text" className="w-full border p-2 rounded mt-1" autoFocus value={editingNewsletter.title || ''} onChange={e => setEditingNewsletter({...editingNewsletter, title: e.target.value})} placeholder="e.g. March 2024 Update" />
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-zinc-500 uppercase">Publication Date</label>
                                     <input type="date" className="w-full border p-2 rounded mt-1" value={editingNewsletter.publication_date ? new Date(editingNewsletter.publication_date).toISOString().split('T')[0] : ''} onChange={e => setEditingNewsletter({...editingNewsletter, publication_date: new Date(e.target.value).toISOString()})} />
                                 </div>
                                 <div>
                                      <label className="text-xs font-bold text-zinc-500 uppercase">PDF File</label>
                                      <div className="flex gap-2 mt-1">
                                          <input type="text" className="flex-1 border p-2 rounded text-sm bg-zinc-50" readOnly value={editingNewsletter.pdf_url || ''} placeholder="Upload PDF..." />
                                          <label className="border p-2 rounded cursor-pointer hover:bg-zinc-50 bg-white shadow-sm font-medium text-sm px-4 flex items-center gap-2">
                                              <IconUpload /> Upload PDF
                                              <input type="file" className="hidden" accept="application/pdf" onChange={e => e.target.files?.[0] && handleNewsletterPdfUpload(e.target.files[0])} />
                                          </label>
                                      </div>
                                      {editingNewsletter.pdf_url && <a href={editingNewsletter.pdf_url} target="_blank" className="text-xs text-blue-600 mt-2 block hover:underline">View current PDF</a>}
                                 </div>
                                 <div className="pt-4 flex justify-between border-t border-zinc-100 mt-6">
                                      {editingNewsletter.id && <button onClick={() => deleteNewsletter(editingNewsletter.id!)} className="text-red-500 px-4 py-2 hover:bg-red-50 rounded">Delete</button>}
                                      <div className="flex-1"></div>
                                      <button onClick={() => saveNewsletter(editingNewsletter)} className="bg-green-600 text-white px-8 py-2 rounded font-medium hover:bg-green-700">Save</button>
                                 </div>
                             </div>
                        </div>
                    ) : (
                         <div className="space-y-3">
                            {newslettersList.map(n => (
                                <div key={n.id} onClick={() => setEditingNewsletter(n)} className="group bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between hover:border-green-300 hover:shadow-md cursor-pointer transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded flex items-center justify-center font-bold">PDF</div>
                                        <div>
                                            <div className="font-semibold text-zinc-900">{n.title}</div>
                                            <div className="text-xs text-zinc-500 flex gap-2">
                                                <span className="uppercase font-bold">{n.language}</span>
                                                <span>•</span>
                                                <span>{new Date(n.publication_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <IconRight />
                                </div>
                            ))}
                            {newslettersList.length === 0 && <div className="text-center text-zinc-400 py-10">No newsletters found.</div>}
                        </div>
                    )}
                </div>
             </div>
        ) : (
            /* EXISTING PREVIEW & EDITOR LAYOUT */
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
        )}
      </main>
    </div>
  );
}
