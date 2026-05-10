document.querySelectorAll(".catering-sidebar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    const section = document.getElementById(target);

    if (!section) return;

    const yOffset = -80; // adjust if header height changes
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  });
});
