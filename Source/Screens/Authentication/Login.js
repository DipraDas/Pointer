import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import COLOR from '../../Utilities/Color';
import LinearGradient from 'react-native-linear-gradient';

import { useDispatch, useSelector } from 'react-redux';

import {
  setEmail,
  setPassword,
} from '../../Redux/Features/Authentication/AuthSlice';

import { useLoginMutation } from '../../Redux/Features/Authentication/AuthApi';

const Login = ({ navigation }) => {

  useEffect(() => {
    SystemNavigationBar.setNavigationColor('black', 'light');
  }, []);
  const dispatch = useDispatch();

  const { email, password } = useSelector(
    state => state.auth
  );

  const [login, { isLoading }] = useLoginMutation();
  const handleLogin = async () => {

    if (!email.trim()) {
      Alert.alert("Validation", "Email is required");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validation", "Password is required");
      return;
    }

    try {

      const response = await login({
        email,
        password,

      }).unwrap();

      console.log("Login Response");
      console.log(response);
console.log(navigation.getState());

      navigation.navigate("VerifyLoginOtp", {
        email,
      });

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        error?.data?.message || "Login failed"
      );

    }

  };

  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
      />

      <View style={styles.container}>
        <Text style={styles.title}>SIGN IN</Text>
        <Text style={styles.subtitle}>Sign in to continue where you left off</Text>
        <Text style={styles.label}>User Email</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={email}
            onChangeText={text => dispatch(setEmail(text))}
            placeholder="Enter your email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </LinearGradient>

        <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={password}
            onChangeText={text => dispatch(setPassword(text))}
            placeholder="Enter your password"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
          />
        </LinearGradient>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            New here?
          </Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate('Signup')}
          >
            <Text style={[styles.loginButtonText, { marginLeft: 5 }]}> Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomContainerText}>Developed by</Text>
          <Text style={[styles.bottomContainerText,
          { color: COLOR.WHITE, letterSpacing: 1 }
          ]}>
            Melbourne Institute of Technology
          </Text>
        </View>
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 35,
    color: COLOR.WHITE,
    fontFamily: 'Quantico-Bold',
    letterSpacing: 10,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 15,
    color: COLOR.GRAY_LIGHT,
    letterSpacing: 2,
    marginBottom: 35
  },
  containerBox: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8
  },
  boxText: {
    color: '#fff',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: COLOR.GRAY_MID,
    letterSpacing: 1
  },
  label: {
    width: '100%',
    color: COLOR.WHITE,
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 14,
    letterSpacing: 1,
  },
  button: {
    width: '90%',
    // backgroundColor: COLOR.WHITE,
    borderWidth: 1,
    borderColor: '#383838',
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 2,
    color: COLOR.WHITE,
    fontWeight: 600
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60
  },
  bottomContainerText: {
    color: COLOR.GRAY_MID,
    textAlign: 'center'
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  loginText: {
    color: COLOR.GRAY_MID,
    fontSize: 13,
  },

  loginButtonText: {
    color: COLOR.WHITE,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});