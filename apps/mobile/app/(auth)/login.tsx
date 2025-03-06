import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      // The router.replace is not needed here as the AuthContext will handle navigation
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Please check your credentials and try again');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category="h1" style={styles.title}>MoodTech</Text>
        <Text category="s1" style={styles.subtitle}>Track your mood, improve your life</Text>
        
        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <Input
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />
          
          <Button
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </Button>
          
          <Button
            appearance="ghost"
            status="basic"
            onPress={() => router.push('/register')}
          >
            Don't have an account? Sign up
          </Button>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.8,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
});