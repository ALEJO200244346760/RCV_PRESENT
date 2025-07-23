package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Ubicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nombre;
}
