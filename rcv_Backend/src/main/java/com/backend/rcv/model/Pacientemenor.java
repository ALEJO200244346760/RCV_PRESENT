package com.backend.rcv.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

@Entity
public class Pacientemenor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID único para cada paciente (si es necesario)

    @Column(nullable = false, unique = true)
    @NotNull(message = "El DNI no puede ser nulo")
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 caracteres")
    private String dni; // DNI único del paciente

    @NotNull(message = "El género no puede ser nulo")
    @Size(min = 4, max = 10, message = "El género debe ser 'Masculino' o 'Femenino'")
    @Column(nullable = false)
    private String genero; // Género del paciente (Masculino/Femenino)

    @NotNull(message = "El peso no puede ser nulo")
    @Min(value = 1, message = "El peso debe ser mayor que 0")
    private Double peso; // Peso del paciente

    @NotNull(message = "La talla no puede ser nula")
    @Min(value = 1, message = "La talla debe ser mayor que 0")
    private Double talla; // Talla del paciente

    private String tensionArterial; // Tensión arterial (opcional)

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha de nacimiento debe ser en formato yyyy-MM-dd")
    private String fechaNacimiento; // Fecha de nacimiento del paciente

    private String hipertenso; // Hipertenso (Sí/No)

    private String diabetes; // Diabetes (Sí/No)

    private String asma; // Asma (Sí/No)

    private String fuma; // Fuma (Sí/No)

    private String antecedentesSoplo; // Antecedentes de soplo (Sí/No)

    private String arritmias; // Arritmias (Sí/No)

    private String enfermedadCronica; // Enfermedad crónica (Sí/No)

    private String cirugiaPrevia; // Cirugía previa (Sí/No)

    private String alergias; // Alergias del paciente

    private String antecedentesFamiliaresMarcapaso; // Antecedentes familiares de marcapaso (Sí/No)

    private String desfibriladores; // Desfibriladores (Sí/No)

    private Double tensionArterialMaxima; // Tensión arterial máxima

    private Double tensionArterialMinima; // Tensión arterial mínima

    private String electrocardiograma; // Electrocardiograma (Normal/Anormal)

    // Constructores, getters y setters

    public Pacientemenor() {
    }

    public Pacientemenor(String dni,String genero, Double peso, Double talla, String tensionArterial, String fechaNacimiento, String hipertenso, String diabetes, String asma, String fuma, String antecedentesSoplo, String arritmias, String enfermedadCronica, String cirugiaPrevia, String alergias, String antecedentesFamiliaresMarcapaso, String desfibriladores, Double tensionArterialMaxima, Double tensionArterialMinima, String electrocardiograma) {
        this.dni = dni;
        this.genero = genero;
        this.peso = peso;
        this.talla = talla;
        this.tensionArterial = tensionArterial;
        this.fechaNacimiento = fechaNacimiento;
        this.hipertenso = hipertenso;
        this.diabetes = diabetes;
        this.asma = asma;
        this.fuma = fuma;
        this.antecedentesSoplo = antecedentesSoplo;
        this.arritmias = arritmias;
        this.enfermedadCronica = enfermedadCronica;
        this.cirugiaPrevia = cirugiaPrevia;
        this.alergias = alergias;
        this.antecedentesFamiliaresMarcapaso = antecedentesFamiliaresMarcapaso;
        this.desfibriladores = desfibriladores;
        this.tensionArterialMaxima = tensionArterialMaxima;
        this.tensionArterialMinima = tensionArterialMinima;
        this.electrocardiograma = electrocardiograma;
    }

    // Getters y setters para todos los campos...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Double getTalla() {
        return talla;
    }

    public void setTalla(Double talla) {
        this.talla = talla;
    }

    public String getTensionArterial() {
        return tensionArterial;
    }

    public void setTensionArterial(String tensionArterial) {
        this.tensionArterial = tensionArterial;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getHipertenso() {
        return hipertenso;
    }

    public void setHipertenso(String hipertenso) {
        this.hipertenso = hipertenso;
    }

    public String getDiabetes() {
        return diabetes;
    }

    public void setDiabetes(String diabetes) {
        this.diabetes = diabetes;
    }

    public String getAsma() {
        return asma;
    }

    public void setAsma(String asma) {
        this.asma = asma;
    }

    public String getFuma() {
        return fuma;
    }

    public void setFuma(String fuma) {
        this.fuma = fuma;
    }

    public String getAntecedentesSoplo() {
        return antecedentesSoplo;
    }

    public void setAntecedentesSoplo(String antecedentesSoplo) {
        this.antecedentesSoplo = antecedentesSoplo;
    }

    public String getArritmias() {
        return arritmias;
    }

    public void setArritmias(String arritmias) {
        this.arritmias = arritmias;
    }

    public String getEnfermedadCronica() {
        return enfermedadCronica;
    }

    public void setEnfermedadCronica(String enfermedadCronica) {
        this.enfermedadCronica = enfermedadCronica;
    }

    public String getCirugiaPrevia() {
        return cirugiaPrevia;
    }

    public void setCirugiaPrevia(String cirugiaPrevia) {
        this.cirugiaPrevia = cirugiaPrevia;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getAntecedentesFamiliaresMarcapaso() {
        return antecedentesFamiliaresMarcapaso;
    }

    public void setAntecedentesFamiliaresMarcapaso(String antecedentesFamiliaresMarcapaso) {
        this.antecedentesFamiliaresMarcapaso = antecedentesFamiliaresMarcapaso;
    }

    public String getDesfibriladores() {
        return desfibriladores;
    }

    public void setDesfibriladores(String desfibriladores) {
        this.desfibriladores = desfibriladores;
    }

    public Double getTensionArterialMaxima() {
        return tensionArterialMaxima;
    }

    public void setTensionArterialMaxima(Double tensionArterialMaxima) {
        this.tensionArterialMaxima = tensionArterialMaxima;
    }

    public Double getTensionArterialMinima() {
        return tensionArterialMinima;
    }

    public void setTensionArterialMinima(Double tensionArterialMinima) {
        this.tensionArterialMinima = tensionArterialMinima;
    }

    public String getElectrocardiograma() {
        return electrocardiograma;
    }

    public void setElectrocardiograma(String electrocardiograma) {
        this.electrocardiograma = electrocardiograma;
    }
}
