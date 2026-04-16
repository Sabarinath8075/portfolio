// ==========================
// MOBILE MENU TOGGLE
// ==========================
function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.classList.toggle("active");
}


// ==========================
// SMOOTH SCROLL
// ==========================
function scrollToGallery() {
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.scrollIntoView({ behavior: "smooth" });
  }
}


// ==========================
// SCROLL REVEAL (FIXED)
// ==========================
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// ==========================
// LAZY LOAD (FADE-IN)
// ==========================
const lazyImages = document.querySelectorAll(".gallery-grid img");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

lazyImages.forEach(img => observer.observe(img));


// ==========================
// LIGHTBOX + NAVIGATION
// ==========================
const images = Array.from(document.querySelectorAll(".gallery-grid img"));
let currentIndex = 0;

function openLightbox(index) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (!lightbox || !lightboxImg) return;

  currentIndex = index;
  lightbox.style.display = "flex";
  lightboxImg.src = images[currentIndex].src;
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.style.display = "none";
}

function changeSlide(direction) {
  if (images.length === 0) return;

  currentIndex += direction;

  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;

  document.getElementById("lightbox-img").src =
    images[currentIndex].src;
}


// ==========================
// KEYBOARD CONTROLS
// ==========================
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox");

  if (lightbox && lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") changeSlide(1);
    if (e.key === "ArrowLeft") changeSlide(-1);
    if (e.key === "Escape") closeLightbox();
  }
});


// ==========================
// IMAGE STAGGER ANIMATION
// ==========================
function showImages() {
  const imgs = document.querySelectorAll(".gallery-grid img");
  const triggerBottom = window.innerHeight - 100;

  imgs.forEach((img, index) => {
    const imgTop = img.getBoundingClientRect().top;

    if (imgTop < triggerBottom) {
      setTimeout(() => {
        img.classList.add("show");
      }, index * 100);
    }
  });
}

window.addEventListener("scroll", showImages);
window.addEventListener("load", showImages);


// ==========================
// HERO PARALLAX EFFECT
// ==========================
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");

  if (hero) {
    const scrollY = window.scrollY;
    hero.style.backgroundPositionY = scrollY * 0.5 + "px";
  }
});


// ==========================
// NAVBAR SCROLL EFFECT
// ==========================
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (!header) return;

  if (window.scrollY > 50) {
    header.style.background = "rgba(0,0,0,0.85)";
    header.style.backdropFilter = "blur(14px)";
  } else {
    header.style.background = "rgba(0,0,0,0.4)";
  }
});
