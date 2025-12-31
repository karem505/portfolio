'use client';

import { useEffect, useCallback } from 'react';

export default function ClickEffect() {
  const createClickEffect = useCallback((e: MouseEvent) => {
    const container = document.createElement('div');
    container.className = 'click-effect';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;

    // Create 8 radiating lines
    const lineCount = 8;
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'line';
      const rotation = (360 / lineCount) * i;
      line.style.setProperty('--rotation', `${rotation}deg`);
      container.appendChild(line);
    }

    document.body.appendChild(container);

    // Remove after animation completes
    setTimeout(() => {
      container.remove();
    }, 600);
  }, []);

  useEffect(() => {
    document.addEventListener('click', createClickEffect);
    return () => {
      document.removeEventListener('click', createClickEffect);
    };
  }, [createClickEffect]);

  return null;
}
