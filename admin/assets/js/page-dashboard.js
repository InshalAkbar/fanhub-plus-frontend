(function () {
  'use strict';

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    const data = window.FanHubAdminDashboard || {};
    const activity = data.activity || {};
    const categories = data.categories || [];

    const T = {
      text: '#B6A9CE',
      textMuted: '#7C7099',
      grid: 'rgba(90,69,120,0.18)',
      accent: '#8237AC',
      indigo: '#22217A'
    };

    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = T.text;

    const tooltip = {
      backgroundColor: '#1A1C59',
      borderColor: '#452454',
      borderWidth: 1,
      titleColor: '#EDE9F5',
      bodyColor: '#B6A9CE',
      padding: 12,
      cornerRadius: 8
    };

    const activityEl = document.getElementById('activityChart');
    if (activityEl) {
      const ctx = activityEl.getContext('2d');
      const visitorGrad = ctx.createLinearGradient(0, 0, 0, 260);
      visitorGrad.addColorStop(0, 'rgba(130,55,172,.35)');
      visitorGrad.addColorStop(1, 'rgba(130,55,172,0)');

      const userGrad = ctx.createLinearGradient(0, 0, 0, 260);
      userGrad.addColorStop(0, 'rgba(34,33,122,.45)');
      userGrad.addColorStop(1, 'rgba(34,33,122,0)');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: activity.labels || [],
          datasets: [
            {
              label: 'Visitors',
              data: activity.visitors || [],
              borderColor: T.accent,
              backgroundColor: visitorGrad,
              borderWidth: 2.5,
              tension: .4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: T.accent,
              pointBorderColor: '#161931',
              pointBorderWidth: 2
            },
            {
              label: 'Registered users',
              data: activity.users || [],
              borderColor: '#5A4578',
              backgroundColor: userGrad,
              borderWidth: 2.5,
              tension: .4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#5A4578',
              pointBorderColor: '#161931',
              pointBorderWidth: 2
            },
            {
              label: 'Chatbot queries',
              data: activity.chatbot || [],
              borderColor: '#E8A33D',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: .4,
              fill: false,
              pointRadius: 3,
              pointHoverRadius: 5,
              pointBackgroundColor: '#E8A33D'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 16, color: T.text }
            },
            tooltip
          },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: T.textMuted } },
            y: {
              beginAtZero: true,
              grid: { color: T.grid, drawTicks: false },
              border: { display: false },
              ticks: { color: T.textMuted, padding: 8, precision: 0 }
            }
          }
        }
      });
    }

    const catEl = document.getElementById('categoryChart');
    if (catEl) {
      const labels = categories.map(item => item.name);
      const values = categories.map(item => Number(item.count) || 0);
      const palette = ['#E85D3D','#7B5FA8','#8237AC','#22217A','#D96FA0','#E8A33D','#5A4578','#653C9E','#22A6B3','#A855F7'];
      const ctx = catEl.getContext('2d');

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderColor: '#121837',
            borderWidth: 3,
            hoverOffset: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 10, color: T.text }
            },
            tooltip: {
              ...tooltip,
              callbacks: { label: c => ` ${c.label}: ${c.parsed} items` }
            }
          }
        }
      });
    }

    document.querySelectorAll('.panel-tabs .tab').forEach(tab => {
      tab.addEventListener('click', function () {
        this.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts, { once: true });
  } else {
    initCharts();
  }
})();
