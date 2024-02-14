import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { currentWeather, forecastWeather, locationInfo } from '../Iweather';
import { Subscription, debounceTime, fromEvent, interval, filter } from 'rxjs';
import { fadeInOutAnimation } from './animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [fadeInOutAnimation],
})
export class DashboardComponent implements OnInit {
  currentWeather: any | currentWeather;
  forecastWeather: forecastWeather[] = [];
  greetings: string[] = [
    'Good Morning',
    'Good Afternoon',
    'Good Evening',
    'Good Night',
  ];
  currentTime: Date = new Date();
  clockSubscription: Subscription | null = null;
  inputText: string = '';
  searchResults: locationInfo[] = [];
  searching: boolean = false;
  timeout: any = null;
  locationPermission: boolean = false;
  currentLocation: string = "";

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getLocation();
    this.clockSubscription = interval(10000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  onChange(event: any) {
    // this.inputText = event.target.value;
    if (event.target.value === '') {
      this.searchResults = [];
      this.searching = false;
    } else {
      clearTimeout(this.timeout);
      var $this = this;
      this.timeout = setTimeout(function () {
        if (event.keyCode != 13) {
          $this.inputText = event.target.value;
          $this.searchLocation();
        }
      }, 1000);
    }
  }

  searchLocation() {
    if (this.inputText !== '') {
      this.weatherService.getCoordsFromName(this.inputText).subscribe((res) => {
        this.searchResults = [];
        let location: locationInfo;
        for (let i = 0; i < res.length; i++) {
          location = {
            name: res[i].name,
            state: res[i].state,
            lat: res[i].lat,
            lon: res[i].lon,
          };
          this.searchResults.push(location);
        }
        this.searching = true;
      });
    }
  }

  selectLocation(location: locationInfo) {
    this.getWeather(location.lon, location.lat);
    this.locationPermission = true;
    this.inputText = "";
    this.currentLocation = `${location.name}, ${location.state}`;
  }

  ngOnDestroy(): void {
    // Unsubscribe from the clock subscription to prevent memory leaks
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        // console.log(longitude, latitude);
        this.locationPermission = true;
        this.weatherService.getNameFromCoords(latitude,longitude).subscribe(
          res => {
            this.currentLocation = `${res[0].name}, ${res[0].state}`;
          }
        )
        this.getWeather(longitude, latitude);
      });
    } else {
      console.log('No support for geolocation');
    }
  }

  getWeather(lon: number, lat: number) {
    this.weatherService.getWeatherForecastData(lat, lon).subscribe((res) => {
      this.cleanData(res);
      this.searching = false;
    });
  }

  getGreeting(): string {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return this.greetings[0];
    } else if (currentHour >= 12 && currentHour < 18) {
      return this.greetings[1];
    } else if (currentHour >= 18 && currentHour < 22) {
      return this.greetings[2];
    } else {
      return this.greetings[3];
    }
  }

  getDate(timestamp: number): string {
    const dtObject = new Date(timestamp * 1000);
    const date = dtObject.getDate();
    const month = dtObject.getMonth() + 1;
    const year = dtObject.getFullYear();
    return `${date}.${month}.${year}`;
  }

  getTime(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2); // Get minutes (with leading zero if single digit)
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }

  getDayOfWeek(timestamp: number): string {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const date = new Date(timestamp * 1000);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
  }

  cleanData(data: any) {
    // Current
    this.currentWeather = {
      weather_status: data.current.weather[0].main,
      weather_desc: data.current.weather[0].description,
      temperature: Math.round(data.current.temp),
      feels_like: Math.round(data.current.feels_like),
      humidity: data.current.humidity,
      dew_point: data.current.dew_point,
      uv_index: data.current.uvi,
      clouds: data.current.clouds,
      wind_speed: data.current.wind_speed,
      wind_deg: data.current.wind_deg,
      date: data.current.dt,
      sunrise: data.current.sunrise,
      sunset: data.current.sunset,
    };

    let forecast: forecastWeather;
    this.forecastWeather = [];
    for (let x = 1; x < data.daily.length - 1; x++) {
      // console.log(this.getDate(data.daily[x].dt));
      forecast = {
        date: data.daily[x].dt,
        temperature: Math.round(data.daily[x].temp.day),
        weather_status: data.daily[x].weather[0].main,
      };
      this.forecastWeather.push(forecast);
    }
  }
}
