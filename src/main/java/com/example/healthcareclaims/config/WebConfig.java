package com.example.healthcareclaims.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// This class configures CORS (Cross-Origin Resource Sharing) for the whole application.
//
// WHY CorsFilter instead of WebMvcConfigurer?
// WebMvcConfigurer.addCorsMappings() only applies CORS headers AFTER Spring MVC
// processes the request. If an OPTIONS preflight request hits Spring Boot's error
// handler first (which can happen before the controller is reached), the CORS
// headers are never added and the browser blocks the request.
//
// CorsFilter runs at the servlet filter level — before any controller or error
// handler — so it correctly handles OPTIONS preflight requests every time.
@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow requests from the local dev frontend and the deployed production frontend
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://127.0.0.1:5173");
        config.addAllowedOrigin("https://healthcare-claims-management-system-ui.onrender.com");

        // Allow all HTTP methods used by the frontend
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // Allow all headers (Content-Type, Accept, etc.)
        config.addAllowedHeader("*");

        // Apply this CORS config to every URL path in the application
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
