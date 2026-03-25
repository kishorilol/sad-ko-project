package com.spring.smbs_backend.repository;

import com.spring.smbs_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByUserName(String userName);
    User findByUserName(String userName);
}
