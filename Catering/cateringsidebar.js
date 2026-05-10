function initSidebarScroll() {
  document.querySelectorAll(".catering-sidebar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      const section = document.getElementById(target);

      if (!section) return;

      const yOffset = -10;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    });
  });
}
