// ===============================
// GOOGLE SHEET SOURCE
// ===============================
const SHEET_URL =
  "https://opensheet.elk.sh/1iy74WMudLWdZYI1EcU33Z_oHzSKTUFHE-LgxUVeJRbU/Sheet1";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ===============================
// LOAD MENU
// ===============================
async function loadMenu() {
  const container = document.getElementById("js-menu-container");

  const res = await fetch(SHEET_URL);
  const data = await res.json();

  const clean = data.map((row) => ({
    day: row["y"]?.trim(),
    dish: row["Dish"]?.trim(),
    price: Number(row["Price"]),
    image: row["Image"]?.trim() || null,
  }));

  const days = {};

  clean.forEach((row) => {
    if (!row.day) return;
    if (row.day === "Sunday") return;
    if (row.dish === "Closed") return;

    if (!days[row.day]) days[row.day] = [];
    days[row.day].push(row);
  });

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

  // Attach modal open events
  attachAddButtonEvents();
}

// ===============================
// INIT
// ===============================
loadMenu();
window.cart.updateCartCount();
