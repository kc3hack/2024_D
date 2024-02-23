package com.example.randommapapi.Controller;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;

public class photo {
    public static void main(String[] args) throws IOException, URISyntaxException {
        String photoReference = "ATplDJYOHhEKPtWR8STOyK67-VmsFd1PP-UW_gDk80-skVKfGu3cbf4kzcYbwawWbOP4xBk6TZduw-kSCwK7babIa12hMgT-61T3lLJHMchhgpdqb5_mfSoqZsBqEhuiAE4K6rdwZfpkDkbIz_W6QZHj6EqrE-Ap4YiQpT1_xDEm6vFdQ_pc";  // photo_referenceを入力してください
        int maxwidth = 400;  // 画像の最大幅を指定してください
        String apiKey = System.getenv("API");  // あなたのAPIキーを入力してください

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
            System.out.println("URL: " + connection.getURL());
        } else {
            System.out.println("GET request not worked");
        }
    }
}
