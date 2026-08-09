import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useChangePasswordMutation } from "../../Redux/Features/Authentication/AuthApi";


const ChangePasswordScreen = ({ navigation }) => {
  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const handleChangePassword = async () => {
    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        "Required",
        "Please fill all fields."
      );
      return;
    }


    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "New password must be at least 6 characters."
      );
      return;
    }


    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirm password do not match."
      );
      return;
    }


    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();


      Alert.alert(
        "Success",
        response?.message ||
          "Password changed successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");

              navigation.goBack();
            },
          },
        ]
      );

    } catch (error) {
      console.log(
        "Change password error:",
        error
      );

      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to change password."
      );
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        <Text style={styles.title}>
          Change Password
        </Text>

        <Text style={styles.subtitle}>
          Enter your current password and choose
          a new password.
        </Text>


        {/* Old Password */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Current Password
          </Text>

          <View style={styles.passwordContainer}>

            <TextInput
              style={styles.passwordInput}
              placeholder="Enter current password"
              placeholderTextColor="#999"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowOldPassword(
                  !showOldPassword
                )
              }
            >
              <Text style={styles.showText}>
                {showOldPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>


        {/* New Password */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.passwordContainer}>

            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
            >
              <Text style={styles.showText}>
                {showNewPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>


        {/* Confirm Password */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Confirm New Password
          </Text>

          <View style={styles.passwordContainer}>

            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              <Text style={styles.showText}>
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>


        {/* Password requirement */}
        <Text style={styles.requirement}>
          • Password must be at least 6 characters
        </Text>

        <Text style={styles.requirement}>
          • New password must be different from
          your current password
        </Text>


        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >

          <Text style={styles.buttonText}>
            {isLoading
              ? "Changing Password..."
              : "Change Password"}
          </Text>

        </TouchableOpacity>


        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 24,
    paddingTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },

  showText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
  },

  requirement: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },

  button: {
    height: 52,
    backgroundColor: "#007bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
  },

});

export default ChangePasswordScreen;