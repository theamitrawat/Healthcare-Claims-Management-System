package com.example.healthcareclaims.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// This class configures CORS (Cross-Origin Resource Sharing) globally for the whole application.
// CORS must be configured so the React frontend (running on a different URL) can call the backend APIs.
// Without this, the browser blocks all API requests from the frontend.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Allow requests from the local development frontend and the deployed production frontend
                .allowedOrigins(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "https://healthcare-claims-management-system-ui.onrender.com"
                )
                // Allow all standard HTTP methods used by the frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Allow all request headers (Content-Type, etc.)
                .allowedHeaders("*");
    }
}
