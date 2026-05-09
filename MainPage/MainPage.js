// ===============================
// Main Page JS (MainPage.js)
// ===============================

// Log to confirm JS is connected
console.log("Main Page Loaded");

// ===============================
// Sticky Header on Scroll
// ===============================
window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header");
  if (window.scrollY > 20) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});

// ===============================
// Future: Slider / Hero Animation
// ===============================
// This is a placeholder for when we add the hero slider.
// Keeping structure ready so your project stays modular.

function initHeroSlider() {
  console.log("Hero slider ready (waiting for images)");
}

// Call future slider initializer
initHeroSlider();

// ===============================
// Future: Mobile Menu (optional)
// ===============================
// If you add a hamburger menu later, the structure is ready.

function toggleMobileMenu() {
  const nav = document.querySelector(".nav-links");
  nav.classList.toggle("open");
}
