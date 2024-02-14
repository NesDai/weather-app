export interface currentWeather {
    weather_status: string;
    weather_desc:string;
    temperature:number;
    feels_like:number;
    humidity: number;
    dew_point:number;
    uv_index:number;
    clouds:number;
    wind_speed: number;
    wind_deg: number;
    date: number;
    sunrise: number;
    sunset: number;
}

export interface forecastWeather {
    date: number;
    temperature: number;
    weather_status: string;
}

export interface locationInfo {
    name: string,
    state: string;
    lat: number;
    lon: number;
}