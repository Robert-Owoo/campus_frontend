// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Common functions
const showError = (message) => {
    alert(message);
};

const showSuccess = (message) => {
    alert(message);
};

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

const removeAuthToken = () => {
    localStorage.removeItem('token');
};

const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem('user');
};

const isAuthenticated = () => {
    return !!getAuthToken();
};

const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'admin';
};

const isStudent = () => {
    const user = getUser();
    return user && user.role === 'student';
};

const redirectToLogin = () => {
    window.location.href = 'index.html';
};

const handleLogout = () => {
    removeAuthToken();
    removeUser();
    redirectToLogin();
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
};

// Navigation guard
const checkAuth = () => {
    if (!isAuthenticated()) {
        redirectToLogin();
        return false;
    }

    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin-dashboard.html' && !isAdmin()) {
        window.location.href = 'student-dashboard.html';
        return false;
    }

    if (currentPage === 'student-dashboard.html' && !isStudent()) {
        window.location.href = 'admin-dashboard.html';
        return false;
    }

    return true;
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Check authentication on protected pages
    const protectedPages = ['student-dashboard.html', 'admin-dashboard.html', 'application.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }
}); 