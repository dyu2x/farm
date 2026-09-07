import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const InteractiveCursor: React.FC = () => {
  const { cursorEnabled } = useApp();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          window.getComputedStyle(target).cursor === 'pointer')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Smooth trailing spring effect
  useEffect(() => {
    if (isTouch || !cursorEnabled) return;
    let animId: number;

    const follow = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animId = requestAnimationFrame(follow);
    };

    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [pos, isTouch, cursorEnabled]);

  if (isTouch || !cursorEnabled) return null;

  // Calculate rotation angle based on movement delta
  const dx = pos.x - trailingPos.x;
  const dy = pos.y - trailingPos.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Click Water Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border border-sky-400 dark:border-sky-300 opacity-80 animate-ping"
          style={{
            left: ripple.x - 16,
            top: ripple.y - 16,
            width: 32,
            height: 32,
            animationDuration: '600ms',
          }}
        />
      ))}

      {/* Trailing Soft Halo */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
        style={{
          left: trailingPos.x,
          top: trailingPos.y,
          width: isPointer ? 38 : 26,
          height: isPointer ? 38 : 26,
          background: isPointer
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0) 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0) 70%)',
        }}
      />

      {/* Primary Fish Swimming Cursor Icon */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out will-change-transform"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : isPointer ? 1.25 : 1}) rotate(${
            Math.abs(dx) + Math.abs(dy) > 1.5 ? angle + 90 : 0
          }deg)`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Whiskers */}
          <path d="M15 10 C10 6 5 8 2 12" stroke="#0284c7" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M25 10 C30 6 35 8 38 12" stroke="#0284c7" strokeWidth="1.6" strokeLinecap="round" />
          {/* Main Fish Body (Streamlined Catfish Silhouette) */}
          <path
            d="M20 4 C14 8 12 16 13 24 C14 29 17 33 20 37 C23 33 26 29 27 24 C28 16 26 8 20 4Z"
            fill="url(#fishCursorGrad)"
            stroke="#0369a1"
            strokeWidth="1.5"
          />
          {/* Belly highlight */}
          <path d="M19 14 C17 18 17 25 20 29 C23 25 23 18 21 14 Z" fill="#e0f2fe" opacity="0.9" />
          {/* Dorsal fin */}
          <path d="M20 12 L20 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          {/* Tail fin */}
          <path d="M15 35 C17 38 20 37 20 37 C20 37 23 38 25 35 L20 33 Z" fill="#0284c7" />
          {/* Eyes */}
          <circle cx="16" cy="11" r="1.5" fill="#0f172a" />
          <circle cx="24" cy="11" r="1.5" fill="#0f172a" />
          <defs>
            <linearGradient id="fishCursorGrad" x1="20" y1="4" x2="20" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="0.6" stopColor="#0369a1" />
              <stop offset="1" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
