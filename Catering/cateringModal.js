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

  if (modalItem.type === "single" && !modalItem.minOrder) {
    modalItem.minOrder = 12;
  }

  if (modalItem.type === "roast") {
    modalItem.minOrder = 1;
    modalItem.qty = 1;
  }

  document.getElementById("modalItemName").textContent = modalItem.name;

  document.getElementById("smallTrayRow").style.display = "none";
  document.getElementById("largeTrayRow").style.display = "none";
  document.getElementById("singleRow").style.display = "none";

  // ⭐ TRAY
  if (modalItem.type === "tray") {
    modalItem.smallQty = 0;
    modalItem.largeQty = 0;

    document.getElementById("smallQty").textContent = 0;
    document.getElementById("largeQty").textContent = 0;

    document.getElementById("smallPriceUnit").textContent =
      modalItem.smallPrice;
    document.getElementById("largePriceUnit").textContent =
      modalItem.largePrice;

    document.getElementById("smallTrayRow").style.display = "flex";
    document.getElementById("largeTrayRow").style.display = "flex";

    updateTotals();
    document.getElementById("cateringModalOverlay").style.display = "flex";
    return;
  }

  // ⭐ ROAST — START AT 1
  if (modalItem.type === "roast") {
    document.getElementById("singleRow").style.display = "flex";
    document.getElementById("singleQty").textContent = modalItem.qty;

    updateTotals();
    document.getElementById("cateringModalOverlay").style.display = "flex";
    return;
  }

  // ⭐ SINGLE — START AT 12
  if (modalItem.type === "single") {
    modalItem.qty = modalItem.minOrder;

    document.getElementById("singleQty").textContent = modalItem.qty;
    document.getElementById("singleRow").style.display = "flex";

    updateTotals();
    document.getElementById("cateringModalOverlay").style.display = "flex";
    return;
  }

  updateTotals();
  document.getElementById("cateringModalOverlay").style.display = "flex";
}

function changeQty(type, amount) {
  // ⭐ TRAY SMALL
  if (type === "small") {
    modalItem.smallQty = Math.max(0, modalItem.smallQty + amount);
    document.getElementById("smallQty").textContent = modalItem.smallQty;
    updateTotals();
    return;
  }

  // ⭐ TRAY LARGE
  if (type === "large") {
    modalItem.largeQty = Math.max(0, modalItem.largeQty + amount);
    document.getElementById("largeQty").textContent = modalItem.largeQty;
    updateTotals();
    return;
  }

  // ⭐ SINGLE — NEVER BELOW 12
  if (type === "single") {
    modalItem.qty = Math.max(modalItem.minOrder, modalItem.qty + amount);
    document.getElementById("singleQty").textContent = modalItem.qty;
    updateTotals();
    return;
  }

  // ⭐ ROAST — NEVER BELOW 1
  if (type === "roast") {
    modalItem.qty = Math.max(1, modalItem.qty + amount);
    document.getElementById("singleQty").textContent = modalItem.qty;
    updateTotals();
    return;
  }
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

document.getElementById("modalAddBtn").addEventListener("click", () => {
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

  if (modalItem.type === "single") {
    cart.addItem({
      name: modalItem.name,
      price: modalItem.price,
      qty: modalItem.qty,
      image: modalItem.image || null,
      type: "menu",
      options: {},
    });
  }

  if (modalItem.type === "roast") {
    cart.addItem({
      name: modalItem.name,
      price: modalItem.price,
      qty: modalItem.qty,
      image: modalItem.image || null,
      type: "roast",
      options: { roast: true },
    });
  }

  showToast(`${modalItem.name} added to cart!`);
  closeModal();
});

window.openModal = openModal;
