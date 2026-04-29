document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.getElementById('sidebarToggler');
    const sidebar = document.getElementById('sidebar');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (toggler && sidebar) {
        toggler.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });

        sidebar.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('show');
                }
            });
        });
    }

    setTimeout(function() {
        document.querySelectorAll('.alert').forEach(function(alert) {
            if (typeof bootstrap !== 'undefined') {
                new bootstrap.Alert(alert).close();
            }
        });
    }, 5000);
});

// Auto logout after 10 minutes of inactivity
let inactivityTimer;

function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function() {
        window.location.href = '/logout';
    }, 10 * 60 * 1000); // 10 minutes
}

// Reset timer on any user activity
['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
    document.addEventListener(event, resetTimer, true);
});

resetTimer();