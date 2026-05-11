document.addEventListener("DOMContentLoaded", () => {
  fetch("Dessert/dessertData.json")
    .then((res) => res.json())
    .then((data) => renderDesserts(data))
    .catch((err) => console.error("JSON load error:", err));
});

function renderDesserts(items) {
  const container = document.getElementById("desserts-container");

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "dessert-card";

    card.innerHTML = `
      <h3>${item.name}</h3>

      <p><strong>Small Tray:</strong> $${item.smallPrice}</p>

      ${
        item.largePrice
          ? `<p><strong>Large Tray:</strong> $${item.largePrice}</p>`
          : `<p><strong>Large Tray:</strong> Not Available</p>`
      }
    `;

    container.appendChild(card);
  });
}
