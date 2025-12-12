/* ================================
   KONECTA - Particles Animation
================================ */

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#00224d', '#ff6e37', '#030870'];
        this.maxDistance = 150;

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 34, 77, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
        }

        // Keep within bounds
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first (behind particles)
        this.drawConnections();

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();

    // Add subtle parallax effect to shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        shapes.forEach((shape, index) => {
            const factor = (index + 1) * 0.3;
            shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
});
