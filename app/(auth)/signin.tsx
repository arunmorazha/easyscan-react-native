// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
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
// import { EncryptData } from "../../utils/encryption";

// const SignInScreen: React.FC = () => {
//   const router = useRouter();

//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [baseUrl, setBaseUrl] = useState<string | null>(null);

//   // Load stored CBSURL on mount
//   useEffect(() => {
//     (async () => {
//       const storedUrl = await AsyncStorage.getItem("CBSURL");
//       if (!storedUrl) {
//         Alert.alert("Setup Required", "Please register your bank first.", [
//           {
//             text: "Go to Register",
//             onPress: () => router.replace("/(auth)/signup"),
//           },
//         ]);
//       } else {
//         setBaseUrl(storedUrl);
//       }
//     })();
//   }, []);

//   // ===============================
//   // 🔐 HANDLE LOGIN
//   // ===============================
//   const handleLogin = async () => {
//     if (!userId || !password) {
//       Alert.alert("Error", "Please enter User ID and Password");
//       return;
//     }

//     if (!baseUrl) {
//       Alert.alert("Error", "Bank not registered. Please register first.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔒 Encrypt password using your encryption utility
//       const encryptedPassword = EncryptData(password);

//       // 🔹 Build login request URL
//       const loginUrl = `${baseUrl}?RequestID=Login&UserID=${userId}&Password=${encryptedPassword}`;

//       // 🔹 Send login request
//       const res = await api.get(loginUrl);
//       const data = res.data;
//       // console.log("SIGNIN-RESPONSE", res);

//       // 🧠 Handle different RC responses
//       if (data.RC === "0") {
//         if (data.TokenNo) {
//           // console.log("sign-in data", data);
//           // console.log("sign-in data token", data.TokenNo);
//           await AsyncStorage.setItem("TokenNo", data.TokenNo);
//           await AsyncStorage.setItem("UserId", userId);
//         }
//         Alert.alert("Success", "Login successful!", [
//           {
//             text: "Continue",
//             onPress: () => router.replace("/(app)/upload-document"), // ✅ Go to main screen
//           },
//         ]);
//       } else {
//         Alert.alert("Error", data.Message || "Invalid credentials");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       Alert.alert("Error", "Unable to sign in. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===============================
//   // 🎨 UI
//   // ===============================
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Login</Text>
//       </View>

//       <View style={styles.iconContainer}>
//         <MaterialCommunityIcons name="account" size={80} color="#F9B300" />
//       </View>

//       <View style={styles.formContainer}>
//         <TextInput
//           placeholder="User ID"
//           placeholderTextColor="#F9B300"
//           value={userId}
//           onChangeText={setUserId}
//           style={styles.input}
//           autoCapitalize="none"
//         />
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor="#F9B300"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={styles.input}
//         />

//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleLogin}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
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

// export default SignInScreen;

// // ===============================
// // 💅 STYLES
// // ===============================
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
// app/(auth)/signin.tsx
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
import { EncryptData } from "../../utils/encryption";

const SignInScreen: React.FC = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    userId: "",
    password: "",
    general: "",
    setup: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Load stored CBSURL on mount
  useEffect(() => {
    (async () => {
      const storedUrl = await AsyncStorage.getItem("CBSURL");
      if (!storedUrl) {
        setErrors((prev) => ({
          ...prev,
          setup: "Please register your bank first.",
        }));
      } else {
        setBaseUrl(storedUrl);
      }
    })();
  }, []);

  const clearMessages = () => {
    setErrors({ userId: "", password: "", general: "", setup: "" });
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {
      userId: "",
      password: "",
      general: "",
      setup: "",
    };

    if (!userId.trim()) {
      newErrors.userId = "User ID is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.userId && !newErrors.password;
  };

  // ===============================
  // 🔐 HANDLE LOGIN
  // ===============================
  const handleLogin = async () => {
    clearMessages();

    if (!validateForm()) {
      return;
    }

    if (!baseUrl) {
      setErrors((prev) => ({
        ...prev,
        general: "Bank not registered. Please register first.",
      }));
      return;
    }

    try {
      setLoading(true);

      // 🔒 Encrypt password using your encryption utility
      const encryptedPassword = EncryptData(password);

      // 🔹 Build login request URL
      const loginUrl = `${baseUrl}?RequestID=Login&UserID=${userId}&Password=${encryptedPassword}`;

      // 🔹 Send login request
      const res = await api.get(loginUrl);
      const data = res.data;
      // console.log("SIGNIN-RESPONSE", res);

      // 🧠 Handle different RC responses
      if (data.RC === "0") {
        if (data.TokenNo) {
          // console.log("sign-in data", data);
          // console.log("sign-in data token", data.TokenNo);
          await AsyncStorage.setItem("TokenNo", data.TokenNo);
          await AsyncStorage.setItem("UserId", userId);
        }
        setSuccessMessage("Login successful!");

        // Auto navigate after 1.5 seconds
        setTimeout(() => {
          router.replace("/(app)/upload-document"); // ✅ Go to main screen
        }, 300);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: data.Message || "Invalid credentials. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🎨 UI
  // ===============================
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>

      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="account" size={80} color="#F9B300" />
      </View>

      <View style={styles.formContainer}>
        {/* Setup Error - Bank not registered */}
        {errors.setup ? (
          <View style={styles.setupContainer}>
            <MaterialCommunityIcons
              name="bank-remove"
              size={24}
              color="#FF9800"
            />
            <View style={styles.setupTextContainer}>
              <Text style={styles.setupText}>{errors.setup}</Text>
              <TouchableOpacity
                style={styles.setupButton}
                onPress={() => router.replace("/(auth)/signup")}
              >
                <Text style={styles.setupButtonText}>Go to Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

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

        <TextInput
          placeholder="Password"
          placeholderTextColor="#F9B300"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) clearMessages();
          }}
          secureTextEntry
          style={[styles.input, errors.password && styles.inputError]}
        />
        {errors.password ? (
          <Text style={styles.fieldErrorText}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
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

export default SignInScreen;

// ===============================
// 💅 STYLES
// ===============================
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
  setupContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  setupTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  setupText: {
    color: "#E65100",
    fontSize: 14,
    marginBottom: 8,
  },
  setupButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  setupButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
