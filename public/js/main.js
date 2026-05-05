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

    // Dashboard charts
    if (typeof Chart !== 'undefined' && typeof window.chartData !== 'undefined') {
        const PIE_COLORS = ['#2E7D32','#FFC107','#1565C0','#C62828','#6A1B9A','#00838F','#558B2F','#EF6C00'];
        const BAR_GREEN  = 'rgba(46,125,50,0.8)';
        const BAR_BLUE   = 'rgba(21,101,192,0.8)';
        Chart.defaults.font.family = "'Segoe UI', sans-serif";
        Chart.defaults.font.size   = 12;

        function shortLabel(s) {
            return s.replace('Forest Station','FS').replace('Headquarters','HQ').replace(' District','');
        }

        const psByStatus = window.chartData.permitsByStatus;
        if (document.getElementById('permitStatusChart')) {
            new Chart(document.getElementById('permitStatusChart'), {
                type: 'doughnut',
                data: {
                    labels: psByStatus.length ? psByStatus.map(r => r.status || 'Unknown') : ['No data'],
                    datasets: [{ data: psByStatus.length ? psByStatus.map(r => parseInt(r.count)) : [1], backgroundColor: psByStatus.length ? PIE_COLORS : ['#e0e0e0'], borderWidth: 2 }]
                },
                options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
            });
        }

        const insByStatus = window.chartData.inspectionsByStatus;
        if (document.getElementById('inspectionStatusChart')) {
            new Chart(document.getElementById('inspectionStatusChart'), {
                type: 'doughnut',
                data: {
                    labels: insByStatus.length ? insByStatus.map(r => r.inspection_status || 'Unknown') : ['No data'],
                    datasets: [{ data: insByStatus.length ? insByStatus.map(r => parseInt(r.count)) : [1], backgroundColor: insByStatus.length ? PIE_COLORS : ['#e0e0e0'], borderWidth: 2 }]
                },
                options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
            });
        }

        const psStation = window.chartData.permitsByStation;
        if (document.getElementById('permitStationChart')) {
            new Chart(document.getElementById('permitStationChart'), {
                type: 'bar',
                data: {
                    labels: psStation.length ? psStation.map(r => shortLabel(r.station)) : ['No data'],
                    datasets: [{ label: 'Permits', data: psStation.length ? psStation.map(r => parseInt(r.count)) : [0], backgroundColor: BAR_GREEN, borderRadius: 4 }]
                },
                options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, maintainAspectRatio: false }
            });
        }

        const apStation = window.chartData.applicantsByStation;
        if (document.getElementById('applicantStationChart')) {
            new Chart(document.getElementById('applicantStationChart'), {
                type: 'bar',
                data: {
                    labels: apStation.length ? apStation.map(r => shortLabel(r.station)) : ['No data'],
                    datasets: [{ label: 'Applicants', data: apStation.length ? apStation.map(r => parseInt(r.count)) : [0], backgroundColor: BAR_BLUE, borderRadius: 4 }]
                },
                options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, maintainAspectRatio: false }
            });
        }
    }
});

// Auto logout after 10 minutes of inactivity
let inactivityTimer;
function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function() {
        window.location.href = '/logout';
    }, 10 * 60 * 1000);
}
['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
    document.addEventListener(event, resetTimer, true);
});
resetTimer();