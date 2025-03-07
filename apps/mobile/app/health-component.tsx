// Health Data Display Component
// This component can be imported and used inside the mood card

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';

interface HealthDataDisplayProps {
  healthData: {
    steps?: number;
    distance?: number;
    calories?: number;
  };
}

export const HealthDataDisplay: React.FC<HealthDataDisplayProps> = ({ healthData }) => {
  if (!healthData || (!healthData.steps && !healthData.distance && !healthData.calories)) {
    return null;
  }
  
  return (
    <View style={styles.healthDataContainer}>
      <View style={styles.healthDataDivider} />
      <Text style={styles.healthDataTitle}>Health Data</Text>
      
      {healthData.steps && (
        <View style={styles.healthDataRow}>
          <Icon name="activity-outline" style={styles.healthIcon} />
          <Text style={styles.healthDataText}>
            Steps: {healthData.steps.toLocaleString()}
          </Text>
        </View>
      )}
      
      {healthData.distance && (
        <View style={styles.healthDataRow}>
          <Icon name="map-outline" style={styles.healthIcon} />
          <Text style={styles.healthDataText}>
            Distance: {healthData.distance.toFixed(2)} km
          </Text>
        </View>
      )}
      
      {healthData.calories && (
        <View style={styles.healthDataRow}>
          <Icon name="flash-outline" style={styles.healthIcon} />
          <Text style={styles.healthDataText}>
            Calories: {healthData.calories.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  healthDataContainer: {
    marginTop: 16,
  },
  healthDataDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  healthDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  healthDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: 'rgba(255, 255, 255, 0.9)',
  },
  healthDataText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});