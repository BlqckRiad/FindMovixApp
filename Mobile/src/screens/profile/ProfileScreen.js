import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { spacing, radius } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ProfileEditModal from "../../components/modals/ProfileEditModal";
import SuccessModal from "../../components/modals/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import PhotoOptionsModal from "../../components/modals/PhotoOptionsModal";
import * as ImagePicker from "expo-image-picker";
import EmailVerificationModal from "../../components/modals/EmailVerificationModal";
import {
  generateVerificationCode,
  saveVerificationCode,
  verifyCode,
  getEmailTemplate,
} from "../../utils/emailVerification";

const ProfileItem = ({ icon, label, value, onPress }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={24} color={colors.text} />
        <View style={[styles.profileItemTexts, { flex: 1 }]}>
          <Text
            style={[styles.profileItemLabel, { color: colors.textSecondary }]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.profileItemValue,
              {
                color: colors.text,
                flex: 1,
                textAlign: icon === "male-female-outline" ? "left" : "left",
              },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.text} />
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { theme, t } = useTheme();
  const { updateUser } = useAuth();
  const colors = theme.colors;
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
   
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: "",
    message: "",
  });
  
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem("userID");
      if (!userID) {
        throw new Error("Kullanıcı ID bulunamadı");
      }
      if (userID === "0") {
        Alert.alert(
          t.hataGuest,  // İlk parametre: Başlık
          t.hataGuest2,  // İkinci parametre: Mesaj
          [
            {
              text: "Tamam",
              onPress: () => navigation.navigate('Home'),
            },
          ],
          { cancelable: false }
        );
        return;
      }
      

      const response = await axios.get(
        `https://apiuser.findmovix.com/api/User/GetKisiWithID?id=${userID}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Profil yükleme hatası:", error);
      Alert.alert("Hata", "Profil bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = (type, title) => {
    setModalType(type);
    setModalTitle(title);
    setModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      if (modalType === "email") {
        handleEmailUpdate(values.email);
        return;
      }

      const userID = await AsyncStorage.getItem("userID");
      if (!userID) throw new Error("Kullanıcı ID bulunamadı");

      if (modalType === "phone") {
        Alert.alert("Bilgi", "Bu özellik yakında eklenecek");
        return;
      }

      const updateData = {
        userID: parseInt(userID),
        name: userData.name,
        surName: userData.surName,
        userName: userData.userName,
        userDate: userData.userDate,
        userSexsID: userData.userSexsID,
        updatedUserID: 0,
        ...values,
      };

      await axios.post(
        "https://apiuser.findmovix.com/api/UserUpdate/UserUpdate",
        updateData
      );

      await loadUserProfile();

      if (values.name) {
        await AsyncStorage.setItem("name", values.name);
        updateUser({ name: values.name });
      }
      if (values.surName) {
        await AsyncStorage.setItem("surName", values.surName);
        updateUser({ surName: values.surName });
      }
      if (values.userName) {
        await AsyncStorage.setItem("userName", values.userName);
        updateUser({ userName: values.userName });
      }
      if (values.userDate) {
        await AsyncStorage.setItem("userDate", values.userDate);
        updateUser({ userDate: values.userDate });
      }
      if (values.userSexsID) {
        await AsyncStorage.setItem("userSexsID", values.userSexsID.toString());
        updateUser({ userSexsID: values.userSexsID });
      }

      setSuccessModal({
        visible: true,
        title: "Başarılı!",
        message: "Profil bilgileriniz başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Update error:", error);
      setSuccessModal({
        visible: true,
        title: "Hata!",
        message: "Güncelleme sırasında bir hata oluştu.",
      });
    }
  };

  const handlePhotoOptions = () => {
    setPhotoOptionsVisible(true);
  };

  const requestPermissions = async (type) => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("İzin Gerekli", "Kamera erişimi için izin gereklidir.", [
          { text: t.ok },
        ]);
        return false;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("İzin Gerekli", "Galeri erişimi için izin gereklidir.", [
          { text: t.ok },
        ]);
        return false;
      }
    }
    return true;
  };

  const uploadPhoto = async (uri) => {
    try {
      // Dosya tipini kontrol et
      const extension = uri.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
      if (!allowedExtensions.includes(extension)) {
        Alert.alert(
          "Hata",
          "Yalnızca resim dosyaları (.jpg, .jpeg, .png, .gif, .bmp) yüklenebilir."
        );
        return;
      }

      // FormData oluştur
      const formData = new FormData();

      // Dosyayı formData'ya ekle
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: `image/${extension === "jpg" ? "jpeg" : extension}`,
        name: `image_${Date.now()}.${extension}`,
      });

      console.log("Uploading photo...");

      // İlk olarak fotoğrafı yükle
      const imageResponse = await axios.post(
        "https://apiimage.findmovix.com/api/Image/AddImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", imageResponse.data);

      if (imageResponse.data) {
        const { imageID, imageUrl } = imageResponse.data;
        const userID = await AsyncStorage.getItem("userID");

        if (!userID) {
          throw new Error("Kullanıcı ID bulunamadı");
        }

        // Kullanıcı fotoğraf bilgilerini güncelle
        const updateImageData = {
          userID: parseInt(userID),
          newImageID: imageID,
          newImageUrl: imageUrl,
          updatedUserID: parseInt(userID),
        };

        console.log("Updating user image info:", updateImageData);

        // UserImageUpdate endpoint'ine istek at
        await axios.post(
          "https://apiuser.findmovix.com/api/UserUpdate/UserImageUpdate",
          updateImageData
        );

        // Update AsyncStorage
        await AsyncStorage.setItem("imageID", imageID.toString());
        await AsyncStorage.setItem("imageUrl", imageUrl);

        // Update local state
        setUserData((prev) => ({
          ...prev,
          userImageID: imageID,
          userImageUrl: imageUrl,
        }));

        // Update AuthContext user state
        updateUser({
          userImageID: imageID,
          userImageUrl: imageUrl,
        });

        setSuccessModal({
          visible: true,
          title: "Başarılı!",
          message: "Profil fotoğrafınız başarıyla güncellendi.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      Alert.alert(
        "Hata",
        "Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions("camera");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPhotoOptionsVisible(false);
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Hata", "Fotoğraf çekilirken bir hata oluştu.");
    }
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions("gallery");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPhotoOptionsVisible(false);
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Hata", "Fotoğraf seçilirken bir hata oluştu.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      // Reset image related data
      await AsyncStorage.multiRemove(["imageID", "imageUrl"]);

      // Update local state
      setUserData((prev) => ({
        ...prev,
        userImageID: null,
        userImageUrl: null,
      }));

      // Update AuthContext user state
      updateUser({
        userImageID: null,
        userImageUrl: null,
      });

      setPhotoOptionsVisible(false);
      setSuccessModal({
        visible: true,
        title: "Başarılı!",
        message: "Profil fotoğrafınız başarıyla silindi.",
      });
    } catch (error) {
      console.error("Delete photo error:", error);
      Alert.alert("Hata", "Fotoğraf silinirken bir hata oluştu.");
    }
  };

  const handleEmailUpdate = async (newEmail) => {
    try {
      // Generate verification code
      const code = generateVerificationCode();

      // Save code and pending email
      await saveVerificationCode(code, newEmail);
      setPendingEmail(newEmail);

      // Prepare email content
      const emailData = {
        toEmail: newEmail,
        subject: "Email Doğrulama Kodu",
        body: getEmailTemplate(code),
      };

      // Send verification email
      await axios.post(
        "https://apiuser.findmovix.com/api/Notification/SendEmail",
        emailData
      );

      // Show verification modal
      setModalVisible(false);
      setVerificationModalVisible(true);
      setVerificationError("");
    } catch (error) {
      console.error("Email update error:", error);
      Alert.alert("Hata", "Doğrulama kodu gönderilirken bir hata oluştu.");
    }
  };

  const handleVerifyEmail = async (code) => {
    setVerificationLoading(true);
    setVerificationError("");

    try {
      const isValid = await verifyCode(code);

      if (!isValid) {
        setVerificationError("Geçersiz doğrulama kodu");
        return;
      }

      const userID = await AsyncStorage.getItem("userID");
      if (!userID) throw new Error("Kullanıcı ID bulunamadı");

      // Update email in backend
      const updateData = {
        userID: parseInt(userID),
        newEmail: pendingEmail,
        updatedUserID: parseInt(userID),
      };

      const response = await axios.post(
        "https://apiuser.findmovix.com/api/UserUpdate/UserEmailUpdate",
        updateData
      );

      // Update AsyncStorage and state
      await AsyncStorage.setItem("userEmail", response.data.newEmail);

      // Update local state
      setUserData((prev) => ({
        ...prev,
        userEmail: response.data.newEmail,
      }));

      // Update AuthContext
      updateUser({
        userEmail: response.data.newEmail,
      });

      // Clean up verification data
      await AsyncStorage.multiRemove(["emailVerificationCode", "pendingEmail"]);

      // Close modal and show success message
      setVerificationModalVisible(false);
      setSuccessModal({
        visible: true,
        title: "Başarılı!",
        message: "Email adresiniz başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationError("Doğrulama işlemi sırasında bir hata oluştu");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = () => {
    handleEmailUpdate(pendingEmail);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t.profile}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handlePhotoOptions}
          >
            {userData?.userImageUrl ? (
              <Image
                source={{ uri: userData.userImageUrl }}
                style={styles.photo}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="person"
                  size={40}
                  color={colors.textSecondary}
                />
              </View>
            )}
            <View
              style={[styles.editBadge, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="camera" size={16} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            {t.personalInfo}
          </Text>

          <ProfileItem
            icon="person-outline"
            label={t.fullName}
            value={`${userData?.name || ""} ${userData?.surName || ""}`}
            onPress={() => handleModalOpen("fullName", t.editFullName)}
          />

          <ProfileItem
            icon="at-outline"
            label={t.username}
            value={userData?.userName || ""}
            onPress={() => handleModalOpen("userName", t.editUsername)}
          />

          <ProfileItem
            icon="call-outline"
            label={t.phone}
            value={userData?.userTelNo || ""}
            onPress={() => handleModalOpen("phone", t.editPhone)}
          />

          <ProfileItem
            icon="calendar-outline"
            label={t.birthDate}
            value={
              userData?.userDate
                ? new Date(userData.userDate).toLocaleDateString()
                : t.notSpecified
            }
            onPress={() => handleModalOpen("birthDate", t.editBirthDate)}
          />

          <ProfileItem
            icon="male-female-outline"
            label={t.gender}
            value={
              userData?.userSexsID === 1
                ? t.male
                : userData?.userSexsID === 2
                ? t.female
                : t.notSpecified
            }
            onPress={() => handleModalOpen("gender", t.gender)}
          />

          <ProfileItem
            icon="mail-outline"
            label={t.email}
            value={userData?.userEmail || ""}
            onPress={() => handleModalOpen("email", t.editEmail)}
          />
        </View>
      </ScrollView>

      <ProfileEditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleUpdateProfile}
        type={modalType}
        title={modalTitle}
        initialValues={userData}
      />

      <SuccessModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal((prev) => ({ ...prev, visible: false }))}
      />

      <PhotoOptionsModal
        visible={photoOptionsVisible}
        onClose={() => setPhotoOptionsVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChoosePhoto={handleChoosePhoto}
        onDeletePhoto={handleDeletePhoto}
      />

      <EmailVerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        onVerify={handleVerifyEmail}
        onResend={handleResendCode}
        newEmail={pendingEmail}
        loading={verificationLoading}
        error={verificationError}
      />
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 48,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: radius.lg,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileItemTexts: {
    marginLeft: spacing.md,
    flex: 1,
    justifyContent: "center",
  },
  profileItemLabel: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  profileItemValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    paddingRight: spacing.lg,
  },
  saveButton: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
});

export default ProfileScreen;
