package com.mediqueue.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mediqueue.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
       
        .cors(cors -> {})
        .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                		.requestMatchers(
                		        "/auth/**",
                		        "/users/register",
                		        "/ws/**",
                		        "/ws",
                		        "/topic/**",
                		        "/app/**",
                		        "/customer/hospitals/**",
                		        "/customer/hospital-departments/**",
                		        "/customer/payments/*/pdf"
                		).permitAll()

                        .requestMatchers("/super-admin/**")
                        .hasRole("SUPER_ADMIN")

                        .requestMatchers("/hospital-admin/**")
                        .hasRole("HOSPITAL_ADMIN")

                        .requestMatchers("/staff/**")
                        .hasAnyRole("STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN")

                        .requestMatchers("/customer/**")
                        .hasAnyRole("CUSTOMER", "STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN")
                        
                        .anyRequest().authenticated()
                
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
    
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of("*")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    

}