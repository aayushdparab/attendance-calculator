// Store chart instance
let chart = null;

// Load HTML content dynamically for each page
function loadHTML(pageId, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(pageId).innerHTML = html;

            // Attach event listener to the login form after it loads
            if (pageId === "loginPage") {
                const loginForm = document.getElementById("loginForm");
                if (loginForm) {
                    loginForm.addEventListener("submit", handleFormSubmit);
                }
            }
        });
}

// Handle form submission for login page
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        prn: document.getElementById('prn').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        password: document.getElementById('password').value
    };

    // Save form data to localStorage
    saveDataToLocalStorage(formData);
    e.target.reset();
    showWarning();
}

// Save data to localStorage
function saveDataToLocalStorage(data) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(data);
    localStorage.setItem('students', JSON.stringify(students));
}

// Page navigation function
function showPage(pageId) {
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

// Show warning and switch to education page
function showWarning() {
    showPage('warningPage');
    setTimeout(() => {
        showPage('educationPage');
    }, 3000);
}

// Show statistics page and update chart
function showStatistics() {
    showPage('statisticsPage');
    updateChart();
}

// Show login page
function showLoginPage() {
    showPage('loginPage');
}

// Update chart data from localStorage
function updateChart() {
    const students = JSON.parse(localStorage.getItem('students')) || [];

    const departments = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 
                         'Civil Engineering', 'Information Technology'];

    const departmentCounts = departments.map(dept => {
        return students.filter(student => student.department === dept).length;
    });

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('statsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: departments,
            datasets: [{
                label: 'Number of Students',
                data: departmentCounts,
                backgroundColor: 'rgba(26, 35, 126, 0.7)',
                borderColor: 'rgba(26, 35, 126, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Initialize and load the HTML components
document.addEventListener("DOMContentLoaded", () => {
    loadHTML("loginPage", "login.html");
    loadHTML("warningPage", "warning.html");
    loadHTML("educationPage", "education.html");
    loadHTML("statisticsPage", "statistics.html");
});
