// overtime-script.js - JavaScript for the overtime tracker

// Initialize overtime data from localStorage
let overtimeHistory = JSON.parse(localStorage.getItem('overtimeHistory')) || [];

// DOM elements
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const actualStartTimeInput = document.getElementById('actualStartTime');
const actualEndTimeInput = document.getElementById('actualEndTime');
const regularHoursDisplay = document.getElementById('regularHours');
const totalHoursDisplay = document.getElementById('totalHours');
const overtimeHoursDisplay = document.getElementById('overtimeHours');
const overtimeStatus = document.getElementById('overtimeStatus');
const calculateButton = document.getElementById('calculateButton');
const resetButton = document.getElementById('resetOvertimeButton');
const homeButton = document.getElementById('homeButton');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');

// Function to convert time string to decimal hours
function timeToDecimal(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
}

// Function to calculate hours between two times
function calculateHours(startTime, endTime) {
    let start = timeToDecimal(startTime);
    let end = timeToDecimal(endTime);
    
    // Handle overnight shifts
    if (end < start) {
        end += 24;
    }
    
    return Math.max(0, end - start);
}

// Function to update regular hours display
function updateRegularHours() {
    const regularHours = calculateHours(startTimeInput.value, endTimeInput.value);
    regularHoursDisplay.textContent = regularHours.toFixed(1);
}

// Function to update total hours display
function updateTotalHours() {
    const totalHours = calculateHours(actualStartTimeInput.value, actualEndTimeInput.value);
    totalHoursDisplay.textContent = totalHours.toFixed(1);
}

// Function to calculate and display overtime
function calculateOvertime() {
    const regularHours = calculateHours(startTimeInput.value, endTimeInput.value);
    const totalHours = calculateHours(actualStartTimeInput.value, actualEndTimeInput.value);
    const overtime = Math.max(0, totalHours - regularHours);
    
    // Update displays
    regularHoursDisplay.textContent = regularHours.toFixed(1);
    totalHoursDisplay.textContent = totalHours.toFixed(1);
    overtimeHoursDisplay.textContent = overtime.toFixed(1);
    
    // Update status indicator
    updateOvertimeStatus(overtime);
    
    // Save to history if there's overtime
    if (overtime > 0) {
        saveOvertimeRecord(regularHours, totalHours, overtime);
    }
}

// Function to update overtime status indicator
function updateOvertimeStatus(overtime) {
    let statusText, statusClass;
    
    if (overtime === 0) {
        statusText = 'No Overtime';
        statusClass = 'status-no-overtime';
    } else if (overtime <= 2) {
        statusText = 'Moderate Overtime';
        statusClass = 'status-overtime';
    } else {
        statusText = 'Excessive Overtime!';
        statusClass = 'status-excessive-overtime';
    }
    
    overtimeStatus.textContent = statusText;
    overtimeStatus.className = 'status-indicator ' + statusClass;
}

// Function to save overtime record to history
function saveOvertimeRecord(regularHours, totalHours, overtime) {
    const record = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        regularHours: regularHours,
        totalHours: totalHours,
        overtime: overtime,
        timestamp: Date.now()
    };
    
    overtimeHistory.unshift(record); // Add to beginning of array
    
    // Keep only last 50 records
    if (overtimeHistory.length > 50) {
        overtimeHistory = overtimeHistory.slice(0, 50);
    }
    
    localStorage.setItem('overtimeHistory', JSON.stringify(overtimeHistory));
    displayHistory();
}

// Function to display overtime history
function displayHistory() {
    if (overtimeHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No overtime records yet</p>';
        return;
    }
    
    const historyHTML = overtimeHistory.map(record => `
        <div class="history-item">
            <div class="date">${record.date} at ${record.time}</div>
            <div class="hours">
                Regular: ${record.regularHours.toFixed(1)}h | 
                Total: ${record.totalHours.toFixed(1)}h | 
                Overtime: <strong>${record.overtime.toFixed(1)}h</strong>
            </div>
        </div>
    `).join('');
    
    historyList.innerHTML = historyHTML;
}

// Function to clear overtime history
function clearHistory() {
    if (confirm('Are you sure you want to clear all overtime history?')) {
        overtimeHistory = [];
        localStorage.removeItem('overtimeHistory');
        displayHistory();
    }
}

// Function to reset all inputs
function resetInputs() {
    startTimeInput.value = '09:00';
    endTimeInput.value = '17:00';
    actualStartTimeInput.value = '09:00';
    actualEndTimeInput.value = '17:00';
    
    updateRegularHours();
    updateTotalHours();
    overtimeHoursDisplay.textContent = '0.0';
    updateOvertimeStatus(0);
}

// Event listeners
startTimeInput.addEventListener('change', updateRegularHours);
endTimeInput.addEventListener('change', updateRegularHours);
actualStartTimeInput.addEventListener('change', updateTotalHours);
actualEndTimeInput.addEventListener('change', updateTotalHours);
calculateButton.addEventListener('click', calculateOvertime);
resetButton.addEventListener('click', resetInputs);
clearHistoryButton.addEventListener('click', clearHistory);

// Home button functionality
homeButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Initialize displays on page load
updateRegularHours();
updateTotalHours();
updateOvertimeStatus(0);
displayHistory();

// Auto-calculate overtime when time inputs change
[startTimeInput, endTimeInput, actualStartTimeInput, actualEndTimeInput].forEach(input => {
    input.addEventListener('change', () => {
        // Small delay to ensure UI updates first
        setTimeout(calculateOvertime, 100);
    });
});