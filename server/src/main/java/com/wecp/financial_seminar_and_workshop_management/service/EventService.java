package com.wecp.financial_seminar_and_workshop_management.service;


import com.wecp.financial_seminar_and_workshop_management.entity.Enrollment;
import com.wecp.financial_seminar_and_workshop_management.entity.Event;
import com.wecp.financial_seminar_and_workshop_management.entity.User;
import com.wecp.financial_seminar_and_workshop_management.repository.EnrollmentRepository;
import com.wecp.financial_seminar_and_workshop_management.repository.EventRepository;
import com.wecp.financial_seminar_and_workshop_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;

    public Event create(Event event) {
        boolean exists = eventRepository.existsByTitleAndInstitutionId(event.getTitle(), event.getInstitutionId());
        if (exists) {
            throw new RuntimeException("An event with this title already exists for your institution.");
        }
        return eventRepository.save(event);
    }
    public Event update(Long id, Event updated) {
        Event e = eventRepository.findById(id).orElseThrow();
        e.setTitle(updated.getTitle());
        e.setDescription(updated.getDescription());
        e.setSchedule(updated.getSchedule());
        e.setLocation(updated.getLocation());
        e.setStatus(updated.getStatus());
        return eventRepository.save(e);
    }

    public List<Event> getForInstitution(Long institutionId) {
        return eventRepository.findByInstitutionIdOrderByIdAsc(institutionId);
    }

    public List<Event> getAllOrdered() {
        return eventRepository.findAllByOrderByIdAsc();
    }

    public List<Event> getForProfessional(Long userId) {
        return eventRepository.findByProfessionals_IdOrderByIdAsc(userId);
    }

    public Event assignProfessional(Long eventId, Long userId) {
        Event e = eventRepository.findById(eventId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        if (!e.getProfessionals().contains(u)) {
            e.getProfessionals().add(u);
        }
        return eventRepository.save(e);
    }

    public Event getById(Long id) {
        return eventRepository.findById(id).orElseThrow();
    }

    public Event updateStatus(Long id, String status) {
        Event e = eventRepository.findById(id).orElseThrow();
        e.setStatus(status);
        return eventRepository.save(e);
    }

    public List<Enrollment> getAllEnrollments(Long id) {
        return enrollmentRepository.findAllByEventId(id);
    }
    public boolean isEventTitleTaken(String title, Long institutionId) {
        return eventRepository.existsByTitleAndInstitutionId(title, institutionId);
    }
     

}
