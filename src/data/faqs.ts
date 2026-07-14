/**
 * faqs.ts — Frequently asked questions
 * ─────────────────────────────────────────────────────────────────
 * Real Farrell Physiotherapy FAQs (provided by the client). The shared
 * phone number is pulled from site.ts so it stays in sync — do not
 * hardcode contact details in the answers.
 *
 * SANITY-READY: maps onto future `faq` documents. Replace this export
 * with a GROQ fetch returning the same `Faq` shape — zero template
 * changes.
 */
import type { Faq } from '../lib/content/types';
import { site } from './site';

export const faqs: Faq[] = [
  {
    question: "I'm not sure if I need a physiotherapist?",
    answer: `If you are not sure, please call us on ${site.contact.phoneDisplay}. We can discuss your problem and determine whether physiotherapy would benefit you. If it is appropriate, we can arrange an appointment at your earliest convenience. If not, we will help guide you toward the most suitable treatment.`,
  },
  {
    question: 'What happens next?',
    answer: 'Your initial consultation includes a physical assessment, diagnosis, initial treatment, recommended exercises, and a discussion of your treatment plan. If further sessions are needed, they may include joint mobilisation, joint manipulation, postural correction, soft tissue massage, a home exercise programme, a gym programme, self-management techniques, and preventative advice.',
  },
  {
    question: 'What should I wear?',
    answer: 'Wear whatever you feel comfortable in. Shorts are recommended if we are treating your hips or knees. A top that allows access to your neck, back, or shoulders is helpful if those areas require treatment. If you are unsure, please contact us before your appointment.',
  },
  {
    question: 'Do you accept private health or medical insurance?',
    answer: 'Yes. We are a recognised provider for all major private health insurance companies. If you have questions about your insurance coverage before booking, please contact us.',
  },
  {
    question: 'What happens during the treatment sessions?',
    answer: 'Your first session includes a thorough assessment to diagnose your condition. We will explain the diagnosis, create a personalised treatment plan, and begin treatment. Physiotherapy may include manual therapy, ultrasound, prescribed exercises, and advice to address both your symptoms and their underlying cause.',
  },
  {
    question: "What happens if physiotherapy treatment doesn't help me?",
    answer: 'If you have not improved after approximately two weeks of treatment, we may refer you to your GP or a specialist consultant for further investigation. This may include X-rays, blood tests, or an MRI scan. We also have established links with experienced orthopaedic and spinal specialists.',
  },
  {
    question: 'Will it hurt?',
    answer: 'Our goal is to make treatment as comfortable as possible. Some techniques may require firmer pressure or more intensive treatment. We will explain this beforehand, and you can ask us to stop at any time if you experience too much discomfort. If you have questions about any treatment techniques, please contact us.',
  },
  {
    question: 'How long does a physiotherapy treatment session last?',
    answer: 'Most treatment sessions last around 30 minutes. Longer appointments can be arranged if required.',
  },
];
