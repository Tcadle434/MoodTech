import { dark, light } from '@eva-design/eva';

/**
 * MoodTech custom UI Kitten theme with a calming and modern aesthetic
 * focused on wellness, mindfulness, and mood tracking.
 */

export const themes = {
  light: {
    ...light,
    // Primary color - soft teal-blue
    'color-primary-100': '#E8F1F3', // Lightest tint
    'color-primary-200': '#C7DEE3',
    'color-primary-300': '#A1D6E2', // Secondary color
    'color-primary-400': '#7EBBC9', 
    'color-primary-500': '#5B9AA9', // Primary brand color
    'color-primary-600': '#4A7F8C',
    'color-primary-700': '#3A646E',
    'color-primary-800': '#294952',
    'color-primary-900': '#1E353B',
    
    // Success color - sage green
    'color-success-100': '#EBF5F0',
    'color-success-200': '#D2E9DE',
    'color-success-300': '#B1D9C8',
    'color-success-400': '#96C7B3',
    'color-success-500': '#84B59F', // Tertiary accent
    'color-success-600': '#6B9681',
    'color-success-700': '#557966',
    'color-success-800': '#405C4C',
    'color-success-900': '#304538',
    
    // Info color - sky blue
    'color-info-100': '#E5F3F7',
    'color-info-200': '#C4E4EE',
    'color-info-300': '#A1D6E2', // Secondary accent
    'color-info-400': '#82C5D4',
    'color-info-500': '#5BACC0',
    'color-info-600': '#488B9B',
    'color-info-700': '#376A77',
    'color-info-800': '#284D57',
    'color-info-900': '#1D3840',
    
    // Warning color - warm amber
    'color-warning-100': '#FFF3E0',
    'color-warning-200': '#FFE0B2',
    'color-warning-300': '#FFCB80',
    'color-warning-400': '#FFB74D',
    'color-warning-500': '#FFA000',
    'color-warning-600': '#FF8F00',
    'color-warning-700': '#FF6F00',
    'color-warning-800': '#E65100',
    'color-warning-900': '#BF360C',
    
    // Danger color - soft coral
    'color-danger-100': '#FFEAE5',
    'color-danger-200': '#FFCBBD',
    'color-danger-300': '#FEA895',
    'color-danger-400': '#FE8E76',
    'color-danger-500': '#F9695E',
    'color-danger-600': '#DA5A4E',
    'color-danger-700': '#BC473F',
    'color-danger-800': '#9D3630',
    'color-danger-900': '#862A25',
    
    // Background colors
    'background-basic-color-1': '#F7F9F9', // Background light
    'background-basic-color-2': '#F0F4F5',
    'background-basic-color-3': '#E8EEEF',
    'background-basic-color-4': '#DFE8ED', // Subtle light
    
    // Text colors
    'text-basic-color': '#364954', // Text primary light
    'text-hint-color': '#6C8490', // Text secondary light
    
    // Border colors
    'border-basic-color-1': '#DFE8ED', // Subtle light
    'border-basic-color-2': '#CCD9DF',
    'border-basic-color-3': '#B9C9D1',
    'border-basic-color-4': '#A5BAC4',
    'border-basic-color-5': '#90A8B4',
    
    // UI elements and accents
    'color-basic-100': '#FFFFFF', // Surface light
    'color-basic-200': '#F7F9F9', // Background light
    'color-basic-300': '#F0F4F5',
    'color-basic-400': '#E8EEEF',
    'color-basic-500': '#DFE8ED', // Subtle light
    'color-basic-600': '#CCD9DF',
    'color-basic-700': '#B9C9D1',
    'color-basic-800': '#A5BAC4',
    'color-basic-900': '#90A8B4',
    'color-basic-1000': '#7B98A6',
    'color-basic-1100': '#6C8490', // Text secondary light
    'color-basic-1200': '#51646D',
    
    // Layout background colors
    'background-color-1': '#F7F9F9', // Background light
    'background-color-2': '#F0F4F5',
    'background-color-3': '#E8EEEF',
  },
  
  dark: {
    ...dark,
    // Primary color - soft teal-blue (darker mode)
    'color-primary-100': '#E2EFF2', // Lightest tint
    'color-primary-200': '#BFD9E0',
    'color-primary-300': '#9CC0C9', 
    'color-primary-400': '#81B8C5', // Secondary dark
    'color-primary-500': '#64A7B5', // Primary dark
    'color-primary-600': '#508A96',
    'color-primary-700': '#3F6D76',
    'color-primary-800': '#2E5058',
    'color-primary-900': '#1F373C',
    
    // Success color - sage green (darker mode)
    'color-success-100': '#E6F2EC',
    'color-success-200': '#CCE3D8',
    'color-success-300': '#B2D2C4',
    'color-success-400': '#8FC0A9', // Tertiary dark
    'color-success-500': '#7AAD93',
    'color-success-600': '#618C75',
    'color-success-700': '#4B6C5B',
    'color-success-800': '#364F42',
    'color-success-900': '#253A31',
    
    // Info color - sky blue (darker mode)
    'color-info-100': '#E0F0F5',
    'color-info-200': '#BFE0EA',
    'color-info-300': '#9CCEDB',
    'color-info-400': '#81B8C5', // Secondary dark
    'color-info-500': '#64A7B5', // Primary dark
    'color-info-600': '#508794',
    'color-info-700': '#3D6673',
    'color-info-800': '#2B4B54',
    'color-info-900': '#1E363D',
    
    // Warning color - warm amber (darker mode)
    'color-warning-100': '#FFF3E0',
    'color-warning-200': '#FFE0B2',
    'color-warning-300': '#FFCC80',
    'color-warning-400': '#FFB74D',
    'color-warning-500': '#FFA726',
    'color-warning-600': '#FF8F00',
    'color-warning-700': '#FF6F00',
    'color-warning-800': '#E65100',
    'color-warning-900': '#BF360C',
    
    // Danger color - soft coral (darker mode)
    'color-danger-100': '#FFEAE5',
    'color-danger-200': '#FFCBBD',
    'color-danger-300': '#FEA895',
    'color-danger-400': '#FE8E76',
    'color-danger-500': '#F9695E',
    'color-danger-600': '#DA5A4E',
    'color-danger-700': '#BC473F',
    'color-danger-800': '#9D3630',
    'color-danger-900': '#862A25',
    
    // Background colors
    'background-basic-color-1': '#1A2327', // Background dark
    'background-basic-color-2': '#243036', // Surface dark
    'background-basic-color-3': '#2B3941',
    'background-basic-color-4': '#304550', // Subtle dark
    
    // Text colors
    'text-basic-color': '#E8EFF2', // Text primary dark
    'text-hint-color': '#A8BDC5', // Text secondary dark
    
    // Border colors
    'border-basic-color-1': '#304550', // Subtle dark
    'border-basic-color-2': '#3D5361',
    'border-basic-color-3': '#4A6273',
    'border-basic-color-4': '#5C778B',
    'border-basic-color-5': '#6E8C9E',
    
    // UI elements and accents
    'color-basic-100': '#243036', // Surface dark
    'color-basic-200': '#1A2327', // Background dark
    'color-basic-300': '#243036', // Surface dark 
    'color-basic-400': '#2B3941',
    'color-basic-500': '#304550', // Subtle dark
    'color-basic-600': '#3D5361',
    'color-basic-700': '#4A6273',
    'color-basic-800': '#5C778B',
    'color-basic-900': '#6E8C9E',
    'color-basic-1000': '#86A5B8',
    'color-basic-1100': '#A8BDC5', // Text secondary dark
    'color-basic-1200': '#CCDBE2',
    
    // Layout background colors
    'background-color-1': '#1A2327', // Background dark
    'background-color-2': '#243036', // Surface dark
    'background-color-3': '#2B3941',
  },
};