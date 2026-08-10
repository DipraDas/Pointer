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
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { useChangePasswordMutation } from "../../Redux/Features/Authentication/AuthApi";

const ChangePasswordScreen = ({ navigation }) => {

  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

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
        "Please fill in all fields."
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


    if (oldPassword === newPassword) {
      Alert.alert(
        "Invalid Password",
        "New password must be different from your current password."
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
      }).unwrap();


      Alert.alert(
        "Password Changed",
        response?.message ||
        "Your password has been changed successfully.",
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
        "Unable to Change Password",
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

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />


      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.title}>
            CHANGE PASSWORD
          </Text>

          <Text style={styles.subtitle}>
            Keep your account secure
          </Text>

        </View>



        {/* SECURITY ICON */}

        <View style={styles.iconWrapper}>

          <View style={styles.iconCircle}>

            <Text style={styles.lockIcon}>
              ●
            </Text>

          </View>

        </View>



        <Text style={styles.description}>
          Enter your current password and choose
          a new password for your account.
        </Text>



        {/* PASSWORD CARD */}

        <View style={styles.card}>


          {/* CURRENT PASSWORD */}

          <View style={styles.field}>

            <Text style={styles.label}>
              CURRENT PASSWORD
            </Text>

            <View style={styles.passwordRow}>

              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor="#A0A0A0"
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
                    ? "HIDE"
                    : "SHOW"}
                </Text>

              </TouchableOpacity>

            </View>

          </View>



          <View style={styles.divider} />



          {/* NEW PASSWORD */}

          <View style={styles.field}>

            <Text style={styles.label}>
              NEW PASSWORD
            </Text>

            <View style={styles.passwordRow}>

              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#A0A0A0"
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
                    ? "HIDE"
                    : "SHOW"}
                </Text>

              </TouchableOpacity>

            </View>

          </View>



          <View style={styles.divider} />



          {/* CONFIRM PASSWORD */}

          <View style={styles.field}>

            <Text style={styles.label}>
              CONFIRM NEW PASSWORD
            </Text>

            <View style={styles.passwordRow}>

              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#A0A0A0"
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
                    ? "HIDE"
                    : "SHOW"}
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>



        {/* REQUIREMENTS */}

        <View style={styles.requirementBox}>

          <Text style={styles.requirementTitle}>
            PASSWORD REQUIREMENTS
          </Text>


          <View style={styles.requirementRow}>

            <View style={styles.dot} />

            <Text style={styles.requirementText}>
              At least 6 characters
            </Text>

          </View>


          <View style={styles.requirementRow}>

            <View style={styles.dot} />

            <Text style={styles.requirementText}>
              Must be different from your current password
            </Text>

          </View>

        </View>



        {/* CHANGE PASSWORD BUTTON */}

        <TouchableOpacity
          style={[
            styles.changeButton,
            isLoading &&
            styles.disabledButton,
          ]}
          onPress={handleChangePassword}
          disabled={isLoading}
          activeOpacity={0.8}
        >

          {isLoading ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.changeButtonText}>
              CHANGE PASSWORD
            </Text>

          )}

        </TouchableOpacity>



        {/* CANCEL */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            navigation.goBack()
          }
          disabled={isLoading}
        >

          <Text style={styles.cancelText}>
            CANCEL
          </Text>

        </TouchableOpacity>


      </ScrollView>

    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },


  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },


  /* HEADER */

  header: {
    width: '100%',
    alignItems: "center",
    marginBottom: 30,
  },


  title: {
    alignItems: 'center',
    color: '#000000',
    fontSize: 28,
    fontFamily: 'Quantico-Bold',
    letterSpacing: 4,
  },


  subtitle: {
    color: '#777777',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 5,
  },


  /* ICON */

  iconWrapper: {
    alignItems: "center",
    // marginTop: 35,
  },


  iconCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },


  lockIcon: {
    width: 28,
    height: 35,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    borderRadius: 5,
    color: "#111111",
  },


  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#777777",
    lineHeight: 21,
    marginTop: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },


  /* CARD */

  card: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    marginTop: 10,
    paddingHorizontal: 20,
  },


  field: {
    paddingVertical: 18,
  },


  label: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 7,
  },


  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },


  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
    paddingVertical: 4,
    paddingRight: 10,
  },


  showText: {
    fontSize: 11,
    color: "#111111",
    fontWeight: "700",
    letterSpacing: 1,
    paddingLeft: 10,
  },


  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },


  /* REQUIREMENT */

  requirementBox: {
    marginTop: 22,
    paddingHorizontal: 5,
  },


  requirementTitle: {
    fontSize: 10,
    color: "#999999",
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 13,
  },


  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },


  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#111111",
    marginRight: 10,
  },


  requirementText: {
    flex: 1,
    fontSize: 12,
    color: "#777777",
    lineHeight: 18,
  },


  /* BUTTON */

  changeButton: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#111111',
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 15,
  },


  disabledButton: {
    opacity: 0.6,
  },


  changeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
  },


  /* CANCEL */

  cancelButton: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 15,
  },


  cancelText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
  },

});


export default ChangePasswordScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { useChangePasswordMutation } from "../../Redux/Features/Authentication/AuthApi";


// const ChangePasswordScreen = ({ navigation }) => {
//   const [changePassword, { isLoading }] =
//     useChangePasswordMutation();

//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);


//   const handleChangePassword = async () => {
//     if (
//       !oldPassword ||
//       !newPassword ||
//       !confirmPassword
//     ) {
//       Alert.alert(
//         "Required",
//         "Please fill all fields."
//       );
//       return;
//     }


//     if (newPassword.length < 6) {
//       Alert.alert(
//         "Invalid Password",
//         "New password must be at least 6 characters."
//       );
//       return;
//     }


//     if (newPassword !== confirmPassword) {
//       Alert.alert(
//         "Password Mismatch",
//         "New password and confirm password do not match."
//       );
//       return;
//     }


//     try {
//       const response = await changePassword({
//         oldPassword,
//         newPassword,
//         confirmPassword,
//       }).unwrap();


//       Alert.alert(
//         "Success",
//         response?.message ||
//           "Password changed successfully.",
//         [
//           {
//             text: "OK",
//             onPress: () => {
//               setOldPassword("");
//               setNewPassword("");
//               setConfirmPassword("");

//               navigation.goBack();
//             },
//           },
//         ]
//       );

//     } catch (error) {
//       console.log(
//         "Change password error:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         error?.data?.message ||
//           "Failed to change password."
//       );
//     }
//   };


//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={
//         Platform.OS === "ios"
//           ? "padding"
//           : undefined
//       }
//     >
//       <ScrollView
//         contentContainerStyle={styles.content}
//         keyboardShouldPersistTaps="handled"
//       >

//         <Text style={styles.title}>
//           Change Password
//         </Text>

//         <Text style={styles.subtitle}>
//           Enter your current password and choose
//           a new password.
//         </Text>


//         {/* Old Password */}
//         <View style={styles.inputContainer}>

//           <Text style={styles.label}>
//             Current Password
//           </Text>

//           <View style={styles.passwordContainer}>

//             <TextInput
//               style={styles.passwordInput}
//               placeholder="Enter current password"
//               placeholderTextColor="#999"
//               value={oldPassword}
//               onChangeText={setOldPassword}
//               secureTextEntry={!showOldPassword}
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             <TouchableOpacity
//               onPress={() =>
//                 setShowOldPassword(
//                   !showOldPassword
//                 )
//               }
//             >
//               <Text style={styles.showText}>
//                 {showOldPassword
//                   ? "Hide"
//                   : "Show"}
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </View>


//         {/* New Password */}
//         <View style={styles.inputContainer}>

//           <Text style={styles.label}>
//             New Password
//           </Text>

//           <View style={styles.passwordContainer}>

//             <TextInput
//               style={styles.passwordInput}
//               placeholder="Enter new password"
//               placeholderTextColor="#999"
//               value={newPassword}
//               onChangeText={setNewPassword}
//               secureTextEntry={!showNewPassword}
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             <TouchableOpacity
//               onPress={() =>
//                 setShowNewPassword(
//                   !showNewPassword
//                 )
//               }
//             >
//               <Text style={styles.showText}>
//                 {showNewPassword
//                   ? "Hide"
//                   : "Show"}
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </View>


//         {/* Confirm Password */}
//         <View style={styles.inputContainer}>

//           <Text style={styles.label}>
//             Confirm New Password
//           </Text>

//           <View style={styles.passwordContainer}>

//             <TextInput
//               style={styles.passwordInput}
//               placeholder="Confirm new password"
//               placeholderTextColor="#999"
//               value={confirmPassword}
//               onChangeText={
//                 setConfirmPassword
//               }
//               secureTextEntry={
//                 !showConfirmPassword
//               }
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             <TouchableOpacity
//               onPress={() =>
//                 setShowConfirmPassword(
//                   !showConfirmPassword
//                 )
//               }
//             >
//               <Text style={styles.showText}>
//                 {showConfirmPassword
//                   ? "Hide"
//                   : "Show"}
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </View>


//         {/* Password requirement */}
//         <Text style={styles.requirement}>
//           • Password must be at least 6 characters
//         </Text>

//         <Text style={styles.requirement}>
//           • New password must be different from
//           your current password
//         </Text>


//         {/* Button */}
//         <TouchableOpacity
//           style={[
//             styles.button,
//             isLoading && styles.disabledButton,
//           ]}
//           onPress={handleChangePassword}
//           disabled={isLoading}
//         >

//           <Text style={styles.buttonText}>
//             {isLoading
//               ? "Changing Password..."
//               : "Change Password"}
//           </Text>

//         </TouchableOpacity>


//         {/* Cancel */}
//         <TouchableOpacity
//           style={styles.cancelButton}
//           onPress={() => navigation.goBack()}
//           disabled={isLoading}
//         >
//           <Text style={styles.cancelText}>
//             Cancel
//           </Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };


// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   content: {
//     padding: 24,
//     paddingTop: 40,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#222",
//     marginBottom: 8,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: "#666",
//     lineHeight: 22,
//     marginBottom: 30,
//   },

//   inputContainer: {
//     marginBottom: 20,
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 8,
//   },

//   passwordContainer: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//   },

//   passwordInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#222",
//   },

//   showText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#007bff",
//   },

//   requirement: {
//     fontSize: 13,
//     color: "#777",
//     marginBottom: 6,
//   },

//   button: {
//     height: 52,
//     backgroundColor: "#007bff",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 25,
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   cancelButton: {
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },

//   cancelText: {
//     color: "#555",
//     fontSize: 15,
//     fontWeight: "600",
//   },

// });

// export default ChangePasswordScreen;