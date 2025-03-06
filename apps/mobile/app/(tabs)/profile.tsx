import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { Layout, Text, Card, Avatar, Divider, Icon, Button, Spinner } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMoodStore } from '@/store/moodStore';
import { MoodType } from 'shared';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [isLoading, setIsLoading] = useState(true);
  
  // Stat counts
  const [totalDays, setTotalDays] = useState(0);
  const [happyDays, setHappyDays] = useState(0);
  const [happyPercentage, setHappyPercentage] = useState(0);
  
  // Badge indicators
  const [hasFirstMood, setHasFirstMood] = useState(false);
  const [has7DayStreak, setHas7DayStreak] = useState(false); 
  const [has30DayStreak, setHas30DayStreak] = useState(false);
  const [hasHappyMonth, setHasHappyMonth] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Get mood data from store
  const fetchAllEntries = useMoodStore(state => state.fetchAllEntries);
  const entries = useMoodStore(state => state.entries);
  
  // Load mood data and calculate stats
  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true);
      try {
        // Fetch all mood entries
        await fetchAllEntries();
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoodData();
  }, []);
  
  // Calculate stats and badges whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      // Total days with mood entries
      setTotalDays(entries.length);
      
      // Count happy days
      const happyCount = entries.filter(entry => entry.mood === MoodType.HAPPY).length;
      setHappyDays(happyCount);
      
      // Calculate happy percentage
      const percentage = Math.round((happyCount / entries.length) * 100);
      setHappyPercentage(percentage);
      
      // Check for first mood badge
      setHasFirstMood(entries.length > 0);
      
      // Check for 7-day streak
      const has7Day = checkForStreak(entries, 7);
      setHas7DayStreak(has7Day);
      
      // Check for 30-day streak
      const has30Day = checkForStreak(entries, 30);
      setHas30DayStreak(has30Day);
      
      // Check for happy month badge (if at least 80% of entries in a month are happy)
      const isHappyMonth = checkForHappyMonth(entries);
      setHasHappyMonth(isHappyMonth);
    }
  }, [entries]);
  
  // Check if there's a streak of consecutive days
  const checkForStreak = (entries, requiredDays) => {
    if (entries.length < requiredDays) return false;
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    // Find the longest streak
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = parseISO(sortedEntries[i-1].date);
      const prevDate = parseISO(sortedEntries[i].date);
      
      // Check if dates are consecutive
      const dayDiff = Math.abs(currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak >= requiredDays;
  };
  
  // Check if there's a month where at least 80% of entries are happy
  const checkForHappyMonth = (entries) => {
    if (entries.length < 15) return false; // Need at least 15 entries to qualify
    
    // Group entries by month
    const entriesByMonth = {};
    
    entries.forEach(entry => {
      const date = parseISO(entry.date);
      const monthKey = format(date, 'yyyy-MM');
      
      if (!entriesByMonth[monthKey]) {
        entriesByMonth[monthKey] = [];
      }
      
      entriesByMonth[monthKey].push(entry);
    });
    
    // Check each month
    for (const month in entriesByMonth) {
      const monthEntries = entriesByMonth[month];
      
      if (monthEntries.length >= 15) {
        const happyCount = monthEntries.filter(entry => entry.mood === MoodType.HAPPY).length;
        const happyPercentage = (happyCount / monthEntries.length) * 100;
        
        if (happyPercentage >= 80) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Animation effect when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, scaleAnim]);
  
  const handleLogout = async () => {
    await logout();
    // The AuthContext will handle navigation
  };
  
  // Gradient colors for stat cards
  const statGradients = {
    days: ['#5B9AA9', '#4A7F8C'],       // Primary colors
    happy: ['#84B59F', '#6B9681'],      // Success colors
    positivity: ['#A1D6E2', '#82C5D4'], // Info colors
  };
  
  return (
    <Layout style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Animated.View 
        style={[
          styles.animatedContainer, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text 
              category="h1" 
              style={[styles.headerTitle, { color: colors.text }]}
            >
              Profile
            </Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon 
                name="settings-outline" 
                style={[styles.settingsIcon, { tintColor: colors.text }]} 
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileSection}>
              <Avatar 
                style={styles.avatar} 
                size="giant"
                source={require('@/assets/images/icon.png')} 
              />
              <Text 
                category="h5" 
                style={[styles.userName, { color: colors.text }]}
              >
                {user?.name || 'User'}
              </Text>
              <Text 
                category="s1" 
                style={[styles.userEmail, { color: colors.textSecondary }]}
              >
                {user?.email || 'No email available'}
              </Text>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Spinner size="large" status="primary" />
                <Text 
                  category="s1" 
                  style={[styles.loadingText, { color: colors.textSecondary }]}
                >
                  Loading your stats...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.statsSection}>
                  <Text 
                    category="h6" 
                    style={[styles.sectionTitle, { color: colors.text }]}
                  >
                    Your Stats
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
                      <LinearGradient
                        colors={statGradients.days}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                      >
                        <Text 
                          category="h3" 
                          style={styles.statNumber}
                        >
                          {totalDays}
                        </Text>
                        <Text 
                          category="c1" 
                          style={styles.statLabel}
                        >
                          Days tracked
                        </Text>
                      </LinearGradient>
                    </View>
                    
                    <View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
                      <LinearGradient
                        colors={statGradients.happy}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                      >
                        <Text 
                          category="h3" 
                          style={styles.statNumber}
                        >
                          {happyDays}
                        </Text>
                        <Text 
                          category="c1" 
                          style={styles.statLabel}
                        >
                          Happy days
                        </Text>
                      </LinearGradient>
                    </View>
                    
                    <View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
                      <LinearGradient
                        colors={statGradients.positivity}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                      >
                        <Text 
                          category="h3" 
                          style={styles.statNumber}
                        >
                          {happyPercentage}%
                        </Text>
                        <Text 
                          category="c1" 
                          style={styles.statLabel}
                        >
                          Happy days
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
                
                <View style={styles.badgesSection}>
                  <Text 
                    category="h6" 
                    style={[styles.sectionTitle, { color: colors.text }]}
                  >
                    Badges
                  </Text>
                  <View style={styles.badgesRow}>
                    {/* First mood badge - always unlocked if user has at least one entry */}
                    <View style={[styles.badge, !hasFirstMood && styles.lockedBadge]}>
                      <View style={[
                        styles.badgeIcon, 
                        { backgroundColor: hasFirstMood ? colors.tertiary : colors.subtle }
                      ]}>
                        <Icon 
                          name={hasFirstMood ? "checkmark-outline" : "lock-outline"} 
                          style={styles.badgeIconInner} 
                        />
                      </View>
                      <Text 
                        category="c1" 
                        style={[
                          styles.badgeText, 
                          { color: hasFirstMood ? colors.text : colors.textSecondary }
                        ]}
                      >
                        First mood
                      </Text>
                    </View>
                    
                    {/* 7-day streak badge */}
                    <View style={[styles.badge, !has7DayStreak && styles.lockedBadge]}>
                      <View style={[
                        styles.badgeIcon, 
                        { backgroundColor: has7DayStreak ? colors.tint : colors.subtle }
                      ]}>
                        <Icon 
                          name={has7DayStreak ? "calendar-outline" : "lock-outline"} 
                          style={styles.badgeIconInner} 
                        />
                      </View>
                      <Text 
                        category="c1" 
                        style={[
                          styles.badgeText, 
                          { color: has7DayStreak ? colors.text : colors.textSecondary }
                        ]}
                      >
                        7 day streak
                      </Text>
                    </View>
                    
                    {/* 30-day streak badge */}
                    <View style={[styles.badge, !has30DayStreak && styles.lockedBadge]}>
                      <View style={[
                        styles.badgeIcon, 
                        { backgroundColor: has30DayStreak ? colors.secondary : colors.subtle }
                      ]}>
                        <Icon 
                          name={has30DayStreak ? "award-outline" : "lock-outline"} 
                          style={styles.badgeIconInner} 
                        />
                      </View>
                      <Text 
                        category="c1" 
                        style={[
                          styles.badgeText, 
                          { color: has30DayStreak ? colors.text : colors.textSecondary }
                        ]}
                      >
                        30 day streak
                      </Text>
                    </View>
                    
                    {/* Happy month badge */}
                    <View style={[styles.badge, !hasHappyMonth && styles.lockedBadge]}>
                      <View style={[
                        styles.badgeIcon, 
                        { backgroundColor: hasHappyMonth ? '#FFA726' : colors.subtle }
                      ]}>
                        <Icon 
                          name={hasHappyMonth ? "sun-outline" : "lock-outline"} 
                          style={styles.badgeIconInner} 
                        />
                      </View>
                      <Text 
                        category="c1" 
                        style={[
                          styles.badgeText, 
                          { color: hasHappyMonth ? colors.text : colors.textSecondary }
                        ]}
                      >
                        Happy month
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
            
            <View style={styles.settingsSection}>
              <Text 
                category="h6" 
                style={[styles.sectionTitle, { color: colors.text }]}
              >
                Settings
              </Text>
              
              <TouchableOpacity 
                style={[styles.settingRow, { backgroundColor: colors.surface }]}
              >
                <Icon 
                  name="person-outline" 
                  style={[styles.settingIcon, { tintColor: colors.text }]} 
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Edit Profile
                </Text>
                <Icon 
                  name="chevron-right-outline" 
                  style={[styles.chevronIcon, { tintColor: colors.textSecondary }]} 
                />
              </TouchableOpacity>
              
              <Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />
              
              <TouchableOpacity 
                style={[styles.settingRow, { backgroundColor: colors.surface }]}
              >
                <Icon 
                  name="bell-outline" 
                  style={[styles.settingIcon, { tintColor: colors.text }]} 
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Notifications
                </Text>
                <Icon 
                  name="chevron-right-outline" 
                  style={[styles.chevronIcon, { tintColor: colors.textSecondary }]} 
                />
              </TouchableOpacity>
              
              <Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />
              
              <TouchableOpacity 
                style={[styles.settingRow, { backgroundColor: colors.surface }]}
              >
                <Icon 
                  name="shield-outline" 
                  style={[styles.settingIcon, { tintColor: colors.text }]} 
                />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Privacy
                </Text>
                <Icon 
                  name="chevron-right-outline" 
                  style={[styles.chevronIcon, { tintColor: colors.textSecondary }]} 
                />
              </TouchableOpacity>
              
              <Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />
              
              <TouchableOpacity 
                style={[styles.settingRow, { backgroundColor: colors.surface }]} 
                onPress={handleLogout}
              >
                <Icon 
                  name="log-out-outline" 
                  style={[styles.settingIcon, { tintColor: '#F9695E' }]} 
                />
                <Text style={[styles.settingText, { color: '#F9695E' }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
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
    fontWeight: '600',
  },
  userEmail: {
    opacity: 0.7,
  },
  statsSection: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCardContainer: {
    flex: 1,
    margin: 6,
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  statNumber: {
    marginBottom: 5,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  badgesSection: {
    padding: 24,
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
    padding: 8,
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
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIconInner: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  badgeText: {
    textAlign: 'center',
    fontSize: 12,
  },
  settingsSection: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 22,
    height: 22,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  chevronIcon: {
    width: 18,
    height: 18,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});