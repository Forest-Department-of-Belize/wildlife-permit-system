document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.getElementById('sidebarToggler');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Toggle sidebar on mobile
    if (toggler && sidebar) {
        toggler.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });

        // Close sidebar when overlay is clicked
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });

        // Close sidebar when a menu link is clicked on mobile
        const menuLinks = sidebar.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('show');
                }
            });
        });
    }

    // Auto dismiss alerts after 5 seconds
    setTimeout(function() {
        document.querySelectorAll('.alert').forEach(function(alert) {
            if (typeof bootstrap !== 'undefined') {
                new bootstrap.Alert(alert).close();
            }
        });
    }, 5000);
});