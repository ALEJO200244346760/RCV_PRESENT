// ConstFormulario.jsx
export const DatosPacienteInicial = {
    cuil: '',
    telefono: '',
    edad: '',
    obra: '',
    genero: '',
    diabetes: '',
    medicolesterol: '',
    fumador: '',
    exfumador: '',
    presionArterial: '',
    taMin: '',
    colesterol: '',
    peso: '',
    talla: '', // Talla en centímetros
    cintura: '',
    fechaRegistro: new Date().toISOString().split('T')[0],
    imc: '',
    hipertenso: '',
    infarto: '',
    acv: '',
    renal: '',
    pulmonar: '',
    doctor: '',
    notificacionRiesgo: [],
    consulta: [],
    practica: [],
    hipertensionArterial: [],
    medicacionPrescripcion: [],
    medicacionDispensa: [],
    tabaquismo: [],
    laboratorio: []
};


export const Advertencia = {
            '<10% Bajo': `-Realizar el cálculo de riesgo cardiovascular cada 12 meses.
-Mantener un estilo de vida más saludable.
-Actividad física y recreativa que incluya ejercicios aeróbicos (como caminata bicicleta baile natación) y otros ejercicios anaeróbicos (como levantamiento de pesas en tren superior o brazos y espalda y tren inferior como piernas y muslos, comenzando con cargas de menor a mayor peso gradualmente). Realizarlos al menos tres veces por semana, o bien logrando 150 minutos semanales.
-Vigilar el perfil del riesgo con el control de la presión arterial y un análisis de laboratorio de colesterol y glucemia.
-Alimentación saludable recomendada en lo posible por un nutricionista o profesional de la salud.
-Evitar hábitos tóxicos.
-Revisión de su salud mental.
-Hábitos de sueños saludables.
-Controlar periódicamente su diámetro de cintura, intentando llegar a menos de 88cm en la mujer, y menos de 102cm en el hombre, para prevenir la diabetes.
-Si es hipertenso el seguimiento es mensual hasta alcanzar el control y luego semestral o anual.
            `,
            '>10% <20% Moderado': `-Realizar el cálculo de riesgo cardiovascular cada 6 meses.
-Ante síntomas como dolor de pecho, falta de aire súbita, pérdida de fuerzas en manos o piernas, disminución visual, desmayo o desorientación, concurrir a una guardia lo antes posible.
-Revisar apego y adherencia al cumplimiento de los tratamientos, medicamentos  e interconsultas indicados.
-Realización de estudios complementarios indicados por el profesional de la salud.
-Mantener un estilo de vida más saludable.
- Actividad física y recreativa controlada y monitorizada idealmente en un centro de rehabilitación que incluya ejercicios aeróbicos (como caminata bicicleta baile natación) y otros ejercicios anaeróbicos (como levantamiento de pesas en tren superior o brazos y espalda y tren inferior como piernas y muslos, comenzando con cargas de menor a mayor peso gradualmente). Realizarlos al menos tres veces por semana, o bien logrando 150 minutos semanales.
-Vigilar el perfil del riesgo con el control de la presión arterial y un análisis de laboratorio de colesterol y glucemia.
-Alimentación saludable recomendada en lo posible por un nutricionista o profesional de la salud.***-Evitar hábitos tóxicos.
-Revisión de su salud mental.
-Hábitos de sueños saludables.
-Controlar periódicamente su diámetro de cintura, intentando llegar a menos de 88cm en la mujer, y menos de 102cm en el hombre, para prevenir la diabetes.
-Revisar el calendario de vacunas en enfermería.
-Si es hipertenso el seguimiento es mensual hasta alcanzar el control de la TA y luego trimestral.
-Contemplar el uso de estatinas de baja o moderada intensidad si no tiene contraindicaciones prescriptas por su médico.
            `,
            '>20% <30% Alto': `-Realizar el cálculo de riesgo cardiovascular cada 3 meses.
-Ante síntomas como dolor de pecho, falta de aire súbita, pérdida de fuerzas en manos o piernas, disminución visual, desmayo o desorientación, concurrir a una guardia lo antes posible.
-Revisar apego y adherencia al cumplimiento de los tratamientos, medicamentos e interconsultas indicados.
-Realización de estudios complementarios e interconsultas adecuadas indicados por el profesional de la salud.
-Mantener un estilo de vida más saludable.
-Actividad física y recreativa controlada y monitorizada idealmente en un centro de rehabilitación que incluya ejercicios aeróbicos (como caminata bicicleta baile natación) y otros ejercicios anaeróbicos (como levantamiento de pesas en tren superior o brazos y espalda y tren inferior como piernas y muslos, comenzando con cargas de menor a mayor peso gradualmente). Realizarlos al menos tres veces por semana, o bien logrando 150 minutos semanales.
-Vigilar el perfil del riesgo con el control de la presión arterial y un análisis de laboratorio de colesterol y glucemia.
-Alimentación saludable recomendada en lo posible por un nutricionista o profesional de la salud.
-Evitar hábitos tóxicos.
-Revisión de su salud mental.
-Hábitos de sueños saludables.
-Controlar periódicamente su diámetro de cintura, intentando llegar a menos de 88cm en la mujer, y menos de 102cm en el hombre, para prevenir la diabetes.
-Revisar el calendario de vacunas en enfermería.
-Si es hipertenso el seguimiento es mensual hasta alcanzar el control de la TA y luego trimestral. Se sugiere bajas dosis de aspirina y estatinas de alta intensidad si no tiene contraindicaciones prescriptas por su médico.
            `,
            '>30% <40% Muy Alto': `-Realizar el cálculo de riesgo cardiovascular cada 3 meses.
-Ante síntomas como dolor de pecho, falta de aire súbita, pérdida de fuerzas en manos o piernas, disminución visual, desmayo o desorientación, concurrir a una guardia lo antes posible.
-Revisar apego y adherencia al cumplimiento de los tratamientos, medicamentos e interconsultas indicados.
-Realización de estudios complementarios e interconsultas adecuadas indicados por el profesional de la salud.
-Mantener un estilo de vida más saludable.
-Actividad física y recreativa controlada y monitorizada idealmente en un centro de rehabilitación que incluya ejercicios aeróbicos (como caminata bicicleta baile natación) y otros ejercicios anaeróbicos (como levantamiento de pesas en tren superior o brazos y espalda y tren inferior como piernas y muslos, comenzando con cargas de menor a mayor peso gradualmente). Realizarlos al menos tres veces por semana, o bien logrando 150 minutos semanales.
-Vigilar el perfil del riesgo con el control de la presión arterial y un análisis de laboratorio de colesterol y glucemia.
-Alimentación saludable recomendada en lo posible por un nutricionista o profesional de la salud.
-Evitar hábitos tóxicos.
-Revisión de su salud mental.
-Hábitos de sueños saludables.
-Controlar periódicamente su diámetro de cintura, intentando llegar a menos de 88cm en la mujer, y menos de 102cm en el hombre, para prevenir la diabetes.
-Revisar el calendario de vacunas en enfermería.
-Si es hipertenso el seguimiento es mensual hasta alcanzar el control de la TA y luego trimestral. Se sugiere bajas dosis de aspirina y estatinas de alta intensidad si no tiene contraindicaciones prescriptas por su médico.
            `,
            '>40% Crítico': `-Realizar el cálculo de riesgo cardiovascular cada 3 meses.
-Ante síntomas como dolor de pecho, falta de aire súbita, pérdida de fuerzas en manos o piernas, disminución visual, desmayo o desorientación, concurrir a una guardia lo antes posible.
-Revisar apego y adherencia al cumplimiento de los tratamientos, medicamentos e interconsultas indicados.
-Realización de estudios complementarios e interconsultas adecuadas indicados por el profesional de la salud.
-Mantener un estilo de vida más saludable.
-Actividad física y recreativa controlada y monitorizada idealmente en un centro de rehabilitación que incluya ejercicios aeróbicos (como caminata bicicleta baile natación) y otros ejercicios anaeróbicos (como levantamiento de pesas en tren superior o brazos y espalda y tren inferior como piernas y muslos, comenzando con cargas de menor a mayor peso gradualmente). Realizarlos al menos tres veces por semana, o bien logrando 150 minutos semanales.
-Vigilar el perfil del riesgo con el control de la presión arterial y un análisis de laboratorio de colesterol y glucemia.
-Alimentación saludable recomendada en lo posible por un nutricionista o profesional de la salud.
-Evitar hábitos tóxicos.
-Revisión de su salud mental.
-Hábitos de sueños saludables.
-Controlar periódicamente su diámetro de cintura, intentando llegar a menos de 88cm en la mujer, y menos de 102cm en el hombre, para prevenir la diabetes.
-Revisar el calendario de vacunas en enfermería.
-Si es hipertenso el seguimiento es mensual hasta alcanzar el control de la TA y luego trimestral. Se sugiere bajas dosis de aspirina y estatinas de alta intensidad si no tiene contraindicaciones prescriptas por su médico.
            `
};

export const listaNotificacionRiesgo = [
    
    "270*Notificación de riesgo cardiovascular < 10% (a partir de 18 años) NTN007K22",
    "270*Notificación de riesgo cardiovascular 10% ≤ 20% (a partir de 18 años) NTN008K22",
    "270*Notificación de riesgo cardiovascular 20% ≤ 30% (a partir de 18 años) NTN009K22",
    "270*Notificación de riesgo cardiovascular ≥ 30% (a partir de 18 años) NTN010K22",
    "Persona con diabetes",
    "Persona con hipertensión arterial",
    "Persona con sobrepeso u obesidad",
];

export const listaConsulta = [

    "936*Consulta para la evaluación de riesgo cardiovascular CTC048K22",
    "702*Consulta de seguimiento de persona con riesgo cardiovascular CTC049K22",
    "936*Consulta con cardiología en persona con alto RCV CTC044K22",
    "C001 - CONSULTA POR CONTROL DE SALUD",
    "C055 - INTER CONSULTA CON CARDIOLOGIA A98 - MEDICINA PREVEN/PROMOCIÓN SALUD",
    "Detección y seguimiento de hipertensión arterial",
    "Consulta de atención de sobrepeso y obesidad",
    "Exámen periódico de salud del adulto",
    "Consulta con cardiología",
];

export const listaPractica = [

    "P004 - ELECTROCARDIOGRAMA",
    "Uso de herramienta FINDRISC",
];

export const listaHipertensionArterial = [

    "504*Notificación de persona con hipertensión en tratamiento farmacológico NTN030K86",
    "1800*Consulta de detección y/o seguimiento de HTA CTC074K86",
];

export const listaMedicacionPrescripcion = [

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
    "Otros",
];

export const listaMedicacionDispensa = [

    "Metformina 500 mg dos por dia",
    "Metformina 850 mg dos por dia",
    "Metformina 1000 mg dos por dia",
    "Atorvastatina 10 mg uno por día",
    "Atorvastatina 20 mg uno por día",
    "Atorvastatina 40 mg uno por día",
    "Atorvastatina 80 mg uno por día",
    "Aspirina 100 mg una por día",
    "OTRO",
];

export const listaTabaquismo = [

    "468*Consejeria abandono de tabaquismo",
    "936*Consulta para cesación tabáquica (personas adultas y mayores) CTC075A98",
    "936*Consejería Consejo conductual breve de cese de tabaquismo COT023P22",
];

export const listaLaboratorio = [
                              
    "180*Glucemia LBL045VMD",
    "180*Perfil lipídico LBL073VMD",
    "180*Albuminuria LBL137VMD",
    "180*Creatinina sérica LBL022VMD",
    "180*IFGe LBL140VMD",
];

export const obtenerColorRiesgo = (riesgo) => {
    switch (riesgo) {
        case '<10% Bajo': return 'bg-green-500';
        case '>10% <20% Moderado': return 'bg-yellow-500';
        case '>20% <30% Alto': return 'bg-orange-500';
        case '>30% <40% Muy Alto': return 'bg-red-500';
        case '>40% Crítico': return 'bg-red-800';
        default: return 'bg-gray-200';
    }
};

export const obtenerTextoRiesgo = (riesgo) => {
    switch (riesgo) {
        case '<10% Bajo': return '<10% Bajo';
        case '>10% <20% Moderado': return '>10% <20% Moderado';
        case '>20% <30% Alto': return '>20% <30% Alto';
        case '>30% <40% Muy Alto': return '>30% <40% Muy Alto';
        case '>40% Crítico': return '>40% Crítico';
        default: return 'Desconocido';
    }
};

