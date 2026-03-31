package com.spring.smbs.smbsbackend.repository;

import com.spring.smbs.smbsbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByUserName(String userName);
    User findByUserName(String userName);
}
