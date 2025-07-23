package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String nombre;
    @Column
    private String apellido;
    @Column
    private String email;
    @Column
    private String password;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Rol rol;
    @OneToOne
    @JoinColumn(name = "ubicacion_id")
    private Ubicacion ubicacion;
}
