import React, { useState } from 'react';
import supabase from '../services/supabase';
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        setMessage('Désolé, une erreur est survenue. Veuillez réessayer.');
      } else {
        setMessage('Merci de vous être abonné à notre newsletter ! Vous recevrez désormais nos dernières nouvelles et pourrez participer à nos activités.');
        setEmail('');
      }
    } catch (error) {
      setMessage('Désolé, une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center p-4">
      <div className="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center rounded-3xl overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src="/CP_pichon.jpeg"  
              alt="Sign in illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full h-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <a href='../'><img 
                src="images/aee.jpg"
                alt="Logo"
                width={100}
                height={60}
              /></a>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Restez connecté avec nous
              </h1>
              <p className="text-gray-600">
                Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles sur nos activités et événements, et participez à notre mission de formation et transformation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
              {message && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {message}
                </div>
              )}

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#981a3c]  text-white py-3 rounded-lg font-medium hover:bg-[#981a3c] transition-colors"
                disabled={loading}
              >
                {loading ? 'Abonnement en cours...' : 'S abonner'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
