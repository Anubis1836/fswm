package com.wecp.financial_seminar_and_workshop_management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.wecp.financial_seminar_and_workshop_management.jwt.JwtRequestFilter;
import com.wecp.financial_seminar_and_workshop_management.service.UserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter authFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors().and().csrf().disable()
                .authorizeRequests()
                // Public endpoints
                .antMatchers("/api/user/login").permitAll()
                .antMatchers("/api/user/register").permitAll()

                // Institution endpoints
                .antMatchers(HttpMethod.POST, "/api/institution/event").hasAuthority("institution")
                .antMatchers(HttpMethod.PUT, "/api/institution/event/**").hasAuthority("institution")
                .antMatchers(HttpMethod.POST, "/api/institution/event/**/resource").hasAuthority("institution")
                .antMatchers(HttpMethod.POST, "/api/institution/event/**/professional").hasAuthority("institution")
                .antMatchers(HttpMethod.GET, "/api/institution/events").hasAuthority("institution")
                .antMatchers(HttpMethod.GET, "/api/institution/event/professionals").hasAuthority("institution")
                .antMatchers(HttpMethod.POST, "/api/institution/event/**/resource/upload")
                .hasAnyAuthority("institution", "professional")

                // Professional endpoints
                .antMatchers(HttpMethod.GET, "/api/professional/events").hasAnyAuthority("professional")
                .antMatchers(HttpMethod.PUT, "/api/professional/event/**/status")
                .hasAnyAuthority("professional", "institution")
                .antMatchers(HttpMethod.POST, "/api/professional/event/**/feedback").hasAuthority("professional")

                // Participant endpoints
                .antMatchers(HttpMethod.GET, "/api/participant/events").hasAnyAuthority("participant", "institution")
                .antMatchers(HttpMethod.GET, "/api/participant/event/**/status")
                .hasAnyAuthority("participant", "institution")
                .antMatchers(HttpMethod.POST, "/api/participant/event/**/enroll").hasAuthority("participant")

                // Finance endpoints
                .antMatchers(HttpMethod.GET, "/api/finance/events")
                .hasAnyAuthority("institution", "participant", "professional")
                .antMatchers(HttpMethod.GET, "/api/events/**/enrollments").hasAuthority("institution")
                .antMatchers(HttpMethod.POST, "/api/events/check-title").hasAuthority("institution")
                // All other API requests require authentication
                .antMatchers("/api/**").authenticated()

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoders() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoders());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}