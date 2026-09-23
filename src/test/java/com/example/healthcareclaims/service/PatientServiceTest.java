package com.example.healthcareclaims.service;

import com.example.healthcareclaims.entity.Patient;
import com.example.healthcareclaims.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PatientServiceTest {

    @Test
    void getPatientByIdThrowsErrorWhenPatientDoesNotExist() {
        PatientRepository patientRepository = mock(PatientRepository.class);
        PatientService patientService = new PatientService(patientRepository);

        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> patientService.getPatientById(99L));
    }

    @Test
    void getPatientByIdReturnsPatientWhenPatientExists() {
        PatientRepository patientRepository = mock(PatientRepository.class);
        PatientService patientService = new PatientService(patientRepository);
        Patient patient = new Patient();
        patient.setId(1L);
        patient.setName("Amit");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

        Patient result = patientService.getPatientById(1L);

        org.junit.jupiter.api.Assertions.assertEquals("Amit", result.getName());
    }
}
