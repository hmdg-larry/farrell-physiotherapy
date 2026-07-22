/**
 * services.ts — Services list (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * Mirrors SITEMAP.md exactly. Consumed by Footer.astro (services
 * column), Header.astro (via navigation.ts — kept in sync manually),
 * ServicesCarousel.astro, and src/pages/service/[slug].astro.
 *
 * excerpt / intro / points are real content adapted (condensed, British
 * English, no fabricated clinical claims) from the live site's service
 * and treatment pages (farrellphysiotherapy.co.uk/our-services/* and
 * /treatments/*). `excerpt` = card/carousel/meta summary; `intro` =
 * one-line hook under the H1; `points` = the detail page's checklist.
 *
 * SANITY-READY: maps onto future `service` documents. Replace this
 * export with a GROQ fetch returning the same `Service` shape.
 */
import type { Service } from '../lib/content/types';

/** "Therapies" group in the header dropdown / Services page. */
export const therapies: Service[] = [
  {
    title: "Physiotherapy",
    href: "/service/physiotherapy-services/",
    about: "Physiotherapy is the treatment of injury, deformity or disease using physical methods such as exercise, hands-on therapy, heat treatment and massage rather than surgery or drugs. At Farrell Physiotherapy it is delivered as a holistic, patient-centred service by HCPC-registered physiotherapists, who begin with a full assessment to identify the problem and then build a tailored treatment programme. The aim is to reduce pain, restore movement and strength, improve posture and help you return to your pre-injury level of activity.",
    faqs: [
      { q: "What conditions can physiotherapy help with?", a: "Physiotherapy can help with a wide range of problems, including back and neck pain, arthritis, sciatica, frozen shoulder, sports injuries, whiplash, muscle and ligament tears, and post-surgical recovery such as joint replacements and ligament reconstructions. It also supports neurological and postural issues, so if you are unsure whether it is right for you, please get in touch and the physiotherapist can advise." },
      { q: "What happens during a physiotherapy session?", a: "Your physiotherapist will fully assess you at the first appointment to find out what the problem is, then create a treatment programme tailored to you. This may include hands-on techniques such as joint manipulation, soft tissue massage and muscle energy techniques, alongside exercise, taping, acupuncture, ultrasound or other approaches as appropriate." },
      { q: "Do I need a referral from my GP to be seen?", a: "You do not usually need a GP referral to book physiotherapy directly, as physiotherapists are able to assess and treat you independently. If you are claiming through private medical insurance, it is best to check your policy, as some insurers may ask for a referral first." },
      { q: "Is physiotherapy covered by health insurance?", a: "Farrell Physiotherapy accepts many major UK insurers, including AXA PPP, Bupa, PruHealth, Simply Health and Standard Life. We would recommend confirming the details of your cover with your insurer beforehand, and please get in touch if you have any questions about arranging your appointment." },
      {
        q: "What sort of problems can be treated with physiotherapy?",
        a: "Physiotherapy can be used to treat a wide variety of different problems, including:",
        aList: [
          { label: "Joints", text: "Back and neck pain, prolapsed discs or trapped nerves, arthritis, pain, swelling, injury, stiffness, frozen shoulder, sciatica, and knee injuries involving ligament and cartilage damage." },
          { label: "Injuries", text: "Muscle and ligament tears/sprains, whiplash, sports injuries involving muscle, ligament, capsule, cartilage and tendon damage, trauma or fractures, golfer's elbow, and tennis elbow." },
          { label: "Pre and Post-Operative Rehabilitation", text: "Pre- and post-arthroscopy rehabilitation, scar tissue treatment, joint replacements (hip, knee, shoulder), and ACL reconstructions." },
          { label: "Posture", text: "Ergonomic advice and postural problems, including shoulder, back, or neck problems." },
          { label: "Neurological", text: "Head injuries, multiple sclerosis, strokes, Parkinson's disease, peripheral neuropathies, headaches, and balance issues." },
          { label: "Occupational", text: "Personal injuries, such as accidents at work, driving accidents, or falls, and repetitive strain injuries, such as typing-related injuries." },
        ],
      },
      {
        q: "What treatment techniques are used by a physiotherapist?",
        a: "Your physiotherapist will fully assess you initially in order to find out what the problem is. They will then create a treatment programme for you based on what they find.",
        aListIntro: "Treatment techniques include:",
        aLinks: [
          { text: "Joint manipulation", href: "/service/joint-manipulation/" },
          { text: "Soft tissue massage", href: "/service/soft-tissue-manipulation/" },
          { text: "Trigger points", href: "/service/trigger-points/" },
          { text: "Muscle energy techniques", href: "/service/muscle-energy-techniques/" },
          { text: "Acupuncture" },
          { text: "Ultrasound" },
          { text: "Taping (postural and sports)", href: "/service/taping-postural-and-sports/" },
          { text: "Gait analysis", href: "/service/gait-analysis/" },
          { text: "Manual traction", href: "/service/manual-traction/" },
          { text: "Pilates", href: "/service/pilates/" },
          { text: "Ergonomic/work-based assessments (Desk)", href: "/service/ergonomic-work-based-assessments/" },
          { text: "Transcutaneous electrical nerve stimulation (TENS)", href: "/service/transcutaneous-electrical-nerve-stimulation-tens/" },
        ],
      },
      {
        q: "What can physiotherapy do?",
        a: "Physiotherapy has proven to be effective at reducing symptoms and there are several benefits of physiotherapy including:",
        aLinks: [
          { text: "Reduced pain" },
          { text: "Increased range of movement" },
          { text: "Increased strength" },
          { text: "Improved posture" },
          { text: "Education about your condition" },
          { text: "Increased sporting activity" },
          { text: "Increased functional activity" },
        ],
      },
    ],
    excerpt: "Physiotherapy uses physical methods — exercise, massage and manual techniques — to treat injury, pain and movement problems without surgery or medication.",
    intro: "Expert physiotherapists treating a wide range of conditions to reduce pain and restore how you move.",
    points: [
      "Treats injuries, joint and posture problems, and post-operative rehabilitation",
      "Combines hands-on techniques with exercise, taping, Pilates and gait analysis",
      "Reduced pain, greater strength and mobility, and a faster return to sport or work",
      "Same-day appointments available; major insurers accepted",
    ],
  },
  {
    title: "Sports Massage",
    href: "/service/sports-massage-chelmsford-and-witham/",
    heroHeadline: "Sports Massage Chelmsford & Witham",
    about: "Sports massage is a deeper, more focused form of massage that targets tension and stress in the soft tissues, combining Swedish massage with techniques such as compression, stretching, frictioning and trigger point work. At Farrell Physiotherapy it is used to stimulate circulation, relax and ease muscle tissue, reduce swelling and pain, and improve range of movement and flexibility. It can be delivered as a standalone treatment or alongside other therapies, and benefits everyone from athletes to non-sporty people looking to relieve muscle tension and aid recovery.",
    faqs: [
      { q: "What does a sports massage involve?", a: "Your therapist uses a range of hands-on techniques, including effleurage (stroking), petrissage, squeezing, frictioning and trigger point work, to release tension in the soft tissues. The treatment is tailored to you following an assessment of your needs on the day." },
      { q: "Do I have to be an athlete to have a sports massage?", a: "Not at all. A sports massage can benefit anybody, not just a sportsperson, and is commonly used to ease neck pain, back pain, muscle soreness, tightness and fatigue as well as sports injuries. It is a good option for anyone wanting to relieve muscle tension and improve recovery." },
      { q: "Does a sports massage hurt?", a: "Sports massage is deeper and more intense than a standard massage, so you may feel some discomfort as tight areas and trigger points are worked on. Your therapist will always adjust the pressure to suit you, so please let them know how you are finding it during the session." },
      { q: "How many sessions will I need?", a: "This varies from person to person and depends on whether the massage is for general maintenance, event preparation and recovery, or rehabilitation of an injury. Your physiotherapist will advise on a suitable plan after assessing you, so it is best to get in touch to discuss your individual needs." },
    ],
    excerpt: "Sports massage is a deeper, more intensive massage that eases tension in the soft tissues to aid recovery and help prevent injury — for athletes and non-athletes alike.",
    intro: "Specialised massage to release muscle tension, improve flexibility and speed up recovery.",
    points: [
      "Boosts circulation, reduces pain and swelling, and relaxes tight muscle tissue",
      "Great for maintenance, pre-event preparation and injury rehabilitation",
      "Helps neck and back pain, muscle soreness, tightness and post-exercise fatigue",
      "Available at our Chelmsford and Witham clinics",
    ],
  },
  {
    title: "Pilates",
    href: "/service/pilates/",
    about: "Pilates is an exercise system, developed by Joseph Pilates in the early 1900s, that focuses on strengthening and stretching the whole body to improve balance, flexibility, posture and strength. At Farrell Physiotherapy it is used to build core stability and deep postural muscle control through slow, controlled movements, emphasising breathing, alignment and concentration. It is a progressive approach suitable for people of all ages and fitness levels, and is often used to help with problems such as back pain, poor posture, pregnancy-related issues and osteoarthritis, as well as to prevent injury.",
    faqs: [
      { q: "What does a Pilates session involve?", a: "Sessions focus on controlled, slow movements that develop core stability and deep postural muscles, with an emphasis on breathing control, body alignment, co-ordination and concentration. Exercises progress gradually as you master each technique, so the programme builds at a pace that suits you." },
      { q: "Who can benefit from Pilates?", a: "Pilates can be performed by people of all ages and fitness levels, including complete beginners, as it is a progressive form of exercise. It is often used to help with back pain, poor strength and posture, pregnancy-related issues and osteoarthritis, and is popular with dancers, cricketers and athletes for injury prevention and better movement control." },
      { q: "Is Pilates painful or strenuous?", a: "Pilates is generally gentle and low-impact, performed in a controlled and slow manner rather than through strain, so it should not be painful. Your physiotherapist will tailor the exercises to your current ability and any conditions you have, so please mention any discomfort so the programme can be adjusted." },
      { q: "How many sessions will I need and do I need a referral?", a: "The number of sessions varies from person to person, so your physiotherapist will advise after assessing you and understanding your goals. You do not usually need a referral to get started; you can book online or get in touch with the clinic to discuss the best option for you." },
    ],
    excerpt: "Pilates is a controlled system of exercise that strengthens and stretches the body to improve balance, flexibility, posture and core stability — for all ages.",
    intro: "Build deep postural strength and core stability through controlled, low-impact exercise.",
    points: [
      "Helps back pain, poor posture, pregnancy-related issues and osteoarthritis",
      "Improves muscle tone, joint stability and injury prevention",
      "Progressive exercises using breathing control, alignment and relaxation",
    ],
  },
  {
    title: "Corporate Health",
    href: "/service/corporate-health/",
    about: "Corporate Health is a workplace initiative in which Farrell Physiotherapy partners with businesses to support the health and wellbeing of their employees, ranging from one-off events to year-round wellness programmes. The service is designed to reduce the risk of work-related injuries, ease absenteeism and support staff retention, while helping employees manage their own health. Farrell delivers it flexibly through onsite physiotherapy at your premises, treatment at their Chelmsford clinic, ergonomic workstation assessments and remote telephone support.",
    faqs: [
      { q: "What does a Corporate Health programme involve?", a: "It can include onsite physiotherapy at your workplace, treatment at the Chelmsford clinic for staff who cannot leave their workstations, ergonomic workstation assessments and remote telephone triage and advice. The programme is tailored to your organisation, so the physiotherapist will discuss the right combination of services with you." },
      { q: "Who is Corporate Health for?", a: "It is aimed at employers wanting to support their workforce, and at employees looking for injury prevention, faster access to treatment and wellbeing support built into their working day. It suits a wide range of workplaces, from office-based roles to more physically demanding jobs." },
      { q: "What is an ergonomic workstation assessment?", a: "This is an assessment of an employee's workstation to help maintain good posture and alignment during their tasks, with the aim of reducing the risk of work-related strain and injury. The physiotherapist will suggest practical adjustments based on what they find during the assessment." },
      { q: "How do we set up a Corporate Health service for our company?", a: "The best first step is to get in touch with Farrell Physiotherapy to discuss your organisation's needs, and they will advise on the most suitable options and how the service can be delivered. Details such as scheduling and scope are agreed with you rather than fixed in advance." },
    ],
    excerpt: "On-site and off-site corporate health programmes that reduce workplace injuries, support employee wellbeing and improve productivity.",
    intro: "Tailored workplace health initiatives that keep your team active, healthy and injury-free.",
    points: [
      "On-site and off-site physiotherapy that fits your company's schedule",
      "Workstation ergonomic assessments to prevent work-related injuries",
      "Telephone consultations and triage for convenient employee access",
      "Reduces absence, improves retention and boosts productivity",
    ],
  },
  {
    title: "Virtual Clinic",
    href: "/service/virtual-clinic/",
    about: "The Virtual Clinic lets you access assessment, diagnosis and treatment from Farrell Physiotherapy's Chartered Physiotherapists remotely, through a video call (such as Zoom) or over the telephone, when coming into the clinic isn't practical. During a session your physiotherapist can observe your posture, movement and pain, watch how you sit or walk at home, and then guide you through tailored exercises, advice and self-management techniques. It is a convenient way to get expert help for problems like neck stiffness, back pain, and knee, foot or ankle pain, and is especially useful for people working from home who have changed their workstation and routine.",
    faqs: [
      { q: "What happens during a virtual physiotherapy appointment?", a: "Your physiotherapist will talk through your symptoms and ask you to perform some simple movements on camera so they can assess your posture, movement and pain. From there they can offer a diagnosis, correct issues through exercises and advice, and give you self-management techniques to use at home." },
      { q: "Who can benefit from the Virtual Clinic?", a: "It suits people with problems such as neck stiffness, back pain from a poor workstation set-up, knee, foot and ankle pain, and exercise-related injuries. It is particularly helpful for those working from home whose posture and routine have changed, or anyone for whom getting to the clinic in person isn't practical." },
      { q: "What equipment do I need to take part?", a: "You'll need a device with a camera and internet connection for a video call, or a phone for a telephone consultation, and enough space to move around so your physiotherapist can see you clearly. If you're unsure about the set-up, get in touch and the team will be happy to help you prepare." },
      { q: "Do I need a referral, and is the service covered by insurance?", a: "You do not need a GP referral to book a virtual appointment with a Chartered Physiotherapist. Insurance cover varies between providers and policies, so we'd recommend checking directly with your insurer, and please get in touch if you have any questions." },
    ],
    excerpt: "Access diagnosis and treatment from our Chartered Physiotherapists by video or telephone, from the comfort of home.",
    intro: "Professional physiotherapy care delivered remotely when an in-person visit isn't possible.",
    points: [
      "Video and telephone consultations with qualified physiotherapists",
      "Posture assessment, movement observation and tailored exercise prescription",
      "Home-based self-management and rehabilitation programmes",
      "Ideal for work-from-home posture issues and exercise-related niggles",
    ],
  },
];

/** "Additional Treatments" group in the header dropdown / Services page. */
export const additionalTreatments: Service[] = [
  {
    title: "Ergonomic Assessments",
    href: "/service/ergonomic-work-based-assessments/",
    shortWhyImage: true,
    about: "An ergonomic or work-based assessment is a workstation review in which a physiotherapist visits your workplace or desk to assess how you sit and work, identifying conditions that could increase your risk of injury. Farrell Physiotherapy uses these assessments to examine your chair, desk, monitor, keyboard and wider environment, then recommends practical improvements alongside a bespoke exercise and rehabilitation programme. The focus is on prevention as much as treatment, helping to reduce pain, stiffness and the likelihood of injury or re-injury while creating a safer working environment.",
    faqs: [
      { q: "What does an ergonomic assessment involve?", a: "A physiotherapist assesses your workstation, looking at your chair, desk, monitor position, keyboard, document holders and overall environment to spot anything that could raise your risk of injury. They then recommend improvements and can provide a tailored exercise and rehabilitation programme to help prevent problems recurring." },
      { q: "Who would benefit from a work-based assessment?", a: "It is particularly helpful for people who sit at a desk or use a computer for long periods, as well as those whose work involves heavy lifting. It is also useful if you are already experiencing neck or back pain, poor posture or repetitive strain injuries linked to your work." },
      { q: "Is the assessment just for people who are already in pain?", a: "No, the service focuses on prevention as much as treatment, so it is valuable even if you have no current symptoms. By addressing workplace hazards early, an assessment can help prevent injury, reduce discomfort and support a safer working environment." },
      { q: "Do I need a referral, and how many sessions will I need?", a: "You do not usually need a referral to arrange an assessment, and the physiotherapist will advise on any follow-up once they have reviewed your workstation and needs. For details on availability, insurance cover or costs, please get in touch with the clinic directly." },
    ],
    excerpt: "Physiotherapist-led workstation assessments that prevent work-related injuries and reduce day-to-day occupational pain.",
    intro: "Protect your health and productivity with a professional assessment of your workplace setup.",
    points: [
      "Reduces injury and sick leave for employers",
      "Addresses neck, back and repetitive strain from prolonged desk work",
      "Reviews chair, desk, monitor, keyboard and overall workspace",
      "Pairs the assessment with an exercise programme for lasting relief",
    ],
  },
  {
    title: "Gait Analysis",
    href: "/service/gait-analysis/",
    whyExtra: {
      heading: "There Are 3 Typical Foot Positions When Walking or Running",
      items: [
        "Flat Foot: Pronated Feet",
        "Normal: Feet in Neutral",
        "High Arched Foot: Supinated Feet",
      ],
    },
    about: "Gait analysis is the assessment of how you move, where a physiotherapist observes and analyses the way you walk or run through a complete gait cycle. At Farrell Physiotherapy, this often involves recording you in motion so your movement patterns can be replayed and studied in detail, identifying any abnormalities that place excessive stress on certain structures and may be contributing to pain or dysfunction. The findings are then used to create a tailored exercise programme to correct these issues, with onward referral to an orthotist or podiatrist where appropriate.",
    faqs: [
      { q: "What does a gait analysis session involve?", a: "Your physiotherapist observes and analyses how you walk or run, often recording you in motion so they can replay and study your movement in detail. They assess your foot position and overall movement patterns to identify anything that may be causing excessive stress, pain or dysfunction." },
      { q: "Who can benefit from gait analysis?", a: "It can help anyone with a condition thought to be related to how they move or their posture, from those experiencing pain to people wanting to improve performance and prevent injury. Runners often use it to work out the right shoe support and training approach for them." },
      { q: "Does gait analysis hurt?", a: "Gait analysis itself is non-invasive and simply involves being observed or recorded as you walk or run, so it should not be painful. If any movement does provoke your symptoms, let your physiotherapist know and they will adapt the assessment accordingly." },
      { q: "What happens after my gait analysis?", a: "Following the assessment, your physiotherapist will develop a tailored exercise programme to help correct any abnormalities identified. Where appropriate, they may also refer you on to an orthotist or podiatrist, and will advise you on the best next steps for your individual needs." },
    ],
    excerpt: "Gait analysis assesses how you walk or run to pinpoint the abnormalities causing pain and to build a targeted treatment plan.",
    intro: "We observe your movement patterns to diagnose issues and improve how you move.",
    points: [
      "Identifies abnormal gait patterns affecting posture and function",
      "Guides the right footwear and training approach for performance",
      "Helps prevent injury and return you to pre-injury activity",
    ],
  },
  {
    title: "Joint Manipulation",
    href: "/service/joint-manipulation/",
    about: "Joint manipulation is a skilled, high-speed movement of a small range applied at the end of a joint's motion, performed too quickly for the patient to resist. At Farrell Physiotherapy it is used to ease stiffness, restore range of movement and reduce discomfort, and is well suited to stiff but pain-free joints or acutely locked joints such as those in the neck. It is always carried out by physiotherapists fully trained in manipulative techniques, following a thorough assessment and often alongside exercise and other treatments for lasting results.",
    faqs: [
      { q: "What does joint manipulation involve?", a: "It is a quick, controlled thrust of a small range applied at the very end of a joint's movement, which happens too fast for you to prevent. It aims to free up stiffness, improve range of motion and reduce discomfort, and is often combined with exercises for the best outcome." },
      { q: "Does joint manipulation hurt?", a: "Most people find it a brief sensation rather than a painful one, and you may notice an audible click as the joint releases. Your physiotherapist will assess you first and only proceed if it is suitable and comfortable for you." },
      { q: "Who is joint manipulation suitable for?", a: "It works well for stiff but pain-free joints that have reached the limit of gentler mobilisation, or for acutely locked joints such as those in the neck. It is not appropriate for everyone, so your physiotherapist will carry out a full assessment to check it is safe and right for you." },
      { q: "Do I need a referral to have joint manipulation?", a: "You do not usually need a referral to see a physiotherapist, though some insurers may ask for one. If you are unsure, please get in touch and the team will be happy to advise." },
    ],
    excerpt: "Joint manipulation is a quick, controlled thrust at the end of a joint's range to improve movement and reduce pain.",
    intro: "A precise, hands-on technique to restore joint movement and ease pain.",
    points: [
      "Improves joint movement and increases range of motion",
      "Helps reduce pain and nerve compression",
      "Only performed after a trained physiotherapist confirms it's suitable",
      "Often combined with exercise for the best recovery",
    ],
  },
  {
    title: "Joint Mobilisations",
    href: "/service/joint-mobilisations/",
    stepsSection: {
      heading: "Grades of Mobilisation",
      intro: "G.D. Maitland described 4 grades of mobilisation which range from a gentle movement if there is a lot of tenderness and pain. The grade intensity will increase slowly until you have normal movement again. The grade of treatment is dependent on whether stiffness or pain is the main problem as painful joints will not tolerate a high grade.",
      steps: [
        { title: "Small sized movement at the beginning of range" },
        { title: "Large sized movement within free range of movement but not moving into stiffness or resistance" },
        { title: "Large sized movement up to the end of range of movement" },
        { title: "Small sized movement at the end of range of movement" },
      ],
    },
    about: "Joint mobilisations are a hands-on physiotherapy technique that involves carefully moving a joint in a controlled way to reduce pain and improve movement. At Farrell Physiotherapy, the physiotherapist uses the Maitland grading system, selecting from gentle small movements through to firmer movements at the end of range depending on whether pain or stiffness is the main problem. It is a passive treatment, so you remain in control and can stop the movement at any time, and it is often used to help painful, stiff or degenerated joints as well as recovery after injury or surgery.",
    faqs: [
      { q: "What does a joint mobilisation session involve?", a: "The physiotherapist gently and carefully moves the affected joint in a specific direction to ease pain and improve movement. It is a passive technique using graded movements, so you stay relaxed while the physiotherapist works, and you can stop the movement at any point if you need to." },
      { q: "Does joint mobilisation hurt?", a: "It should not be a painful experience, as the physiotherapist chooses the intensity of the movement to suit your joint and avoids high-intensity techniques on a painful joint. You remain in control throughout and can ask the physiotherapist to stop or ease off at any time." },
      { q: "Who can benefit from joint mobilisations?", a: "They can help anyone with a painful or stiff joint, including degenerated joints, and are often used to support recovery after an injury or an operation. It is not suitable in certain situations, such as with fractures or bony infections, which is why an assessment is carried out first." },
      { q: "How many sessions will I need?", a: "This varies from person to person depending on your condition and how your joint responds to treatment. Your physiotherapist will assess you and advise on a suitable plan, so it is best to get in touch to discuss your individual needs." },
    ],
    excerpt: "Joint mobilisations are gentle, controlled passive movements that reduce pain and increase a joint's range of motion.",
    intro: "Controlled, graded joint movements that relieve pain and restore mobility in stiff joints.",
    points: [
      "Reduces pain and increases movement through oscillatory techniques",
      "Four graded intensities tailored to your pain and stiffness",
      "Helpful for worn joints and post-injury or post-operative recovery",
    ],
  },
  {
    title: "Manual Traction",
    href: "/service/manual-traction/",
    about: "Manual traction is a hands-on technique in which the physiotherapist uses their hands and body weight to apply a gentle pulling force that stretches or separates parts of the body, most commonly the neck or lower back. At Farrell Physiotherapy it is used to ease pain, reduce stiffness and improve range of movement, particularly where symptoms stem from disc protrusions or degenerative changes in the spine. Following a thorough assessment, it is usually combined with other treatments such as exercise and tailored to each patient's needs.",
    faqs: [
      { q: "What does manual traction involve?", a: "The physiotherapist uses their hands and body weight to apply a gentle pulling force that stretches or separates the joints of the spine, either continuously or in intervals. It is applied by hand rather than by a machine, and the direction and amount of force is guided by your assessment findings." },
      { q: "Who can manual traction help?", a: "It is often used for people with neck or lower back pain, including pain that radiates to other areas, and for symptoms linked to disc protrusions or degenerative changes in the spine. Your physiotherapist will assess you first to confirm whether manual traction is suitable for you." },
      { q: "Does manual traction hurt?", a: "The technique is applied gently and aims to relieve pain, reduce stiffness and improve movement, so it should not be painful. If you feel any discomfort, let your physiotherapist know so they can adjust the force or approach." },
      { q: "How many sessions will I need and do I need a referral?", a: "The number of sessions depends on your condition and how you respond, and manual traction is often used alongside other treatments such as exercises, so your physiotherapist will advise after assessing you. You do not usually need a referral to book, but please get in touch if you would like to check before your visit." },
    ],
    excerpt: "Manual traction is a hands-on technique that gently draws joint surfaces apart to relieve spine-related pain.",
    intro: "A safe, hands-on treatment that can ease pain and improve mobility for certain spinal conditions.",
    points: [
      "Gently separates the vertebrae and widens the spaces between them",
      "Reduces pain and stiffness and improves range of motion",
      "Helps low back and neck pain, and symptoms radiating from disc problems",
      "Combined with exercise for the best results",
    ],
  },
  {
    title: "Muscle Energy Techniques",
    href: "/service/muscle-energy-techniques/",
    about: "Muscle Energy Techniques (MET) are gentle, osteopathic methods used to evaluate and correct musculoskeletal dysfunction and asymmetry, whether these stem from gradual decompensation, trauma, or muscle tears that affect muscle length and tissue adaptability. The approach uses your own small muscle contractions, held against a light force from the physiotherapist and then relaxed, to progressively lengthen muscles, restore tone, and improve joint mobility and range of movement. At Farrell Physiotherapy, MET is applied after a thorough assessment and combined with other techniques as part of a treatment programme tailored to you.",
    faqs: [
      { q: "What does a Muscle Energy Techniques session involve?", a: "Your physiotherapist guides you through gentle, active muscle contractions, typically holding a contraction for around five seconds against a light force they apply, then relaxing so the muscle can stretch a little further each time. It is a hands-on but collaborative approach, as you take an active part in the movements throughout." },
      { q: "What conditions can Muscle Energy Techniques help with?", a: "MET can be helpful for a limited range of movement caused by neck, shoulder or back pain, sciatica, scoliosis, chronic muscle stiffness or injury, and asymmetries such as one leg being longer than the other. Your physiotherapist will assess your individual needs and advise whether MET is suitable for you." },
      { q: "Does Muscle Energy Techniques hurt?", a: "MET is a gentle technique using small, controlled contractions rather than forceful stretching, so it is generally comfortable and well tolerated. Let your physiotherapist know how you are feeling during treatment, as they will always work within your comfort and adjust accordingly." },
      { q: "How many sessions will I need and do I need a referral?", a: "The number of sessions varies depending on your condition and how you respond, so your physiotherapist will advise after assessing you. You do not usually need a referral to book, though if you are claiming through private insurance it is worth checking your policy requirements, and you are welcome to get in touch if you have any questions." },
    ],
    excerpt: "Muscle energy techniques use your own gentle muscle contractions to restore mobility and correct musculoskeletal dysfunction.",
    intro: "Gentle, guided contractions that lengthen tight muscles and improve joint movement.",
    points: [
      "Restores muscle tone and strengthens weak muscles",
      "Improves joint mobility and range of movement",
      "Helps neck, shoulder and back pain, sciatica and chronic stiffness",
    ],
  },
  {
    title: "Soft Tissue Manipulation",
    href: "/service/soft-tissue-manipulation/",
    about: "Soft tissue manipulation (also known as soft tissue mobilisation) is an umbrella term for a range of hands-on physiotherapy techniques that work with the muscles and other soft tissues, including massage, muscle energy and neuromuscular techniques, trigger point release, deep transverse friction and cupping. At Farrell Physiotherapy, these techniques are used to ease muscle tension and pain, improve circulation and movement, and encourage proper healing by helping realign collagen fibres. The team combines soft tissue work with tailored exercise programmes and injury prevention advice to help you achieve lasting relief and return to your usual activities.",
    faqs: [
      { q: "What does a soft tissue manipulation session involve?", a: "Your physiotherapist may use a combination of hands-on techniques such as massage, muscle energy and neuromuscular techniques, trigger point release, deep transverse friction or cupping, chosen to suit your needs. The specific approach is decided after an assessment of your condition and goals." },
      { q: "What kinds of problems can it help with?", a: "It can help with a wide range of musculoskeletal issues, particularly those involving muscle tightness, weakness, inflammation and pain that limit normal movement. It is also used to ease tension, improve posture and circulation, and support healing after injury; your physiotherapist will advise whether it is right for you following an assessment." },
      { q: "Does soft tissue manipulation hurt?", a: "Some techniques, such as deep friction or trigger point release, can feel firm or briefly tender, but treatment should always stay within a level you are comfortable with. Do let your physiotherapist know how you are feeling so they can adjust the pressure and approach accordingly." },
      { q: "How many sessions will I need, and do I need a referral?", a: "The number of sessions depends on your individual condition and how you respond, so your physiotherapist will discuss a plan with you after your initial assessment. You do not usually need a referral to book, though if you are claiming through private insurance it is worth checking your policy; please get in touch if you have any questions." },
    ],
    excerpt: "Soft tissue manipulation uses a range of hands-on techniques to treat musculoskeletal pain by releasing tension and improving movement.",
    intro: "Effective hands-on treatment for a wide range of muscle and soft-tissue conditions.",
    points: [
      "Includes massage, trigger-point release and deep transverse friction",
      "Eases tension, improves posture and normalises movement",
      "Boosts circulation and helps break the pain cycle",
    ],
  },
  {
    title: "Taping",
    href: "/service/taping-postural-and-sports/",
    about: "Taping, sometimes called strapping, is a hands-on technique your physiotherapist at Farrell uses both to prevent injuries and to help treat existing ones. Depending on your symptoms and goals, we apply either postural taping to correct alignment and ease stresses on the spine, or sports taping to support joints, provide sensory feedback and aid rehabilitation. The tape works by supporting muscles and joints, encouraging normal movement, relieving pressure on injured areas and reducing swelling, and where helpful we can show you how to apply it yourself between sessions.",
    faqs: [
      { q: "What does taping involve?", a: "A qualified physiotherapist assesses your symptoms and then applies tape to support the affected muscles or joint, guide normal movement and reduce strain on injured tissues. The technique used and how the tape is positioned are tailored to you, and we can teach you how to reapply it at home if that would help." },
      { q: "What conditions can taping help with?", a: "Taping is often used for ankle sprains, knee and shoulder problems, plantar fasciitis, muscle strains such as the quadriceps, groin or hamstrings, and tendonitis. Your physiotherapist will advise whether it is suitable for your particular condition after an assessment." },
      { q: "Does taping hurt?", a: "Taping itself should not be painful and is generally comfortable to wear. Let your physiotherapist know if the area feels worse or unusually tight, as taping is not recommended if symptoms worsen or if you have a tape allergy or circulatory or sensory problems." },
      { q: "How many sessions will I need?", a: "This depends on your condition and how you respond, so there is no fixed number. Taping is usually one part of a wider treatment plan, and your physiotherapist will advise on the right approach after assessing you; please get in touch if you would like to discuss your needs." },
    ],
    excerpt: "Taping supports the body's structures and improves movement — used both to prevent injury and to treat existing conditions.",
    intro: "Sports and postural taping that adds stability, reduces pain and supports recovery.",
    points: [
      "Supports joints and helps prevent injury during activity",
      "Reduces pain and swelling while encouraging good movement",
      "Lowers re-injury risk through improved proprioceptive feedback",
    ],
  },
  {
    title: "TENS",
    href: "/service/transcutaneous-electrical-nerve-stimulation-tens/",
    about: "Transcutaneous electrical nerve stimulation (TENS) is a therapeutic treatment that uses gentle electrical pulses, delivered through pads placed on the skin, to stimulate the nerves and ease muscular, joint and nerve pain. It works either by closing the \"pain gate\" so pain signals reach the brain more slowly, or by encouraging the body to release its own natural pain-relieving chemicals called endorphins. At Farrell Physiotherapy, TENS is offered as part of a wider treatment plan following an assessment, and can be used on its own or alongside other physiotherapy techniques.",
    faqs: [
      { q: "What does a TENS treatment involve?", a: "Small adhesive pads are placed on or around the affected area, and a device delivers gentle electrical pulses that you feel as a mild tingling sensation. Depending on your needs, higher pulse rates are used to help close the pain gate, while lower rates encourage the release of the body's own pain-relieving endorphins." },
      { q: "What conditions can TENS help with?", a: "TENS is commonly used to help with neck, back and knee pain, arthritis, sports injuries, period pain and chronic pain. Your physiotherapist will assess your symptoms and advise whether TENS is suitable for you." },
      { q: "Does TENS hurt?", a: "No, TENS should not be painful; most people experience only a mild tingling or buzzing sensation, and the intensity can be adjusted to a comfortable level. It is generally very safe with minimal side effects when used correctly." },
      { q: "Is TENS suitable for everyone?", a: "TENS is not recommended for people with undiagnosed pain, epilepsy, certain heart conditions, a pacemaker, or during pregnancy. It is important to be assessed by a healthcare professional first, so please get in touch and the physiotherapist will advise after your assessment." },
    ],
    excerpt: "TENS uses gentle electrical pulses to block pain signals and stimulate the body's natural pain-relieving chemicals.",
    intro: "A drug-free therapy that uses electrical stimulation to ease muscle, joint and nerve pain.",
    points: [
      "Works by closing the 'pain gate' and prompting natural pain relief",
      "Used for neck and back pain, arthritis, sports injuries and chronic pain",
      "A safe option with few side effects when assessed and used correctly",
    ],
  },
  {
    title: "Trigger Points",
    href: "/service/trigger-points/",
    about: "A trigger point is a small area of muscle contraction, often felt as a tender nodule or lump, that can cause localised pain or refer pain to other parts of the body. At Farrell Physiotherapy, trigger point release is a hands-on treatment that applies direct pressure to these tight areas to ease pain, reduce tension and restore movement. Following a thorough assessment, the physiotherapist may combine it with other techniques and a tailored exercise programme to relieve symptoms and help prevent them returning.",
    faqs: [
      { q: "What does trigger point release treatment involve?", a: "The physiotherapist applies sustained, direct pressure to the tight nodule within the muscle to help it release. It is a hands-on technique that is often combined with other treatments and followed by exercises to keep the area from tightening up again." },
      { q: "Does trigger point release hurt?", a: "The pressure can feel uncomfortable or painful to begin with, but as the trigger point releases the pain usually eases significantly or settles altogether. Your physiotherapist will work within your comfort and adjust the pressure as needed." },
      { q: "Who can benefit from trigger point therapy?", a: "It can help people experiencing pain, stiffness and discomfort caused by trigger points and myofascial pain syndrome. As causes vary from muscle overuse and mechanical overload to stress and poor sleep, your physiotherapist will assess whether it is suitable for you." },
      { q: "How many sessions will I need?", a: "This varies from person to person depending on your condition and how you respond to treatment. Your physiotherapist will advise on a suitable plan following your initial assessment, so it is best to get in touch to discuss your needs." },
    ],
    excerpt: "Trigger point release applies targeted pressure to muscle knots to relieve pain and improve flexibility.",
    intro: "Hands-on treatment that targets the muscle knots causing local or referred pain.",
    points: [
      "Applies direct pressure to release painful muscle knots",
      "Delivers relief and improved flexibility",
      "Helps myofascial pain and muscle-related stiffness",
      "Often paired with exercise to stop symptoms returning",
    ],
  },
];

/** Flat list — used by Footer.astro and the [slug].astro detail template. */
export const services: Service[] = [...therapies, ...additionalTreatments];
