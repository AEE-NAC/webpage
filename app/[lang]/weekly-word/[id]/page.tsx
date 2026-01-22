import { CMSService } from "@/services/supabase.conf";
import { SupportedLanguage } from "@/context/adapt";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function WeeklyWordPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang: langParam, id } = await params;
    const lang = langParam as SupportedLanguage;
    const word = await CMSService.getWeeklyWordById(id);

    if (!word) return notFound();

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-24 pb-16 px-4">
             <article className="max-w-3xl mx-auto">
                 <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                     <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                         Weekly Word
                     </span>
                     <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">{word.title}</h1>
                     <div className="flex items-center justify-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
                         <span>{new Date(word.start_date).toLocaleDateString(lang, { dateStyle: 'long' })}</span>
                         {word.author_name && (
                            <>
                                <span>•</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-300">{word.author_name}</span>
                                {word.author_role && <span className="text-zinc-400">({word.author_role})</span>}
                            </>
                         )}
                     </div>
                 </div>

                 {word.image_url && (
                     <div className="w-full aspect-video relative rounded-2xl overflow-hidden mb-10 bg-zinc-100 shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-1000">
                         <img src={word.image_url} alt={word.title} className="w-full h-full object-cover" />
                     </div>
                 )}

                 <div className="prose prose-lg dark:prose-invert mx-auto text-zinc-800 dark:text-zinc-300">
                     <div className="whitespace-pre-wrap leading-relaxed">{word.content}</div> 
                 </div>
                 
                 <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
                     <a href={`/${lang}`} className="text-zinc-500 hover:text-black dark:hover:text-white font-medium flex items-center gap-2 transition-colors px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
                         &larr; Back to Home
                     </a>
                 </div>
             </article>
        </div>
    );
}
