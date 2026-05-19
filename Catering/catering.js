class CateringPage {
  async render() {
    const res = await fetch("Catering/catering.json");
    const data = await res.json();

    // ⭐ Store categories globally for Jump Menu
    window.cateringCategories = data.map((cat) => ({
      name: cat.category,
      id: cat.category.toLowerCase().replace(/[^a-z0-9]/g, ""),
    }));

    return data
      .map((cat) => {
        const sectionId = cat.category.toLowerCase().replace(/[^a-z0-9]/g, "");

        return `
          <section id="${sectionId}" class="catering-section">
            <h2>${cat.category}</h2>
            ${cat.subtitle ? `<p class="subtitle">${cat.subtitle}</p>` : ""}

            <div class="catering-items">
              ${cat.items.map((item) => this.renderItem(item)).join("")}
            </div>
          </section>
        `;
      })
      .join("");
  }

  renderItem(item) {
    // ⭐ TRAY ITEMS
    if (Number(item.smallPrice) && Number(item.largePrice)) {
      return `
        <div class="catering-item unified-card">
          <h3>${item.name}</h3>
          <p class="price-line">Small Tray: $${item.smallPrice}</p>
          <p class="price-line">Large Tray: $${item.largePrice}</p>

          <button class="add-btn"
            onclick='openModal({
              name: "${item.name}",
              type: "tray",
              smallPrice: ${item.smallPrice},
              largePrice: ${item.largePrice}
            })'>
            Add
          </button>
        </div>
      `;
    }

    // ⭐ ROAST ITEMS
    const isRoast =
      (item.type && item.type === "roast") ||
      (item.note && item.note.toLowerCase().includes("whole roast")) ||
      item.name.toLowerCase().includes("whole roast");

    if (isRoast) {
      return `
        <div class="catering-item unified-card">
          <h3>${item.name}</h3>
          <p class="price-line">Price: $${item.price}</p>

          <button class="add-btn"
            onclick='openModal({
              name: "${item.name}",
              type: "roast",
              price: ${item.price},
              minOrder: 1
            })'>
            Add
          </button>
        </div>
      `;
    }

    // ⭐ SINGLE ITEMS
    return `
      <div class="catering-item unified-card">
        <h3>${item.name}</h3>
        <p class="price-line">Price: $${item.price}</p>

        <button class="add-btn"
          onclick='openModal({
            name: "${item.name}",
            type: "single",
            price: ${item.price},
            minOrder: ${item.minOrder || 12}
          })'>
          Add
        </button>
      </div>
    `;
  }
}

/* ============================================================
   ⭐ FIXED SIDEBAR SCROLL FUNCTION
============================================================ */
function initSidebarScroll() {
  const header = document.querySelector(".main-header");
  const headerHeight = header ? header.offsetHeight : 80;

  document.querySelectorAll(".catering-sidebar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      const section = document.getElementById(target);

      if (!section) return;

      const yOffset = -(headerHeight + 40);
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    });
  });
}
