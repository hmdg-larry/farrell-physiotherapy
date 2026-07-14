/**
 * team.ts — Team member directory (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * Real staff bios for Farrell Physiotherapy, supplied directly by the
 * client. Wording has been lightly tidied for a consistent, patient-
 * friendly tone and split into shorter paragraphs, but every fact,
 * qualification, and named clinical interest is preserved exactly as
 * given — nothing here is invented.
 *
 * Consumed by src/pages/team/index.astro (directory grid) and
 * src/pages/team/[slug].astro (individual profile pages).
 *
 * SANITY-READY: maps onto a future `teamMember` document type.
 */
import type { TeamMember } from '../lib/content/types';

export const teamMembers: TeamMember[] = [
  {
    name: 'Ben Farrell',
    role: 'Practice Principal',
    slug: 'ben-farrell',
    intro: 'Founder of Farrell Physiotherapy, with over two decades of experience treating everyone from weekend athletes to professional sportspeople.',
    bio: [
      "Ben founded Farrell Physiotherapy and leads the practice today. He graduated from the University of East London in 2001 with an Honours degree in Physiotherapy, having first completed a three-year degree in Sports Rehabilitation at St Mary's University College, Twickenham.",
      'He began his career in the NHS at Southend General Hospital, where he focused on musculoskeletal outpatients and orthopaedics — grounding that shaped the clinical approach he still uses today.',
      'In 2003, Ben moved into private practice, which allowed him to treat a wider range of patients, from acute injuries to long-standing chronic pain, alongside people from sporting backgrounds. Over the following years he worked in and for clinics across Southend, Leigh-on-Sea, Wickford, Chelmsford, Reading and Henley-on-Thames, while also spending two years as a locum physiotherapist in the NHS.',
      "That experience shaped the principles the practice is still built on: clear communication and an accurate diagnosis as the foundation for effective treatment — summed up in the clinic's motto, ease the pain, cure the cause.",
      'Ben spent two years as one of the physiotherapists for Essex County Cricket Club, working with players including Andy Flower, Darren Gough, Ravi Bopara and Andy Bickel, and a further two seasons as physiotherapist for Old Loughtonians Hockey Club, before opening the Chelmsford clinic in 2011.',
      'He believes recovery works best as a two-way process — that patients understanding their own problem, and having a say in their own rehabilitation, is just as important as the hands-on treatment itself.',
    ],
    specialisms: [
      'Acute and chronic lower back pain',
      'Shoulder pain',
      'Tennis elbow',
      'Knee pain',
      'Ankle and foot pain',
    ],
    seoTitle: 'Ben Farrell — Practice Principal',
    metaDescription: 'Meet Ben Farrell, founder and Practice Principal of Farrell Physiotherapy — over 20 years of NHS, private practice and professional sports experience.',
  },
  {
    name: 'Mark Thomas',
    role: 'Physiotherapist',
    slug: 'mark-thomas',
    intro: 'An experienced musculoskeletal physiotherapist with a background in professional sport, at Farrell Physiotherapy since 2017.',
    bio: [
      'Mark is an experienced musculoskeletal physiotherapist who has spent much of his career working in professional sport across a number of disciplines.',
      'He has been part of the Farrell Physiotherapy team since 2017, bringing with him experience treating elite-level athletes — including professional rugby players at Wasps and professional cricketers at Essex CCC.',
      "For patients whose conditions haven't responded fully to manual therapy alone, Mark is also able to provide orthopaedic injections, such as corticosteroids and hyaluronic acid.",
    ],
    seoTitle: 'Mark Thomas — Physiotherapist',
    metaDescription: 'Meet Mark Thomas, physiotherapist at Farrell Physiotherapy since 2017, with a background treating professional rugby and cricket players.',
  },
  {
    name: 'Reef Cowell',
    role: 'Physiotherapist',
    slug: 'reef-cowell',
    intro: 'A physiotherapist with a sports science background, focused on combining hands-on treatment with long-term strength and mobility.',
    bio: [
      "Reef holds a Master's degree in Physiotherapy from the University of Essex, following an earlier Bachelor's degree in Sports and Exercise Science.",
      'He has worked across a variety of physiotherapy settings, building a strong foundation in musculoskeletal rehabilitation, exercise prescription and functional conditioning.',
      'Alongside his clinical work, Reef supports adults of all ages through tailored, physiotherapy-led programmes designed to improve strength, mobility and long-term musculoskeletal health.',
      'His background in sports science and personal training feeds directly into his approach to physiotherapy, allowing him to combine evidence-based rehabilitation with personalised strength and conditioning principles.',
      'In practice, this means pairing hands-on manual therapy with movement-focused rehabilitation — aimed at reducing pain, restoring function, and giving patients the confidence to manage their own recovery long after treatment ends.',
      'Reef is a strong believer in education as part of treatment, and sees physiotherapy as supporting not just recovery, but long-term wellbeing and resilience.',
    ],
    seoTitle: 'Reef Cowell — Physiotherapist',
    metaDescription: "Meet Reef Cowell, physiotherapist at Farrell Physiotherapy, combining manual therapy with strength and conditioning for long-term recovery.",
  },
  {
    name: 'Matt Hesketh',
    role: 'Physiotherapist',
    slug: 'matt-hesketh',
    intro: 'A hands-on physiotherapist specialising in musculoskeletal conditions and post-operative rehabilitation.',
    bio: [
      'With over two and a half years of experience in private practice, Matt specialises in diagnosing and treating both acute and chronic musculoskeletal conditions, as well as post-operative rehabilitation.',
      'Having started his career with hospital rotations before moving into a dedicated musculoskeletal role, he brings a fresh, evidence-based perspective to every stage of rehabilitation.',
      'Matt takes a hands-on approach, using advanced manual therapy techniques alongside tailored exercise programmes to help patients recover more quickly and regain functional movement.',
      'He has supported many patients through complex post-surgical recovery, combining evidence-based practice with genuine, compassionate care — consistently achieving strong outcomes and high patient satisfaction.',
    ],
    seoTitle: 'Matt Hesketh — Physiotherapist',
    metaDescription: 'Meet Matt Hesketh, physiotherapist at Farrell Physiotherapy specialising in musculoskeletal conditions and post-operative rehabilitation.',
  },
];
