/* ================================
   KONECTA - Main JavaScript
   Allies in Brand Expansion
================================ */

// ================================
// DOM ELEMENTS
// ================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const particlesCanvas = document.getElementById('particles');
const scrollProgress = document.getElementById('scrollProgress');

// ================================
// SCROLL PROGRESS BAR
// ================================
class ScrollProgressBar {
    constructor() {
        this.progressBar = scrollProgress;
        this.init();
    }

    init() {
        if (!this.progressBar) return;
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// ================================
// MOBILE NAVIGATION
// ================================
class MobileNav {
    constructor() {
        this.toggle = document.getElementById('navToggle');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.toggle || !this.navLinks) return;

        this.toggle.addEventListener('click', () => this.toggleNav());

        // Close nav when clicking on links
        const links = this.navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) this.closeNav();
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.navLinks.contains(e.target) &&
                !this.toggle.contains(e.target)) {
                this.closeNav();
            }
        });
    }

    toggleNav() {
        this.isOpen ? this.closeNav() : this.openNav();
    }

    openNav() {
        this.isOpen = true;
        this.navLinks.classList.add('active');
        this.toggle.classList.add('active');
    }

    closeNav() {
        this.isOpen = false;
        this.navLinks.classList.remove('active');
        this.toggle.classList.remove('active');
    }
}

// ================================
// FLOATING NAV SCROLL EFFECT
// ================================
class FloatingNav {
    constructor() {
        this.nav = document.getElementById('floatingNav');
        this.showThreshold = 300; // Show nav after scrolling 300px
        this.init();
    }

    init() {
        if (!this.nav) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > this.showThreshold) {
                this.nav.classList.add('visible');
            } else {
                this.nav.classList.remove('visible');
            }
        });
    }
}

// ================================
// SMOOTH SCROLL
// ================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ================================
// STATS COUNTER ANIMATION
// ================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.purpose__stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        if (!this.stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.purpose__stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================
class ScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        // Section headers
        this.setupReveal('.section-title', 'reveal-blur');
        this.setupReveal('.section-tag', 'reveal');

        // Service cards
        this.setupStaggerReveal('.service-card', 100);

        // About sections
        this.setupReveal('.about__challenge', 'reveal-left');
        this.setupReveal('.about__barrier', 'reveal-right');

        // Purpose
        this.setupStaggerReveal('.purpose__value', 150);
        this.setupStaggerReveal('.purpose__stat', 100);

        // Contact
        this.setupStaggerReveal('.contact__detail', 100);
    }

    setupReveal(selector, animationClass = 'reveal') {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach(el => {
            if (!el.classList.contains(animationClass)) {
                el.classList.add(animationClass);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    }

    setupStaggerReveal(selector, delayIncrement = 100) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        // Group elements by parent section
        const sections = new Map();
        elements.forEach(el => {
            const section = el.closest('section') || document.body;
            if (!sections.has(section)) {
                sections.set(section, []);
            }
            sections.get(section).push(el);
        });

        // Setup observer for each section's elements
        sections.forEach((sectionElements) => {
            sectionElements.forEach((el, index) => {
                el.classList.add('reveal-stagger');
                el.style.transitionDelay = `${index * delayIncrement}ms`;
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        sectionElements.forEach(el => {
                            el.classList.add('active');
                        });
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            // Observe the first element to trigger the group
            if (sectionElements[0]) {
                observer.observe(sectionElements[0]);
            }
        });
    }
}

// ================================
// PARTICLES ANIMATION
// ================================
class ParticleNetwork {
    constructor() {
        this.canvas = particlesCanvas;
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#00224d', '#ff6e37', '#030870'];
        this.maxDistance = 150;
        this.particleDensity = 0.00004; // Partículas por pixel cuadrado
        this.baseSpeed = 0.45; // Velocidad base (lenta)
        this.referenceWidth = 1920; // Ancho de referencia para calcular velocidad

        // Mouse interaction
        this.mouse = { x: null, y: null, radius: 120 };

        this.init();
        this.animate();
        this.setupMouseEvents();

        window.addEventListener('resize', () => this.handleResize());
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    getSpeedFactor() {
        // Velocidad proporcional al tamaño de pantalla
        return Math.min(this.canvas.width / this.referenceWidth, 1);
    }

    init() {
        // Esperar a que el DOM esté completamente cargado para obtener altura correcta
        setTimeout(() => {
            this.resize();
            this.createParticles();
        }, 100);
    }

    resize() {
        // Usar altura total del documento para que las partículas cubran todas las secciones
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        this.canvas.width = window.innerWidth;
        this.canvas.height = docHeight;
    }

    handleResize() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        this.resize();

        // Recrear partículas si cambió el tamaño significativamente
        if (Math.abs(this.canvas.height - oldHeight) > 100 ||
            Math.abs(this.canvas.width - oldWidth) > 100) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        // Calcular cantidad de partículas basado en el área del canvas
        const area = this.canvas.width * this.canvas.height;
        const particleCount = Math.floor(area * this.particleDensity);

        // Velocidad ajustada al tamaño de pantalla (misma percepción visual)
        const speed = this.baseSpeed * this.getSpeedFactor();

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
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
        // Mouse drag/attract effect
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * 1.5;
                particle.y += Math.sin(angle) * force * 1.5;
            }
        }

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

// ================================
// SECTION PARTICLES (Reutilizable)
// ================================
class SectionParticles {
    constructor(canvasId, particleCount = 50) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxDistance = 120;
        this.particleCount = particleCount;
        this.baseSpeed = 0.45; // Misma velocidad base que hero
        this.referenceWidth = 1920; // Ancho de referencia

        // Mouse interaction
        this.mouse = { x: null, y: null, radius: 100 };

        this.init();
        this.animate();
        this.setupMouseEvents();

        window.addEventListener('resize', () => this.handleResize());
    }

    setupMouseEvents() {
        const section = this.canvas.parentElement;

        section.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        section.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    getSpeedFactor() {
        // Velocidad proporcional al tamaño de pantalla (igual que hero)
        return Math.min(this.canvas.width / this.referenceWidth, 1);
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        const section = this.canvas.parentElement;
        this.canvas.width = section.offsetWidth;
        this.canvas.height = section.offsetHeight;
    }

    handleResize() {
        const oldWidth = this.canvas.width;
        this.resize();
        // Recrear partículas si cambió el tamaño significativamente
        if (Math.abs(this.canvas.width - oldWidth) > 100) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        const speed = this.baseSpeed * this.getSpeedFactor();

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Mouse drag/attract effect
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * 2;
                particle.y += Math.sin(angle) * force * 2;
            }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ================================
// CTA PARTICLES (Sección específica) - Legacy
// ================================
class CTAParticles {
    constructor() {
        this.canvas = document.getElementById('ctaParticles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxDistance = 120;
        this.particleCount = 50;

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        const section = this.canvas.parentElement;
        this.canvas.width = section.offsetWidth;
        this.canvas.height = section.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ================================
// TYPING TEXT EFFECT
// ================================
class TypingText {
    constructor() {
        this.element = document.getElementById('typingText');
        this.words = ['conectar?', 'expandir?', 'crecer?', 'triunfar?'];
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];

        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }

        this.element.textContent = currentWord.substring(0, this.currentCharIndex);

        let typeSpeed = this.isDeleting ? 80 : 180;

        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = 2500; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = 600;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ================================
// FORM HANDLING
// ================================
class ContactForm {
    constructor() {
        this.form = contactForm;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add floating label effect
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this.form);
            const response = await fetch('send_contact.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('success', 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
                this.form.reset();
            } else {
                throw new Error(result.message || 'Error en el envío');
            }
        } catch (error) {
            this.showMessage('error', error.message || 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(type, text) {
        // Remove existing message
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.innerHTML = `
            <p>${text}</p>
            <button type="button" class="form-message__close">&times;</button>
        `;

        // Add styles
        message.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeIn 0.3s ease;
            ${type === 'success'
                ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
        `;

        const closeBtn = message.querySelector('.form-message__close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        `;

        closeBtn.addEventListener('click', () => message.remove());

        // Insert message at the top of the form
        this.form.insertBefore(message, this.form.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }
}

// ================================
// PARALLAX EFFECT ON SHAPES
// ================================
class ParallaxShapes {
    constructor() {
        this.shapes = document.querySelectorAll('.hero__shape');
        this.init();
    }

    init() {
        if (!this.shapes.length || window.innerWidth < 768) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;

            this.shapes.forEach((shape, index) => {
                const factor = (index + 1) * 0.25;
                shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }
}

// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================
class ActiveNavLink {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.init();
    }

    init() {
        if (!this.sections.length) return;

        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const scrollY = window.pageYOffset;

        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ================================
// INITIALIZE ALL MODULES
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new ScrollProgressBar();
    new FloatingNav();
    new MobileNav();
    new SmoothScroll();
    new StatsCounter();
    new ScrollReveal();
    new ParticleNetwork();
    new SectionParticles('servicesParticles', 60);
    new SectionParticles('ctaParticles', 50);
    new TypingText();
    new ContactForm();
    new ParallaxShapes();
    new ActiveNavLink();

    // Add CSS for active nav link
    const style = document.createElement('style');
    style.textContent = `
        .header__link.active::after {
            width: 100%;
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    console.log('KONECTA website initialized successfully');
});

// ================================
// SCROLL RESET & PRELOADER
// ================================
// Deshabilitar restauración de scroll del navegador
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Forzar scroll al tope al cargar la página
    window.scrollTo(0, 0);
});
