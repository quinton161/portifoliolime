import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const AnimatedBgContainer = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  display: block;
  background: #181c22 !important;
  outline: 2px solid #f00;
`;

const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Panel and color params
    const panelCount = 9;
    const panelSpacing = width / (panelCount + 1);
    const floorHeight = height * 0.23;

    function draw() {
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Scroll-based brightness/contrast
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollFactor = Math.min(1, scrollY / (height * 0.7));
      const brightness = 0.92 + 0.4 * scrollFactor;
      const contrast = 1 + 0.25 * scrollFactor;
      ctx.save();
      ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

      // Animated gradient background
      const t = Date.now() * 0.00025;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${200 + 30 * Math.sin(t)}, 100%, 18%)`);
      grad.addColorStop(0.33, `hsl(${195 + 50 * Math.sin(t + 1)}, 90%, 23%)`);
      grad.addColorStop(0.66, `hsl(${270 + 60 * Math.sin(t + 2)}, 80%, 22%)`);
      grad.addColorStop(1, `hsl(${30 + 30 * Math.sin(t + 3)}, 90%, 19%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Vertical glowing panels
      for (let i = 0; i < panelCount; i++) {
        const x = panelSpacing * (i + 1);
        const hue = 200 + 80 * Math.sin(t * 1.2 + i);
        const panelGrad = ctx.createLinearGradient(x, 0, x, height - floorHeight);
        panelGrad.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.13)`);
        panelGrad.addColorStop(0.45, `hsla(${hue}, 100%, 65%, 0.22)`);
        panelGrad.addColorStop(0.5 + 0.1 * Math.sin(t * 2 + i), `hsla(${hue}, 100%, 80%, 0.18)`);
        panelGrad.addColorStop(1, `hsla(${hue}, 100%, 70%, 0.05)`);
        ctx.save();
        ctx.globalAlpha = 0.77 + 0.09 * Math.sin(t * 2.2 + i);
        ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.55)`;
        ctx.shadowBlur = 40 + 16 * Math.sin(t + i);
        ctx.fillStyle = panelGrad;
        ctx.fillRect(x - 24, 0, 48, height - floorHeight);
        ctx.restore();
      }

      // Light beams
      for (let i = 0; i < panelCount; i++) {
        const x = panelSpacing * (i + 1);
        const hue = 200 + 80 * Math.sin(t * 1.2 + i);
        ctx.save();
        ctx.globalAlpha = 0.19 + 0.08 * Math.sin(t * 2.8 + i);
        ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.85)`;
        ctx.shadowColor = `hsla(${hue}, 100%, 90%, 0.9)`;
        ctx.shadowBlur = 24 + 8 * Math.sin(t + i);
        ctx.lineWidth = 2.5 + 1.2 * Math.sin(t * 1.8 + i);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height - floorHeight);
        ctx.stroke();
        ctx.restore();
      }

      // Floor grid (metallic)
      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = 'rgba(180, 200, 255, 0.14)';
      ctx.lineWidth = 1;
      for (let y = height - floorHeight; y < height; y += 26) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let i = 0; i < panelCount; i++) {
        const x = panelSpacing * (i + 1);
        ctx.beginPath();
        ctx.moveTo(x, height - floorHeight);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // Floor reflections
      for (let i = 0; i < panelCount; i++) {
        const x = panelSpacing * (i + 1);
        const hue = 200 + 80 * Math.sin(t * 1.2 + i);
        const reflectionGrad = ctx.createLinearGradient(x, height - floorHeight, x, height);
        reflectionGrad.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.11)`);
        reflectionGrad.addColorStop(0.7, `hsla(${hue}, 100%, 70%, 0.03)`);
        reflectionGrad.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);
        ctx.save();
        ctx.globalAlpha = 0.55 + 0.15 * Math.sin(t * 2.1 + i);
        ctx.fillStyle = reflectionGrad;
        ctx.fillRect(x - 24, height - floorHeight, 48, floorHeight);
        ctx.restore();
      }

      // Ambient glow pulse
      ctx.save();
      const glowStrength = 0.16 + 0.08 * Math.sin(t * 2.7);
      ctx.globalAlpha = glowStrength;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.13, width * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,180,120,0.37)';
      ctx.fill();
      ctx.restore();

      ctx.restore(); // Remove brightness/contrast filter

      animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener('resize', handleResize);
    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <AnimatedBgContainer>
      <Canvas ref={canvasRef} />
    </AnimatedBgContainer>
  );
};

export default FuturisticBackground;
