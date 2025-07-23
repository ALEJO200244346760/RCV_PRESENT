import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  listaNotificacionRiesgo,
  listaHipertensionArterial,
  listaMedicacionPrescripcion,
  listaMedicacionDispensa,
  listaTabaquismo,
  listaLaboratorio,
  listaConsulta,
  listaPractica
} from './ConstFormulario'; // Ensure these are correctly imported
import { calcularRiesgoCardiovascular } from './Calculadora'; // Ensure this is correctly imported


const DatosPacienteInicial = {
  cuil: '',
  telefono: '',
  edad: '',
  obra: '',
  genero: '',
  diabetes: '',
  fumador: '',
  exfumador: '',
  presionArterial: '',
  taMin: '',
  colesterol: '',
  peso: '',
  talla: '',
  cintura: '',
  doctor: '',
  imc: '',
  nivelRiesgo: '',
  infarto: '',
  acv: '',
  renal: '',
  hipertenso: '',
  ubicacion: '',
  notificacionRiesgo: [],
  hipertensionArterial: [],
  medicacionPrescripcion: [],
  medicacionDispensa: [],
  tabaquismo: [],
  laboratorio: [],
  consulta: [], // Added for handling consulta
  practica: [], // Added for handling practica
};

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datosPaciente, setDatosPaciente] = useState(DatosPacienteInicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nivelColesterolConocido, setNivelColesterolConocido] = useState(datosPaciente.colesterol !== 'No' && datosPaciente.colesterol !== '');

  useEffect(() => {
    setLoading(true);
    axios.get(`https://rcvcba-production.up.railway.app/api/pacientes/${id}`)
      .then(response => {
        setDatosPaciente(response.data);
        setNivelColesterolConocido(response.data.colesterol !== 'No' && response.data.colesterol !== '');
        calcularIMC(response.data);
        calcularRiesgo(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        setLoading(false);
      });
  }, [id]);

  const ajustarEdad = (edad) => {
    if (edad < 50) return 40;
    if (edad >= 50 && edad <= 59) return 50;
    if (edad >= 60 && edad <= 69) return 60;
    return 70;
  };

  const ajustarPresionArterial = (presion) => {
      if (presion < 140) return 120;
      if (presion >= 140 && presion <= 159) return 140;
      if (presion >= 160 && presion <= 179) return 160;
      return 180;
  };

  const manejarSeleccionColesterol = (value) => {
    const conoceColesterol = value === 'si';
    setNivelColesterolConocido(conoceColesterol);
    setDatosPaciente(prev => ({
      ...prev,
      colesterol: conoceColesterol ? (prev.colesterol === 'No' ? '' : prev.colesterol) : 'No',
    }));
  };

  const calcularIMC = (data) => {
    const peso = parseFloat(data.peso);
    const tallaCm = parseFloat(data.talla);
    if (peso && tallaCm) {
      const tallaM = tallaCm / 100; 
      const imc = peso / (tallaM * tallaM);
      setDatosPaciente(prev => ({ ...prev, imc: imc.toFixed(2) }));
    }
  };

  const calcularRiesgo = (data) => {
    const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = data;
    if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
      setDatosPaciente(prev => ({ ...prev, nivelRiesgo: ">20% <30% Alto" }));
      return;
    }

    const edadAjustada = ajustarEdad(parseInt(edad, 10));
    const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));
    const nivelRiesgo = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
    setDatosPaciente(prev => ({ ...prev, nivelRiesgo }));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosPaciente(prev => ({ ...prev, [name]: value }));

    if (['peso', 'talla', 'edad', 'genero', 'diabetes', 'fumador', 'exfumador', 'presionArterial', 'colesterol', 'infarto', 'acv', 'renal'].includes(name)) {
      calcularIMC({ ...datosPaciente, [name]: value });
      calcularRiesgo({ ...datosPaciente, [name]: value });
    }
  };

  const manejarCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setDatosPaciente(prev => {
      const currentList = prev[name] || []; // Ensure the field is always treated as an array
      if (checked) {
        // Add the value if checked
        return { ...prev, [name]: [...currentList, value] };
      } else {
        // Remove the value if unchecked
        return { ...prev, [name]: currentList.filter(item => item !== value) };
      }
    });
  };  

  const formatList = (list) => {
    // Return a formatted string or an empty string if the list is not an array
    return Array.isArray(list) ? list.join('; ') : '';
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
  
    // Utility function to safely format lists
    const formatList = (list) => {
      // Only join if the list is an array, otherwise return as is
      return Array.isArray(list) ? list.join('; ') : list || '';
    };
  
    const pacienteFormatted = {
      ...datosPaciente,
      // Safely format lists or retain current string values
      notificacionRiesgo: formatList(datosPaciente.notificacionRiesgo),
      hipertensionArterial: formatList(datosPaciente.hipertensionArterial),
      medicacionPrescripcion: formatList(datosPaciente.medicacionPrescripcion),
      medicacionDispensa: formatList(datosPaciente.medicacionDispensa),
      tabaquismo: formatList(datosPaciente.tabaquismo),
      laboratorio: formatList(datosPaciente.laboratorio),
      consulta: formatList(datosPaciente.consulta), // Retain existing value if already a string
      practica: formatList(datosPaciente.practica), // Retain existing value if already a string
    };
  
    try {
      await axios.put(`https://rcvcba-production.up.railway.app/api/pacientes/${id}`, pacienteFormatted, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/estadisticas');
    } catch (error) {
      setError('Error al actualizar el paciente.');
      console.error('Error al actualizar el paciente:', error);
    }
  };
  
  

  if (loading) return <p>Cargando...</p>;

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
                onClick={() => setDatosPaciente(prev => ({ ...prev, renal: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, genero: option }))}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Diabetes */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Diabetes:</label>
          <div className="flex space-x-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDatosPaciente(prev => ({ ...prev, diabetes: option }))}
                className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, fumador: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, exfumador: option }))}
                className={`p-2 border rounded-md ${datosPaciente.exfumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Hipertenso */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Es hipertenso?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDatosPaciente(prev => ({ ...prev, hipertenso: option }))}
                className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, infarto: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, acv: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, renal: option }))}
                className={`p-2 border rounded-md ${datosPaciente.renal === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
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
                value={nivelColesterolConocido ? datosPaciente.colesterol : ''} // Muestra el valor de colesterol si se conoce
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, colesterol: e.target.value }))}
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

        {/* Notificación de Riesgo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notificación de Riesgo</label>
          {listaNotificacionRiesgo.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="notificacionRiesgo"
                value={item}
                checked={datosPaciente.notificacionRiesgo.includes(item)}
                onChange={manejarCheckboxChange}
                className="mr-2"
              />
              {item}
            </div>
          ))}
        </div>

        {/* Consulta */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Consulta</label>
          {listaConsulta.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="consulta"
                value={item}
                checked={datosPaciente.consulta.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Practica */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Práctica</label>
          {listaPractica.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="practica"
                value={item}
                checked={datosPaciente.practica.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>
        
        {/* Hipertensión Arterial */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hipertensión Arterial</label>
          {listaHipertensionArterial.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="hipertensionArterial"
                value={item}
                checked={datosPaciente.hipertensionArterial.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Medicación Prescripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Medicacion Prescripcion</label>
          {listaMedicacionPrescripcion.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="medicacionPrescripcion"
                value={item}
                checked={datosPaciente.medicacionPrescripcion.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Medicación Dispensa */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Medicacion Dispensa</label>
          {listaMedicacionDispensa.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="medicacionDispensa"
                value={item}
                checked={datosPaciente.medicacionDispensa.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Tabaquismo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tabaquismo</label>
          {listaTabaquismo.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="tabaquismo"
                value={item}
                checked={datosPaciente.tabaquismo.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Laboratorio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Laboratorio</label>
          {listaLaboratorio.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="laboratorio"
                value={item}
                checked={datosPaciente.laboratorio.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>


        {/* Doctor */}
        <div className="flex flex-col mt-4">
          <div className="flex justify-end space-x-2">
            {['doctor1', 'doctor2', 'doctor3'].map(doctor => (
              <button
                key={doctor}
                type="button"
                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setDatosPaciente(prev => ({ ...prev, doctor }))}
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

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default EditarPaciente;
