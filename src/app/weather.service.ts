import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}
  apiKey: string = 'cdaeb4f739e1dc1c9463eea729fdd345';
  apiKey2: string = 'bd5e378503939ddaee76f12ad7a97608';

  // https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid={API key}
  //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  //https://api.openweathermap.org/data/2.5/onecall?lat={latitude}&lon={longitude}&exclude=hourly&appid={your_api_key}

  getWeatherData(lat: number, lon: number) {
    return this.http.get<any[]>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
    );
  }

  getWeatherForecastData(lat: number, lon: number) {
    return this.http.get<any[]>(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${this.apiKey2}&units=metric`
    );
  }

  getCoordsFromName(name: string) {
    return this.http.get<any[]>(
      `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${this.apiKey2}`
    );
  }

  getNameFromCoords(lat:number, lon:number) {
    return this.http.get<any[]>(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.apiKey2}`
    );
  }
}
