'use client';

import React, { useEffect, useRef, useState } from 'react';
import { lerp, isTouchDevice } from '@/lib/utils';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined' || isTouchDevice()) return;

    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const updateInteractiveElements = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      
      const handleEnter = () => setIsHovering(true);
      const handleLeave = () => setIsHovering(false);
      
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
      
      return () => {
        interactives.forEach(el => {
          el.removeEventListener('mouseenter', handleEnter);
          el.removeEventListener('mouseleave', handleLeave);
        });
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    const cleanupInteractives = updateInteractiveElements();

    let animationFrameId: number;
    
    const render = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      
      if (ringRef.current) {
        ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
        ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    // Setup observer for dynamically added interactive elements
    const observer = new MutationObserver(() => {
      cleanupInteractives();
      updateInteractiveElements();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      cleanupInteractives();
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div 
        ref={ringRef}
        className={`absolute -left-5 -top-5 w-10 h-10 rounded-full border-2 transition-all duration-300 ease-out will-change-transform ${
          isHovering ? 'scale-150 border-brand-violet bg-brand-violet/10' : 'scale-100 border-brand-cyan'
        }`}
      />
      <div 
        ref={dotRef}
        className={`absolute -left-1 -top-1 w-2 h-2 rounded-full transition-colors duration-300 will-change-transform ${
          isHovering ? 'bg-brand-violet' : 'bg-brand-cyan'
        }`}
      />
    </div>
  );
}
