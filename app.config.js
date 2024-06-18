import 'dotenv/config'; 

const environment = process.env.APP_ENV || 'development';
const envFilePath = `.env.${environment}`;
require('dotenv').config({ path: envFilePath });

export default ({ config }) => ({
  ...config,
  name: "FarmVox",
  slug: "farmvox",
  scheme: "farmvox",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    url: "https://u.expo.dev/a28fda28-81be-4da1-a1fd-98155a3eb721",
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0
  },
  runtimeVersion: {
     policy: "appVersion"
  },
  assetBundlePatterns: ["**/*"],
  statusBar: {
    backgroundColor: "#ffffff",
    style: "dark",
    hidden: false
  },
  androidStatusBar: {
    backgroundColor: "#ffffff",
    barStyle: "dark-content"
  },
  ios: {
    buildNumber: "1.1.0" ,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app uses your location to show nearby listings.",
      NSPhotoLibraryUsageDescription: "This app needs access to your photo library to select and upload photos.",
      NSUserTrackingUsageDescription: "This identifier will be used to show notifications.",
      NSLocationAlwaysUsageDescription: "This app needs access to your location to provide notifications.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs access to your location to provide notifications.",
      NSCameraUsageDescription: "This app needs access to your camera to take photos and videos.",
    },
    supportsTablet: true,
    bundleIdentifier: "com.farmvox.app",
    associatedDomains: ["applinks:farmvox.com"]
  },
  android: {
    versionCode: 2,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "NOTIFICATIONS",
      "CAMERA"
    ],
    package: "com.farmvox.app",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#f77979"
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "farmvox.com",
            pathPrefix: "/"
          }
        ],
        category: [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ]
  },
  web: {
    favicon: "./assets/icon.png"
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECTID
    }
  },
  owner: "aajindal",
  plugins: [
    [
      "@sentry/react-native/expo",
      {
        "organization": process.env.SENTRY_ORG,
        "project": process.env.SENTRY_PROJECT
      }
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/adaptive-icon.png",
        color: "#f77979"
      }
    ],
    "expo-font",
    "expo-secure-store"
  ]
});
