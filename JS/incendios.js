document.addEventListener('DOMContentLoaded', () => {
  fetch('../JSON/incendios.json')
    .then(response => response.json())
    .then(data => {
      const agregatPerAny = {};
      const agregatPerComarca = {};
      const distribucioComarcaAny = {};

      data.forEach(entry => {
        const dataIncendi = new Date(entry["DATA INCENDI"].split("/").reverse().join("-"));
        const any = dataIncendi.getFullYear();
        const comarca = entry["COMARCA"];
        const ha = parseFloat(entry["HAFORESTAL"]);

        if (!agregatPerAny[any]) agregatPerAny[any] = 0;
        agregatPerAny[any] += ha;

        if (!agregatPerComarca[comarca]) agregatPerComarca[comarca] = 0;
        agregatPerComarca[comarca] += ha;

        if (!distribucioComarcaAny[comarca]) distribucioComarcaAny[comarca] = {};
        if (!distribucioComarcaAny[comarca][any]) distribucioComarcaAny[comarca][any] = 0;
        distribucioComarcaAny[comarca][any] += ha;
      });

      // Gràfic evolució anual
      const anys = Object.keys(agregatPerAny).sort();
      const haPerAny = anys.map(any => agregatPerAny[any]);

      Plotly.newPlot('grafica-anual', [{
        x: anys,
        y: haPerAny,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha cremades',
        line: { color: '#e53935' }
      }], {
        title: 'Superfície cremada anual',
        xaxis: { title: 'Any' },
        yaxis: { title: 'Hectàrees' }
      });

      // Gràfic comarques
      const comarques = Object.keys(agregatPerComarca);
      const haPerComarca = comarques.map(c => agregatPerComarca[c]);

      Plotly.newPlot('grafica-comarques', [{
        x: comarques,
        y: haPerComarca,
        type: 'bar',
        marker: { color: '#ef6c00' }
      }], {
        title: 'Comarques amb més superfície cremada',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Hectàrees totals' }
      });

      // Heatmap
      const anysUnics = [...new Set(Object.values(distribucioComarcaAny).flatMap(obj => Object.keys(obj)))].sort();
      const comarquesHeatmap = Object.keys(distribucioComarcaAny);
      const valors = anysUnics.map(any =>
        comarquesHeatmap.map(comarca => distribucioComarcaAny[comarca][any] || 0)
      );

      Plotly.newPlot('grafica-distribucio', [{
        z: valors,
        x: comarquesHeatmap,
        y: anysUnics,
        type: 'heatmap',
        colorscale: 'YlOrRd',
        hovertemplate:
          'Comarca: %{x}<br>' +
          'Any: %{y}<br>' +
          'Hectàrees cremades: %{z:.2f} ha<extra></extra>'
      }], {
        title: 'Distribució d’incendis per any i comarca',
        xaxis: { title: 'Comarca' },
        yaxis: { title: 'Any', tickformat: 'd' }
      });

      // Treemap
      const treemapData = comarques.map((comarca, index) => {
        return {
          labels: comarques,
          parents: comarques.map(() => ""),
          values: haPerComarca,
          type: 'treemap',
          textinfo: 'label+value+percent entry',
          marker: { colorscale: 'Reds' }
        };
      });

      Plotly.newPlot('grafica-treemap', treemapData);
    })
    .catch(error => {
      console.error('Error carregant dades JSON:', error);
    });
});
