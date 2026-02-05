/* ==========================================
   PINCHA YOGA PROPOSAL - PREMIUM EDITION
   JavaScript Controller
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize all modules
    initProgressBar();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    setDates();
});

/* === PROGRESS BAR === */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    };
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/* === NAVIGATION === */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    const updateNavbar = () => {
        const currentScroll = window.scrollY;
        
        // Add scrolled state
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const updateActiveSection = () => {
        const scrollY = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
}

/* === MOBILE MENU === */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
    
    if (!navToggle || !mobileMenu) return;
    
    const openMenu = () => {
        mobileMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Animate links in
        const links = mobileMenu.querySelectorAll('.mobile-link');
        links.forEach((link, i) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                link.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100 + (i * 50));
        });
    };
    
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    };
    
    navToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMenu);
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* === SMOOTH SCROLL === */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (!reveals.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

/* === SET DATES === */
function setDates() {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const today = new Date().toLocaleDateString('en-US', options);
    
    const coverDate = document.getElementById('coverDate');
    const footerDate = document.getElementById('footerDate');
    
    if (coverDate) coverDate.textContent = today;
    if (footerDate) footerDate.textContent = today;
}

/* === UTILITY: Debounce === */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* === UTILITY: Throttle === */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
