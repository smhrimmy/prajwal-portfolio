import React, { useState } from 'react';

interface ContactAnimationProps {
  buttonText?: string;
  onSend?: () => void;
  className?: string;
}

export function ContactAnimation({ buttonText = "Send Message", onSend, className = "" }: ContactAnimationProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state !== 'idle') return;
    
    setState('sending');
    if (onSend) onSend();

    // Simulate network request
    setTimeout(() => {
      setState('sent');
      // Reset after a while
      setTimeout(() => {
        setState('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={`relative overflow-hidden flex items-center justify-center font-bold transition-all duration-300 ${className} ${state === 'sent' ? 'bg-emerald-500 text-white' : ''}`}
      style={{ minHeight: '3rem' }}
    >
      {/* Idle State */}
      <div className={`absolute flex items-center justify-center gap-2 transition-transform duration-500 ease-in-out ${state === 'idle' ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <span>{buttonText}</span>
      </div>

      {/* Sending State (Paper Airplane / Rocket) */}
      <div className={`absolute flex items-center justify-center transition-all duration-700 ease-in-out ${state === 'sending' ? 'translate-x-0 translate-y-0 opacity-100 scale-100' : state === 'sent' ? 'translate-x-20 -translate-y-20 opacity-0 scale-50' : '-translate-x-20 translate-y-20 opacity-0 scale-50'}`}>
        <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>

      {/* Sent State */}
      <div className={`absolute flex items-center justify-center gap-2 transition-transform duration-500 ease-in-out ${state === 'sent' ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Message Sent</span>
      </div>
    </button>
  );
}
