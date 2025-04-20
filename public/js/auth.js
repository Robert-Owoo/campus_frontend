document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                setAuthToken(response.token);
                setUser(response.user);

                if (response.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            try {
                const response = await apiRequest('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });

                setAuthToken(response.token);
                setUser(response.user);

                if (response.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        });
    }
}); 