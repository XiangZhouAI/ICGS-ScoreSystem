// ICGS Theme Configuration
export const theme = {
  colors: {
    // ICGS Blue-based palette from logo analysis
    primary: '#1e3a8a',      // Navy blue (from logo)
    primaryLight: '#3b82f6', // Light blue for buttons
    primaryDark: '#1e40af',  // Dark blue for headers
    
    // Supporting colors
    white: '#ffffff',
    lightGray: '#f8fafc',
    darkGray: '#374151',
    
    // Status colors
    success: '#059669',      // Green for good scores
    warning: '#dc2626',      // Red for poor scores
    info: '#60a5fa',         // Sky blue for accents
    
    // Stableford point colors
    points6: '#059669',      // Green for 6 points (eagle/albatross)
    points4_5: '#3b82f6',    // Blue for 4-5 points (birdie/eagle)  
    points2_3: '#6b7280',    // Gray for 2-3 points (par/birdie)
    points0_1: '#dc2626',    // Red for 0-1 points (bogey+)
  },
  
  typography: {
    // 4K TV display (legible from 4-10m)
    display4K: {
      hero: '72px',      // Main titles
      large: '48px',     // Category headers  
      medium: '36px',    // Player names
      small: '24px',     // Scores/details
    },
    
    // Organizer interface (laptop)
    organizer: {
      h1: '32px',
      h2: '24px', 
      h3: '20px',
      body: '16px',
      small: '14px',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px', 
    desktop: '1280px',
    tv4k: '3840px',
  },
  
  components: {
    card: {
      borderRadius: '8px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    button: {
      borderRadius: '6px',
      fontWeight: '600',
    },
  },
};