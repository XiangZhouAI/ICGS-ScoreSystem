// Category configuration utilities

export interface CategoryRanges {
  A: { min: number; max: number };
  B: { min: number; max: number };
  C: { min: number; max: number };
}

// Default category ranges - can be configured by user
export const DEFAULT_CATEGORY_RANGES: CategoryRanges = {
  A: { min: 0, max: 9 },
  B: { min: 10, max: 15 },
  C: { min: 16, max: 54 },
};

// Get category ranges from localStorage or use defaults
export const getCategoryRanges = (): CategoryRanges => {
  const saved = localStorage.getItem('icgs-category-ranges');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CATEGORY_RANGES;
    }
  }
  return DEFAULT_CATEGORY_RANGES;
};

// Save category ranges to localStorage
export const saveCategoryRanges = (ranges: CategoryRanges): void => {
  localStorage.setItem('icgs-category-ranges', JSON.stringify(ranges));
};

// Calculate category based on handicap and current ranges
export const calculateCategory = (handicap: number): 'A' | 'B' | 'C' => {
  const ranges = getCategoryRanges();
  
  if (handicap >= ranges.A.min && handicap <= ranges.A.max) return 'A';
  if (handicap >= ranges.B.min && handicap <= ranges.B.max) return 'B';
  return 'C';
};

// Get category distribution for current players based on current ranges
export const getCategoryDistribution = (players: Array<{ handicap: number; category?: 'A' | 'B' | 'C' }>): {
  A: number;
  B: number;
  C: number;
  total: number;
} => {
  const distribution = { A: 0, B: 0, C: 0, total: players.length };
  
  players.forEach(player => {
    // Recalculate category based on current handicap and ranges
    const currentCategory = calculateCategory(player.handicap);
    distribution[currentCategory]++;
  });
  
  return distribution;
};

// Validate category ranges (no gaps, no overlaps)
export const validateCategoryRanges = (ranges: CategoryRanges): string[] => {
  const errors: string[] = [];
  
  // Check for valid ranges
  if (ranges.A.min > ranges.A.max) errors.push('Category A: Min cannot be greater than Max');
  if (ranges.B.min > ranges.B.max) errors.push('Category B: Min cannot be greater than Max');
  if (ranges.C.min > ranges.C.max) errors.push('Category C: Min cannot be greater than Max');
  
  // Check for gaps or overlaps
  if (ranges.B.min !== ranges.A.max + 1) {
    errors.push(`Gap/Overlap between A and B: A ends at ${ranges.A.max}, B starts at ${ranges.B.min}`);
  }
  
  if (ranges.C.min !== ranges.B.max + 1) {
    errors.push(`Gap/Overlap between B and C: B ends at ${ranges.B.max}, C starts at ${ranges.C.min}`);
  }
  
  return errors;
};