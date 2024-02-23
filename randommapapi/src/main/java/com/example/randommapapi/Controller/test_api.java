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
		//resources/application.propertiesを触ってportを8081にしてます　理由は、私のローカル環境のせいです　なにかあれば変更してください
	}
    @CrossOrigin(origins = "*")
    @PostMapping("/getRestaurantInfo")
    public String getRestaurantInfo(@RequestBody Map<String, Object> payload) throws IOException, URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();
        String apiKey = System.getenv("API");
        String latitude =payload.get("latitude").toString();
        String longitude =payload.get("longitude").toString();
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
                String id = place.has("place_id") ? place.getString("place_id") : "error";

                String url2 = String.format("https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:%s&origins=%s,%s&mode=walking&key=%s",id,latitude,longitude,apiKey);
                String response2 = restTemplate.getForObject(url2, String.class);
                JSONObject rode = new JSONObject(response2);
                JSONArray rows = rode.getJSONArray("rows");
                JSONObject firstRow = rows.getJSONObject(0);
                JSONArray elements = firstRow.getJSONArray("elements");
                JSONObject firstElement = elements.getJSONObject(0);
                JSONObject distance = firstElement.getJSONObject("distance");
                int distanceValue = distance.getInt("value");
 
                String photoReference = place.getJSONArray("photos").getJSONObject(0).getString("photo_reference");
                String photoUrl = getPhotoUrl(photoReference, apiKey);


                places.add(new PlaceInfo(name, rating, isOpen, distanceValue,photoUrl));
            }
            // JSON形式で出力
            JSONObject outputJson =  new JSONObject();
            JSONArray placeArray = new JSONArray();
            for (PlaceInfo place : places) {
                JSONObject placeJson = new JSONObject();
                placeJson.put("name", place.name);
                placeJson.put("rating", place.rating);
                placeJson.put("open_now", place.isOpen);
                placeJson.put("distance",place.distanceValue);
                placeJson.put("photo",place.photoURL);
                placeArray.put(placeJson);
            }
            outputJson.put("places", placeArray);
            return outputJson.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getPhotoUrl(String photoReference, String apiKey) throws URISyntaxException, IOException {
        int maxwidth = 400;  // 画像の最大幅を指定してください

        String urlString = "https://maps.googleapis.com/maps/api/place/photo" +
                "?maxwidth=" + maxwidth +
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

        public PlaceInfo(String name, double rating, boolean isOpen, int distanceValue, String photoUrl) {
            this.name = name;
            this.rating = rating;
            this.isOpen = isOpen;
            this.distanceValue = distanceValue;
            this.photoURL = photoUrl;
        }
    }
}
