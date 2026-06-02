class Cart {
  constructor() {
    this.key = "baba_cart";
    this.items = this.load();
  }

  // Load cart from localStorage
  load() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  // Save cart to localStorage
  save() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
  }

  // Add item to cart
  addItem(item) {
    const existing = this.items.find(
      (i) =>
        i.name === item.name &&
        JSON.stringify(i.options || {}) === JSON.stringify(item.options || {}),
    );

    if (existing) {
      existing.qty += item.qty;
    } else {
      this.items.push({
        ...item,
        image: item.image || null,
      });
    }

    this.save();
    this.updateCartCount();
  }

  // Remove item by name
  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
    this.save();
    this.updateCartCount();
  }

  /* ---------------------------------------------------------
     UPDATE QUANTITY RULES — FINAL VERSION
     Supports ALL item types including Jan Sisters
     ⭐ Special override ONLY for Imitation Crab Rangoons
  --------------------------------------------------------- */
  updateQty(name, qty) {
    const item = this.items.find((i) => i.name === name);
    if (!item) return;

    // ⭐ SPECIAL FIX — ONLY for Imitation Crab Rangoons
    if (item.name === "Imitation Crab Rangoons") {
      if (qty < 1) qty = 1;
      item.qty = qty;
      this.save();
      this.updateCartCount();
      return;
    }

    const type = item.type;

    switch (type) {
      case "menu": // Smash burger, finger foods
        if (qty < 12) qty = 12;
        break;

      case "weekly": // Weekly menu items
        if (qty < 1) qty = 1;
        break;

      case "roast":
        if (qty < 1) qty = 1;
        break;

      case "dessert":
        if (qty < 1) qty = 1;
        break;

      case "tray": // Catering trays
        if (qty < 0) qty = 0;
        break;

      case "single": // Catering single items
        if (qty < item.minOrder) qty = item.minOrder;
        break;

      case "janSisters": // ⭐ NEW — Jan Sisters Bakery items
        if (qty < 1) qty = 1;
        break;

      default:
        if (qty < 1) qty = 1;
    }

    item.qty = qty;
    this.save();
    this.updateCartCount();
  }

  // Total price
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // Total item count
  getCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  // Update cart badge in header
  updateCartCount() {
    const count = this.getCount();

    // Desktop badge
    const desktop = document.getElementById("cart-count");
    if (desktop) desktop.textContent = count;

    // Old mobile badge (if exists)
    const mobile = document.getElementById("cart-count-mobile");
    if (mobile) mobile.textContent = count;

    // ⭐ Catering mobile badge
    const cateringMobile = document.getElementById(
      "cart-count-mobile-catering",
    );
    if (cateringMobile) cateringMobile.textContent = count;
  }
}

// Create global cart instance
window.cart = new Cart();
cart.updateCartCount();

/* ---------------------------------------------------------
   TOAST + ANIMATION + SOUND
--------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  const sound = document.getElementById("cartSound");
  if (sound) sound.play();

  const cartIcon = document.querySelector(".cart-icon img");
  if (cartIcon) {
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 600);
  }

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}
