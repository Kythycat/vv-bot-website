/**
 * Velvet Vendetta - Space Animation System
 * Moving star field with optimized performance
 */

class SpaceBackground {
    constructor() {
        this.canvas = document.getElementById('spaceCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starCount = 200;
        this.comet = null;
        this.animationId = null;
        this.isMobile = window.innerWidth < 768;
        
        // Adjust star count for mobile performance
        if (this.isMobile) {
            this.starCount = 100;
        }
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createStars();
        this.createComet();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.isMobile = window.innerWidth < 768;
        });
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * (this.isMobile ? 1.2 : 1.8) + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    createComet() {
        this.comet = {
            active: false,
            x: 0,
            y: 0,
            length: 40,
            speed: 2.5,
            resetTimer: 0
        };
        
        // Schedule first comet
        setTimeout(() => this.activateComet(), 5000 + Math.random() * 8000);
    }
    
    activateComet() {
        if (!this.comet) return;
        
        this.comet.active = true;
        this.comet.x = -50;
        this.comet.y = Math.random() * (this.canvas.height * 0.4) + 20;
        this.comet.speed = 2.5 + Math.random() * 1.5;
        this.comet.length = 35 + Math.random() * 20;
        
        // Schedule next comet
        setTimeout(() => {
            if (this.comet) {
                this.comet.active = false;
                setTimeout(() => this.activateComet(), 8000 + Math.random() * 12000);
            }
        }, 4000);
    }
    
    updateStars() {
        const time = Date.now() * 0.002;
        
        for (let star of this.stars) {
            // Move stars slowly to create depth effect
            star.x -= star.speed * 0.3;
            
            // Reset stars that go off screen
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
            
            // Twinkling effect
            star.currentAlpha = star.alpha + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.2;
            star.currentAlpha = Math.max(0.15, Math.min(0.9, star.currentAlpha));
        }
    }
    
    updateComet() {
        if (!this.comet || !this.comet.active) return;
        
        this.comet.x += this.comet.speed;
        
        if (this.comet.x > this.canvas.width + 100) {
            this.comet.active = false;
        }
    }
    
    drawStars() {
        for (let star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.currentAlpha || star.alpha})`;
            this.ctx.fill();
        }
    }
    
    drawComet() {
        if (!this.comet || !this.comet.active) return;
        
        const gradient = this.ctx.createLinearGradient(
            this.comet.x, this.comet.y,
            this.comet.x - this.comet.length, this.comet.y - this.comet.length * 0.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.comet.x, this.comet.y);
        this.ctx.lineTo(this.comet.x - this.comet.length, this.comet.y - this.comet.length * 0.5);
        this.ctx.lineTo(this.comet.x - this.comet.length * 0.7, this.comet.y + this.comet.length * 0.3);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Comet head
        this.ctx.beginPath();
        this.ctx.arc(this.comet.x, this.comet.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fill();
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateStars();
        this.updateComet();
        this.drawStars();
        this.drawComet();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/**
 * Velvet Vendetta - Animation System (Optimized)
 */
class VelvetAnimations {
    constructor() {
        this.particles = [];
        this.particleCount = 35; // Reduced for performance
        this.mousePosition = { x: 0, y: 0 };
        this.mouseActive = false;
        this.animationFrame = null;
        this.verticalLines = [];
        this.diagonalLines = [];
        this.movingLinesContainer = document.querySelector('.moving-lines');
        this.isMobile = window.innerWidth < 768;
        
        if (this.isMobile) {
            this.particleCount = 20;
        }
        
        this.init();
    }
    
    init() {
        if (!this.isMobile) {
            this.createVerticalLines();
            this.createDiagonalLines();
        }
        this.initParticleSystem();
        this.initCardEffects();
        this.initCursorTrail();
        this.initMagneticButtons();
        this.initScrollReveal();
        this.initGlowEffect();
        this.startAmbientAnimations();
        this.initMouseTracking();
    }
    
    createVerticalLines() {
        const lineCount = this.isMobile ? 3 : 5;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'vertical-line';
            line.style.left = `${15 + (i * 18)}%`;
            line.style.animationDelay = `${i * 1.5}s`;
            line.style.animationDuration = `${10 + i * 2}s`;
            if (this.movingLinesContainer) {
                this.movingLinesContainer.appendChild(line);
            }
            this.verticalLines.push(line);
        }
    }
    
    createDiagonalLines() {
        const lineCount = this.isMobile ? 2 : 3;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'diagonal-line';
            line.style.cssText = `
                position: absolute;
                width: 150%;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                top: ${30 + i * 25}%;
                left: -40%;
                transform: rotate(${18 + i * 5}deg);
                animation: diagonalMove ${14 + i * 2}s linear infinite;
                animation-delay: ${i * 2}s;
                pointer-events: none;
            `;
            this.movingLinesContainer?.appendChild(line);
            this.diagonalLines.push(line);
        }
    }
    
    initMouseTracking() {
        let lastMoveTime = 0;
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime > 16) { // Throttle to ~60fps
                this.mousePosition = { x: e.clientX, y: e.clientY };
                this.mouseActive = true;
                lastMoveTime = now;
            }
            
            clearTimeout(this.mouseInactiveTimer);
            this.mouseInactiveTimer = setTimeout(() => {
                this.mouseActive = false;
            }, 100);
        });
        
        this.animateParticles();
    }
    
    initParticleSystem() {
        const container = document.body;
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'mouse-particle';
            const size = Math.random() * 2.5 + 1;
            const angle = (i / this.particleCount) * Math.PI * 2;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: 0;
                top: 0;
                opacity: 0;
                will-change: left, top;
            `;
            
            particle._angle = angle;
            particle._radius = 28;
            particle._speed = 0.4 + Math.random() * 0.4;
            particle._offset = Math.random() * Math.PI * 2;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animateParticles() {
        if (!this.mouseActive || this.isMobile) {
            this.particles.forEach(particle => {
                if (parseFloat(particle.style.opacity) > 0) {
                    particle.style.opacity = Math.max(0, parseFloat(particle.style.opacity) - 0.04);
                }
            });
            this.animationFrame = requestAnimationFrame(() => this.animateParticles());
            return;
        }
        
        const time = Date.now() * 0.003;
        
        this.particles.forEach((particle, index) => {
            const angle = particle._angle + (time * particle._speed);
            const radius = particle._radius + Math.sin(time * 1.2 + index) * 4;
            
            const x = this.mousePosition.x + Math.cos(angle) * radius;
            const y = this.mousePosition.y + Math.sin(angle) * radius;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const targetOpacity = 0.5;
            const currentOpacity = parseFloat(particle.style.opacity) || 0;
            particle.style.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.12;
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animateParticles());
    }
    
    initCardEffects() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    card.style.transition = 'all 0.3s ease';
                }
            });
        });
    }
    
    initCursorTrail() {
        if (this.isMobile) return;
        
        let trailTimeout = null;
        
        document.addEventListener('mousemove', (e) => {
            if (trailTimeout) clearTimeout(trailTimeout);
            
            const trailDot = document.createElement('div');
            trailDot.className = 'cursor-trail';
            const size = Math.random() * 3 + 1.5;
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
                opacity: 0.5;
                transition: opacity 0.15s ease;
            `;
            document.body.appendChild(trailDot);
            
            trailTimeout = setTimeout(() => {
                trailDot.style.opacity = '0';
                setTimeout(() => {
                    if (trailDot.parentElement) trailDot.remove();
                }, 150);
            }, 200);
        });
    }
    
    initMagneticButtons() {
        if (this.isMobile) return;
        
        const buttons = document.querySelectorAll('.button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                button.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0px, 0px)';
            });
        });
    }
    
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
            element.style.opacity = '0';
            element.style.transform = 'translateY(15px)';
            element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(element);
            
            setTimeout(() => {
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }, 200);
        });
    }
    
    initGlowEffect() {
        const edgeGlow = document.querySelector('.edge-glow');
        if (edgeGlow) {
            let intensity = 0;
            let increasing = true;
            
            setInterval(() => {
                if (increasing) {
                    intensity += 0.006;
                    if (intensity >= 0.2) increasing = false;
                } else {
                    intensity -= 0.006;
                    if (intensity <= 0.08) increasing = true;
                }
                
                edgeGlow.style.borderColor = `rgba(255, 255, 255, ${0.1 + intensity})`;
            }, 100);
        }
    }
    
    startAmbientAnimations() {
        // Animate dots (reduced frequency for performance)
        const dots = document.querySelectorAll('.dot');
        let dotIndex = 0;
        
        setInterval(() => {
            if (dots.length > 0 && !this.isMobile) {
                const dot = dots[dotIndex % dots.length];
                if (dot) {
                    dot.style.transform = 'scale(1.4)';
                    setTimeout(() => {
                        if (dot) dot.style.transform = 'scale(1)';
                    }, 120);
                }
                dotIndex++;
            }
        }, 1200);
        
        // Random card glow
        setInterval(() => {
            if (!this.isMobile) {
                const cards = document.querySelectorAll('.card');
                const randomCard = cards[Math.floor(Math.random() * cards.length)];
                if (randomCard) {
                    randomCard.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
                    setTimeout(() => {
                        randomCard.style.boxShadow = '';
                    }, 300);
                }
            }
        }, 5000);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize when DOM is ready
let spaceBg = null;
let animations = null;

document.addEventListener('DOMContentLoaded', () => {
    spaceBg = new SpaceBackground();
    animations = new VelvetAnimations();
    console.log('✨ Velvet Vendetta - Space System Active');
});

window.addEventListener('beforeunload', () => {
    if (spaceBg) spaceBg.destroy();
    if (animations) animations.destroy();
});