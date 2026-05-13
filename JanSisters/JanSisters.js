// ===============================
// GOOGLE SHEET SOURCE
// ===============================
const SHEET_URL =
  "https://opensheet.elk.sh/1iy74WMudLWdZYI1EcU33Z_oHzSKTUFHE-LgxUVeJRbU/Sheet1";

// Correct day order
const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ===============================
// LOAD MENU FROM GOOGLE SHEET
// ===============================
async function loadMenu() {
  const container = document.getElementById("js-menu-container");

  const res = await fetch(SHEET_URL);
  const data = await res.json();

  // Clean + normalize
  const clean = data.map((row) => ({
    day: row["y"]?.trim(),
    dish: row["Dish"]?.trim(),
    price: row["Price"]?.trim(),
    image: row["Image"]?.trim(),
  }));

  const days = {};

  clean.forEach((row) => {
    if (!row.day) return;
    if (row.day === "Sunday") return;
    if (row.dish === "Closed") return;

    if (!days[row.day]) days[row.day] = [];
    days[row.day].push(row);
  });

  // Sort days in correct order
  const sortedDays = DAY_ORDER.filter((d) => days[d]);

  sortedDays.forEach((day) => {
    const card = document.createElement("div");
    card.className = "js-day-card";

    card.innerHTML = `
      <div class="js-day-content">
        <h3 class="js-day-title">${day}</h3>

        ${days[day]
          .map(
            (item) => `
          <div class="js-item">
            ${
              item.image
                ? `<img class="js-item-img" src="${item.image}" />`
                : ""
            }

            <div class="js-item-row">
              <span>${item.dish} - $${item.price}</span>

              <button 
                class="js-add-btn" 
                data-name="${item.dish}" 
                data-price="${item.price}">
                Add
              </button>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    container.appendChild(card);
  });

  // Attach Add button events AFTER rendering
  attachAddButtonEvents();
}

// ===============================
// ADD BUTTON LOGIC
// ===============================
function attachAddButtonEvents() {
  document.querySelectorAll(".js-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      addToCart(name, price);
    });
  });
}

// ===============================
// CART LOGIC
// ===============================
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    name,
    price,
    qty: 1,
    type: "janSisters",
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  bounceCartIcon();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

function bounceCartIcon() {
  const img = document.querySelector(".cart-icon img");
  img.classList.add("bounce");
  setTimeout(() => img.classList.remove("bounce"), 600);
}

// ===============================
// INIT
// ===============================
loadMenu();
updateCartCount();
