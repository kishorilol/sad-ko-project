package com.spring.smbs.smbsbackend.service;

import com.spring.smbs.smbsbackend.model.MyUserDetails;
import com.spring.smbs.smbsbackend.model.User;
import com.spring.smbs.smbsbackend.repository.UserRepository;
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
