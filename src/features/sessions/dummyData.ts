/**
 * Session Feature - Dummy Data for Client Demo
 * Toggle USE_DUMMY_DATA in config to enable/disable
 */

import { Session, MatchResponse, ShortlistedPartner, ChatMessage } from './@types';

// ============================================
// MOCK SESSIONS - Matching the design screens
// ============================================

export const DUMMY_SESSIONS: Session[] = [
  // URGENT - Active Session
  {
    id: '1',
    inquiryId: 'PRJ-2024-08',
    title: '50k Units Sustainable Cardboard',
    category: 'Packaging',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'active',
    isUrgent: true,
    biddingEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 15 * 60 * 1000 + 30 * 1000).toISOString(),
    responsesReceived: 8,
    totalExpectedResponses: 10,
    materialName: 'Sustainable Cardboard',
    quantity: '50000',
    quantityUnit: 'units',
    specifications: 'Industrial Grade, Eco-friendly, Recyclable',
  },
  // Finding Matches Session
  {
    id: '2',
    inquiryId: 'PRJ-2024-09',
    title: 'Aluminum Foil Roll - 200m',
    category: 'Raw Materials',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'finding_matches',
    isUrgent: false,
    responsesReceived: 0,
    totalExpectedResponses: 15,
    materialName: 'Aluminum Foil',
    quantity: '200',
    quantityUnit: 'meters',
    specifications: 'Food Grade, 200m roll',
  },
  // Locked Session
  {
    id: '3',
    inquiryId: 'PRJ-2024-07',
    title: 'Eco-friendly Adhesive Tape',
    category: 'Office Supplies',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'locked',
    isUrgent: false,
    responsesReceived: 12,
    totalExpectedResponses: 12,
    materialName: 'Adhesive Tape',
    quantity: '5000',
    quantityUnit: 'rolls',
    specifications: 'Biodegradable, Strong Adhesion',
  },
  // Another Active Session
  {
    id: '4',
    inquiryId: 'PRJ-2024-10',
    title: 'Recycled PET Pellets - 50 Tons',
    category: 'Industrial',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    isUrgent: false,
    biddingEndsAt: new Date(Date.now() + 4 * 60 * 60 * 1000 + 12 * 60 * 1000 + 30 * 1000).toISOString(),
    responsesReceived: 6,
    totalExpectedResponses: 10,
    materialName: 'PET Pellets',
    quantity: '50',
    quantityUnit: 'Tons',
    specifications: 'Industrial Grade, Clear Color',
  },
  // Another Finding Matches
  {
    id: '5',
    inquiryId: 'PRJ-2024-11',
    title: 'Kraft Paper Sheets - 10000',
    category: 'Paper Products',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'finding_matches',
    isUrgent: true,
    responsesReceived: 2,
    totalExpectedResponses: 15,
    materialName: 'Kraft Paper',
    quantity: '10000',
    quantityUnit: 'sheets',
    specifications: 'A4 Size, 120gsm, Brown',
  },
  // Another Locked Session
  {
    id: '6',
    inquiryId: 'PRJ-2024-06',
    title: 'HDPE Containers - 2000 pcs',
    category: 'Containers',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'locked',
    isUrgent: false,
    responsesReceived: 8,
    totalExpectedResponses: 8,
    materialName: 'HDPE Containers',
    quantity: '2000',
    quantityUnit: 'pieces',
    specifications: '500ml capacity, Food Grade',
  },
];

// ============================================
// MOCK MATCH RESPONSES - For Details Screen
// ============================================

export const DUMMY_MATCH_RESPONSES: MatchResponse[] = [
  // Exact Match Responses
  {
    id: 'resp-1',
    sessionId: '1',
    supplierId: 'sup-001',
    supplierName: 'Global Packaging Solutions',
    isVerified: true,
    location: {
      city: 'Warsaw',
      country: 'Poland',
      distance: '45 km away',
    },
    matchType: 'exact_match',
    message: '"We have 50 tons of Grade A recycled PET ready for immediate shipment. All certificates included."',
    availableQuantity: '50000',
    pricePerUnit: 45,
    deliveryTime: '5-7 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 95,
  },
  {
    id: 'resp-2',
    sessionId: '1',
    supplierId: 'sup-002',
    supplierName: 'Nordic Recyclers',
    isVerified: true,
    location: {
      city: 'Oslo',
      country: 'Norway',
      distance: '310 km away',
    },
    matchType: 'exact_match',
    message: '"Full fulfillment available. Logistics partner can deliver to your doorstep by Friday."',
    availableQuantity: '50000',
    pricePerUnit: 48,
    deliveryTime: '3-5 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 92,
  },
  // Slight Variation
  {
    id: 'resp-3',
    sessionId: '1',
    supplierId: 'sup-003',
    supplierName: 'EcoMaterials Ltd.',
    isVerified: true,
    location: {
      city: 'Berlin',
      country: 'Germany',
      distance: '112 km away',
    },
    matchType: 'slight_variation',
    message: '"Available stock: 42 tons. Can provide remaining 8 tons within 10 days from secondary facility."',
    availableQuantity: '42000',
    pricePerUnit: 42,
    deliveryTime: '7-10 days',
    isShortlisted: true,
    isRejected: false,
    respondedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 85,
  },
  {
    id: 'resp-4',
    sessionId: '1',
    supplierId: 'sup-004',
    supplierName: 'GreenPack Industries',
    isVerified: false,
    location: {
      city: 'Prague',
      country: 'Czech Republic',
      distance: '180 km away',
    },
    matchType: 'slight_variation',
    message: '"35,000 units available immediately. Rest can be manufactured in 2 weeks. Competitive pricing."',
    availableQuantity: '35000',
    pricePerUnit: 40,
    deliveryTime: '14 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 78,
  },
  // Nearest
  {
    id: 'resp-5',
    sessionId: '1',
    supplierId: 'sup-005',
    supplierName: 'LocalPack Co.',
    isVerified: true,
    location: {
      city: 'Mumbai',
      country: 'India',
      distance: '25 km away',
    },
    matchType: 'nearest',
    message: '"Closest supplier to your location. Can deliver same day. 30,000 units in stock."',
    availableQuantity: '30000',
    pricePerUnit: 38,
    deliveryTime: 'Same day',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 72,
  },
  {
    id: 'resp-6',
    sessionId: '1',
    supplierId: 'sup-006',
    supplierName: 'Metro Supplies',
    isVerified: true,
    location: {
      city: 'Delhi',
      country: 'India',
      distance: '35 km away',
    },
    matchType: 'nearest',
    message: '"Regional warehouse has 25,000 units. Fast turnaround guaranteed."',
    availableQuantity: '25000',
    pricePerUnit: 39,
    deliveryTime: '1-2 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 70,
  },
  // Awaiting Response (potential matches)
  {
    id: 'resp-7',
    sessionId: '1',
    supplierId: 'sup-007',
    supplierName: 'PrimePack Solutions',
    isVerified: true,
    location: {
      city: 'Chennai',
      country: 'India',
      distance: '150 km away',
    },
    matchType: 'exact_match',
    message: 'Match score: 88% • Awaiting response',
    isShortlisted: false,
    isRejected: false,
    respondedAt: '',
    hasResponded: false,
    matchScore: 88,
  },
  {
    id: 'resp-8',
    sessionId: '1',
    supplierId: 'sup-008',
    supplierName: 'EcoBulk Traders',
    isVerified: false,
    location: {
      city: 'Bangalore',
      country: 'India',
      distance: '200 km away',
    },
    matchType: 'slight_variation',
    message: 'Match score: 75% • Awaiting response',
    isShortlisted: false,
    isRejected: false,
    respondedAt: '',
    hasResponded: false,
    matchScore: 75,
  },
];

// Responses for Session 4 (PET Pellets)
export const DUMMY_MATCH_RESPONSES_SESSION_4: MatchResponse[] = [
  {
    id: 'resp-4-1',
    sessionId: '4',
    supplierId: 'sup-101',
    supplierName: 'PolyRecycle Corp',
    isVerified: true,
    location: {
      city: 'Shanghai',
      country: 'China',
      distance: '450 km away',
    },
    matchType: 'exact_match',
    message: '"50 tons of industrial grade PET pellets available. Clear color as specified. Ready for export."',
    availableQuantity: '50',
    pricePerUnit: 850,
    deliveryTime: '10-14 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 94,
  },
  {
    id: 'resp-4-2',
    sessionId: '4',
    supplierId: 'sup-102',
    supplierName: 'GreenPoly Materials',
    isVerified: true,
    location: {
      city: 'Tokyo',
      country: 'Japan',
      distance: '520 km away',
    },
    matchType: 'exact_match',
    message: '"Premium quality recycled PET. ISO certified. Full quantity available."',
    availableQuantity: '50',
    pricePerUnit: 920,
    deliveryTime: '7-10 days',
    isShortlisted: true,
    isRejected: false,
    respondedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 96,
  },
  {
    id: 'resp-4-3',
    sessionId: '4',
    supplierId: 'sup-103',
    supplierName: 'EcoPlast Industries',
    isVerified: false,
    location: {
      city: 'Singapore',
      country: 'Singapore',
      distance: '380 km away',
    },
    matchType: 'slight_variation',
    message: '"45 tons available immediately. Can source additional 5 tons within a week."',
    availableQuantity: '45',
    pricePerUnit: 800,
    deliveryTime: '5-7 days',
    isShortlisted: false,
    isRejected: false,
    respondedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    hasResponded: true,
    matchScore: 82,
  },
];

// ============================================
// MOCK SHORTLISTED PARTNERS - For Locked Screen
// ============================================

export const DUMMY_SHORTLISTED_PARTNERS: Record<string, ShortlistedPartner[]> = {
  '3': [
    {
      id: 'partner-1',
      sessionId: '3',
      supplierId: 'sup-201',
      supplierName: 'EcoPack Solutions',
      isVerified: true,
      specialty: 'Sustainable Plastics Specialist',
      location: {
        city: 'Berlin',
        country: 'Germany',
      },
      matchType: 'exact_match',
      hasUnreadMessages: true,
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'partner-2',
      sessionId: '3',
      supplierId: 'sup-202',
      supplierName: 'Global Fiber Co.',
      isVerified: true,
      specialty: 'Recycled Paper & Cardboard',
      location: {
        city: 'Toronto',
        country: 'Canada',
      },
      matchType: 'exact_match',
      hasUnreadMessages: false,
      lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '6': [
    {
      id: 'partner-3',
      sessionId: '6',
      supplierId: 'sup-301',
      supplierName: 'PlastPro Manufacturing',
      isVerified: true,
      specialty: 'HDPE & Industrial Containers',
      location: {
        city: 'Mumbai',
        country: 'India',
      },
      matchType: 'exact_match',
      hasUnreadMessages: true,
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'partner-4',
      sessionId: '6',
      supplierId: 'sup-302',
      supplierName: 'SafePack Industries',
      isVerified: true,
      specialty: 'Food Grade Packaging',
      location: {
        city: 'Delhi',
        country: 'India',
      },
      matchType: 'slight_variation',
      hasUnreadMessages: false,
      lastMessageAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'partner-5',
      sessionId: '6',
      supplierId: 'sup-303',
      supplierName: 'ContainerWorld',
      isVerified: false,
      specialty: 'Bulk Container Solutions',
      location: {
        city: 'Chennai',
        country: 'India',
      },
      matchType: 'nearest',
      hasUnreadMessages: false,
      lastMessageAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// ============================================
// MOCK CHAT MESSAGES
// ============================================

export const DUMMY_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sessionId: '3',
    partnerId: 'sup-201',
    senderId: 'sup-201',
    senderType: 'partner',
    senderName: 'EcoPack Solutions',
    messageType: 'text',
    content: 'Hello, I have attached the material specifications for the polymer request. Let me know if you need any adjustments.',
    isRead: true,
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    sessionId: '3',
    partnerId: 'sup-201',
    senderId: 'sup-201',
    senderType: 'partner',
    senderName: 'EcoPack Solutions',
    messageType: 'file',
    content: 'Material_Specs.pdf',
    fileName: 'Material_Specs.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    isRead: true,
    sentAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    sessionId: '3',
    partnerId: 'sup-201',
    senderId: 'user-1',
    senderType: 'user',
    senderName: 'You',
    messageType: 'text',
    content: 'Received, thank you. Checking the tensile strength requirements now. Could you also share the bulk pricing for Q3?',
    isRead: true,
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-4',
    sessionId: '3',
    partnerId: 'sup-201',
    senderId: 'sup-201',
    senderType: 'partner',
    senderName: 'EcoPack Solutions',
    messageType: 'image',
    content: 'Bulk_Pricing_Q3.jpg',
    fileName: 'Bulk_Pricing_Q3.jpg',
    fileUrl: 'https://example.com/pricing.jpg',
    isRead: false,
    sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get dummy sessions filtered by tab
 */
export const getDummySessionsByTab = (tab: string): Session[] => {
  if (tab === 'all') return DUMMY_SESSIONS;
  return DUMMY_SESSIONS.filter(session => session.status === tab);
};

/**
 * Get dummy session by ID
 */
export const getDummySessionById = (id: string): Session | undefined => {
  return DUMMY_SESSIONS.find(session => session.id === id);
};

/**
 * Get dummy match responses for a session
 */
export const getDummyMatchResponses = (sessionId: string, filter?: string): MatchResponse[] => {
  let responses: MatchResponse[] = [];
  
  if (sessionId === '1') {
    responses = DUMMY_MATCH_RESPONSES;
  } else if (sessionId === '4') {
    responses = DUMMY_MATCH_RESPONSES_SESSION_4;
  } else {
    // Generate some default responses for other sessions
    responses = DUMMY_MATCH_RESPONSES.slice(0, 4).map(r => ({
      ...r,
      sessionId,
      id: `${sessionId}-${r.id}`,
    }));
  }
  
  if (filter && filter !== 'all') {
    responses = responses.filter(r => r.matchType === filter);
  }
  
  return responses;
};

/**
 * Get shortlisted partners for a locked session
 */
export const getDummyShortlistedPartners = (sessionId: string): ShortlistedPartner[] => {
  return DUMMY_SHORTLISTED_PARTNERS[sessionId] || DUMMY_SHORTLISTED_PARTNERS['3'];
};

/**
 * Get chat messages for a partner
 */
export const getDummyChatMessages = (partnerId: string): ChatMessage[] => {
  return DUMMY_CHAT_MESSAGES.filter(msg => msg.partnerId === partnerId);
};

/**
 * Countdown data for dummy sessions
 */
export const getDummyCountdown = (sessionId: string) => {
  const session = getDummySessionById(sessionId);
  if (!session?.biddingEndsAt) {
    return { hours: 4, minutes: 12, seconds: 30 };
  }
  
  const now = Date.now();
  const end = new Date(session.biddingEndsAt).getTime();
  const diff = Math.max(0, end - now);
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};
