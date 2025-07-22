import React, { useState } from 'react';
import { Image } from 'expo-image';
import { 
  Platform, 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

type UserRole = 'student' | 'employee' | null;

export default function HomeScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }
    
    if (!userid || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically handle the login logic
    Alert.alert('Success', `Logging in as ${selectedRole} with UserID: ${userid}`);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setUserId('');
    setPassword('');
  };

  if (!selectedRole) {
    return (
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.logo}
              />
              <ThemedText type="title" style={styles.welcomeText}>
                Welcome Back!
              </ThemedText>
              <ThemedText style={styles.subtitleText}>
                Please select your role to continue
              </ThemedText>
            </View>

            <View style={isDesktop ? styles.roleContainerDesktop : styles.roleContainerMobile}>
              <TouchableOpacity
                style={styles.roleCard}
                onPress={() => handleRoleSelect('student')}
                activeOpacity={0.8}
              >
                <View style={[styles.roleIcon, styles.studentIcon]}>
                  <ThemedText style={styles.roleEmoji}>🎓</ThemedText>
                </View>
                <ThemedText type="subtitle" style={styles.roleTitle}>
                  Student
                </ThemedText>
                <ThemedText style={styles.roleDescription}>
                  Room Cleaning, Complaints
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleCard}
                onPress={() => handleRoleSelect('employee')}
                activeOpacity={0.8}
              >
                <View style={[styles.roleIcon, styles.employeeIcon]}>
                  <ThemedText style={styles.roleEmoji}>💼</ThemedText>
                </View>
                <ThemedText type="subtitle" style={styles.roleTitle}>
                  Employee
                </ThemedText>
                <ThemedText style={styles.roleDescription}>
                  Manage Requests, View Complaints
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBackToRoleSelection}
              style={styles.backButton}
            >
              <ThemedText style={styles.backButtonText}>← Back</ThemedText>
            </TouchableOpacity>
            
            <View style={[styles.roleIcon, selectedRole === 'student' ? styles.studentIcon : styles.employeeIcon, styles.selectedRoleIcon]}>
              <ThemedText style={styles.roleEmoji}>
                {selectedRole === 'student' ? '🎓' : '💼'}
              </ThemedText>
            </View>
            
            <ThemedText type="title" style={styles.loginTitle}>
              {selectedRole === 'student' ? 'Student' : 'Employee'} Login
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>User ID</ThemedText>
              <TextInput
                style={styles.input}
                value={userid}
                onChangeText={setUserId}
                placeholder="Enter your User ID"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>
                Sign In
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerButton}>
              <ThemedText style={styles.registerButtonText}>
                Create New Account
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 50,
    marginBottom: 20,
  },
  welcomeText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
  },
  roleContainerMobile: {
    gap: 20,
  },
  roleContainerDesktop: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  },
  roleCard: {
    backgroundColor: '#1b7ddfff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#7aabdbff',
    ...(isDesktop && { flex: 1, minWidth: 280 }),
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  selectedRoleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  studentIcon: {
    backgroundColor: '#e3f2fd',
  },
  employeeIcon: {
    backgroundColor: '#f3e5f5',
  },
  roleEmoji: {
    fontSize: 30,
  },
  roleTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  loginTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  formContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.7,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});