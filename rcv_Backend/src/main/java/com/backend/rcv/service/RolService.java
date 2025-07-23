package com.backend.rcv.service;

import com.backend.rcv.model.Rol;
import com.backend.rcv.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public Rol createRole(Rol rol) {
        return rolRepository.save(rol);
    }

    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    public Optional<Rol> getRoleById(Long id) {
        return rolRepository.findById(id);
    }

    public Optional<Rol> updateRole(Long id, Rol rol) {
        if (rolRepository.existsById(id)) {
            rol.setId(id);
            return Optional.of(rolRepository.save(rol));
        }
        return Optional.empty();
    }

    public boolean deleteRole(Long id) {
        if (rolRepository.existsById(id)) {
            rolRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
