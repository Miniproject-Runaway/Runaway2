package com.eureka.runaway.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eureka.runaway.entity.User;
import com.eureka.runaway.service.GoogleService;
import com.eureka.runaway.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")  // React 앱이 실행 중인 포트 허용
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private GoogleService googleService;  // GoogleService 인스턴스 주입

    @Autowired
    private UserService userService;      // UserService 인스턴스 주입

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        try {
            // Google 토큰 검증 로직
            User googleUser = googleService.verifyToken(token);

            // 사용자 정보 저장 또는 확인
            User user = userService.findOrCreateUser(googleUser);

            // 사용자 정보를 JSON 형식으로 반환
            return ResponseEntity.ok(Map.of("user", user));
        } catch (Exception e) {
            // 예외 발생 시, 명확한 오류 메시지 반환
            return ResponseEntity.status(400).body(Map.of("error", "Invalid token or error during token verification."));
        }
    }
}