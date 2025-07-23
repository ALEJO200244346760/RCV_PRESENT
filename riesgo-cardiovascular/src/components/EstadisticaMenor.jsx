import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Componente de tarjeta para mostrar los detalles de cada paciente
const TarjetaPaciente = ({ paciente, onEdit, onDelete, onCopy }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:translate-y-[-5px]">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Paciente: {paciente.dni}</h3>
      <p className="text-gray-600"><strong>Género:</strong> {paciente.genero}</p>
      <p className="text-gray-600"><strong>Peso:</strong> {paciente.peso} kg</p>
      <p className="text-gray-600"><strong>Talla:</strong> {paciente.talla} cm</p>
      <p className="text-gray-600"><strong>Tensión Arterial:</strong> {paciente.tensionArterial}</p>
      <p className="text-gray-600"><strong>Hipertenso:</strong> {paciente.hipertenso === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Diabetes:</strong> {paciente.diabetes === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Asma:</strong> {paciente.asma === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Fuma:</strong> {paciente.fuma === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Antecedentes de Soplo:</strong> {paciente.antecedentesSoplo === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Arritmias:</strong> {paciente.arritmias === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Enfermedad Crónica:</strong> {paciente.enfermedadCronica === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Cirugía Previa:</strong> {paciente.cirugiaPrevia === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Alergias:</strong> {paciente.alergias === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Antecedentes Familiares de Marcapaso:</strong> {paciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Desfibriladores:</strong> {paciente.desfibriladores === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Tensión Arterial Máxima:</strong> {paciente.tensionArterialMaxima}</p>
      <p className="text-gray-600"><strong>Tensión Arterial Mínima:</strong> {paciente.tensionArterialMinima}</p>
      <p className="text-gray-600"><strong>Electrocardiograma:</strong> {paciente.electrocardiograma || 'No disponible'}</p>

      {/* Botones de acción */}
      <div className="mt-4 flex gap-3">
        <button onClick={() => onCopy(paciente.dni)} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Copiar</button>
        <button onClick={() => onEdit(paciente.id)} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Editar</button>
        <button onClick={() => onDelete(paciente.id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Eliminar</button>
      </div>
    </div>
  );
};

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const apiBaseURL = 'https://rcvcba-production.up.railway.app';

    axios.get(`${apiBaseURL}/api/pacientemenor`, config)
      .then(response => {
        if (Array.isArray(response.data)) {
          setPacientes(response.data);
          setFilteredPacientes(response.data); // Inicialmente mostramos todos
        } else {
          setError('La respuesta de la API no es un arreglo');
        }
      })
      .catch(err => {
        setError(`Error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Función para manejar el cambio en el buscador
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Filtrar pacientes por DNI
    const filtered = pacientes.filter(paciente =>
      paciente.dni.includes(value)
    );
    setFilteredPacientes(filtered);
  };

  // Funciones para los botones
  const handleCopy = (paciente) => {
    // Concatenar todos los datos del paciente en un solo string
    const pacienteData = `
      Paciente: ${paciente.dni}
      Género: ${paciente.genero}
      Peso: ${paciente.peso} kg
      Talla: ${paciente.talla} cm
      Tensión Arterial: ${paciente.tensionArterial}
      Hipertenso: ${paciente.hipertenso === 'Sí' ? 'Sí' : 'No'}
      Diabetes: ${paciente.diabetes === 'Sí' ? 'Sí' : 'No'}
      Asma: ${paciente.asma === 'Sí' ? 'Sí' : 'No'}
      Fuma: ${paciente.fuma === 'Sí' ? 'Sí' : 'No'}
      Antecedentes de Soplo: ${paciente.antecedentesSoplo === 'Sí' ? 'Sí' : 'No'}
      Arritmias: ${paciente.arritmias === 'Sí' ? 'Sí' : 'No'}
      Enfermedad Crónica: ${paciente.enfermedadCronica === 'Sí' ? 'Sí' : 'No'}
      Cirugía Previa: ${paciente.cirugiaPrevia === 'Sí' ? 'Sí' : 'No'}
      Alergias: ${paciente.alergias === 'Sí' ? 'Sí' : 'No'}
      Antecedentes Familiares de Marcapaso: ${paciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'Sí' : 'No'}
      Desfibriladores: ${paciente.desfibriladores === 'Sí' ? 'Sí' : 'No'}
      Tensión Arterial Máxima: ${paciente.tensionArterialMaxima}
      Tensión Arterial Mínima: ${paciente.tensionArterialMinima}
      Electrocardiograma: ${paciente.electrocardiograma || 'No disponible'}
    `;
    
    // Copiar los datos al portapapeles
    navigator.clipboard.writeText(pacienteData)
      .then(() => alert('Datos del paciente copiados al portapapeles'))
      .catch(err => alert('Error al copiar los datos: ', err));
  };
  

  const handleEdit = (id) => {
    navigate(`/editar-pacientemenor/${id}`);
  };

  const handleDelete = (id) => {
    // Simulación de eliminación (puedes implementar la lógica real aquí)
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      setPacientes(pacientes.filter(paciente => paciente.id !== id));
      setFilteredPacientes(filteredPacientes.filter(paciente => paciente.id !== id));
      alert('Paciente eliminado');
    }
  };

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Estadísticas de Pacientes Menores</h1>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Buscar por DNI"
        />
      </div>

      {/* Mostrar tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPacientes.length ? (
          filteredPacientes.map((paciente) => (
            <TarjetaPaciente
              key={paciente.dni}
              paciente={paciente}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No hay pacientes registrados</p>
        )}
      </div>
    </div>
  );
};

export default EstadisticaMenor;
