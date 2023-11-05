import { Args, Command, Flags, ux } from '@oclif/core'

import puppeteer, { Browser, HTTPResponse, Page } from 'puppeteer';

import { EmailAndPassword, readCreds } from '../utils/creds.js';

import "urlpattern-polyfill";

const checkLoginSuccess = async (page: Page): Promise<boolean> => {
  try {
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
      timeout: 10000, // Timeout in 10 seconds
    });
    return page.url().startsWith('https://my.electrickiwi.co.nz/account');
  } catch (error) {
    return false;
  }
};

const captureErrorMessage = async (page: Page): Promise<string | undefined> => {
  try {
    await page.waitForSelector('.notification-text-container', { timeout: 5000 });
    return page.evaluate(() => {
      const element = document.querySelector('.notification-text-container');
      return element?.textContent?.trim();
    });
  } catch (error) {
    return 'An error occurred, but no error message was found.';
  }
};

export default class ElectricKiwi extends Command {
  static description = "Log in to Electric Kiwi"

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
    const { args, flags } = await this.parse(ElectricKiwi);

    const creds = await readCreds<EmailAndPassword>(this, 'electric-kiwi');
    // creds are in 'email' and 'password' properties

    const CONNECTION_HOUR_OF_POWER_PATTERN = new URLPattern('https://api.electrickiwi.co.nz/hop/:customerNumber/:connectionId/');


    ux.action.start('Opening browser');
    const browser: Browser = await puppeteer.launch({
      headless: false,
      product: 'chrome',
    });
    ux.action.stop();
    try {

      // - Go to https://www.electrickiwi.co.nz/
      // - Click "Login"
      //       <a href="/account" id="login-link" ...>Login</a>
      // ... redirects a bit then lands at something like ...
      // - https://welcome.electrickiwi.co.nz/oauth/authorize?...
      // - Interact with login form
      //       <form id="nestLoginForm" action="/oauth/authorize?..." method="POST" name="login" enctype="application/json" ...>...
      // - Enter email into 'Email' field
      //       <div id="nest-input-div-email" ...>
      //           <label ...>Email</label>
      //           <div ...>
      //               <input id="email" type="text" name="email" aria-label="email" ...>
      //           </div>
      //       </div>
      // - Enter password into 'Password' field
      //       <div id="nest-input-div-password" pa>
      //           <label id="nest-input-label-password" ...>Password</label>
      //           <div ...><span ...> </span>
      //                <input id="password" type="password" autocomplete="on" name="password" aria-label="password" ...>
      //           </div>
      //       </div>
      // - Click 'Login'
      //       [shadow dom] <button aria-label="login" type="button" part="submit" id="submit"><slot></slot></button>
      // - If there's an error get a modal like
      //       <div class="notification-text-container">
      //           <p class="notification-text-pending-body">Whoops! The e-mail and(or) password you have entered is incorrect. Please try again.</p>
      //       </div>
      // - On success, after some redirects end up o https://my.electrickiwi.co.nz/account

      ux.action.start('Logging into Electric Kiwi');

      const page = await browser.newPage();
      await page.goto('https://www.electrickiwi.co.nz/');
      await page.click('#login-link');

      await page.waitForSelector('#email');
      await page.type('#email', creds.email);
      await page.type('#password', creds.password);

      // GET https://api.electrickiwi.co.nz/hop/<customer-number>/<connection-id>/
      //   {
      //     "data": {
      //         "type": "hop_customer"
      //         "start": {
      //             "interval": "33",
      //             "start_time": "4:00 PM"
      //         },
      //         "end": {
      //             "end_time": "5:00 PM",
      //             "interval": "34"
      //         },
      //         ...
      //     },
      //     "status": 1
      // }

      // Start listening for the Hour of Power request, but don't wait for it
      const connectionHourOfPowerJson = page
        .waitForResponse(response => CONNECTION_HOUR_OF_POWER_PATTERN.test(response.url()))
        .then(response => response.json());

      await page.click('>>> #submit'); // Note shadow dom selector

      // Check if login succeeded
      const succeeded = await checkLoginSuccess(page);
      if (!succeeded) {
        const errorMessage = await captureErrorMessage(page);
        this.error(`Login failed: ${errorMessage}`);
      }
      ux.action.stop();

      ux.action.start('Loading hour of power data');
      const hourOfPowerTime = (await connectionHourOfPowerJson as any).data.start.start_time;
      ux.action.stop();
      this.log(`Hour of power starts at ${hourOfPowerTime}`);
    } finally {
      await browser.close();
    }
  }
}
