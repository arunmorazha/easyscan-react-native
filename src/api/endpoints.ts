// // src/api/endpoints.ts

// export const BASE_SERVICE_URL =
//   "https://mambacloudservices.com/mambaservices.in/EasyScanServices.php";

// // Common endpoints (the CBSURL will be fetched dynamically)
// export const ENDPOINTS = {
//   SIGNUP: (baseUrl: string, userId: string) =>
//     `${baseUrl}?RequestID=Signup&UserID=${userId}`,

//   LOGIN: (baseUrl: string, userId: string, password: string) =>
//     `${baseUrl}?RequestID=Login&UserID=${userId}&Password=${password}`,

//   VERIFY: (
//     baseUrl: string,
//     refType: "C" | "A",
//     refNo: string,
//     userId: string,
//     token: string
//   ) =>
//     `${baseUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}&LoginSeqNo=${token}`,
// };

// src/api/endpoints.ts
export const BASE_SERVICE_URL =
  "https://mambacloudservices.com/mambaservices.in/EasyScanServices.php";

// Common endpoints (the CBSURL will be fetched dynamically)
export const ENDPOINTS = {
  SIGNUP: (baseUrl: string, userId: string) =>
    `${baseUrl}?RequestID=Signup&UserID=${userId}`,

  LOGIN: (baseUrl: string, userId: string, password: string) =>
    `${baseUrl}?RequestID=Login&UserID=${userId}&Password=${password}`,

  // ✅ FIXED: Removed LoginSeqNo from the URL
  // The Axios interceptor will automatically add the latest token.
  VERIFY: (
    baseUrl: string,
    refType: "C" | "A",
    refNo: string,
    userId: string
  ) =>
    `${baseUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}`,
};
