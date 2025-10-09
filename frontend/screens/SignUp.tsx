// src/screens/SignUp.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Task',
          description: 'Demo task for sign-up',
        }),
      });
  
      const data = await response.json();
      console.log('Created:', data);
      Alert.alert('Success', 'User created!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not create user');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <TextField
        label="Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

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
        placeholder="Create a password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton title="Sign Up" onPress={handleSignUp} />

      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.link}>Log in</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#E6F4EA', //seafoam green
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#2E7D32', //dark green
    textAlign: 'center',
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

export default SignUp;

