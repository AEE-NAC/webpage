import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import supabase from '../services/supabase'; // Assurez-vous que le fichier supabase.js configure bien votre instance

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction pour gérer la connexion
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Erreur d'authentification :", error.message);
        alert('Authentication failed. Please check your credentials.');
      } else {
        alert('Login successful!');
        // Redirigez ou effectuez une autre action après la connexion réussie
        // Par exemple: window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert('An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="max-w-md w-full mx-auto mt-20 md:mt-0 flex flex-col items-center justify-center md:justify-start">
          <h1 className="text-4xl font-bold mb-6 text-center">Sign In</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
            className="w-full px-4 md:px-0"
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="email"
              >
                Email
              </label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                id="email"
                placeholder="m@example.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="password"
              >
                Password
              </label>
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                id="password"
                type="password"
                required
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark h-10 px-4 py-2 w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
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

export default Signin;
