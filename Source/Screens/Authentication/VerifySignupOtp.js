import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { useVerifySignupOtpMutation } from '../../Redux/Features/Authentication/AuthApi';
import { setUser } from '../../Redux/Features/Authentication/AuthSlice';

const VerifySignupOtp = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { email } = route.params;

  const [otp, setOtp] = useState('');

  const [verifySignupOtp, { isLoading }] =
    useVerifySignupOtpMutation();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Please enter a valid OTP');
      return;
    }

    try {
      const response = await verifySignupOtp({
        email,
        otp,
      }).unwrap();

      // Save JWT
      await AsyncStorage.setItem(
        'accessToken',
        response.data.accessToken,
      );

      // Save user in Redux
      dispatch(setUser(response.data.user));

      Alert.alert('Success', 'Account verified successfully');

      navigation.replace('Main');
    } catch (error) {
      Alert.alert(
        'Error',
        error?.data?.message || 'OTP verification failed',
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Email</Text>
      <Text>{email}</Text>

      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        style={{
          borderWidth: 1,
          marginVertical: 20,
          padding: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleVerify}
        disabled={isLoading}
      >
        <Text>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifySignupOtp;