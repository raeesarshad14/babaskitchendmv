console.log("Checkout JS Loaded");

window.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});

function renderCheckout() {
  const cart = new Cart();
  const subtotal = cart.getTotal();

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

        <div class="checkout-items">${itemsHTML}</div>

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

        <h3>Select Order Type</h3>
        <select id="orderType">
          <option value="" disabled selected>--- Select Order Type ---</option>
          <option value="weekly">Weekly Menu</option>
          <option value="catering">Catering</option>
        </select>

        <div id="cateringWarning" class="checkout-note" style="display:none;">
          Catering orders must be placed at least 4 days in advance.  
          For urgent requests, please contact Baba’s Kitchen at <strong>571‑353‑9225</strong>.
        </div>

        <h3>Order Date</h3>
        <input type="date" id="checkoutDate" class="checkout-date" required />

        <button class="place-order-btn" id="placeOrderBtn">Place Order</button>

        <div id="payment-success" class="success-check">Order Submitted</div>
      </div>

    </div>
  `;

  // Establish standard local initialization bounds
  setupDateRules();
  const dateInput = document.getElementById("checkoutDate");
  if (dateInput) {
    ["focus", "click", "mousedown", "touchstart"].forEach((evt) =>
      dateInput.addEventListener(evt, () => dateInput.showPicker?.()),
    );
  }

  // Functional Bindings
  document
    .getElementById("orderType")
    .addEventListener("change", setupDateRules);
  document
    .getElementById("payment")
    .addEventListener("change", togglePaymentInfo);
  document
    .getElementById("placeOrderBtn")
    .addEventListener("click", placeOrder);
}

function setupDateRules() {
  const type = document.getElementById("orderType").value;
  const dateInput = document.getElementById("checkoutDate");
  const warning = document.getElementById("cateringWarning");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Clear any existing value so boundary changes apply cleanly on Safari
  dateInput.value = "";

  if (!type) {
    warning.style.display = "none";
    dateInput.min = today.toISOString().split("T")[0];
    return;
  }

  if (type === "weekly") {
    warning.style.display = "none";
    // Blocks past dates entirely
    dateInput.min = today.toISOString().split("T")[0];
  } else if (type === "catering") {
    warning.style.display = "block";
    // Blocks past dates + next 3 days safely
    const minCateringDate = new Date(today);
    minCateringDate.setDate(today.getDate() + 4);
    dateInput.min = minCateringDate.toISOString().split("T")[0];
  }
}

function togglePaymentInfo() {
  const method = document.getElementById("payment").value;
  document.getElementById("zelle-info").style.display =
    method === "zelle" ? "block" : "none";
  document.getElementById("venmo-info").style.display =
    method === "venmo" ? "block" : "none";
}

function formatDateForEmail(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${month}-${day}-${year}`;
}

async function placeOrder() {
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const type = document.getElementById("orderType").value;
  const checkoutDate = document.getElementById("checkoutDate").value;

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    return resetButton(btn);
  }

  if (!type) {
    alert(
      "Please select your Order Type (Weekly Menu or Catering) before placing your order.",
    );
    return resetButton(btn);
  }

  if (!checkoutDate) {
    alert("Please select a date for your order.");
    return resetButton(btn);
  }

  // TIMEZONE-SAFE EVALUATION PARSING
  const [year, month, day] = checkoutDate.split("-");
  const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (type === "weekly") {
    if (selectedDate < today) {
      alert("Past dates cannot be selected.");
      return resetButton(btn);
    }
  } else if (type === "catering") {
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 4);

    if (selectedDate < minDate) {
      alert("Catering orders must be placed at least 4 days in advance.");
      return resetButton(btn);
    }
  }

  const cart = new Cart();
  const itemsText = cart.items
    .map((i) => {
      const nameField = i.name.padEnd(24, " ");
      const qtyField = `${i.qty}`.padEnd(12, " ");
      const totalField = `$${(i.price * i.qty).toFixed(2)}`;
      return `${nameField}${qtyField}=  ${totalField}`;
    })
    .join("\n");

  const subtotal = cart.getTotal();

  document.getElementById("form_from_name").value = "BabasKitchendmv";
  document.getElementById("form_name").value = name;
  document.getElementById("form_phone").value = phone;
  document.getElementById("form_payment").value =
    document.getElementById("payment").value;
  document.getElementById("form_items").value = itemsText;
  document.getElementById("form_subtotal").value = subtotal.toFixed(2);
  document.getElementById("form_total").value = subtotal.toFixed(2);
  document.getElementById("form_date").value = formatDateForEmail(checkoutDate);

  document.querySelector("input[name='redirect']").value =
    "https://babaskitchendmv.com/confirmation.html";

  document.getElementById("payment-success").style.display = "block";

  await new Promise((res) => setTimeout(res, 900));

  document.getElementById("checkoutOrderForm").submit();

  cart.items = [];
  cart.save();
}

function resetButton(btn) {
  btn.disabled = false;
  btn.innerText = "Place Order";
}
