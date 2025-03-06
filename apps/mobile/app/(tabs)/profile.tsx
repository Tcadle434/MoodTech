import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Layout, Text, Card, Avatar, Divider, Icon, Button } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // The AuthContext will handle navigation
  };
  
  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text category="h1">Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="settings-outline" style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.profileSection}>
            <Avatar 
              style={styles.avatar} 
              size="giant"
              source={require('@/assets/images/icon.png')} 
            />
            <Text category="h5" style={styles.userName}>{user?.name || 'User'}</Text>
            <Text category="s1" style={styles.userEmail}>{user?.email || 'No email available'}</Text>
          </View>
          
          <View style={styles.statsSection}>
            <Text category="h6" style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text category="h1" style={styles.statNumber}>12</Text>
                <Text category="c1">Days tracked</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text category="h1" style={styles.statNumber}>8</Text>
                <Text category="c1">Happy days</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text category="h1" style={styles.statNumber}>75%</Text>
                <Text category="c1">Positivity</Text>
              </Card>
            </View>
          </View>
          
          <View style={styles.badgesSection}>
            <Text category="h6" style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: '#4CAF50' }]}>
                  <Icon name="checkmark-outline" style={styles.badgeIconInner} />
                </View>
                <Text category="c1" style={styles.badgeText}>First mood</Text>
              </View>
              
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: '#FF9800' }]}>
                  <Icon name="calendar-outline" style={styles.badgeIconInner} />
                </View>
                <Text category="c1" style={styles.badgeText}>7 day streak</Text>
              </View>
              
              <View style={[styles.badge, styles.lockedBadge]}>
                <View style={[styles.badgeIcon, { backgroundColor: '#9E9E9E' }]}>
                  <Icon name="lock-outline" style={styles.badgeIconInner} />
                </View>
                <Text category="c1" style={styles.badgeText}>30 day streak</Text>
              </View>
              
              <View style={[styles.badge, styles.lockedBadge]}>
                <View style={[styles.badgeIcon, { backgroundColor: '#9E9E9E' }]}>
                  <Icon name="lock-outline" style={styles.badgeIconInner} />
                </View>
                <Text category="c1" style={styles.badgeText}>Happy month</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.settingsSection}>
            <Text category="h6" style={styles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.settingRow}>
              <Icon name="person-outline" style={styles.settingIcon} />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Icon name="chevron-right-outline" style={styles.chevronIcon} />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <Icon name="bell-outline" style={styles.settingIcon} />
              <Text style={styles.settingText}>Notifications</Text>
              <Icon name="chevron-right-outline" style={styles.chevronIcon} />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <Icon name="shield-outline" style={styles.settingIcon} />
              <Text style={styles.settingText}>Privacy</Text>
              <Icon name="chevron-right-outline" style={styles.chevronIcon} />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
              <Icon name="log-out-outline" style={[styles.settingIcon, { tintColor: '#FF3D71' }]} />
              <Text style={[styles.settingText, { color: '#FF3D71' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 48,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.6,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    padding: 15,
  },
  statNumber: {
    marginBottom: 5,
  },
  badgesSection: {
    padding: 20,
    paddingTop: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  badge: {
    width: '25%',
    alignItems: 'center',
    padding: 5,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  badgeIconInner: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  badgeText: {
    textAlign: 'center',
  },
  settingsSection: {
    padding: 20,
    paddingTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingIcon: {
    width: 22,
    height: 22,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    opacity: 0.5,
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});