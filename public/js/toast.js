// toast.js
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'success', duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Tự động ẩn
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
}

// Optional: CSS styling nếu chưa có
const style = document.createElement('style');
style.textContent = `
#toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}
.toast {
    opacity: 0;
    margin-bottom: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    color: #fff;
    min-width: 200px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.toast.show { opacity: 1; transform: translateY(0); }
.toast-success { background-color: #28a745; }
.toast-error { background-color: #dc3545; }
.toast-warning { background-color: #ffc107; color: #000; }
`;
document.head.appendChild(style);
