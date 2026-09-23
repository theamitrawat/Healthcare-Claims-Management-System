package com.example.healthcareclaims.controller;

import com.example.healthcareclaims.entity.Claim;
import com.example.healthcareclaims.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Controller receives HTTP requests from the client.
// This class demonstrates mapping URLs to Java methods.
// CORS is handled globally in WebConfig — no @CrossOrigin needed here.
@RestController
@RequestMapping("/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public Claim createClaim(@Valid @RequestBody Claim claim) {
        return claimService.createClaim(claim);
    }

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id);
    }

    @PutMapping("/{id}")
    public Claim updateClaim(@PathVariable Long id, @Valid @RequestBody Claim claim) {
        return claimService.updateClaim(id, claim);
    }

    @DeleteMapping("/{id}")
    public void deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
    }

    @PutMapping("/{id}/approve")
    public Claim approveClaim(@PathVariable Long id) {
        return claimService.approveClaim(id);
    }

    @PutMapping("/{id}/reject")
    public Claim rejectClaim(@PathVariable Long id) {
        return claimService.rejectClaim(id);
    }
}
