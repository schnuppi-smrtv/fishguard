function formatSchonzeit(von, bis) {
  if (!von && !bis) return "—";
  if (!von) return `bis ${bis}`;
  if (!bis) return `ab ${von}`;
  return `${von} – ${bis}`;
}

function renderFishTable(fische, query = "") {
  const tbody = document.getElementById("fish-table-body");
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = fische.filter((fisch) =>
    fisch.Name.toLowerCase().includes(normalizedQuery)
  );

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<p class="fish-table__empty">Keine Fische gefunden.</p>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (fisch) => `
      <div class="fish-row" data-id="${fisch.ID}">
        <span class="fish-row__name">${fisch.Name}</span>
        <span class="fish-row__schonzeit">${formatSchonzeit(fisch.Schonzeit_von, fisch.Schonzeit_bis)}</span>
        <span class="fish-row__mass">${fisch.Mindestmass}</span>
      </div>
    `
    )
    .join("");
}

async function init() {
  const response = await fetch("fische.json");
  const data = await response.json();
  const fische = data.fische;

  renderFishTable(fische);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (event) => {
    renderFishTable(fische, event.target.value);
  });
}

init();
