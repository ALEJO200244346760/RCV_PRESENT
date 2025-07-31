package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- DATOS GENERALES ---
    @Column
    private String fechaRegistro;
    @Column
    private String telefono;
    @Column
    private String doctor;
    @Column
    private String cuil;
    @Column
    private String edad;
    @Column
    private String genero;

    // --- ANTECEDENTES Y CONDICIONES ---
    @Column
    private String hipertenso; // Pregunta Si/No HTA
    @Column(columnDefinition = "TEXT")
    private String medicamentosHipertension; // Lista de medicamentos HTA
    @Column
    private String diabetes; // Pregunta Si/No Diabetes
    @Column(columnDefinition = "TEXT")
    private String medicamentosDiabetes; // Lista de medicamentos Diabetes
    @Column
    private String medicolesterol; // Pregunta Si/No Colesterol
    @Column(columnDefinition = "TEXT")
    private String medicamentosColesterol; // Lista de medicamentos Colesterol
    @Column
    private String fumador;
    @Column
    private String exfumador;
    @Column
    private String infarto;
    @Column
    private String acv;
    @Column
    private String renal;
    @Column
    private String pulmonar;
    @Column
    private String alergias;
    @Column
    private String tiroides;
    @Column
    private String sedentarismo;
    @Column
    private String aspirina; // ¿Toma aspirina?
    @Column
    private String enfermedad; // ¿Enfermedad cardiovascular documentada?

    // --- MEDICIONES ---
    @Column
    private String presionArterial;
    @Column
    private String taMin;
    @Column
    private String colesterol;
    @Column
    private String peso;
    @Column
    private String talla;
    @Column
    private String imc;
    @Column
    private String cintura;
    @Column
    private String tfg; // Tasa de Filtrado Glomerular

    // --- RESULTADO ---
    @Column
    private String nivelRiesgo;

    // --- CAMPOS ESPECÍFICOS GÉNERO FEMENINO ---
    @Column
    private String numeroGestas;
    @Column
    private String fum; // Fecha de última menstruación
    @Column
    private String metodoAnticonceptivo;
    @Column
    private String trastornosHipertensivos;
    @Column
    private String diabetesGestacional;
    @Column
    private String sop; // Síndrome de Ovario Poliquístico
}