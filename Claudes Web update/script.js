document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initParticles();
    initTypewriter();
    initScrollReveal();
    initParallax();
    initCounters();
    initContactForm();
});

function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!navToggle || !mobileMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: null, y: null };
    const COUNT = 80, CONN = 150, MOUSE_R = 200;
    const COLORS = ['79,143,255', '167,139,250'];
    
    function resize() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        w = canvas.width = hero.offsetWidth;
        h = canvas.height = hero.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize, { passive: true });
    
    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.r = Math.random() * 2 + 1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},0.6)`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},0.08)`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
    }
    
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    }, { passive: true });
    
    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONN) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(79,143,255,${0.12 * (1 - dist / CONN)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < MOUSE_R) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(79,143,255,${0.25 * (1 - dist / MOUSE_R)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    
    const words = ['Plumbers', 'Salons', 'Restaurants', 'Barbers', 'Contractors', 'Real Estate Agents'];
    let wi = 0, ci = 0, del = false;
    
    function type() {
        const w = words[wi];
        if (!del) {
            el.textContent = w.substring(0, ci + 1);
            ci++;
            if (ci === w.length) {
                del = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 80);
        } else {
            el.textContent = w.substring(0, ci - 1);
            ci--;
            if (ci === 0) {
                del = false;
                wi = (wi + 1) % words.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 40);
        }
    }
    
    type();
}

function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY < hero.offsetHeight) {
            hero.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
    }, { passive: true });
}

function initCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                let current = 0;
                const step = target / (1500 / 16);
                
                function count() {
                    current += step;
                    if (current >= target) {
                        el.textContent = prefix + target + suffix;
                        return;
                    }
                    el.textContent = prefix + Math.floor(current) + suffix;
                    requestAnimationFrame(count);
                }
                
                count();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

async function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async e => {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const text = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.btn-spinner');
        
        text.textContent = 'Sending...';
        spinner.style.display = 'inline-block';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        
        const data = {
            name: document.getElementById('name').value.trim(),
            business: document.getElementById('business')?.value.trim() || '',
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone')?.value.trim() || '',
            message: document.getElementById('message').value.trim(),
            service: ''
        };
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            
            if (res.ok) {
                text.textContent = 'Message Sent';
                setTimeout(() => {
                    text.textContent = 'Send Message';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    form.reset();
                }, 2500);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            text.textContent = 'Error - Try Again';
            btn.disabled = false;
            btn.style.opacity = '1';
            setTimeout(() => {
                text.textContent = 'Send Message';
            }, 3000);
        } finally {
            spinner.style.display = 'none';
        }
    });
}
