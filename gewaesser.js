function formatTypen(typIds, typenById) {
  const names = typIds.map((id) => typenById[id]).filter(Boolean);
  return names.length > 0 ? names.join(", ") : "—";
}

function renderGewaesserTable(gewaesser, typenById, query = "", sortState) {
  const tbody = document.getElementById("gewaesser-table-body");
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = gewaesser.filter((item) =>
    item.Name.toLowerCase().includes(normalizedQuery)
  );

  if (sortState.column) {
    filtered.sort((left, right) => {
      const leftValue =
        sortState.column === "name"
          ? left.Name
          : formatTypen(left.Typen, typenById);
      const rightValue =
        sortState.column === "name"
          ? right.Name
          : formatTypen(right.Typen, typenById);
      const comparison = compareDe(leftValue, rightValue);

      return sortState.direction === "asc" ? comparison : -comparison;
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<p class="data-table__empty">Keine Gewässer gefunden.</p>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (item) => `
      <div class="data-row data-row--gewaesser" data-id="${item.ID}">
        <span class="data-row__name">${item.Name}</span>
        <span>${item.Tiefe}</span>
        <span>${formatTypen(item.Typen, typenById)}</span>
      </div>
    `
    )
    .join("");
}

async function init() {
  const [gewaesserResponse, typenResponse] = await Promise.all([
    fetch("gewaesser.json"),
    fetch("typen.json"),
  ]);
  const { gewaesser } = await gewaesserResponse.json();
  const { typen } = await typenResponse.json();
  const typenById = Object.fromEntries(typen.map((typ) => [typ.ID, typ.Name]));
  let sortState = { column: "name", direction: "asc" };
  const searchInput = document.getElementById("search-input");

  renderGewaesserTable(gewaesser, typenById, searchInput.value, sortState);

  searchInput.addEventListener("input", () => {
    renderGewaesserTable(gewaesser, typenById, searchInput.value, sortState);
  });

  initSortableHeaders(
    document.querySelector(".data-table__header"),
    (column) => {
      sortState = nextSortState(
        sortState.column,
        sortState.direction,
        column
      );
      renderGewaesserTable(gewaesser, typenById, searchInput.value, sortState);

      return sortState;
    },
    sortState
  );
}

init();
