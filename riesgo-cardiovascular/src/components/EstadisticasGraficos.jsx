import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function EstadisticasGraficos({ pacientesFiltrados }) {
  const calcularPorcentajes = (data) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    if (total === 0) return {}; // Prevent division by zero
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = ((data[key] / total) * 100).toFixed(2);
      return acc;
    }, {});
  };

  // Datos para Edad
  const edades = pacientesFiltrados.reduce((acc, paciente) => {
    let rango;

    // Handle cases where edad might be null or undefined
    if (paciente.edad === null || paciente.edad === undefined || isNaN(paciente.edad)) {
        rango = 'No Especificado';
    } else if (paciente.edad < 20) {
      rango = '<20';
    } else if (paciente.edad >= 20 && paciente.edad <= 30) {
      rango = '20-30';
    } else if (paciente.edad >= 31 && paciente.edad <= 40) {
      rango = '31-40';
    } else if (paciente.edad >= 41 && paciente.edad <= 50) {
      rango = '41-50';
    } else if (paciente.edad >= 51 && paciente.edad <= 60) {
      rango = '51-60';
    } else if (paciente.edad >= 61 && paciente.edad <= 70) {
      rango = '61-70';
    } else if (paciente.edad >= 71 && paciente.edad <= 80) {
      rango = '71-80';
    } else if (paciente.edad >= 81 && paciente.edad <= 90) {
      rango = '81-90';
    } else {
      rango = '>90'; // Para 91 y más
    }

    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {});

  // Definir el orden específico de los labels
  const ordenLabelsEdad = ['<20', '20-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '>90', 'No Especificado'];
  const dataEdad = {
    labels: ordenLabelsEdad,
    datasets: [{
      label: 'Cantidad',
      data: ordenLabelsEdad.map(label => edades[label] || 0), // Asegurar que haya un valor para cada label
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#4F46E5', '#3B82F6', '#F43F5E', '#8B5CF6', '#6B7280'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#4F46E5', '#3B82F6', '#F43F5E', '#8B5CF6', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Género
  const generos = pacientesFiltrados.reduce((acc, paciente) => {
    const genero = paciente.genero || 'No Especificado';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});
  const dataGenero = {
    labels: Object.keys(generos),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(generos),
      backgroundColor: ['#1D4ED8', '#F472B6', '#6B7280'],
      borderColor: ['#1D4ED8', '#F472B6', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Diabetes
  const diabetes = pacientesFiltrados.reduce((acc, paciente) => {
    const hasDiabetes = paciente.diabetes || 'No Especificado';
    acc[hasDiabetes] = (acc[hasDiabetes] || 0) + 1;
    return acc;
  }, {});
  const dataDiabetes = {
    labels: Object.keys(diabetes),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(diabetes),
      backgroundColor: ['#34D399', '#EF4444', '#6B7280'],
      borderColor: ['#34D399', '#EF4444', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Hipertension
  const hipertensionArterial = pacientesFiltrados.reduce((acc, paciente) => {
    const hasHipertension = paciente.hipertenso || 'No Especificado'; // Using 'hipertenso' field as per DatosPacienteInicial
    acc[hasHipertension] = (acc[hasHipertension] || 0) + 1;
    return acc;
  }, {});
  const dataHipertensionArterial = {
    labels: Object.keys(hipertensionArterial),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(hipertensionArterial),
      backgroundColor: ['#34D399', '#EF4444', '#6B7280'],
      borderColor: ['#34D399', '#EF4444', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Fumador
  const fumadores = pacientesFiltrados.reduce((acc, paciente) => {
    const isSmoker = paciente.fumador || 'No Especificado';
    acc[isSmoker] = (acc[isSmoker] || 0) + 1;
    return acc;
  }, {});
  const dataFumador = {
    labels: Object.keys(fumadores),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(fumadores),
      backgroundColor: ['#34D399', '#F97316', '#6B7280'],
      borderColor: ['#34D399', '#F97316', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Exfumador
  const exfumadores = pacientesFiltrados.reduce((acc, paciente) => {
    const isExSmoker = paciente.exfumador || 'No Especificado';
    acc[isExSmoker] = (acc[isExSmoker] || 0) + 1;
    return acc;
  }, {});
  const dataExfumador = {
    labels: Object.keys(exfumadores),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(exfumadores),
      backgroundColor: ['#3B82F6', '#EF4444', '#6B7280'],
      borderColor: ['#3B82F6', '#EF4444', '#6B7280'],
      borderWidth: 1
    }]
  };


  // Datos para Presión Arterial
  const presiones = pacientesFiltrados.reduce((acc, paciente) => {
    let rango;

    if (paciente.presionArterial === null || paciente.presionArterial === undefined || isNaN(paciente.presionArterial)) {
        rango = 'No Especificado';
    } else if (paciente.presionArterial <= 120) {
      rango = '<120';
    } else if (paciente.presionArterial > 120 && paciente.presionArterial <= 140) {
      rango = '121-140';
    } else if (paciente.presionArterial > 140 && paciente.presionArterial <= 160) {
      rango = '141-160';
    } else if (paciente.presionArterial > 160 && paciente.presionArterial <= 180) {
      rango = '161-180';
    } else {
      rango = '>180';
    }

    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {});

  // Definir el orden específico de los labels
  const ordenLabelsPresion = ['<120', '121-140', '141-160', '161-180', '>180', 'No Especificado'];
  const dataPresion = {
    labels: ordenLabelsPresion,
    datasets: [{
      label: 'Cantidad',
      data: ordenLabelsPresion.map(label => presiones[label] || 0), // Asegurar que haya un valor para cada label
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#6B7280'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#FFB74D', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Colesterol
  const calcularRangoColesterol = (colesterol) => {
    if (colesterol === null || colesterol === undefined || isNaN(colesterol) || colesterol === 'No') return 'No Especificado';
    if (colesterol < 154) return 'Bajo (<154)';
    if (colesterol >= 155 && colesterol <= 192) return 'Normal (155-192)';
    if (colesterol >= 193 && colesterol <= 231) return 'Alto (193-231)';
    if (colesterol >= 232 && colesterol <= 269) return 'Muy Alto (232-269)';
    if (colesterol >= 270) return 'Crítico (>270)';
    return 'No Especificado';
  };

  const colesterol = pacientesFiltrados.reduce((acc, paciente) => {
    const rango = calcularRangoColesterol(paciente.colesterol);
    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, { 'No Especificado': 0 });

  const ordenLabelsColesterol = ['Bajo (<154)', 'Normal (155-192)', 'Alto (193-231)', 'Muy Alto (232-269)', 'Crítico (>270)', 'No Especificado'];
  const dataColesterol = {
    labels: ordenLabelsColesterol,
    datasets: [{
      label: 'Cantidad',
      data: ordenLabelsColesterol.map(label => colesterol[label] || 0),
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
      borderWidth: 1
    }]
  };

  // Datos para Nivel de Riesgo
  const riesgos = pacientesFiltrados.reduce((acc, paciente) => {
    const nivelRiesgo = paciente.nivelRiesgo || 'No Especificado';
    acc[nivelRiesgo] = (acc[nivelRiesgo] || 0) + 1;
    return acc;
  }, {});
  const dataRiesgo = {
    labels: Object.keys(riesgos).sort((a, b) => {
      const niveles = {
        '<10% Bajo': 1,
        '>10% <20% Moderado': 2,
        '>20% <30% Alto': 3,
        '>30% <40% Muy Alto': 4,
        '>40% Crítico': 5,
        'No Especificado': 6
      };
      return niveles[a] - niveles[b];
    }),
    datasets: [{
      label: 'Cantidad',
      data: Object.values(riesgos),
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
      borderWidth: 1
    }]
  };

    // Datos para Cintura
    const cinturasMasculino = pacientesFiltrados.reduce((acc, paciente) => {
      if (paciente.genero && paciente.genero.toLowerCase() === 'masculino') {
        const rango = paciente.cintura === null || paciente.cintura === undefined || isNaN(paciente.cintura) ? 'No Especificado' : (paciente.cintura > 102 ? 'Más de 102' : 'Menos de 102');
        acc[rango] = (acc[rango] || 0) + 1;
      }
      return acc;
    }, {});

    const cinturasFemenino = pacientesFiltrados.reduce((acc, paciente) => {
      if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
        const rango = paciente.cintura === null || paciente.cintura === undefined || isNaN(paciente.cintura) ? 'No Especificado' : (paciente.cintura > 88 ? 'Más de 88' : 'Menos de 88');
        acc[rango] = (acc[rango] || 0) + 1;
      }
      return acc;
    }, {});

    // Datos para gráfico masculino
    const dataCinturaMasculino = {
      labels: ['Menos de 102', 'Más de 102', 'No Especificado'],
      datasets: [{
        label: 'Cantidad (Masculino)',
        data: [cinturasMasculino['Menos de 102'] || 0, cinturasMasculino['Más de 102'] || 0, cinturasMasculino['No Especificado'] || 0],
        backgroundColor: ['#34D399', '#F97316', '#6B7280'],
        borderColor: ['#34D399', '#F97316', '#6B7280'],
        borderWidth: 1
      }]
    };

    // Datos para gráfico femenino
    const dataCinturaFemenino = {
      labels: ['Menos de 88', 'Más de 88', 'No Especificado'],
      datasets: [{
        label: 'Cantidad (Femenino)',
        data: [cinturasFemenino['Menos de 88'] || 0, cinturasFemenino['Más de 88'] || 0, cinturasFemenino['No Especificado'] || 0],
        backgroundColor: ['#FDE047', '#EF4444', '#6B7280'],
        borderColor: ['#FDE047', '#EF4444', '#6B7280'],
        borderWidth: 1
      }]
    };

  // Agrupación de IMC
  const imcCategorias = ['<18.5', '18.5-24.9', '25-29.9', '30-34.9', '35-39.9', '40+', 'No Especificado'];
  const conteoIMC = imcCategorias.reduce((acc, categoria) => {
    acc[categoria] = pacientesFiltrados.filter(paciente => {
      const imc = paciente.imc;
      if (imc === undefined || imc === null || isNaN(imc)) return categoria === 'No Especificado';
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
      backgroundColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280', '#9CA3AF'],
      borderColor: ['#34D399', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#6B7280', '#9CA3AF'],
      borderWidth: 1
    }]
  };

    // Datos para Medicamentos Hipertension
    const medicamentosHipertension = pacientesFiltrados.reduce((acc, paciente) => {
        const meds = paciente.medicamentosHipertension && paciente.medicamentosHipertension.trim() !== '' ? paciente.medicamentosHipertension.split(',').map(m => m.trim()) : ['No Especificado'];
        meds.forEach(med => {
            acc[med] = (acc[med] || 0) + 1;
        });
        return acc;
    }, {});
    const dataMedicamentosHipertension = {
        labels: Object.keys(medicamentosHipertension),
        datasets: [{
            label: 'Cantidad',
            data: Object.values(medicamentosHipertension),
            backgroundColor: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#F43F5E', '#06B6D4', '#6B7280'],
            borderColor: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#F43F5E', '#06B6D4', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Medicamentos Diabetes
    const medicamentosDiabetes = pacientesFiltrados.reduce((acc, paciente) => {
        const meds = paciente.medicamentosDiabetes && paciente.medicamentosDiabetes.trim() !== '' ? paciente.medicamentosDiabetes.split(',').map(m => m.trim()) : ['No Especificado'];
        meds.forEach(med => {
            acc[med] = (acc[med] || 0) + 1;
        });
        return acc;
    }, {});
    const dataMedicamentosDiabetes = {
        labels: Object.keys(medicamentosDiabetes),
        datasets: [{
            label: 'Cantidad',
            data: Object.values(medicamentosDiabetes),
            backgroundColor: ['#14B8A6', '#FB923C', '#F87171', '#A78BFA', '#38BDF8', '#FDE047', '#EF4444', '#DB2777', '#84CC16', '#6B7280'],
            borderColor: ['#14B8A6', '#FB923C', '#F87171', '#A78BFA', '#38BDF8', '#FDE047', '#EF4444', '#DB2777', '#84CC16', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Medicamentos Colesterol
    const medicamentosColesterol = pacientesFiltrados.reduce((acc, paciente) => {
        const meds = paciente.medicamentosColesterol && paciente.medicamentosColesterol.trim() !== '' ? paciente.medicamentosColesterol.split(',').map(m => m.trim()) : ['No Especificado'];
        meds.forEach(med => {
            acc[med] = (acc[med] || 0) + 1;
        });
        return acc;
    }, {});
    const dataMedicamentosColesterol = {
        labels: Object.keys(medicamentosColesterol),
        datasets: [{
            label: 'Cantidad',
            data: Object.values(medicamentosColesterol),
            backgroundColor: ['#4ADE80', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#D946EF', '#6B7280', '#EAB308', '#22D3EE', '#BE185D'],
            borderColor: ['#4ADE80', '#FDE047', '#F97316', '#EF4444', '#B91C1C', '#D946EF', '#6B7280', '#EAB308', '#22D3EE', '#BE185D'],
            borderWidth: 1
        }]
    };

    // Datos para Aspirina
    const aspirina = pacientesFiltrados.reduce((acc, paciente) => {
        const tomaAspirina = paciente.aspirina || 'No Especificado';
        acc[tomaAspirina] = (acc[tomaAspirina] || 0) + 1;
        return acc;
    }, {});
    const dataAspirina = {
        labels: Object.keys(aspirina),
        datasets: [{
            label: 'Cantidad',
            data: Object.values(aspirina),
            backgroundColor: ['#2563EB', '#DC2626', '#6B7280'],
            borderColor: ['#2563EB', '#DC2626', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para TFG
    const tfgRangos = pacientesFiltrados.reduce((acc, paciente) => {
        let rangoTFG;
        if (paciente.tfg === null || paciente.tfg === undefined || isNaN(paciente.tfg)) {
            rangoTFG = 'No Especificado';
        } else if (paciente.tfg >= 90) {
            rangoTFG = '>= 90 (Normal)';
        } else if (paciente.tfg >= 60 && paciente.tfg <= 89) {
            rangoTFG = '60-89 (Leve)';
        } else if (paciente.tfg >= 30 && paciente.tfg <= 59) {
            rangoTFG = '30-59 (Moderada)';
        } else if (paciente.tfg >= 15 && paciente.tfg <= 29) {
            rangoTFG = '15-29 (Severa)';
        } else {
            rangoTFG = '< 15 (Fallo Renal)';
        }
        acc[rangoTFG] = (acc[rangoTFG] || 0) + 1;
        return acc;
    }, {});
    const ordenLabelsTFG = ['>= 90 (Normal)', '60-89 (Leve)', '30-59 (Moderada)', '15-29 (Severa)', '< 15 (Fallo Renal)', 'No Especificado'];
    const dataTFG = {
        labels: ordenLabelsTFG,
        datasets: [{
            label: 'Cantidad',
            data: ordenLabelsTFG.map(label => tfgRangos[label] || 0),
            backgroundColor: ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
            borderColor: ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#B91C1C', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Enfermedad
    const enfermedades = pacientesFiltrados.reduce((acc, paciente) => {
        const enfermedad = paciente.enfermedad && paciente.enfermedad.trim() !== '' ? paciente.enfermedad : 'No Especificado';
        acc[enfermedad] = (acc[enfermedad] || 0) + 1;
        return acc;
    }, {});
    const dataEnfermedad = {
        labels: Object.keys(enfermedades),
        datasets: [{
            label: 'Cantidad',
            data: Object.values(enfermedades),
            backgroundColor: ['#6D28D9', '#EC4899', '#059669', '#FCD34D', '#EF4444', '#4F46E5', '#3B82F6', '#F43F5E', '#0891B2', '#6B7280'],
            borderColor: ['#6D28D9', '#EC4899', '#059669', '#FCD34D', '#EF4444', '#4F46E5', '#3B82F6', '#F43F5E', '#0891B2', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Numero de Gestas (only for Femenino)
    const numeroGestas = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const gestas = paciente.numeroGestas !== null && paciente.numeroGestas !== undefined && !isNaN(paciente.numeroGestas) ? paciente.numeroGestas.toString() : 'No Especificado';
            acc[gestas] = (acc[gestas] || 0) + 1;
        }
        return acc;
    }, {});
    const dataNumeroGestas = {
        labels: Object.keys(numeroGestas).sort((a, b) => {
            if (a === 'No Especificado') return 1;
            if (b === 'No Especificado') return -1;
            return parseInt(a) - parseInt(b);
        }),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.keys(numeroGestas).sort((a, b) => {
                if (a === 'No Especificado') return 1;
                if (b === 'No Especificado') return -1;
                return parseInt(a) - parseInt(b);
            }).map(label => numeroGestas[label] || 0),
            backgroundColor: ['#F472B6', '#EC4899', '#BE185D', '#A16207', '#6B7280'],
            borderColor: ['#F472B6', '#EC4899', '#BE185D', '#A16207', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para FUM (only for Femenino)
    const fumData = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const fum = paciente.fum && paciente.fum.trim() !== '' ? paciente.fum : 'No Especificado';
            acc[fum] = (acc[fum] || 0) + 1;
        }
        return acc;
    }, {});
    const dataFUM = {
        labels: Object.keys(fumData),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.values(fumData),
            backgroundColor: ['#C026D3', '#F472B6', '#8B5CF6', '#6B7280'],
            borderColor: ['#C026D3', '#F472B6', '#8B5CF6', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Metodo Anticonceptivo (only for Femenino)
    const metodoAnticonceptivo = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const metodo = paciente.metodoAnticonceptivo && paciente.metodoAnticonceptivo.trim() !== '' ? paciente.metodoAnticonceptivo : 'No Especificado';
            acc[metodo] = (acc[metodo] || 0) + 1;
        }
        return acc;
    }, {});
    const dataMetodoAnticonceptivo = {
        labels: Object.keys(metodoAnticonceptivo),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.values(metodoAnticonceptivo),
            backgroundColor: ['#EC4899', '#FDE047', '#EF4444', '#1D4ED8', '#6B7280'],
            borderColor: ['#EC4899', '#FDE047', '#EF4444', '#1D4ED8', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Trastornos Hipertensivos (only for Femenino)
    const trastornosHipertensivos = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const trastornos = paciente.trastornosHipertensivos || 'No Especificado';
            acc[trastornos] = (acc[trastornos] || 0) + 1;
        }
        return acc;
    }, {});
    const dataTrastornosHipertensivos = {
        labels: Object.keys(trastornosHipertensivos),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.values(trastornosHipertensivos),
            backgroundColor: ['#BE185D', '#F9A8D4', '#6B7280'],
            borderColor: ['#BE185D', '#F9A8D4', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para Diabetes Gestacional (only for Femenino)
    const diabetesGestacional = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const gestacional = paciente.diabetesGestacional || 'No Especificado';
            acc[gestacional] = (acc[gestacional] || 0) + 1;
        }
        return acc;
    }, {});
    const dataDiabetesGestacional = {
        labels: Object.keys(diabetesGestacional),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.values(diabetesGestacional),
            backgroundColor: ['#DB2777', '#FDE047', '#6B7280'],
            borderColor: ['#DB2777', '#FDE047', '#6B7280'],
            borderWidth: 1
        }]
    };

    // Datos para SOP (only for Femenino)
    const sop = pacientesFiltrados.reduce((acc, paciente) => {
        if (paciente.genero && paciente.genero.toLowerCase() === 'femenino') {
            const hasSop = paciente.sop || 'No Especificado';
            acc[hasSop] = (acc[hasSop] || 0) + 1;
        }
        return acc;
    }, {});
    const dataSOP = {
        labels: Object.keys(sop),
        datasets: [{
            label: 'Cantidad (Femenino)',
            data: Object.values(sop),
            backgroundColor: ['#9333EA', '#FDE047', '#6B7280'],
            borderColor: ['#9333EA', '#FDE047', '#6B7280'],
            borderWidth: 1
        }]
    };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Edad</h3>
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

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Género</h3>
        <Pie data={dataGenero} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(generos)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Diabetes</h3>
        <Pie data={dataDiabetes} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(diabetes)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Hipertensión Arterial</h3>
        <Pie data={dataHipertensionArterial} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(hipertensionArterial)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Fumador</h3>
        <Pie data={dataFumador} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(fumadores)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Exfumador</h3>
        <Pie data={dataExfumador} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(exfumadores)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Presión Arterial sistólica</h3>
        <Bar data={dataPresion} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(presiones)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: Math.max(...Object.values(presiones)) + 1 
            }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Colesterol</h3>
        <Bar data={dataColesterol} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(colesterol)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: Math.max(...Object.values(colesterol)) + 1
            }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Nivel de Riesgo</h3>
        <Bar data={dataRiesgo} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(riesgos)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { 
              ticks: { stepSize: 1 },
              suggestedMax: Math.max(...Object.values(riesgos)) + 1
            }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Cintura (Masculino)</h3>
        <Pie data={dataCinturaMasculino} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(cinturasMasculino)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Cintura (Femenino)</h3>
        <Pie data={dataCinturaFemenino} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(cinturasFemenino)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Distribución de IMC</h2>
          <Bar data={dataIMC} options={{ 
            responsive: true,
            plugins: { 
              legend: { display: true }, 
              tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(conteoIMC)[tooltipItem.label]}%)` } }
            },
            scales: {
              y: { 
                ticks: { stepSize: 1 },
                suggestedMax: Math.max(...Object.values(conteoIMC)) + 1
              }
            }
          }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Medicamentos Hipertensión</h3>
        <Bar data={dataMedicamentosHipertension} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(medicamentosHipertension)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Medicamentos Diabetes</h3>
        <Bar data={dataMedicamentosDiabetes} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(medicamentosDiabetes)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Medicamentos Colesterol</h3>
        <Bar data={dataMedicamentosColesterol} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(medicamentosColesterol)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Aspirina</h3>
        <Pie data={dataAspirina} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(aspirina)[tooltipItem.label]}%)` } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Tasa de Filtrado Glomerular (TFG)</h3>
        <Bar data={dataTFG} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(tfgRangos)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Enfermedad</h3>
        <Bar data={dataEnfermedad} options={{ 
          responsive: true,
          plugins: { 
            legend: { display: true }, 
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(enfermedades)[tooltipItem.label]}%)` } }
          },
          scales: {
            y: { ticks: { stepSize: 1 } }
          }
        }} />
      </div>

      {Object.keys(numeroGestas).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Número de Gestas (Solo Femenino)</h3>
          <Bar data={dataNumeroGestas} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(numeroGestas)[tooltipItem.label]}%)` } }
              },
              scales: {
                  y: { ticks: { stepSize: 1 } }
              }
          }} />
        </div>
      )}

      {Object.keys(fumData).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">FUM (Solo Femenino)</h3>
          <Pie data={dataFUM} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(fumData)[tooltipItem.label]}%)` } }
              }
          }} />
        </div>
      )}

      {Object.keys(metodoAnticonceptivo).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Método Anticonceptivo (Solo Femenino)</h3>
          <Pie data={dataMetodoAnticonceptivo} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(metodoAnticonceptivo)[tooltipItem.label]}%)` } }
              }
          }} />
        </div>
      )}

      {Object.keys(trastornosHipertensivos).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Trastornos Hipertensivos (Solo Femenino)</h3>
          <Pie data={dataTrastornosHipertensivos} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(trastornosHipertensivos)[tooltipItem.label]}%)` } }
              }
          }} />
        </div>
      )}

      {Object.keys(diabetesGestacional).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Diabetes Gestacional (Solo Femenino)</h3>
          <Pie data={dataDiabetesGestacional} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(diabetesGestacional)[tooltipItem.label]}%)` } }
              }
          }} />
        </div>
      )}

      {Object.keys(sop).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">SOP (Solo Femenino)</h3>
          <Pie data={dataSOP} options={{
              responsive: true,
              plugins: {
                  legend: { display: true },
                  tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} (${calcularPorcentajes(sop)[tooltipItem.label]}%)` } }
              }
          }} />
        </div>
      )}
    </div>
  );
}

export default EstadisticasGraficos;