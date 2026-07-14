/**
 * reviews.ts
 * ───────────────────────────────────────────────────────────────────
 * Real Google Reviews for Farrell Physiotherapy — pasted from the
 * clinic's actual Google Business profile (99 reviews, all 5-star).
 *
 * Text has been cleaned of mojibake (the source export had UTF-8
 * apostrophes/ellipses/accented characters mis-decoded as Latin-1 —
 * e.g. "Ben's" arrived as "Benâs", "…" as "â¦") — same words, just
 * displayed correctly instead of with broken characters.
 *
 * IMPORTANT — REVIEW AUTHENTICITY:
 *   Only paste in REAL reviews from your actual Google Reviews page.
 *   Fake reviews violate Google's Terms + UK ASA advertising rules.
 *   Do not invent reviews.
 *
 * AUTOMATIC PATH (optional — for users who want auto-refresh):
 *   See scripts/fetch-google-reviews.mjs + .github/workflows/refresh-reviews.yml.example.
 */

export interface Review {
  /** Reviewer's display name. */
  name: string;
  /** Star rating, 1-5. We filter to 4-5 only at the bottom of this file. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** The review text. */
  text: string;
  /** Human-readable relative time (e.g. "2 weeks ago") — always what's displayed. */
  relativeTime: string;
  /** ISO date (YYYY-MM-DD) — approximated from relativeTime, used only for
   *  sort order + JSON-LD datePublished, never shown to the visitor. */
  date: string;
  /** Source platform — fixed to 'google' here. */
  source: 'google';
}

export interface ReviewsMeta {
  /** Average star rating across all reviews. */
  averageRating: number;
  /** Total review count (real number from your Google Business profile). */
  totalReviews: number;
  /** Display string for marketing copy (e.g. "1,200+"). */
  totalReviewsDisplay: string;
  /** Source platform identifier. */
  source: 'google';
  /** Google Place ID — optional. */
  placeId?: string;
  /** Public Google Maps page URL — for "see all reviews" link. */
  mapsUrl?: string;
}

/**
 * Fixed reference date for approximating ISO dates from Google's
 * relative-time strings ("a month ago" etc.) — anchored to a constant
 * rather than build time, so review sort order doesn't silently shift
 * on every rebuild.
 */
const REFERENCE_DATE = new Date('2026-07-08T00:00:00Z');

/**
 * Approximates an ISO date from a Google-style relative time string.
 * Only used for carousel sort order + JSON-LD datePublished — the UI
 * always displays the original `relativeTime` string verbatim, never
 * this computed date, so an approximation is honest and sufficient.
 */
function approximateDate(relativeTime: string): string {
  const cleaned = relativeTime.replace(/^Edited\s+/i, '').trim().toLowerCase();
  const match = cleaned.match(/^(a|an|\d+)\s+(day|week|month|year)s?\s+ago$/);
  if (!match) return REFERENCE_DATE.toISOString().slice(0, 10);

  const amount = /^(a|an)$/.test(match[1]) ? 1 : parseInt(match[1], 10);
  const date = new Date(REFERENCE_DATE);
  switch (match[2]) {
    case 'day':   date.setUTCDate(date.getUTCDate() - amount); break;
    case 'week':  date.setUTCDate(date.getUTCDate() - amount * 7); break;
    case 'month': date.setUTCMonth(date.getUTCMonth() - amount); break;
    case 'year':  date.setUTCFullYear(date.getUTCFullYear() - amount); break;
  }
  return date.toISOString().slice(0, 10);
}

type RawReview = Pick<Review, 'name' | 'rating' | 'text' | 'relativeTime'>;

const rawReviews: RawReview[] = [
  { name: 'Victoria Sisson', rating: 5, relativeTime: 'a month ago', text: "Ben at Farrell Physiotherapy has been fantastic in relieving a longstanding neck and shoulder problem that other physios had not been able to improve at all. I can absolutely recommend Ben and Farrell Physiotherapy as an outstanding physio." },
  { name: 'Mark Jeffery', rating: 5, relativeTime: '8 months ago', text: "Ben is an experienced physiotherapist and has really helped my back pain. He treats the cause and not necessarily the symptoms and he provides good advice on exercises and activities that a patient should repeat between sessions to ensure …" },
  { name: 'Anne Possamai', rating: 5, relativeTime: '6 months ago', text: "Having been referred to Ben's Practice following back surgery, my expectations and outlook were not positive….it is a testament to Ben's very evident physio therapeutic skill but also his relentless optimistic drive that counted so much during my recovery. First class, highly recommended.\nPaul Possamai" },
  { name: 'Matthew Brown', rating: 5, relativeTime: 'a year ago', text: "Ben is top class.  He puts you at ease and has great empathy with all of his clients.  My rotator cuff situation is 95% better than it was several months ago, and Ben has encouraged me to achieve the remaining 5% with a series of exercises …" },
  { name: 'sarah lisamer', rating: 5, relativeTime: '2 years ago', text: "Ben Farrell was recommended to me by a family member because I had been suffering with chronic back pain for over 18 months.\nThe pain was affecting my every day activities: walking any distance caused me …" },
  { name: 'Elaine', rating: 5, relativeTime: '2 years ago', text: "I have been treated by Ben for 2 different ankle problems over the last 18 months with great success. …" },
  { name: 'Matthew Swann', rating: 5, relativeTime: 'a year ago', text: "When I was first referred to Ben, my knee and back pain had left me stooped and walking like an old man (I'm 54). At the end of the program I am walking normally and the pain has gone. …" },
  { name: 'Libby Ward', rating: 5, relativeTime: '3 years ago', text: "Ben is nothing short of a godsend! I've been to physiotherapists in the past and haven't had any resolution to my issues but even after my first appointment with Ben I noticed a positive change. After a short amount of sessions I am now …" },
  { name: 'Geoff', rating: 5, relativeTime: '10 months ago', text: "Ben is a professional, knowledgeable and kept me running despite a fair few injury challenges - I'm very happy to recommend him." },
  { name: 'Tim Harvey', rating: 5, relativeTime: 'a year ago', text: "From start to finish of my course of treatment, Ben has been fantastic. The advice and direction has been amazing and resulted in my ailments becoming a thing of the past and allowing me to return to normal activities, without pain!\nThe facilities are great and the content of advice brilliant." },
  { name: 'Trev1uk', rating: 5, relativeTime: 'Edited 3 years ago', text: "I had sciatica for about 6 months and initially couldn't stand, sit or lay down for longer than 10 minutes without intense pain.  I've had sciatica in the past but never as bad.  I've seen Ben each week and now I can do things I couldn't …" },
  { name: 'Matt Hajdar', rating: 5, relativeTime: '5 years ago', text: "I contacted Farrell Physiotherapy in mid December 2020 after having treatment on my back since August 2020 by another local physio, that was not really improving. It was clear to me from the start that Ben was a lot more thorough and had …" },
  { name: 'Liam Chong', rating: 5, relativeTime: '9 years ago', text: "I have been seeing Ben as my physiotherapist since I was 15 years old. Since then, I have suffered many injuries as an athlete. Two of which could have ended my playing career. …" },
  { name: 'Karen Brangham', rating: 5, relativeTime: '6 years ago', text: "I went to Ben regarding knee pain as a result of running. It very quickly became clear to him that I didn't actually have a knee problem, but rather a back problem which referred pain to my knee. Alongside hands on manipulation of my back, …" },
  { name: 'William Aley', rating: 5, relativeTime: '3 years ago', text: "Following a total knee replacement in March 2022, I have been seeing Ben to help with my recovery. Ben is an excellent physio and his assistance has been invaluable. I am delighted with the range of movement that I have been able to achieve with Ben's help. I would not hesitate to recommend his services." },
  { name: 'Marion Knott', rating: 5, relativeTime: '4 years ago', text: "After straining my wrist riding a motorbike two months ago and with no sign of any improvement I booked to see Ben. After one visit I had much more mobility and much less pain. It felt like a miracle! I could lift the kettle and turn my …" },
  { name: 'Aleasha Marie', rating: 5, relativeTime: '8 years ago', text: "I've been treated by Ben for a number of years and have always felt very comfortable and at ease. Ben has helped improve my sporting performance and awareness of my body, which has kept me healthy and fit. From back issues, muscular and sporting problems I couldn't recommend Farrell Physio more." },
  { name: 'Judy Woosnam', rating: 5, relativeTime: '7 years ago', text: "I have recently completed a course of treatment with Ben Farrell and am pleased to highly recommend him to others.\nI went to see Ben when I was suffering with extreme pain due to a trapped nerve …" },
  { name: 'Graeme E', rating: 5, relativeTime: '5 years ago', text: "Ben Farrell is an excellent Physiotherapist and has helped me recover strongly from a procedure to address my back and sciatic issues. He takes great care to understand exactly how and what you are feeling and sets achievable and relevant exercise regimes. I would have no hesitation in going back to see him if the need ever arises." },
  { name: 'Gemma Thomson', rating: 5, relativeTime: '5 years ago', text: "Cannot recommend Ben enough. Started treatment in August 2020 for an old knee injury that had begun to play up and and was affecting my other knee as well. Ben was able to diagnose the issue in my first session, started treatment straight …" },
  { name: 'Jason Iontton', rating: 5, relativeTime: '8 years ago', text: "I started seeing Ben after being involved in a car accident. I was blown away with his compassion and his knowledge. I've seen far too many people who don't truly care about results and improvement, but with Ben it is completely different. …" },
  { name: 'Ross Collier', rating: 5, relativeTime: '6 years ago', text: "I decided to try Ben after reading great reviews on Facebook. I had dislocated my thumb about 8 months prior to seeing Ben and it was giving me pain in my daily routine. I am a electrician/musician and so I was never able to rest my thumb …" },
  { name: 'MARK ROSS', rating: 5, relativeTime: 'a year ago', text: "I have been seen Ben for over a number of years with different problems. I've now been signed off from Ben and I feel so much better. The treatment I've received and ongoing advice has been faultless …" },
  { name: 'Charlotte Tew', rating: 5, relativeTime: '4 years ago', text: "A friend recommended Ben on the back of a bad rotator cuff injury I recieved after a fall. I am so pleased I didn't leave it too long before booking in to see him. He was brilliant and although it has taken time and commitment to do the …" },
  { name: 'David Stone', rating: 5, relativeTime: '5 years ago', text: "I had a total knee replacement at the end of September. \"In these unprecedented times\" the NHS provided no physiotherapy follow-up other than the offer of telephone consultations. I developed severe back pain and sciatica after about a …" },
  { name: 'Rick Griffith', rating: 5, relativeTime: 'Edited 3 years ago', text: "My shoulder had been causing me pain while playing tennis and also sleeping.  Treatment has taken longer than my previous visits to Ben but I am a bit older and my shoulders have taken a lot of punishment after a lifetime of sport. …" },
  { name: 'Ivan Newman', rating: 5, relativeTime: '8 years ago', text: "After many years of chronic back pain, many courses of massage and starting to look like a 'wizened old man' I saw Ben.  He quickly diagnosed the problem and gave me a series of daily stretches and exercises.  Within just a few days the …" },
  { name: 'Sharon Bright', rating: 5, relativeTime: '7 years ago', text: "I was recommended Ben by a friend and thank goodness! I had neck and upper back issues with pins and needles down my right arm and numbness in my thumb and next two fingers. Ben explained everything so well and made it easy for me to …" },
  { name: 'Rhafi Ahmed', rating: 5, relativeTime: '6 years ago', text: "Thank you Liam,\n\nWas introduced to this practice by my insurers after a road traffic accident …" },
  { name: 'Chris Scrivner', rating: 5, relativeTime: '4 years ago', text: "Prior to having a hip replacement I was recommended Ben Farrell as the physiotherapist I must see. Having now seen Ben I can understand why, Ben is professional, extremely knowledgeable but also a great communicator, he explains the why as …" },
  { name: 'Dean V', rating: 5, relativeTime: '2 years ago', text: "Ben is very personable and his assessment techniques are constant, checking for incremental improvements and triggers to ensure he is hitting the right spot. His treatment has really helped deal with long standing and very painful back and nerve issues in just a few weeks." },
  { name: 'Melvin Middleton', rating: 5, relativeTime: '6 years ago', text: "For 2 months nearly I couldn't walk further than the kitchen because of excruciating knee pain and seeing that I was about to start my new job I was stressing so much about my situation. I saw Ben and after only 3 visits I am practically …" },
  { name: 'Mike Smith', rating: 5, relativeTime: '8 years ago', text: "Before visiting Ben I had been suffering from pain in my achillies tendons, which had stopped me from running my first half marathon. I had previously visited other physios local to me but had made no improvement. On my first visit ,Ben …" },
  { name: 'Ian Marshall', rating: 5, relativeTime: '4 years ago', text: "My whole experience has been very positive.  Ben is pragmatic, honest and realistic in his approach.  As a result, progress can be clearly measured over a series of appointments - and this, together with following Ben's recommendations for exercises in between appointments - has produced excellent  results." },
  { name: 'Terry Clark', rating: 5, relativeTime: '8 years ago', text: "I went to Ben after I suddenly developed a pain in my knee during running.  Ben instantly put me at ease and diagnosed what was causing the problem.  He is extremely knowledgeable and explained what I needed to do to get back on track, Ben …" },
  { name: 'Rob Thorpe', rating: 5, relativeTime: '7 years ago', text: "My thanks to Ben for his treatment following a trapped nerve in my neck and an arm that would not straighten resulting from this. Ben is knowledgeable, approachable and has 'repaired me' on more than one occasion! In addition, he is the …" },
  { name: 'Nick McAuliffe', rating: 5, relativeTime: '6 years ago', text: "My wife and son had both used Ben Farrell in the past so I knew he'd treated them successfully before going myself.  After a few months of treatment and following Ben's guidance my back is dramatically improved to the point where I am now …" },
  { name: 'Claire Johnson', rating: 5, relativeTime: '3 years ago', text: "After experiencing awful neck pain for months, and unsuccessful treatment by another local physio, I decided to book in with Ben. He is highly experienced and knowledgeable, and within 3 months of treating me, my problem has resolved. I'm extremely grateful to Ben and will be recommending him to others." },
  { name: 'Connor Orchard', rating: 5, relativeTime: '7 years ago', text: "Ben is a great guy and an excellent physio, he's honest and genuinely cares about making you better. Was recommended to me by a member of my family who sung his praises after his bad shoulder injury saw massive improvement, and I would have …" },
  { name: 'Ross Wallman', rating: 5, relativeTime: '8 years ago', text: "I have been really pleased with the level of care that Ben at Farrell Physiotherapy has provided. The work he has done has greatly improved a long lasting back problem I have. …" },
  { name: 'Sean Marten', rating: 5, relativeTime: '8 years ago', text: "I am regular runner and Ive been going to Farrell Physiotherapy since 2011 for different types of treatment. From thigh pain, back pain and neck pain and treatment during my marathon training. Ben and his team have provided a friendly, …" },
  { name: 'Chris Roberts', rating: 5, relativeTime: '8 years ago', text: "Ben has helped me gain back my mobility. He is very knowledgeable in his field. He assessed the cause of my knee problem and has helped me to be more mobile again. He is passionate about his work. I would not hesitate to recommend him to anyone." },
  { name: 'Cheryl Baker', rating: 5, relativeTime: '5 years ago', text: "I have been having trouble with a pain in my leg for nearly 2 years, I've been to the docs and they told me that it was healing, but 20 months later still getting pain. I booked to see Ben, not only did he find the problem which was in my …" },
  { name: 'marie Kinchin', rating: 5, relativeTime: '3 years ago', text: "Ben was a connection on Facebook and had seen my journey with my knee replacement. I have suffered with my lower back for some years so after Ben kindly reached out to me and offered some advice I decided to give him a try.. Very glad I did …" },
  { name: 'Michael Halverson', rating: 5, relativeTime: '6 years ago', text: "Ben has worked wonders on my lower back and hip problem over the last few months, always explains what is happening and what needs to doing to help the healing process. Always happy to work around my work commitments and will happily accommodate you. Highly recommended" },
  { name: 'himynameistash', rating: 5, relativeTime: '9 years ago', text: "I received treatment for my calf muscle which lasted approximately 4 months from Farrell Physiotherapy. I am also currently receiving treatment for a bad shoulder.  The physio's are very thorough in their treatment from explaining what the …" },
  { name: 'Katy Southgate', rating: 5, relativeTime: '9 years ago', text: "I have been to Farrell Physiotherapy for the last five months for a back injury. I was quickly diagnosed, assesed and treated.  I have always been able to get appointments before work which has been extremely convenient and contact Ben with …" },
  { name: 'Jordan Stace', rating: 5, relativeTime: '7 years ago', text: "After injuring my back whilst lifting at the gym I got recommended to Ben. I am so glad this was the case Ben diagnosed my issue really quick and got me from being in hunched over in constant pain to back to my normal posture and back in the gym quicker than I could have hoped! Highly recommend Farrell Physiotherapy" },
  { name: 'Benoit Nakimovitch', rating: 5, relativeTime: '6 years ago', text: "Great physio, I would 100% recommend!\nI used the practice for a calf injury and then a shoulder problem. Both times Ben put me back in shape, focusing on long terms gain and sharing his knowledge to help me avoid the same injuries coming back again and again." },
  { name: 'Claire Hamlin', rating: 5, relativeTime: '7 years ago', text: "I went to Farrell Physio with a shoulder problem. Booking was straightforward. During the course of treatment, Ben not only got my shoulder back to normal, but also improved my overall posture and gave advice to improve my gym work to help prevent future problems. Highly recommended." },
  { name: 'Jane and Ian Kingham', rating: 5, relativeTime: 'a year ago', text: "My care was excellent. It was great knowing that my progress was in line with a post operative knee replacement. Good attention to detail as well as lots of encouragement.  Thank you" },
  { name: 'Bradley Plowman', rating: 5, relativeTime: '2 years ago', text: "Following a procedure with a consultant was introduced to Ben for follow up physio. Solved intense pain caused by posture and slipped discs . Now pain free and Ben taught me how to manage going forward through stretches and exercises. Highly Recommend!!" },
  { name: 'clare jarred', rating: 5, relativeTime: '2 years ago', text: "I would rate the service at Farrell Physio as First Class. Ben was as determined as I was to see results. He explained everything extremely clearly, and I finished my sessions with a determination to continue with all the tips/advice he gave me." },
  { name: 'helen gilheany', rating: 5, relativeTime: '4 years ago', text: "I have complete trust in Ben's ability to put right any problems I have with my back.  Even though I have now left the area, I shall return to seek help from Ben when needed.  He is a complete professional who has an excellent knowledge of his subject, and he is always friendly and helpful." },
  { name: 'Paul Spraggon', rating: 5, relativeTime: '8 years ago', text: "I have had a back problem for years and spent lots of money on various forms of treatment. None made much difference.  Then I went to see Ben, and now 6 months later I feel so much better.  I am out of pain, and able to do so much more. …" },
  { name: 'Ian Muir', rating: 5, relativeTime: '4 years ago', text: "Ben is a fantastic 'hands on' physio who will always give you straightforward honest advice about how to get back to full fitness. Been seeing him on and off (when i am injured!) for over 6 years." },
  { name: 'Kane Ross', rating: 5, relativeTime: '3 years ago', text: "Just completed treatment with Ben on a reoccurring calf injury. He not only works with the injury itself but on identifying the underlying cause. I have seen other physiotherapists in the past and have never been that impressed but would definitely recommend Farrell Physiotherapy." },
  { name: 'Andrew Gaynham', rating: 5, relativeTime: '7 years ago', text: "Went to Ben on recommendation with a shoulder/neck problem. I cannot fault treatment, everything resolved after only three visits. Excellent advice and exercises given. Would not hesitate to return, and highly recommend." },
  { name: 'Tina Cannon', rating: 5, relativeTime: '4 years ago', text: "Ben is an excellent physio. We have all seen him at various times for back, knee and big toe injuries! He is very knowledgeable and gives honest assessments of what is needed to help the injury." },
  { name: 'Ella Few', rating: 5, relativeTime: '10 months ago', text: "I had physio through insurance,  megan was very good and friendly. My back is back to how it was :) thanks so much x" },
  { name: 'Mary Welham', rating: 5, relativeTime: 'a year ago', text: "I found Ben extremely knowledgeable, professional and he got me back on the road to recovery in a very professional friendly manner. I will certainly have no hesitation in recommending Ben." },
  { name: 'Kerry Townsend', rating: 5, relativeTime: '3 years ago', text: "Very happy with my appointment.  Bradley was thorough and informative and I left knowing exactly what my issue was and how to manage and improve my symptoms.  The follow up email, with videos explaining the exercises was invaluable and, everything is feeling better already." },
  { name: 'Claire Ralls', rating: 5, relativeTime: '6 years ago', text: "Went to see Ben as my son had a sports injury, made to feel very welcome and relaxed. Such a friendly environment, and explained everything as went along with the treatment. Cannot recommend Ben enough. X" },
  { name: 'Spencer Buck', rating: 5, relativeTime: '3 years ago', text: "Had terrible back problems for 6 months, Ben worked with me treating the injury in his clinic and set me exercises to suit my work life routine. Feel better than ever, cant thank him enough!" },
  { name: 'Melissa Pearmain', rating: 5, relativeTime: 'a year ago', text: "Ben was very patient and helpful with my treatment for a very sore non weight bearing foot." },
  { name: 'Lallie Godfrey', rating: 5, relativeTime: 'a year ago', text: "Megan really listen carefully to the issue and then considered the best way forward at the end of the session. The end result is that I am now put of pain which is wonderful.  Thank you." },
  { name: 'Janice Alexander', rating: 5, relativeTime: '5 years ago', text: "I had an issue with my fingers on both hands after discussing with Ben the root cause of this was treated, which was my upper back and shoulders. Everything was clearly communicated and exercises given  plus postural advice to prevent any reoccurrence. Thank you." },
  { name: 'John Robinson', rating: 5, relativeTime: 'Edited a year ago', text: "Following surgery on my quadricep I had severe pain in my knee, Ben Farrell successfully worked on my knee cap and structured a better walking posture that has enabled me to continue playing golf and cure the pain from my knee,\nThank you very much Ben" },
  { name: 'Dean Lawrence', rating: 5, relativeTime: '5 years ago', text: "I was involved in an accident and suffered severe whiplash, I was put in touch with this company for my physio, and I must say they was very helpful, and were very nice people that looked after me. The Physio treatment was very good and my …" },
  { name: 'Paul Richardson', rating: 5, relativeTime: 'a year ago', text: "First class Physio diagnosed quickly the problem and also the probable reason for the injury. After 4 sessions and some advice I am now pain free and have full movement back." },
  { name: 'Adrian Owers', rating: 5, relativeTime: '3 years ago', text: "Ben helped me recover from a hamstring injury. Very professional in his approach & would definitely refer him to my friends & family." },
  { name: 'Francisco Fernández', rating: 5, relativeTime: '5 years ago', text: "I could barely move my neck the first time Ben saw me. Three sessions later my neck was back to normal. Very professional, excellent experience overall" },
  { name: 'Talos Dazzler', rating: 5, relativeTime: '9 years ago', text: "Straight talking physio who provides a personal and totally taylored service that fits your injury and needs. From smaller pains or helping you recover from broken bones this is the best money you can spend on getting better. Cannot recommend enough." },
  { name: 'Helen Crozier', rating: 5, relativeTime: '5 years ago', text: "Brilliant physio had at Farrells , Ben is friendly and helped my pain straight away.  Marvelous treatment. Would recommend too all." },
  { name: 'Sean Burling', rating: 5, relativeTime: '6 years ago', text: "I have seen 2 physios from Ben Farrell practice and I couldn't rate either highly enough. Their general understanding of my issues, communication and general care was superb, and obviously helped me through my issues. Thank you!!" },
  { name: 'Helen Simpson', rating: 5, relativeTime: 'Edited a year ago', text: "I have had Physio at Farrell Physiotherapy for my back and knee, absolutely would recommend all feeling great now." },
  { name: 'steve rudgley', rating: 5, relativeTime: '4 years ago', text: "Liam at Farrell was very professional with physio combined with gentle exercise to counter the results of a car accident. Would recommend them everytime." },
  { name: 'Rosie Hurrell', rating: 5, relativeTime: '8 years ago', text: "Very happy with the treatment I got at Farrell Physiotherapy. Booking process was simple and Ben gave great advice. Would definitely recommend!" },
  { name: 'Nick Moore', rating: 5, relativeTime: '6 years ago', text: "Absolutely amazing Physio, treated the cause, rather than the effect of my back problem. Has allowed me to avoid surgery and now lead an active lifestyle again." },
  { name: 'Dan Fazal', rating: 5, relativeTime: '4 years ago', text: "Ben was absolutely brilliant throughout my recovery process, could not recommend him any higher." },
  { name: 'C', rating: 5, relativeTime: 'Edited 4 years ago', text: "Extremely happy with the service. Straight talking, excellent advice and helped cure me of knee and back and problems.\nNow been discharged with all aches and pains gone!" },
  { name: 'Diana Alexander', rating: 5, relativeTime: '3 years ago', text: "Mark the physiotherapist was brilliant. He was so knowledgeable and professional and kind and helpful.  I am so glad we were able to see him." },
  { name: 'kiethee', rating: 5, relativeTime: '4 years ago', text: "Over the past twelve months I have been very happy with the treatment and advice given by Ben and would recommend him to anyone with any kind of back issue" },
  { name: 'Charles Turner', rating: 5, relativeTime: '3 years ago', text: "Excellent service from Ben. Really professional, discrete and knowlegable physiotherapist. I have no hesitation in recommending him to others." },
  { name: 'Nicole Hill-burton', rating: 5, relativeTime: '3 years ago', text: "Ben was amazing. So nice always asking how your pain. Always recommended thing that might help at home aswell" },
  { name: 'Graeme Harvey', rating: 5, relativeTime: '10 months ago', text: "Excellent.  Spotted my issue immediately  and sensibly set about sorting it out." },
  { name: 'Maggie grice', rating: 5, relativeTime: '3 years ago', text: "First class service, I highly recommend this practice.  Ben is thorough, very approachable and skilled." },
  { name: 'Chris Bray', rating: 5, relativeTime: '8 years ago', text: "Ben is a top class physio and a great communicator. I would recommend him highly." },
  { name: 'Grant Smith', rating: 5, relativeTime: '3 years ago', text: "Ben always guides you to how you can help yourself and stay pain free. Would unreservedly recommend his services" },
  { name: 'Ray Adams', rating: 5, relativeTime: 'a year ago', text: "Excellent treatment from Ben and a good improvement in condition" },
  { name: 'Gogoașe Alexandru-Cătălin', rating: 5, relativeTime: '5 years ago', text: "I was very happy with Dr Ben who was very carreful on treatment and he paid attention!" },
  { name: 'Ian Watson', rating: 5, relativeTime: '6 years ago', text: "I went for a shoulder muscle pain and Ben cured it within 6 sessions" },
  { name: 'William Ruel', rating: 5, relativeTime: '6 years ago', text: "Would definitely recommend this physiotherapy, very happy with the service provided very friendly and helpful." },
  { name: 'Riverside Leisure Centre Chelmsford', rating: 5, relativeTime: '8 years ago', text: "Highly recommend always my first point of call for sporting injuries and back complaints" },
  { name: 'All Weather Access Ltd', rating: 5, relativeTime: 'Edited a year ago', text: "Extremely professional and thorough Physiotherapy.\nWould recommend to anybody." },
  { name: 'norman buckingham', rating: 5, relativeTime: '3 years ago', text: "A professional operation competitively priced\nWith a personal touch" },
  { name: 'zakaria elshehawy', rating: 5, relativeTime: 'a year ago', text: "Great service and communication …" },
  { name: 'Nicki Andrew', rating: 5, relativeTime: '3 weeks ago', text: "I have recently attended Ben Farrell's clinic with a shoulder and neck issue.  This isn't the first time I have received treatment from Ben and as usual, his ability to treat the issues I have had in a knowledgable, professional and …" },
  { name: 'Daniel Ireton', rating: 5, relativeTime: '3 months ago', text: "This time round, Ben has been helping navigate and remedy a rotator cuff injury. A sterling and comprehensive service provided - getting into the reeds of the injury, helping with mitigation and preparing for (strengthening) long term …" },
];

const reviewsRaw: Review[] = rawReviews.map((r) => ({
  ...r,
  date:   approximateDate(r.relativeTime),
  source: 'google' as const,
}));

/**
 * Aggregate trust metadata. Update these when your business stats change.
 * (The automatic fetch script overrides these from Google's response.)
 * totalReviews reflects the real count of reviews on file above — not a
 * marketing-rounded figure — since that's a number we can actually verify.
 */
const fallbackMeta: ReviewsMeta = {
  averageRating:        5.0,
  totalReviews:         rawReviews.length,
  totalReviewsDisplay:  `${rawReviews.length}`,
  source:               'google',
  // TODO: set to Farrell Physiotherapy's real Google Maps/reviews URL — the
  // previous value pointed to HMDG's listing. Empty = "See All Reviews on
  // Google" CTA is hidden (guarded in ReviewsSection.astro).
  mapsUrl:              '',
};

/**
 * Get initials from a full name.
 * "Sarah Mitchell" → "SM" · "James Thompson" → "JT" · "Helen" → "H"
 */
export const getInitials = (name: string): string => {
  return name
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

/**
 * Optional: live cache from `npm run reviews:fetch`.
 * If reviews-cache.json exists, it overrides reviewsRaw + fallbackMeta.
 */
type CacheShape = { meta: ReviewsMeta; reviews: Review[] };
const cacheModules = import.meta.glob<CacheShape>('./reviews-cache.json', {
  eager: true,
  import: 'default',
});
const cached: CacheShape | undefined = Object.values(cacheModules)[0];

const sourceReviews: Review[] = cached?.reviews ?? reviewsRaw;
const sourceMeta:    ReviewsMeta = cached?.meta ?? fallbackMeta;

/**
 * Display logic — applied to whichever source is in use:
 *   1. Filter to 4-5 star reviews only (drop low-rating noise)
 *   2. Sort by date descending (newest first)
 *   3. Cap at 20 reviews maximum (carousel still scrolls cleanly)
 *
 * Note: Google's Places API returns max 5 reviews per call. To populate
 * the full 20, mix automatic fetch (5 fresh) + manual paste (up to 15).
 * The de-dupe + sort handles either source consistently.
 */
const MAX_REVIEWS = 20;
const MIN_RATING  = 4;

export const reviews: Review[] = sourceReviews
  .filter(r => r.rating >= MIN_RATING)
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  .slice(0, MAX_REVIEWS);

export const reviewsMeta: ReviewsMeta = sourceMeta;
