package com.train.backend.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RestController;

import com.train.backend.model.Vente;
import com.train.backend.service.VenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ventes")
@CrossOrigin("*")
public class VenteController {

    @Autowired
    private VenteService venteService;

    @GetMapping("/all")
    public ResponseEntity<List<Vente>> getAllVentes() {
        return ResponseEntity.ok(venteService.getAllVentes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vente> getVenteById(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.getVenteById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Vente> createVente(@RequestBody Vente vente) {
        return new ResponseEntity<>(venteService.saveVente(vente), HttpStatus.CREATED);
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Vente>> getVentesByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(venteService.getVentesByPeriode(debut, fin));
    }
}
