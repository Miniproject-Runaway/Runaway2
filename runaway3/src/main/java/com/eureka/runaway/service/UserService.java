package com.eureka.runaway.service;

import com.eureka.runaway.entity.User;
import com.eureka.runaway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }

    public User findOrCreateUser(User googleUser) {
        User user = userRepository.findByGoogleId(googleUser.getGoogleId());
        if (user == null) {
            user = new User();
            user.setGoogleId(googleUser.getGoogleId());
            user.setEmail(googleUser.getEmail());
            user.setName(googleUser.getName());
            userRepository.save(user);
        }
        return user;
    }
}