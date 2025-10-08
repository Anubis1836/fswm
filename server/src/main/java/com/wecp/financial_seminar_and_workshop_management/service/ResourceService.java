package com.wecp.financial_seminar_and_workshop_management.service;


import com.wecp.financial_seminar_and_workshop_management.entity.Event;
import com.wecp.financial_seminar_and_workshop_management.entity.Resource;
import com.wecp.financial_seminar_and_workshop_management.repository.EventRepository;
import com.wecp.financial_seminar_and_workshop_management.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ResourceService {

    @Autowired private ResourceRepository resourceRepository;
    @Autowired private EventRepository eventRepository;

    public Resource addToEvent(Long eventId, Resource resource) {
        Event e = eventRepository.findById(eventId).orElseThrow();
        resource.setEvent(e);
        return resourceRepository.save(resource);
    }

    public List<Resource> getByEventId(Long eventId) {
        return resourceRepository.findByEventId(eventId);
    }

    public Resource save(Resource resource){
        return resourceRepository.save(resource);
    }
}
