package com.example.randommapapi.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController; 
import org.springframework.web.bind.annotation.PostMapping; // Import the PostMapping annotation
import org.springframework.http.ResponseEntity; // Import the ResponseEntity class
import com.example.randommapapi.Model.MyModel; // Import the MyModel class
import org.springframework.web.bind.annotation.RequestBody; // Import the RequestBody class

@RestController           
public class RandomStoreController { 

    @GetMapping("/hello")  
    public String sayHello() { 





        return "Hello, world!"; 
    } 
    @PostMapping("/test")
    public ResponseEntity<MyModel> postMyModel(@RequestBody MyModel model) {
        

        // ここに処理を書く

        return ResponseEntity.ok(model);
    }




}
