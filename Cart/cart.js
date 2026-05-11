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

  // Update quantity rules depending on item type
  // Update quantity rules depending on item type
  updateQty(name, qty) {
    const item = this.items.find((i) => i.name === name);
    if (!item) return;

    const isCatering = item.name.includes("Tray");
    const isWeekly = item.type === "weekly";
    const isRoast = item.options && item.options.roast === true;

    // ⭐ WEEKLY ITEMS — min 1
    if (isWeekly) {
      if (qty < 1) qty = 1;
      item.qty = qty;
    }

    // ⭐ ROAST ITEMS — min 1 (THIS FIXES YOUR ISSUE)
    else if (isRoast) {
      if (qty < 1) qty = 1;
      item.qty = qty;
    }

    // ⭐ SINGLE ITEMS — min 12
    else if (!isCatering) {
      if (qty < 12) qty = 12;
      item.qty = qty;
    }

    // ⭐ TRAY ITEMS — min 0
    else {
      if (qty < 0) qty = 0;
      item.qty = qty;
    }

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
    const el = document.getElementById("cart-count");
    if (el) el.textContent = count;
  }
}

// Create global cart instance
window.cart = new Cart();
cart.updateCartCount();

// ⭐ Toast + Animation + Sound
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // Play sound if available
  const sound = document.getElementById("cartSound");
  if (sound) sound.play();

  // Bounce cart icon
  const cartIcon = document.querySelector(".cart-icon img");
  if (cartIcon) {
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 600);
  }

  // Hide toast after 1.5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}
