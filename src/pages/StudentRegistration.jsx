import React, { useState } from 'react';
import supabase from '../services/supabase';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    school: '',
    grade: '',
    churchName: '',
    healthIssues: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([formData]);

      if (error) {
        setMessage('Une erreur est survenue. Veuillez réessayer.');
      } else {
        setMessage('Inscription réussie!');
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          email: '',
          phone: '',
          address: '',
          parentName: '',
          parentPhone: '',
          school: '',
          grade: '',
          churchName: '',
          healthIssues: '',
        });
      }
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fdfff4ff] pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-[#981a3c] mb-8">Inscription des Étudiants</h1>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#981a3c] mb-4">Informations Personnelles</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date de naissance</label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>

              {/* Contact et École */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#981a3c] mb-4">Contact et École</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">École</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Niveau</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-[#981a3c] mb-4">Informations Supplémentaires</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nom du parent/tuteur</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone du parent/tuteur</label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Église (optionnel)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                  value={formData.churchName}
                  onChange={(e) => setFormData({...formData, churchName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Problèmes de santé (optionnel)</label>
                <textarea
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c] h-24"
                  value={formData.healthIssues}
                  onChange={(e) => setFormData({...formData, healthIssues: e.target.value})}
                  placeholder="Allergies, conditions médicales, etc."
                ></textarea>
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded ${message.includes('erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#981a3c] text-white py-2 px-4 rounded hover:bg-[#7a1531] disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Soumettre l\'inscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentRegistration;