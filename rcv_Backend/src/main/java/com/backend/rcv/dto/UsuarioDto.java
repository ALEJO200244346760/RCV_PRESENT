package com.backend.rcv.dto;

import com.backend.rcv.model.Ubicacion;
import lombok.Data;

@Data
public class UsuarioDto {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String rol;
    private Long ubicacionId;
}
