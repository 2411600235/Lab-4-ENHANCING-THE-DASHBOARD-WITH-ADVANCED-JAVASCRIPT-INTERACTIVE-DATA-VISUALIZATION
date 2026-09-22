document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const feedbackDiv = document.getElementById('loginFeedback');
  const rememberMe = document.getElementById('rememberMe');

  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
    return;
  }

  function showFeedback(message, type) {
    const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
    feedbackDiv.innerHTML = `
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        showFeedback('Please enter both username and password.', 'danger');
        return;
      }

      const validUsername = '2411600235';
      const validPassword = '2411600235Ian';

      if (username === validUsername && password === validPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', rememberMe.checked ? username : 'Student');

        showFeedback('Login successful!', 'success');

        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        showFeedback('Invalid username or password. Please try again.', 'danger');
      }
    });
  }
});
