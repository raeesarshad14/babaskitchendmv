console.log("Checkout JS Loaded");

window.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});

function formatDateUS(dateStr) {
  if (!dateStr) return "";

  // If already formatted as MM-DD-YYYY, return directly
  if (dateStr.includes("-") && dateStr.split("-")[0].length !== 4)
    return dateStr;

  // Safely parse YYYY-MM-DD without timezone shifting
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const yyyy = parts[0];
    const mm = parts[1].padStart(2, "0");
    const dd = parts[2].padStart(2, "0");
    return `${mm}-${dd}-${yyyy}`;
  }

  // Fallback if format is different
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function renderCheckout() {
  const cart = new Cart();
  const subtotal = cart.getTotal();
  const total = subtotal;

  const itemsHTML = cart.items
    .map((i) => {
      const itemDate = (i.options && i.options.date) || i.date || "";
      return `
        <div class="checkout-item">
          <span>${i.name}</span>
          <span class="checkout-qty">${i.qty}</span>
          <span class="checkout-total">$${(i.price * i.qty).toFixed(2)}</span>
          ${
            itemDate
              ? `<div class="checkout-date">Catering Date: ${formatDateUS(itemDate)}</div>`
              : ""
          }
        </div>
      `;
    })
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
  document.getElementById("venmo-info").style.display =
    method === "venmo" ? "block" : "none";
}

async function placeOrder() {
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
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
      const itemDate = (i.options && i.options.date) || i.date || "";
      const dateLine = itemDate ? ` | Date: ${formatDateUS(itemDate)}` : "";
      return `${name}${qty}=  ${total}${dateLine}`;
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

  // ⭐ Catering Date formatted US style
  const cateringDate = items.find(
    (i) => (i.options && i.options.date) || i.date,
  );
  const coreDateStr = cateringDate
    ? cateringDate.options?.date || cateringDate.date
    : "";
  document.getElementById("form_catering_date").value = coreDateStr
    ? formatDateUS(coreDateStr)
    : "";

  // Redirect
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
