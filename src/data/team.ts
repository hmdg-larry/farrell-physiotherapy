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
      "Ben Farrell is the practice principal at Farrell Physiotherapy and graduated from the University of East London in 2001 with an Honours degree in Physiotherapy. This followed a 3 year degree in Sports Rehabilitation in St Mary's University College, Twickenham. He began his career in the NHS at Southend General Hospital where his focus and special interests were Musculoskeletal outpatients and Orthopaedics. During this time he honed his skills with regard to these two disciplines. Whilst learning his skills at the hospital Ben began to develop a desire to set up in private practice, which he did in 2003. This allowed him to see a greater spectrum of clients from the acute to chronic and people from a sporting environment rather than just in the hospital setting.",
      "Over the next few years Ben worked in and for various private clinics in Southend, Leigh on Sea, Wickford, Chelmsford, Reading, Henley on Thames whilst also working as a locum physiotherapist for two years in the NHS. This allowed him greater time with his clients to diagnose and understand people's injuries and problems ensuring effective and correct treatments were administered. It was a valuable learning curve and gave Ben the best view on what each of the clinics he worked in excelled. Based on this he established the core principals of the practice which were communication and correct diagnosis were essential to allow best treatment. The motto of the clinic is ease the pain, cure the cause.",
      'Ben was then keen to revisit the sporting arena and became one of the Physiotherapists at Essex County Cricket Club for 2 years working with such athletes as Andy Flower, Darren Gough, Ravi Bopara and Andy Bickel. An opportunity arose for Ben to be Physiotherapist for Old Loughtonians Hockey club, which he did for 2 seasons and thoroughly enjoyed before setting up Clinic in Chelmsford in 2011.',
      'Ben has always wanted and demanded the best for his clients and makes sure that no stone is left unturned to get the correct result for his clients. Ben is a firm believer that client input into rehabilitation and physiotherapy is essential. Explanation of and understanding the problem is paramount for the client to get better. Working together returns you to pre injury fitness and well-being as quick as possible.',
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
      'Mark is an experienced musculoskeletal physiotherapist who has worked in professional sports in various disciplines. He has a wealth of experience working at Farrell Physiotherapy since 2017 and working with elite-level sports people in professional rugby (Wasps) and professional cricket (Essex CCC). He can provide Orthopaedic injections, such as corticosteroids and hyaluronic acid, for patients whose conditions do not respond to manual therapy.',
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
      "Reef graduated from the University of Essex with a Master's degree in Physiotherapy, following a Bachelor's degree in Sports and Exercise Science. He has gained valuable experience working across a variety of physiotherapy settings, with a strong foundation in musculoskeletal rehabilitation, exercise prescription, and functional conditioning.",
      'Alongside his clinical work, Reef has developed expertise supporting adults of all ages through tailored physiotherapy-led programs, helping individuals improve strength, mobility, and long-term musculoskeletal health. His background in sports science and personal training complements his physiotherapy approach, enabling him to integrate evidence-based rehab with personalised strength and conditioning principles.',
      'Reef combines hands-on manual therapy techniques with movement-focused rehabilitation to support pain reduction, improve function and promote confident long-term self-management. He is passionate about empowering people through education and believes physiotherapy should support not only recovery, but long-term wellbeing and resilience.',
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
      'With over two and a half years of experience in private practice, Matt specialises in diagnosing and treating acute and chronic musculoskeletal conditions and post-operative rehabilitation. Having transitioned from early career rotations within a hospital setting into a dedicated MSK role, he brings a fresh, evidence-based perspective to rehabilitation. Known for a "hands-on" approach, Matt utilises advanced manual therapy techniques and tailored exercise prescriptions to accelerate recovery and restore functional mobility. By combining evidence-based practice with compassionate care, Matt has successfully supported patients through complex post-surgical journeys, consistently achieving high satisfaction and improved long-term outcomes.',
    ],
    seoTitle: 'Matt Hesketh — Physiotherapist',
    metaDescription: 'Meet Matt Hesketh, physiotherapist at Farrell Physiotherapy specialising in musculoskeletal conditions and post-operative rehabilitation.',
  },
];
