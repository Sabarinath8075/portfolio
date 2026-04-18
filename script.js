// ==========================
// INITIAL SETUP
// ==========================
// Add js-enabled immediately to avoid layout shifts during load
document.body.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    // Small delay to ensure CSS transition is ready
    setTimeout(() => {
      hero.classList.add("loaded");
    }, 50);
  }
});


// ==========================
// EXPAND/COLLAPSE GALLERY
// ==========================
function expandGallery() {
  const grid = document.querySelector(".gallery-grid");
  const btn = document.getElementById("view-all-btn");
  const hiddenCards = document.querySelectorAll(".card.show-more");

  if (!grid || !btn) return;

  const isExpanding = !grid.classList.contains("expanded");

  if (isExpanding) {
    // EXPAND
    grid.classList.add("expanded");
    btn.textContent = "Less";

    hiddenCards.forEach((card, index) => {
      // Small timeout for each card for staggered effect
      setTimeout(() => {
        card.classList.add("visible");
        const img = card.querySelector("img");
        if (img) img.classList.add("loaded");
      }, index * 40);
    });
  } else {
    // COLLAPSE
    btn.textContent = "More";

    // Reverse staggered collapse
    const reversedCards = Array.from(hiddenCards).reverse();
    reversedCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove("visible");
      }, index * 30);
    });

    // Actually hide the cards after the transition is done
    setTimeout(() => {
      grid.classList.remove("expanded");
      // Scroll back to gallery top smoothly
      document.getElementById("gallery").scrollIntoView({ behavior: 'smooth' });
    }, (hiddenCards.length * 30) + 400);
  }
}


// ==========================
// MOBILE MENU
// ==========================
function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) {
    const isActive = nav.classList.toggle("active");
    document.body.classList.toggle("no-scroll", isActive); // Prevent background scroll
  }
}

// Close menu when clicking a link
document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("nav");
    if (nav && nav.classList.contains("active")) {
      nav.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
});


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
      card.classList.remove("hidden");
      // Trigger re-animation
      if (img) {
        img.classList.remove("loaded");
        setTimeout(() => img.classList.add("loaded"), 10);
      }
    } else {
      card.classList.add("hidden");
    }
  });
}


// ==========================
// LIGHTBOX (FULL SCREEN VIEW)
// ==========================
let images = [];
let currentIndex = 0;

function openLightbox(img) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  
  // Get all currently visible images in the gallery
  images = Array.from(document.querySelectorAll(".gallery-grid .card:not(.hidden) img"));

  if (!lightbox || !lightboxImg || images.length === 0) return;

  // Find the index of the clicked image in the visible set
  currentIndex = images.indexOf(img);
  if (currentIndex === -1) currentIndex = 0;
  
  // Set source first
  lightboxImg.src = images[currentIndex].src;
  
  // Show lightbox
  lightbox.style.display = "flex";
  
  // Trigger animation after a tiny delay
  setTimeout(() => {
    lightbox.classList.add("active");
    document.body.classList.add("no-scroll");
  }, 10);
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  
  lightbox.classList.remove("active");
  document.body.classList.remove("no-scroll");

  // Wait for transition then hide
  setTimeout(() => {
    if (!lightbox.classList.contains("active")) {
      lightbox.style.display = "none";
    }
  }, 400);
}

function changeSlide(direction) {
  if (images.length === 0) return;

  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightboxImg) return;

  // STEP 1: Slide Out (in the direction of the swipe)
  const exitDistance = direction * 80; // pixels to move
  lightboxImg.style.opacity = "0";
  lightboxImg.style.transform = `translateX(${-exitDistance}px) scale(0.95)`;

  // STEP 2: Wait for fade out, then swap source and slide in from opposite side
  setTimeout(() => {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    // Change image source
    lightboxImg.src = images[currentIndex].src;

    // Temporarily disable transition to reset position instantly
    lightboxImg.style.transition = 'none';
    lightboxImg.style.transform = `translateX(${exitDistance}px) scale(0.95)`;

    // Force a browser reflow
    void lightboxImg.offsetWidth;

    // Restore transition and slide into final position
    lightboxImg.style.transition = ''; // Back to CSS defaults
    lightboxImg.style.opacity = "1";
    lightboxImg.style.transform = "translateX(0) scale(1)";
  }, 300); // Wait 300ms for exit animation
}

// Close when clicking outside the image
document.getElementById("lightbox")?.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});


// ==========================
// TOUCH / SWIPE SUPPORT
// ==========================
let touchStartX = 0;
let touchEndX = 0;

const lightbox = document.getElementById("lightbox");
if (lightbox) {
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped Left -> Next
      changeSlide(1);
    } else {
      // Swiped Right -> Previous
      changeSlide(-1);
    }
  }
}


// ==========================
// KEYBOARD SUPPORT
// ==========================
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox");

  if (lightbox && lightbox.classList.contains("active")) {
    if (e.key === "ArrowRight") changeSlide(1);
    if (e.key === "ArrowLeft") changeSlide(-1);
    if (e.key === "Escape") closeLightbox();
  }
});


// ==========================
// SCROLL REVEAL & PERFORMANCE
// ==========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.tagName === "SECTION") {
        entry.target.classList.add("revealed");
      } else if (entry.target.classList.contains("card")) {
        entry.target.classList.add("revealed");
        // Also load the image inside the card if it's there
        const img = entry.target.querySelector("img");
        if (img) img.classList.add("loaded");
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px' // Start reveal slightly before item enters viewport
});

// Use DOMContentLoaded to start observing
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("section").forEach(sec => revealObserver.observe(sec));
  document.querySelectorAll(".card:not(.show-more)").forEach(card => revealObserver.observe(card));
});


// ==========================
// NAVBAR SCROLL EFFECT
// ==========================
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
