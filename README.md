# How to use it

### Prerequisites

You'll need [Node](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and Watchman installed (`brew install watchman`).

### Set up iOS

Download Xcode version 13. You can find all available versions of Xcode at [Apple's Developer Portal 🔐](http://developer.apple.com/download/more/).

Ask client to add you on the [firebase.console](https://console.firebase.google.com/project/eigen-a7d3b/settings/iam) to be able to release.

<details><summary>NOTE: After installing Xcode</summary>

Check that Command Line Tools version is added in the Locations tab. Xcode>Preferences>Locations:
<img width="375" alt="" src="https://user-images.githubusercontent.com/29984068/123970729-6009cf00-d987-11eb-933a-1603ba4d6ae8.png">

</details>

### Set up Android

1. Android development environment: Follow the [official docs](https://reactnative.dev/docs/environment-setup). Select "React Native CLI Quickstart" tab

1. [Create a virtual device](https://developer.android.com/studio/run/managing-avds) on which to run the Android app.


## Run Project

### Get Project

```
git clone https://github.com/Maruti-Techlabs/clearvue-native-app.git
cd clearvue-native-app
```

### Install the dependencies

1. Run
  ```
  yarn install
  ```

**Note**: For iOS you need to install pod by doing `cd ios/pod-install`.

## Run the app

Start the react-native bundler:

```sh
yarn start
```

### Run the iOS app

Ask for your apple developer account to be added on the project and login with your apple id under settings/accounts/apple Id

Open the app in Xcode:

```sh
open  clear_vue.xcworkspace
```

From Xcode, run the app by hitting `Product > Run` (or ⌘R). This will start the ClearVue app in an iOS simulator, pointed at staging environment.

### Run the Android app

```sh
yarn android
```

This will start the ClearVue app in an Android emulator, pointed at staging environment.

**Note**: If you see the Splash Screen or White Screen force close your application and reopen it.


## Connect a device

### iOS

When you connect an iPhone to your machine, Xcode will prompt you to join a team, then to enable the device for development. If you have to choose a team, choose _Clearvue Limited_.

### Android

1. On your Android device go to Settings > About Phone
2. Find the 'Build number' menu item and tap it 7 times to enable developer mode.
3. Now go to Settings > System > Developer Options, and turn on 'USB Debugging'
4. Connect your device to your computer via USB cable. After a moment the device should show a prompt for you to allow USB debugging for your computer. Press yes.
5. After that run `yarn android` from within the directory. This will build the app, install it on your device, and run it.


## Folder structure

This project follows a very simple project structure:

- `src`: This folder is the main container of all the code inside your application.
  - `ApiService`: This folder contains all the networking code.
  - `Assets`: Asset folder to store all images, fonts, etc.
  - `Components`: Folder to store any common component that you use through your app (such as a generic button)
  - `Helper`: Folder to store any kind of constant that you have and utility function.
  - `Navigators`: Folder to store the navigators.
  - `Screens`: Folder that contains all your application screens/features.
    - `Screen`: Each screen should be stored inside its folder and inside it a file for its code and a separate one for the styles and tests.
      - `Screen.js`
  - `Store`: Folder to put all redux middlewares and the store.
    - `Store`: Each store should be stored inside its folder and inside it a file for its code and a separate one for the actions and reducer.
      - `action.js`
      - `actionTypes.js`
      - `reducer.js`
  - `Style`: Folder to store all the common styling concerns related to the application theme.
  - `Theme`: Folder to store all the application theme like color , fonts , size etc.
  - `Config`: Main config file to store all the env variable.
  - `App.js`: Main component that starts your whole app.
  - `index.js`: Entry point of your application as per React-Native standards.

## Setup environments

The project already has code to execure the project calling specific environement defined into the `App.js`.

### Environment

1. PRODUCTION
2. TESTING
3. DEVELOPMENT
4. ALPHA

To define which env you want to use you need to change in `App.js` 

```
API.getInstance().build(DevelopmentMode.[environment], apiConfig);
```

## Generate production version

These are the steps to generate `.apk`, `.aab` and `.ipa` files

### Android

1. Generate an upload key ( or ask for the key )
2. Setting up gradle variables
3. Go to the android folder
4. Execute `./gradlew assemble[Env][BuildType]`

Note: You have three options to execute the project
`assemble:` Generates an apk that you can share with others.
`install:` When you want to test a release build on a connected device.
`bundle:` When you are uploading the app to the Play Store.

For more info please go to https://reactnative.dev/docs/signed-apk-android

### iOS

1. Go to the Xcode
2. Select the schema
3. Select 'Any iOS device' as target
4. Product -> Archive

For more info please go to https://reactnative.dev/docs/publishing-to-app-store
# ClearVue-NativeApp
