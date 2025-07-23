import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function EstadisticasGraficos({ pacientesFiltrados }) {
  const calcularPorcentajes = (data) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = ((data[key] / total) * 100).toFixed(2);
      return acc;
    }, {});
  };

  // Datos para Edad
  const edades = pacientesFiltrados.reduce((acc, paciente) => {
    let rango;

    // Determinar el rango de edad
    if (paciente.edad < 20) {
      rango = '-20';
    } else if (paciente.edad >= 21 && paciente.edad <= 30) {
      rango = '30';
    } else if (paciente.edad >= 31 && paciente.edad <= 40) {
      rango = '40';
    } else if (paciente.edad >= 41 && paciente.edad <= 50) {
      rango = '50';
    } else if (paciente.edad >= 51 && paciente.edad <= 60) {
      rango = '60';
    } else if (paciente.edad >= 61 && paciente.edad <= 70) {
      rango = '70';
    } else if (paciente.edad >= 71 && paciente.edad <= 80) {
      rango = '80';
    } else if (paciente.edad >= 81 && paciente.edad <= 90) {
      rango = '90';
    } else {
      rango = '90'; // Para 91 y más
    }

    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {});

  // Definir el orden específico de los labels
  const ordenLabelsEdad = ['-20', '30', '40', '50', '60', '70', '80', '90'];
  const dataEdad = {
    labels: ordenLabelsEdad,
    datasets: [{
      label: 'Cantidad',
      data: ordenLabelsEdad.map(label => edades[label] || 0), // Asegurar que haya un valor para cada label
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#4F46E5', '#3B82F6', '#F43F5E'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#4F46E5', '#3B82F6', '#F43F5E'],
      borderWidth: 1
    }]
  };

  // Datos para Género
  const generos = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.genero] = (acc[paciente.genero] || 0) + 1;
    return acc;
  }, {});
  const dataGenero = {
    labels: Object.keys(generos),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(generos),
      backgroundColor: ['#1D4ED8', '#F472B6'],
      borderColor: ['#1D4ED8', '#F472B6'],
      borderWidth: 1
    }]
  };

  // Datos para Diabetes
  const diabetes = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.diabetes] = (acc[paciente.diabetes] || 0) + 1;
    return acc;
  }, {});
  const dataDiabetes = {
    labels: Object.keys(diabetes),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(diabetes),
      backgroundColor: ['#34D399', '#EF4444'],
      borderColor: ['#34D399', '#EF4444'],
      borderWidth: 1
    }]
  };

  // Datos para Hipertension
  const hipertensionArterial = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.hipertensionArterial] = (acc[paciente.hipertensionArterial] || 0) + 1;
    return acc;
  }, {});
  const dataHipertensionArterial = {
    labels: Object.keys(diabetes),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(diabetes),
      backgroundColor: ['#34D399', '#EF4444'],
      borderColor: ['#34D399', '#EF4444'],
      borderWidth: 1
    }]
  };

  // Datos para Obra Social
  const obra = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.obra] = (acc[paciente.obra] || 0) + 1;
    return acc;
  }, {});
  const dataObra = {
    labels: Object.keys(obra),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(obra),
      backgroundColor: ['#34D399', '#EF4444'],
      borderColor: ['#34D399', '#EF4444'],
      borderWidth: 1
    }]
  };

  // Datos para Fumador
  const fumadores = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.fumador] = (acc[paciente.fumador] || 0) + 1;
    return acc;
  }, {});
  const dataFumador = {
    labels: Object.keys(fumadores),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(fumadores),
      backgroundColor: ['#34D399', '#F97316'],
      borderColor: ['#34D399', '#F97316'],
      borderWidth: 1
    }]
  };

  // Datos para Presión Arterial
  const presiones = pacientesFiltrados.reduce((acc, paciente) => {
    let rango;

    // Determinar el rango de presión arterial
    if (paciente.presionArterial <= 120) {
      rango = '-120';
    } else if (paciente.presionArterial >= 121 && paciente.presionArterial <= 140) {
      rango = '140';
    } else if (paciente.presionArterial >= 141 && paciente.presionArterial <= 160) {
      rango = '160';
    } else if (paciente.presionArterial >= 161 && paciente.presionArterial <= 180) {
      rango = '180';
    } else {
      rango = '+180';
    }

    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {});

  // Definir el orden específico de los labels
  const ordenLabels = ['-120', '140', '160', '180', '+180'];
  const dataPresion = {
    labels: ordenLabels,
    datasets: [{
      label: 'Cantidad',
      data: ordenLabels.map(label => presiones[label] || 0), // Asegurar que haya un valor para cada label
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D'],
      borderWidth: 1
    }]
  };

  // Datos para Colesterol
  const calcularRangoColesterol = (colesterol) => {
    if (colesterol === undefined) return 'No';
    if (colesterol < 154) return 'Bajo';
    if (colesterol >= 155 && colesterol <= 192) return 'Normal';
    if (colesterol >= 193 && colesterol <= 231) return 'Alto';
    if (colesterol >= 232 && colesterol <= 269) return 'Muy Alto';
    if (colesterol >= 270) return 'Crítico';
  };

  const colesterol = pacientesFiltrados.reduce((acc, paciente) => {
    const rango = calcularRangoColesterol(paciente.colesterol);
    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, { 'No': 0 });
  const dataColesterol = {
    labels: Object.keys(colesterol),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(colesterol),
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderWidth: 1
    }]
  };

  // Datos para Nivel de Riesgo
  const riesgos = pacientesFiltrados.reduce((acc, paciente) => {
    acc[paciente.nivelRiesgo] = (acc[paciente.nivelRiesgo] || 0) + 1;
    return acc;
  }, {});
  const dataRiesgo = {
    labels: Object.keys(riesgos).sort((a, b) => {
      const niveles = {
        '<10% Poco': 1,
        '>10% <20% Moderado': 2,
        '>20% <30% Alto': 3,
        '>30% <40% Muy Alto': 4,
        '>40% Crítico': 5
      };
      return niveles[a] - niveles[b];
    }),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(riesgos),
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderWidth: 1
    }]
  };

    // Datos para Cintura
    const cinturasMasculino = pacientesFiltrados.reduce((acc, paciente) => {
      if (paciente.genero === 'masculino') {
        const rango = paciente.cintura > 102 ? 'Más de 102' : 'Menos de 102';
        acc[rango] = (acc[rango] || 0) + 1;
      }
      return acc;
    }, {});

    const cinturasFemenino = pacientesFiltrados.reduce((acc, paciente) => {
      if (paciente.genero === 'femenino') {
        const rango = paciente.cintura > 88 ? 'Más de 88' : 'Menos de 88';
        acc[rango] = (acc[rango] || 0) + 1;
      }
      return acc;
    }, {});

    // Datos para gráfico masculino
    const dataCinturaMasculino = {
      labels: ['Menos de 102', 'Más de 102'],
      datasets: [{
        label: 'Cantidad (Masculino)',
        data: [cinturasMasculino['Menos de 102'] || 0, cinturasMasculino['Más de 102'] || 0],
        backgroundColor: ['#34D399', '#F97316'],
        borderColor: ['#34D399', '#F97316'],
        borderWidth: 1
      }]
    };

    // Datos para gráfico femenino
    const dataCinturaFemenino = {
      labels: ['Menos de 88', 'Más de 88'],
      datasets: [{
        label: 'Cantidad (Femenino)',
        data: [cinturasFemenino['Menos de 88'] || 0, cinturasFemenino['Más de 88'] || 0],
        backgroundColor: ['#FDE047', '#EF4444'],
        borderColor: ['#FDE047', '#EF4444'],
        borderWidth: 1
      }]
    };

  // Agrupación de IMC
  const imcCategorias = ['<18.5', '18.5-24.9', '25-29.9', '30-34.9', '35-39.9', '40+'];
  const conteoIMC = imcCategorias.reduce((acc, categoria) => {
    acc[categoria] = pacientesFiltrados.filter(paciente => {
      const imc = paciente.imc;
      if (imc === undefined || isNaN(imc)) return false;
      const categoriaIMC = imc < 18.5 ? '<18.5' :
                           (imc >= 18.5 && imc <= 24.9) ? '18.5-24.9' :
                           (imc >= 25 && imc <= 29.9) ? '25-29.9' :
                           (imc >= 30 && imc <= 34.9) ? '30-34.9' :
                           (imc >= 35 && imc <= 39.9) ? '35-39.9' : '40+';
      return categoriaIMC === categoria;
    }).length;
    return acc;
  }, {});

  const dataIMC = {
    labels: imcCategorias,
    datasets: [{
      label: 'Número de Pacientes',
      data: imcCategorias.map(categoria => conteoIMC[categoria] || 0),
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C'],
      borderWidth: 1
    }]
  };

  return (
    <div>
      <div style={{ width: '30%', display: 'inline-block' }}>
        <h3 className="text-xl font-semibold mb-8">Edad</h3>
        <Bar data={dataEdad} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(edades)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>
      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Presión Arterial sistólica</h3>
        <Bar data={dataPresion} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(presiones)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: Math.max(...Object.values(presiones)) + 1 // Ajustar el maximo según los datos
            }
          }
        }} />
      </div>
      <div style={{ width: '30%', display: 'inline-block' }}>
        <h3 className="text-xl font-semibold mb-8">Colesterol</h3>
        <Bar data={dataColesterol} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(colesterol)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: 100
            }
          }
        }} />
      </div>
      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Obra Social</h3>
        <Pie data={dataObra} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(obra)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-8">Nivel de Riesgo</h3>
        <Bar data={dataRiesgo} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(riesgos)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: 10
            }
          }
        }} />
      </div>
      <div style={{ width: '30%', display: 'inline-block' }}>
        <h3 className="text-xl font-semibold mb-8">Género</h3>
        <Pie data={dataGenero} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(generos)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>
      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Diabetes</h3>
        <Pie data={dataDiabetes} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(diabetes)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Hipertensión Arterial</h3>
        <Pie data={dataHipertensionArterial} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(diabetes)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div style={{ width: '30%', display: 'inline-block' }}>
        <h3 className="text-xl font-semibold mb-8">Fumador</h3>
        <Pie data={dataFumador} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(fumadores)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Cintura (Masculino)</h3>
        <Pie data={dataCinturaMasculino} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(cinturasMasculino)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div style={{ width: '30%', display: 'inline-block', marginLeft: '5%' }}>
        <h3 className="text-xl font-semibold mb-8">Cintura (Femenino)</h3>
        <Pie data={dataCinturaFemenino} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(cinturasFemenino)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>
      <div>
          <h2 className="text-xl font-semibold mb-8">Distribución de IMC</h2>
          <Bar data={dataIMC} />
      </div>
    </div>
  );
}

export default EstadisticasGraficos;