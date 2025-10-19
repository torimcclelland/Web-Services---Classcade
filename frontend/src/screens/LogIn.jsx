// src/screens/Login.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInstructorLogin = () => {
    console.log('Instructor login:', { email, password });
    // TODO: Navigate to instructor dashboard
  };

  const handleStudentLogin = () => {
    console.log('Student login:', { email, password });
    // TODO: Navigate to student dashboard
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextField
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextField
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonGroup}>
        <PrimaryButton title="Sign In as Instructor" onPress={handleInstructorLogin} />
        <PrimaryButton title="Sign In as Student" onPress={handleStudentLogin} />
      </View>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.link}>Sign up</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#E6F4EA', // soft green from your Figma
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#2E7D32', // deeper green
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  link: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});

export default Login;



