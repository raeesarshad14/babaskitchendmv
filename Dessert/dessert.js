document.addEventListener("DOMContentLoaded", () => {
  fetch("Dessert/dessertData.json")
    .then((res) => res.json())
    .then((data) => renderDesserts(data));
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
          : ""
      }
      <button class="add-btn" onclick='openDessertModal(${JSON.stringify(
        item,
      )})'>ADD</button>
    `;

    container.appendChild(card);
  });
}

function openDessertModal(item) {
  const modal = document.getElementById("dessert-modal");
  const box = document.getElementById("dessert-modal-content");

  // Two-option modal
  if (item.largePrice) {
    box.innerHTML = `
      <h2>${item.name}</h2>

      <div class="qty-row">
        <span>Small Tray ($${item.smallPrice})</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('small', -1)">−</button>
          <span id="qty-small">0</span>
          <button class="qty-btn" onclick="changeQty('small', 1)">+</button>
        </div>
      </div>

      <div class="qty-row">
        <span>Large Tray ($${item.largePrice})</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('large', -1)">−</button>
          <span id="qty-large">0</span>
          <button class="qty-btn" onclick="changeQty('large', 1)">+</button>
        </div>
      </div>

      <p><strong>Subtotal:</strong> $<span id="dessert-subtotal">0</span></p>

      <button class="add-btn" onclick='addDessertToCart(${JSON.stringify(
        item,
      )})'>Add to Cart</button>
      <button class="close-btn" onclick="closeDessertModal()">Close</button>
    `;
  } else {
    // Single-option modal
    box.innerHTML = `
      <h2>${item.name}</h2>

      <div class="qty-row">
        <span>Tray ($${item.smallPrice})</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('single', -1)">−</button>
          <span id="qty-single">1</span>
          <button class="qty-btn" onclick="changeQty('single', 1)">+</button>
        </div>
      </div>

      <p><strong>Subtotal:</strong> $<span id="dessert-subtotal">${
        item.smallPrice
      }</span></p>

      <button class="add-btn" onclick='addDessertToCart(${JSON.stringify(
        item,
      )})'>Add to Cart</button>
      <button class="close-btn" onclick="closeDessertModal()">Close</button>
    `;
  }

  modal.style.display = "flex";
  window.currentDessert = item;
  window.qtySmall = 0;
  window.qtyLarge = 0;
  window.qtySingle = 1;
  updateSubtotal();
}

function changeQty(type, amount) {
  if (type === "small") {
    window.qtySmall = Math.max(0, window.qtySmall + amount);
    document.getElementById("qty-small").textContent = window.qtySmall;
  }
  if (type === "large") {
    window.qtyLarge = Math.max(0, window.qtyLarge + amount);
    document.getElementById("qty-large").textContent = window.qtyLarge;
  }
  if (type === "single") {
    window.qtySingle = Math.max(1, window.qtySingle + amount);
    document.getElementById("qty-single").textContent = window.qtySingle;
  }
  updateSubtotal();
}

function updateSubtotal() {
  const item = window.currentDessert;
  let total = 0;

  if (item.largePrice) {
    total =
      window.qtySmall * item.smallPrice + window.qtyLarge * item.largePrice;
  } else {
    total = window.qtySingle * item.smallPrice;
  }

  document.getElementById("dessert-subtotal").textContent = total;
}

function addDessertToCart(item) {
  if (item.largePrice) {
    if (window.qtySmall > 0)
      cart.addItem(item.name + " (Small)", item.smallPrice, window.qtySmall);

    if (window.qtyLarge > 0)
      cart.addItem(item.name + " (Large)", item.largePrice, window.qtyLarge);
  } else {
    cart.addItem(item.name, item.smallPrice, window.qtySingle);
  }

  cart.save();
  updateCartCount();
  showToast("Added to cart!");
  closeDessertModal();
}

function closeDessertModal() {
  document.getElementById("dessert-modal").style.display = "none";
}
