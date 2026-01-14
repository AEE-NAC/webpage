"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function VisualEditorListener() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit_mode') === 'true';

  useEffect(() => {
    if (!isEditMode) return;

    // 1. Right Click Listener (Request Edit)
    const handleRightClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cms-key]');
      
      if (target) {
        e.preventDefault(); 
        e.stopPropagation();

        const key = target.getAttribute('data-cms-key');
        
        window.parent.postMessage({
          type: 'CMS_EDIT_REQUEST',
          key: key
        }, '*');
        
        const el = target as HTMLElement;
        const prevOutline = el.style.outline;
        el.style.outline = "2px solid #3b82f6"; 
        setTimeout(() => el.style.outline = prevOutline || 'none', 1000);
      }
    };

    // 2. Message Listener (Apply Preview Updates from Admin)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_PREVIEW_UPDATE') {
        const { key, value } = event.data;
        const target = document.querySelector(`[data-cms-key="${key}"]`) as HTMLElement;
        
        if (target) {
           if (target.tagName === 'IMG') {
             (target as HTMLImageElement).src = value;
           } else {
             // Basic text update. For rich text, you might use innerHTML
             target.innerText = value;
           }
           
           // Visual feedback of update
           target.style.transition = 'opacity 0.2s';
           target.style.opacity = '0.5';
           setTimeout(() => target.style.opacity = '1', 200);
        }
      }
    };

    document.addEventListener('contextmenu', handleRightClick);
    window.addEventListener('message', handleMessage);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('message', handleMessage);
    };
  }, [isEditMode]);

  return null;
}
