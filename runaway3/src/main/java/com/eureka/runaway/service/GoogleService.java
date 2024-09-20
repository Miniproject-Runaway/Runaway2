package com.eureka.runaway.service;

import com.eureka.runaway.entity.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory; // Google API의 GsonFactory 사용

import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleService {

    private static final String CLIENT_ID = "307131914161-mp331ecodiej5fcbi3sv91gk6bj0f80k.apps.googleusercontent.com";
    
    // Google API 클라이언트의 GsonFactory 사용
    private static final JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

    public User verifyToken(String token) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(), jsonFactory)
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken != null) {
            Payload payload = idToken.getPayload();

            // 사용자 정보를 가져오기
            String userId = payload.getSubject(); // Google 사용자 ID
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // 사용자 정보를 새로운 User 객체로 반환하거나 DB에 저장
            User user = new User();
            user.setGoogleId(userId);
            user.setEmail(email);
            user.setName(name);
            return user;
        } else {
            throw new IllegalArgumentException("Invalid ID token.");
        }
    }
}