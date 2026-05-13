console.log("Checkout JS Loaded");

window.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});

function renderCheckout() {
  const cart = new Cart();
  const subtotal = cart.getTotal();
  const total = subtotal;

  const itemsHTML = cart.items
    .map(
      (i) => `
      <div class="checkout-item">
        <span>${i.name}</span>
        <span>$${i.price} x ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `,
    )
    .join("");

  document.getElementById("checkout-root").innerHTML = `
    <div class="checkout-wrapper">

      <div class="checkout-summary">
        <h2>Order Summary</h2>

        <div class="checkout-items">
          ${itemsHTML}
        </div>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>

        <div class="summary-total">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>

      <div class="checkout-form">
        <h2>Customer Information</h2>
        <input id="name" placeholder="Full Name" />
        <input id="phone" placeholder="Phone Number" />
        <input id="address" placeholder="Delivery Address" />

        <h3>Payment Method</h3>
        <select id="payment">
          <option value="cash">Cash on Delivery</option>
          <option value="zelle">Zelle</option>
        </select>

        <div id="zelle-info" class="zelle-box" style="display:none;">
          <h4 class="zelle-title">Zelle Payment Instructions</h4>
          <div class="zelle-number">571-353-9225</div>
          <p class="zelle-note">Send payment before placing your order.</p>
        </div>

        <button class="place-order-btn" id="placeOrderBtn">
          Place Order
        </button>

        <div id="payment-success" class="success-check">Order Submitted</div>
      </div>

    </div>
  `;

  document
    .getElementById("payment")
    .addEventListener("change", toggleZelleInfo);
  document
    .getElementById("placeOrderBtn")
    .addEventListener("click", placeOrder);
}

function toggleZelleInfo() {
  const method = document.getElementById("payment").value;
  document.getElementById("zelle-info").style.display =
    method === "zelle" ? "block" : "none";
}

async function placeOrder() {
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address) {
    alert("Please fill out all fields.");
    btn.disabled = false;
    btn.innerText = "Place Order";
    return;
  }

  const cart = new Cart();
  const items = cart.items;

  const itemsText = items
    .map((i) => `${i.name} (x${i.qty}) - $${(i.price * i.qty).toFixed(2)}`)
    .join("\n");

  const subtotal = cart.getTotal();
  const total = subtotal;

  document.getElementById("form_from_name").value = "BabasKitchendmv";
  document.getElementById("form_name").value = name;
  document.getElementById("form_phone").value = phone;
  document.getElementById("form_address").value = address;
  document.getElementById("form_payment").value = payment;
  document.getElementById("form_items").value = itemsText;
  document.getElementById("form_subtotal").value = subtotal.toFixed(2);
  document.getElementById("form_total").value = total.toFixed(2);

  document.getElementById("payment-success").style.display = "block";

  await new Promise((res) => setTimeout(res, 900));

  document.getElementById("checkoutOrderForm").submit();

  cart.items = [];
  cart.save();
}
