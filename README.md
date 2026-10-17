# Tasks / Tips

A small, no-build task dashboard with a rotating collection of practical productivity notes. Tasks are stored in the browser with `localStorage`.

## Run locally

Open `index.html` in a browser. No install or build step is required.

## Android app

The Android app packages the same interface in a native Capacitor shell. It uses the same local browser storage, so task data remains on the device and is separate from the website's storage.

Requirements: Node.js, JDK 21, Android Studio, and the Android SDK installed through Android Studio.

```sh
npm install
npm run android:sync
npm run android:open
```

For a fresh checkout that does not already contain an `android/` directory, run `npm run android:add` instead of `npm run android:sync` once.

In Android Studio, configure release signing and build a signed Android App Bundle (`.aab`). Upload the bundle in Google Play Console and complete the store listing, app-content declarations, and testing requirements there. The app ID is `com.pxov198.taskstips` and cannot be changed after the app is first published. Never commit your signing keystore or its passwords.

## Publish with GitHub Pages

Push this repository to GitHub, then open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, and save. GitHub Pages will publish `index.html` at the repository's Pages URL.

Task data stays in the current browser and is not uploaded to GitHub.