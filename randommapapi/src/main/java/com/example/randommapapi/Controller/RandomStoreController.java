package com.example.randommapapi.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController; 

@RestController           
public class RandomStoreController { 

    @GetMapping("/hello")  
    public String sayHello() { 





        return "Hello, world!"; 
    } 
    @PostMapping("/test")
    public ResponseEntity<MyModel> postMyModel(@RequestBody MyModel model) {
        

        // ここに処理を書く

        return "OK";
    }




}
