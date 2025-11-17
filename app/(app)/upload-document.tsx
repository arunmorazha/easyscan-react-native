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

// type VerificationMode = "CUSTOMER_ID" | "ACCOUNT_NUMBER";

// const UploadDocumentScreen: React.FC = () => {
//   const router = useRouter();
//   const [refNo, setRefNo] = useState<string>("");
//   const [mode, setMode] = useState<VerificationMode>("CUSTOMER_ID");
//   const [loading, setLoading] = useState<boolean>(false);

//   const showAlert = (title: string, message: string) => {
//     Alert.alert(title, message);
//   };

//   const clearRefNo = () => setRefNo("");

//   const handleVerify = async () => {
//     if (!refNo) {
//       showAlert("Error", "Please enter a Reference Number.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");

//       console.log("UserId:", userId);
//       console.log("CBSURL:", cbsUrl);

//       if (!userId || !cbsUrl) {
//         showAlert("Error", "Session expired. Please register and login again.");
//         router.replace("/(auth)/signup");
//         return;
//       }

//       const refType = mode === "CUSTOMER_ID" ? "C" : "A";

//       // 🔹 Build Verify API URL (no LoginSeqNo)
//       const verifyUrl = `${cbsUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}`;
//       console.log("🔹 Verify URL:", verifyUrl);

//       // 🔹 Call Verify API
//       const res = await api.get(verifyUrl);
//       const data = res.data;

//       console.log("🔹 Verify Response:", data);

//       // 🔹 Handle response
//       if (data.RC === "0") {
//         // ✅ Save this TokenNo specifically for the next upload
//         if (data.TokenNo) {
//           await AsyncStorage.setItem("LastVerifyToken", data.TokenNo);
//           console.log("🔐 Saved Verify Token:", data.TokenNo);
//         }

//         Alert.alert(
//           "Verification Success",
//           `Name: ${data.Name}\nAddress: ${data.Address}`,
//           [
//             {
//               text: "Continue",
//               onPress: () =>
//                 router.push({
//                   pathname: "/(app)/upload-details",
//                   params: {
//                     verificationType: mode,
//                     name: data.Name,
//                     address: data.Address,
//                     refNo,
//                   },
//                 }),
//             },
//           ]
//         );
//       } else {
//         showAlert(
//           "Error",
//           data.Message || "Invalid Reference Number or Verification Failed."
//         );
//       }
//     } catch (error) {
//       console.error("Verification Error:", error);
//       showAlert("Error", "Failed to connect to the server. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const RadioButton: React.FC<{
//     selected: boolean;
//     label: string;
//     onPress: () => void;
//   }> = ({ selected, label, onPress }) => (
//     <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
//       <MaterialCommunityIcons
//         name={selected ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={selected ? "#F9B300" : "#000"}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Upload Document</Text>
//       </View>

//       <View style={styles.contentContainer}>
//         <Text style={styles.scanText}>Scan</Text>

//         {/* Radio Buttons */}
//         <View style={styles.radioGroup}>
//           <RadioButton
//             selected={mode === "CUSTOMER_ID"}
//             label="Customer ID"
//             onPress={() => {
//               setMode("CUSTOMER_ID");
//               clearRefNo();
//             }}
//           />
//           <RadioButton
//             selected={mode === "ACCOUNT_NUMBER"}
//             label="Account Number"
//             onPress={() => {
//               setMode("ACCOUNT_NUMBER");
//               clearRefNo();
//             }}
//           />
//         </View>

//         {/* Input Field */}
//         <TextInput
//           placeholder="Ref No"
//           placeholderTextColor="#999"
//           value={refNo}
//           onChangeText={setRefNo}
//           style={styles.input}
//           keyboardType="default"
//           autoCapitalize="none"
//         />

//         {/* Verify Button */}
//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.6 }]}
//           onPress={handleVerify}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Verify</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDocumentScreen;

// // ===============================
// // 💅 STYLES
// // ===============================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6FB",
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
//   contentContainer: {
//     paddingHorizontal: "7.5%",
//     alignItems: "center",
//     marginTop: 60,
//   },
//   scanText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 30,
//   },
//   radioGroup: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//     marginBottom: 40,
//   },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 15,
//   },
//   radioLabel: {
//     marginLeft: 5,
//     fontSize: 16,
//     color: "#000",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     marginBottom: 30,
//     fontSize: 16,
//     color: "#000",
//   },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
// app/(app)/upload-document.tsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import api from "../../src/api/api";

// type VerificationMode = "CUSTOMER_ID" | "ACCOUNT_NUMBER";

// const UploadDocumentScreen: React.FC = () => {
//   const router = useRouter();
//   const [refNo, setRefNo] = useState<string>("");
//   const [mode, setMode] = useState<VerificationMode>("CUSTOMER_ID");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState({
//     refNo: "",
//     general: "",
//     session: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   const clearMessages = () => {
//     setErrors({ refNo: "", general: "", session: "" });
//     setSuccessMessage("");
//   };

//   const clearRefNo = () => {
//     setRefNo("");
//     clearMessages();
//   };

//   const handleVerify = async () => {
//     clearMessages();

//     if (!refNo.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         refNo: "Please enter a Reference Number",
//       }));
//       return;
//     }

//     try {
//       setLoading(true);

//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");

//       console.log("UserId:", userId);
//       console.log("CBSURL:", cbsUrl);

//       if (!userId || !cbsUrl) {
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please register and login again.",
//         }));
//         setTimeout(() => {
//           router.replace("/(auth)/signup");
//         }, 2000);
//         return;
//       }

//       const refType = mode === "CUSTOMER_ID" ? "C" : "A";

//       // 🔹 Build Verify API URL (no LoginSeqNo)
//       const verifyUrl = `${cbsUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}`;
//       // console.log("🔹 Verify URL:", verifyUrl);

//       // 🔹 Call Verify API
//       const res = await api.get(verifyUrl);
//       const data = res.data;

//       // console.log("🔹 Verify Response:", data);

//       // 🔹 Handle response
//       if (data.RC === "0") {
//         // ✅ Save this TokenNo specifically for the next upload
//         // if (data.TokenNo) {
//         //   await AsyncStorage.setItem("LastVerifyToken", data.TokenNo);
//         //   console.log("🔐 Saved Verify Token:", data.TokenNo);
//         // }
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         const updatedToken = await AsyncStorage.getItem("TokenNo");
//         console.log("🔐 Token after verify:", updatedToken);

//         // setSuccessMessage("Verification successful! Redirecting...");

//         // Auto navigate after 1 second
//         setTimeout(() => {
//           router.push({
//             pathname: "/(app)/upload-details",
//             params: {
//               verificationType: mode,
//               name: data.Name,
//               address: data.Address,
//               refNo,
//             },
//           });
//         }, 200);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general:
//             data.Message || "Invalid Reference Number or Verification Failed.",
//         }));
//       }
//     } catch (error) {
//       console.error("Verification Error:", error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const RadioButton: React.FC<{
//     selected: boolean;
//     label: string;
//     onPress: () => void;
//   }> = ({ selected, label, onPress }) => (
//     <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
//       <MaterialCommunityIcons
//         name={selected ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={selected ? "#F9B300" : "#000"}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Upload Document</Text>
//       </View>

//       <View style={styles.contentContainer}>
//         <Text style={styles.scanText}>Scan</Text>

//         {/* Session Error */}
//         {errors.session ? (
//           <View style={styles.sessionErrorContainer}>
//             <MaterialCommunityIcons
//               name="alert-circle"
//               size={20}
//               color="#F44336"
//             />
//             <View style={styles.sessionErrorTextContainer}>
//               <Text style={styles.sessionErrorText}>{errors.session}</Text>
//               <Text style={styles.sessionErrorSubtext}>
//                 Redirecting to registration...
//               </Text>
//             </View>
//           </View>
//         ) : null}

//         {/* Success Message */}
//         {successMessage ? (
//           <View style={styles.successContainer}>
//             <MaterialCommunityIcons
//               name="check-circle"
//               size={24}
//               color="#4CAF50"
//             />
//             <Text style={styles.successText}>{successMessage}</Text>
//           </View>
//         ) : null}

//         {/* Radio Buttons */}
//         <View style={styles.radioGroup}>
//           <RadioButton
//             selected={mode === "CUSTOMER_ID"}
//             label="Customer ID"
//             onPress={() => {
//               setMode("CUSTOMER_ID");
//               clearRefNo();
//             }}
//           />
//           <RadioButton
//             selected={mode === "ACCOUNT_NUMBER"}
//             label="Account Number"
//             onPress={() => {
//               setMode("ACCOUNT_NUMBER");
//               clearRefNo();
//             }}
//           />
//         </View>

//         {/* Input Field */}
//         <TextInput
//           placeholder="Ref No"
//           placeholderTextColor="#999"
//           value={refNo}
//           onChangeText={(text) => {
//             setRefNo(text);
//             if (errors.refNo || errors.general) clearMessages();
//           }}
//           style={[styles.input, errors.refNo && styles.inputError]}
//           keyboardType="default"
//           autoCapitalize="none"
//         />
//         {errors.refNo ? (
//           <Text style={styles.fieldErrorText}>{errors.refNo}</Text>
//         ) : null}

//         {/* General Error */}
//         {errors.general ? (
//           <View style={styles.errorContainer}>
//             <MaterialCommunityIcons
//               name="alert-circle"
//               size={20}
//               color="#F44336"
//             />
//             <Text style={styles.errorText}>{errors.general}</Text>
//           </View>
//         ) : null}

//         {/* Verify Button */}
//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleVerify}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Verify</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDocumentScreen;

// // ===============================
// // 💅 STYLES
// // ===============================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6FB",
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
//   contentContainer: {
//     paddingHorizontal: "7.5%",
//     alignItems: "center",
//     marginTop: 60,
//   },
//   scanText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginTop: 130,
//     marginBottom: 30,
//   },
//   radioGroup: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//     marginBottom: 40,
//   },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 15,
//   },
//   radioLabel: {
//     marginLeft: 5,
//     fontSize: 16,
//     color: "#000",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "white",
//     borderRadius: 8,
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
//   fieldErrorText: {
//     color: "#F44336",
//     fontSize: 12,
//     alignSelf: "flex-start",
//     marginLeft: 15,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#9E9E9E",
//     opacity: 0.6,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
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
//   sessionErrorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFEBEE",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     width: "100%",
//     borderLeftWidth: 4,
//     borderLeftColor: "#F44336",
//   },
//   sessionErrorTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   sessionErrorText: {
//     color: "#D32F2F",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   sessionErrorSubtext: {
//     color: "#D32F2F",
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   successContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E8F5E8",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     width: "100%",
//     borderLeftWidth: 4,
//     borderLeftColor: "#4CAF50",
//   },
//   successText: {
//     color: "#2E7D32",
//     marginLeft: 8,
//     fontSize: 14,
//     flex: 1,
//     fontWeight: "bold",
//   },
// });
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import api from "../../src/api/api";

// type VerificationMode = "CUSTOMER_ID" | "ACCOUNT_NUMBER";

// const UploadDocumentScreen: React.FC = () => {
//   const router = useRouter();
//   const [refNo, setRefNo] = useState<string>("");
//   const [mode, setMode] = useState<VerificationMode>("CUSTOMER_ID");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState({
//     refNo: "",
//     general: "",
//     session: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   const clearMessages = () => {
//     setErrors({ refNo: "", general: "", session: "" });
//     setSuccessMessage("");
//   };

//   const clearRefNo = () => {
//     setRefNo("");
//     clearMessages();
//   };

//   const handleVerify = async () => {
//     clearMessages();

//     if (!refNo.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         refNo: "Please enter a Reference Number",
//       }));
//       return;
//     }

//     try {
//       setLoading(true);

//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");

//       console.log("UserId:", userId);
//       console.log("CBSURL:", cbsUrl);

//       if (!userId || !cbsUrl) {
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please register and login again.",
//         }));
//         setTimeout(() => {
//           router.replace("/(auth)/signup");
//         }, 2000);
//         return;
//       }

//       const refType = mode === "CUSTOMER_ID" ? "C" : "A";

//       // 🔹 Build Verify API URL (no LoginSeqNo)
//       const verifyUrl = `${cbsUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}`;
//       // console.log("🔹 Verify URL:", verifyUrl);

//       // 🔹 Call Verify API
//       const res = await api.get(verifyUrl);
//       const data = res.data;

//       // console.log("🔹 Verify Response:", data);

//       // 🔹 Handle response
//       if (data.RC === "0") {
//         // ✅ Save this TokenNo specifically for the next upload
//         // if (data.TokenNo) {
//         //   await AsyncStorage.setItem("LastVerifyToken", data.TokenNo);
//         //   console.log("🔐 Saved Verify Token:", data.TokenNo);
//         // }
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         const updatedToken = await AsyncStorage.getItem("TokenNo");
//         console.log("🔐 Token after verify:", updatedToken);

//         // setSuccessMessage("Verification successful! Redirecting...");

//         // Auto navigate after 1 second
//         setTimeout(() => {
//           router.push({
//             pathname: "/(app)/upload-details",
//             params: {
//               verificationType: mode,
//               name: data.Name,
//               address: data.Address,
//               refNo,
//             },
//           });
//         }, 200);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general:
//             data.Message || "Invalid Reference Number or Verification Failed.",
//         }));
//       }
//     } catch (error) {
//       console.error("Verification Error:", error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const RadioButton: React.FC<{
//     selected: boolean;
//     label: string;
//     onPress: () => void;
//   }> = ({ selected, label, onPress }) => (
//     <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
//       <MaterialCommunityIcons
//         name={selected ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={selected ? "#F9B300" : "#000"}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header with Back Button */}
//       <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
//         <View style={styles.header}>
//           <View style={styles.left}>
//             <TouchableOpacity
//               onPress={() => router.replace("/(app)/dashboard")}
//             >
//               <MaterialCommunityIcons
//                 name="arrow-left"
//                 size={26}
//                 color="white"
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.center}>
//             <Text style={styles.headerText}>Upload Document</Text>
//           </View>

//           <View style={styles.right} />
//         </View>
//       </SafeAreaView>

//       <View style={styles.contentContainer}>
//         <Text style={styles.scanText}>Scan</Text>

//         {/* Session Error */}
//         {errors.session ? (
//           <View style={styles.sessionErrorContainer}>
//             <MaterialCommunityIcons
//               name="alert-circle"
//               size={20}
//               color="#F44336"
//             />
//             <View style={styles.sessionErrorTextContainer}>
//               <Text style={styles.sessionErrorText}>{errors.session}</Text>
//               <Text style={styles.sessionErrorSubtext}>
//                 Redirecting to registration...
//               </Text>
//             </View>
//           </View>
//         ) : null}

//         {/* Success Message */}
//         {successMessage ? (
//           <View style={styles.successContainer}>
//             <MaterialCommunityIcons
//               name="check-circle"
//               size={24}
//               color="#4CAF50"
//             />
//             <Text style={styles.successText}>{successMessage}</Text>
//           </View>
//         ) : null}

//         {/* Radio Buttons */}
//         <View style={styles.radioGroup}>
//           <RadioButton
//             selected={mode === "CUSTOMER_ID"}
//             label="Customer ID"
//             onPress={() => {
//               setMode("CUSTOMER_ID");
//               clearRefNo();
//             }}
//           />
//           <RadioButton
//             selected={mode === "ACCOUNT_NUMBER"}
//             label="Account Number"
//             onPress={() => {
//               setMode("ACCOUNT_NUMBER");
//               clearRefNo();
//             }}
//           />
//         </View>

//         {/* Input Field */}
//         <TextInput
//           placeholder="Ref No"
//           placeholderTextColor="#999"
//           value={refNo}
//           onChangeText={(text) => {
//             setRefNo(text);
//             if (errors.refNo || errors.general) clearMessages();
//           }}
//           style={[styles.input, errors.refNo && styles.inputError]}
//           keyboardType="default"
//           autoCapitalize="none"
//         />
//         {errors.refNo ? (
//           <Text style={styles.fieldErrorText}>{errors.refNo}</Text>
//         ) : null}

//         {/* General Error */}
//         {errors.general ? (
//           <View style={styles.errorContainer}>
//             <MaterialCommunityIcons
//               name="alert-circle"
//               size={20}
//               color="#F44336"
//             />
//             <Text style={styles.errorText}>{errors.general}</Text>
//           </View>
//         ) : null}

//         {/* Verify Button */}
//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleVerify}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Verify</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDocumentScreen;

// // ===============================
// // 💅 STYLES
// // ===============================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6FB",
//   },
//   header: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     paddingTop: 10,
//     paddingBottom: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   left: {
//     width: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   right: {
//     width: 50,
//   },
//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//   },
//   contentContainer: {
//     paddingHorizontal: "7.5%",
//     alignItems: "center",
//     marginTop: 60,
//   },
//   scanText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginTop: 130,
//     marginBottom: 30,
//   },
//   radioGroup: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//     marginBottom: 40,
//   },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 15,
//   },
//   radioLabel: {
//     marginLeft: 5,
//     fontSize: 16,
//     color: "#000",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "white",
//     borderRadius: 8,
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
//   fieldErrorText: {
//     color: "#F44336",
//     fontSize: 12,
//     alignSelf: "flex-start",
//     marginLeft: 15,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#9E9E9E",
//     opacity: 0.6,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
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
//   sessionErrorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFEBEE",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     width: "100%",
//     borderLeftWidth: 4,
//     borderLeftColor: "#F44336",
//   },
//   sessionErrorTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   sessionErrorText: {
//     color: "#D32F2F",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   sessionErrorSubtext: {
//     color: "#D32F2F",
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   successContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E8F5E8",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     width: "100%",
//     borderLeftWidth: 4,
//     borderLeftColor: "#4CAF50",
//   },
//   successText: {
//     color: "#2E7D32",
//     marginLeft: 8,
//     fontSize: 14,
//     flex: 1,
//     fontWeight: "bold",
//   },
// });
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../src/api/api";

type VerificationMode = "CUSTOMER_ID" | "ACCOUNT_NUMBER";

const UploadDocumentScreen: React.FC = () => {
  const router = useRouter();
  const [refNo, setRefNo] = useState<string>("");
  const [mode, setMode] = useState<VerificationMode>("CUSTOMER_ID");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    refNo: "",
    general: "",
    session: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setErrors({ refNo: "", general: "", session: "" });
    setSuccessMessage("");
  };

  const clearRefNo = () => {
    setRefNo("");
    clearMessages();
  };

  const handleVerify = async () => {
    clearMessages();

    if (!refNo.trim()) {
      setErrors((prev) => ({
        ...prev,
        refNo: "Please enter a Reference Number",
      }));
      return;
    }

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("UserId");
      const cbsUrl = await AsyncStorage.getItem("CBSURL");

      console.log("UserId:", userId);
      console.log("CBSURL:", cbsUrl);

      if (!userId || !cbsUrl) {
        setErrors((prev) => ({
          ...prev,
          session: "Session expired. Please register and login again.",
        }));
        setTimeout(() => {
          router.replace("/(auth)/signup");
        }, 2000);
        return;
      }

      const refType = mode === "CUSTOMER_ID" ? "C" : "A";

      // 🔹 Build Verify API URL (no LoginSeqNo)
      const verifyUrl = `${cbsUrl}?RequestID=Verify&RefType=${refType}&RefNo=${refNo}&UserID=${userId}`;
      // console.log("🔹 Verify URL:", verifyUrl);

      // 🔹 Call Verify API
      const res = await api.get(verifyUrl);
      const data = res.data;

      // console.log("🔹 Verify Response:", data);

      // 🔹 Handle response
      if (data.RC === "0") {
        // ✅ Save this TokenNo specifically for the next upload
        // if (data.TokenNo) {
        //   await AsyncStorage.setItem("LastVerifyToken", data.TokenNo);
        //   console.log("🔐 Saved Verify Token:", data.TokenNo);
        // }
        await new Promise((resolve) => setTimeout(resolve, 100));
        const updatedToken = await AsyncStorage.getItem("TokenNo");
        console.log("🔐 Token after verify:", updatedToken);

        // setSuccessMessage("Verification successful! Redirecting...");

        // Auto navigate after 1 second
        setTimeout(() => {
          router.push({
            pathname: "/(app)/upload-details",
            params: {
              verificationType: mode,
              name: data.Name,
              address: data.Address,
              refNo,
            },
          });
        }, 200);
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            data.Message || "Invalid Reference Number or Verification Failed.",
        }));
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const RadioButton: React.FC<{
    selected: boolean;
    label: string;
    onPress: () => void;
  }> = ({ selected, label, onPress }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <MaterialCommunityIcons
        name={selected ? "radiobox-marked" : "radiobox-blank"}
        size={24}
        color={selected ? "#F9B300" : "#000"}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header with Back Button */}
      <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
        <View style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity
              onPress={() => router.replace("/(app)/dashboard")}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.center}>
            <Text style={styles.headerText}>Upload Document</Text>
          </View>

          <View style={styles.right} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.scanText}>Scan</Text>

          {/* Session Error */}
          {errors.session ? (
            <View style={styles.sessionErrorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color="#F44336"
              />
              <View style={styles.sessionErrorTextContainer}>
                <Text style={styles.sessionErrorText}>{errors.session}</Text>
                <Text style={styles.sessionErrorSubtext}>
                  Redirecting to registration...
                </Text>
              </View>
            </View>
          ) : null}

          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Radio Buttons */}
          <View style={styles.radioGroup}>
            <RadioButton
              selected={mode === "CUSTOMER_ID"}
              label="Customer ID"
              onPress={() => {
                setMode("CUSTOMER_ID");
                clearRefNo();
              }}
            />
            <RadioButton
              selected={mode === "ACCOUNT_NUMBER"}
              label="Account Number"
              onPress={() => {
                setMode("ACCOUNT_NUMBER");
                clearRefNo();
              }}
            />
          </View>

          {/* Input Field */}
          <TextInput
            placeholder="Ref No"
            placeholderTextColor="#999"
            value={refNo}
            onChangeText={(text) => {
              setRefNo(text);
              if (errors.refNo || errors.general) clearMessages();
            }}
            style={[styles.input, errors.refNo && styles.inputError]}
            keyboardType="default"
            autoCapitalize="none"
          />
          {errors.refNo ? (
            <Text style={styles.fieldErrorText}>{errors.refNo}</Text>
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

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UploadDocumentScreen;

// ===============================
// 💅 STYLES
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FB",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#F9B300",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    width: 50,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  contentContainer: {
    paddingHorizontal: "7.5%",
    alignItems: "center",
    marginTop: 60,
    paddingBottom: 40,
  },
  scanText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 130,
    marginBottom: 30,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 40,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
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
  fieldErrorText: {
    color: "#F44336",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#673AB7",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
  sessionErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  sessionErrorTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  sessionErrorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sessionErrorSubtext: {
    color: "#D32F2F",
    fontSize: 12,
    opacity: 0.8,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  successText: {
    color: "#2E7D32",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    fontWeight: "bold",
  },
});
