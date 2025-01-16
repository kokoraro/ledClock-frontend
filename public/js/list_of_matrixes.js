import { led_server_url } from './utils.js';

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
      console.log('Success:', data);
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

        // Create save and send button icons
        matrixElement.innerHTML = `
          <div class="matrix-name">${matrixName}</div>
          <div class="matrix-actions">
            <button class="matrix-load"><i class="fas fa-save"></i></button>
            <button class="matrix-send"><i class="fas fa-paper-plane"></i></button>
            <button class="matrix-delete"><i class="fas fa-trash"></i></button>
          </div>
        `;
        matrixesElement.appendChild(matrixElement);

        const loadButton = matrixElement.querySelector('.matrix-load');
        loadButton.addEventListener('click', onLoadClick);
        const deleteButton = matrixElement.querySelector('.matrix-send');
        deleteButton.addEventListener('click', onSendClick);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function onLoadClick() {

}

function onSendClick() {

}
