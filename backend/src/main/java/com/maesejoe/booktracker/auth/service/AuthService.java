package com.maesejoe.booktracker.auth.service;

import com.maesejoe.booktracker.auth.dto.AuthResponse;
import com.maesejoe.booktracker.auth.dto.LoginRequest;
import com.maesejoe.booktracker.auth.dto.RefreshRequest;
import com.maesejoe.booktracker.auth.dto.RegisterRequest;
import com.maesejoe.booktracker.auth.entity.RefreshToken;
import com.maesejoe.booktracker.auth.entity.Role;
import com.maesejoe.booktracker.auth.entity.User;
import com.maesejoe.booktracker.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.create(user);

        return AuthResponse.of(accessToken, refreshToken.getToken(), jwtService.getAccessTokenExpiration());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.create(user);

        return AuthResponse.of(accessToken, refreshToken.getToken(), jwtService.getAccessTokenExpiration());
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.refreshToken());

        if(refreshToken.isExpired()) {
            refreshTokenService.deleteByUser(refreshToken.getUser());
            throw new IllegalArgumentException("Refresh token expired");
        }

        User user = refreshToken.getUser();
        String accessToken = jwtService.generateToken(user);
        RefreshToken newRefreshToken = refreshTokenService.create(user);

        return AuthResponse.of(accessToken, refreshToken.getToken(), jwtService.getAccessTokenExpiration());
    }
}
