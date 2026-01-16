"use client";

import React, { useState } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { supabase } from '../../../services/supabase.conf';
import { CMSText } from '../../../components/cms/cms-text';

const ImpliquezVous = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert([{ ...formData, role: selectedRole }] as any);

      if (error) {
        alert('Error submitting application. Please try again.');
      } else {
        alert('Application submitted successfully!');
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: "visitors",
      titleDefault: "Visiteurs",
      descriptionDefault: "Découvrez notre communauté et nos activités lors de votre première visite.",
      buttonTextDefault: "En savoir plus"
    },
    {
      id: "members",
      titleDefault: "Membres",
      descriptionDefault: "Rejoignez-nous et profitez de tous les avantages offerts à nos membres.",
      buttonTextDefault: "Devenir membre"
    },
    {
      id: "volunteers",
      titleDefault: "Volontaires",
      descriptionDefault: "Moniteurs associés, Supporteurs, Formateurs, Membres CA. Votre aide est précieuse !",
      buttonTextDefault: "Postuler"
    },
    {
      id: "fulltime",
      titleDefault: "Ouvriers à temps plein",
      descriptionDefault: "Faites partie intégrante de notre équipe et contribuez pleinement à notre mission.",
      buttonTextDefault: "Voir les offres"
    },
    {
      id: "parttime",
      titleDefault: "Ouvriers à temps partiel",
      descriptionDefault: "Travaillez avec nous de manière flexible et adaptée à votre emploi du temps.",
      buttonTextDefault: "Postuler"
    },
  ];

  const handleApply = (title: string) => {
    setSelectedRole(title);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="bg-[#fdfff4ff] py-37.5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-[#981a3c]">
            <CMSText k="implicate.header.title" defaultVal="Impliquez-vous" />
          </h1>
          <p className="text-center text-xl mb-12 max-w-3xl mx-auto text-gray-600">
            <CMSText k="implicate.header.desc" defaultVal="Rejoignez notre communauté dynamique et faites la différence. Que vous soyez visiteur, membre ou bénévole, il y a une place pour vous !" />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1">
                <div className="p-6">
                  <h2 className="font-bold text-2xl mb-4 text-[#981a3c]">
                    <CMSText k={`implicate.role.${card.id}.title`} defaultVal={card.titleDefault} />
                  </h2>
                  <p className="text-gray-700 text-base mb-6">
                    <CMSText k={`implicate.role.${card.id}.desc`} defaultVal={card.descriptionDefault} />
                  </p>
                  <button 
                    className="bg-[#981a3c] hover:bg-[#981a3c] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    onClick={() => handleApply(card.titleDefault)}
                  >
                    <CMSText k={`implicate.role.${card.id}.btn`} defaultVal={card.buttonTextDefault} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-9999">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#981a3c]">
                <CMSText k="implicate.modal.title_prefix" defaultVal="Postuler pour devenir" /> {selectedRole}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1"><CMSText k="implicate.modal.form.name" defaultVal="Nom complet" /></label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1"><CMSText k="implicate.modal.form.email" defaultVal="Email" /></label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1"><CMSText k="implicate.modal.form.phone" defaultVal="Téléphone" /></label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1"><CMSText k="implicate.modal.form.message" defaultVal="Message" /></label>
                <textarea
                  required
                  className="w-full p-2 border rounded h-32"
                  value={formData.message}
                  placeholder="Dites nous en plus sur vous"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <CMSText k="implicate.modal.btn_cancel" defaultVal="Annuler" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#981a3c] text-white px-4 py-2 rounded hover:bg-[#7a1531] disabled:opacity-50"
                >
                  {loading ? <CMSText k="implicate.modal.btn_sending" defaultVal="Envoi..." /> : <CMSText k="implicate.modal.btn_send" defaultVal="Envoyer" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ImpliquezVous;