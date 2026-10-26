// analytics
(function () {
  if (typeof Chart === 'undefined') return;

  const T = {
    text: '#B6A9CE',
    textMuted: '#7C7099',
    grid: 'rgba(90, 69, 120, 0.18)',
    accent: '#8237AC',
    accentDeep: '#691A82',
    indigo: '#22217A',
  };

  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = T.text;


  const traffic = document.getElementById('trafficChart');
  if (traffic) {
    const ctx = traffic.getContext('2d');

    const grad1 = ctx.createLinearGradient(0, 0, 0, 300);
    grad1.addColorStop(0, 'rgba(130, 55, 172, 0.35)');
    grad1.addColorStop(1, 'rgba(130, 55, 172, 0)');

    const grad2 = ctx.createLinearGradient(0, 0, 0, 300);
    grad2.addColorStop(0, 'rgba(34, 33, 122, 0.5)');
    grad2.addColorStop(1, 'rgba(34, 33, 122, 0)');

    const grad3 = ctx.createLinearGradient(0, 0, 0, 300);
    grad3.addColorStop(0, 'rgba(232, 163, 61, 0.3)');
    grad3.addColorStop(1, 'rgba(232, 163, 61, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mar 1', 'Mar 5', 'Mar 9', 'Mar 13', 'Mar 17', 'Mar 21', 'Mar 25', 'Mar 29'],
        datasets: [
          {
            label: 'Visitors',
            data: [4200, 4800, 5200, 4900, 6100, 6800, 7200, 8100],
            borderColor: T.accent,
            backgroundColor: grad1,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: T.accent,
            pointBorderColor: '#161931',
            pointBorderWidth: 2,
          },
          {
            label: 'Registered',
            data: [1400, 1650, 1900, 1750, 2300, 2600, 2900, 3100],
            borderColor: '#5A4578',
            backgroundColor: grad2,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#5A4578',
            pointBorderColor: '#161931',
            pointBorderWidth: 2,
          },
          {
            label: 'Chatbot',
            data: [420, 510, 680, 590, 780, 920, 1050, 1180],
            borderColor: '#E8A33D',
            backgroundColor: grad3,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#E8A33D',
            pointBorderColor: '#161931',
            pointBorderWidth: 2,
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
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              color: T.text,
              font: { size: 11.5, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: '#1A1C59',
            borderColor: '#452454',
            borderWidth: 1,
            titleColor: '#EDE9F5',
            bodyColor: '#B6A9CE',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: T.textMuted, font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: T.grid, drawTicks: false },
            border: { display: false },
            ticks: {
              color: T.textMuted,
              font: { size: 11 },
              padding: 8,
              callback: (v) => v >= 1000 ? (v / 1000) + 'K' : v
            }
          }
        }
      }
    });
  }


  const catChart = document.getElementById('categoryChart');
  if (catChart) {
    const ctx = catChart.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
        datasets: [{
          data: [218, 176, 142, 98, 87, 64, 51, 28],
          backgroundColor: [
            '#E85D3D', '#7B5FA8', '#8237AC', '#22217A',
            '#D96FA0', '#E8A33D', '#5A4578', '#653C9E'
          ],
          borderColor: '#121837',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 12,
              color: T.text,
              font: { size: 11.5, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: '#1A1C59',
            borderColor: '#452454',
            borderWidth: 1,
            titleColor: '#EDE9F5',
            bodyColor: '#B6A9CE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (c) => ' ' + c.label + ': ' + c.parsed + ' items'
            }
          }
        }
      }
    });
  }

 
  const sourcesChart = document.getElementById('trafficSourcesChart');
  if (sourcesChart) {
    const ctx = sourcesChart.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Direct', 'Search', 'Social', 'Referral'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#8237AC', '#653C9E', '#6F3788', '#22217A'],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 42
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1C59',
            borderColor: '#452454',
            borderWidth: 1,
            titleColor: '#EDE9F5',
            bodyColor: '#B6A9CE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (c) => ' ' + c.parsed.y + '% of traffic'
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: T.textMuted, font: { size: 11.5 } }
          },
          y: {
            beginAtZero: true,
            max: 50,
            grid: { color: T.grid, drawTicks: false },
            border: { display: false },
            ticks: {
              color: T.textMuted,
              font: { size: 11 },
              padding: 8,
              callback: (v) => v + '%'
            }
          }
        }
      }
    });
  }

  const botChart = document.getElementById('chatbotChart');
  if (botChart) {
    const ctx = botChart.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          data: [420, 380, 510, 480, 620, 340, 290],
          backgroundColor: 'rgba(130, 55, 172, 0.7)',
          hoverBackgroundColor: '#8237AC',
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1C59',
            borderColor: '#452454',
            borderWidth: 1,
            titleColor: '#EDE9F5',
            bodyColor: '#B6A9CE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (c) => ' ' + c.parsed.y + ' queries'
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: T.textMuted, font: { size: 11.5 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: T.grid, drawTicks: false },
            border: { display: false },
            ticks: { color: T.textMuted, font: { size: 11 }, padding: 8 }
          }
        }
      }
    });
  }


  document.getElementById('rangeFilter')?.addEventListener('change', function () {

    console.log('range changed:', this.value);
  });

  document.getElementById('exportBtn')?.addEventListener('click', function () {

    console.log('export analytics');
  });
})();