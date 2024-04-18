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
    - Can find this on the Clerk website
- `SERVER_URL`
    - If production, `https://trysmartpark.com`
    - If not production, depends on your local setup, but typically
      `http://<your LAN IP>:3000`

Here's an example `.env.prod`:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXX
SERVER_URL=https://trysmartpark.com
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

## Deployment
Instructions coming soon.
