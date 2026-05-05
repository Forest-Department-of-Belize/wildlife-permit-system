document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.getElementById('sidebarToggler');
    const sidebar = document.getElementById('sidebar');

    if (toggler && sidebar) {
        toggler.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !toggler.contains(e.target)) {
                sidebar.classList.remove('open');
            }
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
    if (document.getElementById('permitStatusChart')) {
        var PIE_COLORS = ['#2E7D32','#FFC107','#1565C0','#C62828','#6A1B9A','#00838F','#558B2F','#EF6C00'];
        var BAR_GREEN = 'rgba(46,125,50,0.8)';
        var BAR_BLUE = 'rgba(21,101,192,0.8)';

        function shortLabel(s) {
            if (!s) return 'Unknown';
            return s.replace('Forest Station','FS').replace('Headquarters','HQ').replace(' District','');
        }

        fetch('/dashboard/charts')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var psByStatus = data.permitsByStatus || [];
                new Chart(document.getElementById('permitStatusChart'), {
                    type: 'doughnut',
                    data: {
                        labels: psByStatus.length ? psByStatus.map(function(r){ return r.status || 'Unknown'; }) : ['No data'],
                        datasets: [{ data: psByStatus.length ? psByStatus.map(function(r){ return parseInt(r.count); }) : [1], backgroundColor: psByStatus.length ? PIE_COLORS : ['#e0e0e0'], borderWidth: 2 }]
                    },
                    options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
                });

                var insByStatus = data.inspectionsByStatus || [];
                new Chart(document.getElementById('inspectionStatusChart'), {
                    type: 'doughnut',
                    data: {
                        labels: insByStatus.length ? insByStatus.map(function(r){ return r.inspection_status || 'Unknown'; }) : ['No data'],
                        datasets: [{ data: insByStatus.length ? insByStatus.map(function(r){ return parseInt(r.count); }) : [1], backgroundColor: insByStatus.length ? PIE_COLORS : ['#e0e0e0'], borderWidth: 2 }]
                    },
                    options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }
                });

                var psStation = data.permitsByStation || [];
                new Chart(document.getElementById('permitStationChart'), {
                    type: 'bar',
                    data: {
                        labels: psStation.length ? psStation.map(function(r){ return shortLabel(r.station); }) : ['No data'],
                        datasets: [{ label: 'Permits', data: psStation.length ? psStation.map(function(r){ return parseInt(r.count); }) : [0], backgroundColor: BAR_GREEN, borderRadius: 4 }]
                    },
                    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, maintainAspectRatio: false }
                });

                var apStation = data.applicantsByStation || [];
                new Chart(document.getElementById('applicantStationChart'), {
                    type: 'bar',
                    data: {
                        labels: apStation.length ? apStation.map(function(r){ return shortLabel(r.station); }) : ['No data'],
                        datasets: [{ label: 'Applicants', data: apStation.length ? apStation.map(function(r){ return parseInt(r.count); }) : [0], backgroundColor: BAR_BLUE, borderRadius: 4 }]
                    },
                    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, maintainAspectRatio: false }
                });
            })
            .catch(function(err) { console.error('Chart error:', err); });
    }
});

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