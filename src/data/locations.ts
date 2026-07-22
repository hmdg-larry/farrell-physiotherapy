/**
 * locations.ts — Clinic locations (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * Farrell Physiotherapy operates three clinics. This is separate from
 * `site.ts`'s single `contact` object (which is the site-wide/JSON-LD
 * representative identity used in the header, footer, and Chelmsford-
 * anchored global schema) — each entry here has its own address for
 * the /clinics/[slug]/ and /prices/[slug]/ page templates.
 *
 * Address, phone, mobile, and email are REAL (confirmed 2026-07-06).
 * Phone/mobile/email are shared across all three clinics (one contact
 * point, not per-location numbers) — split them out per location if
 * that ever changes.
 *
 * Booking URLs are REAL per-location Cliniko links (confirmed).
 * Opening hours now set from the live site (Mon–Fri 6am–9pm, Sat
 * 9am–12pm), shared across all three clinics. Confirm the evening
 * close (9pm vs the about page's 9:30pm) and any per-clinic variation
 * with the client before launch — see .project-log.md.
 *
 * SANITY-READY: maps onto future `location` documents. Replace this
 * export with a GROQ fetch returning the same `ClinicLocation` shape —
 * zero template changes.
 */
import type { ClinicLocation, PriceItem } from '../lib/content/types';

const SHARED_PHONE_DISPLAY = '01245 830280';
const SHARED_PHONE_TEL     = '+441245830280';
const SHARED_MOBILE_DISPLAY = '07980 898212';
const SHARED_MOBILE_TEL     = '+447980898212';
const SHARED_EMAIL = 'infofarrellphysiotherapy@gmail.com';

// Real prices (confirmed from farrellphysiotherapy.co.uk/prices/).
// Chelmsford & Witham share the same rates; Leigh-on-Sea is higher.
const PRICES_STANDARD: PriceItem[] = [
  { label: 'Initial Assessment',          price: '£50'  },
  { label: 'Follow-Up Treatment Session', price: '£50'  },
  { label: 'Home Visit', detail: '30 minutes', price: '£100' },
];
const PRICES_LEIGH: PriceItem[] = [
  { label: 'Initial Assessment',          price: '£60'  },
  { label: 'Follow-Up Treatment Session', price: '£60'  },
  { label: 'Home Visit', detail: '30 minutes', price: '£100' },
];

// Live-site opening hours (Mon–Fri 6am–9pm, Sat 9am–12pm), shared across
// all three clinics until per-location hours are confirmed. Update per
// location if they ever differ. (See SEO note re 9pm vs 9:30pm.)
const SHARED_HOURS = {
  mon: { open: '06:00', close: '21:00' },
  tue: { open: '06:00', close: '21:00' },
  wed: { open: '06:00', close: '21:00' },
  thu: { open: '06:00', close: '21:00' },
  fri: { open: '06:00', close: '21:00' },
  sat: { open: '09:00', close: '12:00' },
  sun: null,
} as const;

export const locations: ClinicLocation[] = [
  {
    name: 'Chelmsford',
    slug: 'chelmsford',
    clinicHref: '/clinics/chelmsford/',
    pricesHref: '/prices/chelmsford/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1868094202668132472',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Unit 2, The Old Coal Yard, Little Waltham Road, Broomfield',
      addressLine2: 'Chelmsford, CM1 7TG',
      mapsUrl: 'https://maps.app.goo.gl/EqDGAHp8KkutFQ2H9',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2467.5!2d0.4878068!3d51.7658809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8e963205c99c1%3A0xd0ddec161488fdd8!2sFarrell%20Physiotherapy!5e0!3m2!1sen!2sph!4v1783680101504!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_STANDARD,
    sections: [
      {
        layout: 'about',
        heading: 'Our Specialised Physiotherapy Services in Chelmsford',
        paragraphs: ['Every patient is unique, so your treatment plan should be too. At our Chelmsford clinic, we focus on:'],
        checklist: [
          'Bespoke treatment plans – built around your injury, lifestyle, and goals.',
          'Comprehensive initial consultation – covering injury history, detailed examination, and clear diagnosis.',
          'Hands-on therapy & rehabilitation – combining manual techniques with targeted exercise programmes.',
          'Preventing recurrence – we don’t just treat symptoms; we help you stay pain-free long term.',
          'Insurance approved – recognised by BUPA, AXA PPP, WPA, CIGNA, AVIVA, Simplyhealth, Nuffield, and more.',
        ],
        image: '/images/clinic/chelmsford-1.avif',
      },
      {
        layout: 'whychoose',
        heading: 'Your First Chelmsford Physio Appointment',
        paragraphs: [
          'At Farrell Physiotherapy Chelmsford, no two patients are ever the same. That’s why every session begins with a thorough initial consultation where we take the time to understand your injury, its history, and how it affects your daily life. After a detailed assessment, your physiotherapist will provide a clear explanation of the findings and outline a tailored treatment plan.',
          'Treatment often begins in your first session and may include manual therapy, exercise rehabilitation, or other evidence-based techniques. You’ll also receive a personalised exercise programme to continue at home, designed to speed up recovery and reduce the risk of future injury. Your physiotherapist will guide you every step of the way, so you know exactly what to expect from your treatment journey.',
        ],
        image: '/images/clinic/chelmsford-2.avif',
        cta: true,
        imageLeft: true,
      },
    ],
  },
  {
    name: 'Witham',
    slug: 'witham',
    clinicHref: '/clinics/witham/',
    pricesHref: '/prices/witham/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1889146624207235678#service',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Witham Leisure Centre, Spinks Ln',
      addressLine2: 'Witham, CM8 1EP',
      mapsUrl: 'https://maps.app.goo.gl/aFF6ubMgAfYJ7XJn7',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2467.5!2d0.6330087!3d51.7966177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8e5ddbedb9cd1%3A0x49fd5b39f4e472c7!2sFarrell%20Physiotherapy!5e0!3m2!1sen!2sph!4v1783680045357!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_STANDARD,
    sections: [
      {
        layout: 'about',
        heading: 'Why Choose Farrell Physiotherapy in Witham',
        paragraphs: ['At Farrell Physiotherapy in Witham, we focus on providing expert one-to-one care that’s tailored to each person. Whether you’re recovering from a sports injury, dealing with ongoing pain, or simply want to move more freely, our experienced team is here to support you. We take the time to understand the root cause of your problem and create a treatment plan that works for you, rather than offering quick fixes. Conveniently based in Witham, we’re committed to helping you feel better, move better, and get back to doing the things you enjoy.'],
        subsections: [
          {
            heading: 'Our Physiotherapy Services in Witham',
            paragraphs: ['Our services go beyond standard treatment sessions. We take a holistic approach, looking at how your lifestyle, movement patterns, and day-to-day activities affect your health. This allows us to provide physiotherapy that not only targets the source of your pain but also helps prevent problems from coming back. From your very first appointment, we’ll guide you through a clear treatment plan and give you practical advice to keep you moving well outside of the clinic.'],
          },
          {
            heading: 'Conditions We Treat in Witham',
            paragraphs: ['Farrell Physiotherapy in Witham supports patients with everything from everyday aches and pains to more complex injuries. Our treatments are personalised to your needs, helping you recover, relieve pain, and move more freely.'],
          },
        ],
        image: '/images/clinic/witham-1.avif',
      },
      {
        layout: 'whychoose',
        heading: 'Book Your Physiotherapy Appointment in Witham',
        paragraphs: [
          'Everyone is an individual and as a result, at Farrell Physiotherapy, we ensure that every session is bespoke to you and the injury you have sustained.',
          'Commencing with the initial consultation, we will ask you some questions about the mechanism and history of the injury. We will then examine your injury and give you’re a differential diagnosis and explanation based on what the findings indicate.',
          'Following this you will receive treatment and be given an exercise program to follow over .You may need more sessions but it will all be explained by your therapist.',
          'All payments are made after each session. We accept cash, all major credit cards and cheques.',
          'We are recognised by ALL major health insurance companies, including BUPA, AXA PPP, WPA, CIGNA, AVIVA, PRU HEALTH and NUFFIELD. Please contact us if you have any queries about your health insurance or using it for Physiotherapy.',
          'To arrange an appointment click Book Online below, call us on <a href="tel:01245830280">01245 830280</a> or email us at <a href="mailto:infofarrellphysiotherapy@gmail.com">infofarrellphysiotherapy@gmail.com</a>',
        ],
        image: '/images/clinic/witham-2.avif',
        cta: true,
        imageLeft: true,
      },
    ],
  },
  {
    name: 'Leigh-on-Sea',
    slug: 'leigh-on-sea',
    clinicHref: '/clinics/leigh-on-sea/',
    pricesHref: '/prices/leigh-on-sea/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1889147855948491359',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Room 4, The Realignment Clinic, 1342 London Road',
      addressLine2: 'Leigh-on-Sea, SS9 2UH',
      mapsUrl: 'https://maps.app.goo.gl/FhkJ22PokFaM7ptG7',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.1!2d0.6391106!3d51.5477775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8db50d12e7c2d%3A0x52556070f1fc516a!2sFarrell%20Physiotherapy!5e0!3m2!1sen!2sph!4v1783680152698!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_LEIGH,
    sections: [
      {
        layout: 'about',
        heading: 'Why Choose Farrell Physiotherapy in Leigh-on-Sea?',
        checklist: [
          'Experienced physiotherapists with expertise across a wide range of injuries and conditions.',
          'Evidence-based treatments, from manual therapy to exercise rehabilitation.',
          'Hands-on therapy & rehabilitation – combining manual techniques with targeted exercise programmes.',
          'Flexible appointments, including early mornings, evenings, and Saturdays.',
          'Local, convenient location inside The Realignment Clinic, 1342 London Road, Leigh-on-Sea.',
        ],
        image: '/images/clinic/leigh-on-sea-1.avif',
        cta: true,
      },
      {
        layout: 'whychoose',
        heading: 'What to Expect at Our Leigh-on-Sea Clinic',
        paragraphs: ['Your first session begins with a comprehensive consultation, where we take the time to understand your injury history, lifestyle, and goals. From there, your physiotherapist will:'],
        checklist: [
          'Carry out a full physical assessment.',
          'Provide a clear explanation and diagnosis.',
          'Begin treatment during your first visit where appropriate.',
          'Create a tailored exercise and rehabilitation programme for you to follow at home.',
        ],
        closing: ['We’ll explain every step of the process, so you’ll know what to expect and how your treatment is progressing.'],
        image: '/images/clinic/leigh-on-sea-2.avif',
        cta: true,
        imageLeft: true,
      },
      {
        layout: 'whychoose',
        heading: 'Conditions We Treat in Leigh-on-Sea',
        paragraphs: ['Our expert physiotherapists in Leigh-on-Sea regularly help patients with:'],
        checklist: [
          'Ankles',
          'Buttocks & Legs',
          'Elbow',
          'Feet',
          'Hands & Wrists',
          'Hips & Thighs',
          'Knees',
          'Lower Legs & Calves',
          'Lumbar & Pelvis',
          'Neck & Head',
          'Shoulders',
          'Thoracic Spine',
        ],
        closing: ['If you have any questions about treatment options for your injury or condition, please don’t hesitate to contact us by clicking the button below!'],
        image: '/images/clinic/leigh-on-sea-3.avif',
        cta: true,
        muted: true,
        twoColChecklist: true,
      },
    ],
  },
];
