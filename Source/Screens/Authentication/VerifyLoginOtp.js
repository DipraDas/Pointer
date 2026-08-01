import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';

import COLOR from '../../Utilities/Color';

import {
  useVerifyLoginOtpMutation,
} from '../../Redux/Features/Authentication/AuthApi';

import {
  setUser,
  setEmail,
  setPassword,
} from '../../Redux/Features/Authentication/AuthSlice';

const VerifyLoginOtp = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const email = route.params?.email || '';

  const [otp, setOtp] = useState('');

  const [verifyLoginOtp, { isLoading }] =
    useVerifyLoginOtpMutation();

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      'black',
      'light',
    );
  }, []);

  const handleVerify = async () => {
    const formattedOtp = otp.trim();

    if (formattedOtp.length !== 6) {
      Alert.alert(
        'Validation',
        'Please enter a valid 6-digit OTP',
      );
      return;
    }

    try {
      const response = await verifyLoginOtp({
        email,
        otp: formattedOtp,
      }).unwrap();

      console.log(
        'Login OTP verification response:',
        response,
      );

      const accessToken = response?.data?.accessToken;
      const user = response?.data?.user;

      if (!accessToken) {
        Alert.alert(
          'Error',
          'Access token was not returned by the server',
        );
        return;
      }

      await AsyncStorage.setItem(
        'accessToken',
        accessToken,
      );

      if (user) {
        const username =
          user.username || user.name || '';

        const userEmail =
          user.email || email;

        await AsyncStorage.setItem(
          'username',
          username,
        );

        await AsyncStorage.setItem(
          'email',
          userEmail,
        );

        dispatch(setUser(user));

        console.log('Saved username:', username);
        console.log('Saved email:', userEmail);
      } else {
        await AsyncStorage.setItem('email', email);

        console.log('Saved email:', email);
      }

      console.log('Saved access token:', accessToken);

      // Clear OTP, login email and password inputs
      setOtp('');
      dispatch(setEmail(''));
      dispatch(setPassword(''));

      // Navigate to the main application
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.log(
        'Login OTP verification error:',
        error,
      );

      Alert.alert(
        'Error',
        error?.data?.message ||
        error?.message ||
        'OTP verification failed',
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
        <Text style={styles.title}>VERIFY OTP</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to
        </Text>

        <Text style={styles.email}>{email}</Text>

        <Text style={styles.label}>
          Please enter verification code
        </Text>

        <LinearGradient
          colors={['#212121', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerBox}
        >
          <TextInput
            value={otp}
            onChangeText={value => {
              const numbersOnly = value.replace(
                /[^0-9]/g,
                '',
              );

              setOtp(numbersOnly);
            }}
            placeholderTextColor="#777"
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            autoFocus
            style={styles.input}
          />
        </LinearGradient>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'VERIFYING...' : 'VERIFY'}
          </Text>
        </TouchableOpacity>

        <View style={styles.backContainer}>
          <Text style={styles.backText}>
            Entered the wrong email?
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default VerifyLoginOtp;

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
    marginBottom: 10,
  },

  subtitle: {
    color: COLOR.GRAY_LIGHT,
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 22,
  },

  email: {
    color: COLOR.WHITE,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 35,
  },

  label: {
    width: '100%',
    color: COLOR.WHITE,
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 14,
    letterSpacing: 1,
  },

  containerBox: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  input: {
    color: COLOR.WHITE,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 10,
    paddingVertical: 10,
  },

  button: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#383838',
    marginTop: 25,
    borderRadius: 10,
    paddingVertical: 15,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: COLOR.WHITE,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
  },

  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  backText: {
    color: COLOR.GRAY_MID,
    fontSize: 13,
  },

  backButtonText: {
    color: COLOR.WHITE,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 5,
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