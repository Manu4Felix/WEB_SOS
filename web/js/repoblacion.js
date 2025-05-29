document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/repoblacion')
    .then(response => response.json())
    .catch(() => fetch('../api/json/repoblacion.json').then(r => r.json()))
    .then(data => {
      const agregatPerAny = {};
      const agregatPerComarca = {};
      const distribucioComarcaAny = {};

      data.forEach(entry => {
        const any = entry['Any'];
        const comarca = entry['Comarca'];
        const ha = parseFloat(entry['Superfície (ha)']);

        if (!agregatPerAny[any]) agregatPerAny[any] = 0;
        agregatPerAny[any] += ha;

        if (!agregatPerComarca[comarca]) agregatPerComarca[comarca] = 0;
        agregatPerComarca[comarca] += ha;

        if (!distribucioComarcaAny[comarca]) distribucioComarcaAny[comarca] = {};
        if (!distribucioComarcaAny[comarca][any]) distribucioComarcaAny[comarca][any] = 0;
        distribucioComarcaAny[comarca][any] += ha;
      });

      // Gráfico anual
      const anys = Object.keys(agregatPerAny).sort();
      const haPerAny = anys.map(any => agregatPerAny[any]);

      Plotly.newPlot('grafica-repo-anual', [{
        x: anys,
        y: haPerAny,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha repobladas',
        line: { color: '#43a047' }
      }], {
        title: 'Superficie repoblada anual',
        xaxis: { title: 'Año' },
        yaxis: { title: 'Hectáreas' }
      });

      // Gráfico por comarcas
      const comarques = Object.keys(agregatPerComarca);
      const haPerComarca = comarques.map(c => agregatPerComarca[c]);

      Plotly.newPlot('grafica-repo-comarques', [{
        x: comarques,
        y: haPerComarca,
        type: 'bar',
        marker: { color: '#66bb6a' }
      }], {
        title: 'Comarcas con mayor superficie repoblada',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Hectáreas totales' }
      });

      // Heatmap por año y comarca
      const anysUnics = [...new Set(Object.values(distribucioComarcaAny).flatMap(obj => Object.keys(obj)))].sort();
      const comarquesHeatmap = Object.keys(distribucioComarcaAny);
      const valors = anysUnics.map(any =>
        comarquesHeatmap.map(comarca => distribucioComarcaAny[comarca][any] || 0)
      );

      Plotly.newPlot('grafica-repo-distribucio', [{
        z: valors,
        x: comarquesHeatmap,
        y: anysUnics,
        type: 'heatmap',
        colorscale: 'Greens',
        hovertemplate:
          'Comarca: %{x}<br>' +
          'Año: %{y}<br>' +
          'Hectáreas repobladas: %{z:.2f} ha<extra></extra>'
      }], {
        title: 'Distribución de repoblación por año y comarca',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Año', tickformat: 'd' }
      });
    })
    .catch(error => {
      console.error('Error cargando el JSON de repoblación:', error);
    });
});
