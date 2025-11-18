// app/index.tsx
// import { Redirect } from "expo-router";

// export default function Index() {
//   // By default, open Sign Up screen

//   return <Redirect href="/(auth)/signup" />;
// }
// app/index.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Redirect } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";

// export default function Index() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasCredentials, setHasCredentials] = useState(false);

//   useEffect(() => {
//     checkStoredCredentials();
//   }, []);

//   const checkStoredCredentials = async () => {
//     try {
//       // Check if user has already registered (has BankCode and CBSURL)
//       const bankCode = await AsyncStorage.getItem("BankCode");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");

//       // If both exist, user has registered before
//       if (bankCode && cbsUrl) {
//         setHasCredentials(true);
//       } else {
//         setHasCredentials(false);
//       }
//     } catch (error) {
//       console.error("Error checking stored credentials:", error);
//       setHasCredentials(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#F9B300" />
//       </View>
//     );
//   }

//   // If user has registered before, go to login
//   // If first time, go to signup
//   return (
//     <Redirect href={hasCredentials ? "/(auth)/signin" : "/(auth)/signup"} />
//   );
// }
// app/index.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Redirect } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";

// export default function Index() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [redirectTo, setRedirectTo] = useState<
//     "signup" | "signin" | "dashboard"
//   >("signup");

//   useEffect(() => {
//     checkStoredCredentials();
//   }, []);

//   const checkStoredCredentials = async () => {
//     try {
//       // Check if user has already registered (has BankCode and CBSURL)
//       const bankCode = await AsyncStorage.getItem("BankCode");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");
//       const tokenNo = await AsyncStorage.getItem("TokenNo");
//       const userId = await AsyncStorage.getItem("UserId");

//       console.log("🔹 Auto-login check:", {
//         bankCode: !!bankCode,
//         cbsUrl: !!cbsUrl,
//         tokenNo: !!tokenNo,
//         userId: !!userId,
//       });

//       // If user has valid token and credentials, go directly to dashboard
//       if (tokenNo && userId && bankCode && cbsUrl) {
//         console.log("🔹 User already logged in, redirecting to dashboard");
//         setRedirectTo("dashboard");
//       }
//       // If user has registered before but not logged in, go to signin
//       else if (bankCode && cbsUrl) {
//         console.log(
//           "🔹 User registered but not logged in, redirecting to signin"
//         );
//         setRedirectTo("signin");
//       }
//       // If first time, go to signup
//       else {
//         console.log("🔹 First time user, redirecting to signup");
//         setRedirectTo("signup");
//       }
//     } catch (error) {
//       console.error("Error checking stored credentials:", error);
//       setRedirectTo("signup");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#F9B300" />
//       </View>
//     );
//   }

//   // Redirect based on authentication status
//   return (
//     <Redirect
//       href={
//         redirectTo === "dashboard"
//           ? "/(app)/dashboard"
//           : redirectTo === "signin"
//           ? "/(auth)/signin"
//           : "/(auth)/signup"
//       }
//     />
//   );
// }
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<
    "signup" | "signin" | "dashboard"
  >("signup");
  // const clearAllStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log(
  //       "AsyncStorage successfully cleared! You can now test signup."
  //     );
  //   } catch (e) {
  //     console.error("Failed to clear AsyncStorage:", e);
  //   }
  // };

  useEffect(() => {
    // clearAllStorage();
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    try {
      // Check if user has already registered (has BankCode and CBSURL)
      const bankCode = await AsyncStorage.getItem("BankCode");
      const cbsUrl = await AsyncStorage.getItem("CBSURL");

      // TokenNo and UserId are now irrelevant for the initial redirect decision.
      // const tokenNo = await AsyncStorage.getItem("TokenNo");
      // const userId = await AsyncStorage.getItem("UserId");

      console.log("🔹 Initial screen check:", {
        bankCode: !!bankCode,
        cbsUrl: !!cbsUrl,
      });

      // 🛑 MODIFICATION: Check only for registration data.
      // If BankCode and CBSURL exist, the user has registered,
      // so always redirect them to the Sign In screen to log in again.
      if (bankCode && cbsUrl) {
        console.log(
          "🔹 User registered, redirecting to signin (to ensure fresh login)"
        );
        setRedirectTo("signin");
      }
      // If first time (no registration data), go to signup
      else {
        console.log("🔹 First time user, redirecting to signup");
        setRedirectTo("signup");
      }
    } catch (error) {
      console.error("Error checking stored credentials:", error);
      setRedirectTo("signup");
    } finally {
      // Small delay to ensure the splash screen is visible briefly (optional)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F9B300" />
      </View>
    );
  }

  // Redirect based on authentication status
  return (
    <Redirect
      href={
        // dashboard state is no longer possible for a cold start,
        // but we keep the type definition for safety.
        redirectTo === "signin" ? "/(auth)/signin" : "/(auth)/signup"
      }
    />
  );
}
