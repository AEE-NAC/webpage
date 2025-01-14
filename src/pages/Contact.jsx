import React, { useState } from 'react';
import supabase from '../services/supabase'; // Ensure supabase.js configures your instance correctly

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace this with your actual submission logic
      const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }]);

      if (error) {
        console.error("Error submitting form:", error.message);
        alert('Form submission failed. Please try again.');
      } else {
        alert('Thank you for your message. We will get back to you soon!');
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
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
        <div className="max-w-md w-full mx-auto mt-20 md:mt-0">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <form onSubmit={handleSubmit} className="w-full px-4 md:px-0 space-y-4">
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Name
              </label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                id="name"
                placeholder="Your Name"
                type="text"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                id="email"
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="message">
                Message
              </label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex h-32 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                id="message"
                placeholder="Your message here..."
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[#981a3c] text-white hover:bg-primary-dark h-10 px-4 py-2 w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Background Image for larger screens */}
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Contact;