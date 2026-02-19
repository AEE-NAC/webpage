import React from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { SupportedLanguage } from '../../../context/adapt';
import { CMSProvider } from '../../../components/cms/cms-provider';
import { CMSService } from '../../../services/supabase.conf';

// ─── Données statiques des clubs ────────────────────────────────────────────

interface ClubData {
  id: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  badgeKey: string;
  defaultBadge: string;
  logoKey: string;
  logoDefaultSrc: string;
  bgKey: string;
  bgDefaultSrc: string;
  accentColor: string;
}

const STATIC_CLUBS: ClubData[] = [
  {
    id: 'cbn',
    titleKey: 'ministry.club.cbn.title',
    defaultTitle: 'Club de la Bonne Nouvelle (CBN)',
    descKey: 'ministry.club.cbn.desc',
    defaultDesc:
      "Club biblique hebdomadaire pour les enfants de 4 à 11 ans. Chaque séance d'une heure comprend une leçon visualisée, des chants, la mémorisation de versets, un moment missionnaire et des jeux de révision.",
    badgeKey: 'ministry.club.cbn.badge',
    defaultBadge: '4–11 ans • Hebdomadaire',
    logoKey: 'ministry.club.cbn.logo',
    logoDefaultSrc: '/images/Good-News-Club-Logo-Transp-Comp.webp',
    bgKey: 'ministry.club.cbn.bg',
    bgDefaultSrc: '/images/CBN_guadeloupe.jpeg',
    accentColor: '#981a3c',
  },
  {
    id: 'c5j',
    titleKey: 'ministry.club.c5j.title',
    defaultTitle: 'Club des 5 Jours',
    descKey: 'ministry.club.c5j.desc',
    defaultDesc:
      "Version estivale et intensive du ministère : cinq séances consécutives en plein air (parcs, plages, jardins). Un programme condensé pour présenter le message du salut de manière percutante en une semaine.",
    badgeKey: 'ministry.club.c5j.badge',
    defaultBadge: 'Été • 5 jours consécutifs',
    logoKey: 'ministry.club.c5j.logo',
    logoDefaultSrc: '/images/ENGLISH-5DC-LOGO-COLOR-v1-0.png.webp',
    bgKey: 'ministry.club.c5j.bg',
    bgDefaultSrc: '/images/CBN_haiti.jpeg',
    accentColor: '#1a6498',
  },
  {
    id: 'jyc',
    titleKey: 'ministry.club.jyc.title',
    defaultTitle: 'Club Junior (JYC)',
    descKey: 'ministry.club.jyc.desc',
    defaultDesc:
      "Le Junior Youth Challenge s'adresse aux 11–15 ans. Dans un environnement sécurisant, les jeunes découvrent comment la Bible répond à leurs questions avec discussions profondes, musique moderne et camaraderie.",
    badgeKey: 'ministry.club.jyc.badge',
    defaultBadge: '11–15 ans • Hebdomadaire',
    logoKey: 'ministry.club.jyc.logo',
    logoDefaultSrc: '/images/JYC-horizontal-1.webp',
    bgKey: 'ministry.club.jyc.bg',
    bgDefaultSrc: '/images/font_1.jpg',
    accentColor: '#1a7a3c',
  },
  {
    id: 'cbv',
    titleKey: 'ministry.club.cbv.title',
    defaultTitle: 'Club Biblique de Vacances',
    descKey: 'ministry.club.cbv.desc',
    defaultDesc:
      "Pendant une semaine de vacances scolaires, ce club propose des sessions de deux heures combinant leçon biblique, travaux manuels, activités sportives et temps de rafraîchissement. Idéal pour rejoindre les familles du quartier.",
    badgeKey: 'ministry.club.cbv.badge',
    defaultBadge: 'Vacances scolaires',
    logoKey: 'ministry.club.cbv.logo',
    logoDefaultSrc: '/images/CAMP-GPOOD-NEWS-LOGO-COLOR-v1-0.png.webp',
    bgKey: 'ministry.club.cbv.bg',
    bgDefaultSrc: '/images/font_2.jpg',
    accentColor: '#b86a1a',
  },
  {
    id: 'noel_paques',
    titleKey: 'ministry.club.noel.title',
    defaultTitle: 'Clubs de Noël & Pâques',
    descKey: 'ministry.club.noel.desc',
    defaultDesc:
      "Événements d'une seule séance autour des grandes fêtes chrétiennes. Des kits clé en main (\"Aventure sur la banquise\" pour Noël, kit Pâques) incluent invitations, leçons visualisées, quiz et idées de bricolage.",
    badgeKey: 'ministry.club.noel.badge',
    defaultBadge: 'Noël & Pâques • Saisonnier',
    logoKey: 'ministry.club.noel.logo',
    logoDefaultSrc: '/images/ChristmasPartyClub-CL-Colored.png.webp',
    bgKey: 'ministry.club.noel.bg',
    bgDefaultSrc: '/images/font_3.jpg',
    accentColor: '#981a3c',
  },
  {
    id: 'mbe',
    titleKey: 'ministry.club.mbe.title',
    defaultTitle: 'MBE – Ministère Biblique dans les Écoles',
    descKey: 'ministry.club.mbe.desc',
    defaultDesc:
      "Interventions directement au sein des établissements scolaires : assemblées thématiques (Noël, Pâques), cours d'éducation religieuse et partenariats locaux. Un pont unique entre l'école et la Bonne Nouvelle.",
    badgeKey: 'ministry.club.mbe.badge',
    defaultBadge: 'Milieu scolaire',
    logoKey: 'ministry.club.mbe.logo',
    logoDefaultSrc: '/images/MBE LOGO.png',
    bgKey: 'ministry.club.mbe.bg',
    bgDefaultSrc: '/images/font_5.jpg',
    accentColor: '#2d4a8a',
  },
  {
    id: 'cfa',
    titleKey: 'ministry.club.cfa.title',
    defaultTitle: "CFA – Clubs de Fin d'Année",
    descKey: 'ministry.club.cfa.desc',
    defaultDesc:
      "Les Clubs de Fin d'Année offrent une occasion festive et mémorable pour célébrer, partager et présenter l'Évangile à la clôture de chaque saison. Un moment de joie partagée avec les enfants et leurs familles.",
    badgeKey: 'ministry.club.cfa.badge',
    defaultBadge: "Fin d'année scolaire",
    logoKey: 'ministry.club.cfa.logo',
    logoDefaultSrc: '/images/CFA R LOGO.png',
    bgKey: 'ministry.club.cfa.bg',
    bgDefaultSrc: '/images/aee.jpg',
    accentColor: '#7a1a98',
  },

];

// ─── Données des formations ──────────────────────────────────────────────────

const FORMATIONS = [
  {
    id: 'tce',
    titleKey: 'ministry.formation.tce.title',
    defaultTitle: 'TCE / CPC – Cours de Pédagogie Chrétienne',
    descKey: 'ministry.formation.tce.desc',
    defaultDesc:
      "Formation intensive de 30 h par niveau pour apprendre à évangéliser et édifier les enfants. Niveau 1 : présenter l'Évangile. Niveau 2 : accompagner la croissance spirituelle.",
    iconKey: 'ministry.formation.tce.icon',
    defaultIcon: '📖',
  },
  {
    id: 'cyia',
    titleKey: 'ministry.formation.cyia.title',
    defaultTitle: 'CYIA – Christian Youth In Action',
    descKey: 'ministry.formation.cyia.desc',
    defaultDesc:
      "Programme pour jeunes dès 12 ans : une à deux semaines de formation intensive pour diriger des clubs des 5 Jours. Quatre niveaux progressifs pour développer des compétences de leadership.",
    iconKey: 'ministry.formation.cyia.icon',
    defaultIcon: '🌟',
  },
  {
    id: 'parole',
    titleKey: 'ministry.formation.parole.title',
    defaultTitle: 'Parole par Poste',
    descKey: 'ministry.formation.parole.desc',
    defaultDesc:
      "Cours par correspondance : les enfants reçoivent des fiches bibliques, les remplissent et les renvoient pour correction et prière personnalisée. Un lien durable entre l'enfant et l'équipe de l'AEE.",
    iconKey: 'ministry.formation.parole.icon',
    defaultIcon: '✉️',
  },
];

export default async function MinistryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as SupportedLanguage;

  const dictionary = await CMSService.getPageContent('ministry', lang);

  return (
    <CMSProvider dictionary={dictionary}>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />

        <main className="flex-1">

          {/* ── HERO ───────────────────────────────────────────────────────── */}
          <section className="relative py-28 overflow-hidden bg-zinc-950">
            <div className="absolute inset-0">
              <CMSImage
                k="ministry.hero.bg"
                defaultSrc="/images/CBN_guadeloupe.jpeg"
                alt="Hero background"
                fill
                className="w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950/90" />
            </div>
            <div className="relative z-10 container mx-auto px-4 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#981a3c]/20 text-[#e05070] text-xs font-bold uppercase tracking-widest mb-6 border border-[#981a3c]/30">
                <CMSText k="ministry.hero.badge" defaultVal="Nos Ministères" />
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                <CMSText k="ministry.hero.title" defaultVal="Porter l'Espoir" />{' '}
                <span className="text-[#e05070]">
                  <CMSText k="ministry.hero.title2" defaultVal="à Chaque Enfant" />
                </span>
              </h1>
              <div className="w-20 h-1 bg-[#981a3c] mx-auto rounded-full mb-8" />
              <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                <CMSText
                  k="ministry.hero.subtitle"
                  defaultVal="Depuis 1937, le CEF et l'AEE accompagnent des millions d'enfants dans leur découverte de la foi à travers des clubs adaptés à chaque âge et chaque contexte."
                />
              </p>
            </div>
          </section>

          {/* ── CONTEXTE / HISTOIRE ────────────────────────────────────────── */}
          <section className="py-20 bg-zinc-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <div className="space-y-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#981a3c]/10 text-[#981a3c] text-xs font-bold uppercase tracking-widest">
                    <CMSText k="ministry.history.badge" defaultVal="Notre Héritage" />
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 leading-tight">
                    <CMSText k="ministry.history.title" defaultVal="Une mission enracinée dans la conviction que chaque enfant compte" />
                  </h2>
                  <CMSText
                    as="p"
                    k="ministry.history.p1"
                    className="text-zinc-600 text-lg leading-relaxed"
                    defaultVal="Fondé en 1937 par Jesse Irvin Overholtzer, le Child Evangelism Fellowship (CEF) est aujourd'hui présent dans 192 pays et touche plus de 19,9 millions d'enfants chaque année. En France, l'Association Évangile & Enfance (AEE) incarne cette mission en accompagnant les églises locales dans leurs projets de ministère auprès des enfants."
                  />
                  <CMSText
                    as="p"
                    k="ministry.history.p2"
                    className="text-zinc-600 text-lg leading-relaxed"
                    defaultVal="Nos clubs sont bien plus que des activités : ce sont des espaces de paix, d'apprentissage et de transformation où l'enfant découvre la bonne nouvelle d'une manière qu'il peut comprendre et vivre."
                  />
                  {/* Wordless Book colour palette */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { color: '#FFD700', cmsKey: 'ministry.history.wb.gold',   defaultLabel: 'Or — Sainteté de Dieu', dark: true },
                      { color: '#1a1a1a', cmsKey: 'ministry.history.wb.black',  defaultLabel: 'Noir — Le péché',       dark: false },
                      { color: '#cc0000', cmsKey: 'ministry.history.wb.red',    defaultLabel: 'Rouge — Sang du Christ', dark: false },
                      { color: '#f5f5f5', cmsKey: 'ministry.history.wb.white',  defaultLabel: 'Blanc — Cœur purifié',  dark: true, border: true },
                      { color: '#2d8a45', cmsKey: 'ministry.history.wb.green',  defaultLabel: 'Vert — Croissance',     dark: false },
                    ].map((item) => (
                      <span
                        key={item.cmsKey}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: item.color,
                          color: item.dark ? '#1a1a1a' : '#fff',
                          border: item.border ? '1px solid #d1d5db' : undefined,
                        }}
                      >
                        <CMSText k={item.cmsKey} defaultVal={item.defaultLabel} />
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 italic">
                    <CMSText k="ministry.history.wordless_caption" defaultVal="Le Livre sans Paroles — outil pédagogique central de toutes nos formations." />
                  </p>
                </div>

                <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <CMSImage
                    k="ministry.history.image"
                    defaultSrc="/images/CBN_haiti.jpeg"
                    alt="Ministère en action"
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── CLUBS GRID ─────────────────────────────────────────────────── */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-20">
                <span className="inline-block px-3 py-1 rounded-full bg-[#981a3c]/10 text-[#981a3c] text-xs font-bold uppercase tracking-widest mb-4">
                  <CMSText k="ministry.clubs.badge" defaultVal="Nos Clubs" />
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-4">
                  <CMSText k="ministry.clubs.title" defaultVal="Des Programmes pour Chaque Enfant" />
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                  <CMSText
                    k="ministry.clubs.subtitle"
                    defaultVal="Chaque club est adapté à un âge, une saison ou un contexte spécifique. Ensemble, ils forment un écosystème complet pour rejoindre les enfants là où ils sont."
                  />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {STATIC_CLUBS.map((club) => (
                  <ClubCard key={club.id} club={club} lang={lang} />
                ))}
              </div>
            </div>
          </section>

          {/* ── FORMATIONS ─────────────────────────────────────────────────── */}
          <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-[#981a3c]/10 text-[#981a3c] text-xs font-bold uppercase tracking-widest mb-4">
                  <CMSText k="ministry.formation.badge" defaultVal="Se Former" />
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4">
                  <CMSText k="ministry.formation.title" defaultVal="Un Écosystème de Formation Complet" />
                </h2>
                <p className="text-zinc-500 max-w-xl mx-auto">
                  <CMSText
                    k="ministry.formation.subtitle"
                    defaultVal="L'efficacité de nos clubs repose sur la qualité de la formation de nos moniteurs. Nous proposons des parcours certifiants reconnus internationalement."
                  />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {FORMATIONS.map((f) => (
                  <div key={f.id} className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4"><CMSText k={f.iconKey} defaultVal={f.defaultIcon} /></div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">
                      <CMSText k={f.titleKey} defaultVal={f.defaultTitle} />
                    </h3>
                    <p className="text-zinc-500 leading-relaxed text-sm">
                      <CMSText k={f.descKey} defaultVal={f.defaultDesc} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── APPEL À DEVENIR MONITEUR ───────────────────────────────────── */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
                {/* Image side */}
                <div className="relative min-h-80 lg:min-h-full">
                  <CMSImage
                    k="ministry.moniteur.image"
                    defaultSrc="/images/signup.jpg"
                    alt="Devenir moniteur"
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-900/30 lg:bg-linear-to-l" />
                </div>

                {/* Text side */}
                <div className="bg-zinc-900 text-white p-10 md:p-14 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#981a3c]/20 text-[#e05070] text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-[#981a3c]/30">
                    <CMSText k="ministry.moniteur.badge" defaultVal="Appel à Servir" />
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                    <CMSText k="ministry.moniteur.title" defaultVal="Devenez Moniteur" />
                    <span className="block text-[#e05070]">
                      <CMSText k="ministry.moniteur.title2" defaultVal="et transmettez la foi" />
                    </span>
                  </h2>
                  <CMSText
                    as="p"
                    k="ministry.moniteur.desc"
                    className="text-zinc-300 leading-relaxed mb-4"
                    defaultVal="Un moniteur, c'est une personne du terrain — animateur de club, guide missionnaire, passeur d'espérance. Vous n'avez pas besoin d'être un professionnel, juste d'un cœur pour les enfants et d'une envie de les accompagner dans la foi."
                  />
                  <CMSText
                    as="p"
                    k="ministry.moniteur.desc2"
                    className="text-zinc-400 leading-relaxed mb-8 text-sm"
                    defaultVal="En rejoignant nos équipes, vous serez formé via le programme CPC (Cours de Pédagogie Chrétienne) et encadré par des moniteurs expérimentés. Chaque club a besoin de vous pour exister."
                  />

                  <ul className="space-y-3 mb-10">
                    {[
                      { key: 'ministry.moniteur.point1', val: 'Formation complète fournie (CPC Niveau 1 & 2)' },
                      { key: 'ministry.moniteur.point2', val: 'Matériel pédagogique clé en main' },
                      { key: 'ministry.moniteur.point3', val: 'Accompagnement par une équipe locale' },
                      { key: 'ministry.moniteur.point4', val: 'Impact concret dans votre quartier' },
                    ].map((point) => (
                      <li key={point.key} className="flex items-start gap-3 text-zinc-200 text-sm">
                        <span className="w-5 h-5 rounded-full bg-[#981a3c] flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <CMSText k={point.key} defaultVal={point.val} />
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`/${lang}/join`}
                      className="inline-block bg-[#981a3c] hover:bg-[#7a1530] text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg text-center"
                    >
                      <CMSText k="ministry.moniteur.cta_primary" defaultVal="Je veux devenir moniteur" />
                    </a>
                    <a
                      href={`/${lang}/contact`}
                      className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all border border-white/20 text-center"
                    >
                      <CMSText k="ministry.moniteur.cta_secondary" defaultVal="En savoir plus" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS ──────────────────────────────────────────────────────── */}
          <section className="py-16 bg-[#981a3c]">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center text-white">
                {[
                  { numKey: 'ministry.stat.countries.num', defaultNum: '192', labelKey: 'ministry.stat.countries.label', defaultLabel: 'pays' },
                  { numKey: 'ministry.stat.children.num', defaultNum: '19,9M', labelKey: 'ministry.stat.children.label', defaultLabel: 'enfants / an' },
                  { numKey: 'ministry.stat.clubs.num', defaultNum: '8', labelKey: 'ministry.stat.clubs.label', defaultLabel: 'types de clubs' },
                  { numKey: 'ministry.stat.since.num', defaultNum: '1937', labelKey: 'ministry.stat.since.label', defaultLabel: 'depuis' },
                ].map((s) => (
                  <div key={s.numKey}>
                    <div className="text-4xl md:text-5xl font-extrabold mb-1">
                      <CMSText k={s.numKey} defaultVal={s.defaultNum} />
                    </div>
                    <div className="text-white/70 text-sm uppercase tracking-widest font-semibold">
                      <CMSText k={s.labelKey} defaultVal={s.defaultLabel} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA GÉNÉRAL ────────────────────────────────────────────────── */}
          <section className="py-20 px-4 bg-zinc-50">
            <div className="container mx-auto max-w-4xl">
              <div className="relative bg-zinc-900 text-white rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#981a3c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    <CMSText k="home.cta_join.title" defaultVal="Prêt à faire une différence ?" />
                  </h2>
                  <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    <CMSText
                      k="home.cta_join.desc"
                      defaultVal="Rejoignez notre mission et aidez-nous à transformer la vie des enfants dans chaque nation, chaque jour."
                    />
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={`/${lang}/implicate`}
                      className="inline-block bg-[#981a3c] hover:bg-[#7a1530] text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg"
                    >
                      <CMSText k="home.cta_join.btn_primary" defaultVal="Devenir Volontaire" />
                    </a>
                    <a
                      href={`/${lang}/donation`}
                      className="inline-block bg-white text-zinc-900 hover:bg-zinc-100 font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-md"
                    >
                      <CMSText k="home.cta_join.btn_secondary" defaultVal="Faire un Don" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </CMSProvider>
  );
}

// ─── Composant ClubCard ──────────────────────────────────────────────────────

function ClubCard({ club, lang }: { club: ClubData; lang: string }) {
  return (
    <div className="group relative flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 min-h-105">
      {/* Background image */}
      <div className="absolute inset-0">
        <CMSImage
          k={club.bgKey}
          defaultSrc={club.bgDefaultSrc}
          alt=""
          aria-hidden="true"
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${club.accentColor}f0 0%, ${club.accentColor}99 45%, ${club.accentColor}33 100%)`,
          }}
        />
      </div>

      {/* Logo — top center */}
      <div className="relative z-10 flex justify-center pt-8 pb-4">
        <div className="w-20 h-20 rounded-2xl bg-white/95 shadow-xl p-2 flex items-center justify-center backdrop-blur-sm">
          <CMSImage
            k={club.logoKey}
            defaultSrc={club.logoDefaultSrc}
            alt={`Logo ${club.defaultTitle}`}
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Content — bottom */}
      <div className="relative z-10 p-6 pt-0">
        <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/30 backdrop-blur-sm">
          <CMSText k={club.badgeKey} defaultVal={club.defaultBadge} />
        </span>

        <h3 className="text-xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
          <CMSText k={club.titleKey} defaultVal={club.defaultTitle} />
        </h3>

        <p className="text-white/80 text-sm leading-relaxed mb-5 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          <CMSText k={club.descKey} defaultVal={club.defaultDesc} />
        </p>

        <a
          href={`/${lang}/implicate`}
          className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest border-b border-white/40 hover:border-white pb-0.5 transition-all hover:gap-4"
        >
          <CMSText k="ministry.club.join_label" defaultVal="S'impliquer" />
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
