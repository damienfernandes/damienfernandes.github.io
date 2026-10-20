export const site = {
  name: 'Damien Fernandes',
  initials: 'DF',
  description:
    'Research on the multi-criteria Consequential Life Cycle Assessment (cLCA) of Artificial Intelligence in enterprise business service processes, combined with Banking Solutions Architecture.',
  role: 'Solutions Architect · PhD Researcher (cLCA of AI)',
  affiliation: 'SBS (ex-Sopra Banking Software) · LISTIC Laboratory (Université Savoie Mont Blanc)',
  location: 'Annecy / Rumilly, France',
  email: '', // Public address only, after validation.
  github: 'https://github.com/damienfernandes',
  linkedin: 'https://www.linkedin.com/in/damienfernandes/',
  ecoMode: {
    agencyName: 'SOZO Design',
    agencyUrl: 'https://sozodesign.co.uk/',
    referenceUrl: 'https://sozodesign.co.uk/learn/sustainable-web-design-our-new-eco-mode/',
    estimatedStandardCo2Grams: 1.76,
    estimatedEcoReductionPercent: 35,
  },
};
export const href = (path = '/') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
