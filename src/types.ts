/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookingInquiry {
  id: string;
  organizerName: string;
  email: string;
  phone: string;
  company?: string;
  eventDate: string;
  duration: string; // e.g., "2 Hours", "4 Hours", "Full Night"
  venueLocation: string;
  crowdSize: 'Under 50' | '50-200' | '200-500' | '500+';
  eventType: 'Golden Hour / Sundowner' | 'Exclusive Private Party' | 'Club / Nightlife Event' | 'Festival / Outdoor Stage' | 'Corporate / Brand Activation';
  sonicDirections: string[]; // Options: "Afro House", "Latin House", "Open-Format", "Techno / Tech House"
  djEquipment: 'Yes, fully equipped' | 'No, we need setup' | 'I\'m not sure';
  peakVision: string;
  submittedAt: string;
  status: 'Pending' | 'Aligned' | 'Declined';
  managementNotes?: string;
}

export interface MixConfig {
  name: string;
  genre: string;
  tempo: number;
  description: string;
  synthsActive: boolean;
}
