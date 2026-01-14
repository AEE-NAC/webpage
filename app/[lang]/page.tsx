import Image from "next/image";
import { Suspense } from "react"; 
import { CMSText } from "@/components/cms/cms-text";
import { CMSImage } from "@/components/cms/cms-image"; // Import CMSImage
import { VisualEditorListener } from "@/components/admin/visual-editor-listener";
import { SupportedLanguage } from "@/context/adapt";
import { NewsletterFeed, WeeklyWordFeed } from "@/components/home/feeds";

export default async function Home({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      {/* Wrapped in Suspense to fix hydration error related to useSearchParams */}
      <Suspense fallback={null}>
        <VisualEditorListener />
      </Suspense>
      
      <main className="flex w-full flex-col">
        {/* HERO SECTION */}
        <div className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 mx-auto sm:items-start text-center sm:text-left">
            <CMSImage
              k="home.hero.logo_image" // Suffix '_image' triggers file uploader in Admin
              defaultSrc="/next.svg"
              className="dark:invert mb-8 sm:mb-0"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            
            <div className="flex flex-col items-center gap-6 sm:items-start">
              <CMSText 
                as="h1" 
                k="home.hero.title"
                defaultVal="Welcome to AEE Global"
                className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50"
              />
              <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                <CMSText 
                   as="span"
                   k="home.hero.description"
                   defaultVal="This site is successfully internationalized."
                />
              </div>
            </div>
        </div>

        {/* DYNAMIC FEEDS */}
        <div className="w-full bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800">
             <WeeklyWordFeed lang={lang} />
             <NewsletterFeed lang={lang} />
        </div>

      </main>
    </div>
  );
}
