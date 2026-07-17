import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import LinearGradient from 'react-native-linear-gradient';
import COLOR from '../../Utilities/Color';
import SIGN_UP from '../../Functions/Authentication/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import {
  setName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setUser,
  clearSignUpForm,
} from '../../Redux/Features/Authentication/AuthSlice';

const SignUp = ({ navigation }) => {
  useEffect(() => {
    SystemNavigationBar.setNavigationColor('black', 'light');
  }, []);

  const dispatch = useDispatch();

  const { name, email, password, confirmPassword, } = useSelector(state => state.authentication);

  return (
    <>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
      />

      <View style={styles.container}>
        <Text style={styles.title}>SIGN UP</Text>

        <Text style={styles.subtitle}>
          Create your account to get started
        </Text>

        <Text style={styles.label}>Full Name</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={name}
            onChangeText={value => dispatch(setName(value))}
            placeholder="Enter your full name"
            placeholderTextColor="#777"
            style={styles.input}
            autoCapitalize="words"
          />
        </LinearGradient>

        <Text style={styles.label}>Email Address</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={email}
            onChangeText={value => dispatch(setEmail(value))}
            placeholder="Enter your email"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </LinearGradient>

        <Text style={styles.label}>Password</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={password}
            onChangeText={value => dispatch(setPassword(value))}
            placeholder="Enter your password"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
          />
        </LinearGradient>

        <Text style={styles.label}>Confirm Password</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={confirmPassword}
            onChangeText={value => dispatch(setConfirmPassword(value))}
            placeholder="Confirm your password"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
          />
        </LinearGradient>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const isValid = SIGN_UP.HANDLE_SIGNUP({
              name,
              email,
              password,
              confirmPassword,
            });

            if (!isValid) {
              return;
            }

            dispatch(setUser({ name, email }));
            dispatch(clearSignUpForm());

          }}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate('Login')}
          >
            <Text style={styles.loginButtonText}> Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomContainerText}>
            Developed by
          </Text>

          <Text style={styles.instituteText}>
            Melbourne Institute of Technology
          </Text>
        </View>
      </View>
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 35,
    color: COLOR.WHITE,
    fontFamily: 'Quantico-Bold',
    letterSpacing: 10,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: COLOR.GRAY_LIGHT,
    letterSpacing: 1.5,
    marginBottom: 25,
    textAlign: 'center',
  },

  label: {
    width: '100%',
    color: COLOR.WHITE,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 8,
    fontSize: 14,
    letterSpacing: 1,
  },

  containerBox: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },

  input: {
    color: COLOR.WHITE,
    fontSize: 15,
    letterSpacing: 0.5,
    paddingVertical: 8,
  },

  button: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#383838',
    marginTop: 22,
    borderRadius: 10,
    paddingVertical: 15,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 2,
    color: COLOR.WHITE,
    fontWeight: '600',
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

  bottomContainer: {
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
  },

  bottomContainerText: {
    color: COLOR.GRAY_MID,
    textAlign: 'center',
    fontSize: 12,
  },

  instituteText: {
    color: COLOR.WHITE,
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 12,
    marginTop: 3,
  },
});