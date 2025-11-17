// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import api from "../../src/api/api";

// const DashboardScreen: React.FC = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [logoutLoading, setLogoutLoading] = useState(false);

//   const handleScan = () => {
//     router.push("/(app)/upload-document");
//   };

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: performLogout,
//       },
//     ]);
//   };

//   const performLogout = async () => {
//     try {
//       setLogoutLoading(true);

//       // Get stored credentials
//       const userId = await AsyncStorage.getItem("UserId");
//       const cbsUrl = await AsyncStorage.getItem("CBSURL");
//       const tokenNo = await AsyncStorage.getItem("TokenNo");

//       console.log("🔹 Logout - UserID:", userId);
//       console.log("🔹 Logout - Token:", tokenNo);

//       if (!userId || !cbsUrl || !tokenNo) {
//         // If no credentials found, just clear storage and redirect
//         await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
//         router.replace("/(auth)/signin");
//         return;
//       }

//       // Call logout API
//       const logoutUrl = `${cbsUrl}?RequestID=Logout&UserID=${userId}&LoginSeqNo=${tokenNo}`;
//       console.log("🔹 Logout URL:", logoutUrl);

//       const response = await api.get(logoutUrl);
//       const data = response.data;

//       console.log("🔹 Logout Response:", data);

//       if (data.RC === "0") {
//         // Success - clear storage and redirect to signin
//         await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
//         router.replace("/(auth)/signin");
//       } else {
//         // Even if logout API fails, clear local storage and redirect
//         console.warn("Logout API failed, clearing local storage anyway");
//         await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
//         router.replace("/(auth)/signin");
//       }
//     } catch (error) {
//       console.error("❌ Logout error:", error);
//       // Even on error, clear storage and redirect
//       await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
//       router.replace("/(auth)/signin");
//     } finally {
//       setLogoutLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <SafeAreaView style={{ backgroundColor: "#F9B300" }}>
//         <View style={styles.header}>
//           <View style={styles.center}>
//             <Text style={styles.headerText}>Dashboard</Text>
//           </View>
//         </View>
//       </SafeAreaView>

//       <View style={styles.contentContainer}>
//         <Text style={styles.welcomeText}>Welcome!</Text>
//         <Text style={styles.subtitle}>Choose an option to continue</Text>

//         {/* Options Container */}
//         <View style={styles.optionsContainer}>
//           {/* Scan Option */}
//           <TouchableOpacity
//             style={[styles.optionCard, loading && styles.optionDisabled]}
//             onPress={handleScan}
//             disabled={loading}
//           >
//             <View style={styles.optionIconContainer}>
//               <MaterialCommunityIcons
//                 name="qrcode-scan"
//                 size={50}
//                 color="#F9B300"
//               />
//             </View>
//             <Text style={styles.optionTitle}>Scan</Text>
//             <Text style={styles.optionDescription}>
//               Upload and verify documents by scanning customer ID or account
//               number
//             </Text>
//           </TouchableOpacity>

//           {/* Logout Option */}
//           <TouchableOpacity
//             style={[styles.optionCard, logoutLoading && styles.optionDisabled]}
//             onPress={handleLogout}
//             disabled={logoutLoading}
//           >
//             <View style={styles.optionIconContainer}>
//               <MaterialCommunityIcons name="logout" size={50} color="#FF6B6B" />
//             </View>
//             <Text style={styles.optionTitle}>Logout</Text>
//             <Text style={styles.optionDescription}>
//               Sign out from your account securely
//             </Text>
//             {logoutLoading && (
//               <ActivityIndicator
//                 size="small"
//                 color="#FF6B6B"
//                 style={styles.optionLoader}
//               />
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Footer */}
//       <Text style={styles.footerText}>
//         Powered By{" "}
//         <Text style={styles.footerCompany}>
//           Silicon IT Solutions Private Limited
//         </Text>
//       </Text>
//     </View>
//   );
// };

// export default DashboardScreen;

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
//     justifyContent: "center",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "white",
//   },
//   contentContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     alignItems: "center",
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 50,
//     textAlign: "center",
//   },
//   optionsContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   optionCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 25,
//     marginBottom: 25,
//     width: "90%",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//   },
//   optionDisabled: {
//     opacity: 0.6,
//   },
//   optionIconContainer: {
//     marginBottom: 15,
//   },
//   optionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 10,
//   },
//   optionDescription: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   optionLoader: {
//     marginTop: 10,
//   },
//   footerText: {
//     position: "absolute",
//     bottom: 15,
//     alignSelf: "center",
//     color: "#999",
//     fontSize: 12,
//   },
//   footerCompany: {
//     color: "#000",
//     fontWeight: "bold",
//   },
// });
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../src/api/api";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleScan = () => {
    router.push("/(app)/upload-document");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  const performLogout = async () => {
    try {
      setLogoutLoading(true);
      const userId = await AsyncStorage.getItem("UserId");
      const cbsUrl = await AsyncStorage.getItem("CBSURL");
      const tokenNo = await AsyncStorage.getItem("TokenNo");

      if (!userId || !cbsUrl || !tokenNo) {
        await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
        router.replace("/(auth)/signin");
        return;
      }

      const logoutUrl = `${cbsUrl}?RequestID=Logout&UserID=${userId}&LoginSeqNo=${tokenNo}`;
      const response = await api.get(logoutUrl);
      const data = response.data;

      if (data.RC === "0") {
        await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
        router.replace("/(auth)/signin");
      } else {
        await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
        router.replace("/(auth)/signin");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      await AsyncStorage.multiRemove(["TokenNo", "UserId"]);
      router.replace("/(auth)/signin");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
      </SafeAreaView>

      {/* Content */}
      <View style={styles.content}>
        {/* <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitle}>Choose an option to continue</Text>
        </View> */}

        {/* Options List */}
        <View style={styles.optionsList}>
          {/* Scan & Upload Option */}
          <TouchableOpacity
            style={[styles.optionItem, loading && styles.optionDisabled]}
            onPress={handleScan}
            disabled={loading}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, styles.scanIcon]}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Scan & Upload</Text>
                <Text style={styles.optionDescription}>
                  Verify customer and upload documents
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Logout Option */}
          <TouchableOpacity
            style={[styles.optionItem, logoutLoading && styles.optionDisabled]}
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, styles.logoutIcon]}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Logout</Text>
                <Text style={styles.optionDescription}>
                  Sign out from your account
                </Text>
              </View>
            </View>
            {logoutLoading ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by{" "}
          <Text style={styles.footerCompany}>Silicon IT Solutions</Text>
        </Text>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSafeArea: {
    backgroundColor: "#F9B300",
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  optionsList: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  scanIcon: {
    backgroundColor: "#F9B300",
  },
  logoutIcon: {
    backgroundColor: "#FF6B6B",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 20,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
  footerCompany: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
});
