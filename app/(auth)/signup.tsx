// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   // 👇 Keyboard Handling Imports
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
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
//   const [errors, setErrors] = useState({
//     bankCode: "",
//     userId: "",
//     general: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     // Clear any existing tokens when arriving at signup
//     const clearExistingAuth = async () => {
//       try {
//         await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
//       } catch (error) {
//         console.error("Error clearing auth data:", error);
//       }
//     };
//     clearExistingAuth();
//   }, []);

//   const validateForm = () => {
//     const newErrors = {
//       bankCode: "",
//       userId: "",
//       general: "",
//     };

//     if (!bankCode.trim()) {
//       newErrors.bankCode = "Bank Code is required";
//     }

//     if (!userId.trim()) {
//       newErrors.userId = "User ID is required";
//     }

//     setErrors(newErrors);
//     return !newErrors.bankCode && !newErrors.userId;
//   };

//   const clearMessages = () => {
//     setErrors({ bankCode: "", userId: "", general: "" });
//     setSuccessMessage("");
//   };

//   const handleRegister = async () => {
//     clearMessages();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);

//       // 1️⃣ Fetch CBS Base URL from BankCode
//       const baseRes = await api.get(`${BASE_SERVICE_URL}?BankCode=${bankCode}`);
//       const baseData = baseRes.data;

//       if (baseData.RC !== "1" || !baseData.CBSURL) {
//         setErrors((prev) => ({ ...prev, bankCode: "Invalid Bank Code" }));
//         return;
//       }

//       const baseUrl = baseData.CBSURL;

//       // 2️⃣ Save BankCode and CBSURL
//       await AsyncStorage.setItem("BankCode", bankCode);
//       await AsyncStorage.setItem("CBSURL", baseUrl);

//       // 3️⃣ Call Signup API
//       const signupUrl = `${baseUrl}?RequestID=Signup&UserID=${userId}`;
//       const res = await api.get(signupUrl);

//       if (res.data.RC === "0" || res.data.RC === "1") {
//         setSuccessMessage("Registered successfully!");

//         // Auto navigate after 300ms
//         setTimeout(() => {
//           router.replace("/(auth)/signin");
//         }, 300);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general: res.data.Message || "Signup failed. Please try again.",
//         }));
//       }
//     } catch (error) {
//       console.error(error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Main container view (flex: 1)
//     <View style={styles.container}>
//       {/* 1. Fixed Header - STAYS AT TOP */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Register</Text>
//       </View>

//       <KeyboardAvoidingView
//         style={styles.kav}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.iconContainer}>
//             <MaterialCommunityIcons
//               name="account-plus"
//               size={80}
//               color="#F9B300"
//             />
//           </View>

//           <View style={styles.formContainer}>
//             {/* Success Message */}
//             {successMessage ? (
//               <View style={styles.successContainer}>
//                 <MaterialCommunityIcons
//                   name="check-circle"
//                   size={20}
//                   color="#4CAF50"
//                 />
//                 <Text style={styles.successText}>{successMessage}</Text>
//               </View>
//             ) : null}

//             {/* General Error */}
//             {errors.general ? (
//               <View style={styles.errorContainer}>
//                 <MaterialCommunityIcons
//                   name="alert-circle"
//                   size={20}
//                   color="#F44336"
//                 />
//                 <Text style={styles.errorText}>{errors.general}</Text>
//               </View>
//             ) : null}

//             {/* Bank Code Input */}
//             <TextInput
//               placeholder="Bank Code"
//               placeholderTextColor="#F9B300"
//               value={bankCode}
//               onChangeText={(text) => {
//                 setBankCode(text);
//                 if (errors.bankCode) clearMessages();
//               }}
//               style={[styles.input, errors.bankCode && styles.inputError]}
//               autoCapitalize="sentences"
//             />
//             {errors.bankCode ? (
//               <Text style={styles.fieldErrorText}>{errors.bankCode}</Text>
//             ) : null}

//             {/* User ID Input */}
//             <TextInput
//               placeholder="User ID"
//               placeholderTextColor="#F9B300"
//               value={userId}
//               onChangeText={(text) => {
//                 setUserId(text);
//                 if (errors.userId) clearMessages();
//               }}
//               style={[styles.input, errors.userId && styles.inputError]}
//               autoCapitalize="sentences"
//             />
//             {errors.userId ? (
//               <Text style={styles.fieldErrorText}>{errors.userId}</Text>
//             ) : null}

//             {/* Register Button */}
//             <TouchableOpacity
//               style={[styles.button, loading && styles.buttonDisabled]}
//               onPress={handleRegister}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Register</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* 🌟 CRUCIAL: Increased Spacer to ensure the button can scroll above the keyboard */}
//           {/* <View style={{ height: 350 }} /> */}
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* 4. Fixed Footer - STAYS AT BOTTOM */}
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

// // ----------------------------------------------------
// // 💅 STYLES
// // ----------------------------------------------------

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6FB",
//   },

//   kav: {
//     flex: 1, // Must take up remaining space
//     width: "100%", // Must take full width
//   },

//   // 🌟 FIX: Added justifyContent: 'center' to center the content
//   // and allow it to shift upwards correctly when the keyboard opens.
//   scrollContent: {
//     flexGrow: 1,
//     alignItems: "center",
//     justifyContent: "center", // <--- ADDED THIS LINE
//     paddingBottom: 20,
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

//   // Retaining the intentional large margin of 100
//   iconContainer: {
//     marginTop: 100, // <--- INTENTIONALLY LEFT AT 100
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
//     marginBottom: 8,
//     fontSize: 16,
//     color: "#000",
//   },
//   inputError: {
//     borderColor: "#F44336",
//     borderWidth: 1,
//   },
//   button: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: "#cccccc",
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   // footerText: {
//   //   position: "absolute",
//   //   bottom: 15,
//   //   color: "#999",
//   //   fontSize: 12,
//   //   textAlign: "center",
//   // },
//   footerText: {
//     position: "absolute",
//     bottom: 15,
//     color: "#999",
//     fontSize: 12,
//     textAlign: "center",
//     left: 0,
//     right: 0,
//   },
//   footerCompany: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   errorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFEBEE",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     width: "100%",
//   },
//   errorText: {
//     color: "#D32F2F",
//     marginLeft: 8,
//     fontSize: 14,
//     flex: 1,
//   },
//   fieldErrorText: {
//     color: "#F44336",
//     fontSize: 12,
//     alignSelf: "flex-start",
//     marginLeft: 15,
//     marginBottom: 10,
//   },
//   successContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E8F5E8",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     width: "100%",
//   },
//   successText: {
//     color: "#4CAF50",
//     marginLeft: 8,
//     fontSize: 14,
//     flex: 1,
//   },
// });
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  // 👇 Keyboard Handling Imports
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    // Clear any existing tokens when arriving at signup
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
      setLoading(true); // 1️⃣ Fetch CBS Base URL from BankCode

      const baseRes = await api.get(`${BASE_SERVICE_URL}?BankCode=${bankCode}`);
      const baseData = baseRes.data;
      console.log("BASEURL RESPONSE", baseData);

      if (baseData.CBSURL === "0") {
        setErrors((prev) => ({ ...prev, bankCode: "Invalid Bank Code" }));
        return;
      }
      // if (baseData.RC !== "1" || !baseData.CBSURL) {
      //   setErrors((prev) => ({ ...prev, bankCode: "Invalid Bank Code" }));
      //   return;
      // }

      const baseUrl = baseData.CBSURL; // 2️⃣ Save BankCode and CBSURL

      await AsyncStorage.setItem("BankCode", bankCode);
      await AsyncStorage.setItem("CBSURL", baseUrl); // 3️⃣ Call Signup API

      const signupUrl = `${baseUrl}?RequestID=Signup&UserID=${userId}`;
      const res = await api.get(signupUrl);

      if (res.data.RC === "0" || res.data.RC === "1") {
        setSuccessMessage("Registered successfully!"); // Auto navigate after 300ms

        setTimeout(() => {
          router.replace("/(auth)/signin");
        }, 300);
      } else if (res.data.RC === "2") {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid user id",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            res.data.Message ||
            res.data.Msg ||
            "Signup failed. Please try again.",
        }));
      }
    } catch (error) {
      console.log("error found---------", error);
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
    // Main container view (flex: 1)
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Register</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Slightly reduced offset for better view
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-plus"
              size={80}
              color="#F9B300"
            />
          </View>
          <View style={styles.formContainer}>
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
              // onChangeText={(text) => {
              //   setBankCode(text);
              //   if (errors.bankCode) clearMessages();
              // }}
              onChangeText={(text) => {
                setBankCode(text);
                // 👇 CHANGED LINE HERE
                if (errors.bankCode || errors.general) clearMessages();
              }}
              style={[styles.input, errors.bankCode && styles.inputError]}
              autoCapitalize="sentences"
            />
            {errors.bankCode ? (
              <Text style={styles.fieldErrorText}>{errors.bankCode}</Text>
            ) : null}
            <TextInput
              placeholder="User ID"
              placeholderTextColor="#F9B300"
              value={userId}
              // onChangeText={(text) => {
              //   setUserId(text);
              //   if (errors.userId) clearMessages();
              // }}
              onChangeText={(text) => {
                setUserId(text);
                // 👇 CHANGED LINE HERE
                if (errors.userId || errors.general) clearMessages();
              }}
              style={[styles.input, errors.userId && styles.inputError]}
              autoCapitalize="sentences"
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
        </ScrollView>
      </KeyboardAvoidingView>
      <Text style={styles.footerText}>
        <Text style={styles.footerCompany}>
          Silicon IT Solutions Private Limited
        </Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;

// ----------------------------------------------------
// 💅 STYLES
// ----------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FB",
  },

  kav: {
    flex: 1, // Must take up remaining space
    width: "100%", // Must take full width
  }, // 🌟 FIX: Added justifyContent: 'center' to center the content // and allow it to shift upwards correctly when the keyboard opens.

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
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
  }, // Retaining the large margin, but slightly adjusted the offset above.

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
    textAlign: "center",
    left: 0,
    right: 0,
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
