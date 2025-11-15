// // src/api/api.ts
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // Create an Axios instance
// const api = axios.create({
//   timeout: 15000,
// });

// // Automatically attach the stored token (LoginSeqNo)
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("TokenNo");
//   if (token) {
//     // For GET requests, append LoginSeqNo if not already present
//     if (
//       config.method === "get" &&
//       config.url &&
//       !config.url.includes("LoginSeqNo=")
//     ) {
//       const separator = config.url.includes("?") ? "&" : "?";
//       config.url = `${config.url}${separator}LoginSeqNo=${token}`;
//     }

//     // For POST requests (like file upload), append token to body
//     if (config.method === "post" && config.data instanceof FormData) {
//       config.data.append("LoginSeqNo", token);
//     }
//   }
//   return config;
// });

// export default api;
// src/api/api.ts
// ============================================================
// 🟢 REQUEST INTERCEPTOR
// → Automatically attach latest LoginSeqNo (TokenNo) to every request
// ============================================================
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("TokenNo");

//   if (token) {
//     // For GET requests → append LoginSeqNo to URL
//     if (
//       config.method === "get" &&
//       config.url &&
//       !config.url.includes("LoginSeqNo=")
//     ) {
//       const separator = config.url.includes("?") ? "&" : "?";
//       config.url = `${config.url}${separator}LoginSeqNo=${token}`;
//     }

//     // For POST requests → append LoginSeqNo to FormData
//     if (config.method === "post" && config.data instanceof FormData) {
//       config.data.append("LoginSeqNo", token);
//     }

//     // (Optional) For POST JSON requests → append token in body
//     if (config.method === "post" && !(config.data instanceof FormData)) {
//       config.data = {
//         ...config.data,
//         LoginSeqNo: token,
//       };
//     }
//   }

//   return config;
// });
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // ✅ Create Axios instance
// const api = axios.create({
//   timeout: 15000,
// });

// api.interceptors.request.use((config) => {
//   return new Promise((resolve) => {
//     AsyncStorage.getItem("TokenNo").then((token) => {
//       if (token) {
//         if (
//           config.method === "get" &&
//           config.url &&
//           !config.url.includes("LoginSeqNo=")
//         ) {
//           const separator = config.url.includes("?") ? "&" : "?";
//           config.url = `${config.url}${separator}LoginSeqNo=${token}`;
//         }

//         if (config.method === "post" && config.data instanceof FormData) {
//           config.data.append("LoginSeqNo", token);
//         }

//         if (config.method === "post" && !(config.data instanceof FormData)) {
//           config.data = { ...config.data, LoginSeqNo: token };
//         }
//       }

//       resolve(config);
//     });
//   });
// });

// // ============================================================
// // 🟣 RESPONSE INTERCEPTOR
// // → Update stored TokenNo whenever backend sends a new one
// // ============================================================
// api.interceptors.response.use(
//   async (response) => {
//     const newToken = response?.data?.TokenNo;

//     if (newToken) {
//       console.log("🔁 Updating LoginSeqNo:", newToken);
//       await AsyncStorage.setItem("TokenNo", newToken);
//     }

//     return response;
//   },
//   (error) => {
//     console.error("❌ API Error:", error);
//     return Promise.reject(error);
//   }
// );

// export default api;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ================================
// 🚀 Create Axios instance
// ================================
const api = axios.create({
  timeout: 15000,
});

// 🕒 Utility: format time for logs
const getTime = () => new Date().toLocaleTimeString("en-IN", { hour12: false });

// ============================================================
// 🟣 REQUEST INTERCEPTOR
// → Automatically attach the latest TokenNo
// ============================================================
api.interceptors.request.use((config) => {
  return new Promise((resolve) => {
    AsyncStorage.getItem("TokenNo").then((token) => {
      const logHeader = `\n=== [REQUEST @ ${getTime()}] ========================`;

      console.log(
        `${logHeader}\n🔹 URL: ${
          config.url
        }\n🔹 Method: ${config.method?.toUpperCase()}`
      );

      if (token) {
        console.log(`🔐 Attaching Token: ${token}`);

        // ✅ GET request — add token as query param
        if (
          config.method === "get" &&
          config.url &&
          !config.url.includes("LoginSeqNo=")
        ) {
          const separator = config.url.includes("?") ? "&" : "?";
          config.url = `${config.url}${separator}LoginSeqNo=${token}`;
        }

        // ✅ POST request with FormData
        if (config.method === "post" && config.data instanceof FormData) {
          config.data.append("LoginSeqNo", token);
          console.log("📦 Appended token to FormData");
        }

        // ✅ POST request with JSON
        if (config.method === "post" && !(config.data instanceof FormData)) {
          config.data = { ...config.data, LoginSeqNo: token };
          console.log("📦 Appended token to JSON body");
        }
      } else {
        console.log("⚠️ No token found — likely first login/signup.");
      }

      console.log("=======================================================\n");
      resolve(config);
    });
  });
});

// ============================================================
// 🟣 RESPONSE INTERCEPTOR
// → Automatically save updated TokenNo
// ============================================================
// api.interceptors.response.use(
//   async (response) => {
//     const newToken = response?.data?.TokenNo;
//     const logHeader = `\n=== [RESPONSE @ ${getTime()}] ========================`;

//     console.log(
//       `${logHeader}\n🔹 URL: ${response.config?.url}\n🔹 Status: ${response.status}`
//     );
//     console.log("🔹 Response Data:", response.data);

//     if (newToken) {
//       console.log(`🔁 Updating TokenNo → ${newToken}`);
//       await AsyncStorage.setItem("TokenNo", newToken);
//     } else {
//       console.log("ℹ️ No new token in response.");
//     }

//     console.log("=======================================================\n");
//     return response;
//   },
//   (error) => {
//     const logHeader = `\n=== [ERROR @ ${getTime()}] ========================`;
//     console.error(`${logHeader}\n❌ API Error:`, error.message);

//     if (error.response) {
//       console.error("🔹 Status:", error.response.status);
//       console.error("🔹 Data:", error.response.data);
//     } else if (error.request) {
//       console.error("🔹 No response received from server.");
//     } else {
//       console.error("🔹 Request setup error:", error.message);
//     }

//     console.error("=======================================================\n");
//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  async (response) => {
    const newToken = response?.data?.TokenNo;
    const logHeader = `\n=== [RESPONSE @ ${getTime()}] ========================`;

    console.log(
      `${logHeader}\n🔹 URL: ${response.config?.url}\n🔹 Status: ${response.status}`
    );
    console.log("🔹 Response Data:", response.data);

    if (newToken) {
      console.log(`🔄 UPDATING Token: ${newToken}`);

      // ✅ CRITICAL: Wait for token to be saved before returning response
      await AsyncStorage.setItem("TokenNo", newToken);
      console.log("✅ Token saved to storage");

      // ✅ Update the response data to mark that token was updated
      response.data.tokenWasUpdated = true;
    } else {
      console.log("ℹ️ No new token in response.");
    }

    console.log("=======================================================\n");
    return response;
  },
  (error) => {
    const logHeader = `\n=== [ERROR @ ${getTime()}] ========================`;
    console.error(`${logHeader}\n❌ API Error:`, error.message);

    if (error.response) {
      console.error("🔹 Status:", error.response.status);
      console.error("🔹 Data:", error.response.data);
    } else if (error.request) {
      console.error("🔹 No response received from server.");
    } else {
      console.error("🔹 Request setup error:", error.message);
    }

    console.error("=======================================================\n");
    return Promise.reject(error);
  }
);

export default api;
