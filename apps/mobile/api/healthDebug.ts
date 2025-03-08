import { NativeModules } from 'react-native';

// Direct access to native modules
export const debugHealth = () => {
  console.log("[DEBUG] NativeModules available:", Object.keys(NativeModules));
  console.log("[DEBUG] RNAppleHealthKit available:", !!NativeModules.RNAppleHealthKit);
  
  if (NativeModules.RNAppleHealthKit) {
    console.log("[DEBUG] RNAppleHealthKit methods:", Object.keys(NativeModules.RNAppleHealthKit));
  }
  
  // Try to directly import from the module
  try {
    const HealthKit = require('react-native-health');
    console.log("[DEBUG] Module type:", typeof HealthKit);
    console.log("[DEBUG] Module keys:", Object.keys(HealthKit));
    
    if (typeof HealthKit === 'object') {
      console.log("[DEBUG] Constants available:", !!HealthKit.Constants);
      console.log("[DEBUG] initHealthKit available:", !!HealthKit.initHealthKit);
    }
    
    return HealthKit;
  } catch (error) {
    console.error("[DEBUG] Error importing module:", error);
    return null;
  }
};