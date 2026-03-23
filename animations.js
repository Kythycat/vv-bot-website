/**
 * Velvet Vendetta - Advanced Animation System
 * Fixed mouse particles + enhanced background animations
 */

class VelvetAnimations {
    constructor() {
        this.particles = [];
        this.particleCount = 45;
        this.mousePosition = { x: 0, y: 0 };
        this.mouseActive = false;
        this.animationFrame = null;
        this.verticalLines = [];
        this.diagonalLines = [];
        this.movingLinesContainer = document.querySelector('.moving-lines');
        this.init();
    }

    init() {
        this.createVerticalLines();
        this.createDiagonalLines();
        this.initParticleSystem();
        this.initCardEffects();
        this.initCursorTrail();
        this.initMagneticButtons();
        this.initScrollReveal();
        this.initGlowEffect();
        this.startAmbientAnimations();
        this.initMouseTracking();
    }

    /**
     * Create vertical moving lines
     */
    createVerticalLines() {
        const lineCount = 6;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'vertical-line';
            line.style.left = `${12 + (i * 14)}%`;
            line.style.animationDelay = `${i * 1.5}s`;
            line.style.animationDuration = `${9 + i * 2}s`;
            line.style.opacity = `${0.2 + Math.random() * 0.3}`;
            if (this.movingLinesContainer) {
                this.movingLinesContainer.appendChild(line);
            }
            this.verticalLines.push(line);
        }
    }

    /**
     * Create diagonal moving lines
     */
    createDiagonalLines() {
        const lineCount = 4;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'diagonal-line';
            const rotation = 18 + (i * 5);
            line.style.cssText = `
                position: absolute;
                width: 140%;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                top: ${25 + i * 20}%;
                left: -40%;
                transform: rotate(${rotation}deg);
                animation: diagonalMove ${13 + i * 2}s linear infinite;
                animation-delay: ${i * 2}s;
                pointer-events: none;
                filter: blur(0.5px);
            `;
            this.movingLinesContainer?.appendChild(line);
            this.diagonalLines.push(line);
        }
    }

    /**
     * Track mouse movement
     */
    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.clientX, y: e.clientY };
            this.mouseActive = true;
            
            // Reset inactivity timer
            clearTimeout(this.mouseInactiveTimer);
            this.mouseInactiveTimer = setTimeout(() => {
                this.mouseActive = false;
            }, 100);
        });
        
        // Start animation loop
        this.animateParticles();
    }

    /**
     * Create particle system that follows mouse (FIXED)
     */
    initParticleSystem() {
        const container = document.body;

        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'mouse-particle';
            const size = Math.random() * 3 + 1.5;
            const angle = (i / this.particleCount) * Math.PI * 2;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: 0;
                top: 0;
                opacity: 0;
                box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
                transition: none;
                will-change: left, top;
            `;
            
            // Store particle data
            particle._angle = angle;
            particle._radius = 35;
            particle._speed = 0.5 + Math.random() * 0.5;
            particle._offset = Math.random() * Math.PI * 2;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    /**
     * Animate particles following mouse (SMOOTH & FIXED)
     */
    animateParticles() {
        if (!this.mouseActive || (this.mousePosition.x === 0 && this.mousePosition.y === 0)) {
            // Fade out particles when mouse is inactive
            this.particles.forEach(particle => {
                if (parseFloat(particle.style.opacity) > 0) {
                    particle.style.opacity = Math.max(0, parseFloat(particle.style.opacity) - 0.03);
                }
            });
            this.animationFrame = requestAnimationFrame(() => this.animateParticles());
            return;
        }
        
        const time = Date.now() * 0.003;
        
        this.particles.forEach((particle, index) => {
            const angle = particle._angle + (time * particle._speed);
            const radius = particle._radius + Math.sin(time * 1.5 + index) * 6;
            
            const x = this.mousePosition.x + Math.cos(angle) * radius;
            const y = this.mousePosition.y + Math.sin(angle) * radius;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Smooth opacity based on distance and activity
            const targetOpacity = 0.55;
            const currentOpacity = parseFloat(particle.style.opacity) || 0;
            particle.style.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
            
            // Add subtle scaling effect
            const scale = 0.8 + Math.sin(time * 3 + index) * 0.2;
            particle.style.transform = `scale(${scale})`;
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animateParticles());
    }

    /**
     * Card hover effects
     */
    initCardEffects() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    /**
     * Cursor trail effect - smooth and minimal
     */
    initCursorTrail() {
        let trailPositions = [];
        const trailLength = 8;
        
        document.addEventListener('mousemove', (e) => {
            trailPositions.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trailPositions.length > trailLength) {
                trailPositions.shift();
            }
            
            // Clean up old trails
            const existingTrails = document.querySelectorAll('.cursor-trail');
            if (existingTrails.length > trailLength * 2) {
                existingTrails.forEach(trail => {
                    if (parseFloat(trail.style.opacity) < 0.1) {
                        trail.remove();
                    }
                });
            }
            
            // Add new trail dot
            const trailDot = document.createElement('div');
            trailDot.className = 'cursor-trail';
            const size = Math.random() * 4 + 2;
            trailDot.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                opacity: 0.6;
                box-shadow: 0 0 ${size}px rgba(255, 255, 255, 0.3);
                transition: opacity 0.2s ease;
            `;
            document.body.appendChild(trailDot);
            
            setTimeout(() => {
                trailDot.style.opacity = '0';
                setTimeout(() => {
                    if (trailDot.parentElement) trailDot.remove();
                }, 200);
            }, 300);
        });
    }

    /**
     * Magnetic button effect
     */
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
                button.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /**
     * Scroll reveal animation
     */
    initScrollReveal() {
        const elements = document.querySelectorAll('.card, header');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            if (!element.style.opacity || element.style.opacity === '0') {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(element);
                
                // Ensure visibility after timeout
                setTimeout(() => {
                    if (element.style.opacity === '0') {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                }, 300);
            }
        });
    }

    /**
     * Glow effect animation
     */
    initGlowEffect() {
        const edgeGlow = document.querySelector('.edge-glow');
        if (edgeGlow) {
            let intensity = 0;
            let increasing = true;
            
            setInterval(() => {
                if (increasing) {
                    intensity += 0.008;
                    if (intensity >= 0.25) increasing = false;
                } else {
                    intensity -= 0.008;
                    if (intensity <= 0.1) increasing = true;
                }
                
                edgeGlow.style.borderColor = `rgba(255, 255, 255, ${0.12 + intensity})`;
            }, 80);
        }
    }

    /**
     * Start ambient animations
     */
    startAmbientAnimations() {
        // Animate dots with pulse effect
        const dots = document.querySelectorAll('.dot');
        let dotIndex = 0;
        
        setInterval(() => {
            if (dots.length > 0) {
                dots[dotIndex % dots.length].style.transform = 'scale(1.5)';
                dots[dotIndex % dots.length].style.opacity = '1';
                setTimeout(() => {
                    if (dots[dotIndex % dots.length]) {
                        dots[dotIndex % dots.length].style.transform = 'scale(1)';
                        dots[dotIndex % dots.length].style.opacity = '0.7';
                    }
                }, 150);
                dotIndex++;
            }
        }, 800);
        
        // Random card glow
        setInterval(() => {
            const cards = document.querySelectorAll('.card');
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            if (randomCard) {
                randomCard.style.transition = 'box-shadow 0.2s ease';
                randomCard.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.15)';
                setTimeout(() => {
                    randomCard.style.boxShadow = '';
                }, 400);
            }
        }, 4500);
        
        // Animate status badge pulse dot
        const pulseDot = document.querySelector('.pulse-dot');
        if (pulseDot) {
            setInterval(() => {
                pulseDot.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    pulseDot.style.transform = 'scale(1)';
                }, 200);
            }, 1500);
        }
    }

    /**
     * Clean up animation frame on page unload
     */
    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize animations when DOM is ready
let animationsInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    animationsInstance = new VelvetAnimations();
    console.log('✨ Velvet Vendetta - Animations Active');
    console.log('🎯 Features: Mouse particles, cursor trail, magnetic buttons, dynamic background');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationsInstance) {
        animationsInstance.cleanup();
    }
});