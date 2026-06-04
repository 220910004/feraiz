import React, { useEffect, useRef, useState } from 'react';

interface GlossaryTermProps {
  term: string;
  description: string;
  className?: string;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ term, description, className = '' }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
    };
  }, [open]);

  const toggle = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((current) => !current);
  };

  return (
    <span
      ref={rootRef}
      tabIndex={0}
      onClick={toggle}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') toggle(event);
        if (event.key === 'Escape') setOpen(false);
      }}
      className={`group relative z-10 inline-flex cursor-help items-center gap-1 overflow-visible rounded-md text-inherit outline-none focus-visible:z-[9999] focus-visible:ring-2 focus-visible:ring-emerald-300 hover:z-[9999] ${className}`.trim()}
      aria-label={`${term}: ${description}`}
      aria-expanded={open}
    >
      <span className="border-b border-dotted border-emerald-400 text-inherit">{term}</span>
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700">
        i
      </span>
      <span
        role="tooltip"
        className={`absolute left-0 top-full z-[10000] mt-2 w-72 max-w-[85vw] rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-normal leading-5 text-stone-700 shadow-[0_16px_40px_rgba(28,25,23,0.16)] ${open ? 'block' : 'hidden group-hover:block group-focus-visible:block'}`}
      >
        {description}
      </span>
    </span>
  );
};

export default GlossaryTerm;
