export interface AuraLevel {
  min: number;
  max: number;
  label: string;
}

export const AURA_LEVELS: AuraLevel[] = [
  { min: 0, max: 9, label: 'Newborn Pup' },
  { min: 10, max: 100, label: 'Backyard Wanderer' },
  { min: 101, max: 500, label: 'Fence Jumper' },
  { min: 501, max: 1000, label: 'Scrappy Stray' },
  { min: 1001, max: 2000, label: 'Territory Scout' },
  { min: 2001, max: 3000, label: 'Alley Guardian' },
  { min: 3001, max: 3500, label: 'Pack Leader' },
  { min: 3501, max: 4000, label: 'Neighborhood Legend' },
  { min: 4001, max: 5000, label: 'Battle-Tested Street Dog' },
  { min: 5001, max: Infinity, label: 'Wise Shelter Dog' },
];

export const getAuraLevel = (aura: number): string => {
  const level = AURA_LEVELS.find((l) => aura >= l.min && aura <= l.max);
  return level?.label || 'Newborn Pup';
};
