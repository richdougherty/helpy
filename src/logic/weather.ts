import puppeteer, { Browser, Page } from 'puppeteer';

export enum WeatherCondition {
  Showers = "showers",
  FewShowers = "few-showers",
  Cloudy = "cloudy",
  PartlyCloudy = "partly-cloudy",
  Fine = "fine",
}

export enum Period {
  Overnight = "overnight",
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening",
}

export type Breakdown = {
  [period in Period]?: WeatherCondition | string;
};

export type Forecast = {
  highTemp: string;
  lowTemp: string;
  statement: string;
  sunrise: string;
  sunset: string;
};

export class CurrentConditions {
  asAt: Date;
  issuedAt: Date;
  temperature: {
    current: number;
    feelsLike: number;
    high: number;
    low: number;
  };
  wind: {
    averageSpeed: number;
    direction: string;
    gustSpeed: number;
    strength: string;
  };
  // ... other conditions as needed

  constructor(data: any) {
    this.asAt = new Date(data.asAt);
    this.issuedAt = new Date(data.issuedAt);
    this.temperature = data.observations.temperature[0];
    this.wind = data.observations.wind[0];
    // ... assign other conditions as needed
  }
}

export type CityForecastDay = {
  date: Date;
  highTemp: string;
  lowTemp: string;
  issuedAt: Date;
  condition: WeatherCondition | string;
  breakdown: Breakdown;
  forecasts: Forecast[];
};

export function getConditionsInTimeOrder(forecastDay: CityForecastDay): (WeatherCondition | string)[] {
  return Object.values(Period).map(period => forecastDay.breakdown[period] || 'Unknown');
}

export class CityForecast {
  days: Array<CityForecastDay>;

  constructor(data: any) {
    this.days = data.days.map((day: any) => ({
      date: new Date(day.date),
      highTemp: day.highTemp,
      lowTemp: day.lowTemp,
      issuedAt: new Date(day.issuedAt),
      condition: day.condition,
      breakdown: Object.fromEntries(Object.entries(day.breakdown).map(([period, condition]) => [period, (condition as any).condition])),
      forecasts: day.forecasts,
    }));
  }
}

const NZ_TIMEZONE = 'Pacific/Auckland';

export async function fetchWeatherJson(browser: Browser, city: string): Promise<any> {
  const page = await browser.newPage();

  const [jsonResponse] = await Promise.all([
    page.waitForResponse(response =>
      response.url() === `https://www.metservice.com/publicData/webdata/towns-cities/locations/${city}`
    ),
    page.goto(`https://www.metservice.com/towns-cities/locations/${city}`, {
      waitUntil: 'domcontentloaded',
    }),
  ]);

  const data = await jsonResponse.json();
  await browser.close();
  return data;
}

export function getMatchingModules(jsonData: any, prefix: string): any[] {
  const slots = jsonData.layout.primary.slots;
  return Object.values(slots as any[])
    .filter(slot => Array.isArray(slot.modules))
    .flatMap((slot: any) => {
      return slot.modules.filter((module: any) => module.name && module.name.startsWith(prefix));
    });
}
