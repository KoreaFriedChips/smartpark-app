# SmartPark App

## Requirements
- Node >= v21.7
- npm >= 10.5

## Setup
Run `npm i` to install all dependencies. 

In the root directory, create two files: `.env.prod` and `.env.local`. These
store the environment variables to setup the application.

Both files require:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - Available in Cloudflare
- `SERVER_URL`
    - If production, `https://trysmartpark.com`
    - If not production, depends on your local setup, but typically
      `http://<your LAN IP>:3000`
- `GOOGLE_MAPS_API_KEY`
    - Available in Cloudflare
- `SENTRY_AUTH_TOKEN`
    - Available in Cloudflare
- `STRIPE_PUBLISHABLE_KEY`
    - Available in Cloudflare

Here's an example `.env.local`:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXX
SERVER_URL=http://192.0.1.10:3000
GOOGLE_MAPS_API_KEY=XXXX_XXX_X
SENTRY_AUTH_TOKEN=sntryu_XXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXX
```

## Running
Run `npm run start` to build the application for development. Install Expo Go
on your device if you haven't already. This will allow you to test the
application.

You'll also need to configure `SERVER_URL` accurately so that your device can
communicate with the SmartPark server. If you want to test it out using the
public server, use `https://trysmartpark.com`. If you want to test it using
your local environment, figure out your local area network (make sure your
device is on the same one) IP address (using `ifconfig` on macOS and `ip addr`
on Linux). 

## Native building & Running
Install `EAS CLI` globally using `npm install -g eas-cli`.

Run `eas login` to login to your expo.dev acount.

Run `eas build:run -p ios | eas build:run -p andriod` to open an existing build. This command automatically runs and installs the build on your simulator. Afterwards, follow the instructions which are present on app load.

For each NEW environment variable (variables which are NOT present in the .env file) created in Setup, run `eas secret:create --scope project --name VARNAME --value VARVALUE --type string`.

Before creating a build for a physical Apple device, you must first register your iPhone by following the instructions on [expo.dev](https://expo.dev/accounts/smartpark/settings/apple-devices). Your build will not run on your device if you do not complete this step.

Run `npm run build-android | npm run build-ios` to create a new build. Install the resulting build on your device/emulator/simulator. This is not necessary unless you've made a change to the `eas.json` or `app.config.js` files, or added a new environment variable.

Run `npm run dev` to start the dev-client server.

## Deployment
Instructions coming soon.
