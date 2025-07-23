import React from 'react';

const PacientesEstadisticas = ({ pacientes }) => {
  // Aquí puedes implementar lógica para calcular estadísticas, por ejemplo:
  const calcularPromedioEdad = () => {
    if (pacientes.length === 0) return 0;
    const totalEdad = pacientes.reduce((total, paciente) => total + paciente.edad, 0);
    return (totalEdad / pacientes.length).toFixed(2);
  };

  const calcularPorcentaje = (condicion) => {
    if (pacientes.length === 0) return 0;
    const total = pacientes.length;
    const cantidad = pacientes.filter(paciente => paciente[condicion] === 'Sí').length;
    return ((cantidad / total) * 100).toFixed(2);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Estadísticas de Pacientes</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Promedio de Edad:</h3>
        <p className="text-gray-700">{calcularPromedioEdad()} años</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Problemas Cardiovasculares:</h3>
        <p className="text-gray-700">{calcularPorcentaje('problemasCardiovasculares')}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Enfermedad Renal:</h3>
        <p className="text-gray-700">{calcularPorcentaje('enfermedadRenal')}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Diabetes:</h3>
        <p className="text-gray-700">{calcularPorcentaje('diabetes')}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Niveles de Colesterol Altos:</h3>
        <p className="text-gray-700">{calcularPorcentaje('nivelesColesterol')}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Tabaquismo:</h3>
        <p className="text-gray-700">{calcularPorcentaje('tabaquismo')}%</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Porcentaje de Pacientes con Diabetes Mellitus:</h3>
        <p className="text-gray-700">{calcularPorcentaje('diabetesMellitus')}%</p>
      </div>
    </div>
  );
};

export default PacientesEstadisticas;
