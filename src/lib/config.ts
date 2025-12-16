/**
 * Application configuration
 */

/**
 * Test organization numbers that should route to test.export.fish
 * All other organization numbers route to export.fish (production)
 */
export const TEST_ORG_NUMBERS = ['910337727', '315149762', '910337729'];

/**
 * API endpoints for registration
 */
export const API_ENDPOINTS = {
  production: 'https://export.fish/v1/business-owners/register',
  test: 'https://test.export.fish/v1/business-owners/register',
} as const;

/**
 * Determine which API endpoint to use based on organization number
 * @param orgNumber - Organization number to check
 * @returns API endpoint URL
 */
export function getRegistrationEndpoint(orgNumber: string): string {
  return TEST_ORG_NUMBERS.includes(orgNumber)
    ? API_ENDPOINTS.test
    : API_ENDPOINTS.production;
}
