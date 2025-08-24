import "dotenv/config";

export default {
  expo: {
    name: "banshi-Admin",
    slug: "banshi-Admin",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png", // ✅ single icon
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.banshi.admin",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiBaseUrl:
        process.env.API_BASE_URL || "https://banshi-fe4m.onrender.com",
      eas: {
        projectId: "9dae4eb3-36f8-4bb4-a826-3920df305b35",
      },
    },
  },
};
