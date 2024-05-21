import 'dotenv/config'; 

export default ({ config }) => ({
  ...config,
  name: "FarmVox",
  slug: "farmvox",
  scheme: "farmvox",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
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
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app uses your location to show nearby listings."
    },
    supportsTablet: true,
    bundleIdentifier: "com.farmvox.app"
  },
  android: {
    permissions: ["ACCESS_FINE_LOCATION"],
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
