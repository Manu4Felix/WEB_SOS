document.addEventListener('DOMContentLoaded', () => {
  fetch('../JSON/repoblacion.json')
    .then(response => response.json())
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

      // Gràfic anual
      const anys = Object.keys(agregatPerAny).sort();
      const haPerAny = anys.map(any => agregatPerAny[any]);

      Plotly.newPlot('grafica-repo-anual', [{
        x: anys,
        y: haPerAny,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha repoblades',
        line: { color: '#43a047' }
      }], {
        title: 'Superfície repoblada anual',
        xaxis: { title: 'Any' },
        yaxis: { title: 'Hectàrees' }
      });

      // Gràfic per comarques
      const comarques = Object.keys(agregatPerComarca);
      const haPerComarca = comarques.map(c => agregatPerComarca[c]);

      Plotly.newPlot('grafica-repo-comarques', [{
        x: comarques,
        y: haPerComarca,
        type: 'bar',
        marker: { color: '#66bb6a' }
      }], {
        title: 'Comarques amb més superfície repoblada',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Hectàrees totals' }
      });

      // Heatmap per any i comarca
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
          'Any: %{y}<br>' +
          'Hectàrees repoblades: %{z:.2f} ha<extra></extra>'
      }], {
        title: 'Distribució de repoblació per any i comarca',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Any', tickformat: 'd' }
      });
    })
    .catch(error => {
      console.error('Error carregant el JSON de repoblació:', error);
    });
});