package com.spring.smbs_backend.service;

import com.spring.smbs_backend.model.MyUserDetails;
import com.spring.smbs_backend.model.User;
import com.spring.smbs_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUserName(username);

        if(user == null) throw new UsernameNotFoundException(username);

        return new MyUserDetails(user);
    }
}
