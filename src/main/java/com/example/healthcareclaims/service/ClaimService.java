package com.example.healthcareclaims.service;

import com.example.healthcareclaims.entity.Claim;
import com.example.healthcareclaims.entity.ClaimStatus;
import com.example.healthcareclaims.entity.Patient;
import com.example.healthcareclaims.repository.ClaimRepository;
import com.example.healthcareclaims.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Service contains business logic.
// This class demonstrates checking rules before saving data.
@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PatientRepository patientRepository;

    public ClaimService(ClaimRepository claimRepository, PatientRepository patientRepository) {
        this.claimRepository = claimRepository;
        this.patientRepository = patientRepository;
    }

    public Claim createClaim(Claim claim) {
        Patient patient = getExistingPatient(claim.getPatientId());
        claim.setPatient(patient);
        claim.setStatus(ClaimStatus.PENDING);
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Claim not found"));
    }

    public Claim updateClaim(Long id, Claim claimDetails) {
        Patient patient = getExistingPatient(claimDetails.getPatientId());

        Claim existingClaim = getClaimById(id);
        existingClaim.setPatientId(claimDetails.getPatientId());
        existingClaim.setPatient(patient);
        existingClaim.setDescription(claimDetails.getDescription());
        existingClaim.setAmount(claimDetails.getAmount());
        existingClaim.setStatus(claimDetails.getStatus());
        return claimRepository.save(existingClaim);
    }

    public void deleteClaim(Long id) {
        Claim claim = getClaimById(id);
        claimRepository.delete(claim);
    }

    public Claim approveClaim(Long id) {
        Claim claim = getClaimById(id);
        claim.setStatus(ClaimStatus.APPROVED);
        return claimRepository.save(claim);
    }

    public Claim rejectClaim(Long id) {
        Claim claim = getClaimById(id);
        claim.setStatus(ClaimStatus.REJECTED);
        return claimRepository.save(claim);
    }

    private Patient getExistingPatient(Long patientId) {
        if (patientId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }
}
