// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import api from "../../src/api/api";

// type DocumentType = "PHOTO" | "SIGNATURE" | "OTHERS";

// const UploadDetailsScreen: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   // ✅ Parameters passed from UploadDocumentScreen
//   const verificationType = params.verificationType as string;
//   const refNo = params.refNo as string;
//   const name = params.name as string;
//   const address = params.address as string;

//   const isCustomerIdVerified = verificationType === "CUSTOMER_ID";

//   const [docType, setDocType] = useState<DocumentType>("PHOTO");
//   const [description, setDescription] = useState<string>("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // ==============================
//   // 📸 IMAGE PICKER (Camera or Gallery)
//   // ==============================
//   const pickImage = async (fromCamera: boolean) => {
//     try {
//       let result;
//       if (fromCamera) {
//         result = await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       } else {
//         result = await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       }

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         setImageUri(uri);
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       Alert.alert("Error", "Failed to pick image.");
//     }
//   };

//   // ==============================
//   // 📤 HANDLE DOCUMENT UPLOAD
//   // ==============================
//   const handleUpload = async () => {
//     if (!imageUri) {
//       Alert.alert("Error", "Please select an image first.");
//       return;
//     }

//     if (!description.trim()) {
//       Alert.alert("Error", "Please provide a document description.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔹 Retrieve saved credentials from AsyncStorage
//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");
//       console.log("USER_ID FROM ASYNC STORA USER-DETAIL", userId);
//       console.log("CBSURL FROM ASYNC STORA USER-DETAIL", cbsUrl);

//       if (!userId || !cbsUrl) {
//         Alert.alert("Error", "Session expired. Please login again.");
//         router.replace("/(auth)/signup");
//         return;
//       }

//       // 🔹 Prepare FormData for the file upload
//       const formData = new FormData();
//       formData.append("RequestID", "UpdateDoc");
//       formData.append("UserID", userId);
//       formData.append(
//         "RefType",
//         verificationType === "CUSTOMER_ID" ? "C" : "A"
//       );
//       formData.append("RefNo", refNo);
//       formData.append("DocDescription", description);
//       formData.append(
//         "DocType",
//         docType === "PHOTO" ? "P" : docType === "SIGNATURE" ? "S" : "O"
//       );

//       // ✅ Append image file
//       formData.append("ImageName", {
//         uri: imageUri,
//         name: `${docType.toLowerCase()}.jpg`,
//         type: "image/jpeg",
//       } as any);

//       console.log("🔹 Uploading document with data:", {
//         RefNo: refNo,
//         DocType: docType,
//         Description: description,
//       });

//       // 🔹 Perform the API call using Axios (interceptor attaches TokenNo)
//       const response = await api.post(cbsUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = response.data;
//       console.log("✅ Upload Response:", data);

//       // 🔹 Handle API response
//       if (data.RC === "0") {
//         Alert.alert("✅ Success", "Document uploaded successfully!", [
//           { text: "OK", onPress: () => router.back() },
//         ]);
//       } else if (
//         data.RC === "401" ||
//         data.Message === "Authentication Failed"
//       ) {
//         // ⚠️ Backend says authentication failed (token invalid)
//         console.warn("⚠️ Authentication failed — likely old token used");
//         Alert.alert(
//           "Session Expired",
//           "Your session is invalid. Please login again.",
//           [
//             {
//               text: "OK",
//               onPress: async () => {
//                 await AsyncStorage.clear();
//                 router.replace("/(auth)/signin");
//               },
//             },
//           ]
//         );
//       } else {
//         Alert.alert(
//           "Error",
//           data.Message || "Upload failed. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       Alert.alert(
//         "Error",
//         "Failed to upload document. Please check connection."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // 🔘 REUSABLE RADIO BUTTON COMPONENT
//   // ==============================
//   const RadioButton = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: DocumentType;
//   }) => (
//     <TouchableOpacity
//       style={styles.radioContainer}
//       onPress={() => setDocType(value)}
//     >
//       <MaterialCommunityIcons
//         name={docType === value ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={docType === value ? "#F9B300" : "#A0A0A0"}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   // ==============================
//   // 🧱 UI Layout
//   // ==============================
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={styles.backButton}
//         >
//           <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Upload Document</Text>
//       </View>

//       <View style={styles.contentContainer}>
//         {/* Display verified customer details */}
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Name:</Text> {name}
//         </Text>
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Address:</Text> {address}
//         </Text>

//         {/* Only show DocType options if verified by Customer ID */}
//         {isCustomerIdVerified && (
//           <View style={styles.documentTypeSection}>
//             <RadioButton label="Photo" value="PHOTO" />
//             <RadioButton label="Signature" value="SIGNATURE" />
//             <RadioButton label="Others" value="OTHERS" />
//           </View>
//         )}

//         {/* Document description input */}
//         <TextInput
//           placeholder="Document Description"
//           placeholderTextColor="#A0A0A0"
//           value={description}
//           onChangeText={setDescription}
//           style={styles.descriptionInput}
//           multiline
//         />

//         {/* Image Picker Section */}
//         <View
//           style={[styles.uploadArea, imageUri && styles.imagePreviewContainer]}
//         >
//           {imageUri ? (
//             <View style={styles.imagePreviewWrapper}>
//               <Image
//                 source={{ uri: imageUri }}
//                 style={styles.imagePreview}
//                 resizeMode="cover"
//               />
//               <Text style={styles.imageReadyText}>Image Ready</Text>
//               <TouchableOpacity
//                 onPress={() => setImageUri(null)}
//                 style={styles.reselectButton}
//               >
//                 <Text style={styles.reselectText}>Select Another</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(true)}
//               >
//                 <MaterialCommunityIcons
//                   name="camera"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(false)}
//               >
//                 <MaterialCommunityIcons
//                   name="image"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Gallery</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         {/* Upload Button */}
//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.7 }]}
//           onPress={handleUpload}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Upload</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDetailsScreen;

// // ==============================
// // 💅 STYLES
// // ==============================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFF6FB" },
//   header: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     paddingVertical: 20,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//     marginTop: 20,
//   },
//   backButton: { position: "absolute", left: 15, paddingVertical: 20 },
//   contentContainer: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
//   detailText: { fontSize: 16, color: "#000", marginBottom: 5 },
//   detailLabel: { fontWeight: "bold" },
//   documentTypeSection: { marginTop: 20, marginBottom: 20 },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   radioLabel: { marginLeft: 10, fontSize: 16, color: "#000" },
//   descriptionInput: {
//     width: "100%",
//     minHeight: 50,
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A0A0A0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 30,
//     fontSize: 16,
//     color: "#000",
//   },
//   uploadArea: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eee",
//     paddingVertical: 40,
//     marginBottom: 40,
//   },
//   uploadOption: { alignItems: "center" },
//   uploadText: { marginTop: 5, fontSize: 14, color: "#707070" },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignSelf: "center",
//     alignItems: "center",
//   },
//   buttonText: { fontSize: 18, fontWeight: "bold", color: "white" },
//   imagePreviewContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//   },
//   imagePreviewWrapper: { alignItems: "center", width: "100%" },
//   imagePreview: {
//     width: "90%",
//     height: 150,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginBottom: 10,
//   },
//   imageReadyText: { fontSize: 16, fontWeight: "bold", color: "#F9B300" },
//   reselectButton: {
//     marginTop: 5,
//     backgroundColor: "#eee",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   reselectText: { fontSize: 14, color: "#000" },
// });
// app/(app)/upload-details.tsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import api from "../../src/api/api";

// type DocumentType = "PHOTO" | "SIGNATURE" | "OTHERS";

// const UploadDetailsScreen: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   // ✅ Parameters passed from UploadDocumentScreen
//   const verificationType = params.verificationType as string;
//   const refNo = params.refNo as string;
//   const name = params.name as string;
//   const address = params.address as string;

//   const isCustomerIdVerified = verificationType === "CUSTOMER_ID";

//   const [docType, setDocType] = useState<DocumentType>("PHOTO");
//   const [description, setDescription] = useState<string>("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState({
//     image: "",
//     description: "",
//     general: "",
//     session: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   const clearMessages = () => {
//     setErrors({ image: "", description: "", general: "", session: "" });
//     setSuccessMessage("");
//   };

//   // ==============================
//   // 📸 IMAGE PICKER (Camera or Gallery)
//   // ==============================
//   const pickImage = async (fromCamera: boolean) => {
//     try {
//       let result;
//       if (fromCamera) {
//         result = await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       } else {
//         result = await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       }

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         setImageUri(uri);
//         clearMessages();
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       setErrors((prev) => ({ ...prev, general: "Failed to pick image." }));
//     }
//   };

//   // ==============================
//   // 📤 HANDLE DOCUMENT UPLOAD
//   // ==============================
//   const handleUpload = async () => {
//     clearMessages();

//     if (!imageUri) {
//       setErrors((prev) => ({
//         ...prev,
//         image: "Please select an image first.",
//       }));
//       return;
//     }

//     if (!description.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         description: "Please provide a document description.",
//       }));
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔹 Retrieve saved credentials from AsyncStorage
//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");
//       // console.log("USER_ID FROM ASYNC STORA USER-DETAIL", userId);
//       // console.log("CBSURL FROM ASYNC STORA USER-DETAIL", cbsUrl);

//       if (!userId || !cbsUrl) {
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           router.replace("/(auth)/signup");
//         }, 2000);
//         return;
//       }

//       // 🔹 Prepare FormData for the file upload
//       const formData = new FormData();
//       formData.append("RequestID", "UpdateDoc");
//       formData.append("UserID", userId);
//       formData.append(
//         "RefType",
//         verificationType === "CUSTOMER_ID" ? "C" : "A"
//       );
//       formData.append("RefNo", refNo);
//       formData.append("DocDescription", description);
//       formData.append(
//         "DocType",
//         docType === "PHOTO" ? "P" : docType === "SIGNATURE" ? "S" : "O"
//       );

//       // ✅ Append image file
//       formData.append("ImageName", {
//         uri: imageUri,
//         name: `${docType.toLowerCase()}.jpg`,
//         type: "image/jpeg",
//       } as any);

//       console.log("🔹 Uploading document with data:", {
//         RefNo: refNo,
//         DocType: docType,
//         Description: description,
//       });

//       // 🔹 Perform the API call using Axios (interceptor attaches TokenNo)
//       const response = await api.post(cbsUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = response.data;
//       console.log("✅ Upload Response:", data);

//       // 🔹 Handle API response
//       if (data.RC === "0") {
//         setSuccessMessage("Document uploaded successfully!");

//         // Auto navigate back after 1.5 seconds
//         setTimeout(() => {
//           router.back();
//         }, 500);
//       } else if (
//         data.RC === "401" ||
//         data.Message === "Authentication Failed"
//       ) {
//         // ⚠️ Backend says authentication failed (token invalid)
//         console.warn("⚠️ Authentication failed — likely old token used");
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           AsyncStorage.clear();
//           router.replace("/(auth)/signin");
//         }, 2000);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general: data.Message || "Upload failed. Please try again.",
//         }));
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // 🔘 REUSABLE RADIO BUTTON COMPONENT
//   // ==============================
//   const RadioButton = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: DocumentType;
//   }) => (
//     <TouchableOpacity
//       style={[
//         styles.radioContainer,
//         docType === value && styles.radioActiveBackground, // Apply active background
//       ]}
//       onPress={() => setDocType(value)}
//     >
//       <MaterialCommunityIcons
//         name={docType === value ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={docType === value ? "#673AB7" : "#A0A0A0"} // Dark purple for active icon
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   // ==============================
//   // 🧱 UI Layout
//   // ==============================
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       {/* <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={styles.backButton}
//         >
//           <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Upload Document</Text>
//       </View> */}
//       <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
//         <View style={styles.header}>
//           <View style={styles.left}>
//             <TouchableOpacity onPress={() => router.back()}>
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
//         {/* Display verified customer details */}
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Name:</Text> {name}
//         </Text>
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Address:</Text> {address}
//         </Text>

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
//                 Redirecting to login...
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

//         {/* Only show DocType options if verified by Customer ID */}
//         {isCustomerIdVerified && (
//           <View style={styles.documentTypeSection}>
//             <RadioButton label="Photo" value="PHOTO" />
//             <RadioButton label="Signature" value="SIGNATURE" />
//             <RadioButton label="Others" value="OTHERS" />
//           </View>
//         )}

//         {/* Document description input */}
//         <TextInput
//           placeholder="Document Description"
//           placeholderTextColor="#A0A0A0"
//           value={description}
//           onChangeText={(text) => {
//             setDescription(text);
//             if (errors.description) clearMessages();
//           }}
//           style={[
//             styles.descriptionInput,
//             errors.description && styles.inputError,
//           ]}
//           multiline
//         />
//         {errors.description ? (
//           <Text style={styles.fieldErrorText}>{errors.description}</Text>
//         ) : null}

//         {/* Image Picker Section */}
//         <View
//           style={[styles.uploadArea, imageUri && styles.imagePreviewContainer]}
//         >
//           {imageUri ? (
//             <View style={styles.imagePreviewWrapper}>
//               <Image
//                 source={{ uri: imageUri }}
//                 style={styles.imagePreview}
//                 resizeMode="cover"
//               />
//               {/* <Text style={styles.imageReadyText}>Image Ready</Text> */}
//               <TouchableOpacity
//                 onPress={() => {
//                   setImageUri(null);
//                   clearMessages();
//                 }}
//                 style={styles.reselectButton}
//               >
//                 <Text style={styles.reselectText}>Select Another</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(true)}
//               >
//                 <MaterialCommunityIcons
//                   name="camera"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(false)}
//               >
//                 <MaterialCommunityIcons
//                   name="image"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Gallery</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//         {errors.image ? (
//           <Text style={styles.fieldErrorText}>{errors.image}</Text>
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

//         {/* Upload Button */}
//         <TouchableOpacity
//           style={[
//             styles.button,
//             (loading || successMessage) && styles.buttonDisabled,
//           ]}
//           onPress={handleUpload}
//           disabled={loading || !!successMessage}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>
//               {successMessage ? "Uploaded Successfully" : "Upload"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDetailsScreen;

// // ==============================
// // 💅 STYLES
// // ==============================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFF6FB" },
//   header: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     // paddingTop: StatusBar.currentHeight,
//     paddingTop: 10,
//     paddingBottom: 15,
//     flexDirection: "row",
//     alignItems: "center", // <-- Vertically center all children
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
//     width: 50, // balance the layout so title stays centered
//   },

//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//   },

//   // header: {
//   //   backgroundColor: "#F9B300",
//   //   width: "100%",
//   //   paddingVertical: 20,
//   //   alignItems: "center",
//   //   flexDirection: "row",
//   //   justifyContent: "center",
//   // },
//   // headerText: {
//   //   fontSize: 26,
//   //   fontWeight: "bold",
//   //   color: "white",
//   //   marginTop: 20,
//   // },
//   backButton: { position: "absolute", left: 15, paddingVertical: 20 },
//   contentContainer: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
//   detailText: { fontSize: 16, color: "#000", marginBottom: 5 },
//   detailLabel: { fontWeight: "bold" },
//   documentTypeSection: { marginTop: 20, marginBottom: 20 },
//   // radioContainer: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   marginBottom: 10,
//   // },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     padding: 12,
//     borderRadius: 8,
//     // borderWidth: 1,
//     // borderColor: "#E0E0E0",
//     // backgroundColor: "white",
//   },
//   radioActiveBackground: {
//     backgroundColor: "#EDE7F6", // Very light purple (Deep Purple 50)
//     borderColor: "#673AB7", // Border color matches the main dark purple
//   },
//   radioLabel: { marginLeft: 10, fontSize: 16, color: "#000" },
//   descriptionInput: {
//     width: "100%",
//     minHeight: 50,
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A0A0A0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 8,
//     fontSize: 16,
//     color: "#000",
//     marginTop: 20,
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
//   uploadArea: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eee",
//     paddingVertical: 40,
//     marginBottom: 20,
//   },
//   uploadOption: { alignItems: "center" },
//   uploadText: { marginTop: 5, fontSize: 14, color: "#707070" },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignSelf: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#9E9E9E",
//     opacity: 0.6,
//   },
//   buttonText: { fontSize: 18, fontWeight: "bold", color: "white" },
//   imagePreviewContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//   },
//   imagePreviewWrapper: { alignItems: "center", width: "100%" },
//   imagePreview: {
//     width: "90%",
//     height: 150,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginBottom: 10,
//   },
//   imageReadyText: { fontSize: 16, fontWeight: "bold", color: "#F9B300" },
//   reselectButton: {
//     marginTop: 5,
//     backgroundColor: "#eee",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   reselectText: { fontSize: 14, color: "#000" },
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
// =======================================PERMISSION REQUES LOGIC
// app/(app)/upload-details.tsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert, // 💡 Import Alert for permission error messages
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import api from "../../src/api/api";

// type DocumentType = "PHOTO" | "SIGNATURE" | "OTHERS";

// const UploadDetailsScreen: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   // ✅ Parameters passed from UploadDocumentScreen
//   const verificationType = params.verificationType as string;
//   const refNo = params.refNo as string;
//   const name = params.name as string;
//   const address = params.address as string;

//   const isCustomerIdVerified = verificationType === "CUSTOMER_ID";

//   const [docType, setDocType] = useState<DocumentType>("PHOTO");
//   const [description, setDescription] = useState<string>("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState({
//     image: "",
//     description: "",
//     general: "",
//     session: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   const clearMessages = () => {
//     setErrors({ image: "", description: "", general: "", session: "" });
//     setSuccessMessage("");
//   };

//   const pickImage = async (fromCamera: boolean) => {
//     clearMessages(); // Clear existing error messages

//     try {
//       // 💡 CORRECTED: Use a variable that can hold the permission response type.
//       // The permission response is NOT an Asset.
//       let permissionResponse:
//         | ImagePicker.MediaLibraryPermissionResponse
//         | ImagePicker.CameraPermissionResponse
//         | null;

//       // 1. Request Permission
//       if (fromCamera) {
//         permissionResponse = await ImagePicker.requestCameraPermissionsAsync();
//       } else {
//         permissionResponse =
//           await ImagePicker.requestMediaLibraryPermissionsAsync();
//       }

//       // 2. Check Permission Status
//       // The 'granted' property is always present on the permission response object.
//       if (!permissionResponse || !permissionResponse.granted) {
//         const type = fromCamera ? "Camera" : "Gallery (Media Library)";
//         Alert.alert(
//           "Permission Required",
//           `Permission to access ${type} is required to select an image for upload.`
//         );
//         return; // Stop execution if permission is denied
//       }

//       // 3. Launch Picker/Camera
//       let result;
//       if (fromCamera) {
//         result = await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       } else {
//         result = await ImagePicker.launchImageLibraryAsync({
//           allowsEditing: true,
//           quality: 0.8,
//         });
//       }

//       // 4. Handle Result
//       if (!result.canceled) {
//         const uri = result.assets[0].uri;
//         setImageUri(uri);
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       setErrors((prev) => ({ ...prev, general: "Failed to pick image." }));
//     }
//   };

//   // ==============================
//   // 📤 HANDLE DOCUMENT UPLOAD
//   // ==============================
//   const handleUpload = async () => {
//     clearMessages();

//     if (!imageUri) {
//       setErrors((prev) => ({
//         ...prev,
//         image: "Please select an image first.",
//       }));
//       return;
//     }

//     if (!description.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         description: "Please provide a document description.",
//       }));
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔹 Retrieve saved credentials from AsyncStorage
//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");
//       // console.log("USER_ID FROM ASYNC STORA USER-DETAIL", userId);
//       // console.log("CBSURL FROM ASYNC STORA USER-DETAIL", cbsUrl);

//       if (!userId || !cbsUrl) {
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           router.replace("/(auth)/signup");
//         }, 2000);
//         return;
//       }

//       // 🔹 Prepare FormData for the file upload
//       const formData = new FormData();
//       formData.append("RequestID", "UpdateDoc");
//       formData.append("UserID", userId);
//       formData.append(
//         "RefType",
//         verificationType === "CUSTOMER_ID" ? "C" : "A"
//       );
//       formData.append("RefNo", refNo);
//       formData.append("DocDescription", description);
//       formData.append(
//         "DocType",
//         docType === "PHOTO" ? "P" : docType === "SIGNATURE" ? "S" : "O"
//       );

//       // ✅ Append image file
//       formData.append("ImageData", {
//         uri: imageUri,
//         name: `${docType.toLowerCase()}.jpg`,
//         type: "image/jpeg",
//       } as any);

//       console.log("🔹 Uploading document with data:", {
//         RefNo: refNo,
//         DocType: docType,
//         Description: description,
//       });

//       // 🔹 Perform the API call using Axios (interceptor attaches TokenNo)
//       const response = await api.post(cbsUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = response.data;
//       console.log("✅ Upload Response:RRRR", data.Msg);

//       // 🔹 Handle API response
//       if (data.RC === "0") {
//         setSuccessMessage("Document uploaded successfully!");

//         // Auto navigate back after 1.5 seconds
//         setTimeout(() => {
//           router.back();
//           // router.replace("/(app)/dashboard");
//         }, 500);
//       } else if (
//         data.RC === "401" ||
//         data.Message === "Authentication Failed"
//       ) {
//         // ⚠️ Backend says authentication failed (token invalid)
//         console.warn("⚠️ Authentication failed — likely old token used");
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           AsyncStorage.clear();
//           router.replace("/(auth)/signin");
//         }, 2000);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general:
//             data.Message || data.Msg || "Upload failed. Please try again.",
//         }));
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // 🔘 REUSABLE RADIO BUTTON COMPONENT
//   // ==============================
//   const RadioButton = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: DocumentType;
//   }) => (
//     <TouchableOpacity
//       style={[
//         styles.radioContainer,
//         docType === value && styles.radioActiveBackground, // Apply active background
//       ]}
//       onPress={() => setDocType(value)}
//     >
//       <MaterialCommunityIcons
//         name={docType === value ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={docType === value ? "#673AB7" : "#A0A0A0"} // Dark purple for active icon
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   // ==============================
//   // 🧱 UI Layout
//   // ==============================
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
//         <View style={styles.header}>
//           <View style={styles.left}>
//             <TouchableOpacity onPress={() => router.back()}>
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
//         {/* Display verified customer details */}
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Name:</Text> {name}
//         </Text>
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Address:</Text> {address}
//         </Text>

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
//                 Redirecting to login...
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

//         {/* Only show DocType options if verified by Customer ID */}
//         {isCustomerIdVerified && (
//           <View style={styles.documentTypeSection}>
//             <RadioButton label="Photo" value="PHOTO" />
//             <RadioButton label="Signature" value="SIGNATURE" />
//             <RadioButton label="Others" value="OTHERS" />
//           </View>
//         )}

//         {/* Document description input */}
//         <TextInput
//           placeholder="Document Description"
//           placeholderTextColor="#A0A0A0"
//           value={description}
//           onChangeText={(text) => {
//             setDescription(text);
//             if (errors.description) clearMessages();
//           }}
//           style={[
//             styles.descriptionInput,
//             errors.description && styles.inputError,
//           ]}
//           multiline
//         />
//         {errors.description ? (
//           <Text style={styles.fieldErrorText}>{errors.description}</Text>
//         ) : null}

//         {/* Image Picker Section */}
//         <View
//           style={[styles.uploadArea, imageUri && styles.imagePreviewContainer]}
//         >
//           {imageUri ? (
//             <View style={styles.imagePreviewWrapper}>
//               <Image
//                 source={{ uri: imageUri }}
//                 style={styles.imagePreview}
//                 resizeMode="cover"
//               />
//               {/* <Text style={styles.imageReadyText}>Image Ready</Text> */}
//               <TouchableOpacity
//                 onPress={() => {
//                   setImageUri(null);
//                   clearMessages();
//                 }}
//                 style={styles.reselectButton}
//               >
//                 <Text style={styles.reselectText}>Select Another</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(true)}
//               >
//                 <MaterialCommunityIcons
//                   name="camera"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(false)}
//               >
//                 <MaterialCommunityIcons
//                   name="image"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Gallery</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//         {errors.image ? (
//           <Text style={styles.fieldErrorText}>{errors.image}</Text>
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

//         {/* Upload Button */}
//         <TouchableOpacity
//           style={[
//             styles.button,
//             (loading || successMessage) && styles.buttonDisabled,
//           ]}
//           onPress={handleUpload}
//           disabled={loading || !!successMessage}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>
//               {successMessage ? "Uploaded Successfully" : "Update"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDetailsScreen;

// // ==============================
// // 💅 STYLES (No changes applied here from your last provided code block)
// // ==============================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFF6FB" },
//   header: {
//     backgroundColor: "#F9B300",
//     width: "100%",
//     // paddingTop: StatusBar.currentHeight,
//     paddingTop: 10,
//     paddingBottom: 15,
//     flexDirection: "row",
//     alignItems: "center", // <-- Vertically center all children
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
//     width: 50, // balance the layout so title stays centered
//   },

//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//   },
//   backButton: { position: "absolute", left: 15, paddingVertical: 20 },
//   contentContainer: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
//   detailText: { fontSize: 16, color: "#000", marginBottom: 5 },
//   detailLabel: { fontWeight: "bold" },
//   documentTypeSection: { marginTop: 20, marginBottom: 20 },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     padding: 12,
//     borderRadius: 8,
//     // borderWidth: 1,
//     // borderColor: "#E0E0E0",
//     // backgroundColor: "white",
//   },
//   radioActiveBackground: {
//     backgroundColor: "#EDE7F6", // Very light purple (Deep Purple 50)
//     borderColor: "#673AB7", // Border color matches the main dark purple
//   },
//   radioLabel: { marginLeft: 10, fontSize: 16, color: "#000" },
//   descriptionInput: {
//     width: "100%",
//     minHeight: 50,
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A0A0A0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 8,
//     fontSize: 16,
//     color: "#000",
//     marginTop: 20,
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
//   uploadArea: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eee",
//     paddingVertical: 40,
//     marginBottom: 20,
//   },
//   uploadOption: { alignItems: "center" },
//   uploadText: { marginTop: 5, fontSize: 14, color: "#707070" },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignSelf: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#9E9E9E",
//     opacity: 0.6,
//   },
//   buttonText: { fontSize: 18, fontWeight: "bold", color: "white" },
//   imagePreviewContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//   },
//   imagePreviewWrapper: { alignItems: "center", width: "100%" },
//   imagePreview: {
//     width: "90%",
//     height: 150,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginBottom: 10,
//   },
//   imageReadyText: { fontSize: 16, fontWeight: "bold", color: "#F9B300" },
//   reselectButton: {
//     marginTop: 5,
//     backgroundColor: "#eee",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   reselectText: { fontSize: 14, color: "#000" },
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
// ================================= AFTER KEYBOARD AVOID VIEW ADDED
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

type DocumentType = "PHOTO" | "SIGNATURE" | "OTHERS";

const UploadDetailsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Parameters passed from UploadDocumentScreen
  const verificationType = params.verificationType as string;
  const refNo = params.refNo as string;
  const name = params.name as string;
  const address = params.address as string;

  const isCustomerIdVerified = verificationType === "CUSTOMER_ID";

  const [docType, setDocType] = useState<DocumentType>("PHOTO");
  const [description, setDescription] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    image: "",
    description: "",
    general: "",
    session: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setErrors({ image: "", description: "", general: "", session: "" });
    setSuccessMessage("");
  };

  const pickImage = async (fromCamera: boolean) => {
    clearMessages(); // Clear existing error messages

    try {
      // 💡 CORRECTED: Use a variable that can hold the permission response type.
      // The permission response is NOT an Asset.
      let permissionResponse:
        | ImagePicker.MediaLibraryPermissionResponse
        | ImagePicker.CameraPermissionResponse
        | null;

      // 1. Request Permission
      if (fromCamera) {
        permissionResponse = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      // 2. Check Permission Status
      // The 'granted' property is always present on the permission response object.
      if (!permissionResponse || !permissionResponse.granted) {
        const type = fromCamera ? "Camera" : "Gallery (Media Library)";
        Alert.alert(
          "Permission Required",
          `Permission to access ${type} is required to select an image for upload.`
        );
        return; // Stop execution if permission is denied
      }

      // 3. Launch Picker/Camera
      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.8,
        });
      }

      // 4. Handle Result
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      setErrors((prev) => ({ ...prev, general: "Failed to pick image." }));
    }
  };

  // ==============================
  // 📤 HANDLE DOCUMENT UPLOAD
  // ==============================
  const handleUpload = async () => {
    clearMessages();

    if (!imageUri) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select an image first.",
      }));
      return;
    }

    if (!description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: "Please provide a document description.",
      }));
      return;
    }

    try {
      setLoading(true);

      // 🔹 Retrieve saved credentials from AsyncStorage
      const userId = await AsyncStorage.getItem("UserId");
      const cbsUrl = await AsyncStorage.getItem("CBSURL");
      // console.log("USER_ID FROM ASYNC STORA USER-DETAIL", userId);
      // console.log("CBSURL FROM ASYNC STORA USER-DETAIL", cbsUrl);

      if (!userId || !cbsUrl) {
        setErrors((prev) => ({
          ...prev,
          session: "Session expired. Please login again.",
        }));
        setTimeout(() => {
          router.replace("/(auth)/signup");
        }, 2000);
        return;
      }

      // 🔹 Prepare FormData for the file upload
      const formData = new FormData();
      formData.append("RequestID", "UpdateDoc");
      formData.append("UserID", userId);
      formData.append(
        "RefType",
        verificationType === "CUSTOMER_ID" ? "C" : "A"
      );
      formData.append("RefNo", refNo);
      formData.append("DocDescription", description);
      formData.append(
        "DocType",
        docType === "PHOTO" ? "P" : docType === "SIGNATURE" ? "S" : "O"
      );

      // ✅ Append image file
      formData.append("ImageData", {
        uri: imageUri,
        name: `${docType.toLowerCase()}.jpg`,
        type: "image/jpeg",
      } as any);

      console.log("🔹 Uploading document with data:", {
        RefNo: refNo,
        DocType: docType,
        Description: description,
      });

      // 🔹 Perform the API call using Axios (interceptor attaches TokenNo)
      const response = await api.post(cbsUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      console.log("✅ Upload Response:RRRR", data.Msg);

      // 🔹 Handle API response
      if (data.RC === "0") {
        setSuccessMessage("Document uploaded successfully!");

        // Auto navigate back after 1.5 seconds
        setTimeout(() => {
          router.back();
          // router.replace("/(app)/dashboard");
        }, 500);
      } else if (
        data.RC === "401" ||
        data.Message === "Authentication Failed"
      ) {
        // ⚠️ Backend says authentication failed (token invalid)
        console.warn("⚠️ Authentication failed — likely old token used");
        setErrors((prev) => ({
          ...prev,
          session: "Session expired. Please login again.",
        }));
        setTimeout(() => {
          AsyncStorage.clear();
          router.replace("/(auth)/signin");
        }, 2000);
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            data.Message || data.Msg || "Upload failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // 🔘 REUSABLE RADIO BUTTON COMPONENT
  // ==============================
  const RadioButton = ({
    label,
    value,
  }: {
    label: string;
    value: DocumentType;
  }) => (
    <TouchableOpacity
      style={[
        styles.radioContainer,
        docType === value && styles.radioActiveBackground, // Apply active background
      ]}
      onPress={() => setDocType(value)}
    >
      <MaterialCommunityIcons
        name={docType === value ? "radiobox-marked" : "radiobox-blank"}
        size={24}
        color={docType === value ? "#673AB7" : "#A0A0A0"} // Dark purple for active icon
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  // ==============================
  // 🧱 UI Layout
  // ==============================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
        <View style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity onPress={() => router.back()}>
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
          {/* Display verified customer details */}
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Name:</Text> {name}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Address:</Text> {address}
          </Text>

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
                  Redirecting to login...
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

          {/* Only show DocType options if verified by Customer ID */}
          {isCustomerIdVerified && (
            <View style={styles.documentTypeSection}>
              <RadioButton label="Photo" value="PHOTO" />
              <RadioButton label="Signature" value="SIGNATURE" />
              <RadioButton label="Others" value="OTHERS" />
            </View>
          )}

          {/* Document description input */}
          <TextInput
            placeholder="Document Description"
            placeholderTextColor="#A0A0A0"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) clearMessages();
            }}
            style={[
              styles.descriptionInput,
              errors.description && styles.inputError,
            ]}
            multiline
          />
          {errors.description ? (
            <Text style={styles.fieldErrorText}>{errors.description}</Text>
          ) : null}

          {/* Image Picker Section */}
          <View
            style={[
              styles.uploadArea,
              imageUri && styles.imagePreviewContainer,
            ]}
          >
            {imageUri ? (
              <View style={styles.imagePreviewWrapper}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                {/* <Text style={styles.imageReadyText}>Image Ready</Text> */}
                <TouchableOpacity
                  onPress={() => {
                    setImageUri(null);
                    clearMessages();
                  }}
                  style={styles.reselectButton}
                >
                  <Text style={styles.reselectText}>Select Another</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={() => pickImage(true)}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={40}
                    color="#707070"
                  />
                  <Text style={styles.uploadText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={() => pickImage(false)}
                >
                  <MaterialCommunityIcons
                    name="image"
                    size={40}
                    color="#707070"
                  />
                  <Text style={styles.uploadText}>Gallery</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {errors.image ? (
            <Text style={styles.fieldErrorText}>{errors.image}</Text>
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

          {/* Upload Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (loading || successMessage) && styles.buttonDisabled,
            ]}
            onPress={handleUpload}
            disabled={loading || !!successMessage}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {successMessage ? "Uploaded Successfully" : "Update"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UploadDetailsScreen;

// ==============================
// 💅 STYLES
// ==============================
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
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 40, // Added bottom padding for keyboard
  },
  detailText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  documentTypeSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  radioActiveBackground: {
    backgroundColor: "#EDE7F6",
    borderColor: "#673AB7",
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  descriptionInput: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A0A0A0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    color: "#000",
    marginTop: 20,
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
  uploadArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 40,
    marginBottom: 20,
  },
  uploadOption: {
    alignItems: "center",
  },
  uploadText: {
    marginTop: 5,
    fontSize: 14,
    color: "#707070",
  },
  button: {
    backgroundColor: "#673AB7",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20, // Added margin bottom for better spacing
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
  imagePreviewContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  imagePreviewWrapper: {
    alignItems: "center",
    width: "100%",
  },
  imagePreview: {
    width: "90%",
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  imageReadyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F9B300",
  },
  reselectButton: {
    marginTop: 5,
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reselectText: {
    fontSize: 14,
    color: "#000",
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

// ================= FIRST INSTALL react-native-image-crop-picker AND USE THE BELOW CODE
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ImagePicker from 'react-native-image-crop-picker';
// import api from "../../src/api/api";

// type DocumentType = "PHOTO" | "SIGNATURE" | "OTHERS";

// const UploadDetailsScreen: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   // ✅ Parameters passed from UploadDocumentScreen
//   const verificationType = params.verificationType as string;
//   const refNo = params.refNo as string;
//   const name = params.name as string;
//   const address = params.address as string;

//   const isCustomerIdVerified = verificationType === "CUSTOMER_ID";

//   const [docType, setDocType] = useState<DocumentType>("PHOTO");
//   const [description, setDescription] = useState<string>("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState({
//     image: "",
//     description: "",
//     general: "",
//     session: "",
//   });
//   const [successMessage, setSuccessMessage] = useState("");

//   const clearMessages = () => {
//     setErrors({ image: "", description: "", general: "", session: "" });
//     setSuccessMessage("");
//   };

//   // ==============================
//   // 📸 IMAGE PICKER with react-native-image-crop-picker
//   // ==============================
//   const pickImage = async (fromCamera: boolean) => {
//     try {
//       const options = {
//         width: 800,
//         height: 600,
//         cropping: true,
//         cropperToolbarTitle: 'Crop Image',
//         cropperToolbarColor: '#F9B300',
//         cropperStatusBarColor: '#F9B300',
//         cropperToolbarWidgetColor: '#FFFFFF',
//         cropperActiveWidgetColor: '#F9B300',
//         cropperCircleOverlay: false,
//         enableRotationGesture: true,
//         compressImageQuality: 0.8,
//         mediaType: 'photo' as const,
//         includeBase64: false,
//         freeStyleCropEnabled: true,
//       };

//       let image;
//       if (fromCamera) {
//         image = await ImagePicker.openCamera(options);
//       } else {
//         image = await ImagePicker.openPicker(options);
//       }

//       if (image) {
//         setImageUri(image.path);
//         clearMessages();
//         console.log('Selected image:', {
//           path: image.path,
//           width: image.width,
//           height: image.height,
//           size: image.size
//         });
//       }
//     } catch (error: any) {
//       // Only show error if it's not a cancellation
//       if (error.code !== 'E_PICKER_CANCELLED') {
//         console.error("Image picker error:", error);
//         setErrors((prev) => ({
//           ...prev,
//           general: "Failed to pick image. Please try again."
//         }));
//       }
//     }
//   };

//   // ==============================
//   // 📤 HANDLE DOCUMENT UPLOAD
//   // ==============================
//   const handleUpload = async () => {
//     clearMessages();

//     if (!imageUri) {
//       setErrors((prev) => ({
//         ...prev,
//         image: "Please select an image first.",
//       }));
//       return;
//     }

//     if (!description.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         description: "Please provide a document description.",
//       }));
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔹 Retrieve saved credentials from AsyncStorage
//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");

//       if (!userId || !cbsUrl) {
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           router.replace("/(auth)/signup");
//         }, 2000);
//         return;
//       }

//       // 🔹 Prepare FormData for the file upload
//       const formData = new FormData();
//       formData.append("RequestID", "UpdateDoc");
//       formData.append("UserID", userId);
//       formData.append(
//         "RefType",
//         verificationType === "CUSTOMER_ID" ? "C" : "A"
//       );
//       formData.append("RefNo", refNo);
//       formData.append("DocDescription", description);
//       formData.append(
//         "DocType",
//         docType === "PHOTO" ? "P" : docType === "SIGNATURE" ? "S" : "O"
//       );

//       // ✅ Append image file - get filename from path
//       const fileName = imageUri.split('/').pop() || `${docType.toLowerCase()}.jpg`;

//       formData.append("ImageName", {
//         uri: imageUri,
//         name: fileName,
//         type: "image/jpeg",
//       } as any);

//       console.log("🔹 Uploading document with data:", {
//         RefNo: refNo,
//         DocType: docType,
//         Description: description,
//         Image: fileName
//       });

//       // 🔹 Perform the API call using Axios (interceptor attaches TokenNo)
//       const response = await api.post(cbsUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = response.data;
//       console.log("✅ Upload Response:", data);

//       // 🔹 Handle API response
//       if (data.RC === "0") {
//         setSuccessMessage("Document uploaded successfully! Returning...");

//         // Auto navigate back after 1.5 seconds
//         setTimeout(() => {
//           router.back();
//         }, 500);
//       } else if (
//         data.RC === "401" ||
//         data.Message === "Authentication Failed"
//       ) {
//         // ⚠️ Backend says authentication failed (token invalid)
//         console.warn("⚠️ Authentication failed — likely old token used");
//         setErrors((prev) => ({
//           ...prev,
//           session: "Session expired. Please login again.",
//         }));
//         setTimeout(() => {
//           AsyncStorage.clear();
//           router.replace("/(auth)/signin");
//         }, 2000);
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           general: data.Message || "Upload failed. Please try again.",
//         }));
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       setErrors((prev) => ({
//         ...prev,
//         general: "Network error. Please check your connection and try again.",
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // 🔘 REUSABLE RADIO BUTTON COMPONENT
//   // ==============================
//   const RadioButton = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: DocumentType;
//   }) => (
//     <TouchableOpacity
//       style={styles.radioContainer}
//       onPress={() => setDocType(value)}
//     >
//       <MaterialCommunityIcons
//         name={docType === value ? "radiobox-marked" : "radiobox-blank"}
//         size={24}
//         color={docType === value ? "#F9B300" : "#A0A0A0"}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   // ==============================
//   // 🧱 UI Layout
//   // ==============================
//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
//         <View style={styles.header}>
//           <View style={styles.left}>
//             <TouchableOpacity onPress={() => router.back()}>
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
//         {/* Display verified customer details */}
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Name:</Text> {name}
//         </Text>
//         <Text style={styles.detailText}>
//           <Text style={styles.detailLabel}>Address:</Text> {address}
//         </Text>

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
//                 Redirecting to login...
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

//         {/* Only show DocType options if verified by Customer ID */}
//         {isCustomerIdVerified && (
//           <View style={styles.documentTypeSection}>
//             <RadioButton label="Photo" value="PHOTO" />
//             <RadioButton label="Signature" value="SIGNATURE" />
//             <RadioButton label="Others" value="OTHERS" />
//           </View>
//         )}

//         {/* Document description input */}
//         <TextInput
//           placeholder="Document Description"
//           placeholderTextColor="#A0A0A0"
//           value={description}
//           onChangeText={(text) => {
//             setDescription(text);
//             if (errors.description) clearMessages();
//           }}
//           style={[
//             styles.descriptionInput,
//             errors.description && styles.inputError,
//           ]}
//           multiline
//         />
//         {errors.description ? (
//           <Text style={styles.fieldErrorText}>{errors.description}</Text>
//         ) : null}

//         {/* Image Picker Section */}
//         <View
//           style={[styles.uploadArea, imageUri && styles.imagePreviewContainer]}
//         >
//           {imageUri ? (
//             <View style={styles.imagePreviewWrapper}>
//               <Image
//                 source={{ uri: imageUri }}
//                 style={styles.imagePreview}
//                 resizeMode="cover"
//               />
//               <Text style={styles.imageReadyText}>Image Ready</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setImageUri(null);
//                   clearMessages();
//                 }}
//                 style={styles.reselectButton}
//               >
//                 <Text style={styles.reselectText}>Select Another</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(true)}
//               >
//                 <MaterialCommunityIcons
//                   name="camera"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Camera</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.uploadOption}
//                 onPress={() => pickImage(false)}
//               >
//                 <MaterialCommunityIcons
//                   name="image"
//                   size={40}
//                   color="#707070"
//                 />
//                 <Text style={styles.uploadText}>Gallery</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//         {errors.image ? (
//           <Text style={styles.fieldErrorText}>{errors.image}</Text>
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

//         {/* Upload Button */}
//         <TouchableOpacity
//           style={[
//             styles.button,
//             (loading || successMessage) && styles.buttonDisabled,
//           ]}
//           onPress={handleUpload}
//           disabled={loading || !!successMessage}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>
//               {successMessage ? "Uploaded Successfully" : "Upload"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UploadDetailsScreen;

// // ==============================
// // 💅 STYLES
// // ==============================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFF6FB" },
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

//   contentContainer: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
//   detailText: { fontSize: 16, color: "#000", marginBottom: 5 },
//   detailLabel: { fontWeight: "bold" },
//   documentTypeSection: { marginTop: 20, marginBottom: 20 },
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   radioLabel: { marginLeft: 10, fontSize: 16, color: "#000" },
//   descriptionInput: {
//     width: "100%",
//     minHeight: 50,
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A0A0A0",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
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
//   uploadArea: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "white",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eee",
//     paddingVertical: 40,
//     marginBottom: 20,
//   },
//   uploadOption: { alignItems: "center" },
//   uploadText: { marginTop: 5, fontSize: 14, color: "#707070" },
//   button: {
//     backgroundColor: "#673AB7",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignSelf: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#9E9E9E",
//     opacity: 0.6,
//   },
//   buttonText: { fontSize: 18, fontWeight: "bold", color: "white" },
//   imagePreviewContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//   },
//   imagePreviewWrapper: { alignItems: "center", width: "100%" },
//   imagePreview: {
//     width: "90%",
//     height: 150,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginBottom: 10,
//   },
//   imageReadyText: { fontSize: 16, fontWeight: "bold", color: "#F9B300" },
//   reselectButton: {
//     marginTop: 5,
//     backgroundColor: "#eee",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   reselectText: { fontSize: 14, color: "#000" },
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
