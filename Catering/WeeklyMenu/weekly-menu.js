console.log("Weekly Menu JS Loaded");

let wmBasePrice = 0; // ⭐ base unit price (never multiplied)

async function loadWeeklyMenu() {
  const url =
    "https://opensheet.elk.sh/1TH3C7z8csSiTcegs18HABEWp2NYWXvrSEZufJl1X04c/Sheet1";

  try {
    const data = await fetch(url).then((r) => r.json());

    const days = {};

    data.forEach((row) => {
      const day = row.y;
      if (!days[day]) days[day] = [];
      days[day].push(row);
    });

    const container = document.getElementById("weekly-menu");

    container.innerHTML = Object.keys(days)
      .map((day) => {
        const items = days[day]
          .map(
            (item) => `
              <div class="weekly-item">
                <div class="weekly-item-info">
                  <div class="weekly-dish">
                    ${item.Dish} ${item.Description ? `(${item.Description})` : ""}
                  </div>
                  <div class="weekly-price">$${item.Price}</div>
                </div>

                <button class="weekly-add-btn"
                  onclick='openWeeklyModal("${item.Dish}", ${item.Price})'>
                  Add
                </button>
              </div>
            `,
          )
          .join("");

        return `
          <div class="weekly-day-card" id="day-${day}">
            <div class="weekly-day-title">${day}</div>
            ${items}
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Weekly Menu Error:", err);
  }
}

function scrollToDay(day) {
  const section = document.getElementById(`day-${day}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openWeeklyModal(name, price) {
  document.getElementById("wm-dish-name").textContent = name;

  // ⭐ store base unit price
  wmBasePrice = Number(price);

  // reset qty
  document.getElementById("wm-qty").textContent = 1;

  // set inline price & subtotal (same)
  const startTotal = wmBasePrice;
  document.getElementById("wm-inline-price").textContent = "$" + startTotal;
  document.getElementById("wm-total-price").textContent = "$" + startTotal;

  // show modal
  document.getElementById("weeklyModal").style.display = "flex";

  // bind Add to Cart
  document.querySelector(".wm-add-cart").onclick = function () {
    addWeeklyToCart(name, wmBasePrice);
  };
}

function closeWeeklyModal() {
  document.getElementById("weeklyModal").style.display = "none";
}

function wmIncrease() {
  let qty = parseInt(document.getElementById("wm-qty").textContent);
  qty++;
  document.getElementById("wm-qty").textContent = qty;
  updateWeeklySubtotal();
}

function wmDecrease() {
  let qty = parseInt(document.getElementById("wm-qty").textContent);
  if (qty > 1) qty--;
  document.getElementById("wm-qty").textContent = qty;
  updateWeeklySubtotal();
}

function updateWeeklySubtotal() {
  const qty = parseInt(document.getElementById("wm-qty").textContent);

  // ⭐ always use base price, never the displayed text
  const total = qty * wmBasePrice;

  // inline price and subtotal should be the SAME
  document.getElementById("wm-inline-price").textContent = "$" + total;
  document.getElementById("wm-total-price").textContent = "$" + total;
}

function addWeeklyToCart(name, price) {
  const qty = parseInt(document.getElementById("wm-qty").textContent);

  const item = {
    name: name,
    price: price,
    qty: qty, // ⭐ MUST BE qty (NOT quantity)
    type: "weekly",
    options: {}, // ⭐ required so JSON.stringify matches
  };

  cart.addItem(item); // ⭐ use your Cart class directly

  closeWeeklyModal();
  showToast(name + " added to cart");
}

loadWeeklyMenu();
