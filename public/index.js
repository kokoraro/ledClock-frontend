import { hexToRgb, rgbToHex } from './utils.js';

const led_server_url = 'http://192.168.86.247:8000';
let selectedColourBox = null;

let current_colour = [255, 255, 255];
let off_colour = [0, 0, 0];

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  // Create the grid
  createGrid(32, 64);

  // Get selected html element and cache it
  selectedColourBox = document.getElementById('selected-colour-box');

  // Add event listener for reset button
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', onResetClick);

  // Add event listener for send button
  const sendButton = document.getElementById('send');
  sendButton.addEventListener('click', onSendClick);

  // Add a listener to each colour button
  const colourButtons = document.querySelectorAll('.color-button');
  colourButtons.forEach((button) => {
    const color = button.getAttribute('data-color');
    button.style.backgroundColor = color;
    button.addEventListener('click', onColourClick);
  });

  // Add event listener for mouse move on grid
  const grid = document.getElementById('grid');
  grid.addEventListener('mousemove', onGridMouseMove);

});

function onSendClick() {
  // Loop through cells and create pixel data
  const cells = document.querySelectorAll('.cell');
  const pixelData = [];
  cells.forEach((cell) => {
    const position = [cell.getAttribute('data-y'), cell.getAttribute('data-x')]
    const colour = hexToRgb(cell.getAttribute('data-colour'));

    pixelData.push({
      'rgb': colour,
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

function onColourClick(event) {
  const colour = event.target.getAttribute('data-color');

  // if it doesn't have a colour attribute, return
  if (!colour) return;

  // Change the selected colour box
  selectedColourBox.style.backgroundColor = colour;

  // convert hexcode colour to rgb list
  const rgb = hexToRgb(colour);
  current_colour = rgb;
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

      // Set current colour
      setCellColour(cell, off_colour);

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

  setCellColour(cell, current_colour);
}


function setCellColour(cell, colour) {
  cell.setAttribute('data-colour', rgbToHex(colour));
  cell.style.backgroundColor = `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`;
}

// Handle individual cell click
function onCellClick(x, y) {
  const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  const colour = hexToRgb(cell.getAttribute('data-colour'));

  if (colour != off_colour) {
    setCellColour(cell, off_colour);
  } else {
    setCellColour(cell, current_colour);
  }
}

// Handle reset button click
function onResetClick() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    setCellColour(cell, off_colour);
  });
}

