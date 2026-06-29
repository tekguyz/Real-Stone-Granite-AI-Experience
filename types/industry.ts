export interface IndustryConfig {
  id: string;
  name: string;
  operationalHours: string;
  specializedKeywords: string[];
  mockCrmName: string;
}

export const INDUSTRIES: Record<string, IndustryConfig> = {
  'stone-granite': {
    id: 'stone-granite',
    name: 'Real Stone & Granite',
    operationalHours: 'Mon-Fri 8:00 AM - 5:00 PM, Sat 9:00 AM - 1:00 PM',
    specializedKeywords: [
      'custom edge treatments',
      'quartzite',
      'marble countertop fabrication',
      'memorial monuments',
      'templating',
      'installation'
    ],
    mockCrmName: 'StoneWorks CRM'
  }
};
