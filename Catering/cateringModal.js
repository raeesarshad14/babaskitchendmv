let modalItem = {
  name: "",
  type: "",
  price: 0,
  smallPrice: 0,
  largePrice: 0,
  qty: 12,
  smallQty: 0,
  largeQty: 0,
  minOrder: 12,
  image: null,
};

function openModal(item) {
  modalItem = { ...item };

  // ⭐ FORCE roast to have minOrder = 1 BEFORE ANYTHING ELSE
  if (modalItem.type === "roast") {
    modalItem.minOrder = 1;
    modalItem.qty = 1;
  }

  document.getElementById("modalItemName").textContent = modalItem.name;

  // Hide all rows
  document.getElementById("smallTrayRow").style.display = "none";
  document.getElementById("largeTrayRow").style.display = "none";
  document.getElementById("singleRow").style.display = "none";

  // ⭐ TRAY ITEMS
  if (modalItem.type === "tray") {
    document.getElementById("smallTrayRow").style.display = "flex";
    document.getElementById("largeTrayRow").style.display = "flex";

    document.getElementById("smallPriceUnit").textContent =
      modalItem.smallPrice;
    document.getElementById("largePriceUnit").textContent =
      modalItem.largePrice;

    modalItem.smallQty = 0;
    modalItem.largeQty = 0;
  }

  // ⭐ ROAST — SIMPLE MULTIPLIER
  if (modalItem.type === "roast") {
    document.getElementById("singleRow").style.display = "flex";
    document.getElementById("singleQty").textContent = modalItem.qty;

    updateTotals();
    document.getElementById("cateringModalOverlay").style.display = "flex";
    return;
  }

  // ⭐ SINGLE PRICE (min 12)
  if (modalItem.type === "single") {
    document.getElementById("singleRow").style.display = "flex";
    modalItem.qty = modalItem.minOrder || 12;
    document.getElementById("singleQty").textContent = modalItem.qty;
  }

  updateTotals();
  document.getElementById("cateringModalOverlay").style.display = "flex";
}

function changeQty(type, amount) {
  if (type === "small") {
    modalItem.smallQty = Math.max(0, modalItem.smallQty + amount);
    document.getElementById("smallQty").textContent = modalItem.smallQty;
  }

  if (type === "large") {
    modalItem.largeQty = Math.max(0, modalItem.largeQty + amount);
    document.getElementById("largeQty").textContent = modalItem.largeQty;
  }

  if (type === "single") {
    let min = modalItem.minOrder; // roast = 1, single = 12
    modalItem.qty = Math.max(min, modalItem.qty + amount);
    document.getElementById("singleQty").textContent = modalItem.qty;
  }

  updateTotals();
}

function updateTotals() {
  let subtotal = 0;

  if (modalItem.type === "tray") {
    const smallTotal = modalItem.smallQty * modalItem.smallPrice;
    const largeTotal = modalItem.largeQty * modalItem.largePrice;

    document.getElementById("smallTotal").textContent = `$${smallTotal}`;
    document.getElementById("largeTotal").textContent = `$${largeTotal}`;

    subtotal = smallTotal + largeTotal;
  }

  if (modalItem.type === "single" || modalItem.type === "roast") {
    const total = modalItem.qty * modalItem.price;
    document.getElementById("singleTotal").textContent = `$${total}`;
    subtotal = total;
  }

  document.getElementById("modalSubtotal").textContent = `$${subtotal}`;
}

function closeModal() {
  document.getElementById("cateringModalOverlay").style.display = "none";
}

/* ⭐ FINAL FIX — ADD TO CART LOGIC */
document.getElementById("modalAddBtn").addEventListener("click", () => {
  // TRAY ITEMS
  if (modalItem.type === "tray") {
    if (modalItem.smallQty > 0) {
      cart.addItem({
        name: `${modalItem.name} - Small Tray`,
        price: modalItem.smallPrice,
        qty: modalItem.smallQty,
        image: modalItem.image || null,
        options: { size: "small" },
      });
    }

    if (modalItem.largeQty > 0) {
      cart.addItem({
        name: `${modalItem.name} - Large Tray`,
        price: modalItem.largePrice,
        qty: modalItem.largeQty,
        image: modalItem.image || null,
        options: { size: "large" },
      });
    }
  }

  // SINGLE ITEMS
  if (modalItem.type === "single") {
    cart.addItem({
      name: modalItem.name,
      price: modalItem.price,
      qty: modalItem.qty,
      image: modalItem.image || null,
      options: {},
    });
  }

  // ROAST ITEMS
  if (modalItem.type === "roast") {
    cart.addItem({
      name: modalItem.name,
      price: modalItem.price,
      qty: modalItem.qty,
      image: modalItem.image || null,
      options: { roast: true },
    });
  }

  // ⭐ Toast + bounce + sound
  showToast(`${modalItem.name} added to cart!`);

  closeModal();
});

window.openModal = openModal;
