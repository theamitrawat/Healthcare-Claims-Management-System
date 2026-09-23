package com.example.healthcareclaims.repository;

import com.example.healthcareclaims.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

// Repository talks to the database.
// This interface demonstrates Spring Data JPA creating SQL operations for us.
public interface PatientRepository extends JpaRepository<Patient, Long> {
}
