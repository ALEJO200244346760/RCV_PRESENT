import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { calcularRiesgoCardiovascular } from './Calculadora'; // Ensure this is correctly imported

// Updated DatosPacienteInicial based on the provided ConstFormulario.jsx
const DatosPacienteInicial = {
  cuil: '',
  telefono: '',
  edad: '',
  obra: '',
  genero: '',
  hipertenso: '', // ¿Toma medicación para HTA?
  medicamentosHipertension: '', // Lista de medicamentos para HTA
  diabetes: '', // ¿Toma medicación para Diabetes?
  medicamentosDiabetes: '', // Lista de medicamentos para Diabetes
  medicolesterol: '', // ¿Toma medicación para Colesterol?
  medicamentosColesterol: '', // Lista de medicamentos para Colesterol
  aspirina: '',
  fumador: '',
  exfumador: '',
  presionArterial: '',
  taMin: '',
  colesterol: '',
  peso: '',
  talla: '',
  cintura: '',
  // fechaRegistro will be loaded from existing data, not initialized here
  imc: '',
  enfermedad: '',
  infarto: '',
  acv: '',
  renal: '',
  pulmonar: '',
  doctor: '',
  // Campos específicos para género femenino
  numeroGestas: '',
  fum: '',
  metodoAnticonceptivo: '',
  trastornosHipertensivos: '',
  diabetesGestacional: '',
  sop: '',
  // Campo para la función renal
  tfg: '', // Tasa de filtrado glomerular
};

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datosPaciente, setDatosPaciente] = useState(DatosPacienteInicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nivelColesterolConocido, setNivelColesterolConocido] = useState(false);

  const ajustarEdad = (edad) => {
    if (edad === null || edad === undefined || isNaN(edad)) return undefined;
    const age = parseInt(edad, 10);
    if (age < 50) return 40;
    if (age >= 50 && age <= 59) return 50;
    if (age >= 60 && age <= 69) return 60;
    return 70;
  };

  const ajustarPresionArterial = (presion) => {
      if (presion === null || presion === undefined || isNaN(presion)) return undefined;
      const pressure = parseInt(presion, 10);
      if (pressure < 140) return 120;
      if (pressure >= 140 && pressure <= 159) return 140;
      if (pressure >= 160 && pressure <= 179) return 160;
      return 180;
  };

  const calcularIMC = (data) => {
    const peso = parseFloat(data.peso);
    const tallaCm = parseFloat(data.talla);
    if (peso && tallaCm && tallaCm > 0) {
      const tallaM = tallaCm / 100;
      const imc = peso / (tallaM * tallaM);
      return imc.toFixed(2);
    }
    return '';
  };

  const calcularRiesgo = (data) => {
    const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = data;

    if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
      return ">20% <30% Alto";
    }

    if (!edad || !genero || !presionArterial || (nivelColesterolConocido && !colesterol)) {
        return '';
    }

    const edadAjustada = ajustarEdad(edad);
    const presionAjustada = ajustarPresionArterial(presionArterial);
    const colesterolValue = nivelColesterolConocido ? parseInt(colesterol, 10) : undefined;

    if (edadAjustada === undefined || presionAjustada === undefined || (nivelColesterolConocido && colesterolValue === undefined)) {
        return '';
    }

    const nivelRiesgo = calcularRiesgoCardiovascular(
      edadAjustada,
      genero,
      diabetes,
      fumador,
      presionAjustada,
      colesterolValue
    );
    return nivelRiesgo;
  };

  // Centralized function to update state and trigger calculations
  const updateAndCalculate = (newData) => {
    setDatosPaciente(prev => {
      const updatedData = { ...prev, ...newData };

      // Recalculate IMC if weight or height changed
      if (newData.peso !== undefined || newData.talla !== undefined) {
        updatedData.imc = calcularIMC(updatedData);
      }

      // Recalculate Risk if any relevant field changed
      if (
        newData.edad !== undefined || newData.genero !== undefined ||
        newData.diabetes !== undefined || newData.fumador !== undefined ||
        newData.presionArterial !== undefined || newData.colesterol !== undefined ||
        newData.infarto !== undefined || newData.acv !== undefined || newData.renal !== undefined
      ) {
        updatedData.nivelRiesgo = calcularRiesgo(updatedData);
      }
      return updatedData;
    });
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`https://rcvpresent-production.up.railway.app/api/pacientes/${id}`)
      .then(response => {
        const pacienteData = response.data;

        // Directly set data as there are no array lists to parse
        setDatosPaciente(pacienteData);
        setNivelColesterolConocido(pacienteData.colesterol !== 'No' && pacienteData.colesterol !== null && pacienteData.colesterol !== '');

        // Initial calculations after data fetch
        const imcValue = calcularIMC(pacienteData);
        const riesgoValue = calcularRiesgo(pacienteData);
        setDatosPaciente(prev => ({ ...prev, imc: imcValue, nivelRiesgo: riesgoValue }));

        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        setLoading(false);
        setError('Error al cargar los datos del paciente.');
      });
  }, [id, nivelColesterolConocido]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    updateAndCalculate({ [name]: value });
  };

  const manejarSeleccionColesterol = (value) => {
    const conoceColesterol = value === 'si';
    setNivelColesterolConocido(conoceColesterol);
    let newColesterolValue = datosPaciente.colesterol;
    if (!conoceColesterol) {
        newColesterolValue = 'No';
    } else if (newColesterolValue === 'No' || newColesterolValue === '') {
        newColesterolValue = '';
    }
    updateAndCalculate({ colesterol: newColesterolValue });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const pacienteFormatted = {
      ...datosPaciente,
      // No lists to format for submission anymore
    };

    try {
      await axios.put(`https://rcvpresent-production.up.railway.app/api/pacientes/${id}`, pacienteFormatted, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/estadisticas');
    } catch (submitError) {
      setError('Error al actualizar el paciente.');
      console.error('Error al actualizar el paciente:', submitError);
    }
  };


  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex-1 bg-gray-100 p-4 rounded-md">
      <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
      <form onSubmit={manejarSubmit} className="w-full space-y-6">
        {/* Cuil */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">DNI:</label>
          <input
            type="text"
            name="cuil"
            value={datosPaciente.cuil}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Teléfono:</label>
          <input
            type="number"
            name="telefono"
            value={datosPaciente.telefono}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Edad */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Edad:</label>
          <input
            type="number"
            name="edad"
            value={datosPaciente.edad}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Obra social */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Tiene Obra Social?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ obra: option })}
                className={`p-2 border rounded-md ${datosPaciente.obra === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Género */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Género:</label>
          <div className="flex space-x-2">
            {['masculino', 'femenino'].map(option => (
              <button
                key={option}
                type="button"
                className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => updateAndCalculate({ genero: option })}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Diabetes */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Toma medicación para Diabetes?</label>
          <div className="flex space-x-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ diabetes: option })}
                className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {datosPaciente.diabetes === 'Sí' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Medicamentos para Diabetes:</label>
            <input
              type="text"
              name="medicamentosDiabetes"
              value={datosPaciente.medicamentosDiabetes}
              onChange={manejarCambio}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Metformina, Insulina"
            />
          </div>
        )}

        {/* Hipertenso */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Toma medicación para HTA?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ hipertenso: option })}
                className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {datosPaciente.hipertenso === 'Sí' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Medicamentos para Hipertensión:</label>
            <input
              type="text"
              name="medicamentosHipertension"
              value={datosPaciente.medicamentosHipertension}
              onChange={manejarCambio}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Enalapril, Losartan"
            />
          </div>
        )}

        {/* Medicación Colesterol */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Toma medicación para Colesterol?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ medicolesterol: option })}
                className={`p-2 border rounded-md ${datosPaciente.medicolesterol === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {datosPaciente.medicolesterol === 'Sí' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Medicamentos para Colesterol:</label>
            <input
              type="text"
              name="medicamentosColesterol"
              value={datosPaciente.medicamentosColesterol}
              onChange={manejarCambio}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Atorvastatina, Rosuvastatina"
            />
          </div>
        )}

        {/* Aspirina */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Toma Aspirina?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ aspirina: option })}
                className={`p-2 border rounded-md ${datosPaciente.aspirina === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Fumador */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Es fumador?</label>
          <div className="flex space-x-2 mb-2">
            {['sí', 'no'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ fumador: option })}
                className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* exFumador */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Es exfumador?</label>
          <div className="flex space-x-2 mb-2">
            {['sí', 'no'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ exfumador: option })}
                className={`p-2 border rounded-md ${datosPaciente.exfumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Infarto */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Ha tenido un infarto?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ infarto: option })}
                className={`p-2 border rounded-md ${datosPaciente.infarto === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* ACV */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Ha tenido un ACV?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ acv: option })}
                className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedad Renal Crónica */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ renal: option })}
                className={`p-2 border rounded-md ${datosPaciente.renal === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedad (General) */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Tiene alguna otra enfermedad crónica?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ enfermedad: option })}
                className={`p-2 border rounded-md ${datosPaciente.enfermedad === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedad Pulmonar */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Tiene alguna enfermedad pulmonar?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateAndCalculate({ pulmonar: option })}
                className={`p-2 border rounded-md ${datosPaciente.pulmonar === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Colesterol */}
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">¿Conoce su nivel de colesterol?</label>
            <div className="flex space-x-2 mb-2">
                {['si', 'no'].map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => manejarSeleccionColesterol(option)}
                        className={`p-2 border rounded-md ${nivelColesterolConocido === (option === 'si') ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>
            {nivelColesterolConocido && (
                <input
                type="number"
                name="colesterol"
                value={datosPaciente.colesterol}
                onChange={manejarCambio}
                className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese su nivel de colesterol"
                style={{ appearance: 'none' }}
              />
            )}
        </div>

        {/* Presión Arterial */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">TA Máx.:</label>
          <input
            type="number"
            name="presionArterial"
            value={datosPaciente.presionArterial}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Tensión Arterial Mínima */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">TA Min.:</label>
          <input
            type="number"
            name="taMin"
            value={datosPaciente.taMin}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Peso */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Peso (kg):</label>
          <input
            type="number"
            name="peso"
            value={datosPaciente.peso}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Talla */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Talla (cm):</label>
          <input
            type="number"
            name="talla"
            value={datosPaciente.talla}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Cintura */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Cintura (cm):</label>
          <input
            type="number"
            name="cintura"
            value={datosPaciente.cintura}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* TFG */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">TFG (Tasa de Filtrado Glomerular):</label>
          <input
            type="number"
            name="tfg"
            value={datosPaciente.tfg}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Mostrar el nivel de riesgo */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Nivel de Riesgo:</label>
          <input
            type="text"
            value={datosPaciente.nivelRiesgo}
            readOnly
            className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-200"
          />
        </div>

        {/* Campos específicos para género femenino */}
        {datosPaciente.genero === 'femenino' && (
          <>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Número de Gestas:</label>
              <input
                type="number"
                name="numeroGestas"
                value={datosPaciente.numeroGestas}
                onChange={manejarCambio}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">FUM (Fecha Última Menstruación):</label>
              <input
                type="date"
                name="fum"
                value={datosPaciente.fum}
                onChange={manejarCambio}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Método Anticonceptivo:</label>
              <input
                type="text"
                name="metodoAnticonceptivo"
                value={datosPaciente.metodoAnticonceptivo}
                onChange={manejarCambio}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Trastornos Hipertensivos en el Embarazo:</label>
              <div className="flex space-x-2 mb-2">
                {['Sí', 'No'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAndCalculate({ trastornosHipertensivos: option })}
                    className={`p-2 border rounded-md ${datosPaciente.trastornosHipertensivos === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Diabetes Gestacional:</label>
              <div className="flex space-x-2 mb-2">
                {['Sí', 'No'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAndCalculate({ diabetesGestacional: option })}
                    className={`p-2 border rounded-md ${datosPaciente.diabetesGestacional === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">SOP (Síndrome de Ovario Poliquístico):</label>
              <div className="flex space-x-2 mb-2">
                {['Sí', 'No'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAndCalculate({ sop: option })}
                    className={`p-2 border rounded-md ${datosPaciente.sop === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Doctor */}
        <div className="flex flex-col mt-4">
          <div className="flex justify-end space-x-2">
            {['doctor1', 'doctor2', 'doctor3'].map(doctor => (
              <button
                key={doctor}
                type="button"
                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => updateAndCalculate({ doctor })}
              >
                {doctor.charAt(0).toUpperCase() + doctor.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Botón de guardar */}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarPaciente;