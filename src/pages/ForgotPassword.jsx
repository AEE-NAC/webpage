import React, { useState } from 'react'; 
import supabase from '../services/supabase'; // Ensure Supabase is correctly imported

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle sending the reset password request
  const send = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://aeenac.org/reset-password', // Change this to your app's reset password page
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error("Error sending password reset email:", error.message);
      } else {
        setMessage('Password reset email sent successfully. Check your inbox!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Reset your password</h1>
          <form>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                id="email"
                placeholder="m@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <p id="message" className="text-sm text-green-600">{message}</p>
            </div>
            <button
              type="button"
              onClick={send}
              className="mt-4 inline-flex items-center justify-center w-full h-10 rounded-md bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary px-4 py-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Forgotpassword;
