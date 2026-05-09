document.querySelectorAll(".catering-sidebar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    const section = document.getElementById(target);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
