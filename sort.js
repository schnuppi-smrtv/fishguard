function compareDe(left, right) {
  return String(left).localeCompare(String(right), "de", {
    sensitivity: "base",
  });
}

function nextSortState(currentColumn, currentDirection, clickedColumn) {
  if (currentColumn === clickedColumn) {
    return {
      column: clickedColumn,
      direction: currentDirection === "asc" ? "desc" : "asc",
    };
  }

  return { column: clickedColumn, direction: "asc" };
}

function updateSortableHeaders(buttons, sortState) {
  buttons.forEach((sortableButton) => {
    const isActive = sortableButton.dataset.sort === sortState.column;
    const direction = isActive ? sortState.direction : "none";
    const label = sortableButton.dataset.sortLabel;

    sortableButton.setAttribute(
      "aria-sort",
      direction === "asc"
        ? "ascending"
        : direction === "desc"
          ? "descending"
          : "none"
    );
    sortableButton.setAttribute(
      "aria-label",
      isActive
        ? `Nach ${label} sortieren, ${
            direction === "asc" ? "aufsteigend" : "absteigend"
          }`
        : `Nach ${label} sortieren`
    );
  });
}

function initSortableHeaders(container, onSort, initialSortState) {
  const buttons = container.querySelectorAll("[data-sort]");

  updateSortableHeaders(buttons, initialSortState);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortState = onSort(button.dataset.sort);

      updateSortableHeaders(buttons, sortState);
    });
  });
}
