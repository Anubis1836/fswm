package com.wecp.financial_seminar_and_workshop_management.controller;



import com.wecp.financial_seminar_and_workshop_management.entity.Event;
import com.wecp.financial_seminar_and_workshop_management.entity.Resource;
import com.wecp.financial_seminar_and_workshop_management.entity.User;
import com.wecp.financial_seminar_and_workshop_management.service.EventService;
import com.wecp.financial_seminar_and_workshop_management.service.ResourceService;
import com.wecp.financial_seminar_and_workshop_management.service.UserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;



@RestController
public class InstitutionController {

    @Autowired private EventService eventService;
    @Autowired private ResourceService resourceService;
    @Autowired private UserService userService;

    @PostMapping("/api/institution/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.create(event));
    }

    @PutMapping("/api/institution/event/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return ResponseEntity.ok(eventService.update(id, updatedEvent));
    }

    @GetMapping("/api/institution/events")
    public ResponseEntity<List<Event>> getEvents(@RequestParam Long institutionId) {
        return ResponseEntity.ok(eventService.getForInstitution(institutionId));
    }

    @PostMapping("/api/institution/event/{eventId}/resource")
    public ResponseEntity<Resource> addResourceToEvent(@PathVariable Long eventId, @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.addToEvent(eventId, resource));
    }

    @GetMapping("/api/institution/event/professionals")
    public ResponseEntity<List<User>> getProfessionalsList() {
        return ResponseEntity.ok(userService.getProfessionals());
    }

    @PostMapping("/api/institution/event/{eventId}/professional")
    public ResponseEntity<?> assignProfessionalToEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        return ResponseEntity.ok(eventService.assignProfessional(eventId, userId));
    }

    @PostMapping("/api/institution/event/{eventId}/resource/upload")
public ResponseEntity<?> uploadResource(
        @PathVariable Long eventId,
        @RequestParam("file") MultipartFile file,
        @RequestParam("type") String type,
        @RequestParam("description") String description,
        @RequestParam("availabilityStatus") String availabilityStatus) {
 
    try {
        // Save file to local disk
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        Path uploadPath = Paths.get("uploads/" + eventId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
 
        // Save resource info to DB
        Resource resource = new Resource();
        resource.setId(eventId);
        resource.setType(type);
        resource.setDescription(description);
        resource.setAvailabilityStatus(availabilityStatus);
        resource.setFileUrl("/uploads/" + eventId + "/" + filename);
        resourceService.save(resource);
 
        return ResponseEntity.ok("Resource uploaded successfully");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Could not upload resource");
    }
}
 
 
}