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
    if(heroContainer) {
        // Convert vertical scroll to horizontal scroll
        heroContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                heroContainer.scrollLeft += e.deltaY;
            }
        });

        // --- Scroll Indicators & Auto-scroll Logic ---
        const scrollLeftIndicator = document.querySelector('.scroll-left');
        const scrollRightIndicator = document.querySelector('.scroll-right');
        
        function updateIndicators() {
            if (heroContainer.scrollLeft > 10) {
                scrollLeftIndicator.classList.add('visible');
            } else {
                scrollLeftIndicator.classList.remove('visible');
            }
            
            const maxScrollLeft = heroContainer.scrollWidth - heroContainer.clientWidth;
            if (heroContainer.scrollLeft < maxScrollLeft - 10) {
                scrollRightIndicator.classList.add('visible');
            } else {
                scrollRightIndicator.classList.remove('visible');
            }
        }

        heroContainer.addEventListener('scroll', updateIndicators);
        window.addEventListener('resize', updateIndicators);
        setTimeout(updateIndicators, 100);

        // Auto-scroll when mouse is near edges
        let isAutoScrolling = false;
        let scrollDirection = 0; // -1 for left, 1 for right
        const edgeThreshold = 150; // pixels from edge to trigger auto-scroll
        const autoScrollSpeed = 6;

        document.addEventListener('mousemove', (e) => {
            // Disable auto-scroll on small screens or touch devices to prevent erratic behavior
            if (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches) {
                stopAutoScroll();
                return;
            }

            const x = e.clientX;
            const windowWidth = window.innerWidth;
            
            if (x < edgeThreshold) {
                scrollDirection = -1;
                startAutoScroll();
            } else if (x > windowWidth - edgeThreshold) {
                scrollDirection = 1;
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });

        document.addEventListener('mouseleave', stopAutoScroll);

        function startAutoScroll() {
            if (!isAutoScrolling) {
                isAutoScrolling = true;
                autoScrollLoop();
            }
        }

        function stopAutoScroll() {
            isAutoScrolling = false;
        }

        function autoScrollLoop() {
            if (!isAutoScrolling) return;
            
            if (scrollDirection === -1) {
                heroContainer.scrollLeft -= autoScrollSpeed;
            } else if (scrollDirection === 1) {
                heroContainer.scrollLeft += autoScrollSpeed;
            }
            
            requestAnimationFrame(autoScrollLoop);
        }

        // Mobile touch drag & snap back logic
        let activePanel = null;
        let isDragging = false;
        let touchStartX = 0;

        // Panel click to activate and center
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.addEventListener('click', () => {
                panels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');
                activePanel = panel;
                
                // On mobile, try to center it
                if (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches) {
                    setTimeout(() => {
                        centerActivePanel();
                    }, 300); // Wait for CSS flex transition to finish before centering
                }
            });
        });

        function centerActivePanel() {
            if (!activePanel) return;
            const panelLeft = activePanel.offsetLeft;
            const panelWidth = activePanel.offsetWidth;
            const containerHalf = heroContainer.offsetWidth / 2;
            
            heroContainer.scrollTo({
                left: panelLeft - containerHalf + (panelWidth / 2),
                behavior: 'smooth'
            });
        }

        // Snap back to active panel after scrolling on mobile
        heroContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = false;
        });

        heroContainer.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            if (Math.abs(currentX - touchStartX) > 10) {
                isDragging = true; // User is scrolling
            }
        });

        heroContainer.addEventListener('touchend', () => {
            if (isDragging && activePanel && (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches)) {
                // If the user was scrolling and releases, snap back to the active panel
                setTimeout(() => {
                    centerActivePanel();
                }, 100);
            }
        });
    }
});
