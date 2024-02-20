package com.example.randommapapi.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@RestController
public class test_api {

    @PostMapping("/getRestaurantInfo")
    public String getRestaurantInfo(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();
        String apiKey = System.getenv("API");
        double latitude = Double.parseDouble(payload.get("latitude").toString());
        double longitude = Double.parseDouble(payload.get("longitude").toString());
        int range = Integer.parseInt(payload.get("range").toString());
        String type = payload.get("type").toString();
        String url = String.format("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s,%s&radius=%s&types=%s&key=%s", latitude, longitude, range, type, apiKey);

        String response = restTemplate.getForObject(url, String.class);
        List<PlaceInfo> places = new ArrayList<>();
        try {
            JSONObject jsonObject = new JSONObject(response);
            JSONArray results = jsonObject.getJSONArray("results");
            for (int i = 0; i < results.length(); i++) {
                JSONObject place = results.getJSONObject(i);
                String name = place.getString("name");
                double rating = place.has("rating") ? place.getDouble("rating") : -1;
                boolean isOpen = place.has("opening_hours") ? place.getJSONObject("opening_hours").getBoolean("open_now") : false;
                places.add(new PlaceInfo(name, rating, isOpen));
            }
            // JSON形式で出力
            JSONObject outputJson = new JSONObject();
            JSONArray placeArray = new JSONArray();
            for (PlaceInfo place : places) {
                JSONObject placeJson = new JSONObject();
                placeJson.put("name", place.name);
                placeJson.put("rating", place.rating);
                placeJson.put("inclose", place.isOpen);
                placeArray.put(placeJson);
            }
            outputJson.put("places", placeArray);
            return outputJson.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    static class PlaceInfo {
        public String name;
        public double rating;
        public boolean isOpen;

        public PlaceInfo(String name, double rating, boolean isOpen) {
            this.name = name;
            this.rating = rating;
            this.isOpen = isOpen;
        }
    }
}
