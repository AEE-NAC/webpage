import React, { useState } from 'react';
import supabase from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    churchName: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem('student_info', JSON.stringify(formData));
      navigate('/student-dashboard');
    } catch (error) {
      console.log('Une erreur est survenue. Veuillez réessayer.', error);
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <a href="../" className='flex items-center gap-4'>
            <img
              src="/images/logo_1st.png"
              alt="CEF Logo"
              className="w-52 h-24"
            />
          </a>
        </div>
        <div className="max-w-md w-full mx-auto mt-20">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#981a3c]">Inscription des Étudiants</h1>
          <p className="text-center text-gray-600 mb-8">
            Inscrivez-vous pour accéder à nos formations et ressources pédagogiques.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Date de naissance</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Genre</label>
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

            <div>
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Adresse</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Église (optionnel)</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#981a3c]"
                value={formData.churchName}
                onChange={(e) => setFormData({...formData, churchName: e.target.value})}
              />
            </div>

            {message && (
              <div className={`p-3 rounded ${message.includes('erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#981a3c] text-white py-2 px-4 rounded hover:bg-[#7a1531] disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Créer mon compte étudiant'}
            </button>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/signup.jpg)" }}
      ></div>
    </div>
  );
};

export default StudentRegistration;