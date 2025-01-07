
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  createGrid(64, 32)
});

// Create the grid
function createGrid(rows, columns) {
  const gridElement = document.getElementById('grid');

  // Clear any existing grid
  gridElement.innerHTML = '';

  // Create rows and columns
  for (let i = 0; i < rows; i++) {
    // const row = document.createElement('div');
    // row.classList.add('row');

    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Add event listener for mouse click
      cell.addEventListener('click', () => {
        // Handle cell click functionality here
        console.log(`Clicked on cell (${i}, ${j})`);
      });

      // row.appendChild(cell);
      gridElement.appendChild(cell);
    }

    // gridElement.appendChild(row);
  }
}
