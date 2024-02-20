package com.example.randommapapi.Controller;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class test_api {

    public static void main(String[] args) {
        test_api testApi = new test_api();
        testApi.getRestaurantInfo();
    }
    public void getRestaurantInfo() {
        RestTemplate restTemplate = new RestTemplate();
        String apiKey = ""; // あなたのAPIキーに置き換えてください
        double latitude = 34.99589051907792; // 緯度
        double longitude = 135.74090035776118; // 経度
        String url = String.format("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s,%s&radius=1000&types=restaurant&key=%s", latitude, longitude, apiKey);

        String response = restTemplate.getForObject(url, String.class);
        System.out.println(response);
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
            System.out.println(outputJson.toString());
        } catch (JSONException e) {
            e.printStackTrace();
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

        @Override
        public String toString() {
            return "PlaceInfo{" +
                    "name='" + name + '\'' +
                    ", rating=" + rating +
                    ", inclose=" + isOpen +
                    '}';
        }
    }
}