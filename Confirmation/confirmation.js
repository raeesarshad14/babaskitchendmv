// Clear cart after successful order
localStorage.removeItem("cart");

// Optional: fade-in animation
document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".confirm-box");
  box.style.opacity = "0";
  setTimeout(() => {
    box.style.transition = "0.6s";
    box.style.opacity = "1";
  }, 100);
});
