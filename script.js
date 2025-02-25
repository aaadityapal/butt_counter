// script.js

// Initialize the counter
let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;

// Display the current counter value
document.getElementById('counterValue').innerText = counter;

// Increment the counter when the button is clicked
document.getElementById('incrementButton').addEventListener('click', () => {
    counter++;
    localStorage.setItem('counter', counter); // Store the updated counter in Local Storage
    document.getElementById('counterValue').innerText = counter; // Update the displayed value
});

// Reset the counter when the reset button is clicked
document.getElementById('resetButton').addEventListener('click', () => {
    counter = 0;
    localStorage.setItem('counter', counter); // Reset the counter in Local Storage
    document.getElementById('counterValue').innerText = counter; // Update the displayed value
});