console.log("Weekly Menu JS Loaded");

let wmBasePrice = 0;

// ===============================
// LOAD WEEKLY MENU
// ===============================
async function loadWeeklyMenu() {
  const url =
    "https://opensheet.elk.sh/1TH3C7z8csSiTcegs18HABEWp2NYWXvrSEZufJl1X04c/Sheet1";

  try {
    const data = await fetch(url).then((r) => r.json());

    // ⭐ DATE RANGE
    const startDate = data[0].StartDate;
    const endDate = data[0].EndDate;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const formatted = `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} – ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

      document.getElementById("wm-date-range").textContent = formatted;
    }

    // ⭐ GROUP BY DAY
    const days = {};

    data.forEach((row) => {
      const day = row.y?.trim();
      if (!day) return;

      if (!days[day]) days[day] = [];
      days[day].push(row);
    });

    // ⭐ SORT DAYS
    const DAY_ORDER = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const container = document.getElementById("weekly-menu");

    container.innerHTML = DAY_ORDER.filter((d) => days[d])
      .map((day) => {
        const items = days[day]
          .map(
            (item) => `
              <div class="weekly-item-row">
                <div class="weekly-name">
                  ${item.Dish} ${
                    item.Description ? `(${item.Description})` : ""
                  }
                </div>

                <div class="weekly-price">$${item.Price}</div>

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

// ===============================
// SCROLL TO DAY
// ===============================
function scrollToDay(day) {
  const section = document.getElementById(`day-${day}`);
  if (!section) return;

  // ⭐ Detect header height (desktop or mobile)
  const header =
    document.querySelector(".main-header") ||
    document.querySelector(".mobile-header-catering");

  const headerHeight = header ? header.offsetHeight : 80;

  // ⭐ Calculate exact scroll position
  const y =
    section.getBoundingClientRect().top +
    window.pageYOffset -
    (headerHeight + 170);

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}

// ===============================
// MODAL LOGIC
// ===============================
function openWeeklyModal(name, price) {
  document.getElementById("wm-dish-name").textContent = name;

  wmBasePrice = Number(price);

  document.getElementById("wm-qty").textContent = 1;

  // ⭐ FIXED: inline price shows unit price
  document.getElementById("wm-inline-price").textContent = "$" + wmBasePrice;
  document.getElementById("wm-total-price").textContent = "$" + wmBasePrice;

  document.getElementById("weeklyModal").style.display = "flex";

  // ⭐ Prevent background scroll
  document.body.style.overflow = "hidden";

  document.querySelector(".wm-add-cart").onclick = () => {
    addWeeklyToCart(name, wmBasePrice);
  };
}

function closeWeeklyModal() {
  document.getElementById("weeklyModal").style.display = "none";

  // ⭐ Restore scroll
  document.body.style.overflow = "";
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
  const total = qty * wmBasePrice;

  // ⭐ FIXED: inline price = unit price
  document.getElementById("wm-inline-price").textContent = "$" + wmBasePrice;

  document.getElementById("wm-total-price").textContent = "$" + total;
}

function addWeeklyToCart(name, price) {
  const qty = parseInt(document.getElementById("wm-qty").textContent);

  const item = {
    name: name,
    price: price,
    qty: qty,
    type: "weekly",
    options: {},
  };

  cart.addItem(item);

  closeWeeklyModal();
  showToast(name + " added to cart");
}

loadWeeklyMenu();
