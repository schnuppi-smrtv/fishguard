function formatSchonzeit(von, bis) {
  if (!von && !bis) return "—";
  if (!von) return `bis ${bis}`;
  if (!bis) return `ab ${von}`;
  return `${von} – ${bis}`;
}

function renderFishTable(fische, typenById, query = "") {
  const tbody = document.getElementById("fish-table-body");
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = fische.filter((fisch) =>
    fisch.Name.toLowerCase().includes(normalizedQuery)
  );

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<p class="data-table__empty">Keine Fische gefunden.</p>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (fisch) => `
      <div class="data-row data-row--fish" data-id="${fisch.ID}">
        <span class="data-row__name">${fisch.Name}</span>
        <span>${typenById[fisch.Typ] ?? "—"}</span>
        <span>${formatSchonzeit(fisch.Schonzeit_von, fisch.Schonzeit_bis)}</span>
        <span>${fisch.Mindestmass}</span>
      </div>
    `
    )
    .join("");
}

async function init() {
  const [fischeResponse, typenResponse] = await Promise.all([
    fetch("fische.json"),
    fetch("typen.json"),
  ]);
  const { fische } = await fischeResponse.json();
  const { typen } = await typenResponse.json();
  const typenById = Object.fromEntries(typen.map((typ) => [typ.ID, typ.Name]));

  renderFishTable(fische, typenById);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (event) => {
    renderFishTable(fische, typenById, event.target.value);
  });
}

init();
