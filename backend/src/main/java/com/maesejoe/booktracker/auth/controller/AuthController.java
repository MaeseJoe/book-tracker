package com.maesejoe.booktracker.auth.controller;

import com.maesejoe.booktracker.auth.dto.AuthResponse;
import com.maesejoe.booktracker.auth.dto.LoginRequest;
import com.maesejoe.booktracker.auth.dto.RefreshRequest;
import com.maesejoe.booktracker.auth.dto.RegisterRequest;
import com.maesejoe.booktracker.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }
}
