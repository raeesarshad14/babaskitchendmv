const SHEET_URL =
  "https://opensheet.elk.sh/1iy74WMudLWdZYI1EcU33Z_oHzSKTUFHE-LgxUVeJRbU/Sheet1";

async function loadMenu() {
  const container = document.getElementById("js-menu-container");

  const res = await fetch(SHEET_URL);
  const data = await res.json();

  // Normalize keys (remove spaces)
  const clean = data.map((row) => {
    return {
      day: row["y"]?.trim(),
      dish: row["Dish"]?.trim(),
      price: row["Price"]?.trim(),
    };
  });

  // Group by day
  const days = {};

  clean.forEach((row) => {
    if (!row.day || row.day === "Sunday" || row.dish === "Closed") return;

    if (!days[row.day]) days[row.day] = [];
    days[row.day].push(row);
  });

  // Create one pink template per day
  Object.keys(days).forEach((day) => {
    const card = document.createElement("div");
    card.className = "js-day-card";

    card.innerHTML = `
      <h3 class="js-day-title">${day}</h3>
      ${days[day]
        .map(
          (item) => `
        <div class="js-item">${item.dish} - $${item.price}</div>
      `,
        )
        .join("")}
    `;

    container.appendChild(card);
  });
}

loadMenu();
