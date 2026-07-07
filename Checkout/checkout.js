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
        <span class="checkout-qty">${i.qty}</span>
        <span class="checkout-total">$${(i.price * i.qty).toFixed(2)}</span>
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

        <div class="summary-total">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="checkout-form">
        <h2>Customer Information</h2>

        <div class="checkout-note">
          A deposit applies to orders over $60. Local delivery is available upon request for an additional fee. 
          Please contact us using the Contact Us link above.
        </div>

        <input id="name" placeholder="Full Name" />
        <input id="phone" placeholder="Phone Number" />

        <h3>Payment Method</h3>
        <select id="payment">
          <option value="cash">Cash</option>
          <option value="zelle">Zelle</option>
          <option value="venmo">Venmo</option>
        </select>

        <div id="zelle-info" class="zelle-box" style="display:none;">
          <h4 class="zelle-title">Zelle Payment Instructions</h4>
          <div class="zelle-number">571-353-9225</div>
          <div class="zelle-number">Fozia Jan</div>
          <p class="zelle-note">Send payment before placing your order.</p>
        </div>

        <div id="venmo-info" class="venmo-box" style="display:none;">
          <h4 class="venmo-title">Venmo Payment Instructions</h4>
          <div class="venmo-number">@Babaskitchendmv</div>
          <div class="venmo-number">Fozia Jan</div>
          <p class="venmo-note">Send payment before placing your order.</p>
        </div>

        <!-- ⭐ NEW: SELECT DATE -->
        <h3>Order Date</h3>
          <div class="checkout-note">
            Catering orders must be placed at least 4 days in advance.  
            For urgent requests, please contact Baba’s Kitchen at <strong>571‑353‑9225</strong>.
          </div>
        <input type="date" id="checkoutDate" class="checkout-date" />

        <button class="place-order-btn" id="placeOrderBtn">
          Place Order
        </button>

        <div id="payment-success" class="success-check">Order Submitted</div>
      </div>

    </div>
  `;

  // ⭐ Setup date restrictions (block today + next 3 days)
  const dateInput = document.getElementById("checkoutDate");
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 4); // block today + next 3 days
    dateInput.min = today.toISOString().split("T")[0];

    // ⭐ Make calendar open whenever user clicks/taps/focuses
    dateInput.addEventListener("focus", () => dateInput.showPicker?.());
    dateInput.addEventListener("click", () => dateInput.showPicker?.());
    dateInput.addEventListener("mousedown", () => dateInput.showPicker?.());
    dateInput.addEventListener("touchstart", () => dateInput.showPicker?.());
  }

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

  document.getElementById("venmo-info").style.display =
    method === "venmo" ? "block" : "none";
}

// ⭐ Helper to format date in American style (MM-DD-YYYY)
function formatDateForEmail(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  return `${parts[1]}-${parts[2]}-${parts[0]}`;
}

async function placeOrder() {
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const payment = document.getElementById("payment").value;
  const checkoutDate = document.getElementById("checkoutDate").value;

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    btn.disabled = false;
    btn.innerText = "Place Order";
    return;
  }

  if (!checkoutDate) {
    alert("Please select a date for your order.");
    btn.disabled = false;
    btn.innerText = "Place Order";
    return;
  }

  const cart = new Cart();
  const items = cart.items;

  const itemsText = items
    .map((i) => {
      const name = i.name.padEnd(24, " ");
      const qty = `${i.qty}`.padEnd(12, " ");
      const total = `$${(i.price * i.qty).toFixed(2)}`;
      return `${name}${qty}=  ${total}`;
    })
    .join("\n");

  const subtotal = cart.getTotal();
  const total = subtotal;

  // Fill hidden form fields
  document.getElementById("form_from_name").value = "BabasKitchendmv";
  document.getElementById("form_name").value = name;
  document.getElementById("form_phone").value = phone;
  document.getElementById("form_payment").value = payment;
  document.getElementById("form_items").value = itemsText;
  document.getElementById("form_subtotal").value = subtotal.toFixed(2);
  document.getElementById("form_total").value = total.toFixed(2);

  // ⭐ NEW: Add formatted Order Date to form
  document.getElementById("form_date").value = formatDateForEmail(checkoutDate);

  // ⭐ CRITICAL FIX — FORCE REDIRECT FIELD
  document.querySelector("input[name='redirect']").value =
    "https://babaskitchendmv.com/confirmation.html";

  // Show success animation
  document.getElementById("payment-success").style.display = "block";

  await new Promise((res) => setTimeout(res, 900));

  // Submit form
  document.getElementById("checkoutOrderForm").submit();

  // Clear cart
  cart.items = [];
  cart.save();
}
