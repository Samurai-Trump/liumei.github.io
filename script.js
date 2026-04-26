// Add any interactive features here if needed in the future
// Add any interactive features here if needed in the future
document.addEventListener('DOMContentLoaded', () => {
    // For example, adding an active class to navigation based on scroll or click
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        // Convert vertical scroll to horizontal scroll
        heroContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                heroContainer.scrollLeft += e.deltaY;
            }
        });

        // --- Scroll Indicators & Button Logic ---
        const scrollLeftBtn = document.querySelector('.scroll-left');
        const scrollRightBtn = document.querySelector('.scroll-right');
        const edgeThreshold = 150; // pixels from edge to show buttons

        let mouseX = window.innerWidth / 2; // Default to center

        // Function to determine if buttons should be visible based on scroll position AND pointer proximity
        function updateIndicators(e) {
            if (e && e.clientX !== undefined) mouseX = e.clientX;
            else if (e && e.touches) mouseX = e.touches[0].clientX;

            const windowWidth = window.innerWidth;
            const maxScrollLeft = heroContainer.scrollWidth - heroContainer.clientWidth;

            // Check if near left edge
            if (mouseX < edgeThreshold && heroContainer.scrollLeft > 10) {
                scrollLeftBtn.classList.add('visible');
            } else {
                scrollLeftBtn.classList.remove('visible');
            }

            // Check if near right edge
            if (mouseX > windowWidth - edgeThreshold && heroContainer.scrollLeft < maxScrollLeft - 10) {
                scrollRightBtn.classList.add('visible');
            } else {
                scrollRightBtn.classList.remove('visible');
            }
        }

        heroContainer.addEventListener('scroll', () => updateIndicators());
        window.addEventListener('resize', () => updateIndicators());
        document.addEventListener('mousemove', updateIndicators);
        document.addEventListener('touchstart', updateIndicators, { passive: true });
        document.addEventListener('touchmove', updateIndicators, { passive: true });

        // Hide buttons when mouse leaves
        document.addEventListener('mouseleave', () => {
            mouseX = window.innerWidth / 2;
            updateIndicators();
        });
        document.addEventListener('touchend', () => {
            // Delay hiding slightly on mobile so they don't disappear immediately if tapping
            setTimeout(() => {
                mouseX = window.innerWidth / 2;
                updateIndicators();
            }, 1000);
        });

        // --- Neon Button Interactive Scrolling Logic ---
        let scrollAnimationId = null;
        let isHolding = false;

        function startContinuousScroll(direction, btn) {
            isHolding = true;
            btn.classList.add('active-glow');

            function step() {
                if (!isHolding) return;
                heroContainer.scrollLeft += direction * 8; // Scroll speed
                scrollAnimationId = requestAnimationFrame(step);
            }
            scrollAnimationId = requestAnimationFrame(step);
        }

        function stopContinuousScroll(btn) {
            isHolding = false;
            if (scrollAnimationId) cancelAnimationFrame(scrollAnimationId);
            btn.classList.remove('active-glow');
        }

        function setupScrollButton(btn, direction) {
            let pressTimer;
            let didHold = false;

            // Touch / Mouse Down
            const startPress = (e) => {
                e.preventDefault(); // Prevent default text selection/zooming
                didHold = false;
                btn.classList.add('active-glow');
                pressTimer = setTimeout(() => {
                    didHold = true;
                    startContinuousScroll(direction, btn);
                }, 300); // 300ms hold required to start continuous scroll
            };

            // Touch / Mouse Up
            const endPress = (e) => {
                clearTimeout(pressTimer);
                stopContinuousScroll(btn);

                // If it was just a quick tap, step scroll by a chunk
                if (!didHold) {
                    const scrollAmount = window.innerWidth <= 768 ? window.innerWidth * 0.7 : window.innerWidth * 0.25;
                    heroContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
                }
            };

            btn.addEventListener('mousedown', startPress);
            btn.addEventListener('touchstart', startPress, { passive: false });

            btn.addEventListener('mouseup', endPress);
            btn.addEventListener('touchend', endPress);
            btn.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
                stopContinuousScroll(btn);
            });
        }

        setupScrollButton(scrollLeftBtn, -1);
        setupScrollButton(scrollRightBtn, 1);

        // Panel click to activate and center
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.addEventListener('click', () => {
                panels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');

                // On mobile, try to center it
                if (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches) {
                    setTimeout(() => {
                        const panelLeft = panel.offsetLeft;
                        const panelWidth = panel.offsetWidth;
                        const containerHalf = heroContainer.offsetWidth / 2;

                        heroContainer.scrollTo({
                            left: panelLeft - containerHalf + (panelWidth / 2),
                            behavior: 'smooth'
                        });
                    }, 300); // Wait for CSS flex transition
                }
            });
        });
    }
});
