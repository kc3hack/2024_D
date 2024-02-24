package com.example.randommapapi.Controller;

import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.randommapapi.randommapapi;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class test_api {

    public static void main(String[] args) {
        SpringApplication.run(randommapapi.class, args);
        // resources/application.propertiesを触ってportを8081にしてます　理由は、私のローカル環境のせいです　なにかあれば変更してください
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/getRestaurantInfo")
    public String getRestaurantInfo(@RequestBody Map<String, Object> payload) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String apiKey = System.getenv("API");
            String latitude = payload.get("latitude").toString();
            String longitude = payload.get("longitude").toString();
            int range = Integer.parseInt(payload.get("range").toString());

            List<String> keywordList = new ArrayList<>();
            try {
                List<String> types = (List<String>) payload.get("type");
                keywordList.addAll(types);
            } catch (ClassCastException e) {
                keywordList.add("restaurant");
            }
            boolean inclose = Boolean.parseBoolean(payload.get("inclose").toString());
            List<PlaceInfo> places = new ArrayList<>();
            for (String keyword : keywordList) {
                String url = String.format("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s,%s&radius=%s&type=%s&key=%s&language=ja", latitude, longitude, range, keyword, apiKey);
                String response = restTemplate.getForObject(url, String.class);
                JSONObject jsonResponse = new JSONObject(response);
                JSONArray results = jsonResponse.getJSONArray("results");
                for (int i = 0; i < results.length(); i++) {
                    JSONObject place = results.getJSONObject(i);
                    String name = place.getString("name");
                    double rating = place.optDouble("rating", -1);
                    boolean isOpen = false;
                    JSONObject openingHoursObject = place.optJSONObject("opening_hours");
                    if (openingHoursObject != null) {
                        isOpen = openingHoursObject.optBoolean("open_now", false);
                    }
                    String id = place.optString("place_id", "error");
            
                    JSONArray photosArray = place.optJSONArray("photos");
                    if (photosArray != null && photosArray.length() > 0) {
                        String photoReference = photosArray.getJSONObject(0).getString("photo_reference");
                        String photoUrl = getPhotoUrl(photoReference, apiKey);
            
                        String url2 = String.format("https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:%s&origins=%s,%s&mode=walking&key=%s", id, latitude, longitude, apiKey);
                        String response2 = restTemplate.getForObject(url2, String.class);
                        JSONObject road = new JSONObject(response2);
                        int distanceValue = road.getJSONArray("rows").getJSONObject(0).getJSONArray("elements").getJSONObject(0).getJSONObject("distance").getInt("value");
            
                        if (inclose || isOpen) {
                            places.add(new PlaceInfo(name, rating, isOpen, distanceValue, photoUrl, id));
                        }
                    }
                }
            }
                        JSONArray placeArray = new JSONArray();
            for (PlaceInfo place : places) {
                JSONObject placeJson = new JSONObject();
                placeJson.put("name", place.name);
                placeJson.put("rating", place.rating);
                placeJson.put("open_now", place.isOpen);
                placeJson.put("distance", place.distanceValue);
                placeJson.put("photo", place.photoURL);
                placeJson.put("id", place.id);
                placeArray.put(placeJson);
            }
            JSONObject outputJson = new JSONObject();
            outputJson.put("places", placeArray);
            return outputJson.toString();
        } catch (JSONException | IOException | URISyntaxException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getPhotoUrl(String photoReference, String apiKey) throws URISyntaxException, IOException {
        int maxWidth = 400;  // 画像の最大幅を指定してください

        String urlString = "https://maps.googleapis.com/maps/api/place/photo" +
                "?maxwidth=" + maxWidth +
                "&photoreference=" + photoReference +
                "&key=" + apiKey;

        URI uri = new URI(urlString);
        HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();
        connection.setRequestMethod("GET");
        connection.connect();

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return connection.getURL().toString();
        } else {
            System.out.println("GET request not worked");
            return null;
        }
    }

    static class PlaceInfo {
        public String name;
        public double rating;
        public boolean isOpen;
        public int distanceValue;
        public String photoURL;
        public String id;

        public PlaceInfo(String name, double rating, boolean isOpen, int distanceValue, String photoUrl, String id) {
            this.name = name;
            this.rating = rating;
            this.isOpen = isOpen;
            this.distanceValue = distanceValue;
            this.photoURL = photoUrl;
            this.id = id;
        }
    }
}
