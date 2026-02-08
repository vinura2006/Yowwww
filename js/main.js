/* ============================================
   Will You Be My Wife, Mindu? 💖
   Main JavaScript - All Interactions
   ============================================ */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get random number between min and max
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Get random item from array
 */
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Check if reduced motion is preferred
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Vibrate device if supported
 */
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================

function initFloatingHearts() {
    if (prefersReducedMotion()) return;

    const container = document.getElementById('floating-hearts');
    if (!container) return;

    const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '🌹', '✨'];
    const heartCount = window.innerWidth < 768 ? 15 : 25;

    for (let i = 0; i < heartCount; i++) {
        createFloatingHeart(container, hearts);
    }

    // Continuously add hearts
    setInterval(() => {
        if (container.children.length < heartCount) {
            createFloatingHeart(container, hearts);
        }
    }, 2000);
}

function createFloatingHeart(container, hearts) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = randomFrom(hearts);
    heart.style.left = `${randomBetween(0, 100)}%`;
    heart.style.fontSize = `${randomBetween(16, 32)}px`;
    heart.style.opacity = randomBetween(0.3, 0.7);
    heart.style.animationDuration = `${randomBetween(8, 15)}s`;
    heart.style.animationDelay = `${randomBetween(0, 5)}s`;

    container.appendChild(heart);

    // Remove after animation
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// ============================================
// INTRO PAGE ANIMATIONS
// ============================================

function initIntroAnimations() {
    const messageContainer = document.getElementById('intro-message');
    if (!messageContainer) return;

    const paragraphs = messageContainer.querySelectorAll('p');
    const ctaButton = document.getElementById('intro-cta');

    paragraphs.forEach((p, index) => {
        const delay = parseInt(p.dataset.delay) || (index * 1500);

        setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
            p.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }, delay);
    });

    // Show CTA after all paragraphs
    const lastDelay = parseInt(paragraphs[paragraphs.length - 1].dataset.delay) || 11000;
    setTimeout(() => {
        if (ctaButton) {
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }
    }, lastDelay + 1500);
}

// ============================================
// NO BUTTON EVASION LOGIC
// ============================================

const noButtonState = {
    attempts: parseInt(sessionStorage.getItem('noAttempts')) || 0,
    tooltips: [
        "Oops! 😅",
        "Getting away! 🏃‍♂️💨",
        "Not so fast! 😜",
        "Nice try, Mindu! 😏💕",
        "Almost there... 🤭",
        "You tried!" // Won't show - triggers modal
    ],
    distances: [200, 300, 400, 500, 600, 'max']
};

function initNoButton() {
    const noBtn = document.getElementById('no-btn');
    if (!noBtn) return;

    const tooltip = createTooltip();

    // Mouse hover evasion
    noBtn.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') {
            evadeNoButton(noBtn, tooltip);
        }
    });

    // Touch evasion
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        evadeNoButton(noBtn, tooltip);
    }, { passive: false });

    // Keyboard accessibility - allow keyboard users to trigger modal
    noBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            noButtonState.attempts = 6;
            sessionStorage.setItem('noAttempts', '6');
            showMathProofModal();
        }
    });

    // Update button text based on saved attempts
    updateNoButtonText(noBtn);
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'no-tooltip';
    document.body.appendChild(tooltip);
    return tooltip;
}

function evadeNoButton(button, tooltip) {
    noButtonState.attempts++;
    sessionStorage.setItem('noAttempts', noButtonState.attempts.toString());

    // Check if we've hit the magic number
    if (noButtonState.attempts >= 6) {
        showMathProofModal();
        return;
    }

    // Update button text with superscript
    updateNoButtonText(button);

    // Calculate new position
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    const margin = 0.1;
    const buttonRect = button.getBoundingClientRect();

    // Calculate distance based on attempt
    const attemptIndex = Math.min(noButtonState.attempts - 1, noButtonState.distances.length - 1);
    let distance = noButtonState.distances[attemptIndex];

    if (distance === 'max') {
        distance = Math.max(viewport.width, viewport.height) * 0.4;
    }

    // Get random angle
    const angle = Math.random() * Math.PI * 2;

    // Calculate new position
    let newX = buttonRect.left + Math.cos(angle) * distance;
    let newY = buttonRect.top + Math.sin(angle) * distance;

    // Clamp to viewport with margin
    newX = clamp(newX, viewport.width * margin, viewport.width * (1 - margin) - buttonRect.width);
    newY = clamp(newY, viewport.height * margin + 60, viewport.height * (1 - margin) - buttonRect.height - 80);

    // Apply movement
    button.style.position = 'fixed';
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
    button.style.transform = `rotate(${randomBetween(-15, 15)}deg)`;
    button.style.transition = 'left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), top 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.3s ease';

    // Short vibration feedback
    vibrate(50);

    // Show tooltip
    showTooltip(tooltip, newX + buttonRect.width / 2, newY - 10, noButtonState.tooltips[noButtonState.attempts - 1]);
}

function updateNoButtonText(button) {
    const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶'];
    const attempt = Math.min(noButtonState.attempts, 6);
    const textSpan = button.querySelector('.no-text');
    if (textSpan && attempt > 0) {
        textSpan.textContent = `NO${superscripts[attempt - 1]} 🙃`;
    }
}

function showTooltip(tooltip, x, y, text) {
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.classList.add('visible');

    setTimeout(() => {
        tooltip.classList.remove('visible');
    }, 1500);
}

// ============================================
// MATHEMATICAL PROOF MODAL
// ============================================

function showMathProofModal() {
    const modal = document.getElementById('math-modal');
    if (!modal) return;

    modal.classList.add('active');

    // Animate math proof lines
    const lines = modal.querySelectorAll('.math-proof__line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 300 + (index * 400));
    });

    // Show conclusion after all lines
    const conclusion = modal.querySelector('.math-proof__conclusion');
    if (conclusion) {
        setTimeout(() => {
            conclusion.classList.add('visible');
        }, 300 + (lines.length * 400) + 500);
    }

    // Setup close button
    const closeBtn = modal.querySelector('.modal__close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                showCatModal();
            }, 300);
        });
    }

    // Close on backdrop click
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                showCatModal();
            }, 300);
        });
    }

    // Trap focus
    trapFocus(modal);
}

function showCatModal() {
    const modal = document.getElementById('cat-modal');
    if (!modal) return;

    modal.classList.add('active');

    // Hide NO button
    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        noBtn.style.display = 'none';
    }

    // Show hint for YES
    const hint = document.getElementById('yes-hint');
    if (hint) {
        hint.classList.add('visible');
    }

    // Setup close button
    const closeBtn = modal.querySelector('.modal__close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close on backdrop click
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Trap focus
    trapFocus(modal);
}

// ============================================
// YES BUTTON CELEBRATION
// ============================================

function initYesButton() {
    const yesBtn = document.getElementById('yes-btn');
    if (!yesBtn) return;

    yesBtn.addEventListener('click', () => {
        triggerCelebration();
    });
}

function triggerCelebration() {
    const celebration = document.getElementById('celebration');
    if (!celebration) return;

    // Save to localStorage
    localStorage.setItem('saidYes', 'true');
    localStorage.setItem('proposalDate', new Date().toISOString());

    // Vibrate celebration pattern
    vibrate([200, 100, 200, 100, 400]);

    // Show celebration screen
    celebration.classList.add('active');

    // Start confetti
    if (!prefersReducedMotion()) {
        initConfetti();
    }

    // Animate ring
    const ring = celebration.querySelector('.celebration__ring');
    if (ring) {
        ring.style.transform = 'scale(1)';
    }

    // Animate text messages
    const texts = celebration.querySelectorAll('.celebration__text');
    texts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('visible');
        }, 2000 + (index * 2000));
    });

    // Show buttons
    const buttons = celebration.querySelector('.celebration__buttons');
    if (buttons) {
        setTimeout(() => {
            buttons.classList.add('visible');
        }, 2000 + (texts.length * 2000) + 1000);
    }
}

// ============================================
// CONFETTI / PARTICLE SYSTEM
// ============================================

function initConfetti() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff4d6d', '#f6c65a', '#ffd1dc', '#ff9aa2', '#ff758f', '#ffffff'];
    const shapes = ['heart', 'circle', 'star'];

    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push(createParticle(colors, shapes));
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            // Update position
            particle.y += particle.speed;
            particle.x += Math.sin(particle.y * 0.01) * particle.sway;
            particle.rotation += particle.rotationSpeed;

            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;

            if (particle.shape === 'heart') {
                drawHeart(ctx, particle.size);
            } else if (particle.shape === 'star') {
                drawStar(ctx, particle.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // Reset if off screen
            if (particle.y > canvas.height + 50) {
                particles[index] = createParticle(colors, shapes);
                particles[index].y = -50;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createParticle(colors, shapes) {
    return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        size: randomBetween(8, 20),
        speed: randomBetween(1, 3),
        sway: randomBetween(0.5, 2),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: randomBetween(-0.05, 0.05),
        opacity: randomBetween(0.5, 1),
        color: randomFrom(colors),
        shape: randomFrom(shapes)
    };
}

function drawHeart(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(-size / 2, -size / 4, -size / 2, -size / 2, 0, -size / 4);
    ctx.bezierCurveTo(size / 2, -size / 2, size / 2, -size / 4, 0, size / 4);
    ctx.fill();
}

function drawStar(ctx, size) {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = size / 4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
}

// ============================================
// GALLERY LIGHTBOX
// ============================================

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox__image');

    if (!galleryItems.length || !lightbox || !lightboxImage) return;

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img')?.src);

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(images[currentIndex]);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                currentIndex = index;
                openLightbox(images[currentIndex]);
            }
        });
    });

    function openLightbox(src) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        trapFocus(lightbox);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    // Close button
    const closeBtn = lightbox.querySelector('.lightbox__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Navigation buttons
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');

    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// ============================================
// E-CARD GENERATOR
// ============================================

function initEcardGenerator() {
    const form = document.getElementById('ecard-form');
    const preview = document.getElementById('ecard-preview');
    const downloadBtn = document.getElementById('ecard-download');

    if (!form || !preview) return;

    const messageInput = document.getElementById('ecard-message');
    const fromInput = document.getElementById('ecard-from');
    const colorSelect = document.getElementById('ecard-color');

    const previewMessage = preview.querySelector('.ecard-preview__message');
    const previewFrom = preview.querySelector('.ecard-preview__from');

    // Live preview updates
    function updatePreview() {
        if (previewMessage) {
            previewMessage.textContent = messageInput?.value || 'Your message here...';
        }
        if (previewFrom) {
            previewFrom.textContent = `— ${fromInput?.value || 'Your Name'}`;
        }
        if (colorSelect && preview) {
            const colors = {
                'pink': 'linear-gradient(135deg, #ffd1dc, #ff9aa2)',
                'lavender': 'linear-gradient(135deg, #e6e6fa, #d8bfd8)',
                'peach': 'linear-gradient(135deg, #ffdab9, #ffb6c1)',
                'gold': 'linear-gradient(135deg, #ffd700, #ffb347)'
            };
            preview.style.background = colors[colorSelect.value] || colors.pink;
        }
    }

    messageInput?.addEventListener('input', updatePreview);
    fromInput?.addEventListener('input', updatePreview);
    colorSelect?.addEventListener('change', updatePreview);

    // Initial update
    updatePreview();

    // Download e-card as PNG
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadEcard(preview);
        });
    }
}

async function downloadEcard(previewElement) {
    // Create canvas from preview
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffd1dc');
    gradient.addColorStop(1, '#ff9aa2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.textAlign = 'center';

    // "To: Mindu 💕"
    ctx.font = '48px "Great Vibes", cursive';
    ctx.fillStyle = '#ff4d6d';
    ctx.fillText('To: Mindu 💕', canvas.width / 2, 150);

    // Message
    const message = previewElement.querySelector('.ecard-preview__message')?.textContent || 'I love you!';
    ctx.font = '36px "Playfair Display", serif';
    ctx.fillStyle = '#2b2b2b';

    // Word wrap
    const words = message.split(' ');
    let line = '';
    let y = canvas.height / 2 - 50;
    const maxWidth = canvas.width - 100;
    const lineHeight = 50;

    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, canvas.width / 2, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, canvas.width / 2, y);

    // From
    const from = previewElement.querySelector('.ecard-preview__from')?.textContent || '— With Love';
    ctx.font = 'italic 32px "Poppins", sans-serif';
    ctx.fillStyle = '#6b6b6b';
    ctx.fillText(from, canvas.width / 2, canvas.height - 100);

    // Draw hearts decoration
    ctx.font = '60px serif';
    ctx.fillText('💕', 100, 100);
    ctx.fillText('💖', canvas.width - 100, 100);
    ctx.fillText('💗', 100, canvas.height - 50);
    ctx.fillText('💓', canvas.width - 100, canvas.height - 50);

    // Download
    const link = document.createElement('a');
    link.download = `love-note-for-mindu-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ============================================
// LOVE CALCULATOR
// ============================================

function initLoveCalculator() {
    const calculateBtn = document.getElementById('love-calculate');
    const result = document.getElementById('love-result');

    if (!calculateBtn || !result) return;

    calculateBtn.addEventListener('click', () => {
        result.textContent = '100% + Infinity! 💕♾️';
        result.classList.add('visible');

        // Extra confetti burst
        if (!prefersReducedMotion()) {
            vibrate([100, 50, 100]);
        }

        // Show fun message
        setTimeout(() => {
            result.innerHTML = '100% + Infinity! 💕♾️<br><small style="font-size: 0.5em;">The calculator broke from too much love! 😍</small>';
        }, 1000);
    });
}

// ============================================
// QUOTES CAROUSEL
// ============================================

function initQuotesCarousel() {
    const carousel = document.querySelector('.quotes-carousel');
    if (!carousel) return;

    const quotes = carousel.querySelectorAll('.quotes-carousel__quote');
    const dots = carousel.querySelectorAll('.quotes-carousel__dot');

    if (!quotes.length) return;

    let currentQuote = 0;
    let interval;

    function showQuote(index) {
        quotes.forEach(q => q.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        quotes[index]?.classList.add('active');
        dots[index]?.classList.add('active');
    }

    function nextQuote() {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(currentQuote);
    }

    // Auto-rotate
    function startAutoRotate() {
        interval = setInterval(nextQuote, 5000);
    }

    function stopAutoRotate() {
        clearInterval(interval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuote = index;
            showQuote(currentQuote);
            stopAutoRotate();
            startAutoRotate();
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);

    // Initialize
    showQuote(0);
    startAutoRotate();
}

// ============================================
// SOCIAL SHARING
// ============================================

function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.share;

            if (type === 'copy') {
                e.preventDefault();
                copyToClipboard(window.location.href);
                showCopySuccess(btn);
            }
        });
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

function showCopySuccess(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Copied! 💕';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// ============================================
// ACCESSIBILITY HELPERS
// ============================================

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    });
}

// ============================================
// SOUND TOGGLE
// ============================================

function initSoundToggle() {
    const toggle = document.getElementById('sound-toggle');
    if (!toggle) return;

    let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    updateSoundToggle(toggle, soundEnabled);

    toggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled.toString());
        updateSoundToggle(toggle, soundEnabled);
    });
}

function updateSoundToggle(toggle, enabled) {
    toggle.setAttribute('aria-pressed', enabled.toString());
    toggle.textContent = enabled ? '🔊 Sound' : '🔇 Sound';
}

// ============================================
// MOTION TOGGLE
// ============================================

function initMotionToggle() {
    const toggle = document.getElementById('motion-toggle');
    if (!toggle) return;

    let motionEnabled = !prefersReducedMotion() && localStorage.getItem('motionReduced') !== 'true';
    updateMotionToggle(toggle, motionEnabled);

    toggle.addEventListener('click', () => {
        motionEnabled = !motionEnabled;
        localStorage.setItem('motionReduced', (!motionEnabled).toString());
        updateMotionToggle(toggle, motionEnabled);

        // Reload to apply changes
        window.location.reload();
    });
}

function updateMotionToggle(toggle, enabled) {
    toggle.setAttribute('aria-pressed', enabled.toString());
    toggle.textContent = enabled ? '✨ Motion' : '⏸️ Motion';
}

// ============================================
// PAGE INITIALIZERS
// ============================================

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Common initializations
    initFloatingHearts();
    initSoundToggle();
    initMotionToggle();

    // Page-specific initializations
    const path = window.location.pathname;

    if (path.includes('intro') || path.endsWith('/') || path.endsWith('index.html')) {
        initIntroAnimations();
    }

    if (path.includes('proposal')) {
        initNoButton();
        initYesButton();

        // Check if already said yes
        if (localStorage.getItem('saidYes') === 'true') {
            const celebration = document.getElementById('celebration');
            if (celebration) {
                celebration.classList.add('active');
                const texts = celebration.querySelectorAll('.celebration__text');
                texts.forEach(t => t.classList.add('visible'));
                const buttons = celebration.querySelector('.celebration__buttons');
                if (buttons) buttons.classList.add('visible');
            }
        }
    }

    if (path.includes('gallery')) {
        initGallery();
    }

    if (path.includes('extras')) {
        initEcardGenerator();
        initLoveCalculator();
        initQuotesCarousel();
        initSocialSharing();
    }
});

// ============================================
// EASTER EGGS
// ============================================

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function showEasterEgg() {
    alert("🎮 Mindu, you found the secret!\n\nYou're as clever as you are beautiful! 💕\n\nI love you more every day! 💖");
    vibrate([100, 50, 100, 50, 200]);
}
