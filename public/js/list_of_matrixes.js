import { led_server_url, rgbToHex, saveMatrixLocal } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadMatrixes();
});


function loadMatrixes() {
  // Make a request to the server to get the list of matrixes
  // passing the page and limit parameters
  fetch(`${led_server_url}/get-matrixes?page=0&limit=10`)
    .then((response) => response.json())
    .then((data) => {
      const matrixes = data.matrixes;
      const matrixesElement = document.getElementById('matrix-list');

      if (matrixes == undefined || matrixes.length === 0) {
        matrixesElement.innerHTML = '<div class="no-matrixes">No matrixes found</div>';
        return;
      }

      matrixesElement.innerHTML = '';
      matrixes.forEach((matrix) => {
        const matrixElement = document.createElement('div');
        // Remove .json from end of name
        const matrixName = matrix.replace('.json', '');

        // Create the matrix element
        matrixElement.classList.add('matrix');
        matrixElement.setAttribute('data-id', matrixName);

        // Add save and send button icons
        matrixElement.innerHTML = `
          <div class="matrix-name">${matrixName}</div>
          <div class="matrix-buttons">
            <button class="matrix-button" id="load-button" title="Open matrix for editing"><i class="fas fa-save"></i></button>
            <button class="matrix-button" id="send-button" title="Send matrix to device"><i class="fas fa-paper-plane"></i></button>
            <button class="matrix-button" id="delete-button" title="Delete matrix from device"><i class="fas fa-trash"></i></button>
          </div>
        `;

        // Query the server for the matrix
        fetch(`${led_server_url}/get-matrix?timestamp=${matrixName}`)
          .then((response) => response.json())
          .then((data) => {
            // Data is recieved in the form of a strucutre like this:
            /*

            [
              {
                'rgb': [255, 255, 255],
                'position': [0, 0]
              },
              {
                'rgb': [255, 255, 255],
                'position': [1, 0]
              },
              ...
              ...etc..
              ...
            ]

            */

            // Load data as JSON
            const matrixData = JSON.parse(data);
            const matrixElement = document.querySelector(`[data-id="${matrixName}"]`);
            const matrixGridElement = document.createElement('div');
            matrixGridElement.classList.add('matrix-grid');

            // Create the grid
            matrixData.forEach((pixel) => {
              const cell = document.createElement('div');
              cell.classList.add('cell');
              cell.setAttribute('data-x', pixel.position[0]);
              cell.setAttribute('data-y', pixel.position[1]);
              cell.setAttribute('data-colour', rgbToHex(pixel.rgb));
              cell.style.backgroundColor = rgbToHex(pixel.rgb);
              matrixGridElement.appendChild(cell);
            });

            matrixElement.appendChild(matrixGridElement);
          })
          .catch((error) => {
            console.error('Error:', error);
          });


        matrixesElement.appendChild(matrixElement);

        const loadButton = matrixElement.querySelector('#load-button');
        loadButton.addEventListener('click', onLoadClick);
        const sendButton = matrixElement.querySelector('#send-button');
        sendButton.addEventListener('click', onSendClick);
        const deleteButton = matrixElement.querySelector('#delete-button');
        deleteButton.addEventListener('click', onDeleteClick);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function onLoadClick() {
  // Update cookie with matrix data and go back to index page
  saveMatrixLocal(this.parentElement.parentElement);
  window.location.href = '/';
}

function onSendClick() {
  // Send request to server to send matrix to device
  const matrixName = this.parentElement.parentElement.getAttribute('data-id');
  fetch(`${led_server_url}/load-matrix?timestamp=${matrixName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-control-allow-origin': '*',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function onDeleteClick() {
  // show confirmation prompt to user
  if (!confirm('Are you sure you want to delete this matrix?')) {
    return;
  }

  // Send request to server to delete matrix
  const matrixName = this.parentElement.parentElement.getAttribute('data-id');
  fetch(`${led_server_url}/delete-matrix?timestamp=${matrixName}`, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': '*',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      loadMatrixes();
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // Reload the page
    location.reload();
}
