"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function VisualEditorListener() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit_mode') === 'true';

  useEffect(() => {
    if (!isEditMode) return;

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

    document.addEventListener('contextmenu', handleRightClick);
    return () => document.removeEventListener('contextmenu', handleRightClick);
  }, [isEditMode]);

  return null;
}
