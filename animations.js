/**
 * Velvet Vendetta - Space Animation System
 * Enhanced comet particles with trailing effects
 */

class SpaceBackground {
    constructor() {
        this.canvas = document.getElementById('spaceCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.comets = [];
        this.starCount = 200;
        this.animationId = null;
        this.isMobile = window.innerWidth < 768;
        
        if (this.isMobile) {
            this.starCount = 100;
        }
        
        this.init();
        this.observeThemeChanges();
    }
    
    init() {
        this.resizeCanvas();
        this.createStars();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.isMobile = window.innerWidth < 768;
        });
        
        this.animate();
        this.startCometGenerator();
    }
    
    observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateStarColors();
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    }
    
    getStarColor() {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            return 'rgba(255, 255, 255, ';
        } else {
            return 'rgba(0, 0, 0, ';
        }
    }
    
    getCometColor() {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            return { particle: 'rgba(255, 255, 255, ', core: 'rgba(255, 255, 255, 0.9)' };
        } else {
            return { particle: 'rgba(0, 0, 0, ', core: 'rgba(0, 0, 0, 0.8)' };
        }
    }
    
    updateStarColors() {
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
                radius: Math.random() * (this.isMobile ? 1.5 : 2.2) + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.2 + 0.05,
                twinkleSpeed: Math.random() * 0.02 + 0.008,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    createComet() {
        const comet = {
            x: -100,
            y: Math.random() * (this.canvas.height * 0.5) + 50,
            speed: 3.5 + Math.random() * 2,
            particles: [],
            active: true,
            age: 0,
            maxAge: 120,
            angle: 25 + (Math.random() - 0.5) * 15
        };
        
        for (let i = 0; i < 25; i++) {
            comet.particles.push({
                x: comet.x - i * 3,
                y: comet.y - (i * 3) * Math.tan(comet.angle * Math.PI / 180),
                life: 1 - (i / 25),
                size: Math.random() * 2 + 1
            });
        }
        
        this.comets.push(comet);
        
        setTimeout(() => {
            if (this.comets.length < 3) {
                this.createComet();
            }
        }, 8000 + Math.random() * 10000);
    }
    
    startCometGenerator() {
        setTimeout(() => this.createComet(), 3000);
        setInterval(() => {
            if (this.comets.length < 2 && !this.isMobile) {
                this.createComet();
            }
        }, 12000);
    }
    
    updateStars() {
        const time = Date.now() * 0.002;
        
        for (let star of this.stars) {
            star.x -= star.speed;
            
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
            
            star.currentAlpha = star.alpha + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.2;
            star.currentAlpha = Math.max(0.15, Math.min(0.9, star.currentAlpha));
        }
    }
    
    updateComets() {
        for (let i = this.comets.length - 1; i >= 0; i--) {
            const comet = this.comets[i];
            comet.age++;
            
            const rad = comet.angle * Math.PI / 180;
            comet.x += comet.speed * Math.cos(rad);
            comet.y += comet.speed * Math.sin(rad);
            
            comet.particles.unshift({
                x: comet.x,
                y: comet.y,
                life: 1,
                size: Math.random() * 2.5 + 1
            });
            
            if (comet.particles.length > 35) {
                comet.particles.pop();
            }
            
            for (let p of comet.particles) {
                p.life -= 0.03;
            }
            
            comet.particles = comet.particles.filter(p => p.life > 0);
            
            if (comet.x > this.canvas.width + 200 || comet.y > this.canvas.height + 200 || comet.age > comet.maxAge) {
                this.comets.splice(i, 1);
            }
        }
    }
    
    drawStars() {
        const starColor = this.getStarColor();
        
        for (let star of this.stars) {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `${starColor}${star.currentAlpha || star.alpha})`;
            this.ctx.fill();
            
            if (star.radius > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius * 1.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `${starColor}${(star.currentAlpha || star.alpha) * 0.3})`;
                this.ctx.fill();
            }
        }
    }
    
    drawComets() {
        const cometColor = this.getCometColor();
        
        for (const comet of this.comets) {
            for (let i = 0; i < comet.particles.length; i++) {
                const p = comet.particles[i];
                const alpha = p.life * 0.7;
                const size = p.size * p.life;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2);
                gradient.addColorStop(0, `${cometColor.particle}${alpha * 0.9})`);
                gradient.addColorStop(1, `${cometColor.particle}0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
            
            this.ctx.beginPath();
            this.ctx.arc(comet.x, comet.y, 3.5, 0, Math.PI * 2);
            const headGradient = this.ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 8);
            headGradient.addColorStop(0, cometColor.core);
            headGradient.addColorStop(0.5, `${cometColor.particle}0.7)`);
            headGradient.addColorStop(1, `${cometColor.particle}0)`);
            this.ctx.fillStyle = headGradient;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(comet.x, comet.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = cometColor.core;
            this.ctx.fill();
        }
    }
    
    drawShootingStars() {
        if (Math.random() < 0.002 && !this.isMobile && this.comets.length < 3) {
            this.createComet();
        }
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateStars();
        this.updateComets();
        this.drawStars();
        this.drawComets();
        this.drawShootingStars();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

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
        this.isMobile = window.innerWidth < 768;
        
        if (this.isMobile) {
            this.particleCount = 25;
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
        const lineCount = this.isMobile ? 3 : 6;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'vertical-line';
            line.style.left = `${12 + (i * 15)}%`;
            line.style.animationDelay = `${i * 1.2}s`;
            line.style.animationDuration = `${9 + i * 2}s`;
            if (this.movingLinesContainer) {
                this.movingLinesContainer.appendChild(line);
            }
            this.verticalLines.push(line);
        }
    }
    
    createDiagonalLines() {
        const lineCount = this.isMobile ? 2 : 4;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'diagonal-line';
            line.style.cssText = `
                position: absolute;
                width: 150%;
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--line-color, rgba(0,0,0,0.2)), transparent);
                top: ${25 + i * 22}%;
                left: -40%;
                transform: rotate(${18 + i * 6}deg);
                animation: diagonalMove ${14 + i * 2}s linear infinite;
                animation-delay: ${i * 1.5}s;
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
            if (now - lastMoveTime > 16) {
                this.mousePosition = { x: e.clientX, y: e.clientY };
                this.mouseActive = true;
                lastMoveTime = now;
            }
            
            clearTimeout(this.mouseInactiveTimer);
            this.mouseInactiveTimer = setTimeout(() => {
                this.mouseActive = false;
            }, 150);
        });
        
        this.animateParticles();
    }
    
    getParticleColor() {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            return 'rgba(255, 255, 255, 0.7)';
        } else {
            return 'rgba(0, 0, 0, 0.6)';
        }
    }
    
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
                background: ${this.getParticleColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: 0;
                top: 0;
                opacity: 0;
                will-change: left, top;
                transition: opacity 0.05s ease;
            `;
            
            particle._angle = angle;
            particle._radius = 32;
            particle._speed = 0.5 + Math.random() * 0.5;
            particle._offset = Math.random() * Math.PI * 2;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newColor = this.getParticleColor();
                    this.particles.forEach(particle => {
                        particle.style.background = newColor;
                    });
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    }
    
    animateParticles() {
        if (!this.mouseActive || this.isMobile) {
            this.particles.forEach(particle => {
                if (parseFloat(particle.style.opacity) > 0) {
                    particle.style.opacity = Math.max(0, parseFloat(particle.style.opacity) - 0.05);
                }
            });
            this.animationFrame = requestAnimationFrame(() => this.animateParticles());
            return;
        }
        
        const time = Date.now() * 0.003;
        
        this.particles.forEach((particle, index) => {
            const angle = particle._angle + (time * particle._speed);
            const radius = particle._radius + Math.sin(time * 1.2 + index) * 6;
            
            const x = this.mousePosition.x + Math.cos(angle) * radius;
            const y = this.mousePosition.y + Math.sin(angle) * radius;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const targetOpacity = 0.65;
            const currentOpacity = parseFloat(particle.style.opacity) || 0;
            particle.style.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.12;
            
            const scale = 0.8 + Math.sin(time * 2.5 + index) * 0.3;
            particle.style.transform = `scale(${scale})`;
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
        
        document.addEventListener('mousemove', (e) => {
            const trailDot = document.createElement('div');
            trailDot.className = 'cursor-trail';
            const size = Math.random() * 4 + 2;
            const theme = document.body.getAttribute('data-theme');
            const trailColor = theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
            
            trailDot.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${trailColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                opacity: 0.6;
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
    
    initMagneticButtons() {
        if (this.isMobile) return;
        
        const buttons = document.querySelectorAll('.button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
                button.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0px, 0px) scale(1)';
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
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
            
            setTimeout(() => {
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }, 300);
        });
    }
    
    initGlowEffect() {
        const edgeGlow = document.querySelector('.edge-glow');
        if (edgeGlow) {
            let intensity = 0;
            let increasing = true;
            
            setInterval(() => {
                if (increasing) {
                    intensity += 0.008;
                    if (intensity >= 0.22) increasing = false;
                } else {
                    intensity -= 0.008;
                    if (intensity <= 0.08) increasing = true;
                }
                
                const theme = document.body.getAttribute('data-theme');
                const borderAlpha = theme === 'dark' ? 0.12 + intensity : 0.08 + intensity * 0.5;
                edgeGlow.style.borderColor = `rgba(0, 0, 0, ${borderAlpha})`;
                
                if (theme === 'dark') {
                    edgeGlow.style.borderColor = `rgba(255, 255, 255, ${0.12 + intensity})`;
                }
            }, 100);
        }
    }
    
    startAmbientAnimations() {
        const dots = document.querySelectorAll('.glow-dot');
        let dotIndex = 0;
        
        setInterval(() => {
            if (dots.length > 0 && !this.isMobile) {
                const dot = dots[dotIndex % dots.length];
                if (dot) {
                    dot.style.transform = 'scale(1.6)';
                    dot.style.opacity = '1';
                    setTimeout(() => {
                        if (dot) {
                            dot.style.transform = 'scale(1)';
                            dot.style.opacity = '0.7';
                        }
                    }, 150);
                }
                dotIndex++;
            }
        }, 1000);
        
        setInterval(() => {
            if (!this.isMobile) {
                const cards = document.querySelectorAll('.card');
                const randomCard = cards[Math.floor(Math.random() * cards.length)];
                if (randomCard) {
                    const theme = document.body.getAttribute('data-theme');
                    const shadowColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
                    randomCard.style.boxShadow = `0 0 35px ${shadowColor}`;
                    setTimeout(() => {
                        randomCard.style.boxShadow = '';
                    }, 400);
                }
            }
        }, 6000);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

let spaceBg = null;
let animations = null;

document.addEventListener('DOMContentLoaded', () => {
    spaceBg = new SpaceBackground();
    animations = new VelvetAnimations();
    console.log('Velvet Vendetta - Space System Active');
});

window.addEventListener('beforeunload', () => {
    if (spaceBg) spaceBg.destroy();
    if (animations) animations.destroy();
});