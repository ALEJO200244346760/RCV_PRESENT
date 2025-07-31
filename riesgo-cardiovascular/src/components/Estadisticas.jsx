import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Advertencia } from './ConstFormulario'
import EstadisticasGraficos from './EstadisticasGraficos'; // Asegúrate de que la ruta sea correcta

function Estadisticas() {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({
    edad: '',
    cuil: '',
    genero: '',
    diabetes: '',
    fumador: '',
    exfumador: '',
    presionArterial: '',
    colesterol: '',
    nivelColesterol: '', // Campo para el nivel específico de colesterol
    nivelRiesgo: '',
    ubicacion: '',
    imc: '',
    infarto: '',
    acv: '',
    cintura: '',
    hipertenso: '',
    doctor: '',
    // Nuevos filtros basados en DatosPacienteInicial
    medicamentosHipertension: '',
    medicamentosDiabetes: '',
    medicamentosColesterol: '',
    aspirina: '',
    tfg: '',
    numeroGestas: '',
    fum: '',
    metodoAnticonceptivo: '',
    trastornosHipertensivos: '',
    diabetesGestacional: '',
    sop: '',
    enfermedad: '',
    alergias: '',
    tiroides: '',
    sedentarismo: '',
  });
  const [nivelColesterolConocido, setNivelColesterolConocido] = useState('todos'); // Estado para el conocimiento del nivel de colesterol
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mostrarDetalles, setMostrarDetalles] = useState({}); // Estado para mostrar detalles de cada paciente
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const toggleDetalles = (id) => {
    setMostrarDetalles((prev) => ({
      ...prev,
      [id]: !prev[id], // Alterna la visibilidad de los detalles
    }));
  };

  // Configuración de la URL base para la API
  const apiBaseURL = 'https://rcvpresent-production.up.railway.app';

  // Hook useEffect para obtener datos de pacientes desde la API
  useEffect(() => {
    axios.get(`${apiBaseURL}/api/pacientes`)
      .then(response => {
        console.log('Datos de respuesta:', response.data); // Verifica la estructura de los datos
        const data = response.data;

        // Verifica el tipo de datos
        console.log('Es un arreglo:', Array.isArray(data));

        if (Array.isArray(data)) {
          setPacientes(data);
          setPacientesFiltrados(data);
        } else {
          console.error('La respuesta de la API no es un arreglo');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los pacientes:', error);
        setLoading(false);
      });
  }, []);

  // Hook useEffect para aplicar filtros cada vez que cambian
  useEffect(() => {
    aplicarFiltros(); // Aplica filtros cada vez que cambian
  }, [filtros, nivelColesterolConocido]);

  // Función para manejar el cambio en el filtro de colesterol
  const manejarSeleccionColesterol = (e) => {
    const valor = e.target.value;
    setNivelColesterolConocido(valor);
    if (valor === 'no') {
      setFiltros(prev => ({
        ...prev,
        nivelColesterol: '', // Resetea el nivel de colesterol específico si se selecciona "no"
      }));
    }
  };

  // Función para manejar cambios en los filtros
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value || '', // Maneja el valor vacío como cadena vacía
    }));
  };

  // Función para obtener el nivel de colesterol basado en el valor
  const obtenerNivelColesterol = (valor) => {
    if (valor < 154) return 4;
    if (valor >= 155 && valor <= 192) return 5;
    if (valor >= 193 && valor <= 231) return 6;
    if (valor >= 232 && valor <= 269) return 7;
    return 8;
  };

  // Función para aplicar filtros a la lista de pacientes
  const aplicarFiltros = () => {
    const filtrados = pacientes.filter(paciente => {
      const edadFiltro = filtros.edad === '' ? null : filtros.edad;
      const cinturaFiltro = filtros.cintura === '' ? null : filtros.cintura;
      const presionArterialFiltro = filtros.presionArterial === '' ? null : filtros.presionArterial;
      const nivelColesterolFiltro = filtros.nivelColesterol === '' ? null : Number(filtros.nivelColesterol);

      const nivelColesterolPaciente = paciente.colesterol ? obtenerNivelColesterol(Number(paciente.colesterol)) : null;

      const imc = paciente.imc;
      const categoriaIMC = imc < 18.5 ? '<18.5' :
                           (imc >= 18.5 && imc <= 24.9) ? '18.5-24.9' :
                           (imc >= 25 && imc <= 29.9) ? '25-29.9' :
                           (imc >= 30 && imc <= 34.9) ? '30-34.9' :
                           (imc >= 35 && imc <= 39.9) ? '35-39.9' : '40+';
        // Filtrado por edad
        let edadValida = true;
        if (edadFiltro) {
          const [min, max] = edadFiltro.split('-').map(Number);
          if (isNaN(max)) {
            // Si max es NaN, significa que es el rango "71+"
            edadValida = paciente.edad > 71;
          } else {
            edadValida = paciente.edad >= min && paciente.edad <= (max || Number.MAX_VALUE);
          }
        }

        let cinturaValida = true;
        if (cinturaFiltro) {
          if (cinturaFiltro === "<88") {
            cinturaValida = paciente.cintura < 88;
          } else if (cinturaFiltro === "88+") {
            cinturaValida = paciente.cintura > 88;
          } else if (cinturaFiltro === "<102") {
            cinturaValida = paciente.cintura < 102;
          } else if (cinturaFiltro === "102+") {
            cinturaValida = paciente.cintura > 102;
          }
        }

        // Restante lógica de filtrado
        return (
          edadValida &&
          cinturaValida &&
          (filtros.genero === '' || (paciente.genero && paciente.genero.toLowerCase() === filtros.genero.toLowerCase())) &&
          (filtros.doctor === '' || (paciente.doctor && paciente.doctor.toLowerCase() === filtros.doctor.toLowerCase())) &&
          (filtros.diabetes === '' || (paciente.diabetes && paciente.diabetes.toLowerCase() === filtros.diabetes.toLowerCase())) &&
          (filtros.fumador === '' || (paciente.fumador && paciente.fumador.toLowerCase() === filtros.fumador.toLowerCase())) &&
          (filtros.exfumador === '' || (paciente.exfumador && paciente.exfumador.toLowerCase() === filtros.exfumador.toLowerCase())) &&
          (presionArterialFiltro === null || paciente.presionArterial.toString() === presionArterialFiltro) &&
          (
            nivelColesterolConocido === 'todos' || 
            (nivelColesterolConocido === 'no' && (paciente.colesterol === 'No' || paciente.colesterol === null)) || 
            (nivelColesterolConocido === 'si' && paciente.colesterol !== null && paciente.colesterol !== 'No' && (filtros.nivelColesterol === '' || nivelColesterolPaciente === nivelColesterolFiltro))
          ) &&
          (filtros.nivelRiesgo === '' || (paciente.nivelRiesgo && paciente.nivelRiesgo.toLowerCase() === filtros.nivelRiesgo.toLowerCase())) &&
          (filtros.ubicacion === '' || (paciente.ubicacion && paciente.ubicacion.toLowerCase() === filtros.ubicacion.toLowerCase())) &&
          (filtros.imc === '' || filtros.imc === categoriaIMC) &&
          (filtros.infarto === '' || (paciente.infarto && paciente.infarto.toLowerCase() === filtros.infarto.toLowerCase())) &&
          (filtros.acv === '' || (paciente.acv && paciente.acv.toLowerCase() === filtros.acv.toLowerCase())) &&
          (filtros.hipertenso === '' || (paciente.hipertenso && paciente.hipertenso.toLowerCase() === filtros.hipertenso.toLowerCase())) &&
          // Nuevos filtros
          (filtros.medicamentosHipertension === '' || (paciente.medicamentosHipertension && paciente.medicamentosHipertension.toLowerCase().includes(filtros.medicamentosHipertension.toLowerCase()))) &&
          (filtros.medicamentosDiabetes === '' || (paciente.medicamentosDiabetes && paciente.medicamentosDiabetes.toLowerCase().includes(filtros.medicamentosDiabetes.toLowerCase()))) &&
          (filtros.medicamentosColesterol === '' || (paciente.medicamentosColesterol && paciente.medicamentosColesterol.toLowerCase().includes(filtros.medicamentosColesterol.toLowerCase()))) &&
          (filtros.aspirina === '' || (paciente.aspirina && paciente.aspirina.toLowerCase() === filtros.aspirina.toLowerCase())) &&
          (filtros.tfg === '' || paciente.tfg === Number(filtros.tfg)) && // Assuming TFG is a number
          (filtros.numeroGestas === '' || paciente.numeroGestas === Number(filtros.numeroGestas)) &&
          (filtros.fum === '' || (paciente.fum && paciente.fum.toLowerCase() === filtros.fum.toLowerCase())) &&
          (filtros.metodoAnticonceptivo === '' || (paciente.metodoAnticonceptivo && paciente.metodoAnticonceptivo.toLowerCase().includes(filtros.metodoAnticonceptivo.toLowerCase()))) &&
          (filtros.trastornosHipertensivos === '' || (paciente.trastornosHipertensivos && paciente.trastornosHipertensivos.toLowerCase() === filtros.trastornosHipertensivos.toLowerCase())) &&
          (filtros.diabetesGestacional === '' || (paciente.diabetesGestacional && paciente.diabetesGestacional.toLowerCase() === filtros.diabetesGestacional.toLowerCase())) &&
          (filtros.sop === '' || (paciente.sop && paciente.sop.toLowerCase() === filtros.sop.toLowerCase())) &&
          (filtros.enfermedad === '' || (paciente.enfermedad && paciente.enfermedad.toLowerCase().includes(filtros.enfermedad.toLowerCase()))) &&
          (filtros.alergias === '' || (paciente.alergias && paciente.alergias.toLowerCase() === filtros.alergias.toLowerCase())) &&
          (filtros.tiroides === '' || (paciente.tiroides && paciente.tiroides.toLowerCase() === filtros.tiroides.toLowerCase())) &&
          (filtros.sedentarismo === '' || (paciente.sedentarismo && paciente.sedentarismo.toLowerCase() === filtros.sedentarismo.toLowerCase()))
        );
      });

    setPacientesFiltrados(filtrados);
  };

  // Función para eliminar un paciente
  const eliminarPaciente = (id) => {
    axios.delete(`${apiBaseURL}/api/pacientes/${id}`)
      .then(() => {
        setPacientes(pacientes.filter(paciente => paciente.id !== id));
        setPacientesFiltrados(pacientesFiltrados.filter(paciente => paciente.id !== id));
      })
      .catch(error => console.error('Error al eliminar el paciente:', error));
  };

  // Función para redirigir al usuario a la página de edición de un paciente
  const editarPaciente = (id) => {
    navigate(`/editar-paciente/${id}`);
  };

  // Función para obtener el color de riesgo basado en el nivel
  const obtenerColorRiesgo = (nivel) => {
    switch (nivel) {
      case 'Poco':
        return 'bg-green-100 text-green-800';
      case 'Moderado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-orange-100 text-orange-800';
      case 'Muy Alto':
        return 'bg-red-100 text-red-800';
      case 'Crítico':
        return 'bg-red-900 text-white';
      default:
        return '';
    }
  };

  const toggleGraficos = () => {
    setMostrarGraficos(prev => !prev);
  };

  const copiarDatos = (paciente) => {
    const nivelRiesgoTexto = paciente.nivelRiesgo;
    const recomendaciones = Advertencia[nivelRiesgoTexto] || "No hay recomendaciones disponibles.";
  
    const datos = `
      ID: ${paciente.id}      FECHA DE REGISTRO: ${paciente.fechaRegistro}      DNI: ${paciente.cuil}     TELEFONO: ${paciente.telefono}      Edad: ${paciente.edad}      Género: ${paciente.genero}      HIPERTENSO: ${paciente.hipertenso}      Medicamentos Hipertensión: ${paciente.medicamentosHipertension || 'N/A'}      Diabetes: ${paciente.diabetes}      Medicamentos Diabetes: ${paciente.medicamentosDiabetes || 'N/A'}      Fumador: ${paciente.fumador}      exFumador: ${paciente.exfumador}      TA Máx.: ${paciente.presionArterial}      TA Mín.: ${paciente.taMin}      Colesterol: ${paciente.colesterol}      Medicamentos Colesterol: ${paciente.medicamentosColesterol || 'N/A'}      IMC: ${paciente.imc}      PESO: ${paciente.peso}      TALLA: ${paciente.talla}      CINTURA: ${paciente.cintura}        ACV: ${paciente.acv}      RENAL: ${paciente.renal}      PULMONAR: ${paciente.pulmonar}      INFARTO: ${paciente.infarto}
      Nivel de Riesgo: ${nivelRiesgoTexto}
      NOTIFICACION DE RIESGO: ${paciente.notificacionRiesgo}
      Aspirina: ${paciente.aspirina || 'N/A'}
      TFG: ${paciente.tfg || 'N/A'} ml/min/173m²
      Enfermedad: ${paciente.enfermedad || 'N/A'}
      ${paciente.numeroGestas ? `Número de Gestas: ${paciente.numeroGestas}` : ""}
      ${paciente.fum ? `FUM: ${paciente.fum}` : ""}
      ${paciente.metodoAnticonceptivo ? `Método Anticonceptivo: ${paciente.metodoAnticonceptivo}` : ""}
      ${paciente.trastornosHipertensivos ? `Trastornos Hipertensivos: ${paciente.trastornosHipertensivos}` : ""}
      ${paciente.diabetesGestacional ? `Diabetes Gestacional: ${paciente.diabetesGestacional}` : ""}
      ${paciente.sop ? `SOP: ${paciente.sop}` : ""}
      ${paciente.consulta ? `CONSULTA: ${paciente.consulta}` : ""}
      ${paciente.practica ? `PRÁCTICA: ${paciente.practica}` : ""}
      ${paciente.hipertensionArterial ? `HIPERTENSION ARTERIAL: ${paciente.hipertensionArterial}` : ""}
      ${paciente.medicacionPrescripcion ? `MEDICACION PRESCRIPCION: ${paciente.medicacionPrescripcion}` : ""}
      ${paciente.medicacionDispensa ? `MEDICACION DISPENSA: ${paciente.medicacionDispensa}` : ""}
      ${paciente.tabaquismo ? `TABAQUISMO: ${paciente.tabaquismo}` : ""}
      ${paciente.laboratorio ? `LABORATORIO: ${paciente.laboratorio}` : ""}
      NO SOPLOS NI ARRITMIAS
      EXAMEN CARDIOVASCULAR R1 R2 NF Regular No soplos Rales Edemas ni Yugular PP + regular Simétricos. Dentro de lo normal sin signos de descompensación.
      ELECTROCARDIOGRAMA Ritmo sinusal, frecuencia cardíaca y eje normal, sin trastornos agudos del segmento ST y T sin alteraciones en el sistema de conducción, sin Arritmias, intervalo QT dentro de lo normal
      EXAMEN CARDIOVASCULAR Dentro de lo normal sin signos de descompensación
      No refiere angor disnea palpitaciones mareos edemas entre otros
      RECOMENDACIONES:
      ${recomendaciones}
    `;
  
    navigator.clipboard.writeText(datos)
      .then(() => alert('Datos copiados al portapapeles'))
      .catch(err => console.error('Error al copiar los datos:', err));
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Pacientes</h1>
      
      <div className="mb-6">
      {/* Botón Mostrar/Ocultar */}
      <button
        onClick={toggleFiltros}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow hover:bg-gray-300"
      >
        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {/* Filtros visibles si mostrarFiltros es true */}
      {mostrarFiltros && (
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1">
            {/* Fila 1 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <select
                  name="edad"
                  value={filtros.edad || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="0-40">Menor o igual a 40</option>
                  <option value="41-50">Entre 41 y 50</option>
                  <option value="51-60">Entre 51 y 60</option>
                  <option value="61-70">Entre 61 y 70</option>
                  <option value="71+">Mayores de 71</option>
                </select>
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <select
                  name="genero"
                  value={filtros.genero || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>

              {/* Diabetes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Diabetes?</label>
                <select
                  name="diabetes"
                  value={filtros.diabetes || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Fumador */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Fumador?</label>
                <select
                  name="fumador"
                  value={filtros.fumador || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Exfumador */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Exfumador?</label>
                <select
                  name="exfumador"
                  value={filtros.exfumador || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Tensión Máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tensión Máxima</label>
                <select
                  name="presionArterial"
                  value={filtros.presionArterial || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="120">120</option>
                  <option value="140">140</option>
                  <option value="160">160</option>
                  <option value="180">180</option>
                </select>
              </div>

              {/* Colesterol */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Colesterol</label>
                <select
                  name="colesterol"
                  value={nivelColesterolConocido}
                  onChange={manejarSeleccionColesterol}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>

                {nivelColesterolConocido === 'si' && (
                  <select
                    name="nivelColesterol"
                    value={filtros.nivelColesterol || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seleccione un Nivel</option>
                    <option value="4">Muy Bajo (&lt;154)</option>
                    <option value="5">Bajo (155 - 192)</option>
                    <option value="6">Moderado (193 - 231)</option>
                    <option value="7">Alto (232 - 269)</option>
                    <option value="8">Muy Alto (&gt;270)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Fila 2 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nivel de riesgo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
                <select
                  name="nivelRiesgo"
                  value={filtros.nivelRiesgo || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<10% Bajo">Bajo</option>
                  <option value=">10% <20% Moderado">Moderado</option>
                  <option value=">20% <30% Alto">Alto</option>
                  <option value=">30% <40% Muy Alto">Muy Alto</option>
                  <option value=">40% Crítico">Crítico</option>
                </select>
              </div>

              {/* IMC */}
              <div>
                <label className="block text-sm font-medium text-gray-700">IMC</label>
                <select
                  name="imc"
                  value={filtros.imc || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<18.5">Menor a 18.5</option>
                  <option value="18.5-24.9">Saludable</option>
                  <option value="25-29.9">Sobrepeso</option>
                  <option value="30-34.9">Obesidad 1</option>
                  <option value="35-39.9">Obesidad 2</option>
                  <option value="40+">Obesidad 3</option>
                </select>
              </div>

              {/* Infarto */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Infarto?</label>
                <select
                  name="infarto"
                  value={filtros.infarto || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* ACV */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿ACV?</label>
                <select
                  name="acv"
                  value={filtros.acv || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Hipertenso */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Hipertenso?</label>
                <select
                  name="hipertenso"
                  value={filtros.hipertenso || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Cintura */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cintura</label>
                <select
                  name="cintura"
                  value={filtros.cintura || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<88">Menor de 88</option>
                  <option value="88+">Mayor de 88</option>
                  <option value="<102">Menor de 102</option>
                  <option value="102+">Mayor de 102</option>
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  name="doctor"
                  value={filtros.doctor || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="doctor1">Doctor 1</option>
                  <option value="doctor2">Doctor 2</option>
                  <option value="doctor3">Doctor 3</option>
                </select>
              </div>

              {/* Aspirina */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Toma Aspirina?</label>
                <select
                  name="aspirina"
                  value={filtros.aspirina || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* TFG */}
              <div>
                <label className="block text-sm font-medium text-gray-700">TFG</label>
                <input
                  type="number"
                  name="tfg"
                  value={filtros.tfg || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Filtrar por TFG"
                />
              </div>

              {/* Enfermedad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Enfermedad</label>
                <input
                  type="text"
                  name="enfermedad"
                  value={filtros.enfermedad || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Filtrar por Enfermedad"
                />
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Alergias?</label>
                <select name="alergias" value={filtros.alergias || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Tiroides */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Tiroides?</label>
                <select name="tiroides" value={filtros.tiroides || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Sedentarismo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Sedentarismo?</label>
                <select name="sedentarismo" value={filtros.sedentarismo || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Numero de Gestas (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Gestas</label>
                  <input
                    type="number"
                    name="numeroGestas"
                    value={filtros.numeroGestas || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por Gestas"
                  />
                </div>
              )}

              {/* FUM (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">FUM</label>
                  <input
                    type="text" // Or date type if applicable
                    name="fum"
                    value={filtros.fum || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por FUM"
                  />
                </div>
              )}

              {/* Metodo Anticonceptivo (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Método Anticonceptivo</label>
                  <input
                    type="text"
                    name="metodoAnticonceptivo"
                    value={filtros.metodoAnticonceptivo || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por Método Anticonceptivo"
                  />
                </div>
              )}

              {/* Trastornos Hipertensivos (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trastornos Hipertensivos</label>
                  <select
                    name="trastornosHipertensivos"
                    value={filtros.trastornosHipertensivos || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* Diabetes Gestacional (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diabetes Gestacional</label>
                  <select
                    name="diabetesGestacional"
                    value={filtros.diabetesGestacional || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* SOP (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">SOP</label>
                  <select
                    name="sop"
                    value={filtros.sop || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

            </div>

            {/* Botón aplicar filtros */}
            <button
              onClick={aplicarFiltros}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700"
            >
              Aplicar Filtros
            </button>
          </div>
          </div>
        )}
      </div>

      {/* Gráficos */}
      {/* Pestaña para los gráficos */}
      <button 
        onClick={toggleGraficos} 
        className="bg-indigo-600 text-white p-2 rounded"
      >
        {mostrarGraficos ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
      </button>

      {/* Mostrar los gráficos si el estado es verdadero */}
      {mostrarGraficos && (
        <div className="mt-4">
          <EstadisticasGraficos pacientesFiltrados={pacientesFiltrados} />
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Total de Personas que Coinciden con los Filtros: {pacientesFiltrados.length}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientesFiltrados.slice().reverse().map(paciente => ( // Aquí usamos slice() para no mutar el array original
        <div key={paciente.id} className="bg-white shadow-md rounded-lg p-4">
          {/* Datos siempre visibles */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">ID:</div>
            <div className="text-sm text-gray-500">{paciente.id}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Edad:</div>
            <div className="text-sm text-gray-500">{paciente.edad}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TELEFONO:</div>
            <div className="text-sm text-gray-500">{paciente.telefono}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">GÉNERO:</div>
            <div className="text-sm text-gray-500">{paciente.genero}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">DNI:</div>
            <div className="text-sm text-gray-500">{paciente.cuil}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TA Máx.:</div>
            <div className="text-sm text-gray-500">{paciente.presionArterial}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TA Mín.:</div>
            <div className="text-sm text-gray-500">{paciente.taMin}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Peso:</div>
            <div className="text-sm text-gray-500">{paciente.peso}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Talla:</div>
            <div className="text-sm text-gray-500">{paciente.talla}</div>
          </div>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm font-medium text-gray-900">Nivel de Riesgo:</div>
            <div className="text-sm text-gray-500">
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${obtenerColorRiesgo(paciente.nivelRiesgo)}`}>
                {paciente.nivelRiesgo}
              </span>
            </div>
          </div>

          {/* Mostrar detalles adicionales solo si están activados */}
          {mostrarDetalles[paciente.id] && (
            <div className="mt-0">
              {[
                { label: "FUMA", value: paciente.fumador },
                { label: "EXFUMADOR", value: paciente.exfumador },
                { label: "COLESTEROL", value: paciente.colesterol },
                { label: "Medicamentos Colesterol", value: paciente.medicamentosColesterol },
                { label: "IMC", value: paciente.imc },
                { label: "Peso", value: paciente.peso },
                { label: "Talla", value: paciente.talla },
                { label: "Fecha de Registro", value: paciente.fechaRegistro },
                { label: "Hipertenso", value: paciente.hipertenso },
                { label: "Medicamentos Hipertensión", value: paciente.medicamentosHipertension },
                { label: "Diabetes", value: paciente.diabetes },
                { label: "Medicamentos Diabetes", value: paciente.medicamentosDiabetes },
                { label: "Aspirina", value: paciente.aspirina },
                { label: "TFG", value: paciente.tfg },
                { label: "Enfermedad", value: paciente.enfermedad },
                { label: "ACV", value: paciente.acv },
                { label: "Cintura", value: paciente.cintura },
                { label: "RENAL", value: paciente.renal },
                { label: "Infarto", value: paciente.infarto },
                { label: "Pulmonar", value: paciente.pulmonar },
                { label: "Alergias", value: paciente.alergias },
                { label: "Tiroides", value: paciente.tiroides },
                { label: "Sedentarismo", value: paciente.sedentarismo },
                { label: "Número de Gestas", value: paciente.numeroGestas },
                { label: "FUM", value: paciente.fum },
                { label: "Método Anticonceptivo", value: paciente.metodoAnticonceptivo },
                { label: "Trastornos Hipertensivos", value: paciente.trastornosHipertensivos },
                { label: "Diabetes Gestacional", value: paciente.diabetesGestacional },
                { label: "SOP", value: paciente.sop },
                // Las siguientes listas se eliminarán si ya no las usas en el backend/frontend
                // Si aún las envías como cadenas de texto, el filter y map actual las mostrará
                // pero si ya no existen en tu modelo, simplemente no se mostrarán aquí.
                // { label: "Notificación de Riesgo", value: paciente.notificacionRiesgo },
                // { label: "Consulta", value: paciente.consulta },
                // { label: "Práctica", value: paciente.practica },
                // { label: "Medicaciones Dispensa", value: paciente.medicacionDispensa },
                // { label: "Medicaciones Prescripción", value: paciente.medicacionPrescripcion },
                // { label: "Tabaquismo", value: paciente.tabaquismo },
                // { label: "Laboratorio", value: paciente.laboratorio },
                { label: "Doctor", value: paciente.doctor },
              ]
                // FILTRA valores vacíos o nulos
                .filter(({ value }) => value !== null && value !== undefined && value !== '' && value !== 'N/A')
                .map(({ label, value }) => (
                  <div className="flex justify-between mb-2" key={label}>
                    <div className="w-2/5 text-sm font-medium text-gray-900">{label}:</div>
                    <div className="w-2/5 text-sm text-gray-500 text-right">
                      {label === "TFG" && value ? `${value} ml/min/1.73m²` : value}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Botón "Mostrar más" o "Mostrar menos" */}
          <button onClick={() => toggleDetalles(paciente.id)} className="text-indigo-600 hover:text-indigo-900 mt-2">
            {mostrarDetalles[paciente.id] ? 'Mostrar menos' : 'Mostrar más'}
          </button>

          <div className="flex justify-end mt-4">
            <button onClick={() => editarPaciente(paciente.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
              Editar
            </button>
            <button onClick={() => eliminarPaciente(paciente.id)} className="text-red-600 hover:text-red-900 mr-4">
              Eliminar
            </button>
            <button onClick={() => copiarDatos(paciente)} className="text-blue-600 hover:text-blue-900">
              Copiar
            </button>
          </div>
        </div>
      ))}
    </div>

    </div>
);
}

export default Estadisticas;