// GSAP ScrollTrigger Registration
gsap.registerPlugin(ScrollTrigger);

// Three.js Background Animation
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;

        const color = new THREE.Color();
        color.setHSL(0, 0, Math.random() * 0.5 + 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
}

// Particle.js Configuration
function initParticlesJS() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Canvas-based Particle Effect on Heading Hover
class HeadingParticleEffect {
    constructor(element) {
        this.element = element;
        this.canvas = null;
        this.ctx = null;
        this.particlesArray = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.isInitialized = false;
        this.rect = null;
        this.scrollHandler = null;
        this.resizeHandler = null;
        this.mouseMoveHandler = null;
        this.mouseLeaveHandler = null;
        
        this.init();
    }

    init() {
        // Lazy load - only create canvas on hover
        this.mouseEnterHandler = () => {
            // Hide all other heading canvases to prevent overlap
            document.querySelectorAll('.heading-particle-canvas.show').forEach(canvas => {
                if (canvas !== this.canvas) {
                    canvas.classList.remove('show');
                }
            });
            
            if (!this.isInitialized) {
                // Wait for fonts to load before creating canvas
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => {
                        this.setupCanvas();
                        // After canvas is created, show it and start animation
                        if (this.canvas) {
                            this.canvas.classList.add('show');
                            this.animate();
                        }
                    });
                } else {
                    setTimeout(() => {
                        this.setupCanvas();
                        // After canvas is created, show it and start animation
                        if (this.canvas) {
                            this.canvas.classList.add('show');
                            this.animate();
                        }
                    }, 100);
                }
            } else if (this.canvas) {
                // Canvas already exists, just show it and start animation
                this.canvas.classList.add('show');
                if (!this.animationId) {
                    this.animate();
                }
            }
        };

        this.mouseMoveHandler = (e) => {
            if (this.rect && this.canvas && this.isInitialized) {
                const canvasRect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - canvasRect.left;
                this.mouse.y = e.clientY - canvasRect.top;
            }
        };

        this.mouseLeaveHandler = () => {
            this.mouse.x = null;
            this.mouse.y = null;
            // Hide canvas when not hovering
            if (this.canvas) {
                this.canvas.classList.remove('show');
            }
            // Stop animation to save performance
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        };

        this.element.addEventListener('mouseenter', this.mouseEnterHandler);
        this.element.addEventListener('mousemove', this.mouseMoveHandler);
        this.element.addEventListener('mouseleave', this.mouseLeaveHandler);
    }

    setupCanvas() {
        // Prevent multiple initializations
        if (this.canvas && this.isInitialized) {
            return;
        }
        
        // Clean up existing canvas if any
        if (this.canvas) {
            this.canvas.remove();
        }
        
        // Get element position and size
        this.rect = this.element.getBoundingClientRect();
        
        if (this.rect.width === 0 || this.rect.height === 0) {
            // Element not visible yet, retry later
            setTimeout(() => this.setupCanvas(), 200);
            return;
        }
        
        // Create canvas - completely hidden by default
        // Add unique ID to track which element this canvas belongs to
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'heading-particle-canvas';
        const headingId = this.element.textContent.trim().substring(0, 30).replace(/\s+/g, '_');
        this.canvas.setAttribute('data-heading-id', headingId);
        this.canvas.setAttribute('data-heading-element', headingId);
        
        // Use absolute positioning relative to the element's container
        const parentRect = this.element.parentElement.getBoundingClientRect();
        const relativeTop = this.rect.top - parentRect.top;
        const relativeLeft = this.rect.left - parentRect.left;
        
        this.canvas.style.cssText = `
            position: absolute;
            top: ${relativeTop}px;
            left: ${relativeLeft}px;
            width: ${this.rect.width}px;
            height: ${this.rect.height}px;
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            display: none;
            visibility: hidden;
        `;
        
        // Append to the element's parent to maintain positioning context
        const parent = this.element.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size (high DPI support)
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.rect.width * dpr;
        this.canvas.height = this.rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = this.rect.width + 'px';
        this.canvas.style.height = this.rect.height + 'px';
        
        // Get computed styles for font
        const computedStyle = window.getComputedStyle(this.element);
        const fontSize = computedStyle.fontSize;
        const fontFamily = computedStyle.fontFamily;
        const fontWeight = computedStyle.fontWeight;
        const fontStyle = computedStyle.fontStyle;
        const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(fontSize) * 1.2;
        
        // Set font
        this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Clear canvas first
        this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
        
        // Set base font from element
        this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
        this.ctx.fillStyle = 'white';
        
        // Handle multi-line text - only get direct children of THIS element
        const childElements = Array.from(this.element.children);
        let textY = 0;
        
        if (childElements.length > 0 && childElements.some(child => child.classList.contains('title-line') || child.tagName === 'SPAN')) {
            // Multi-line heading (like hero title with title-line spans)
            childElements.forEach((child) => {
                // Only process if it's a direct child
                if (child.parentElement !== this.element) return;
                
                const childText = child.textContent.trim();
                if (childText) {
                    // Get child's computed style for accurate positioning
                    const childStyle = window.getComputedStyle(child);
                    const childFontSize = childStyle.fontSize || fontSize;
                    const childFontFamily = childStyle.fontFamily || fontFamily;
                    const childFontWeight = childStyle.fontWeight || fontWeight;
                    const childFontStyle = childStyle.fontStyle || fontStyle;
                    
                    // Set font for this child
                    this.ctx.font = `${childFontStyle} ${childFontWeight} ${childFontSize} ${childFontFamily}`;
                    
                    // Measure text to center if needed
                    const textWidth = this.ctx.measureText(childText).width;
                    const textAlign = computedStyle.textAlign;
                    let textX = 0;
                    
                    if (textAlign === 'center') {
                        textX = (this.rect.width - textWidth) / 2;
                    }
                    
                    this.ctx.fillText(childText, textX, textY);
                    textY += parseFloat(childStyle.lineHeight) || lineHeight;
                }
            });
        } else {
            // Single line heading - use element's textContent (includes all nested text)
            const text = this.element.textContent.trim();
            const textAlign = computedStyle.textAlign;
            let textX = 0;
            
            if (textAlign === 'center') {
                const textWidth = this.ctx.measureText(text).width;
                textX = (this.rect.width - textWidth) / 2;
            }
            
            this.ctx.fillText(text, textX, 0);
        }
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.rect.width, this.rect.height);
        
        // Create particles from image data - optimized with larger gap
        const gap = 4; // Increased gap for better performance
        const maxParticles = 500; // Limit particles for performance
        let particleCount = 0;
        
        for (let y = 0; y < imageData.height && particleCount < maxParticles; y += gap) {
            for (let x = 0; x < imageData.width && particleCount < maxParticles; x += gap) {
                const index = (y * 4 * imageData.width) + (x * 4);
                const alpha = imageData.data[index + 3];
                
                if (alpha > 150) {
                    this.particlesArray.push(new Particle(x, y, this.rect.left, this.rect.top));
                    particleCount++;
                }
            }
        }
        
        // Clear canvas for animation
        this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
        
        // Mark as initialized - DO NOT show canvas yet, wait for hover
        this.isInitialized = true;
        
        // Canvas should remain hidden until hover
        // Animation will start when mouse enters
        
        // Update position on scroll/resize (with debounce) - only add once
        if (!this.scrollHandler) {
            let scrollTimeout;
            this.scrollHandler = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => this.updatePosition(), 10);
            };
            window.addEventListener('scroll', this.scrollHandler, { passive: true });
        }
        
        // Resize handler - will be handled globally
    }

    updatePosition() {
        if (!this.canvas || !this.rect || !this.isInitialized) return;
        
        const newRect = this.element.getBoundingClientRect();
        const parent = this.element.parentElement;
        
        if (!parent) return;
        
        const parentRect = parent.getBoundingClientRect();
        const relativeTop = newRect.top - parentRect.top;
        const relativeLeft = newRect.left - parentRect.left;
        
        // Check if size changed significantly (need to recreate)
        if (Math.abs(newRect.width - this.rect.width) > 10 ||
            Math.abs(newRect.height - this.rect.height) > 10) {
            // Don't recreate on every scroll, only on significant size change
            return;
        }
        
        // Always update position to stay in sync
        if (this.canvas) {
            this.canvas.style.top = relativeTop + 'px';
            this.canvas.style.left = relativeLeft + 'px';
        }
        
        // Update rect for next comparison
        this.rect = newRect;
    }

    animate() {
        if (!this.ctx || !this.canvas || !this.isInitialized) {
            this.animationId = null;
            return;
        }
        
        // Only animate if canvas is visible and has 'show' class
        if (!this.canvas.classList.contains('show')) {
            this.animationId = null;
            // Clear canvas when hidden
            const dpr = window.devicePixelRatio || 1;
            this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
            return;
        }
        
        // Check computed style to ensure it's actually visible
        const computedStyle = window.getComputedStyle(this.canvas);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || parseFloat(computedStyle.opacity) === 0) {
            this.animationId = null;
            return;
        }
        
        // Clear canvas
        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
        
        // Draw particles only when visible
        if (this.particlesArray.length > 0) {
            this.particlesArray.forEach(particle => {
                particle.update(this.mouse);
                particle.draw(this.ctx);
            });
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        if (this.mouseMoveHandler) {
            this.element.removeEventListener('mousemove', this.mouseMoveHandler);
            this.mouseMoveHandler = null;
        }
        if (this.mouseEnterHandler) {
            this.element.removeEventListener('mouseenter', this.mouseEnterHandler);
            this.mouseEnterHandler = null;
        }
        if (this.mouseLeaveHandler) {
            this.element.removeEventListener('mouseleave', this.mouseLeaveHandler);
            this.mouseLeaveHandler = null;
        }
        this.particlesArray = [];
    }
}

// Particle class for canvas-based effect
class Particle {
    constructor(x, y, offsetX, offsetY) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.size = 2;
        this.density = Math.random() * 40 + 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'white';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update(mouse) {
        if (mouse.x === null || mouse.y === null) {
            // Return to original position smoothly
            this.x += (this.baseX - this.x) * 0.1;
            this.y += (this.baseY - this.y) * 0.1;
            return;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let forceX = (dx / distance) * force * this.density * 0.1;
            let forceY = (dy / distance) * force * this.density * 0.1;
            
            this.x -= forceX;
            this.y -= forceY;
        } else {
            // Return to original position smoothly
            this.x += (this.baseX - this.x) * 0.1;
            this.y += (this.baseY - this.y) * 0.1;
        }
    }
}

// Store heading particle effects for cleanup
let headingParticleEffects = [];

// Initialize particle effects on all headings - DISABLED
function initHeadingParticles() {
    // Particle effects disabled - no initialization
    headingParticleEffects = [];
}

// Global resize handler for all heading particles
let globalResizeTimeout;
function handleGlobalResize() {
    clearTimeout(globalResizeTimeout);
    globalResizeTimeout = setTimeout(() => {
        headingParticleEffects.forEach(effect => {
            if (effect && effect.canvas) {
                // Temporarily disable animation
                const wasInitialized = effect.isInitialized;
                effect.isInitialized = false;
                
                // Clean up
                if (effect.animationId) {
                    cancelAnimationFrame(effect.animationId);
                    effect.animationId = null;
                }
                
                // Recreate
                effect.particlesArray = [];
                effect.rect = null;
                
                // Wait a bit then recreate
                setTimeout(() => {
                    effect.setupCanvas();
                }, 100);
            }
        });
    }, 250);
}

// GSAP Animations
function initGSAPAnimations() {
    // Hero animations
    gsap.from('.hero-title .title-line', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power4.out'
    });

    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.stat-item', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        delay: 0.8,
        ease: 'back.out(1.7)'
    });

    gsap.from('.hero-cta .btn', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        delay: 1.2,
        ease: 'power3.out'
    });

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });

    // Service cards animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Number cards animation
    gsap.utils.toArray('.number-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // Portfolio items animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });

    // Testimonial cards animation
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Feature items animation
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    // Mentor section animation
    gsap.from('.mentor-image-wrapper', {
        scrollTrigger: {
            trigger: '.mentor-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 1,
        x: -100,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.mentor-info', {
        scrollTrigger: {
            trigger: '.mentor-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 1,
        x: 100,
        opacity: 0,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.utils.toArray('.mentor-stat').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: '.mentor-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            duration: 0.6,
            scale: 0.8,
            opacity: 0,
            delay: 0.4 + index * 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // Navbar animation
    gsap.from('.navbar', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power3.out'
    });

    // Scroll indicator animation
    gsap.to('.scroll-line', {
        duration: 2,
        height: 60,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initParticlesJS();
    initGSAPAnimations();
    initHeadingParticles();
    initSmoothScroll();
    initMobileMenu();
});

// Handle window resize - consolidate all resize handlers
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Three.js resize
        if (renderer && camera) {
            onWindowResize();
        }
        // Heading particles resize
        handleGlobalResize();
    }, 250);
}, { passive: true });

