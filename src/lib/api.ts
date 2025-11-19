/**
 * API utilities for Brønnøysundregistrene and export.fish backend
 */

/**
 * Response from Brønnøysundregistrene enhetsregisteret API
 */
export interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: {
    kode: string;
    beskrivelse: string;
  };
  hjemmeside?: string;
  postadresse?: {
    adresse: string[];
    postnummer: string;
    poststed: string;
    land: string;
  };
  forretningsadresse?: {
    adresse: string[];
    postnummer: string;
    poststed: string;
    land: string;
  };
}

/**
 * Lookup company information from Brønnøysundregistrene
 * @param orgNumber - 9-digit Norwegian organization number
 * @returns Company information or null if not found
 */
export async function lookupCompany(
  orgNumber: string
): Promise<BrregEnhet | null> {
  try {
    const response = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Company not found
      }
      throw new Error(`Brreg API error: ${response.status}`);
    }

    const data: BrregEnhet = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to lookup company:', error);
    throw error;
  }
}

/**
 * Registration payload for export.fish backend
 */
export interface RegistrationPayload {
  organizationNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
  turnstileToken?: string;
}

/**
 * Response from export.fish registration endpoint
 */
export interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: {
    businessOwnerId: string;
    subdomain: string;
  };
  error?: string;
}

/**
 * Submit registration to export.fish backend
 * @param payload - Registration data
 * @returns Registration result
 */
export async function submitRegistration(
  payload: RegistrationPayload
): Promise<RegistrationResponse> {
  try {
    const response = await fetch(
      'https://api.export.fish/v1/business-owners/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data: RegistrationResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Registration failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to submit registration:', error);
    throw error;
  }
}
