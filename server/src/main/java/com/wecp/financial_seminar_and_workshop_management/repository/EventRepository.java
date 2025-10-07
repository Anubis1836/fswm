package com.wecp.financial_seminar_and_workshop_management.repository;



import com.wecp.financial_seminar_and_workshop_management.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByInstitutionIdOrderByIdAsc(Long institutionId);
    List<Event> findAllByOrderByIdAsc();
    List<Event> findByProfessionals_IdOrderByIdAsc(Long userId);
    Boolean existsByTitleAndInstitutionId(String title,Long institutionId);
}
