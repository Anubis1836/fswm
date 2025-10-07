package com.wecp.financial_seminar_and_workshop_management.controller;

import com.wecp.financial_seminar_and_workshop_management.dto.LoginRequest;
import com.wecp.financial_seminar_and_workshop_management.dto.LoginResponse;
import com.wecp.financial_seminar_and_workshop_management.entity.User;
import com.wecp.financial_seminar_and_workshop_management.exception.FieldAlreadyExistsException;
import com.wecp.financial_seminar_and_workshop_management.jwt.JwtUtil;
import com.wecp.financial_seminar_and_workshop_management.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/api/user/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User saved = userService.register(user);
            return ResponseEntity.ok(saved);
        } catch (FieldAlreadyExistsException ex) {
            // Return field + message
            return ResponseEntity.badRequest().body(Map.of(
                "field", ex.getField(),
                "message", ex.getMessage()
            ));
        }
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        User u = userService.getByUsername(loginRequest.getUsername());
        String token = jwtUtil.generateToken(loginRequest.getUsername());

        String role = u.getRole();
        Long userId = u.getId();
        System.out.println("User Roles: " + role);
        return ResponseEntity.ok(new LoginResponse(token, role, userId));
    }

    @GetMapping("/api/user/exists/email")
    public ResponseEntity<Boolean> emailExists(@RequestParam String email) {
        boolean exists = userService.getAllUsers().stream()
                .anyMatch(u -> email.equalsIgnoreCase(u.getEmail()));
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/api/user/exists/username")
    public ResponseEntity<Boolean> usernameExists(@RequestParam String username) {
        boolean exists = userService.getByUsername(username) != null;
        return ResponseEntity.ok(exists);
    }

}