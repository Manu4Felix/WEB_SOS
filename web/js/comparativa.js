document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch('/api/incendios').then(res => res.json()).catch(() => fetch('../api/json/incendios.json').then(r => r.json())),
    fetch('/api/repoblacion').then(res => res.json()).catch(() => fetch('../api/json/repoblacion.json').then(r => r.json()))
  ]).then(([incendis, repoblacions]) => {
    const dadesUnificades = {};
    const nombreIncendis = {};

    // Procesar incendios
    incendis.forEach(e => {
      const any = new Date(e["DATA INCENDI"].split("/").reverse().join("-")).getFullYear();
      const comarca = e["COMARCA"];
      const ha = parseFloat(e["HAFORESTAL"]);

      if (!dadesUnificades[any]) dadesUnificades[any] = {};
      if (!dadesUnificades[any][comarca]) dadesUnificades[any][comarca] = { cremat: 0, repoblat: 0 };
      dadesUnificades[any][comarca].cremat += ha;

      if (!nombreIncendis[comarca]) nombreIncendis[comarca] = 0;
      nombreIncendis[comarca]++;
    });

    // Procesar repoblaciones
    repoblacions.forEach(e => {
      const any = e['Any'];
      const comarca = e['Comarca'];
      const ha = parseFloat(e['Superfície (ha)']);

      if (!dadesUnificades[any]) dadesUnificades[any] = {};
      if (!dadesUnificades[any][comarca]) dadesUnificades[any][comarca] = { cremat: 0, repoblat: 0 };
      dadesUnificades[any][comarca].repoblat += ha;
    });

    // Agregación anual
    const anys = Object.keys(dadesUnificades).sort();
    const haCremades = anys.map(any => {
      return Object.values(dadesUnificades[any]).reduce((acc, d) => acc + d.cremat, 0);
    });
    const haRepoblades = anys.map(any => {
      return Object.values(dadesUnificades[any]).reduce((acc, d) => acc + d.repoblat, 0);
    });

    Plotly.newPlot('grafica-comparativa-anual', [
      {
        x: anys,
        y: haCremades,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha quemadas',
        line: { color: '#e53935' }
      },
      {
        x: anys,
        y: haRepoblades,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha repobladas',
        line: { color: '#43a047' }
      }
    ], {
      title: 'Comparativa anual',
      xaxis: { title: 'Año' },
      yaxis: { title: 'Hectáreas totales' }
    });

    // Agregación por comarca
    const agregatComarques = {};
    anys.forEach(any => {
      Object.entries(dadesUnificades[any]).forEach(([comarca, val]) => {
        if (!agregatComarques[comarca]) agregatComarques[comarca] = { cremat: 0, repoblat: 0 };
        agregatComarques[comarca].cremat += val.cremat;
        agregatComarques[comarca].repoblat += val.repoblat;
      });
    });

    const comarques = Object.keys(agregatComarques);
    const cremades = comarques.map(c => agregatComarques[c].cremat);
    const repoblades = comarques.map(c => agregatComarques[c].repoblat);
    const incendisPerComarca = comarques.map(c => nombreIncendis[c] || 0);
    const percentatges = comarques.map(c => {
      const cremat = agregatComarques[c].cremat;
      const repoblat = agregatComarques[c].repoblat;
      return cremat > 0 ? (repoblat / cremat) * 100 : 0;
    });

    // Gráfico comparativo por comarca
    Plotly.newPlot('grafica-comparativa-comarques', [
      {
        x: comarques,
        y: cremades,
        type: 'bar',
        name: 'Quemadas',
        marker: { color: '#ef5350' }
      },
      {
        x: comarques,
        y: repoblades,
        type: 'bar',
        name: 'Repobladas',
        marker: { color: '#66bb6a' }
      }
    ], {
      title: 'Incendios vs Repoblación por comarca',
      barmode: 'group',
      xaxis: { title: 'Comarca' },
      yaxis: { title: 'Hectáreas totales' }
    });

    // Gráfico de porcentaje de recuperación
    Plotly.newPlot('grafica-percentatge', [{
      x: comarques,
      y: percentatges,
      type: 'bar',
      marker: { color: '#26a69a' }
    }], {
      title: '% de recuperación por comarca',
      xaxis: { title: 'Comarca' },
      yaxis: { title: '% Recuperación', ticksuffix: '%' }
    });

    // Gráfico de dispersión: número de incendios vs superficie repoblada por comarca y año
    const maxSize = Math.max(...cremades) || 1;
    Plotly.newPlot('grafica-dispersio-anual', [{
      x: incendisPerComarca,
      y: repoblades,
      mode: 'markers',
      type: 'scatter',
      text: comarques,
      marker: {
        size: cremades,
        sizemode: 'area',
        sizeref: 2.0 * maxSize / (100 ** 2),
        color: anys[0] ? anys : 'grey',
        colorscale: 'Viridis',
        showscale: true,
        colorbar: { title: 'Año' }
      },
      hovertemplate:
        'Comarca: %{text}<br>' +
        'Incendios: %{x}<br>' +
        'Ha repobladas: %{y:.2f}<br>' +
        'Ha quemadas: %{marker.size:.2f}<extra></extra>'
    }], {
      title: 'Relación entre número de incendios y superficie repoblada',
      xaxis: { title: 'Número de incendios' },
      yaxis: { title: 'Superficie repoblada (ha)' }
    });


  }).catch(error => {
    console.error('Error cargando datos para la comparativa:', error);
  });
});
