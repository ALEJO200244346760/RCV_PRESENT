package com.backend.rcv.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Agregamos la IP de tu compañero y permitimos localhost por si hace pruebas locales
                .allowedOriginPatterns(
                        "https://rcv-daspu.vercel.app",
                        "http://181.96.178.138*",
                        "http://localhost:*",
                        "https://*.vercel.app"
                )
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}