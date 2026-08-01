import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import SystemNavigationBar from 'react-native-system-navigation-bar';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import COLOR from '../../Utilities/Color';

import {
  setEmail,
  setPassword,
} from '../../Redux/Features/Authentication/AuthSlice';

import {
  useLoginMutation,
} from '../../Redux/Features/Authentication/AuthApi';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();

  const { email, password } = useSelector(
    state => state.auth,
  );

  const [isKeyboardVisible, setIsKeyboardVisible] =
    useState(false);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      'black',
      'light',
    );

    const keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );

    const keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    const formattedEmail = email.trim().toLowerCase();

    if (!formattedEmail) {
      Alert.alert(
        'Validation',
        'Email is required',
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        'Validation',
        'Password is required',
      );
      return;
    }

    try {
      const response = await login({
        email: formattedEmail,
        password,
      }).unwrap();

      console.log('Login response:', response);

      navigation.navigate('VerifyLoginOtp', {
        email: formattedEmail,
      });
    } catch (error) {
      console.log('Login error:', error);

      Alert.alert(
        'Error',
        error?.data?.message || 'Login failed',
      );
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="#000000"
        barStyle="light-content"
      />

      <View style={styles.container}>
        <Text style={styles.title}>SIGN IN</Text>

        <Text style={styles.subtitle}>
          Sign in to continue where you left off
        </Text>

        <Text style={styles.label}>User Email</Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={email}
            onChangeText={text =>
              dispatch(setEmail(text))
            }
            placeholder="Enter your email"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor="#FFFFFF"
            cursorColor="#FFFFFF"
            style={styles.input}
          />
        </LinearGradient>

        <Text
          style={[
            styles.label,
            styles.passwordLabel,
          ]}
        >
          Password
        </Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={password}
            onChangeText={text =>
              dispatch(setPassword(text))
            }
            placeholder="Enter your password"
            placeholderTextColor="#777777"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor="#FFFFFF"
            cursorColor="#FFFFFF"
            style={styles.input}
          />
        </LinearGradient>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            New here?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Signup')
            }
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {' '}
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        {!isKeyboardVisible && (
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomContainerText}>
              Developed by
            </Text>

            <Text style={styles.instituteText}>
              Melbourne Institute of Technology
            </Text>
          </View>
        )}
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
    fontSize: 15,
    color: COLOR.GRAY_LIGHT,
    letterSpacing: 2,
    marginBottom: 35,
    textAlign: 'center',
  },

  label: {
    width: '100%',
    color: COLOR.WHITE,
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 14,
    letterSpacing: 1,
  },

  passwordLabel: {
    marginTop: 10,
  },

  containerBox: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  input: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.5,
    paddingVertical: 8,
  },

  button: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#383838',
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15,
  },

  disabledButton: {
    opacity: 0.5,
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
    bottom: 60,
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