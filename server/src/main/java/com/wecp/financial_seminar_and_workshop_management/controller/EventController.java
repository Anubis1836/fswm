package com.wecp.financial_seminar_and_workshop_management.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wecp.financial_seminar_and_workshop_management.dto.EventDetailsDTO;
import com.wecp.financial_seminar_and_workshop_management.entity.Enrollment;
import com.wecp.financial_seminar_and_workshop_management.entity.Event;
import com.wecp.financial_seminar_and_workshop_management.entity.Feedback;
import com.wecp.financial_seminar_and_workshop_management.service.EnrollmentService;
import com.wecp.financial_seminar_and_workshop_management.service.EventService;
import com.wecp.financial_seminar_and_workshop_management.service.FeedbackService;
import com.wecp.financial_seminar_and_workshop_management.service.ResourceService;
import com.wecp.financial_seminar_and_workshop_management.entity.Resource;
import com.wecp.financial_seminar_and_workshop_management.repository.EventRepository;

@RestController
public class EventController {
    @Autowired
    private EventService eventService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private FeedbackService feedbackService;
 
    @GetMapping("api/events/{eventId}")
    public ResponseEntity<EventDetailsDTO> getEventDetails(@PathVariable Long eventId) {
        Event event = eventService.getById(eventId);
        List<Resource> resources = resourceService.getByEventId(eventId);
        List<Feedback> feedbacks = feedbackService.getByEventId(eventId);

        EventDetailsDTO dto = new EventDetailsDTO(event, resources, feedbacks);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("api/events/{eventId}/enrollments")
    public ResponseEntity<List<Enrollment>> getEnrollments(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getAllEnrollments(eventId));
    }

    @PostMapping("/api/events/check-title")
    public ResponseEntity<Map<String, Boolean>> checkEventTitle(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        Long institutionId = Long.valueOf(payload.get("institutionId").toString());
        boolean exists = eventService.isEventTitleTaken(title, institutionId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    
}
