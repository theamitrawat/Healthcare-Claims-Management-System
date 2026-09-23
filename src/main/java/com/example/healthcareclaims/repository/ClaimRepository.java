package com.example.healthcareclaims.repository;

import com.example.healthcareclaims.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

// Repository talks to the database.
// This interface demonstrates CRUD methods provided by Spring Data JPA.
public interface ClaimRepository extends JpaRepository<Claim, Long> {
}
