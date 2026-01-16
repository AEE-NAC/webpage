"use client";

import React, { useState, useEffect } from 'react';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { defaultLocale, SupportedLanguage, SUPPORTED_COUNTRIES } from '../../../context/adapt';
import { supabase } from '../../../services/supabase.conf';

// Dynamic Map Import to avoid SSR issues
const DonationMap = dynamic(async () => {
  const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
  const L = await import('leaflet');
  
  // Fix Leaflet default icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  return ({ points }: { points: any[] }) => (
    <MapContainer center={[18.55, -72.30]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer 
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {points.map((p, i) => (
        <Marker key={i} position={p.coords}>
            <Popup>
                <div className="font-semibold text-zinc-900">{p.name}</div>
                <div className="text-xs text-zinc-500">{p.address}</div>
            </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}, { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 animate-pulse">Chargement de la carte...</div> 
});

const DEFAULT_COLLECTION_POINTS = [
    { name: "Bureau National AEE Haïti", address: "Delmas 31, Rue Jacques 1er #14, Port-au-Prince", coords: [18.545, -72.296] },
    { name: "Église Biblique de la Grâce", address: "Pétion-Ville, Haïti", coords: [18.513, -72.288] }
];

const NAC_REGION_CODES = ['HT', 'SX', 'MF', 'MQ', 'GP', 'GF', 'CA', 'US'];

const ministries = [
  { id: 3, name: 'MBE (Ministère Biblique dans les Ecoles)' },
  { id: 4, name: 'CBN/KBN (Club de la Bonne Nouvelle/Klèb Bòn Nouvèl)' },
  { id: 5, name: 'Clubs Spéciaux : CFA (Club de Fin d Année)' },
  { id: 6, name: 'Clubs Spéciaux : Club de Pâques' },
  { id: 7, name: 'Clubs Spéciaux : Autres' },
  { id: 8, name: 'JCA (Jeunesse Chrétienne en Action)' },
  { id: 9, name: 'C5J/K5J (Club de 5 Jours/Klèb 5 Jou)' },
];

// Helper for Flag URL
const getFlag = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

const Donation = () => {
  const params = useParams();
  const lang = (params?.lang as SupportedLanguage) || defaultLocale;
  
  // Step Management: 1=Type, 2=Details, 3=Result (Info)
  const [step, setStep] = useState(1);

  const [donationType, setDonationType] = useState('monetary');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  
  // Monetary State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Material State
  const [materials, setMaterials] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState('');
  const [userCountry, setUserCountry] = useState('');
  
  // Service State
  const [serviceDescription, setServiceDescription] = useState('');

  // Contact State
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  // Auto-detect country based on lang or adapt (simulated)
  useEffect(() => {
    if (userCountry) return;
    // Simple heuristic mapping as per "adapt" suggestion in prompt
    const defaultForLang: Record<string, string> = { 'ht': 'HT', 'fr': 'MQ', 'en': 'US', 'es': 'DO' };
    if (defaultForLang[lang]) setUserCountry(defaultForLang[lang]);
  }, [lang]);

  // Logic to determine currencies based on lang
  const availableCurrencies = lang === 'ht' ? ['HTG', 'USD'] : ['USD', 'EUR', 'CAD'];
  const isHaiti = lang === 'ht';

  useEffect(() => {
     if(availableCurrencies.includes('USD') && currency === 'USD') return;
     setCurrency(availableCurrencies[0]);
  }, [lang]);

  const handleAddMaterial = () => {
    if (materialInput.trim() !== '') {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...materials];
    newMaterials.splice(index, 1);
    setMaterials(newMaterials);
  };

  const isInRegion = NAC_REGION_CODES.includes(userCountry);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('sending');
    try {
        const messageBody = donationType === 'material' 
            ? `Donation Matérielle (Hors Région): ${materials.join(', ')}. Pays: ${userCountry}`
            : `Offre de Service: ${serviceDescription}`;

        const { error } = await supabase.from('contacts').insert([{
            name: contactName,
            email: contactEmail,
            message: messageBody
        }] as any);

        if (error) throw error;
        setSubmitStatus('success');
    } catch (err) {
        setSubmitStatus('error');
    }
  };

  const proceedToDetails = (type: string) => {
      setDonationType(type);
      setStep(2);
  };

  const proceedToResult = () => {
      if (donationType === 'material' && !userCountry) {
          alert('Veuillez sélectionner votre pays.');
          return;
      }
      setStep(3);
  };

  // Determine if Map should be shown on left side (Only in Step 3 when relevant)
  const showMap = step === 3 && donationType === 'material' && isInRegion;

  return (
    <div className="h-screen flex justify-center items-center p-4 md:p-6 bg-zinc-50 font-sans overflow-hidden">
      <div className="w-full max-w-7xl h-full md:h-[90vh] flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Visual / Map */}
        <div className="w-full md:w-1/2 bg-zinc-200 relative overflow-hidden transition-all duration-500 ease-in-out rounded-3xl shadow-xl h-full border border-zinc-200/50">
          {showMap ? (
             <div className="absolute inset-0 z-10 animate-in fade-in duration-700">
                <DonationMap points={DEFAULT_COLLECTION_POINTS} />
                <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-[1000] border border-gray-200">
                    <p className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <CMSText k="donate.map.legend" defaultVal="Points de collecte actifs" />
                    </p>
                </div>
             </div>
          ) : (
             <div className="absolute inset-0">
                <CMSImage 
                  k="donate.hero.image"
                  defaultSrc="/CP_pichon.jpeg"
                  alt="Donation illustration" 
                  className="w-full h-full object-cover grayscale-[10%]"
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
                    <div className="animate-in slide-in-from-bottom-6 duration-700">
                      <p className="text-white text-xl font-medium italic leading-relaxed">
                          "<CMSText k="donate.hero.quote" defaultVal="Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie." />"
                      </p>
                      <span className="block text-sm text-zinc-300 mt-2 font-bold tracking-widest uppercase">2 Corinthiens 9:7</span>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Right Side: Multistep Form (Seamless - No Box/Shadow) */}
        <div className="w-full h-full md:w-1/2 flex flex-col relative">
            
            {/* Header / Nav */}
             <div className="flex justify-between items-center mb-6 shrink-0 pt-2">
                <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <a href={`/${lang}`} className="">
                    <img src="/images/logo_1st.png" alt="Logo" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
                  </a>
                  <div className="h-4 w-px bg-zinc-400"></div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest"><CMSText k="donate.header_label" defaultVal="Support" /></span>
                </div>
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="text-xs font-bold text-zinc-500 hover:text-[#981a3c] uppercase flex items-center gap-1 transition-colors">
                        ← <CMSText k="donate.back" defaultVal="Retour" />
                    </button>
                )}
             </div>

             <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full relative">
                
                {/* Title Section (Hidden on later steps to save space) */}
                <div className={`text-center mb-8 transition-all duration-300 ${step > 1 ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
                  <h1 className="text-4xl font-extrabold text-zinc-900 mb-3 text-[#981a3c]">
                    <CMSText k="donate.title" defaultVal="Faire un don" />
                  </h1>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                    <CMSText k="donate.description" defaultVal="Votre contribution change des vies. Choisissez comment vous souhaitez aider." />
                  </p>
                </div>

                {/* STEP 1: TYPE SELECTION */}
                {step === 1 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-500">
                        {['monetary', 'material', 'service'].map((type) => (
                          <button
                            key={type}
                            onClick={() => proceedToDetails(type)}
                            className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-[#981a3c]/30 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex items-center gap-4"
                          >
                           <div className="w-10 h-10 rounded-full bg-zinc-50 group-hover:bg-[#981a3c]/10 flex items-center justify-center text-lg text-zinc-400 group-hover:text-[#981a3c] transition-colors">
                                {type === 'monetary' ? '$' : type === 'material' ? '📦' : '🤝'}
                           </div>
                           <div>
                               <div className="font-bold text-zinc-700 group-hover:text-[#981a3c] transition-colors"><CMSText k={`donate.type.${type}`} defaultVal={type} /></div>
                               <div className="text-xs text-zinc-400 group-hover:text-zinc-500"><CMSText k={`donate.type_desc.${type}`} defaultVal={type === 'monetary' ? "Carte, Virement, MonCash" : type === 'material' ? "Livres, Vêtements, Équipement" : "Bénévolat, Compétences"} /></div>
                           </div>
                           <div className="ml-auto text-zinc-300 group-hover:text-[#981a3c]">→</div>
                          </button>
                        ))}
                    </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500 bg-white/50 backdrop-blur-sm p-1 rounded-2xl">
                        <div className="mb-2">
                             <div className="text-xs font-bold text-zinc-400 uppercase mb-1 tracking-wider"><CMSText k="donate.category" defaultVal="Catégorie" /></div>
                             <div className="text-xl font-bold text-[#981a3c] capitalize"><CMSText k={`donate.type.${donationType}`} defaultVal={donationType} /></div>
                        </div>

                        {/* Common Ministry Selector */}
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.ministry_label" defaultVal="Affectation (Optionnel)" /></label>
                            <select
                                value={selectedMinistry}
                                onChange={(e) => setSelectedMinistry(e.target.value)}
                                className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] transition-shadow shadow-sm"
                            >
                                <option value=""><CMSText k="donate.form.select_ministry" defaultVal="Là où le besoin est le plus grand" /></option>
                                {ministries.map((ministry) => (<option key={ministry.id} value={ministry.name}>{ministry.name}</option>))}
                            </select>
                        </div>

                        {/* Monetary Fields */}
                        {donationType === 'monetary' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.amount" defaultVal="Montant" /></label>
                                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white border border-zinc-200 text-zinc-900 text-xl font-bold rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm" autoFocus />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.currency" defaultVal="Devise" /></label>
                                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm h-[54px]">
                                            {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.method" defaultVal="Moyen de paiement" /></label>
                                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm">
                                        <option value=""><CMSText k="donate.form.select_method" defaultVal="Choisir..." /></option>
                                        <option value="CreditCard">Carte de crédit / Débit</option>
                                        <option value="BankTransfer">Virement bancaire</option>
                                        <option value="Paypal">PayPal</option>
                                        {isHaiti && <option value="MonCash">MonCash</option>}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Material Fields */}
                        {donationType === 'material' && (
                           <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.country" defaultVal="Votre Pays" /></label>
                                    <div className="relative">
                                        {/* Mini Dropdown using Tailwind */}
                                        <select
                                            value={userCountry}
                                            onChange={(e) => setUserCountry(e.target.value)}
                                            className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 pl-10 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm appearance-none"
                                        >
                                            <option value="">Sélectionner...</option>
                                            {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                            <option value="OTHER">Autre / Other</option>
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {userCountry && userCountry !== 'OTHER' ? (
                                                <img src={getFlag(userCountry)} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" alt="Flag" />
                                            ) : (
                                                <span className="text-zinc-400 text-xs">🌐</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.materials" defaultVal="Articles à donner" /></label>
                                    <div className="flex gap-2">
                                        <input type="text" value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} placeholder="Ex: Livres..." className="flex-1 bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 shadow-sm focus:ring-[#981a3c] focus:border-[#981a3c]" onKeyDown={(e) => e.key === 'Enter' && handleAddMaterial()} />
                                        <button onClick={handleAddMaterial} className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-lg font-bold hover:bg-zinc-700 transition-colors shadow-sm">+</button>
                                    </div>
                                    {materials.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {materials.map((m, i) => (
                                                <span key={i} className="inline-flex items-center bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-medium px-2 py-1 rounded-md">
                                                    {m} <button onClick={() => handleRemoveMaterial(i)} className="ml-1 text-zinc-400 hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                           </div>
                        )}

                        {/* Service Fields */}
                        {donationType === 'service' && (
                             <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="donate.form.service_desc" defaultVal="Description du service" /></label>
                                <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Comment souhaitez-vous aider ?" rows={4} className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm resize-none" />
                             </div>
                        )}

                        <div className="pt-4">
                            <button onClick={proceedToResult} className="w-full bg-[#981a3c] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-900/10 hover:shadow-red-900/20 hover:bg-[#7a1530] transition-all transform hover:-translate-y-0.5">
                                <CMSText k="donate.form.btn_continue" defaultVal="Continuer" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: RESULT / INFO */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                        
                         {/* SCROLLABLE AREA for LISTS */}
                         <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                            
                            {/* MONETARY RESULT */}
                            {donationType === 'monetary' && (
                                <div className="space-y-4">
                                     <div className="bg-white p-6 rounded-2xl border border-zinc-200/60 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#981a3c]/5 rounded-bl-full -mr-8 -mt-8"></div>
                                        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 relative z-10">
                                            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg></span>
                                            <span>Instructions</span>
                                        </h3>
                                        {/* (Existing Payment Logic Condensed) */}
                                        {paymentMethod === 'BankTransfer' && (
                                            <div className="space-y-3 text-sm text-zinc-600">
                                                <div className="flex justify-between border-b border-zinc-100 pb-2"><span>Banque</span><span className="font-bold">Unibank</span></div>
                                                <div className="flex justify-between pt-1"><span>{currency}</span><span className="font-mono font-bold tracking-wide">{currency === 'USD' ? '270-1022-1147584' : '270-1021-1084861'}</span></div>
                                            </div>
                                        )}
                                        {paymentMethod === 'MonCash' && <div className="text-center bg-red-50 p-4 rounded-xl text-red-700 font-bold font-mono text-xl">+509 3766-5656</div>}
                                        {(paymentMethod === 'Paypal' || paymentMethod === 'CreditCard') && (
                                            <div className="text-center pt-2"><button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5 transition-all w-full">Payer {amount} {currency}</button></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-center text-zinc-400">Transaction sécurisée SSL</p>
                                </div>
                            )}

                            {/* MATERIAL (IN REGION) RESULT */}
                            {donationType === 'material' && isInRegion && (
                                <div className="space-y-4">
                                     <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/60 shadow-sm relative">
                                        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                            <span className="p-1.5 bg-green-100 text-green-700 rounded-lg">📍</span>
                                            <CMSText k="donate.info.collect_title" defaultVal="Points de Collecte" />
                                        </h3>
                                        <div className="space-y-3">
                                            {DEFAULT_COLLECTION_POINTS.map((pt, i) => (
                                                <div key={i} className="bg-white p-4 rounded-xl border border-green-100/50 shadow-sm hover:border-green-300 cursor-pointer transition-all">
                                                    <p className="font-bold text-green-800 text-sm mb-1">{pt.name}</p>
                                                    <p className="text-xs text-zinc-500">{pt.address}</p>
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                </div>
                            )}

                             {/* FORM CONTACT (OUT REGION or SERVICE) */}
                             {((donationType === 'material' && !isInRegion) || donationType === 'service') && (
                                 <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                                      <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><span className="text-orange-500">✉️</span> Coordonnons ensemble</h3>
                                      {submitStatus === 'success' ? (
                                         <div className="text-center py-6 text-green-600 font-bold">Message Envoyé !</div>
                                      ) : (
                                          <form onSubmit={handleSubmitContact} className="space-y-3 mt-4">
                                              <input type="text" required placeholder="Nom" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-orange-500 transition-colors" />
                                              <input type="email" required placeholder="Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-orange-500 transition-colors" />
                                              <button disabled={submitStatus === 'sending'} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 shadow-md mt-2">{submitStatus === 'sending' ? '...' : 'Envoyer'}</button>
                                          </form>
                                      )}
                                 </div>
                             )}
                         </div>

                         {/* Footer Note */}
                         <div className="pt-2 shrink-0">
                            <a href={`/${lang}/contact`} className="block w-full text-center py-3 border border-zinc-200 rounded-xl font-medium text-xs text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-all">
                                 <CMSText k="donate.info.need_help" defaultVal="Besoin d'aide ?" />
                            </a>
                        </div>
                    </div>
                )}

             </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d8; }
      `}</style>
    </div>
  );
};

export default Donation;