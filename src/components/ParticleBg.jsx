import React, { useEffect, useRef } from 'react';

export default function ParticleBg() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let particles = [];
        
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        class Particle {
            constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 3 + 1.5; this.speedX = (Math.random() - 0.5) * 2; this.speedY = (Math.random() - 0.5) * 2; this.alpha = 1; }
            update() { this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.02; }
            draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        }

        const handleMove = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            particles.push(new Particle(x, y));
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        let frame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update(); particles[i].draw();
                if (particles[i].alpha <= 0) particles.splice(i, 1);
            }
            frame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            cancelAnimationFrame(frame);
        };
    }, []);

    return <canvas ref={canvasRef} id="particle-canvas" />;
}