export const MINIFINDER = {
  name: 'Minifinder',
  url: 'https://minifinder.com',
  discountCode: 'eksportfiske2026',
  discountPercent: 10,
  boatProducts: ['Xtreme', 'Xero'],
  getUrlWithUtm: (medium: string) =>
    `https://minifinder.com?utm_source=eksportfiske.no&utm_medium=${medium}&utm_campaign=minifinder`,
};
