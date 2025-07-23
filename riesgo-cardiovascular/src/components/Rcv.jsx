import React, { useState } from 'react';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { Advertencia, DatosPacienteInicial, obtenerColorRiesgo, obtenerTextoRiesgo } from './ConstFormulario';
import axiosInstance from '../axiosConfig';

const Formulario = () => {
    const [datosPaciente, setDatosPaciente] = useState(DatosPacienteInicial);
    const [nivelColesterolConocido, setNivelColesterolConocido] = useState(null);
    const [nivelRiesgo, setNivelRiesgo] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalAdvertencia, setModalAdvertencia] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente({
            ...datosPaciente,
            [name]: value,
        });
        if (name === 'edad') {
            validarCampos(value);
        }
        if (name === 'presionArterial') {
            validarCampos(value);
        }
        if (name === 'colesterol') {
            validarCampos(value);
        }
    };

    const manejarSeleccionColesterol = (value) => {
        setNivelColesterolConocido(value === 'si');
        setDatosPaciente({
            ...datosPaciente,
            colesterol: value === 'no' ? 'No' : datosPaciente.colesterol
        });
    };

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

    const validarCampos = () => {
        const {
            edad,
            genero,
            diabetes,
            fumador,
            presionArterial,
            colesterol,
            hipertenso,
            acv,
            renal,
            infarto,
        } = datosPaciente;

        if (!edad || !genero || !diabetes || !fumador || !presionArterial || !hipertenso || !acv || !renal || !infarto) {
            setError('Por favor, complete todos los campos obligatorios.');
            return false;
        }
    
        if (!edad || edad < 1 || edad > 120) {
            setError('Ingrese bien la edad.');
            return false;
        }
        if (!genero) {
            setError('Por favor, seleccione un género.');
            return false;
        }
        if (!diabetes) {
            setError('Por favor, indique si tiene diabetes.');
            return false;
        }
        if (!fumador) {
            setError('Por favor, indique si es fumador.');
            return false;
        }
        if (!presionArterial || presionArterial < 80 || presionArterial > 250) {
            setError('La presión arterial debe estar entre 80 y 250.');
            return false;
        }
        if (nivelColesterolConocido && (colesterol < 150 || colesterol > 400) && colesterol !== 'No') {
            setError('El colesterol debe estar entre 150 y 400, o "No".');
            return false;
        }
        if (!hipertenso) {
            setError('Por favor, indique si es hipertenso.');
            return false;
        }
        if (!acv) {
            setError('Por favor, indique si ha tenido un ACV.');
            return false;
        }
        if (!renal) {
            setError('Por favor, indique si tiene enfermedad renal crónica.');
            return false;
        }
        if (!infarto) {
            setError('Por favor, indique si ha tenido un infarto.');
            return false;
        }
    
        setError(''); // Limpiar el error si todas las validaciones pasan
        return true;
    };

    const calcularRiesgo = async () => {
        
        const esValido = validarCampos(); // Llama a la función de validación
        if (!esValido) {
            setModalAdvertencia(error);
            setMostrarModal(true);
            return;
        }
    
        if (nivelColesterolConocido && !datosPaciente.colesterol) {
            setModalAdvertencia('Debe ingresar el nivel de colesterol.');
            setMostrarModal(true);
            return;
        }
    
        const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = datosPaciente;
    
        // Verificar si infarto o acv son "Sí"
        if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
            setNivelRiesgo(">20% <30% Alto");
            setMostrarModal(true);
            return;
        }
    
        // Ajustar la edad y la presión arterial
        const edadAjustada = ajustarEdad(parseInt(edad, 10));
        const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));
    
        // Calcular el riesgo
        const nivelRiesgo = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
        setNivelRiesgo(nivelRiesgo);
        setMostrarModal(true);
    
    }; 

    const cerrarModal = () => {
        setMostrarModal(false); // Cierra el modal principal
        setModalAdvertencia(null); // Resetea la advertencia
    };

    const abrirModalAdvertencia = (nivel) => {
        setModalAdvertencia(Advertencia[nivel]);
    };
    
    const renderRiesgoGrid = (riesgo) => {
        const riesgos = [
            '<10% Bajo',
            '>10% <20% Moderado',
            '>20% <30% Alto',
            '>30% <40% Muy Alto',
            '>40% Crítico'
        ];
        return (
            <div className="grid grid-cols-12 gap-2">
                {riesgos.map((nivel, index) => (
                    <React.Fragment key={nivel}>
                        <div className={`col-span-4 ${obtenerColorRiesgo(nivel)}`}></div>
                        <div
                            className={`col-span-8 ${riesgo === nivel ? obtenerColorRiesgo(nivel) : 'bg-gray-300'} p-2 cursor-pointer`}
                            onClick={() => abrirModalAdvertencia(nivel)}
                        >
                            <span className={`${riesgo === nivel ? 'text-white' : 'text-gray-600'}`}>{obtenerTextoRiesgo(nivel)}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Calculadora de Riesgo Cardiovascular</h1>
            <form className="w-full space-y-6">
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

                {/* Género */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Género:</label>
                    <div className="flex space-x-2">
                        {['masculino', 'femenino'].map(option => (
                            <button
                                key={option}
                                type="button"
                                className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, genero: option }))}
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
                                onClick={() => setDatosPaciente({ ...datosPaciente, diabetes: option })}
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
                                onClick={() => setDatosPaciente({ ...datosPaciente, fumador: option })}
                                className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Presión Arterial */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Presión Arterial sistólica:</label>
                    <input
                        type="number"
                        name="presionArterial"
                        value={datosPaciente.presionArterial}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
                    />
                </div>

                {/* Hipertenso */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es hipertenso?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, hipertenso: option })}
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
                                onClick={() => setDatosPaciente({ ...datosPaciente, infarto: option })}
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
                                onClick={() => setDatosPaciente({ ...datosPaciente, acv: option })}
                                className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Enfermedad Renal Cronica */}
                <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, renal : option })}
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
                    {nivelColesterolConocido === true && (
                        <input
                            type="number"
                            name="colesterol"
                            value={datosPaciente.colesterol === 'No' ? '' : datosPaciente.colesterol}
                            onChange={manejarCambio}
                            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            style={{ appearance: 'none' }}
                        />
                    )}
                </div>
                <button
                    type="button"
                    onClick={calcularRiesgo}
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                    Calcular Riesgo
                </button>
            </form>

            {/* Modal Resultados */}
            {mostrarModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
                
                <p><strong>Edad:</strong> {datosPaciente.edad}</p>
                <p><strong>Género:</strong> {datosPaciente.genero}</p>
                <p><strong>Diabetes:</strong> {datosPaciente.diabetes}</p>
                <p><strong>Fumador:</strong> {datosPaciente.fumador}</p>
                <p><strong>Presión Arterial sistólica:</strong> {datosPaciente.presionArterial}</p>
                <p><strong>Colesterol:</strong> {datosPaciente.colesterol || 'No especificado'}</p>
                <p><strong>Fecha de Registro:</strong> {datosPaciente.fechaRegistro}</p>
                <p><strong>Hipertenso:</strong> {datosPaciente.hipertenso}</p>
                <p><strong>Infarto:</strong> {datosPaciente.infarto}</p>
                <p><strong>ACV:</strong> {datosPaciente.acv}</p>
                <p><strong>Nivel de Riesgo:</strong></p>
                <div className="mb-4">
                    {renderRiesgoGrid(nivelRiesgo)}
                </div>

                <button
                    onClick={cerrarModal}
                    className="absolute top-4 right-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Cerrar
                </button>
                </div>
            </div>
            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md">
                    {mensajeExito}
                </div>
            )}

            {/* Modal Advertencia */}
            {modalAdvertencia && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">Recomendaciones</h2>
                        <div className="overflow-y-auto max-h-80">
                            <pre className="whitespace-pre-wrap text-left">{modalAdvertencia}</pre>
                        </div>
                        <button
                            onClick={cerrarModal}
                            className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Formulario;
