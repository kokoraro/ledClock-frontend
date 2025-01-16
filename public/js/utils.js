
// TODO: find a better way to do this
const led_server_url = 'http://192.168.86.247:8000';
// const led_server_url = 'http://localhost:8000';


// Converts a hex code value to a list of RGB values
function hexToRgb(hex) {
  // BEGIN: hexToRgb
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
  // END: hexToRgb
}

// Converts a list of RGB values to their hex code equivalent
function rgbToHex(rgb) {
  // BEGIN: rgbToHex
  const r = rgb[0].toString(16).padStart(2, '0');
  const g = rgb[1].toString(16).padStart(2, '0');
  const b = rgb[2].toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
  // END: rgbToHex
}

export { hexToRgb, rgbToHex, led_server_url };
