package com.spring.smbs.smbs.repository;

import com.spring.smbs.smbs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByUserName(String userName);
}
