import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { healthService } from '../api';

export interface HealthData {
  steps: number;
  distance: number;
  calories: number;
  date: string;
}

interface HealthState {
  isHealthKitInitialized: boolean;
  healthData: Record<string, HealthData>;
  isLoading: boolean;
  error: string | null;
  hasHealthPermissions: boolean;
  
  // Actions
  initializeHealthKit: () => Promise<void>;
  fetchHealthData: (date: Date) => Promise<HealthData | null>;
  clearHealthData: () => void;
  checkHealthPermissions: () => Promise<boolean>;
  resetPermissionState: () => void;
}

const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      isHealthKitInitialized: false,
      healthData: {},
      isLoading: false,
      error: null,
      hasHealthPermissions: false,
      
      initializeHealthKit: async () => {
        try {
          set({ isLoading: true, error: null });
          await healthService.initHealthKit();
          
          // Verify permissions were actually granted by checking
          const hasPermissions = await healthService.checkPermissions();
          
          set({ 
            isHealthKitInitialized: true, 
            hasHealthPermissions: hasPermissions,
            isLoading: false 
          });
          
          return hasPermissions;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : String(error),
            hasHealthPermissions: false
          });
          return false;
        }
      },
      
      // Check current permission status with HealthKit
      checkHealthPermissions: async () => {
        try {
          set({ isLoading: true });
          const hasPermissions = await healthService.checkPermissions();
          
          set({ 
            hasHealthPermissions: hasPermissions,
            isLoading: false
          });
          
          return hasPermissions;
        } catch (error) {
          set({ 
            isLoading: false,
            hasHealthPermissions: false,
            error: error instanceof Error ? error.message : String(error)
          });
          return false;
        }
      },
      
      // Reset permission state (used when permissions might have changed)
      resetPermissionState: () => {
        set({ 
          hasHealthPermissions: false,
          isHealthKitInitialized: false 
        });
      },
      
      fetchHealthData: async (date: Date) => {
        try {
          // First check if we still have permissions
          const hasPermissions = await get().checkHealthPermissions();
          if (!hasPermissions) {
            throw new Error("Health permissions denied. Please enable in Settings.");
          }
          
          const dateKey = date.toISOString().split('T')[0];
          const existingData = get().healthData[dateKey];
          
          // If we already have this date's data and it's not stale, return it
          if (existingData) {
            return existingData;
          }
          
          set({ isLoading: true, error: null });
          
          // Initialize HealthKit if needed
          if (!get().isHealthKitInitialized) {
            await get().initializeHealthKit();
          }
          
          // Fetch health data for the date
          const healthData = await healthService.getDailyHealthData(date);
          
          // Store it with date as key
          const newHealthData = {
            ...healthData,
            date: dateKey,
          };
          
          set((state) => ({
            healthData: {
              ...state.healthData,
              [dateKey]: newHealthData
            },
            isLoading: false
          }));
          
          return newHealthData;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : String(error)
          });
          return null;
        }
      },
      
      clearHealthData: () => {
        set({ healthData: {} });
      }
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHealthStore;