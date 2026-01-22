"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SUPPORTED_COUNTRIES } from '@/context/adapt';
import { CMSService } from '@/services/supabase.conf'; // Used for generic API calls if needed

export default function InvitesManager() {
    const { lang } = useParams();
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [role, setRole] = useState('editor');
    const [country, setCountry] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchInvites = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/invites');
            const data = await res.json();
            setInvites(data.invites || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInvites(); }, []);

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            await fetch('/api/auth/invites', {
                method: 'POST',
                body: JSON.stringify({ role, country_code: country || null }),
                headers: { 'Content-Type': 'application/json' }
            });
            fetchInvites();
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette invitation ?")) return;
        await fetch(`/api/auth/invites?id=${id}`, { method: 'DELETE' });
        fetchInvites();
    };

    const copyLink = (token: string) => {
        const url = `${window.location.origin}/${lang}/admin/invite/${token}`;
        navigator.clipboard.writeText(url);
        alert("Lien copié !");
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Accès</h1>
                <a href={`/${lang}/admin/cms`} className="text-sm text-zinc-500 hover:underline">← Retour au CMS</a>
            </div>

            {/* Creation Form */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 mb-10">
                <h2 className="text-lg font-bold mb-4">Générer une nouvelle invitation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Rôle</label>
                        <select className="w-full border p-2 rounded-lg bg-white" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="editor">Éditeur (Lecture/Écriture)</option>
                            <option value="admin">Administrateur (Complet)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Restriction Pays</label>
                        <select className="w-full border p-2 rounded-lg bg-white" value={country} onChange={e => setCountry(e.target.value)}>
                            <option value="">Global (Tous les pays)</option>
                            {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                    <button 
                        onClick={handleCreate} 
                        disabled={isCreating}
                        className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        Générer le lien
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Invitations en attente</h2>
                {loading ? <div className="text-zinc-400">Chargement...</div> : (
                    <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-4">Rôle</th>
                                    <th className="p-4">Restriction</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {invites.map(inv => (
                                    <tr key={inv.id} className={inv.is_used ? 'opacity-50' : ''}>
                                        <td className="p-4 font-bold">{inv.role}</td>
                                        <td className="p-4">{inv.country_code || 'Global'}</td>
                                        <td className="p-4">
                                            {inv.is_used ? <span className="text-zinc-400">Utilisé</span> : <span className="text-green-600 font-medium">Actif</span>}
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            {!inv.is_used && (
                                                <button onClick={() => copyLink(inv.token)} className="bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded text-xs font-bold">Copier Lien</button>
                                            )}
                                            <button onClick={() => handleDelete(inv.id)} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                                {invites.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-zinc-400">Aucune invitation générée.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
