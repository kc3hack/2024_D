package com.example.randommapapi.Model;
public class MyModel {
    private float latitude;
    private float longitude;
    private String range;
    private String type;
    

    public float getLatitude() {
        return latitude;
    }

    public float setLatitude(float latitude) {
        this.latitude = latitude;
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }
    
    public float setLongitude(float longitude) {
        this.longitude = longitude;
        return longitude;
    }

    public String getRange() {
        return range;
    }

    public String setRange(String range) {
        this.range = range;
        return range;
    }
    public String getType() {
        return type;
    }

    public String setType(String type) {
        this.type = type;
        return type;
    }
}
