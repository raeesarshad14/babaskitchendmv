document.addEventListener("DOMContentLoaded", () => {
  fetch("Dessert/dessertData.json")
    .then((res) => res.json())
    .then((data) => renderDesserts(data));
});

/* ---------------------------------------------------------
   RENDER DESSERT CARDS
--------------------------------------------------------- */
function renderDesserts(items) {
  const container = document.getElementById("desserts-container");

  items.forEach((item) => {
    const safeItem = encodeURIComponent(JSON.stringify(item));

    const card = document.createElement("div");
    card.className = "dessert-card";

    // Build tray lines dynamically
    let trayHTML = `
      <p class="tray-line">
        <span class="tray-label">Small Tray :</span>
        <span class="tray-price">$${item.smallPrice}</span>
      </p>
    `;

    // Only add Large Tray if it exists
    if (item.largePrice) {
      trayHTML += `
        <p class="tray-line">
          <span class="tray-label">Large Tray :</span>
          <span class="tray-price">$${item.largePrice}</span>
        </p>
      `;
    }

    card.innerHTML = `
      <h3>${item.name}</h3>
      ${trayHTML}

      <button class="dessert-add-btn"
        onclick="openDessertModal(JSON.parse(decodeURIComponent('${safeItem}')))">
        Add
      </button>
    `;

    container.appendChild(card);
  });
}

/* ---------------------------------------------------------
   OPEN MODAL
--------------------------------------------------------- */
function openDessertModal(item) {
  const modal = document.getElementById("dessert-modal");
  const box = document.getElementById("dessert-modal-content");

  window.currentDessert = item;
  window.qtySmall = 0;
  window.qtyLarge = 0;
  window.qtySingle = 1;

  // MULTI-TRAY ITEM
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

      <p class="total-label">
        <span>Subtotal :</span>
        <span id="dessert-subtotal">$0</span>
      </p>

      <button class="add-btn" onclick="addDessertToCart()">Add to Cart</button>
      <button class="close-btn" onclick="closeDessertModal()">Close</button>
    `;
  }

  // SINGLE-PRICE ITEM (Baklava, etc.)
  else {
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

      <p class="total-label">
        <span>Subtotal :</span>
        <span id="dessert-subtotal">${item.smallPrice}</span>
      </p>

      <button class="add-btn" onclick="addDessertToCart()">Add to Cart</button>
      <button class="close-btn" onclick="closeDessertModal()">Close</button>
    `;
  }

  modal.style.display = "flex";
  updateSubtotal();
}

/* ---------------------------------------------------------
   QUANTITY + SUBTOTAL
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   ADD TO CART
--------------------------------------------------------- */
function addDessertToCart() {
  const item = window.currentDessert;

  if (item.largePrice) {
    if (window.qtySmall > 0) {
      cart.addItem({
        name: `${item.name} (Small Tray)`,
        price: item.smallPrice,
        qty: window.qtySmall,
        type: "dessert",
      });
    }

    if (window.qtyLarge > 0) {
      cart.addItem({
        name: `${item.name} (Large Tray)`,
        price: item.largePrice,
        qty: window.qtyLarge,
        type: "dessert",
      });
    }
  } else {
    cart.addItem({
      name: item.name,
      price: item.smallPrice,
      qty: window.qtySingle,
      type: "dessert",
    });
  }

  cart.save();
  cart.updateCartCount();
  closeDessertModal();
}

/* ---------------------------------------------------------
   CLOSE MODAL
--------------------------------------------------------- */
function closeDessertModal() {
  document.getElementById("dessert-modal").style.display = "none";
}
