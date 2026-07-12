/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CountryOption {
  code: string;
  name: string;
}

export interface StateOption {
  code: string;
  name: string;
  fee: number;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom (UK)' },
  { code: 'US', name: 'United States (US)' },
  { code: 'CA', name: 'Canada' },
  { code: 'GH', name: 'Ghana' },
  { code: 'INT', name: 'International (Other Countries)' }
];

export const NIGERIAN_STATES: StateOption[] = [
  { code: 'lagos', name: 'Lagos State', fee: 2500 },
  { code: 'abuja', name: 'Abuja (FCT)', fee: 5000 },
  { code: 'ogun', name: 'Ogun State', fee: 3500 },
  { code: 'oyo', name: 'Oyo State (Ibadan)', fee: 4000 },
  { code: 'rivers', name: 'Rivers State (Port Harcourt)', fee: 5500 },
  { code: 'osun', name: 'Osun State', fee: 4500 },
  { code: 'ondo', name: 'Ondo State', fee: 4500 },
  { code: 'ekiti', name: 'Ekiti State', fee: 4500 },
  { code: 'kwara', name: 'Kwara State', fee: 4500 },
  { code: 'kano', name: 'Kano State', fee: 6000 },
  { code: 'kaduna', name: 'Kaduna State', fee: 6000 },
  { code: 'anambra', name: 'Anambra State', fee: 5500 },
  { code: 'enugu', name: 'Enugu State', fee: 5500 },
  { code: 'abia', name: 'Abia State', fee: 5500 },
  { code: 'imo', name: 'Imo State', fee: 5500 },
  { code: 'delta', name: 'Delta State', fee: 5500 },
  { code: 'others', name: 'Other Nigerian States', fee: 6500 }
];

export function getShippingFee(country: string, state: string, subtotal: number): number {
  if (!country) return 0;
  
  // Free shipping on Nigeria orders above ₦50,000
  if (country === 'Nigeria' && subtotal >= 50000) {
    return 0;
  }

  if (country === 'Nigeria') {
    if (!state) return 3500; // default state fallback
    const matchedState = NIGERIAN_STATES.find(
      s => s.name.toLowerCase() === state.toLowerCase() || s.code === state.toLowerCase()
    );
    return matchedState ? matchedState.fee : 6500;
  }

  // International flat rates
  const c = country.toLowerCase();
  if (c.includes('united kingdom') || c.includes('uk')) return 35000;
  if (c.includes('united states') || c.includes('us')) return 42000;
  if (c.includes('canada')) return 45000;
  if (c.includes('ghana')) return 25000;
  return 40000; // default general international shipping
}
