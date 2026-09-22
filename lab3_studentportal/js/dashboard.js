document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const username = localStorage.getItem('user') || 'Student';
  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) {
    userNameSpan.textContent = username;
  }

  updateGreeting(username);
  updateStatistics();
  setupInteractions();
  setupLogout();
  setupChart();
  renderAlert();
  renderTable();
});

const activityData = [
  { date: '2026-09-20', course: 'IT 101', activity: 'Submitted research paper', status: 'success' },
  { date: '2026-09-18', course: 'Science', activity: 'Attendance marked for lab', status: 'info' },
  { date: '2026-09-17', course: 'Math', activity: 'Quiz reminder for Friday', status: 'warning' },
  { date: '2026-09-15', course: 'IT 101', activity: 'Professor posted final project brief', status: 'success' },
  { date: '2026-09-13', course: 'Library', activity: 'Book renewal completed', status: 'danger' }
];

function updateGreeting(username) {
  const greetingElement = document.getElementById('greeting');
  if (!greetingElement) return;

  const hour = new Date().getHours();
  let timeOfDay = 'Good Evening';

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Good Evening';
  } else {
    timeOfDay = 'Good Night';
  }

  greetingElement.textContent = `${timeOfDay}, ${username}!`;
}

function updateStatistics() {
  const stats = [
    { title: 'Current GPA', value: '3.82', color: 'text-primary' },
    { title: 'Courses', value: '6', color: 'text-success' },
    { title: 'Assignments', value: '4', color: 'text-info' },
    { title: 'Attendance', value: '94%', color: 'text-warning' }
  ];

  stats.forEach((stat, index) => {
    const titleElement = document.getElementById(`stat${index + 1}-title`);
    const valueElement = document.getElementById(`stat${index + 1}-value`);

    if (titleElement) {
      titleElement.textContent = stat.title;
    }

    if (valueElement) {
      valueElement.textContent = stat.value;
      valueElement.className = `card-text fw-bold ${stat.color}`;
    }
  });
}

function setupInteractions() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const courseFilter = document.getElementById('courseFilter');
  const exportBtn = document.getElementById('exportBtn');

  searchInput.addEventListener('input', renderTable);
  statusFilter.addEventListener('change', renderTable);
  courseFilter.addEventListener('change', renderTable);
  exportBtn.addEventListener('click', exportToCSV);
}

function getFilteredData() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const courseFilter = document.getElementById('courseFilter');

  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const status = statusFilter ? statusFilter.value : 'all';
  const course = courseFilter ? courseFilter.value : 'all';

  return activityData.filter((item) => {
    const matchesSearch =
      item.activity.toLowerCase().includes(query) ||
      item.course.toLowerCase().includes(query);

    const matchesStatus = status === 'all' || item.status === status;
    const matchesCourse = course === 'all' || item.course === course;

    return matchesSearch && matchesStatus && matchesCourse;
  });
}

function renderTable() {
  const tableBody = document.getElementById('activityTableBody');
  if (!tableBody) return;

  const filtered = getFilteredData();

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">No matching records found.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered
    .map((item) => {
      let badgeClass = 'bg-secondary';

      if (item.status === 'success') {
        badgeClass = 'bg-success';
      } else if (item.status === 'warning') {
        badgeClass = 'bg-warning text-dark';
      } else if (item.status === 'danger') {
        badgeClass = 'bg-danger';
      } else if (item.status === 'info') {
        badgeClass = 'bg-info text-dark';
      }

      return `
        <tr>
          <td>${item.date}</td>
          <td>${item.course}</td>
          <td>${item.activity}</td>
          <td><span class="badge ${badgeClass}">${item.status}</span></td>
        </tr>
      `;
    })
    .join('');
}

function renderAlert() {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;

  const warningItems = activityData.filter((item) => item.status === 'warning' || item.status === 'danger');

  if (warningItems.length > 0) {
    alertBox.innerHTML = `
      <div class="alert alert-warning mb-0" role="alert">
        Attention: ${warningItems.length} item(s) need your review.
      </div>
    `;
  } else {
    alertBox.innerHTML = `
      <div class="alert alert-success mb-0" role="alert">
        Everything looks good for now.
      </div>
    `;
  }
}

function exportToCSV() {
  const rows = getFilteredData();

  if (rows.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = ['Date', 'Course', 'Activity', 'Status'];
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => [row.date, row.course, row.activity, row.status].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = 'student_activity.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function setupChart() {
  const canvas = document.getElementById('gradeChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const grades = [
    { label: 'IT 101', value: 88 },
    { label: 'Math', value: 92 },
    { label: 'Science', value: 80 },
    { label: 'English', value: 85 }
  ];

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: grades.map((item) => item.label),
      datasets: [{
        label: 'Course Grade',
        data: grades.map((item) => item.value),
        backgroundColor: ['#1a5276', '#2980b9', '#2c3e50', '#e67e22'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          max: 100
        }
      }
    }
  });
}

function setupLogout() {
  const logoutButtons = document.querySelectorAll('#logoutBtn, #logoutLink');

  logoutButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  });
}
