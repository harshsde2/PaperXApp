import type { LegalDocType, LegalDocument } from './@types';

/**
 * Legal copy shown in the LegalModal. Zupply is the brand operated by
 * SPNP Paper and Pack Pvt Ltd. Keep the company/contact details in sync with
 * config/company.php on the backend.
 *
 * NOTE: This is production-ready template copy for a B2B matchmaking platform.
 * Have it reviewed by legal counsel before public launch and update the
 * effective date whenever the text changes.
 */

const COMPANY_LEGAL_NAME = 'SPNP Paper and Pack Pvt Ltd';
const BRAND_NAME = 'Zupply';
const SUPPORT_EMAIL = 'support@zupply.in';
const EFFECTIVE_DATE = 'Last updated: 6 August 2026';

const TERMS: LegalDocument = {
  title: 'Terms & Conditions',
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      heading: '1. Acceptance of Terms',
      paragraphs: [
        `These Terms & Conditions ("Terms") govern your access to and use of the ${BRAND_NAME} mobile application and related services (the "Platform"), operated by ${COMPANY_LEGAL_NAME} ("Company", "we", "us", or "our").`,
        'By creating an account, verifying your mobile number, or otherwise using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Platform.',
      ],
    },
    {
      heading: '2. About the Platform',
      paragraphs: [
        `${BRAND_NAME} is a session-based business-to-business (B2B) matchmaking platform for India's paper, packaging, and printing industry. We connect buyers and sellers — including dealers, converters, brands, mills, machine dealers, and scrap dealers — by matching posted requirements ("Inquiries") with relevant counterparties.`,
        'We are a technology facilitator only. We are not a buyer, seller, broker, agent, or party to any transaction between users. All negotiations, orders, payments for goods, deliveries, and disputes are strictly between the transacting users.',
      ],
    },
    {
      heading: '3. Eligibility & Registration',
      paragraphs: [
        'The Platform is intended solely for businesses and their authorised representatives. By registering, you represent that you are at least 18 years old and are authorised to act on behalf of the business you register.',
        'You agree to provide accurate, current, and complete information during registration — including business details, GSTIN, and UDYAM registration where applicable — and to keep it updated. Role approval may be automated based on the documents you provide.',
      ],
    },
    {
      heading: '4. Your Account',
      paragraphs: [
        'Access is secured through a one-time password (OTP) sent to your registered mobile number. You are responsible for maintaining the confidentiality of your device and account, and for all activity that occurs under your account.',
        'Notify us immediately of any unauthorised use. We are not liable for any loss arising from your failure to safeguard your account.',
      ],
    },
    {
      heading: '5. Inquiries & Matchmaking',
      paragraphs: [
        'When you post an Inquiry, our matchmaking engine evaluates it against other users based on factors such as material, specifications, tolerances, and location, and creates a time-bound matching session.',
        'Matching sessions are open for a limited window (typically 24 hours) or until they are locked, after which they close to new responders. Matches are generated algorithmically and are suggestions only — we do not guarantee that any Inquiry will receive responses, matches, or result in a completed deal.',
      ],
    },
    {
      heading: '6. Fees, Credits & Payments',
      paragraphs: [
        'Certain features — such as posting an Inquiry or listing products — may require payment or platform credits. Applicable charges are shown before you confirm. Payments are processed securely through our third-party payment gateway (Razorpay); we do not store your full card or bank details.',
        'All fees are exclusive of applicable taxes unless stated otherwise, and are collected inclusive of GST as shown on your invoice. Platform fees, once paid, are generally non-refundable except where required by law or expressly stated. Where free-launch pricing is in effect, some features may be offered at no charge for a limited period at our discretion.',
      ],
    },
    {
      heading: '7. Transactions Between Users',
      paragraphs: [
        'Any contract for the supply of goods or services is formed directly between the transacting users. The Company is not responsible for, and makes no warranty regarding, the quality, safety, legality, quantity, pricing, delivery, or payment of any goods or services offered, sold, or purchased through the Platform.',
        'You transact with other users at your own risk and are solely responsible for verifying the identity, credentials, and offerings of any counterparty before entering into a deal.',
      ],
    },
    {
      heading: '8. Acceptable Use',
      paragraphs: ['You agree not to:'],
      bullets: [
        'Post false, misleading, fraudulent, or unlawful content or requirements.',
        'Impersonate any person or business, or misrepresent your affiliation.',
        'Use the Platform to harass, spam, or defraud other users.',
        'Attempt to reverse engineer, disrupt, overload, or gain unauthorised access to the Platform or its systems.',
        'Scrape, harvest, or misuse other users’ contact or business information.',
        'Violate any applicable law or the rights of any third party.',
      ],
    },
    {
      heading: '9. Intellectual Property',
      paragraphs: [
        `The Platform, including its software, design, logos, and content (excluding user-generated content), is owned by or licensed to ${COMPANY_LEGAL_NAME} and is protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable licence to use the Platform for its intended business purpose.`,
        'You retain ownership of the content you submit, but grant us a licence to host, display, and process it as needed to operate the Platform and provide matchmaking services.',
      ],
    },
    {
      heading: '10. Disclaimers & Limitation of Liability',
      paragraphs: [
        'The Platform is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or that matches will meet your requirements.',
        `To the maximum extent permitted by law, ${COMPANY_LEGAL_NAME} shall not be liable for any indirect, incidental, special, or consequential damages, or for any loss of profits, goodwill, or data, arising out of or relating to your use of the Platform or any transaction with another user. Our total aggregate liability, if any, shall not exceed the total platform fees you paid to us in the three (3) months preceding the claim.`,
      ],
    },
    {
      heading: '11. Indemnification',
      paragraphs: [
        `You agree to indemnify and hold harmless ${COMPANY_LEGAL_NAME}, its directors, employees, and partners from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Platform, your content, your transactions with other users, or your breach of these Terms.`,
      ],
    },
    {
      heading: '12. Suspension & Termination',
      paragraphs: [
        'We may suspend or terminate your access at any time, with or without notice, if we reasonably believe you have violated these Terms, engaged in fraudulent or harmful conduct, or where required by law. You may stop using the Platform at any time.',
      ],
    },
    {
      heading: '13. Governing Law & Jurisdiction',
      paragraphs: [
        'These Terms are governed by the laws of India. Subject to any applicable law, the courts at Mumbai, Maharashtra shall have exclusive jurisdiction over any dispute arising from or relating to these Terms or the Platform.',
      ],
    },
    {
      heading: '14. Changes to These Terms',
      paragraphs: [
        'We may update these Terms from time to time. Material changes will be notified through the Platform or your registered contact details. Your continued use after such changes constitutes acceptance of the revised Terms.',
      ],
    },
    {
      heading: '15. Contact Us',
      paragraphs: [
        `For any questions about these Terms, contact ${COMPANY_LEGAL_NAME} at ${SUPPORT_EMAIL}.`,
      ],
    },
  ],
};

const PRIVACY: LegalDocument = {
  title: 'Privacy Policy',
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      heading: '1. Introduction',
      paragraphs: [
        `${COMPANY_LEGAL_NAME} ("we", "us", or "our") operates the ${BRAND_NAME} platform. This Privacy Policy explains what information we collect, how we use and share it, and the choices you have. By using the Platform, you consent to the practices described here.`,
      ],
    },
    {
      heading: '2. Information We Collect',
      paragraphs: ['We collect the following categories of information:'],
      bullets: [
        'Account & business details: mobile number, name, company name, role, GSTIN, UDYAM registration, and other business information you provide.',
        'Requirement data: the Inquiries, product listings, specifications, and messages you post or exchange on the Platform.',
        'Location data: your business or requirement location, used to improve match relevance (only where you provide it or enable it).',
        'Payment information: transaction records and identifiers from our payment gateway. We do not store your full card or bank credentials.',
        'Device & usage data: device identifiers, push-notification token, app version, and interaction logs used to operate and improve the service.',
      ],
    },
    {
      heading: '3. How We Use Your Information',
      paragraphs: ['We use your information to:'],
      bullets: [
        'Provide matchmaking and connect you with relevant counterparties.',
        'Verify your business and process role approvals.',
        'Process payments and issue invoices.',
        'Send transactional and match-related notifications.',
        'Provide customer support and respond to your requests.',
        'Maintain security, prevent fraud, and improve the Platform.',
        'Comply with legal and regulatory obligations.',
      ],
    },
    {
      heading: '4. How We Share Information',
      paragraphs: [
        'We do not sell your personal information. We share information only as needed to operate the Platform:',
      ],
      bullets: [
        'With matched counterparties: relevant business and requirement details are shared to enable a deal once a match or session connects you.',
        'With service providers: payment processing (Razorpay), cloud messaging and notifications (Google Firebase), and infrastructure providers, who process data on our behalf.',
        'For legal reasons: where required by law, regulation, legal process, or to protect our rights, users, or the public.',
      ],
    },
    {
      heading: '5. Push Notifications',
      paragraphs: [
        'With your permission, we send push notifications about matches, sessions, and account activity. You can disable these at any time in your device settings; some service-related messages may still be delivered in-app.',
      ],
    },
    {
      heading: '6. Data Retention',
      paragraphs: [
        'We retain your information for as long as your account is active and as needed to provide the service, comply with our legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated personal data, subject to legal retention requirements.',
      ],
    },
    {
      heading: '7. Data Security',
      paragraphs: [
        'We use reasonable technical and organisational measures to protect your information, including secure transmission and access controls. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      heading: '8. Your Rights',
      paragraphs: [
        'Subject to applicable law, you may request access to, correction of, or deletion of your personal information, and you may withdraw consent where processing is based on consent. To exercise these rights, contact us using the details below.',
      ],
    },
    {
      heading: '9. Third-Party Services',
      paragraphs: [
        'The Platform relies on third-party services (such as Razorpay and Google Firebase) that have their own privacy policies. We encourage you to review them. We are not responsible for the privacy practices of third parties.',
      ],
    },
    {
      heading: '10. Children',
      paragraphs: [
        'The Platform is intended for business use by persons aged 18 and above. We do not knowingly collect information from children.',
      ],
    },
    {
      heading: '11. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. Material changes will be notified through the Platform or your registered contact details. Your continued use after such changes constitutes acceptance of the updated policy.',
      ],
    },
    {
      heading: '12. Contact & Grievances',
      paragraphs: [
        `If you have questions or concerns about this Privacy Policy or how your data is handled, contact ${COMPANY_LEGAL_NAME} at ${SUPPORT_EMAIL}. We will respond to your request within a reasonable timeframe.`,
      ],
    },
  ],
};

export const LEGAL_CONTENT: Record<LegalDocType, LegalDocument> = {
  terms: TERMS,
  privacy: PRIVACY,
};
