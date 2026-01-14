import Image from "next/image";
import { Suspense } from "react"; 
import { CMSText } from "@/components/cms/cms-text";
import { CMSImage } from "@/components/cms/cms-image"; // Import CMSImage
import { VisualEditorListener } from "@/components/admin/visual-editor-listener";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Wrapped in Suspense to fix hydration error related to useSearchParams */}
      <Suspense fallback={null}>
        <VisualEditorListener />
      </Suspense>
      
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Replaced static Image with editable CMSImage */}
        <CMSImage
          k="home.hero.logo_image" // Suffix '_image' triggers file uploader in Admin
          defaultSrc="/next.svg"
          className="dark:invert"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
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
            <br />
            Edit <code className="font-mono text-sm">app/[lang]/page.tsx</code> to start building.
          </div>
        </div>
      </main>
    </div>
  );
}
