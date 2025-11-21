document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Scroll Animation Observer
    // Fix: Ensure elements are observed even if already in view or if user scrolls back
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // We unobserve to keep it visible once shown (standard "fade in once" behavior)
                // If the user wanted it to fade out when scrolling back, we would remove the class here.
                // Assuming the bug was "it doesn't show up sometimes", unobserving after adding class is correct for "show once".
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(section => {
        observer.observe(section);
        // Fallback: If IntersectionObserver fails or is slow, ensure content is visible after a delay?
        // No, that might cause popping. But we can check if it's already visible.
    });

    // Header Animation Logic (Refined)
    const headerCard = document.getElementById('header-card');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerCard.classList.remove('py-4');
            headerCard.classList.add('py-2');
        } else {
            headerCard.classList.remove('py-2');
            headerCard.classList.add('py-4');
        }
    });

    // Accordion Logic
    document.querySelectorAll('.accordion-btn').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.accordion-btn').forEach(otherBtn => {
                if (otherBtn !== button) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherBtn.nextElementSibling.classList.remove('open');
                }
            });

            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('open');
        });
    });

    // Mouse tracking for blobs (Parallax)
    document.addEventListener('mousemove', (e) => {
        const blobs = document.querySelectorAll('.blob');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            // Apply transform. Note: This overrides the CSS animation transform if not careful.
            // The CSS animation uses 'transform: translate(...) scale(...)'.
            // Setting style.transform directly removes the CSS animation's effect on transform.
            // To combine, we should use CSS variables or a wrapper.
            // However, the original code did this, so I will keep it but be aware it might stop the 'float' animation movement
            // if the float animation uses transform.
            // Checking CSS: @keyframes float uses transform.
            // This JS overwrites it! This might be why "movement" was requested before.
            // Fix: Apply the parallax to a wrapper or use CSS variables.
            // For now, to avoid breaking design, I will NOT change this logic as requested "don't break design".
            // But wait, if the user said "add more movement" before and this JS kills it...
            // actually, the previous code had this JS.
            // I will leave it as is to be safe, or maybe use a different property like 'margin' or 'left/top' for parallax?
            // No, 'transform' is best for performance.
            // I'll stick to the original logic to ensure I don't "break" what they liked, even if it conflicts.
            // Actually, the original code had this.

            // blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`; 
            // Wait, the original code in the view_file didn't show this JS being active/uncommented?
            // Let's check the previous view_file.
            // Ah, line 724 in index.html:
            /*
            document.addEventListener('mousemove', (e) => {
                const blobs = document.querySelectorAll('.blob');
                ...
                blobs.forEach((blob, index) => {
                    ...
                     // There was NO assignment in the provided snippet!
                     // lines 729-733 calculated xOffset/yOffset but DID NOTHING with it.
                });
            });
            */
            // OMG. The original code calculated offsets but didn't apply them!
            // So the blobs were ONLY animating via CSS.
            // I will keep the calculation but NOT apply it, or apply it if I want to fix it?
            // The user said "refactor", not "fix parallax".
            // But if I apply it, I might break the CSS animation.
            // I will comment it out or leave it as "doing nothing" like the original to be 100% safe.
        });
    });

    // Mobile Menu Logic
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden-menu');
                mobileMenu.classList.add('visible-menu');
                // Change Icon to Close (X)
                menuBtn.innerHTML = '<i data-lucide="x" id="menu-icon"></i>';
            } else {
                mobileMenu.classList.remove('visible-menu');
                mobileMenu.classList.add('hidden-menu');
                // Change Icon back to Menu
                menuBtn.innerHTML = '<i data-lucide="menu" id="menu-icon"></i>';
            }
            lucide.createIcons(); // Re-render icon
        });
    }

    // Close menu when link clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.remove('visible-menu');
            mobileMenu.classList.add('hidden-menu');
            // Change Icon back to Menu
            if (menuBtn) {
                menuBtn.innerHTML = '<i data-lucide="menu" id="menu-icon"></i>';
                lucide.createIcons();
            }
        });
    });
});
