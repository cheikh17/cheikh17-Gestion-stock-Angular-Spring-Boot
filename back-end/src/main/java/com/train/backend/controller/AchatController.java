package com.train.backend.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RestController;

import com.train.backend.model.Achat;
import com.train.backend.service.AchatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/achats")
@CrossOrigin("*")
public class AchatController {

    @Autowired
    private AchatService achatService;

    @GetMapping("/all")
    public ResponseEntity<List<Achat>> getAllAchats() {
        return ResponseEntity.ok(achatService.getAllAchats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Achat> getAchatById(@PathVariable Long id) {
        return ResponseEntity.ok(achatService.getAchatById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Achat> createAchat(@RequestBody Achat achat) {
        return new ResponseEntity<>(achatService.saveAchat(achat), HttpStatus.CREATED);
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Achat>> getAchatsByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(achatService.getAchatsByPeriode(debut, fin));
    }
}

