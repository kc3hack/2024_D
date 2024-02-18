package com.example.randommapapi.Controller;

import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.RestController; 

@RestController           
public class RandomStoreController { 

    @GetMapping("/hello")  
    public String sayHello() { 
        




        return "Hello, world!"; 
    } 
}
