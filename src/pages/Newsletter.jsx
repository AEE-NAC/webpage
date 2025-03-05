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
        setMessage('An error occurred. Please try again.');
      } else {
        setMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
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
          <h1 className="text-4xl font-bold mb-6 text-center">Stay Connected With Us</h1>
          <p className="text-center text-gray-600 mb-8">
            Subscribe to our newsletter to receive updates about our activities and events.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#981a3c] text-white py-2 rounded-md hover:bg-[#7a1531]"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {message && (
              <p className="text-center text-sm mt-4 text-gray-600">
                {message}
              </p>
            )}
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

export default Newsletter;