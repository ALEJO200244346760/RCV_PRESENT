import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Asegúrate de que Axios esté configurado correctamente

const FormularioPaciente = ({ roles }) => {
    const isCardiologo = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGO');
    const isCardiologia = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGIA');
    const isNurse = Array.isArray(roles) && roles.includes('ENFERMERO');

    const [dni, setDni] = useState('');
    const [datosEnfermeria, setDatosEnfermeria] = useState(null);
    const [datosCardiologia, setDatosCardiologia] = useState({});
    const [datosPaciente, setDatosPaciente] = useState({});
    const [esPacienteNuevo, setEsPacienteNuevo] = useState(null);
    const [error, setError] = useState(null);

    // Consultar datos de Enfermería por DNI
    const consultarEnfermeria = async (dni) => {
        try {
            const respuesta = await axios.get(`/api/enfermeria/${dni}`);
            if (respuesta.status === 204) {  // Verificamos si la respuesta está vacía
                setEsPacienteNuevo(true);  // Paciente nuevo, no tiene datos de enfermería
            } else {
                setDatosEnfermeria(respuesta.data);  // Se encontró el paciente, cargamos los datos
                setEsPacienteNuevo(false);  // El paciente ya tiene datos de enfermería
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };
    

    // Guardar los datos de Enfermería
    const guardarDatosEnfermeria = async () => {
        try {
            const datos = {
                dni: dni,
                genero: datosCardiologia.genero,
                peso: datosCardiologia.peso,
                talla: datosCardiologia.talla,
                tensionArterial: datosCardiologia.tensionArterial || '',
            };
    
            const url = esPacienteNuevo ? "/api/enfermeria" : `/api/enfermeria/${dni}`;
            const metodo = esPacienteNuevo ? "POST" : "PUT";

            await axios({
                method: metodo,
                url,
                data: datos,
            });
    
            alert("Datos de enfermería guardados con éxito");
        } catch (err) {
            console.error("Error en la solicitud:", err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };
    

    // Guardar todos los datos en Pacientemenor (Final)
    const guardarPaciente = async () => {
        try {
    
            const paciente = {
                dni,
                genero: datosEnfermeria.genero,
                peso: datosEnfermeria.peso,
                talla: datosEnfermeria.talla,
                tensionArterial: datosEnfermeria.tensionArterial,
                hipertenso: datosCardiologia.hipertenso,
                diabetes: datosCardiologia.diabetes,
                asma: datosPaciente.asma,
                fuma: datosPaciente.fuma,
                antecedentesSoplo: datosPaciente.antecedentesSoplo,
                arritmias: datosPaciente.arritmias,
                enfermedadCronica: datosPaciente.enfermedadCronica,
                cirugiaPrevia: datosPaciente.cirugiaPrevia,
                alergias: datosPaciente.alergias,
                antecedentesFamiliaresMarcapaso: datosPaciente.antecedentesFamiliaresMarcapaso,
                desfibriladores: datosPaciente.desfibriladores,
                tensionArterialMaxima: datosPaciente.tensionArterialMaxima,
                tensionArterialMinima: datosPaciente.tensionArterialMinima,
                electrocardiograma: datosPaciente.electrocardiograma
            };
    
            const response = await axios.post('/api/pacientemenor', paciente);
            alert('Paciente guardado exitosamente');
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };
    

    // Consultar al cambiar el DNI
    useEffect(() => {
        if (dni.length === 8) {
            consultarEnfermeria(dni);
        }
    }, [dni]);

    // Manejo de cambios en los campos de los formularios
    const manejarCambioEnfermeria = (e) => {
        const { name, value } = e.target;
        setDatosCardiologia({
            ...datosCardiologia,
            [name]: value,
        });
    };

    const manejarCambioCardiologia = (e) => {
        const { name, value } = e.target;
        setDatosCardiologia({
            ...datosCardiologia,
            [name]: value,
        });
    };   

    // Manejo del submit de los formularios
    const manejarSubmitEnfermeria = (e) => {
        e.preventDefault();
        guardarDatosEnfermeria();
    };

    const manejarSubmitCardiologia = (e) => {
        e.preventDefault();
        guardarPaciente();
    };

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setDatosPaciente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            {/* DNI */}
            <div className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-700">DNI:</label>
                <input
                    type="text"
                    name="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength="8"
                />
            </div>
    
            {/* Si es un paciente nuevo, mostramos el formulario de enfermería */}
            {esPacienteNuevo === true && (
                        <form onSubmit={manejarSubmitEnfermeria} className="w-full space-y-6">
                            <h2 className="text-xl font-bold mb-4">Datos de Enfermería</h2>
                            
                            {/* Género */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Género:</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, genero: 'Masculino' })}
                                        className={`btn ${datosCardiologia.genero === 'Masculino' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Masculino
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, genero: 'Femenino' })}
                                        className={`btn ${datosCardiologia.genero === 'Femenino' ? 'bg-pink-500' : 'bg-gray-200'}`}
                                    >
                                        Femenino
                                    </button>
                                </div>
                            </div>

                            {/* Peso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Peso:</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={datosCardiologia.peso || ''}
                                    onChange={manejarCambioEnfermeria}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Talla */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Talla:</label>
                                <input
                                    type="number"
                                    name="talla"
                                    value={datosCardiologia.talla || ''}
                                    onChange={manejarCambioEnfermeria}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Tensión Arterial (Opcional) */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial (Opcional):</label>
                                <input
                                    type="text"
                                    name="tensionArterial"
                                    value={datosCardiologia.tensionArterial || ''}
                                    onChange={manejarCambioEnfermeria}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 transition duration-200 mt-4"
                            >
                                Guardar Datos de Enfermería
                            </button>
                        </form>
            )}
    
            {/* Si el paciente tiene datos de enfermería, mostramos el formulario de cardiología */}
            {(esPacienteNuevo === false) && datosEnfermeria && (
                        <form onSubmit={manejarSubmitCardiologia} className="w-full space-y-6">
                            <h2 className="text-xl font-bold mb-4">Datos de Cardiología</h2>
    
                            {/* Mostrar datos de Enfermería */}
                            {/* Género */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Género:</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosEnfermeria({ ...datosEnfermeria, genero: 'Masculino' })}
                                        className={`btn ${datosEnfermeria.genero === 'Masculino' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Masculino
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosEnfermeria({ ...datosEnfermeria, genero: 'Femenino' })}
                                        className={`btn ${datosEnfermeria.genero === 'Femenino' ? 'bg-pink-500' : 'bg-gray-200'}`}
                                    >
                                        Femenino
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Peso:</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={datosEnfermeria.peso || ''}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Talla:</label>
                                <input
                                    type="number"
                                    name="talla"
                                    value={datosEnfermeria.talla || ''}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial:</label>
                                <input
                                    type="text"
                                    name="tensionArterial"
                                    value={datosEnfermeria.tensionArterial || ''}
                                    readOnly
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            {/* Preguntas de Cardiología */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Hipertenso?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'Sí' })}
                                        className={`btn ${datosCardiologia.hipertenso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'No' })}
                                        className={`btn ${datosCardiologia.hipertenso === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Diabetes?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'Sí' })}
                                        className={`btn ${datosCardiologia.diabetes === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'No' })}
                                        className={`btn ${datosCardiologia.diabetes === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Asma */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene asma?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'Sí' })}
                                        className={`btn ${datosPaciente.asma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'No' })}
                                        className={`btn ${datosPaciente.asma === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Alergias */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene Alergias?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, alergias: 'Sí' })}
                                        className={`btn ${datosPaciente.alergias === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, alergias: 'No' })}
                                        className={`btn ${datosPaciente.alergias === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Tóxicos */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tóxicos?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, fuma: 'Sí' })}
                                        className={`btn ${datosPaciente.fuma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, fuma: 'No' })}
                                        className={`btn ${datosPaciente.fuma === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Antecedentes de soplo */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene antecedentes de soplo?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesSoplo: 'Sí' })}
                                        className={`btn ${datosPaciente.antecedentesSoplo === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesSoplo: 'No' })}
                                        className={`btn ${datosPaciente.antecedentesSoplo === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Arritmias */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene arritmias?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, arritmias: 'Sí' })}
                                        className={`btn ${datosPaciente.arritmias === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, arritmias: 'No' })}
                                        className={`btn ${datosPaciente.arritmias === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Enfermedad Crónica */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad crónica?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, enfermedadCronica: 'Sí' })}
                                        className={`btn ${datosPaciente.enfermedadCronica === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, enfermedadCronica: 'No' })}
                                        className={`btn ${datosPaciente.enfermedadCronica === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Cirugía Previa */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Ha tenido cirugía previa?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'Sí' })}
                                        className={`btn ${datosPaciente.cirugiaPrevia === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'No' })}
                                        className={`btn ${datosPaciente.cirugiaPrevia === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Antecedentes familiares de marcapaso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene antecedentes familiares con marcapaso o cardiodesfibrilador?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesFamiliaresMarcapaso: 'Sí' })}
                                        className={`btn ${datosPaciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesFamiliaresMarcapaso: 'No' })}
                                        className={`btn ${datosPaciente.antecedentesFamiliaresMarcapaso === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Desfibriladores */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene desfibriladores?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, desfibriladores: 'Sí' })}
                                        className={`btn ${datosPaciente.desfibriladores === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, desfibriladores: 'No' })}
                                        className={`btn ${datosPaciente.desfibriladores === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Tensión Arterial Máxima */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial Máxima:</label>
                                <input
                                    type="number"
                                    name="tensionArterialMaxima"
                                    value={datosPaciente.tensionArterialMaxima || ''}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            {/* Tensión Arterial Mínima */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial Mínima:</label>
                                <input
                                    type="number"
                                    name="tensionArterialMinima"
                                    value={datosPaciente.tensionArterialMinima || ''}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            {/* Electrocardiograma */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Electrocardiograma:</label>
                                <div className="mt-2 flex space-x-4">
                                    <button
                                        type="button"
                                        className={`p-2 border rounded-md ${datosPaciente.electrocardiograma === 'Normal' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => manejarCambio({ target: { name: 'electrocardiograma', value: 'Normal' } })}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-2 border rounded-md ${datosPaciente.electrocardiograma === 'Anormal' ? 'bg-red-500 text-white' : 'bg-white'}`}
                                        onClick={() => manejarCambio({ target: { name: 'electrocardiograma', value: 'Anormal' } })}
                                    >
                                        Anormal
                                    </button>
                                </div>
                            </div>
    
                            <button
                                type="submit"
                                className="btn bg-green-500 text-white hover:bg-green-600 rounded-lg px-4 py-2 transition duration-200 mt-4"
                            >
                                Guardar Datos
                            </button>
                        </form>
                    )}
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );    
};

export default FormularioPaciente;