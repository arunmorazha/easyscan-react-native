// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import api from "../../src/api/api";
// import { BASE_SERVICE_URL } from "../../src/api/endpoints";

// const SignUpScreen: React.FC = () => {
//   const router = useRouter();
//   const [bankCode, setBankCode] = useState("");
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!bankCode || !userId) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 1️⃣ Fetch CBS Base URL from BankCode
//       const baseRes = await api.get(`${BASE_SERVICE_URL}?BankCode=${bankCode}`);
//       const baseData = baseRes.data;

//       if (baseData.RC !== "1" || !baseData.CBSURL) {
//         Alert.alert("Error", "Invalid Bank Code");
//         return;
//       }

//       const baseUrl = baseData.CBSURL;

//       // 2️⃣ Save BankCode and CBSURL
//       await AsyncStorage.setItem("BankCode", bankCode);
//       await AsyncStorage.setItem("CBSURL", baseUrl);

//       // 3️⃣ Call Signup API
//       const signupUrl = `${baseUrl}?RequestID=Signup&UserID=${userId}`;
//       const res = await api.get(signupUrl);
//       console.log("signupresponse", res.data);

//       if (res.data.RC === "0" || res.data.RC === "1") {
//         Alert.alert("Success", "Registered successfully!", [
//           {
//             text: "Continue to Login",
//             onPress: () => router.replace("/(auth)/signin"),
//           },
//         ]);
//       } else {
//         Alert.alert("Error", res.data.Message || "Signup failed");
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Something went wrong, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Register</Text>
//       </View>

//       <View style={styles.iconContainer}>
//         <MaterialCommunityIcons name="account-plus" size={80} color="#F9B300" />
//       </View>

//       <View style={styles.formContainer}>
//         <TextInput
//           placeholder="Bank Code"
//           placeholderTextColor="#F9B300"
//           value={bankCode}
//           onChangeText={setBankCode}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="User ID"
//           placeholderTextColor="#F9B300"
//           value={userId}
//           onChangeText={setUserId}
//           style={styles.input}
//           autoCapitalize="none"
//         />

//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleRegister}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Register</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.footerText}>
//         Powered By{" "}
//         <Text style={styles.footerCompany}>
//           Silicon IT Solutions Private Limited
//         </Text>
//       </Text>
//     </View>
//   );
// };

// export default SignUpScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6FB",
//     alignItems: "center",
//   },
//   header: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     paddingVertical: 20,
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//     marginTop: 20,
//   },
//   iconContainer: {
//     marginTop: 100,
//     marginBottom: 30,
//     alignItems: "center",
//   },
//   formContainer: {
//     width: "85%",
//     alignItems: "center",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "white",
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     marginBottom: 15,
//     fontSize: 16,
//     color: "#000",
//   },
//   button: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   footerText: {
//     position: "absolute",
//     bottom: 15,
//     color: "#999",
//     fontSize: 12,
//   },
//   footerCompany: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });
// app/(auth)/signup.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../src/api/api";
import { BASE_SERVICE_URL } from "../../src/api/endpoints";

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [bankCode, setBankCode] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    bankCode: "",
    userId: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    // Optional: Clear any existing tokens when arriving at signup
    // This ensures a fresh start if user wants to register a different bank
    const clearExistingAuth = async () => {
      try {
        await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    };
    clearExistingAuth();
  }, []);

  const validateForm = () => {
    const newErrors = {
      bankCode: "",
      userId: "",
      general: "",
    };

    if (!bankCode.trim()) {
      newErrors.bankCode = "Bank Code is required";
    }

    if (!userId.trim()) {
      newErrors.userId = "User ID is required";
    }

    setErrors(newErrors);
    return !newErrors.bankCode && !newErrors.userId;
  };
  // useEffect(() => {
  //   console.log("FIRST LOADDDED");
  //   (async () => {
  //     const item = await AsyncStorage.getItem("TokenNo");
  //     console.log("first load token", item);
  //   })();
  // }, []);

  const clearMessages = () => {
    setErrors({ bankCode: "", userId: "", general: "" });
    setSuccessMessage("");
  };

  const handleRegister = async () => {
    clearMessages();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Fetch CBS Base URL from BankCode
      const baseRes = await api.get(`${BASE_SERVICE_URL}?BankCode=${bankCode}`);
      const baseData = baseRes.data;

      if (baseData.RC !== "1" || !baseData.CBSURL) {
        setErrors((prev) => ({ ...prev, bankCode: "Invalid Bank Code" }));
        return;
      }

      const baseUrl = baseData.CBSURL;

      // 2️⃣ Save BankCode and CBSURL
      await AsyncStorage.setItem("BankCode", bankCode);
      await AsyncStorage.setItem("CBSURL", baseUrl);

      // 3️⃣ Call Signup API
      const signupUrl = `${baseUrl}?RequestID=Signup&UserID=${userId}`;
      const res = await api.get(signupUrl);

      if (res.data.RC === "0" || res.data.RC === "1") {
        setSuccessMessage("Registered successfully!");

        // Auto navigate after 2 seconds
        setTimeout(() => {
          router.replace("/(auth)/signin");
        }, 300);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: res.data.Message || "Signup failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        general: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Register</Text>
      </View>

      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="account-plus" size={80} color="#F9B300" />
      </View>

      <View style={styles.formContainer}>
        {/* Success Message */}
        {successMessage ? (
          <View style={styles.successContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#4CAF50"
            />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* General Error */}
        {errors.general ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#F44336"
            />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        ) : null}

        <TextInput
          placeholder="Bank Code"
          placeholderTextColor="#F9B300"
          value={bankCode}
          onChangeText={(text) => {
            setBankCode(text);
            if (errors.bankCode) clearMessages();
          }}
          style={[styles.input, errors.bankCode && styles.inputError]}
        />
        {errors.bankCode ? (
          <Text style={styles.fieldErrorText}>{errors.bankCode}</Text>
        ) : null}

        <TextInput
          placeholder="User ID"
          placeholderTextColor="#F9B300"
          value={userId}
          onChangeText={(text) => {
            setUserId(text);
            if (errors.userId) clearMessages();
          }}
          style={[styles.input, errors.userId && styles.inputError]}
          autoCapitalize="none"
        />
        {errors.userId ? (
          <Text style={styles.fieldErrorText}>{errors.userId}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Powered By{" "}
        <Text style={styles.footerCompany}>
          Silicon IT Solutions Private Limited
        </Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FB",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#F9B300",
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  iconContainer: {
    marginTop: 100,
    marginBottom: 30,
    alignItems: "center",
  },
  formContainer: {
    width: "85%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "#F44336",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#F9B300",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  footerText: {
    position: "absolute",
    bottom: 15,
    color: "#999",
    fontSize: 12,
  },
  footerCompany: {
    color: "#000",
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "#D32F2F",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  fieldErrorText: {
    color: "#F44336",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 10,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  successText: {
    color: "#4CAF50",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});
