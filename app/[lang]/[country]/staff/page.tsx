import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CMSText } from '@/components/cms/cms-text';
import { CMSImage } from '@/components/cms/cms-image';
import { CMSService } from '@/services/supabase.conf';
import { CMSProvider } from '@/components/cms/cms-provider';
import { CMSVideo } from '@/components/cms/cms-video';
import { SupportedLanguage } from '@/context/adapt';

// ── Flag gradient helper ──────────────────────────────────────────────────────
const getFlagGradient = (code: string) => {
    const map: Record<string, string> = {
        HT: 'from-[#00209F] to-[#D21034]',
        GP: 'from-[#fcd116] via-[#000000] to-[#ce1126]',
        MQ: 'from-[#ce1126] via-[#000000] to-[#009b3a]',
        SX: 'from-[#ed2939] to-[#00247d]',
        GF: 'from-[#fcd116] to-[#009b3a]',
    };
    return map[code] || 'from-zinc-500 to-zinc-700';
};

// ── Connector component ───────────────────────────────────────────────────────
function OrgConnector({ bg = 'bg-white' }: { bg?: string }) {
    return (
        <div className={`flex justify-center py-1 ${bg}`}>
            <div className="flex flex-col items-center">
                <div className="w-px h-10 bg-[#981a3c]/30" />
                <div className="w-3 h-3 rounded-full bg-[#981a3c]" />
                <div className="w-px h-10 bg-[#981a3c]/30" />
            </div>
        </div>
    );
}

export default async function CountryStaffPage(props: { params: Promise<{ lang: string, country: string }> }) {
    const params = await props.params;
    const lang = params.lang as SupportedLanguage;
    const country = (params.country || '').toUpperCase();
    const dictionary = await CMSService.getPageContent('staff', lang, country);
    const flagGradient = getFlagGradient(country);

    return (
        <CMSProvider dictionary={dictionary}>
        <div className="flex min-h-screen flex-col bg-[#f7f7f2] font-sans">
            <Header />
            
            <main className="flex-1">

                {/* ── HERO ──────────────────────────────────────────────────────── */}
                <section className="relative min-h-[65vh] flex items-end overflow-hidden bg-zinc-950">
                    <div className="absolute inset-0" data-cms-key="country.staff.hero.bg">
                        <CMSImage
                            k="country.staff.hero.bg"
                            defaultSrc="/images/Haiti_staffs/promotional/IMG_8226.JPG"
                            alt=""
                            fill
                            className="w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20 pointer-events-none" />
                        <div className="absolute inset-0 bg-linear-to-r from-[#981a3c]/20 to-transparent pointer-events-none" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 pb-20 pt-44 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-end gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-5">
                                    <img
                                        src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
                                        className="h-6 w-auto rounded shadow-lg"
                                        alt={`Drapeau ${country}`}
                                    />
                                    <span className="text-white/60 text-xs font-black uppercase tracking-[0.3em]">
                                        <CMSText k="country.staff.badge" defaultVal="Leadership · Équipe Nationale" />
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-none mb-4">
                                    <CMSText k="country.staff.title" defaultVal="Notre Équipe" />
                                    <span className={`block text-transparent bg-clip-text bg-linear-to-r ${flagGradient}`}>
                                        <CMSText k="country.staff.title_country" defaultVal={`en ${country}`} />
                                    </span>
                                </h1>
                                <p className="text-white/70 text-lg max-w-xl leading-relaxed">
                                    <CMSText k="country.staff.subtitle" defaultVal="Rencontrez les hommes et les femmes qui portent la vision de l'AEE dans cette nation avec fidélité et passion." />
                                </p>
                            </div>
                            <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center shadow-xl">
                                <div className="text-5xl font-black text-white mb-1">
                                    <CMSText k="country.staff.hero.count" defaultVal="12+" />
                                </div>
                                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    <CMSText k="country.staff.hero.count_label" defaultVal="Collaborateurs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── ORG CHART ─────────────────────────────────────────────────── */}

                {/* ── 1. DIRECTION NATIONALE ── */}
                <section className="py-20 bg-white border-b border-zinc-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-14">
                            <span className="inline-block text-[#981a3c] text-[10px] font-black uppercase tracking-[0.35em] mb-3">01 · Organigramme</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">
                                <CMSText k="country.staff.section.direction" defaultVal="Direction Nationale" />
                            </h2>
                            <div className="w-16 h-1 bg-[#981a3c] mx-auto mt-4 rounded-full" />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <div className="group relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-950">
                                <div className="aspect-3/4 relative" data-cms-key="country.staff.director.image">
                                    <CMSImage
                                        k="country.staff.director.image"
                                        defaultSrc="https://pfijkpxlsbyepxhwjsep.supabase.co/storage/v1/object/public/static/cms/1771455758393.jpeg"
                                        alt="Directeur National"
                                        fill
                                        className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="inline-block px-3 py-1 rounded-full bg-[#981a3c] text-white text-[10px] font-black uppercase tracking-widest mb-3">
                                        <CMSText k="country.staff.director.role" defaultVal="Directeur National" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-white">
                                        <CMSText k="country.staff.director.name" defaultVal="Guy Pierre Chavannes" />
                                    </h3>
                                    <p className="text-white/60 text-sm mt-2">
                                        <CMSText k="country.staff.director.bio" defaultVal="Visionnaire et pilier de notre mission dans le pays." />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <OrgConnector bg="bg-[#f7f7f2]" />

                {/* ── 2. ADMINISTRATION NATIONALE ── */}
                <section className="py-20 bg-[#f7f7f2] border-b border-zinc-200">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-14">
                            <span className="inline-block text-[#981a3c] text-[10px] font-black uppercase tracking-[0.35em] mb-3">02 · Organigramme</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
                                <CMSText k="country.staff.section.admin" defaultVal="Administration Nationale" />
                            </h2>
                            <div className="w-12 h-1 bg-[#981a3c] mx-auto mt-3 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            <StaffCard
                                imgKey="country.staff.admin.image"
                                defaultImg="/images/Haiti_staffs/Marceline%20Justima%20%5BAdministratrice%5D.jpg"
                                nameKey="country.staff.admin.name"
                                defaultName="Marceline Justima"
                                roleKey="country.staff.admin.role"
                                defaultRole="Administratrice"
                            />
                            <StaffCard
                                imgKey="country.staff.admin_vol.image"
                                defaultImg="/images/Haiti_staffs/Tayana%20Pierre%20Gilles%20%5BSecretaire%5D.JPG"
                                nameKey="country.staff.admin_vol.name"
                                defaultName="Tayana Pierre Gilles"
                                roleKey="country.staff.admin_vol.role"
                                defaultRole="Secrétaire / Volontaire Admin."
                            />
                        </div>
                    </div>
                </section>

                <OrgConnector bg="bg-white" />

                {/* ── 3. DÉPARTEMENT MINISTÈRE ── */}
                <section className="py-20 bg-white border-b border-zinc-100">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-14">
                            <span className="inline-block text-[#981a3c] text-[10px] font-black uppercase tracking-[0.35em] mb-3">03 · Organigramme</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
                                <CMSText k="country.staff.section.dept" defaultVal="Département Ministère" />
                            </h2>
                            <div className="w-12 h-1 bg-[#981a3c] mx-auto mt-3 rounded-full" />
                        </div>

                        {/* Leadership */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
                            <StaffCard
                                imgKey="country.staff.dept_dir.image"
                                defaultImg="/images/Haiti_staffs/Guersie%20St-Simon%20Noel%20%5BResp.%20des%20Ministeres%5D.JPG"
                                nameKey="country.staff.dept_dir.name"
                                defaultName="Guersie St-Simon Noël"
                                roleKey="country.staff.dept_dir.role"
                                defaultRole="Resp. des Ministères"
                            />
                            <StaffCard
                                imgKey="country.staff.dept_sec.image"
                                defaultImg="/images/Haiti_staffs/Wonsler%20Samedy%20%5BResp.%20Communication%5D.jpg"
                                nameKey="country.staff.dept_sec.name"
                                defaultName="Wonsler Samedy"
                                roleKey="country.staff.dept_sec.role"
                                defaultRole="Resp. Communication"
                            />
                        </div>

                        {/* Coordonnateurs divider */}
                        <div className="flex items-center gap-4 max-w-4xl mx-auto mb-10">
                            <div className="h-px flex-1 bg-zinc-200" />
                            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <CMSText k="country.staff.dept.coord_label" defaultVal="Coordonnateurs" />
                            </span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        {/* KBN / MBE / JCA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            <CoordCard
                                accent="#00209F"
                                bgImgKey="country.staff.kbn_bg"
                                defaultBg="/images/Haiti_staffs/in%20action/C5D.JPG"
                                labelKey="country.staff.kbn.label"
                                defaultLabel="Coordination KBN"
                                imgKey="country.staff.kbn_lead.image"
                                defaultImg="/images/Haiti_staffs/Yvelor%20Thine%20Joseph%20%5BResp.%20KBN%5D.JPG"
                                nameKey="country.staff.kbn_lead.name"
                                defaultName="Yvelor Thine Joseph"
                                roleKey="country.staff.kbn_lead.role"
                                defaultRole="Resp. KBN"
                                volsKey="country.staff.kbn_vols"
                                defaultVols="Équipe de volontaires"
                            />
                            <CoordCard
                                accent="#981a3c"
                                bgImgKey="country.staff.mbe_bg"
                                defaultBg="/images/Haiti_staffs/in%20action/MBE.jpg"
                                labelKey="country.staff.mbe.label"
                                defaultLabel="Coordination MBE"
                                imgKey="country.staff.mbe_lead.image"
                                defaultImg="/images/Haiti_staffs/Venuse%20Maille%20Alexandre%20%5BResp.%20MBE%5D.JPG"
                                nameKey="country.staff.mbe_lead.name"
                                defaultName="Venuse Maille Alexandre"
                                roleKey="country.staff.mbe_lead.role"
                                defaultRole="Resp. MBE"
                                volsKey="country.staff.mbe_vols"
                                defaultVols="Carolle Saintal · Gertroe Joseph"
                            />
                            <CoordCard
                                accent="#1a7a3c"
                                bgImgKey="country.staff.jca_bg"
                                defaultBg="/images/Haiti_staffs/in%20action/JCA.jpg"
                                labelKey="country.staff.jca.label"
                                defaultLabel="Coordination JCA"
                                imgKey="country.staff.jca_lead.image"
                                defaultImg="/images/Haiti_staffs/in%20action/JCA_1.jpg"
                                nameKey="country.staff.jca_lead.name"
                                defaultName="Coordonnateur JCA"
                                roleKey="country.staff.jca_lead.role"
                                defaultRole="Resp. JCA"
                                volsKey="country.staff.jca_vols"
                                defaultVols="Équipe de volontaires"
                            />
                        </div>

                        {/* Logistique divider */}
                        <div className="flex items-center gap-4 max-w-4xl mx-auto mb-10">
                            <div className="h-px flex-1 bg-zinc-200" />
                            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <CMSText k="country.staff.dept.logistics_label" defaultVal="Logistique" />
                            </span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        {/* Bibliothèque + Stocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            <StaffCard
                                imgKey="country.staff.library.image"
                                defaultImg="/images/Haiti_staffs/Kettelie%20Jarbouin%20Eliasme%20%5BResp.%20Bibliotheque%5D.JPG"
                                nameKey="country.staff.library.name"
                                defaultName="Kettelie Jarbouin Eliasme"
                                roleKey="country.staff.library.role"
                                defaultRole="Responsable Bibliothèque"
                            />
                            <StaffCard
                                imgKey="country.staff.stock.image"
                                defaultImg="/images/Haiti_staffs/Kechny%20Hilaire%20%5BResp.%20logistique%20et%20messager%5D.JPG"
                                nameKey="country.staff.stock.name"
                                defaultName="Kechny Hilaire"
                                roleKey="country.staff.stock.role"
                                defaultRole="Resp. Logistique & Stocks"
                            />
                        </div>
                    </div>
                </section>

                {/* ── 4. GALERIE EN ACTION ─────────────────────────────────────── */}
                <section className="py-20 bg-zinc-950 overflow-hidden" id="galerie">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-12">
                            <span className="inline-block text-[#981a3c] text-[10px] font-black uppercase tracking-[0.35em] mb-3">Galerie</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                <CMSText k="country.staff.gallery.title" defaultVal="L'Équipe en Action" />
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {([
                                { key: 'country.staff.gallery.img1', def: '/images/Haiti_staffs/in%20action/C5D.JPG', wide: true },
                                { key: 'country.staff.gallery.img2', def: '/images/Haiti_staffs/in%20action/JCA.jpg', wide: false },
                                { key: 'country.staff.gallery.img3', def: '/images/Haiti_staffs/in%20action/MBE.jpg', wide: false },
                                { key: 'country.staff.gallery.img4', def: '/images/Haiti_staffs/promotional/IMG_8226.JPG', wide: false },
                                { key: 'country.staff.gallery.img5', def: '/images/Haiti_staffs/promotional/IMG_3779.JPG', wide: true },
                                { key: 'country.staff.gallery.img6', def: '/images/Haiti_staffs/in%20action/IMG_0308.JPG', wide: false },
                            ] as const).map(({ key, def, wide }, i) => (
                                <div key={i} className={`relative overflow-hidden rounded-2xl group ${wide ? 'md:col-span-2' : ''} aspect-square`}>
                                    <CMSImage k={key} defaultSrc={def} alt="" fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 5. VIDÉOS ──────────────────────────────────────────────── */}
                <section className="py-20 bg-white border-b border-zinc-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-12">
                            <span className="inline-block text-[#981a3c] text-[10px] font-black uppercase tracking-[0.35em] mb-3">Vidéos</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
                                <CMSText k="country.staff.videos.title" defaultVal="Nos Vidéos Promotionnelles" />
                            </h2>
                            <p className="text-zinc-500 mt-2 max-w-xl mx-auto text-sm">
                                <CMSText k="country.staff.videos.subtitle" defaultVal="Découvrez notre travail au travers de ces témoignages visuels." />
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <VideoCard
                                videoUrlKey="country.staff.video1.url"
                                defaultVideoUrl="https://pfijkpxlsbyepxhwjsep.supabase.co/storage/v1/object/public/static/haiti/videos/AEE_Promo%20Super%20Seminaire.mp4"
                                titleKey="country.staff.video1.title"
                                defaultTitle="Super Séminaire"
                                descKey="country.staff.video1.desc"
                                defaultDesc="Découvrez notre grand séminaire de formation et d'inspiration."
                            />
                            <VideoCard
                                videoUrlKey="country.staff.video2.url"
                                defaultVideoUrl="https://pfijkpxlsbyepxhwjsep.supabase.co/storage/v1/object/public/static/haiti/videos/AEE_Promo%20Materiels.mp4"
                                titleKey="country.staff.video2.title"
                                defaultTitle="Nos Matériels"
                                descKey="country.staff.video2.desc"
                                defaultDesc="Aperçu des ressources pédagogiques et matériels utilisés sur le terrain."
                            />
                            <VideoCard
                                videoUrlKey="country.staff.video3.url"
                                defaultVideoUrl="https://pfijkpxlsbyepxhwjsep.supabase.co/storage/v1/object/public/static/haiti/videos/AEE_Promo%20KBN.mp4"
                                titleKey="country.staff.video3.title"
                                defaultTitle="Club de la Bonne Nouvelle (KBN)"
                                descKey="country.staff.video3.desc"
                                defaultDesc="Le KBN en action : présentation de notre club biblique hebdomadaire."
                            />
                            <VideoCard
                                videoUrlKey="country.staff.video4.url"
                                defaultVideoUrl="https://pfijkpxlsbyepxhwjsep.supabase.co/storage/v1/object/public/static/haiti/videos/AEE_Promo%20KATAK1.mp4"
                                titleKey="country.staff.video4.title"
                                defaultTitle="Formation KATAK — Moniteurs"
                                descKey="country.staff.video4.desc"
                                defaultDesc="Le programme KATAK1 : formation et équipement de nos moniteurs bénévoles."
                            />
                        </div>
                    </div>
                </section>

                {/* ── 6. CTA ──────────────────────────────────────────────────── */}
                <section className="py-20 bg-[#981a3c] text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <div className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            <CMSText k="country.staff.cta.title" defaultVal={`Rejoignez l'équipe en ${country}`} />
                        </h2>
                        <p className="text-pink-100 mb-8 text-lg leading-relaxed">
                            <CMSText k="country.staff.cta.desc" defaultVal="Votre place vous attend. Engagez-vous dès aujourd'hui aux côtés de notre équipe." />
                        </p>
                        <a
                            href={`/${lang}/implicate`}
                            className="inline-block bg-white text-[#981a3c] font-extrabold py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform"
                        >
                            <CMSText k="country.staff.cta.btn" defaultVal="S'impliquer maintenant" />
                        </a>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
        </CMSProvider>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StaffCard({
    imgKey, defaultImg,
    nameKey, defaultName,
    roleKey, defaultRole,
}: {
    imgKey: string; defaultImg: string;
    nameKey: string; defaultName: string;
    roleKey: string; defaultRole: string;
}) {
    return (
        <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* data-cms-key on the wrapper so right-click works even with overlays */}
            <div className="w-full aspect-4/5 relative overflow-hidden" data-cms-key={imgKey}>
                <CMSImage
                    k={imgKey}
                    defaultSrc={defaultImg}
                    alt={defaultName}
                    fill
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-900/10 to-transparent pointer-events-none" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <p className="text-[#e8a0b0] text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                    <CMSText k={roleKey} defaultVal={defaultRole} />
                </p>
                <h4 className="text-white font-extrabold text-lg leading-tight">
                    <CMSText k={nameKey} defaultVal={defaultName} />
                </h4>
            </div>
        </div>
    );
}

function CoordCard({
    accent,
    bgImgKey, defaultBg,
    labelKey, defaultLabel,
    imgKey, defaultImg,
    nameKey, defaultName,
    roleKey, defaultRole,
    volsKey, defaultVols,
}: {
    accent: string;
    bgImgKey: string; defaultBg: string;
    labelKey: string; defaultLabel: string;
    imgKey: string; defaultImg: string;
    nameKey: string; defaultName: string;
    roleKey: string; defaultRole: string;
    volsKey: string; defaultVols: string;
}) {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 group min-h-80">
            {/* data-cms-key on wrapper so overlays don't block right-click */}
            <div className="absolute inset-0" data-cms-key={bgImgKey}>
                <CMSImage
                    k={bgImgKey}
                    defaultSrc={defaultBg}
                    alt=""
                    fill
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${accent}f5 0%, ${accent}99 50%, rgba(0,0,0,0.3) 100%)` }}
                />
            </div>
            <div className="relative z-10 p-6 flex flex-col items-center text-center h-full justify-end pt-20">
                <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-xl border-4 border-white mb-3 bg-zinc-200" data-cms-key={imgKey}>
                    <CMSImage
                        k={imgKey}
                        defaultSrc={defaultImg}
                        alt={defaultName}
                        fill
                        className="w-full h-full object-cover object-top"
                    />
                </div>
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">
                    <CMSText k={labelKey} defaultVal={defaultLabel} />
                </span>
                <h4 className="text-white font-extrabold text-base leading-tight">
                    <CMSText k={nameKey} defaultVal={defaultName} />
                </h4>
                <p className="text-white/70 text-xs mt-0.5 mb-4">
                    <CMSText k={roleKey} defaultVal={defaultRole} />
                </p>
                <div className="w-full bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white/70 text-xs italic border border-white/10">
                    + <CMSText k={volsKey} defaultVal={defaultVols} />
                </div>
            </div>
        </div>
    );
}

function VideoCard({
    videoUrlKey,
    defaultVideoUrl,
    titleKey, defaultTitle,
    descKey, defaultDesc,
}: {
    videoUrlKey: string;
    defaultVideoUrl: string;
    titleKey: string; defaultTitle: string;
    descKey: string; defaultDesc: string;
}) {
    return (
        <div className="group rounded-3xl overflow-hidden bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-zinc-950">
                <CMSVideo
                    k={videoUrlKey}
                    defaultSrc={defaultVideoUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-6 flex flex-col gap-1">
                <h4 className="text-white font-extrabold text-base leading-tight">
                    <CMSText k={titleKey} defaultVal={defaultTitle} />
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    <CMSText k={descKey} defaultVal={defaultDesc} />
                </p>
            </div>
        </div>
    );
}
