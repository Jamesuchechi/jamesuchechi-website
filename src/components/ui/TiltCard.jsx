'use client';
import { useRef, useCallback } from 'react';

/**
 * TiltCard — wraps any children in a 3D perspective tilt container.
 *
 * Props:
 *   intensity   - how many degrees of tilt (default 12)
 *   glare       - show a moving highlight (default true)
 *   scale       - scale on hover (default 1.02)
 *   perspective - CSS perspective px (default 800)
 *   className   - extra class names
 *   style       - extra styles
 */
export function TiltCard({
  children,
  intensity   = 12,
  glare       = true,
  scale       = 1.025,
  perspective = 800,
  className   = '',
  style       = {},
  ...rest
}) {
  const cardRef  = useRef(null);
  const glareRef = useRef(null);
  const rafRef   = useRef(null);
  const stateRef = useRef({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, hovering: false });

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = useCallback(() => {
    const card  = cardRef.current;
    const gl    = glareRef.current;
    const s     = stateRef.current;
    if (!card) return;

    s.rotX  = lerp(s.rotX,  s.targetRotX  ?? 0, 0.12);
    s.rotY  = lerp(s.rotY,  s.targetRotY  ?? 0, 0.12);
    s.glareX = lerp(s.glareX, s.targetGX ?? 50, 0.12);
    s.glareY = lerp(s.glareY, s.targetGY ?? 50, 0.12);

    const sc = s.hovering ? scale : 1;
    s.currentScale = lerp(s.currentScale ?? 1, sc, 0.1);

    card.style.transform = `
      perspective(${perspective}px)
      rotateX(${s.rotX}deg)
      rotateY(${s.rotY}deg)
      scale(${s.currentScale})
    `;

    if (gl) {
      gl.style.background = `radial-gradient(circle at ${s.glareX}% ${s.glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [perspective, scale]);

  const onMouseEnter = useCallback(() => {
    stateRef.current.hovering = true;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    stateRef.current.targetRotX = -dy * intensity;
    stateRef.current.targetRotY =  dx * intensity;
    stateRef.current.targetGX   = ((e.clientX - rect.left) / rect.width)  * 100;
    stateRef.current.targetGY   = ((e.clientY - rect.top)  / rect.height) * 100;
  }, [intensity]);

  const onMouseLeave = useCallback(() => {
    stateRef.current.hovering  = false;
    stateRef.current.targetRotX = 0;
    stateRef.current.targetRotY = 0;
    stateRef.current.targetGX   = 50;
    stateRef.current.targetGY   = 50;
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      {/* Glare overlay */}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 2,
            mixBlendMode: 'overlay',
            transition: 'opacity 200ms',
          }}
        />
      )}

      {/* Lift shadow layer (behind content) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: '0 0 0 0 transparent',
          transition: 'box-shadow 300ms',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}