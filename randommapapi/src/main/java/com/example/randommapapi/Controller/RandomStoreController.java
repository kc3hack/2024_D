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
    @GetMapping("/test")
    public String getStores(
        @RequestParam(name = "latitude") float latitude,
        @RequestParam(name = "longitude") float longitude,
        @RequestParam(name = "searchRadius") int searchRadius,
        @RequestParam(name = "type") String type) {

        // ここに処理を書く

        return "OK";
    }




}
