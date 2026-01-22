"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth'; // We'll invoke this via server action in reality, but for simplicity here strictly client fetch to API
import { CMSText } from '@/components/cms/cms-text';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Call our Next.js API route wrapper (since cookies must be set server-side)
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            router.push('../admin/cms'); // Redirect to CMS
            router.refresh();
        } else {
            setError("Identifiants incorrects");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[#981a3c] rounded-lg mx-auto flex items-center justify-center text-white font-bold text-xl mb-4">A</div>
                    <h1 className="text-2xl font-bold text-zinc-900">Connexion Admin</h1>
                    <p className="text-zinc-500 text-sm">Accès sécurisé à la gestion</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Utilisateur</label>
                        <input 
                            type="text" 
                            className="w-full border p-3 rounded-lg bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none" 
                            value={username} onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mot de passe</label>
                        <input 
                            type="password" 
                            className="w-full border p-3 rounded-lg bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none" 
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#981a3c] text-white py-3 rounded-lg font-bold shadow-md hover:bg-[#7a1530] transition-colors disabled:opacity-50"
                    >
                        {loading ? '...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
