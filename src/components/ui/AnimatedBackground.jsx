'use client';
import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    // Sparse floating orbs
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  120 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      hue: i % 2 === 0 ? 38 : 30, // amber spectrum
    }));

    // Subtle dot grid
    const dots = [];
    const COLS = Math.ceil(W / 80);
    const ROWS = Math.ceil(H / 80);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        dots.push({
          bx: c * 80 + 40,
          by: r * 80 + 40,
          x:  c * 80 + 40,
          y:  r * 80 + 40,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let mx = -9999, my = -9999;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let t = 0;
    function draw() {
      t += 0.004;
      ctx.clearRect(0, 0, W, H);

      const dark = isDark();

      // Ambient orbs
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        const alpha = dark ? 0.07 : 0.05;
        grad.addColorStop(0, `hsla(${o.hue}, 70%, 55%, ${alpha})`);
        grad.addColorStop(1, `hsla(${o.hue}, 70%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Dot grid that breathes and reacts to mouse
      dots.forEach(d => {
        const dx = d.bx - mx;
        const dy = d.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repel = Math.max(0, 1 - dist / 180);
        d.x = d.bx + dx * repel * 0.4;
        d.y = d.by + dy * repel * 0.4;

        const wave = Math.sin(t * 1.5 + d.phase) * 0.5 + 0.5;
        const a = (dark ? 0.08 : 0.06) + wave * 0.08 + repel * 0.25;
        const r = 1 + repel * 2.5 + wave * 0.5;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(201, 146, 42, ${a})`
          : `rgba(13, 13, 11, ${a})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1,
      }}
    />
  );
}