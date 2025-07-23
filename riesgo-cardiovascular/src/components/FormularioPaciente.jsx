import { useState, useEffect } from "react";
import { bloodPressureData } from "./sara";

// Función para encontrar la talla más cercana
const findClosestHeight = (data, age, height) => {
    console.log("🔍 Buscando datos para edad:", age, " altura:", height);
  
    // Convertimos `age` a número para que coincida con los datos del JSON
    const filteredByAge = data.filter((entry) => Number(entry.age) === Number(age));
  
    console.log("🎯 Datos filtrados por edad:", filteredByAge);
  
    if (!filteredByAge.length) return null;
  
    return filteredByAge.reduce((prev, curr) =>
      Math.abs(curr.height - height) < Math.abs(prev.height - height) ? curr : prev
    );
  };  

// Función para encontrar el percentil correcto
const getPercentile = (data, value, type) => {
  console.log(`📊 Buscando percentil para ${type} con valor:`, value);
  
  let percentile = 50; // Valor base por defecto

  for (let i = 0; i < data.length; i++) {
    const referenceValue = type === "systolic" ? data[i].systolic : data[i].diastolic;
    
    if (value >= referenceValue) {
      percentile = data[i].percentile;
    } else {
      break;
    }
  }

  console.log(`✅ Percentil encontrado para ${type}:`, percentile);
  return percentile;
};

// Calcula el percentil de presión arterial
const calculatePercentile = ({ age, height, gender, systolic, diastolic }) => {
  console.log("🚀 Iniciando cálculo de percentil...");
  
  const systolicDataset = bloodPressureData[`${gender}-systolic`];
  const diastolicDataset = bloodPressureData[`${gender}-diastolic`];

  if (!systolicDataset || !diastolicDataset) {
    console.log("❌ Error: Datos de presión arterial no disponibles.");
    return { error: "Datos de presión arterial no disponibles." };
  }

  const closestSystolic = findClosestHeight(systolicDataset, age, height);
  const closestDiastolic = findClosestHeight(diastolicDataset, age, height);

  if (!closestSystolic || !closestDiastolic) {
    console.log("❌ Error: Datos no encontrados en la tabla.");
    return { error: "Datos no encontrados en la tabla" };
  }

  console.log("✅ Talla más cercana encontrada:", closestSystolic.height);

  const systolicPercentile = getPercentile(
    systolicDataset.filter((entry) => entry.height === closestSystolic.height),
    systolic,
    "systolic"
  );

  const diastolicPercentile = getPercentile(
    diastolicDataset.filter((entry) => entry.height === closestDiastolic.height),
    diastolic,
    "diastolic"
  );

  const highestPercentile = Math.max(systolicPercentile, diastolicPercentile);

  const riskLevel =
    highestPercentile >= 95 ? "Hipertensión" :
    highestPercentile >= 90 ? "Prehipertensión" :
    "Normal";

  console.log("📊 Resultados:", {
    systolicPercentile,
    diastolicPercentile,
    highestPercentile,
    riskLevel,
  });

  return {
    systolicPercentile,
    diastolicPercentile,
    highestPercentile,
    riskLevel,
  };
};


const FormularioPaciente = () => {
  const [formData, setFormData] = useState({
    height: "",
    gender: "male",
    systolic: "",
    diastolic: "",
    fechaNacimiento: "", // Agregamos el campo de fecha de nacimiento
  });

  const [result, setResult] = useState(null);

  // Función para calcular la edad
  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si el campo es fecha de nacimiento, actualizamos la edad automáticamente
    if (name === "fechaNacimiento") {
      const calculatedAge = calculateAge(value);
      setFormData({ ...formData, age: calculatedAge });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const calculation = calculatePercentile({
      ...formData,
      age: Number(formData.age), // Convertimos a número
      height: Number(formData.height), // Convertimos a número
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
    });
  
    setResult(calculation);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Calculadora de Presión Arterial</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label htmlFor="fecha-nacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fecha-nacimiento"
            name="fechaNacimiento" // Aseguramos que el nombre del campo sea el correcto
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Edad (años):</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            readOnly // Hacemos este campo de solo lectura ya que se calcula automáticamente
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Talla (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Género:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Presión Sistólica (mmHg):</label>
          <input
            type="number"
            name="systolic"
            value={formData.systolic}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Presión Diastólica (mmHg):</label>
          <input
            type="number"
            name="diastolic"
            value={formData.diastolic}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Calcular Percentil
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.riskLevel === "Hipertensión" ? 'bg-red-100 text-red-700' : result.riskLevel === "Prehipertensión" ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {result.error ? (
            <p className="text-center text-lg font-medium">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Resultados:</h2>
              <p className="text-lg">Percentil Sistólico: <span className="font-semibold">{result.systolicPercentile}</span></p>
              <p className="text-lg">Percentil Diastólico: <span className="font-semibold">{result.diastolicPercentile}</span></p>
              <h3 className="text-xl font-semibold mt-4">Riesgo: <span className="text-lg font-medium">{result.riskLevel}</span></h3>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormularioPaciente;