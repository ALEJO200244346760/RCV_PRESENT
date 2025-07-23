import React, { useEffect, useState } from 'react';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { Advertencia, DatosPacienteInicial, obtenerColorRiesgo, obtenerTextoRiesgo,listaNotificacionRiesgo, listaConsulta, listaPractica, listaHipertensionArterial, listaMedicacionPrescripcion, listaMedicacionDispensa, listaTabaquismo, listaLaboratorio } from './ConstFormulario';
import { getLocations } from '../services/userService';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

// Lista de medicamentos para la hipertensión
const listaMedicamentosHipertension = [
    "Enalapril 10 mg cada 12 Hs",
    "Enalapril 5 mg cada 12 Hs",
    "Losartan 25 mg cada 12 Hs",
    "Losartan 50 mg cada 12 Hs",
    "Amlodipina 10 mg cada12 Hs",
    "Amlodipina 5 mg cada12 Hs",
    "Hidroclorotiazida 25 mg cada 12 Hs",
    "Furosemida 20 mg cada 12 Hs",
    "Valsartán 160 mg cada 12 Hs",
    "Valsartán 80 mg cada 12 Hs",
    "Carvedilol 25 mg cada 12 Hs",
    "Carvedilol 12,5 mg cada 12 Hs",
    "Bisoprolol 5 mg cada 12 Hs",
    "Bisoprolol 2,5 mg cada 12 Hs",
    "Nebivolol 10 mg por día",
    "Nebivolol 5 mg por día",
    "Espironolactona 25 mg por día",
    "Otros"
];

const listaMedicamentosDiabetes = [
    "Metformina 500 mg dos por dia", "Metformina 850 mg dos por dia",
    "Metformina 1000 mg dos por dia", "Otra"
];

const listaMedicamentosColesterol = [
    "Atorvastatina 10 mg uno por día", "Atorvastatina 20 mg uno por día", "Atorvastatina 40 mg uno por día",
    "Atorvastatina 80 mg uno por día", "Rosuvastatina 5 mg uno por día", "Rosuvastatina 10 mg uno por día",
    "Rosuvastatina 20 mg uno por día", "Rosuastatina 40 mg uno por día", "Otra"
];

const Formulario = () => {
    // Añadimos los nuevos campos al estado inicial del paciente
    const [datosPaciente, setDatosPaciente] = useState({
        ...DatosPacienteInicial,
        numeroGestas: '',
        fum: '',
        metodoAnticonceptivo: '',
        trastornosHipertensivos: '',
        diabetesGestacional: '',
        sop: '', // Síndrome de Ovario Poliquístico
        medicamentosHipertension: '', // Para almacenar la lista de medicamentos seleccionados
        medicamentosDiabetes: '',
        medicamentosColesterol: '',
    });
    const [nivelColesterolConocido, setNivelColesterolConocido] = useState(null);
    const [nivelRiesgo, setNivelRiesgo] = useState(null);
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalAdvertencia, setModalAdvertencia] = useState(null);
    const [mostrarModalMedicamentos, setMostrarModalMedicamentos] = useState(false);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState({
        notificacionRiesgo: [],
        consulta: [],
        practica: [],
        hipertensionArterial: [],
        medicacionPrescripcion: [],
        medicacionDispensa: [],
        tabaquismo: [],
        laboratorio: [],
    });
    // Nuevo estado para la selección de medicamentos de hipertensión
    const [medicamentosHipertensionSeleccionados, setMedicamentosHipertensionSeleccionados] = useState([]);
    const [medicamentosDiabetesSeleccionados, setMedicamentosDiabetesSeleccionados] = useState([]);
    const [medicamentosColesterolSeleccionados, setMedicamentosColesterolSeleccionados] = useState([]);
    const [mensajeExito, setMensajeExito] = useState('');
    const [ubicaciones, setUbicaciones] = useState([]);
    const { user, roles } = useAuth(); // Obtiene el usuario y roles del contexto
    const [mostrarRenal, setMostrarRenal] = useState(false);
    const [creatinina, setCreatinina] = useState('');
    const [tfg, setTfg] = useState(null);

    // Variable para el máximo de la fecha (día actual)
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!creatinina || isNaN(creatinina) || !datosPaciente.edad || !datosPaciente.genero) {
            setTfg(null);
            return;
        }

        const edad = Number(datosPaciente.edad);
        const cr = parseFloat(creatinina);
        let resultado = null;

        if (datosPaciente.genero === 'femenino') {
            if (cr <= 0.7) {
                resultado = 144 * Math.pow(cr / 0.7, -0.329) * Math.pow(0.993, edad);
            } else {
                resultado = 144 * Math.pow(cr / 0.7, -1.209) * Math.pow(0.993, edad);
            }
        } else {
            if (cr <= 0.9) {
                resultado = 141 * Math.pow(cr / 0.9, -0.411) * Math.pow(0.993, edad);
            } else {
                resultado = 141 * Math.pow(cr / 0.9, -1.209) * Math.pow(0.993, edad);
            }
        }

        setTfg(resultado);
    }, [creatinina, datosPaciente]);

        
    useEffect(() => {
        const fetchUbicaciones = async () => {
            const ubicacionesData = await getLocations();
            setUbicaciones(ubicacionesData);
        };

        fetchUbicaciones();
    }, []);

    // Efecto para actualizar el campo de texto en datosPaciente cuando cambian los checkboxes
    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosHipertension: medicamentosHipertensionSeleccionados.join('; ')
        }));
    }, [medicamentosHipertensionSeleccionados]);
    
    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosDiabetes: medicamentosDiabetesSeleccionados.join('; ')
        }));
    }, [medicamentosDiabetesSeleccionados]);

    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosColesterol: medicamentosColesterolSeleccionados.join('; ')
        }));
    }, [medicamentosColesterolSeleccionados]);


    const validarCuil = (cuil) => {
        const soloNumeros = /^\d+$/; // Expresión regular para solo números

        if (cuil.length > 0 && cuil.length < 7) {
            setError('El CUIL o DNI debe tener al menos 7 dígitos y contener solo números.');
        } else if (cuil.length >= 7 && !soloNumeros.test(cuil)) {
            setError('El CUIL o DNI debe contener solo números.');
        } else {
            setError('');
        }
    };

    useEffect(() => {
        // Asignar la ubicación del usuario al estado inicial si es un usuario normal
        if (user && user.ubicacion) {
            setDatosPaciente(prevState => ({
                ...prevState,
                ubicacion: user.ubicacion.nombre // Asegúrate de que esté usando el nombre correcto
            }));
        }
    }, [user]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente({
            ...datosPaciente,
            [name]: value,
        });
        if (name === 'cuil') {
            validarCuil(value);
        }
    };

    const handleHipertensionMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosHipertensionSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const handleDiabetesMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosDiabetesSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const handleColesterolMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosColesterolSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const manejarSeleccionColesterol = (value) => {
        setNivelColesterolConocido(value === 'si');
        setDatosPaciente({
            ...datosPaciente,
            colesterol: value === 'no' ? 'No' : datosPaciente.colesterol
        });
    };

    const calcularIMC = () => {
        const peso = parseFloat(datosPaciente.peso);
        const tallaCm = parseFloat(datosPaciente.talla);
        if (peso && tallaCm) {
            const tallaM = tallaCm / 100; // Convertir centímetros a metros
            const imc = peso / (tallaM * tallaM);
            return imc.toFixed(2);
        }
        return '';
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
            cuil,
            diabetes,
            fumador,
            exfumador,
            presionArterial,
            colesterol,
            infarto,
            acv,
            renal,
            pulmonar
        } = datosPaciente;
    
        if (!edad || !genero || !cuil || !diabetes || !fumador || !exfumador || !presionArterial || !colesterol || !infarto || !acv || !renal || !pulmonar) {
            setError('Por favor, complete todos los campos obligatorios.');
            return false;
        }
        if (cuil.length < 7) {
            setError('El CUIL debe tener al menos 7 dígitos.');
            return false;
        }
        if (edad < 1 || edad > 120) {
            setError('La edad debe estar entre 1 y 120 años.');
            return false;
        }
        if (presionArterial < 50 || presionArterial > 250) {
            setError('La tensión arterial debe estar entre 60 y 250.');
            return false;
        }
        if (colesterol !== 'No' && (colesterol < 150 || colesterol > 400)) {
            setError('El colesterol debe estar entre 150 y 400, o ser "No".');
            return false;
        }
    
        setError('');
        return true;
    };

    const calcularRiesgo = async () => {
        if (!validarCampos()) {
            setModalAdvertencia('Todos los campos deben estar completos.');
            setMostrarModal(true);
            return;
        }
    
        if (nivelColesterolConocido && !datosPaciente.colesterol) {
            setModalAdvertencia('Debe ingresar el nivel de colesterol.');
            setMostrarModal(true);
            return;
        }
    
        const { edad, genero, diabetes, fumador, exfumador, presionArterial, colesterol, enfermedad, infarto, acv, renal } = datosPaciente;
    
        if (enfermedad === "Sí" ||infarto === "Sí" || acv === "Sí" || renal === "Sí") {
            setNivelRiesgo(">20% <30% Alto");
            setMostrarModal(true);
            return;
        }
    
        const edadAjustada = ajustarEdad(parseInt(edad, 10));
        const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));
        const imc = calcularIMC();
        setDatosPaciente((prevDatos) => ({ ...prevDatos, imc }));
    
        const riesgoCalculado = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
        setNivelRiesgo(riesgoCalculado);
        setMostrarModal(true);
    };    

    const guardarPaciente = async () => {
        try {
            await axiosInstance.post('/api/pacientes', {
                ...datosPaciente,
                nivelRiesgo,
            });
    
            console.log('Datos guardados exitosamente');
            setMensajeExito('Paciente guardado con éxito');
            setTimeout(() => setMensajeExito(''), 3000);
            setTimeout(() => {
                window.location.reload(); // Recargar la página para un nuevo formulario
            }, 1000);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            setModalAdvertencia('Ocurrió un error al guardar los datos. Por favor, vuelva a cargar la página.');
            setMostrarModal(true);
        }
    };
    
    const toggleModalMedicamentos = () => {
        setMostrarModalMedicamentos(!mostrarModalMedicamentos);
    };

    const handleMedicamentoChange = (categoria, evento) => {
        const { value, checked } = evento.target;
        setMedicamentosSeleccionados((prevSeleccionados) => {
            const nuevosSeleccionados = checked
                ? [...prevSeleccionados[categoria], value]
                : prevSeleccionados[categoria].filter((med) => med !== value);
            return {
                ...prevSeleccionados,
                [categoria]: nuevosSeleccionados,
            };
        });
    };

    const guardarMedicamentos = () => {
        const nuevosDatosPaciente = {
            ...datosPaciente,
            notificacionRiesgo: medicamentosSeleccionados.notificacionRiesgo.join('; '),
            consulta: medicamentosSeleccionados.consulta.join('; '),
            practica: medicamentosSeleccionados.practica.join('; '),
            hipertensionArterial: medicamentosSeleccionados.hipertensionArterial.join('; '),
            medicacionPrescripcion: medicamentosSeleccionados.medicacionPrescripcion.join('; '),
            medicacionDispensa: medicamentosSeleccionados.medicacionDispensa.join('; '),
            tabaquismo: medicamentosSeleccionados.tabaquismo.join('; '),
            laboratorio: medicamentosSeleccionados.laboratorio.join('; '),
        };
        setDatosPaciente(nuevosDatosPaciente);
        setMensajeExito('Medicamentos guardados con éxito');
        toggleModalMedicamentos(); // Cerrar el modal
    };
    
    const cerrarModal = () => {
        setMostrarModal(false);
        setMostrarModalMedicamentos(false);
        setModalAdvertencia(null);
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
                {riesgos.map((nivel) => (
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
            <form className="w-full space-y-6">
                <h1 className="text-3xl font-bold mb-6">Formulario de Evaluación de Riesgo Cardiovascular</h1>
                
                {/* Cuil */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">DNI:</label>
                    <input
                        type="text"
                        name="cuil"
                        value={datosPaciente.cuil}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
                    />
                </div>

                {/* Telefono */}
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

                {/* CAMPOS CONDICIONALES PARA GÉNERO FEMENINO */}
                {datosPaciente.genero === 'femenino' && (
                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 space-y-4 rounded-r-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Información Adicional</h3>
                        
                        {/* Numero de gestas */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Número de gestas:</label>
                            <input
                                type="number"
                                name="numeroGestas"
                                value={datosPaciente.numeroGestas}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        {/* Fecha de ultima menstruacion */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Fecha de última menstruación:</label>
                            <input
                                type="date"
                                name="fum"
                                value={datosPaciente.fum}
                                onChange={manejarCambio}
                                max={today} // Limita la fecha al día de hoy o anteriores
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Metodo anticonceptivo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Método anticonceptivo:</label>
                            <input
                                type="text"
                                name="metodoAnticonceptivo"
                                value={datosPaciente.metodoAnticonceptivo}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Trastornos hipertensivos del embarazo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Trastornos hipertensivos del embarazo:</label>
                            <input
                                type="text"
                                name="trastornosHipertensivos"
                                value={datosPaciente.trastornosHipertensivos}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Diabetes gestacional */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Diabetes gestacional:</label>
                            <input
                                type="text"
                                name="diabetesGestacional"
                                value={datosPaciente.diabetesGestacional}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Síndrome de Ovario Poliquístico */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Síndrome de Ovario Poliquístico:</label>
                            <input
                                type="text"
                                name="sop"
                                value={datosPaciente.sop}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                )}
                {/* FIN DE CAMPOS CONDICIONALES */}


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

                {/* Hipertenso */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para la hipertensión arterial?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, hipertenso: option });
                                    // Si la respuesta es No, limpiar la lista de seleccionados
                                    if (option === 'No') {
                                        setMedicamentosHipertensionSeleccionados([]);
                                    }
                                }}
                                className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    
                    {/* LISTA CONDICIONAL DE MEDICAMENTOS PARA HIPERTENSIÓN */}
                    {datosPaciente.hipertenso === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosHipertension.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-ht-${index}`}
                                            value={medicamento}
                                            onChange={handleHipertensionMedChange}
                                            checked={medicamentosHipertensionSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-ht-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Diabetes */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para Diabetes?</label>
                    <div className="flex space-x-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, diabetes: option });
                                    if (option === 'No') {
                                        setMedicamentosDiabetesSeleccionados([]);
                                    }
                                }}
                                className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                    {datosPaciente.diabetes === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosDiabetes.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-db-${index}`}
                                            value={medicamento}
                                            onChange={handleDiabetesMedChange}
                                            checked={medicamentosDiabetesSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-db-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Medicaión colesterol */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para el colesterol?</label>
                    <div className="flex space-x-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, medicolesterol: option });
                                    if (option === 'No') {
                                        setMedicamentosColesterolSeleccionados([]);
                                    }
                                }}
                                className={`p-2 border rounded-md ${datosPaciente.medicolesterol === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                    {datosPaciente.medicolesterol === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosColesterol.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-col-${index}`}
                                            value={medicamento}
                                            onChange={handleColesterolMedChange}
                                            checked={medicamentosColesterolSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-col-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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

                {/* Aspirina */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma aspirina o anticuagulantes?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, aspirina: option })}
                                className={`p-2 border rounded-md ${datosPaciente.aspirina === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
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

                {/* exFumador */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es exfumador?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, exfumador: option })}
                                className={`p-2 border rounded-md ${datosPaciente.exfumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enfermedad cardiovascular */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Presenta enfermedad cardiovascular documentada?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, enfermedad: option })}
                                className={`p-2 border rounded-md ${datosPaciente.enfermedad === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
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

                {/* Enfermedad Pulmonar */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Pulmonar?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, pulmonar : option })}
                        className={`p-2 border rounded-md ${datosPaciente.pulmonar === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
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
                        style={{ appearance: 'none' }}
                    />
                </div>

                {/* Tension Arterial Minima */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">TA Min.:</label>
                    <input
                        type="number"
                        name="taMin"
                        value={datosPaciente.taMin}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
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

                {/* Doctor */}
                <div className="flex flex-col mt-4">
                    <div className="flex justify-end space-x-2">
                        {['doctor1', 'doctor2', 'doctor3'].map(doctor => (
                            <button
                                key={doctor}
                                type="button"
                                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, doctor }))}
                            >
                                {doctor.charAt(0).toUpperCase() + doctor.slice(1)}
                            </button>
                        ))}
                    </div>
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
            {mostrarModal && !modalAdvertencia && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <button onClick={toggleModalMedicamentos} className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                                SIGIPSA
                            </button>
                            <button onClick={guardarPaciente} className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                                Guardar Paciente
                            </button>
                        </div>
                        <p><strong>DNI:</strong> {datosPaciente.cuil}</p>
                        <p><strong>Edad:</strong> {datosPaciente.edad}</p>
                        <p><strong>Género:</strong> {datosPaciente.genero}</p>

                        {/* Mostrar datos adicionales si es femenino */}
                        {datosPaciente.genero === 'femenino' && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Número de gestas:</strong> {datosPaciente.numeroGestas || 'No especificado'}</p>
                                <p><strong>Fecha de última menstruación:</strong> {datosPaciente.fum || 'No especificada'}</p>
                                <p><strong>Método anticonceptivo:</strong> {datosPaciente.metodoAnticonceptivo || 'No especificado'}</p>
                                <p><strong>Trastornos hipertensivos del embarazo:</strong> {datosPaciente.trastornosHipertensivos || 'No especificado'}</p>
                                <p><strong>Diabetes gestacional:</strong> {datosPaciente.diabetesGestacional || 'No especificado'}</p>
                                <p><strong>Síndrome de Ovario Poliquístico:</strong> {datosPaciente.sop || 'No especificado'}</p>
                            </div>
                        )}
                        
                        {/* Mostrar medicamentos para hipertensión si aplica */}
                        {datosPaciente.hipertenso === 'Sí' && datosPaciente.medicamentosHipertension && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Hipertensión:</strong> {datosPaciente.medicamentosHipertension}</p>
                            </div>
                        )}
                        
                        {datosPaciente.diabetes === 'Sí' && datosPaciente.medicamentosDiabetes && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Diabetes:</strong> {datosPaciente.medicamentosDiabetes}</p>
                            </div>
                        )}
                        
                        {datosPaciente.medicolesterol === 'Sí' && datosPaciente.medicamentosColesterol && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Colesterol:</strong> {datosPaciente.medicamentosColesterol}</p>
                            </div>
                        )}

                        <p><strong>Diabetes:</strong> {datosPaciente.diabetes}</p>
                        <p><strong>Fumador:</strong> {datosPaciente.fumador}</p>
                        <p><strong>Ex-Fumador:</strong> {datosPaciente.exfumador}</p>
                        <p><strong>Tensión Arterial Máxima:</strong> {datosPaciente.presionArterial}</p>
                        <p><strong>Tensión Arterial Mínima:</strong> {datosPaciente.taMin}</p>
                        <p><strong>Colesterol:</strong> {datosPaciente.colesterol || 'No especificado'}</p>
                        <p><strong>Peso:</strong> {datosPaciente.peso || 'No especificado'} kg</p>
                        <p><strong>Talla:</strong> {datosPaciente.talla || 'No especificada'} cm</p>
                        <p><strong>Cintura:</strong> {datosPaciente.cintura || 'No especificada'} cm</p>
                        <p><strong>IMC:</strong> {datosPaciente.imc || 'No calculado'}</p>
                        <p><strong>Fecha de Registro:</strong> {datosPaciente.fechaRegistro}</p>
                        <p><strong>Nivel de Riesgo:</strong></p>
                        <div className="mb-4">
                            {renderRiesgoGrid(nivelRiesgo)}
                        </div>
                        <button onClick={cerrarModal} className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para agregar medicamentos */}
            {mostrarModalMedicamentos && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-10/12 max-w-2xl max-h-[90vh]">
                        <h2 className="text-lg font-semibold mb-4">SIGIPSA</h2>
                        <div className="mb-4 max-h-96 overflow-y-auto">
                            {/* ... (el contenido del modal de medicamentos no cambia) ... */}
                            <h3 className="text-lg font-semibold mt-4 mb-2">NOTIFICACION DE RIESGO</h3>
                            {listaNotificacionRiesgo.map((medicamento, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={medicamento} onChange={(e) => handleMedicamentoChange('notificacionRiesgo', e)} />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            <h3 className="text-lg font-semibold mt-4 mb-2">PRÁCTICA</h3>
                            {listaPractica.map((medicamento, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={medicamento} onChange={(e) => handleMedicamentoChange('practica', e)} />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            <h3 className="text-lg font-semibold mt-4 mb-2">Medicacion para la presión arterial</h3>
                            {listaMedicacionPrescripcion.map((medicamento, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={medicamento} onChange={(e) => handleMedicamentoChange('medicacionPrescripcion', e)} />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            <h3 className="text-lg font-semibold mt-4 mb-2">Otros medicamentos</h3>
                            {listaMedicacionDispensa.map((medicamento, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={medicamento} onChange={(e) => handleMedicamentoChange('medicacionDispensa', e)} />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            <h3 className="text-lg font-semibold mt-4 mb-2">TABAQUISMO</h3>
                            {listaTabaquismo.map((medicamento, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={medicamento} onChange={(e) => handleMedicamentoChange('tabaquismo', e)} />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <button onClick={guardarMedicamentos} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Guardar
                            </button>
                            <button onClick={cerrarModal} className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                                Cerrar
                            </button>
                        </div>
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
                        {/* Función renal */}
                        <div className="mt-4 border-t pt-4">
                            {!mostrarRenal && (
                                <button
                                    onClick={() => setMostrarRenal(true)}
                                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    ¿Desea calcular función renal?
                                </button>
                            )}

                            {mostrarRenal && (
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-gray-700">Creatinina (mg/dl):</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={creatinina}
                                        onChange={(e) => setCreatinina(e.target.value)}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {tfg && (
                                        <p className="mt-2 font-semibold text-gray-800">
                                            Filtrado glomerular: {tfg.toFixed(1)} ml/min/1,73 m²
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <button onClick={cerrarModal} className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Formulario;