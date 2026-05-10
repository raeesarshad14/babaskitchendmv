class CateringPage {
  async render() {
    const res = await fetch("Catering/catering.json");
    const data = await res.json();

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
    // ⭐ TRAY ITEMS (small + large)
    if (item.smallPrice && item.largePrice) {
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

    // ⭐ WHOLE ROAST CHICKEN — starts at 1, no minimum
    if (item.name.toLowerCase().includes("whole roast chicken")) {
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

    // ⭐ SINGLE PRICE ITEMS (min order 12)
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
