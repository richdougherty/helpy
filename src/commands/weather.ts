import {Args, Command, Flags, ux} from '@oclif/core'

import puppeteer, { Browser, Page } from 'puppeteer';

import { CityForecast, CurrentConditions, WeatherCondition, fetchWeatherJson, getConditionsInTimeOrder, getMatchingModules } from '../logic/weather.js';

////// UI CODE /////


async function loadWellingtonData(browser: Browser, city: string): Promise<[CurrentConditions, CityForecast]> {
  const weatherJson = await fetchWeatherJson(browser, city);

  const currentConditionsModules = getMatchingModules(weatherJson, 'current-conditions/');
  const cityForecastModules = getMatchingModules(weatherJson, 'city-forecast/');

  const currentCondition = new CurrentConditions(currentConditionsModules[0]);
  const cityForecast = new CityForecast(cityForecastModules[0]);
  return [currentCondition, cityForecast]
}

function conditionToEmoji(condition: WeatherCondition | string): string {
  // Mapping of conditions to emojis
  const emojiMap: { [key in WeatherCondition | string]: string } = {
    [WeatherCondition.Showers]: '🌧',
    [WeatherCondition.FewShowers]: '🌦',
    [WeatherCondition.Cloudy]: '☁️',
    [WeatherCondition.PartlyCloudy]: '⛅️',
    [WeatherCondition.Fine]: '☀️',
  };

  return emojiMap[condition] || '❓';
}

export default class Weather extends Command {
  static description = "Get today's weather"

  // static examples = [
  //   '<%= config.bin %> <%= command.id %>',
  // ]

  // static flags = {
  //   // flag with a value (-n, --name=VALUE)
  //   name: Flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: Flags.boolean({char: 'f'}),
  // }

  // static args = {
  //   file: Args.string({description: 'file to read'}),
  // }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Weather)

    let currentConditions, cityForecast;

    ux.action.start('Opening browser');
    const browser: Browser = await puppeteer.launch({
      headless: false,
      product: 'chrome',
    });
    ux.action.stop();
    try {

      ux.action.start('Loading weather data');
      [currentConditions, cityForecast] = await loadWellingtonData(browser, 'wellington');
      ux.action.stop();
    } finally {
      await browser.close();
    }

    const conditions = getConditionsInTimeOrder(cityForecast.days[0]);
    const emojis: string[] = conditions.map(conditionToEmoji);
    this.log(`Weather: ${emojis.join('  ')}`);

  }
}
