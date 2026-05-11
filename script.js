
// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (localStorage.getItem("ageConfirmed") != "true") {
        ageModal.style.display = "flex";
    } else {
        ageModal.style.display = "none";
    }
});

yesBtn.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
    alert("Acesso negado. Apenas para maiores de 18 anos.");
    window.close();
    window.location.href = "https://www.google.pt";
});

// Hide the top warning when the page is scrolled
const warn = document.querySelector(".warn");
if (warn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            warn.style.display = "none";
        } else {
            warn.style.display = "";
        }
    });
}



const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;

function getSlideOffset() {
    if (window.innerWidth <= 480) return 100;
    if (window.innerWidth <= 768) return 160;
    return 280;
}

function positionSlides() {
    const offset_px = getSlideOffset();
    const isMobile = window.innerWidth <= 768;
    const sideScale = isMobile ? 0.75 : 0.85;
    const sideRotate = isMobile ? 3 : 5;

    slides.forEach((slide, index) => {
        const offset = (index - currentSlide + totalSlides) % totalSlides;
        slide.classList.remove('active');

        if (offset === 0) {
            slide.style.transform = 'translateX(0) scale(1) rotate(0deg)';
            slide.style.zIndex = '10';
            slide.style.opacity = '1';
            slide.classList.add('active');
        } else if (offset === 1) {
            slide.style.transform = `translateX(${offset_px}px) scale(${sideScale}) rotate(${sideRotate}deg)`;
            slide.style.zIndex = '5';
            slide.style.opacity = '0.5';
        } else {
            slide.style.transform = `translateX(-${offset_px}px) scale(${sideScale}) rotate(-${sideRotate}deg)`;
            slide.style.zIndex = '5';
            slide.style.opacity = '0.5';
        }
    });
}

window.addEventListener('resize', positionSlides);

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    positionSlides();
}

positionSlides();
setInterval(nextSlide, 3000);

const sliderContainer = document.querySelector('.slider-container');
let startX = 0;
let currentX = 0;

sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

sliderContainer.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
});

sliderContainer.addEventListener('touchend', () => {
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextSlide();
        } else {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            positionSlides();
        }
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.cards-section, .video-section').forEach(section => {
    observer.observe(section);
});

// Hamburger menu toggle logic
const hamburger = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


// Hero Image 3D Tilt Effect
const heroImageContainer = document.querySelector('.hero-image');
const heroImage = document.querySelector('.hero-image img');

if (heroImageContainer && heroImage && window.matchMedia('(hover: hover)').matches) {
    heroImageContainer.addEventListener('mousemove', (e) => {
        const rect = heroImageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate center relative to mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max rotation (degrees)
        const maxRotation = 10;

        // RotateX is based on Y position (tilt up/down)
        // RotateY is based on X position (tilt left/right)
        // Note: Moving mouse to top (y < centerY) should tilt top towards user -> rotateX negative?
        // Let's check standard behavior: 
        // Mouse Top-Left: Top comes forward, Left comes forward.
        // rotateX should be negative (top comes out), rotateY should be positive (left comes out? no wait)
        // CSS rotateY: positive turns right side back, left side forward (counter-clockwise from top).
        // CSS rotateX: positive turns top back, bottom forward.

        // We want: 
        // Top-Left cursor: Top comes forward (rotateX negative), Left comes forward (rotateY negative).

        const rotateX = ((y - centerY) / centerY) * -maxRotation; // Top (y=0): -1 * -10 = 10 (positive pushes top BACK). Wait.
        // If I want Top to come forward (negative rotateX):
        // Top (y=0) gives negative results from (y-centerY). So (negative) * (coefficient) should be negative.
        // So coefficient should be positive.
        // Let's try: (y - centerY) / centerY * maxRotation => at y=0, we get -10. Top comes forward. Correct.

        const rotateY = ((x - centerX) / centerX) * maxRotation;
        // Right (x=max): 1 * 10 = 10. Right comes forward? 
        // rotateY(10deg): Right side goes back, Left side comes forward.
        // We want cursor at Right -> Right comes forward. So we need rotateY to be negative?
        // Actually, if I look at standard 3D cards:
        // Mouse right -> Right side towards user (rotateY positive usually pushes right BACK).
        // Let's re-verify CSS 3D rotation direction.
        // rotateY(10deg) -> rotates around Y axis. +10deg is usually counter-clockwise looking from top. Right side goes away (screen depth), Left side comes closer.
        // So if we want Right side to come closer when mouse is on Right, we need rotateY to be negative?
        // No, wait. 10deg. The vector is (0, 1, 0).
        // Let's just implement standard "look at" behavior.
        // Cursor Right -> Image looks right (Right side goes back, Left side comes forward)? No, user wants "tilts toward cursor".
        // "if the cursor is in the top-right corner, the image tilts toward the top-right"
        // This usually means the corner under the cursor dips DOWN or comes UP?
        // "rotate slightly toward the cursor position"
        // Usually means the element "looks" at the cursor, or the cursor pushes it?
        // "similar to a 3D parallax tilt effect" -> Apple TV poster effect.
        // Apple TV: Mouse Top-Left -> Top-Left corner tilts BACK (pushed by mouse), or comes forward?
        // Usually, the element tilts TOWARDS the mouse implies the normal vector points to mouse.
        // i.e., the face of the card points to the mouse.
        // So if mouse is Top-Right, the card faces Top-Right.
        // To face Top-Right:
        // Rotate X: negative (tilt up)
        // Rotate Y: positive (tilt right)? 
        // Let's stick to the Apple TV logic: Mouse Top-Right -> Top-Right corner comes CLOSER to screen (or goes deeper).
        // "image must rotate slightly toward the cursor position" -> Suggests the face turns to look at cursor.
        // So Mouse Top-Right: Face looks Top-Right.
        // This means RotateX negative (look up), RotateY positive (look right).

        // Let's check math:
        // Top (y < centerY): we want negative RotateX. (y - centerY) is negative. So simply (y - centerY) * factor.
        // Right (x > centerX): we want positive RotateY. (x - centerX) is positive. So simply (x - centerX) * factor.

        const calcRotateX = -((y - centerY) / centerY) * maxRotation; // y=0 -> -(-1)*10 = 10 (Look Down? Wait.)
        // rotateX(-10deg) -> Looks Up.
        // y=0 (top) -> we want Look Up (-10). 
        // (0 - center) is negative. 
        // factor * negative = negative.
        // So simple positive factor.
        // Correction: 
        // Standard:
        // rotX = ((centerY - y) / centerY) * maxRotation; // y=0 -> 1 * 10 = 10 (Look Down? No positive X is look down/bottom in, top back).
        // We want Top Forward (Negative X).
        // So ((y - centerY) / centerY) * maxRotation => y=0 -> -1 * 10 = -10. Correct.

        // rotY = ((x - centerX) / centerX) * maxRotation; // x=max -> 1 * 10 = 10.
        // rotateY(10) -> Right back, Left forward. (Look Left).
        // We want Look Right (Right forward, Left back). 
        // So we want negative Y rotation for positive X position?
        // No, standard Right Hand Rule. thumb on Y axis (up). fingers curl + -> Left forward, Right back.
        // So to get Right Forward, we need Negative rotation.
        // So rotY should be inverted relative to x position.

        const finalRotateX = ((y - centerY) / centerY) * maxRotation; // Top (y=0) -> -10 (Top Forward). OK.
        const finalRotateY = -((x - centerX) / centerX) * maxRotation; // Right (x=max) -> -10 (Right Forward). OK.

        heroImage.style.transform = `perspective(1000px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    heroImageContainer.addEventListener('mouseleave', () => {
        heroImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// Slider Navigation Logic
// Note: nextSlide() is already defined in existing code.
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    positionSlides();
}

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
}
const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");

let showingCities = false;

city.addEventListener("click", toggleCont);
function toggleCont() {
    showingCities = !showingCities;
    city.classList.toggle("active", showingCities);
    Array.from(cont).forEach((el) => {
        el.style.display = showingCities ? "block" : "none";
    });
}
