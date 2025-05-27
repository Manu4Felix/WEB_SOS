document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch('../JSON/incendios.json').then(res => res.json()),
    fetch('../JSON/repoblacion.json').then(res => res.json())
  ]).then(([incendis, repoblacions]) => {
    const dadesUnificades = {};
    const nombreIncendis = {}; // Nou objecte per comptar incendis

    // Processar incendis
    incendis.forEach(e => {
      const any = new Date(e["DATA INCENDI"].split("/").reverse().join("-")).getFullYear();
      const comarca = e["COMARCA"];
      const ha = parseFloat(e["HAFORESTAL"]);

      if (!dadesUnificades[any]) dadesUnificades[any] = {};
      if (!dadesUnificades[any][comarca]) dadesUnificades[any][comarca] = { cremat: 0, repoblat: 0 };
      dadesUnificades[any][comarca].cremat += ha;

      // Comptar nombre d'incendis
      if (!nombreIncendis[comarca]) nombreIncendis[comarca] = 0;
      nombreIncendis[comarca]++;
    });

    // Processar repoblacions
    repoblacions.forEach(e => {
      const any = e['Any'];
      const comarca = e['Comarca'];
      const ha = parseFloat(e['Superfície (ha)']);

      if (!dadesUnificades[any]) dadesUnificades[any] = {};
      if (!dadesUnificades[any][comarca]) dadesUnificades[any][comarca] = { cremat: 0, repoblat: 0 };
      dadesUnificades[any][comarca].repoblat += ha;
    });

    // Agregació anual
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
        name: 'Ha cremades',
        line: { color: '#e53935' }
      },
      {
        x: anys,
        y: haRepoblades,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ha repoblades',
        line: { color: '#43a047' }
      }
    ], {
      title: 'Comparativa anual',
      xaxis: { title: 'Any' },
      yaxis: { title: 'Hectàrees totals' }
    });

    // Agregació per comarca
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

    // Gràfic comparatiu per comarca
    Plotly.newPlot('grafica-comparativa-comarques', [
      {
        x: comarques,
        y: cremades,
        type: 'bar',
        name: 'Cremades',
        marker: { color: '#ef5350' }
      },
      {
        x: comarques,
        y: repoblades,
        type: 'bar',
        name: 'Repoblades',
        marker: { color: '#66bb6a' }
      }
    ], {
      title: 'Incendis vs Repoblació per comarca',
      barmode: 'group',
      xaxis: { title: 'Comarca' },
      yaxis: { title: 'Hectàrees totals' }
    });

    // Gràfic percentatge de recuperació
    Plotly.newPlot('grafica-percentatge', [{
      x: comarques,
      y: percentatges,
      type: 'bar',
      marker: { color: '#26a69a' }
    }], {
      title: '% de recuperació per comarca',
      xaxis: { title: 'Comarca' },
      yaxis: { title: '% Recuperació', ticksuffix: '%' }
    });

    // Gràfic de dispersió: nombre d'incendis vs superfície repoblada
    Plotly.newPlot('grafica-dispersio', [{
      x: incendisPerComarca,
      y: repoblades,
      mode: 'markers',
      type: 'scatter',
      text: comarques,
      marker: {
        size: 15,
        color: repoblades,
        colorscale: 'Greens',
        showscale: true,
        colorbar: { title: 'Ha repoblades' }
      },
      hovertemplate:
        'Comarca: %{text}<br>' +
        'Incendis: %{x}<br>' +
        'Ha repoblades: %{y:.2f}<extra></extra>'
    }], {
      title: 'Relació entre nombre d’incendis i superfície repoblada',
      xaxis: { title: 'Nombre d’incendis' },
      yaxis: { title: 'Superfície repoblada (ha)' }
    });
  }).catch(error => {
    console.error('Error carregant dades per a la comparativa:', error);
  });
});
