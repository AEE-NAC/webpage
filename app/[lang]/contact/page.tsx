"use client";

import React, { useState } from 'react';
import { supabase } from '../../../services/supabase.conf';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }] as any);

      if (error) {
        setStatusMessage('Désolé, une erreur est survenue. Veuillez réessayer.');
      } else {
        setStatusMessage('Merci pour votre message. Nous vous répondrons bientôt !');
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      setStatusMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center p-4">
      <div className="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center rounded-3xl overflow-hidden">
          <div className="relative w-full h-full">
            <CMSImage 
              k="contact.hero.image"
              defaultSrc="/CP_pichon.jpeg"
              alt="Contact illustration" 
              className="w-full h-full object-cover"
              fill
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
                <CMSText k="contact.form.title" defaultVal="Contactez-nous" />
              </h1>
              <p className="text-gray-600">
                <CMSText k="contact.form.subtitle" defaultVal="Nous sommes là pour vous aider. N'hésitez pas à nous envoyer un message." />
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
              {statusMessage && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {statusMessage}
                </div>
              )}

              <div className="relative mb-4">
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="relative mb-4">
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative mb-4">
                <textarea
                  id="message"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Votre message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#981a3c] text-white py-3 rounded-lg font-medium hover:bg-[#981a3c] transition-colors"
                disabled={loading}
              >
                {loading ? <CMSText k="contact.form.btn_sending" defaultVal="Envoi en cours..." /> : <CMSText k="contact.form.btn_send" defaultVal="Envoyer le message" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;