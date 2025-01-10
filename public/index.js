const led_server_url = 'http://192.168.86.247:8000';

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  // Add event listener for reset button
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', onResetClick);

  // Add event listener for send button
  const sendButton = document.getElementById('send');
  sendButton.addEventListener('click', onSendClick);

  // Add event listener for mouse move on grid
  const grid = document.getElementById('grid');
  grid.addEventListener('mousemove', onGridMouseMove);


  // Create the grid
  createGrid(32, 64)
});

function onSendClick() {
  // Loop through cells and create pixel data
  const cells = document.querySelectorAll('.cell');
  const pixelData = [];
  cells.forEach((cell) => {
    const position = [cell.getAttribute('data-y'), cell.getAttribute('data-x')]
    const isActive = cell.classList.contains('active');
    const rgb = isActive ? [255, 255, 255] : [0, 0, 0];

    pixelData.push({
      'rgb': rgb,
      'position':position,
    });
  });

  // Send pixels to server
  fetch(`${led_server_url}/matrix`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pixelData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Create the grid
function createGrid(rows, columns) {
  const gridElement = document.getElementById('grid');

  // Clear any existing grid
  gridElement.innerHTML = '';

  // Create rows and columns
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Add data attributes for x and y coordinates
      cell.setAttribute('data-x', i);
      cell.setAttribute('data-y', j);

      // Add event listener for mouse click
      cell.addEventListener('click', onCellClick.bind(null, i, j));

      // row.appendChild(cell);
      gridElement.appendChild(cell);
    }
  }
}


// Handle mouse move over grid
function onGridMouseMove(event) {
  // check if mouse is held down, if so return
  if (!event.buttons) return;

  const cell = event.target;

  // check if the target is a cell
  if (!cell.classList.contains('cell')) return;

  cell.classList.add('active');
}

// Handle individual cell click
function onCellClick(x, y) {
  const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  if (cell.classList.contains('active')) {
    cell.classList.remove('active');
  } else {
    cell.classList.add('active');
  }
}

// Handle reset button click
function onResetClick() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.classList.remove('active');
  });
}

