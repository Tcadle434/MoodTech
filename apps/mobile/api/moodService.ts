import { format } from 'date-fns';
import { MoodType } from 'shared';
import apiClient from './client';
import apiConfig from './config';

// Services for mood-related API calls
export const moodService = {
  // Get all moods for the current user
  getAllMoods: async () => {
    return apiClient.get(apiConfig.MOODS.BASE);
  },

  // Get mood for a specific date
  getMoodByDate: async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return apiClient.get(apiConfig.MOODS.BY_DATE(formattedDate));
  },

  // Get moods for a date range
  getMoodsByDateRange: async (startDate: Date, endDate: Date) => {
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    return apiClient.get(apiConfig.MOODS.BY_RANGE(formattedStartDate, formattedEndDate));
  },

  // Create or update a mood entry
  saveMood: async (date: Date, mood: MoodType, note?: string) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log('Making saveMood API call:', {
      endpoint: apiConfig.MOODS.BASE,
      payload: { date: formattedDate, mood, note }
    });
    
    return apiClient.post(apiConfig.MOODS.BASE, {
      date: formattedDate,
      mood,
      note,
    });
  },

  // Update an existing mood entry
  updateMood: async (id: string, mood: MoodType, note?: string) => {
    return apiClient.put(apiConfig.MOODS.BY_ID(id), {
      mood,
      note,
    });
  },

  // Delete a mood entry
  deleteMood: async (id: string) => {
    return apiClient.delete(apiConfig.MOODS.BY_ID(id));
  },
};