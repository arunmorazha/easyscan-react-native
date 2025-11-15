// app/index.tsx
// import { Redirect } from "expo-router";

// export default function Index() {
//   // By default, open Sign Up screen

//   return <Redirect href="/(auth)/signup" />;
// }
// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    try {
      // Check if user has already registered (has BankCode and CBSURL)
      const bankCode = await AsyncStorage.getItem("BankCode");
      const cbsUrl = await AsyncStorage.getItem("CBSURL");

      // If both exist, user has registered before
      if (bankCode && cbsUrl) {
        setHasCredentials(true);
      } else {
        setHasCredentials(false);
      }
    } catch (error) {
      console.error("Error checking stored credentials:", error);
      setHasCredentials(false);
    } finally {
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

  // If user has registered before, go to login
  // If first time, go to signup
  return (
    <Redirect href={hasCredentials ? "/(auth)/signin" : "/(auth)/signup"} />
  );
}
