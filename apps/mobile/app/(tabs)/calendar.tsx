import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Layout, Text, Button, Input, Calendar, CalendarProps, Spinner } from '@ui-kitten/components';
import { format, startOfMonth, subDays, isSameDay, addDays, isFuture, parseISO, endOfMonth } from 'date-fns';
import { MoodType } from 'shared';
import { useMoodStore } from '@/store/moodStore';

// Interface for mood entries
interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodType;
  note?: string;
}

// Helper function for mood color
const getMoodColor = (mood: MoodType) => {
  switch (mood) {
    case MoodType.HAPPY:
      return '#4CAF50';
    case MoodType.NEUTRAL:
      return '#FFC107';
    case MoodType.SAD:
      return '#F44336';
    default:
      return 'transparent';
  }
};

// This will highlight dates with mood data in the calendar
type DayCellProps = CalendarProps<Date> & { 
  moodEntries: MoodEntry[] 
};

const DayCell = (props: DayCellProps) => {
  const { date, style = {}, moodEntries, ...cellProps } = props;
  
  if (!date) return null;
  
  const currentDate = new Date();

  // Don't allow selecting future dates
  if (isFuture(date) && !isSameDay(date, currentDate)) {
    return (
      <View
        style={[styles.dayCell, styles.disabledDayCell, style?.container]}
        {...cellProps}>
        <Text style={[style?.text, styles.disabledDayText]}>{`${date.getDate()}`}</Text>
      </View>
    );
  }

  // Check if there's mood data for this date
  const dateString = format(date, "yyyy-MM-dd");
  const moodEntry = moodEntries.find(entry => entry.date === dateString);

  const isToday = isSameDay(date, new Date());
  const isThisWeek = 
    date > subDays(new Date(), 7) && 
    !isFuture(date);

  return (
    <View
      style={[
        styles.dayCell,
        style?.container,
        isToday && styles.todayCell,
      ]}
      {...cellProps}>
      {moodEntry ? (
        <View
          style={[
            styles.moodIndicator,
            { backgroundColor: getMoodColor(moodEntry.mood) },
          ]}>
          <Text style={[style?.text, styles.moodDayText]}>{`${date.getDate()}`}</Text>
        </View>
      ) : (
        <>
          <Text style={style?.text}>{`${date.getDate()}`}</Text>
          {isThisWeek && <View style={styles.addButton} />}
        </>
      )}
    </View>
  );
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [viewMode, setViewMode] = useState<'add' | 'view'>('add');
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getMoodForDate = useMoodStore(state => state.getMoodForDate);
  const addMoodEntry = useMoodStore(state => state.addMoodEntry);
  const updateMoodEntry = useMoodStore(state => state.updateMoodEntry);
  const fetchEntriesForDateRange = useMoodStore(state => state.fetchEntriesForDateRange);
  const fetchMoodForDate = useMoodStore(state => state.fetchMoodForDate);
  
  // Load mood data for the current month
  useEffect(() => {
    const loadMonthData = async () => {
      setIsLoading(true);
      try {
        // Small delay to ensure auth is set up
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Calendar: Loading month data for', format(currentMonth, 'MMMM yyyy'));
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        await fetchEntriesForDateRange(start, end);
        console.log('Calendar: Month data loaded successfully');
      } catch (error) {
        console.error('Error fetching month data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMonthData();
  }, [currentMonth]);
  
  const handleDayPress = async (date: Date) => {
    // Only allow selecting today or past dates within the last week
    const currentDate = new Date();
    const oneWeekAgo = subDays(currentDate, 7);
    
    if (isFuture(date) && !isSameDay(date, currentDate)) {
      return;
    }
    
    setSelectedDate(date);
    
    try {
      // Fetch the latest data for this date
      const moodEntry = await fetchMoodForDate(date);
      
      if (moodEntry) {
        setSelectedMood(moodEntry.mood);
        setNote(moodEntry.note || '');
        setViewMode('view');
      } else {
        setSelectedMood(null);
        setNote('');
        setViewMode('add');
      }
      
      setMoodModalVisible(true);
    } catch (error) {
      console.error('Error fetching mood for date:', error);
    }
  };
  
  const handleSaveMood = async () => {
    if (selectedDate && selectedMood) {
      try {
        await addMoodEntry(selectedDate, selectedMood, note);
        setMoodModalVisible(false);
      } catch (error) {
        console.error('Error saving mood:', error);
      }
    }
  };
  
  const handleMonthChange = (nextDate: Date) => {
    setCurrentMonth(nextDate);
  };
  
  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text category="h1">History</Text>
          <Text category="s1">Your mood over time</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="large" />
            <Text category="s1" style={{ marginTop: 16 }}>Loading your calendar data...</Text>
          </View>
        ) : (
          <ScrollView style={styles.calendarContainer}>
            <Calendar
              style={styles.calendar}
              date={currentMonth}
              onSelect={handleDayPress}
              renderDay={(props) => <DayCell {...props} moodEntries={useMoodStore.getState().entries} />}
              onVisibleDateChange={handleMonthChange}
            />
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text>Happy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
              <Text>Neutral</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text>Sad</Text>
            </View>
          </View>
        </ScrollView>
        )}

        <Modal
          visible={moodModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMoodModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              
              {selectedDate && (
                <Text category="h5" style={styles.modalDate}>
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Text>
              )}
              
              {viewMode === 'view' ? (
                <>
                  <View style={styles.moodDetails}>
                    <Text style={styles.moodEmoji}>
                      {selectedMood === MoodType.HAPPY 
                        ? '😊' 
                        : selectedMood === MoodType.NEUTRAL
                        ? '😐'
                        : '😢'}
                    </Text>
                    <Text category="h6" style={styles.moodDetailTitle}>
                      {selectedMood?.charAt(0).toUpperCase() + selectedMood?.slice(1)}
                    </Text>
                    <Text style={styles.moodNote}>{note}</Text>
                  </View>
                  
                  <Button
                    style={styles.modalButton}
                    onPress={() => setMoodModalVisible(false)}>
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <Text category="h5" style={styles.modalTitle}>
                    How were you feeling?
                  </Text>
                  
                  <View style={styles.moodButtonRow}>
                    <TouchableOpacity
                      style={[
                        styles.moodButton,
                        selectedMood === MoodType.HAPPY && styles.selectedMoodButton,
                      ]}
                      onPress={() => handleSelectMood(MoodType.HAPPY)}>
                      <Text style={styles.moodButtonEmoji}>😊</Text>
                      <Text>Happy</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.moodButton,
                        selectedMood === MoodType.NEUTRAL && styles.selectedMoodButton,
                      ]}
                      onPress={() => handleSelectMood(MoodType.NEUTRAL)}>
                      <Text style={styles.moodButtonEmoji}>😐</Text>
                      <Text>Neutral</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.moodButton,
                        selectedMood === MoodType.SAD && styles.selectedMoodButton,
                      ]}
                      onPress={() => handleSelectMood(MoodType.SAD)}>
                      <Text style={styles.moodButtonEmoji}>😢</Text>
                      <Text>Sad</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Input
                    multiline
                    textStyle={{ minHeight: 100 }}
                    placeholder="Any notes about your day? (optional)"
                    value={note}
                    onChangeText={setNote}
                    style={styles.noteInput}
                  />
                  
                  <Button
                    onPress={handleSaveMood}
                    style={styles.saveButton}
                    disabled={!selectedMood}>
                    Save
                  </Button>
                  
                  <Button
                    appearance="ghost"
                    status="basic"
                    onPress={() => setMoodModalVisible(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    padding: 20,
    paddingTop: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
  },
  calendar: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dayCell: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: '#3366FF',
  },
  disabledDayCell: {
    opacity: 0.4,
  },
  disabledDayText: {
    color: '#ccc',
  },
  moodIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3366FF',
    position: 'absolute',
    bottom: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 15,
    alignItems: 'center',
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E1E1E1',
    borderRadius: 3,
    marginBottom: 20,
  },
  modalDate: {
    marginBottom: 20,
  },
  modalTitle: {
    marginBottom: 20,
  },
  moodButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  moodButton: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 10,
    width: '30%',
  },
  selectedMoodButton: {
    borderColor: '#3366FF',
    backgroundColor: 'rgba(51, 102, 255, 0.1)',
  },
  moodButtonEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  noteInput: {
    width: '100%',
    marginBottom: 20,
  },
  saveButton: {
    width: '100%',
    marginBottom: 10,
  },
  moodDetails: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  moodDetailTitle: {
    marginBottom: 20,
  },
  moodNote: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
  }
});