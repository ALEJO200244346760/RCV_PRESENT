package com.backend.rcv.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "enfermeria")
public class Enfermeria {

    @Id
    @Column(name = "dni", unique = true, nullable = false)
    private String dni;  // DNI del paciente

    @NotNull(message = "El género no puede ser nulo")
    @Size(min = 4, max = 10, message = "El género debe ser 'Masculino' o 'Femenino'")
    @Column(name = "genero", nullable = false)
    private String genero;  // Género del paciente (Masculino/Femenino)

    @Column(name = "peso", nullable = false)
    private double peso;  // Peso del paciente

    @Column(name = "talla", nullable = false)
    private double talla;  // Talla del paciente

    @Column(name = "tension_arterial", nullable = true)
    private String tensionArterial;  // Tensión arterial (opcional)

    // Constructor vacío
    public Enfermeria() {
    }

    // Constructor con parámetros
    public Enfermeria(String dni,String genero, double peso, double talla, String tensionArterial) {
        this.dni = dni;
        this.genero = genero;
        this.peso = peso;
        this.talla = talla;
        this.tensionArterial = tensionArterial;
    }

    // Getters y Setters
    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public @NotNull(message = "El género no puede ser nulo") @Size(min = 4, max = 10, message = "El género debe ser 'Masculino' o 'Femenino'") String getGenero() {
        return genero;
    }

    public void setGenero(@NotNull(message = "El género no puede ser nulo") @Size(min = 4, max = 10, message = "El género debe ser 'Masculino' o 'Femenino'") String genero) {
        this.genero = genero;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public double getTalla() {
        return talla;
    }

    public void setTalla(double talla) {
        this.talla = talla;
    }

    public String getTensionArterial() {
        return tensionArterial;
    }

    public void setTensionArterial(String tensionArterial) {
        this.tensionArterial = tensionArterial;
    }
}
