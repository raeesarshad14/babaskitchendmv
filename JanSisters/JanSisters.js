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
      <h3 class="js-day-title">${day}</h3>
      ${days[day]
        .map(
          (item) => `
        <div class="js-item">
          ${item.image ? `<img class="js-item-img" src="${item.image}" />` : ""}
          <div>${item.dish} - $${item.price}</div>
        </div>
      `,
        )
        .join("")}
    `;

    container.appendChild(card);
  });
}

loadMenu();
