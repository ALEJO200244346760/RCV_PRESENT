package com.backend.rcv.config;

import com.backend.rcv.model.Rol;
import com.backend.rcv.model.Usuario;
import com.backend.rcv.repository.RolRepository;
import com.backend.rcv.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminConfig {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (!usuarioRepository.existsByEmail("admin@example.com")) {
            Usuario cardiologo = new Usuario();
            cardiologo.setNombre("admin");
            cardiologo.setApellido("admin");
            cardiologo.setPassword(passwordEncoder.encode("admin123"));
            cardiologo.setEmail("admin@example.com");

            Rol cardiologoRole = rolRepository.findByNombre("CARDIOLOGO");
            if (cardiologoRole == null) {
                cardiologoRole = new Rol();
                cardiologoRole.setNombre("CARDIOLOGO");
                rolRepository.save(cardiologoRole);
            }

            cardiologo.setRol(cardiologoRole);
            usuarioRepository.save(cardiologo);
        }
    }
}
