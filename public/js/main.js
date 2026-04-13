// Mobile sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');

    if (toggler && sidebar) {
        toggler.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Auto dismiss alerts
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);
});