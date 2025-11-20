document.addEventListener('DOMContentLoaded', function () {
    // auth notifications (toasts) for login/register/logout
    const containerId = 'toast-container';
    let toastContainer = document.getElementById(containerId);
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = containerId;
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1080';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'info') {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center show';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        const isSuccess = type === 'success';
        const isError = type === 'error' || type === 'danger';

        const bodyClass = isSuccess ? 'text-white bg-success' : (isError ? 'bg-warning text-dark' : '');

        // Close button style: use white button on dark bg
        const btnCloseClass = isSuccess ? 'btn-close btn-close-white me-2 m-auto' : 'btn-close me-2 m-auto';

        toastEl.innerHTML = `
            <div class="d-flex ${bodyClass}">
                <div class="toast-body">${message}</div>
                <button type="button" class="${btnCloseClass}" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);

        // Use Bootstrap's Toast if available
        try {
            const bsToast = new bootstrap.Toast(toastEl, { delay: 5000 });
            bsToast.show();
            toastEl.addEventListener('hidden.bs.toast', function () { toastEl.remove(); });
        } catch (e) {
            // Fallback: auto-remove after 5s
            setTimeout(() => { toastEl.remove(); }, 5000);
        }
    }

    // If server rendered an alert element, decide whether to convert it to a toast
    // Keep server-rendered warning/error alerts visible (e.g., wrong email/password on login).
    const alertEl = document.querySelector('.alert');
    if (alertEl) {
        // prevent showing a leftover success toast after a server-side error
        try { sessionStorage.removeItem('auth_notify'); } catch (e) {}
        const msg = alertEl.textContent.trim();
        const isWarning = alertEl.classList.contains('alert-warning') || alertEl.classList.contains('alert-danger');
        if (isWarning) {
            // Leave the server-rendered alert in place so original behavior remains.
        } else {
            // Non-warning alerts (info/success) are converted to toasts and removed from DOM.
            showToast(msg, 'info');
            alertEl.remove();
        }
    }

    // Attach submit handlers to set a session flag before submit
    const loginForm = document.querySelector('form[action="/auth/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function () {
            try { sessionStorage.setItem('auth_notify', 'login'); } catch (e) {}
        });
    }

    const registerForm = document.querySelector('form[action="/auth/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function () {
            try { sessionStorage.setItem('auth_notify', 'register'); } catch (e) {}
        });
    }

    // Attach click handlers to logout links so we can show a toast after redirect
    const logoutLinks = Array.from(document.querySelectorAll('a[href="/auth/logout"]'));
    logoutLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            try { sessionStorage.setItem('auth_notify', 'logout'); } catch (e) {}
            // allow navigation to proceed
        });
    });

    // On page load, if a flag exists, show a success toast then clear it.
    // Only show success if there is no server-rendered warning/danger alert (prevents false success after failed login).
    try {
        const flag = sessionStorage.getItem('auth_notify');
        if (flag) {
            // small delay to allow server-rendered alerts to be present if they are injected late
            setTimeout(function () {
                const serverWarning = document.querySelector('.alert.alert-warning, .alert.alert-danger');
                if (serverWarning) {
                    // There's a server-side error/warning on the page — don't show success toast.
                    try { sessionStorage.removeItem('auth_notify'); } catch (e) {}
                    // suppress success toast when server shows an error
                    return;
                }

                if (flag === 'login') showToast('Đăng nhập thành công', 'success');
                else if (flag === 'register') showToast('Đăng ký thành công. Vui lòng kiểm tra email để xác thực.', 'success');
                else if (flag === 'logout') showToast('Đăng xuất thành công', 'success');
                try { sessionStorage.removeItem('auth_notify'); } catch (e) {}
            }, 80);
        }
    } catch (e) { /* sessionStorage not available or other error; silently ignore */ }
});
