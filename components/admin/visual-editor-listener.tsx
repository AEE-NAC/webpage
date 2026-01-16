"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function VisualEditorListener() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit_mode') === 'true';

  useEffect(() => {
    // Check if running inside the Admin iframe to keep listener active during navigation
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;
    if (!isEditMode && !inIframe) return;

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
        
        // Show tooltip or indicator
        const badge = document.createElement('div');
        badge.innerText = `Edit: ${key}`;
        badge.style.position = 'absolute';
        badge.style.background = '#3b82f6';
        badge.style.color = 'white';
        badge.style.padding = '2px 6px';
        badge.style.fontSize = '10px';
        badge.style.borderRadius = '4px';
        badge.style.zIndex = '9999';
        badge.style.top = `${el.getBoundingClientRect().top + window.scrollY - 20}px`;
        badge.style.left = `${el.getBoundingClientRect().left + window.scrollX}px`;
        document.body.appendChild(badge);

        setTimeout(() => {
             el.style.outline = prevOutline || 'none';
             badge.remove();
        }, 1000);
      }
    };

    // 2. Message Listener (Apply Preview Updates from Admin)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_PREVIEW_UPDATE') {
        const { key, value } = event.data;
        // Select by exact match
        const targets = document.querySelectorAll(`[data-cms-key="${key}"]`);
        
        targets.forEach((t) => {
           const target = t as HTMLElement;
           if (target.tagName === 'IMG') {
             (target as HTMLImageElement).src = value;
           } else {
             target.innerText = value;
           }
           
           // Visual feedback
           target.style.transition = 'opacity 0.2s';
           target.style.opacity = '0.5';
           setTimeout(() => target.style.opacity = '1', 200);
        });
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
