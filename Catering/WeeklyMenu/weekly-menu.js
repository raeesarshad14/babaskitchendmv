console.log("Weekly Menu JS Loaded");

async function loadWeeklyMenu() {
  const url =
    "https://opensheet.elk.sh/1TH3C7z8csSiTcegs18HABEWp2NYWXvrSEZufJl1X04c/Sheet1";

  try {
    const data = await fetch(url).then((r) => r.json());

    const days = {};

    data.forEach((row) => {
      const day = row.y; // your JSON uses "y" for day
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
          <div class="weekly-day-card">
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

loadWeeklyMenu();
