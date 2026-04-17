// ==========================
// MOBILE MENU
// ==========================
function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.classList.toggle("active");
}


// ==========================
// FILTER BUTTONS (GALLERY)
// ==========================
function filterImages(category, event) {
  const cards = document.querySelectorAll(".gallery-grid .card");
  const buttons = document.querySelectorAll(".filters button");

  // active button highlight
  buttons.forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");

  // filter logic
  cards.forEach(card => {
    const img = card.querySelector("img");
    if (category === "all" || card.classList.contains(category)) {
      card.style.display = "block";
      // Trigger re-animation
      if (img) {
        img.classList.remove("loaded");
        setTimeout(() => img.classList.add("loaded"), 10);
      }
    } else {
      card.style.display = "none";
    }
  });
}


// ==========================
// LIGHTBOX (FULL SCREEN VIEW)
// ==========================
const images = document.querySelectorAll(".gallery-grid img");
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

  const lightboxImg = document.getElementById("lightbox-img");
  
  // Add a quick fade-out effect
  lightboxImg.style.opacity = "0";
  lightboxImg.style.transform = "scale(0.95)";

  setTimeout(() => {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    lightboxImg.src = images[currentIndex].src;
    
    // Fade back in
    lightboxImg.style.opacity = "1";
    lightboxImg.style.transform = "scale(1)";
  }, 200);
}


// ==========================
// KEYBOARD SUPPORT
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
// LAZY LOAD (FADE-IN)
// ==========================
const lazyImages = document.querySelectorAll(".gallery-grid img");

const observer = new IntersectionObserver((entries) => {
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
// NAVBAR SCROLL EFFECT
// ==========================
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (!header) return;

  if (window.scrollY > 50) {
    header.style.background = "rgba(0,0,0,0.85)";
    header.style.backdropFilter = "blur(14px)";
  } else {
    header.style.background = "rgba(0,0,0,0.5)";
  }
});
