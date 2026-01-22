"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InvitePage() {
    const params = useParams(); // Should be awaited in newer Next.js but client comp ok here
    const token = params?.token as string;
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            const res = await fetch('/api/auth/invite', {
                method: 'POST',
                body: JSON.stringify({ token, username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            if(res.ok) {
                setStatus('success');
                setTimeout(() => router.push('../login'), 2000);
            } else {
                throw new Error("Erreur");
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') return <div className="flex h-screen items-center justify-center text-green-600 font-bold text-xl">Compte créé ! Redirection...</div>;

    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg">
                <h1 className="text-xl font-bold mb-6 text-center">Accepter l'invitation</h1>
                <form onSubmit={handleRegister} className="space-y-4">
                     <input type="text" placeholder="Choisir un nom d'utilisateur" className="w-full border p-3 rounded" value={username} onChange={e=>setUsername(e.target.value)} required />
                     <input type="password" placeholder="Choisir un mot de passe" className="w-full border p-3 rounded" value={password} onChange={e=>setPassword(e.target.value)} required />
                     {status === 'error' && <div className="text-red-500 text-sm">Échec de l'enregistrement. Token invalide ?</div>}
                     <button type="submit" disabled={status==='loading'} className="w-full bg-blue-600 text-white py-3 rounded font-bold">Créer mon accès</button>
                </form>
             </div>
        </div>
    );
}
