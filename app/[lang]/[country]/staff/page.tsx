import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CMSText } from '@/components/cms/cms-text';
import { CMSImage } from '@/components/cms/cms-image';
import { SupportedLanguage } from '@/context/adapt';

export default async function CountryStaffPage(props: { params: Promise<{ lang: string, country: string }> }) {
    const params = await props.params;
    const lang = params.lang as SupportedLanguage;
    const country = (params.country || '').toUpperCase();

    // In a real app, fetch staff filtered by country here from Supabase
    // For now, we simulate country specific leadership structure via CMS keys

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-30 bg-zinc-50 overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-4 flex items-center gap-2 w-fit mx-auto">
                            <img src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`} className="w-4 h-3 rounded-[2px]" alt="Flag"/>
                            <span>Leadership National</span>
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 drop-shadow-sm">
                            <CMSText k="country.staff.title" defaultVal={`Notre Équipe en ${country}`} />
                        </h1>
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                            <CMSText k="country.staff.subtitle" defaultVal="Rencontrez les hommes et les femmes qui portent la vision dans cette nation." />
                        </p>
                    </div>
                </section>

                {/* Staff Grid - Simplified for Country context */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center gap-16">
                            
                            {/* 1. Direction Nationale */}
                            <div className="text-center w-full">
                                <h2 className="text-3xl font-bold text-zinc-900 mb-8 border-b pb-4 mx-auto max-w-xl"><CMSText k="country.staff.section.direction" defaultVal="Direction Nationale" /></h2>
                                <div className="flex flex-col items-center">
                                    <div className="w-64 h-64 relative rounded-full overflow-hidden shadow-xl border-4 border-white mb-6">
                                        <CMSImage 
                                            k="country.staff.director.image"
                                            defaultSrc="https://placehold.co/400x400/981a3c/ffffff?text=Directeur"
                                            alt="Director"
                                            className="w-full h-full object-cover"
                                            fill
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900"><CMSText k="country.staff.director.name" defaultVal="Jean Dupont" /></h3>
                                    <p className="text-[#981a3c] font-bold uppercase tracking-widest text-sm"><CMSText k="country.staff.director.role" defaultVal="Directeur National" /></p>
                                </div>
                            </div>

                            {/* 2. Administration Nationale */}
                            <div className="text-center w-full max-w-4xl">
                                <h2 className="text-2xl font-bold text-zinc-800 mb-8 border-b pb-4 mx-auto max-w-lg"><CMSText k="country.staff.section.admin" defaultVal="Administration Nationale" /></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
                                    <div className="flex flex-col items-center">
                                         <div className="w-40 h-40 relative rounded-xl overflow-hidden shadow-lg mb-4">
                                            <CMSImage k="country.staff.admin.image" defaultSrc="https://placehold.co/300x300?text=Admin" alt="Admin" className="w-full h-full object-cover" fill />
                                        </div>
                                        <h4 className="font-bold text-lg"><CMSText k="country.staff.admin.name" defaultVal="Marie Curie" /></h4>
                                        <p className="text-zinc-500 text-sm"><CMSText k="country.staff.admin.role" defaultVal="Administratrice" /></p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                         <div className="w-40 h-40 relative rounded-xl overflow-hidden shadow-lg mb-4">
                                            <CMSImage k="country.staff.admin_vol.image" defaultSrc="https://placehold.co/300x300?text=Volontaire" alt="Volontaire" className="w-full h-full object-cover" fill />
                                        </div>
                                        <h4 className="font-bold text-lg"><CMSText k="country.staff.admin_vol.name" defaultVal="Lucie Fer" /></h4>
                                        <p className="text-zinc-500 text-sm"><CMSText k="country.staff.admin_vol.role" defaultVal="Volontaire Administration" /></p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Département Ministère */}
                            <div className="text-center w-full max-w-6xl">
                                <h2 className="text-2xl font-bold text-zinc-800 mb-10 border-b pb-4 mx-auto max-w-lg"><CMSText k="country.staff.section.dept" defaultVal="Département Ministère" /></h2>
                                
                                {/* Leadership Département */}
                                <div className="flex flex-wrap justify-center gap-10 mb-12">
                                     <div className="flex flex-col items-center w-48">
                                         <div className="w-32 h-32 relative rounded-full overflow-hidden shadow mb-3 border-2 border-zinc-100">
                                            <CMSImage k="country.staff.dept_dir.image" defaultSrc="https://placehold.co/300x300?text=Dir+Dept" alt="Dir Dept" className="w-full h-full object-cover" fill />
                                        </div>
                                        <h4 className="font-bold"><CMSText k="country.staff.dept_dir.name" defaultVal="Pierre Martin" /></h4>
                                        <p className="text-zinc-500 text-xs"><CMSText k="country.staff.dept_dir.role" defaultVal="Directeur Département" /></p>
                                    </div>
                                     <div className="flex flex-col items-center w-48">
                                         <div className="w-32 h-32 relative rounded-full overflow-hidden shadow mb-3 border-2 border-zinc-100">
                                            <CMSImage k="country.staff.dept_sec.image" defaultSrc="https://placehold.co/300x300?text=Sec" alt="Sec" className="w-full h-full object-cover" fill />
                                        </div>
                                        <h4 className="font-bold"><CMSText k="country.staff.dept_sec.name" defaultVal="Sophie Germain" /></h4>
                                        <p className="text-zinc-500 text-xs"><CMSText k="country.staff.dept_sec.role" defaultVal="Secrétaire Administratif" /></p>
                                    </div>
                                </div>

                                {/* Coordonnateurs */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    {[
                                        { id: 'kbn', title: 'KBN', name: 'Alain Delon' },
                                        { id: 'mbe', title: 'MBE', name: 'Brigitte Bardot' },
                                        { id: 'jca', title: 'JCA', name: 'Claude François' }
                                    ].map((dept) => (
                                        <div key={dept.id} className="bg-zinc-50 p-6 rounded-2xl">
                                            <h3 className="font-bold text-[#981a3c] mb-4 border-b border-zinc-200 pb-2">Coordination {dept.title}</h3>
                                            <div className="flex flex-col items-center mb-4">
                                                <div className="w-20 h-20 rounded-full bg-zinc-200 mb-2 overflow-hidden">
                                                    <CMSImage k={`country.staff.${dept.id}_lead.image`} defaultSrc={`https://placehold.co/200x200?text=${dept.title}`} alt={dept.title} className="w-full h-full object-cover" width={80} height={80} />
                                                </div>
                                                <div className="font-bold text-sm"><CMSText k={`country.staff.${dept.id}_lead.name`} defaultVal={dept.name} /></div>
                                                <div className="text-xs text-zinc-500">Coordonnateur</div>
                                            </div>
                                            <div className="text-xs text-zinc-400 italic">
                                                + <CMSText k={`country.staff.${dept.id}_vols`} defaultVal="Équipe de volontaires" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Logistique */}
                                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                                   <div className="flex flex-col items-center">
                                        <div className="font-bold text-zinc-700"><CMSText k="country.staff.library.name" defaultVal="Emile Zola" /></div>
                                        <p className="text-zinc-500 text-xs uppercase tracking-wide"><CMSText k="country.staff.library.role" defaultVal="Responsable Bibliothèque" /></p>
                                   </div>
                                   <div className="flex flex-col items-center">
                                        <div className="font-bold text-zinc-700"><CMSText k="country.staff.stock.name" defaultVal="Jules Verne" /></div>
                                        <p className="text-zinc-500 text-xs uppercase tracking-wide"><CMSText k="country.staff.stock.role" defaultVal="Responsable Stocks" /></p>
                                   </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
