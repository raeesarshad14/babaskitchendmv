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
    return `
      <div class="catering-item unified-card">
        <h3>${item.name}</h3>

        ${
          item.smallPrice && item.largePrice
            ? `
              <p class="price-line">Small Tray: $${item.smallPrice}</p>
              <p class="price-line">Large Tray: $${item.largePrice}</p>
            `
            : `
              <p class="price-line">Price: $${item.price}</p>
              ${item.minOrder ? `<p class="price-line">Min Order: ${item.minOrder}</p>` : ""}
              ${item.note ? `<p class="price-line">${item.note}</p>` : ""}
            `
        }
      </div>
    `;
  }
}
