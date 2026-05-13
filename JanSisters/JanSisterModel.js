// ===============================
// MODAL LOGIC
// ===============================
let modalName = "";
let modalPrice = 0;
let modalQty = 1;

const modal = document.getElementById("jsModal");
const modalTitle = document.getElementById("jsModalTitle");
const modalPriceEl = document.getElementById("jsModalPrice");
const modalTotalEl = document.getElementById("jsModalTotal");
const qtyNum = document.getElementById("jsQtyNumber");

// OPEN MODAL
function attachAddButtonEvents() {
  document.querySelectorAll(".js-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalName = btn.dataset.name;
      modalPrice = Number(btn.dataset.price);
      modalQty = 1;

      modalTitle.textContent = modalName;
      modalPriceEl.textContent = modalPrice.toFixed(2);
      qtyNum.textContent = modalQty;
      modalTotalEl.textContent = modalPrice.toFixed(2);

      modal.style.display = "flex";
    });
  });
}

// CLOSE BUTTON (X)
document.querySelector(".js-close").addEventListener("click", () => {
  modal.style.display = "none";
});

// CLOSE WHEN CLICKING OUTSIDE BOX
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// QUANTITY +
document.getElementById("jsQtyPlus").addEventListener("click", () => {
  modalQty++;
  qtyNum.textContent = modalQty;
  modalTotalEl.textContent = (modalQty * modalPrice).toFixed(2);
});

// QUANTITY -
document.getElementById("jsQtyMinus").addEventListener("click", () => {
  if (modalQty > 1) modalQty--;
  qtyNum.textContent = modalQty;
  modalTotalEl.textContent = (modalQty * modalPrice).toFixed(2);
});

// ADD TO CART
document.getElementById("jsAddToCartBtn").addEventListener("click", () => {
  window.cart.addItem({
    name: modalName,
    price: modalPrice,
    qty: modalQty,
    type: "janSisters",
    image: null,
  });

  showToast(`${modalName} added to cart`);

  // ⭐ FIX: CLOSE MODAL AFTER ADDING
  modal.style.display = "none";
});
