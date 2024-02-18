package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.Properties;
import java.net.URISyntaxException;

public class api_test {

    public static void main(String[] args) throws IOException {
        // 環境変数からAPIキーとPlace IDを取得
        String placeId = "ChIJ60NyKmiJGGARK-GU2Euyip4"; // Replace "your_place_id" with the actual place ID
        String apiKey = System.getenv("API_KEY"); // Replace "your_api_key" with your actual API key
        System.out.println(apiKey);

        try {
            URI uri = new URI("https", "maps.googleapis.com", "/maps/api/place/details/json", "place_id=" + placeId + "&key=" + apiKey, null);

            URL url = uri.toURL();

            // HttpURLConnectionを作成
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // レスポンスを取得
            connection.getResponseCode();
            System.out.println(connection.getResponseCode());

            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                // 成功
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

                // JSONを解析
                Properties properties = new Properties();
                properties.load(reader);
                //System.out.println(properties);

                // 情報を出力
                System.out.println("名前：" + properties.getProperty("name"));
                System.out.println("住所：" + properties.getProperty("formatted_address"));
                System.out.println("電話番号：" + properties.getProperty("formatted_phone_number"));
                System.out.println("ウェブサイト：" + properties.getProperty("website"));
                System.out.println("営業時間：" + properties.getProperty("opening_hours"));
                System.out.println("レーティング：" + properties.getProperty("rating"));
                System.out.println("レビュー数：" + properties.getProperty("user_ratings_total"));

                reader.close();
            } else {
                // エラー
                System.out.println("エラー：" + responseCode);
            }
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
