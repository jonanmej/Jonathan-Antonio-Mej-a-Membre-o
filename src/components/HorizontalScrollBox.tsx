import React, { useRef, useEffect, ReactNode } from 'react';

interface HorizontalScrollBoxProps {
  children: ReactNode;
  className?: string;
}

export default function HorizontalScrollBox({ children, className = '' }: HorizontalScrollBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Solo interceptar el scroll si es predominantemente vertical (movimiento típico de la rueda del mouse)
      // y estamos tratando de mover un contenedor horizontal.
      // Si ya hay un movimiento horizontal grande (ej. trackpad), dejar el comportamiento nativo.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-x-auto hide-scrollbar ${className}`}>
      {children}
    </div>
  );
}
