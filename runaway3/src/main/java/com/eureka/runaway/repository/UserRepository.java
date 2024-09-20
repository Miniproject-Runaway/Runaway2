package com.eureka.runaway.repository;

import com.eureka.runaway.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByGoogleId(String googleId);
}