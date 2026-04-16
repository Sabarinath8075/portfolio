// SCROLL REVEAL (APPLE STYLE)
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);


// IMAGE STAGGER ANIMATION
const images = document.querySelectorAll(".gallery-grid img");

function showImages() {
  const triggerBottom = window.innerHeight - 100;

  images.forEach((img, index) => {
    const imgTop = img.getBoundingClientRect().top;

    if (imgTop < triggerBottom) {
      setTimeout(() => {
        img.classList.add("show");
      }, index * 120); // stagger delay
    }
  });
}

window.addEventListener("scroll", showImages);


// HERO PARALLAX (SUBTLE)
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.querySelector(".hero").style.backgroundPositionY =
    scrollY * 0.5 + "px";
});
