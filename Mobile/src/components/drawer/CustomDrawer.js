import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer = (props) => {
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "",
    surName: "",
    email: "",
    imageUrl: null,
  });

  const loadUserInfo = async () => {
    try {
      const [name, surName, email, imageUrl] = await Promise.all([
        AsyncStorage.getItem("name"),
        AsyncStorage.getItem("surName"),
        AsyncStorage.getItem("userEmail"),
        AsyncStorage.getItem("imageUrl"),
      ]);

      setUserInfo({
        name: name || "",
        surName: surName || "",
        email: email || "",
        imageUrl: imageUrl || null,
      });
    } catch (error) {
      console.error("Drawer veri yükleme hatası:", error);
    }
  };

  // İlk render'da ve her drawer açılışında çağrılır
  loadUserInfo();
  console.log(userInfo.imageUrl);
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userImageContainer}>
          <Image source={{ uri: userInfo.imageUrl }} style={styles.userImage} />
        </View>
        <Text style={styles.userName}>
          {`${userInfo.name} ${userInfo.surName}`.trim() || "Kullanıcı"}
        </Text>
        <Text style={styles.userEmail}>{userInfo.email || ""}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Logout Button */}
      
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    alignItems: "center",
  },
  userImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  userImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  logoutContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: typography.sizes.md,
    color: colors.error,
    fontWeight: typography.weights.medium,
  },
});

export default CustomDrawer;
