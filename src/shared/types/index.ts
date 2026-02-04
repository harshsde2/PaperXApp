// Common types used across the application

export type UserRole = 'dealer' | 'converter' | 'brand' | 'machineDealer' | 'mill' | 'scrapDealer';

export interface User {
  id: string;
  mobile: string;
  primaryRole: UserRole;
  primary_role: UserRole;
  secondaryRole?: UserRole;
  isVerified: boolean;
  companyName?: string | null;
  udyamVerifiedAt?: string | null;
  operation_area: "local" | "state" | "panIndia";
  company_name: string;
  gst_in: string;
  state: string;
  city: string;
  udyam_certificate: string | null;
  udyam_verified_at: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  materials: any[];
  machines: any[];
  locations: any[];
  profile_complete: boolean;
  grades: string | null;
  capacity_daily: string;
  capacity_monthly: string;
  capacity_unit: string;
  user_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface dummyUser {
  id: number;
  name: string | null;
  mobile: string;
  email: string | null;
  email_verified_at: string | null;
  primary_role: UserRole;
  has_secondary_role: number;
  secondary_role: UserRole | null;
  operation_area: "local" | "state" | "panIndia";
  company_name: string;
  gst_in: string;
  state: string;
  city: string;
  udyam_certificate: string | null;
  udyam_verified_at: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  materials: any[];
  machines: any[];
  locations: any[];
  profile_complete: boolean;
  grades: string | null;
  capacity_daily: string;
  capacity_monthly: string;
  capacity_unit: string;
  user_id: number;
  status: "ACTIVE" | "INACTIVE";
}



const user: dummyUser = {
  id: 20,
  name: null,
  mobile: "3949646491",
  email: null,
  email_verified_at: null,
  primary_role: "dealer",
  has_secondary_role: 0,
  secondary_role: null,
  operation_area: "local",
  company_name: "sneha enterprises",
  gst_in: "123456789012345",
  state: "Maharashtra",
  city: "Mumbai",
  udyam_certificate: null,
  udyam_verified_at: null,
  avatar: null,
  created_at: "2026-01-20T07:56:06.000000Z",
  updated_at: "2026-01-20T07:56:06.000000Z",
  user_id: 151,
  status: "ACTIVE",
  profile_complete: true,
  grades: null,
  capacity_daily: "1000.50",
  capacity_monthly: "30000.00",
  capacity_unit: "kg",
  materials: [
    {
      "id": 75,
      "name": "Adhesives (PVA)",
      "category": "ANCILLARY MATERIALS",
      "created_at": null,
      "updated_at": null,
      "pivot": {
        "dealer_id": 20,
        "material_id": 75
      }
    }
  ],
  machines: [],
  locations: [
    {
      "id": 31,
      "dealer_id": 20,
      "type": "warehouse",
      "address": "Muzaffarnagar",
      "latitude": "29.49149580",
      "longitude": "77.69830820",
      "city": "Muzaffarnagar",
      "state": "Uttar Pradesh",
      "created_at": "2026-01-20T07:56:06.000000Z",
      "updated_at": "2026-01-20T07:56:06.000000Z"
    },
    {
      "id": 32,
      "dealer_id": 20,
      "type": "warehouse",
      "address": "New Delhi",
      "latitude": "28.61389540",
      "longitude": "77.20900570",
      "city": "New Delhi",
      "state": null,
      "created_at": "2026-01-20T07:56:06.000000Z",
      "updated_at": "2026-01-20T07:56:06.000000Z"
    },
    {
      "id": 33,
      "dealer_id": 20,
      "type": "warehouse",
      "address": "Muzaffarnagar",
      "latitude": "29.49136440",
      "longitude": "77.69839810",
      "city": "Muzaffarnagar",
      "state": "Uttar Pradesh",
      "created_at": "2026-01-20T07:56:06.000000Z",
      "updated_at": "2026-01-20T07:56:06.000000Z"
    }
  ]
}
// Add more common types as needed

