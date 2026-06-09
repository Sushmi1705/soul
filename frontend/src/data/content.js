// Mock content scraped/adapted from gitikasharma.in

export const BRAND = {
  name: "AstroPower 24",
  tagline: "Decoding Karma, Aligning Destiny",
  author: "Gitika Sharma",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { 
    label: "Astro Solutions", 
    href: "#", 
    subLinks: [
      { label: "Health Solutions", href: "/astro-solutions/health-solutions" },
      { label: "Property Problem", href: "/astro-solutions/property-problem" },
      { label: "Business Growth", href: "/astro-solutions/business-growth" },
      { label: "Professional Growth", href: "/astro-solutions/professional-growth" },
      { label: "Education & Career", href: "/astro-solutions/education-career" },
      { label: "Stress & Depression", href: "/astro-solutions/stress-depression" },
      { label: "Litigation Conciliation", href: "/astro-solutions/litigation-conciliation" },
      { label: "Marriage & Relationship", href: "/astro-solutions/marriage-relationship" },
      { label: "Parent Child Relationship", href: "/astro-solutions/parent-child-relationship" },
    ]
  },
  { 
    label: "Services", 
    href: "#",
    subLinks: [
      { label: "Soul Purpose", href: "/services/soul-purpose" },
      { label: "Match Making", href: "/services/match-making" },
      { label: "Kundali Making", href: "/services/kundali-making" },
      { label: "Kundali Analysis", href: "/services/kundali-analysis" },
      { label: "Vastu Consultation", href: "/services/vastu-consultation" },
      { label: "Numerology Analysis", href: "/services/numerology-analysis" },
      { label: "Business Name & Logo", href: "/services/business-name-logo" }
    ]
  },
  { 
    label: "Our Courses", 
    href: "/#courses",
    subLinks: [
      { label: "Palmistry", href: "/courses/palmistry" },
      { label: "Vedic Astrology", href: "/courses/vedic-astrology" },
      { label: "Akashic Records", href: "/courses/akashic-records" },
      { label: "Lal Kitab Astrology", href: "/courses/lal-kitab-astrology" },
      { label: "Bhrigu Nandi Nadi", href: "/courses/bhrigu-nandi-nadi" },
      { label: "Vastu Consultation", href: "/courses/vastu-shastra-course" },
      { label: "Numerology Analysis", href: "/courses/numerology-course" }
    ]
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const SERVICES = [
  {
    id: "kundali-analysis",
    title: "Kundali Analysis",
    desc: "We combine time-honored techniques with contemporary insights to provide you with personalized interpretations and actionable guidance.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/1-3.png",
    duration: "60 min",
    price: 2499,
  },
  {
    id: "kundali-making",
    title: "Kundali Making",
    desc: "We meticulously craft your personalized birth chart, offering profound insights into the unique cosmic influences shaping your journey.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/2-3.png",
    duration: "45 min",
    price: 1999,
  },
  {
    id: "match-making",
    title: "Match Making",
    desc: "Discover the magic of cosmic connection, embark on a journey of discovery, and let the stars align your path to enduring love.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/3-2.png",
    duration: "75 min",
    price: 3499,
  },
  {
    id: "numerology-analysis",
    title: "Numerology Analysis",
    desc: "Unveil the mysteries of your destiny and embark on a transformative journey of self-discovery through the wisdom of numbers.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/4-2.png",
    duration: "60 min",
    price: 2199,
  },
  {
    id: "vastu-consultation",
    title: "Vastu Consultation",
    desc: "Create a balanced environment for your home or workspace with insightful recommendations tailored to your specific needs.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/5-2.png",
    duration: "90 min",
    price: 4999,
  },
  {
    id: "soul-purpose",
    title: "Soul Purpose",
    desc: "Honor the whispers of your soul and embark on a quest to live a life of purpose, passion, and authenticity.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/6-4.png",
    duration: "60 min",
    price: 2999,
  },
];

export const COURSES = [
  {
    id: "akashic-records",
    title: "Akashic Records",
    category: "Certification Course",
    price: 15999,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/7-5.png",
  },
  {
    id: "bhrigu-nandi-nadi",
    title: "Bhrigu Nandi Nadi",
    category: "Advanced Course",
    price: 27999,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/2-7.png",
  },
  {
    id: "lal-kitab-astrology",
    title: "Lal Kitab Astrology",
    category: "Master Program",
    price: 27999,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/5-5.png",
  },
  {
    id: "numerology-course",
    title: "Numerology",
    category: "Foundation Course",
    price: 9240,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/3-5.png",
  },
  {
    id: "palmistry",
    title: "Palmistry",
    category: "Foundation Course",
    price: 9240,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/4-5.png",
  },
  {
    id: "vastu-shastra-course",
    title: "Vastu Shastra Course",
    category: "Master Program",
    price: 27999,
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/6-7.png",
  },
  {
    id: "vedic-astrology",
    title: "Vedic Astrology",
    category: "Services",
    price: 27999,
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/1-2.png",
  }
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

// Simulate some slots being unavailable based on date
export const getAvailableSlots = (date) => {
  if (!date) return [];
  const day = date.getDay();
  // Sunday → limited
  if (day === 0) return ["10:30 AM", "12:00 PM", "02:00 PM"];
  // Saturday → mostly full
  if (day === 6) return ["09:00 AM", "03:30 PM", "06:30 PM"];
  // Busy weekday pattern — skip one slot depending on date
  const skipIndex = date.getDate() % TIME_SLOTS.length;
  return TIME_SLOTS.filter((_, i) => i !== skipIndex);
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ananya R.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/3-6-150x150.png",
    quote:
      "Soul Karma is a sanctuary for the soul. Gitika's teachings have helped me find clarity and purpose in my life journey.",
  },
  {
    id: 2,
    name: "Rohan M.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/4-8-150x150.png",
    quote:
      "Grateful for the wisdom and warmth at Soul Karma. Gitika's gentle guidance has helped me navigate life's challenges with grace.",
  },
  {
    id: 3,
    name: "Meera K.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/5-6-150x150.png",
    quote:
      "A true gem in the realm of spirituality. Soul Karma's teachings have empowered me to live authentically and embrace my true self.",
  },
  {
    id: 4,
    name: "Priya S.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/1-8-150x150.png",
    quote:
      "Soul Karma by Gitika Sharma offers a transformative experience. Highly recommend for anyone seeking spiritual growth and inner peace.",
  },
  {
    id: 5,
    name: "Ishaan D.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/03/2-9-150x150.png",
    quote:
      "An oasis of calm and wisdom! Gitika's insights and guidance have been life-changing. Thank you, Soul Karma!",
  },
];

export const JOURNAL = [];

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(n);

export const ASTRO_SOLUTIONS_DATA = {
  "health-solutions": {
    title: "Health Solutions",
    subtitle: "Find Vitality And Balance With Cosmic Healing",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80", // Yoga/Health
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Health Solution Service, where we integrate the ancient wisdom of astrology with modern health solutions to support your journey towards vibrant health and well-being.",
      { heading: "Astrological Health Analysis", text: "Astrology offers profound insights into your physical constitution, susceptibility to health issues, and potential remedies for maintaining optimal health. Our astrologers conduct detailed health analyses, examining the planetary influences in your birth chart to identify potential health risks and vulnerabilities. With this knowledge, you can take proactive measures to safeguard your health and enhance your well-being." },
      { heading: "Planetary Remedies for Healing", text: "In addition to providing insights into your health profile, we offer planetary remedies to promote healing and restore balance to your mind, body, and spirit. From specific rituals and mantras to gemstone recommendations and dietary adjustments, our remedies are tailored to address your unique health concerns and support your holistic wellness journey." },
      { heading: "Astro-Yoga and Holistic Healing Practices", text: "Combining the principles of astrology with the ancient science of yoga and holistic healing, we offer personalized practices to promote physical, mental, and spiritual well-being. Our astro-yoga sessions incorporate yoga postures, breathing techniques, and meditation practices aligned with the planetary energies to enhance vitality, reduce stress, and promote overall wellness." }
    ]
  },
  "property-problem": {
    title: "Property Problem",
    subtitle: "Resolve Property Issues With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80", // Real Estate
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Property Problem Service, where we harness the wisdom of astrology to address property-related challenges and facilitate favorable outcomes for our clients.",
      { heading: "Astrological Analysis for Property Matters", text: "Astrology offers profound insights into the cosmic energies influencing property transactions, disputes, and investments. Our astrologers conduct detailed analyses of your birth chart and the astrological charts associated with the property in question to identify potential obstacles, auspicious timings for transactions, and strategies for resolving property-related issues. By aligning your property dealings with the planetary influences, you can navigate complex legal and financial matters with clarity and confidence." },
      { heading: "Astrological Remedies for Property Success", text: "In addition to providing insights and guidance, we offer astrological remedies to mitigate obstacles and enhance the likelihood of a favorable outcome in property-related matters. From planetary rituals to gemstone recommendations and personalized affirmations, our remedies are tailored to address specific challenges and support your efforts towards resolving property disputes, acquiring properties, or selling real estate." }
    ]
  },
  "business-growth": {
    title: "Business Growth",
    subtitle: "Unlocking Business Success With Cosmic Insights",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80", // Business
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Business Solutions, where we harness the power of astrology, vastu, numerology, and other cosmic sciences to propel your business towards unparalleled success.",
      { heading: "Astrology in Business", text: "Astrology provides valuable insights into the cosmic energies influencing your business ventures. Our astrological consultations help you understand auspicious timings for important decisions, identify potential challenges, and align your business strategies with the planetary alignments for optimal results." },
      { heading: "Vastu for Business Prosperity", text: "Vastu, the ancient science of architecture and spatial arrangement, plays a crucial role in ensuring harmony and prosperity in business environments. Our vastu consultations analyze the energy flow within your workspace, suggest remedial measures to enhance positivity and productivity, and optimize the layout for maximum success." },
      { heading: "Numerology for Business Growth", text: "Numerology unveils the hidden patterns and vibrations present in the numbers associated with your business. Through numerological analysis, we decode the significance of your business name, logo, and other numerical factors, guiding you towards making favorable choices that resonate with the cosmic energies and support your growth trajectory." }
    ]
  },
  "professional-growth": {
    title: "Professional Growth",
    subtitle: "Empower Your Professional Journey With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80", // Career/Team
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Professional Growth Service, where we combine the ancient wisdom of astrology with modern strategies to unlock your fullest potential and propel you towards professional success.",
      { heading: "Astrological Career Guidance", text: "Astrology offers profound insights into your unique strengths, talents, and career opportunities. Our astrological consultations delve deep into your birth chart to uncover your vocational path, optimal career timings, and potential challenges. With personalized guidance tailored to your astrological profile, you can make informed decisions and navigate your career journey with confidence." },
      { heading: "Career Planning with Cosmic Alignment", text: "Aligning your career goals with the cosmic energies can amplify your success and fulfillment. Our astrologers work closely with you to develop a strategic career plan that harmonizes with the planetary influences and cosmic rhythms. Whether you’re seeking career advancement, entrepreneurial pursuits, or a career change, our cosmic guidance empowers you to manifest your professional aspirations with ease." },
      { heading: "Astrological Remedies for Career Growth", text: "In addition to providing insights and guidance, we offer astrological remedies to mitigate obstacles and enhance your professional growth. From gemstone recommendations to planetary rituals and affirmations, our remedies are designed to align your energy with favorable cosmic forces, paving the way for greater career success and fulfillment." }
    ]
  },
  "education-career": {
    title: "Education & Career",
    subtitle: "Unlock Your Academic And Professional Potential With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80", // Education
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Education and Career Service, where we harness the power of astrology to illuminate your path to academic success and career fulfillment.",
      { heading: "Astrological Career Guidance", text: "Astrology offers invaluable insights into your innate talents, potential career paths, and optimal timing for career decisions. Our astrologers specialize in career guidance, using your birth chart to identify career opportunities aligned with your unique strengths and aspirations. Whether you’re a student exploring educational options or a professional seeking career advancement, our astrological consultations provide clarity and direction to help you achieve your goals." },
      { heading: "Education Planning with Cosmic Alignment", text: "Aligning your educational pursuits with the cosmic energies can enhance your learning experience and academic achievements. Our astrologers analyze your birth chart to identify auspicious periods for studying, taking exams, and pursuing higher education. By harmonizing your educational journey with the planetary influences, you can maximize your learning potential and pave the way for academic success." }
    ]
  },
  "stress-depression": {
    title: "Stress & Depression",
    subtitle: "Find Inner Peace And Emotional Balance With Cosmic Healing",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80", // Peace
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Stress and Depression Service, where we offer compassionate guidance and cosmic remedies to help you find inner peace, emotional balance, and resilience in the face of life’s challenges.",
      { heading: "Astrological Insights into Mental Health", text: "Astrology offers profound insights into the cosmic energies influencing our mental and emotional well-being. Our astrologers conduct detailed analyses of your birth chart to uncover potential astrological factors contributing to stress, anxiety, and depression. By understanding the planetary influences at play, we can provide targeted guidance and remedies to support your emotional healing and well-being." },
      { heading: "Astrological Remedies for Emotional Healing", text: "In addition to providing insights and guidance, we offer astrological remedies to alleviate stress and promote emotional healing. From planetary rituals to gemstone recommendations and personalized affirmations, our remedies are tailored to address specific imbalances and restore harmony to your mind, body, and spirit." },
      { heading: "Holistic Healing Practices", text: "Our stress and depression service includes a range of holistic healing practices designed to promote relaxation, inner peace, and emotional balance. From meditation and mindfulness techniques to energy healing modalities such as Reiki and sound therapy, we offer personalized sessions to help you release tension, reduce anxiety, and cultivate a sense of calm and tranquility in your life." },
      { heading: "Note:", text: "While astrology can provide some insights into potential personality traits or tendencies associated with depression, it should not be used as a diagnostic tool for mental health conditions. Certain planetary placements and aspects in an individual’s birth chart might suggest predispositions or challenges related to emotional well-being, but the interpretation of these factors requires a nuanced understanding. It is crucial to recognize that a birth chart is not deterministic, and any astrological insights should be approached with caution and complemented by professional mental health care." }
    ]
  },
  "litigation-conciliation": {
    title: "Litigation Conciliation",
    subtitle: "Resolve Legal Matters With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80", // Law
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Litigation Conciliation Service, where we combine the ancient wisdom of astrology with modern legal strategies to facilitate peaceful resolutions and favorable outcomes in legal disputes.",
      { heading: "Astrological Analysis of Legal Matters", text: "Astrology offers unique insights into the cosmic energies influencing legal proceedings and outcomes. Our astrologers conduct detailed analyses of your birth chart and the astrological charts associated with legal matters to identify potential challenges, favorable timings for negotiations, and strategies for achieving a positive resolution. By aligning your legal strategy with the planetary influences, you can navigate legal disputes with confidence and clarity." },
      { heading: "Astrological Remedies for Legal Success", text: "In addition to providing insights and guidance, we offer astrological remedies to mitigate obstacles and enhance the likelihood of a favorable outcome in legal proceedings. From planetary rituals to gemstone recommendations and personalized affirmations, our remedies are tailored to address specific legal challenges and support your efforts towards resolution and conciliation." }
    ]
  },
  "marriage-relationship": {
    title: "Marriage & Relationship",
    subtitle: "Nurture Your Relationships With Cosmic Harmony",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80", // Wedding
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Marriage and Relationship Service, where we blend the timeless wisdom of astrology with modern insights to foster deeper connections, enhance compatibility, and cultivate lasting love.",
      { heading: "Astrological Compatibility Analysis", text: "Astrology offers profound insights into the dynamics of your relationships, uncovering the unique compatibility between partners based on their astrological profiles. Our astrologers conduct in-depth compatibility analyses, examining the planetary placements and alignments to assess the strengths and challenges within your relationship. With this knowledge, you can nurture a harmonious and fulfilling partnership grounded in cosmic harmony." },
      { heading: "Pre-Marital Guidance and Counseling", text: "Embarking on the journey of marriage is a significant step in life, and astrology can offer valuable guidance to ensure a strong foundation for your union. Our pre-marital consultations provide insights into your astrological compatibility, communication styles, and shared goals as a couple. We offer practical advice and remedies to address potential areas of tension and foster a deeper understanding and connection between partners." },
      { heading: "Astrology Behind Marital Problems: Understanding the Planets", text: "Many marital problems can be attributed to specific combinations in the horoscope. The positions of certain planets often play a crucial role in causing marital disharmony. This post aims to shed light on how particular planetary configurations can be the primary factors contributing to issues within a marriage." }
    ]
  },
  "parent-child-relationship": {
    title: "Parent Child Relationship",
    subtitle: "Strengthen Bonds And Foster Harmony With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80", // Family
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma Parent-Child Relationship Service, where we harness the wisdom of astrology to nurture deeper connections and harmonious relationships between parents and children.",
      { heading: "Astrological Insights into Parent-Child Dynamics", text: "Astrology offers profound insights into the unique dynamics between parents and children, shedding light on their individual personalities, communication styles, and karmic bonds. Our astrologers conduct detailed analyses of the birth charts of parents and children to uncover potential areas of tension, opportunities for growth, and strategies for fostering understanding and harmony within the family unit." },
      { heading: "Parenting Guidance and Strategies", text: "Aligning your parenting approach with the cosmic energies can enhance communication, mutual respect, and emotional connection between parents and children. Our parenting guidance sessions integrate astrological insights with practical strategies for effective communication, discipline, and nurturing. By understanding the cosmic influences shaping your parent-child relationship, you can create a supportive and nurturing environment conducive to your child’s growth and development." }
    ]
  }
};

export const SERVICES_PAGE_DATA = {
  "soul-purpose": {
    title: "Soul Purpose",
    subtitle: "Soul Purpose",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/14.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/6-4.png",
    paragraphs: [
      "Welcome to our Soul Purpose services, where the journey of self-discovery unfolds and the true essence of your being is revealed. Your soul's purpose is the guiding light that illuminates your path, ignites your passions, and empowers you to live a life of meaning and fulfillment. At our Soul Purpose services, we offer a transformative journey of exploration, introspection, and alignment with your deepest aspirations and desires. Through personalized sessions, workshops, and guided practices, we delve into the depths of your inner wisdom, helping you uncover the unique gifts, talents, and potentialities that lie within. Our experienced facilitators and coaches provide gentle guidance, profound insights, and practical tools to support you on your path of self-discovery and self-realization. Whether you're seeking clarity on your life's purpose, yearning for deeper connections with yourself and others, or striving to live authentically in alignment with your true essence, our Soul Purpose services offer a sacred space for growth, healing, and transformation. Embrace the journey of self-discovery, honor the whispers of your soul, and embark on a quest to live a life of purpose, passion, and authenticity with our Soul Purpose services."
    ]
  },
  "match-making": {
    title: "Match Making",
    subtitle: "Match Making",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/11.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/3-2.png",
    paragraphs: [
      "\"Marriages are made in Heaven\". It is very important to make sure that your kundali matches with the one you are about to marry. Kundali Matching age-old tradition in India and it is something that must not be over looked. Gitika Sharma, meticulously examine the fundamental elements of each individual's Kundali, illuminating compatibility markers, shared goals, and potential challenges. We believe that understanding the cosmic resonance between two individuals is key to fostering lasting love and companionship.",
      "Whether you're seeking a life partner, a soulmate, or a kindred spirit, our Match Making service offers personalized insights and guidance to help you navigate the journey of love with confidence and clarity.",
      "Discover the magic of cosmic connection, embark on a journey of discovery, and let the stars align your path to enduring love and fulfillment."
    ]
  },
  "kundali-making": {
    title: "Kundali Making",
    subtitle: "Kundali Making",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/10.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/2-3.png",
    paragraphs: [
      "Welcome to our Kundali Making services, where the cosmic map of your life unfolds and the mysteries of your destiny are revealed. Your Kundali, also known as a birth chart, is a sacred blueprint that captures the celestial configurations at the moment of your birth. At our Kundali Making services, we meticulously craft your personalized birth chart, offering profound insights into the unique cosmic influences shaping your journey through life. Through the precise positioning of planets, houses, and celestial bodies, your Kundali serves as a roadmap, guiding you through the diverse landscapes of your existence. We employ time-honored techniques and ancient wisdom to interpret the intricate patterns and symbols embedded within your Kundali. Whether you seek clarity on your strengths and weaknesses, guidance on relationships, career, health, or spirituality, our Kundali Making services provide invaluable insights and perspectives to illuminate your path. Embrace the wisdom of the stars, honor the legacy of ancient knowledge, and embark on a journey of self-discovery and empowerment with our Kundali Making services."
    ]
  },
  "kundali-analysis": {
    title: "Kundali Analysis",
    subtitle: "Kundali Analysis",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/9-1.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/1-3.png",
    paragraphs: [
      "At our platform, we delve deep into the layers of your Kundali to unravel the mysteries of your personality, relationships, career, health, and more. Through meticulous examination of planetary placements, house configurations, yogas, and doshas, we unveil the cosmic influences shaping your destiny.",
      "We combine time-honored techniques with contemporary insights to provide you with personalized interpretations and actionable guidance. Whether you seek clarity on life's challenges, opportunities for growth, or a deeper understanding of your path, our Kundali analysis offers profound insights and invaluable perspectives.",
      "Unlock the secrets of your destiny, illuminate the pathways to fulfillment, and embark on a journey of self-discovery with our comprehensive Kundali analysis services."
    ]
  },
  "vastu-consultation": {
    title: "Vastu Consultation",
    subtitle: "Vastu Consultation",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/13.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/5-2.png",
    paragraphs: [
      "Welcome to our Vastu Consultation services, where ancient principles of harmonious living meet modern lifestyles. Vastu Shastra is the ancient Indian science of architecture and design, rooted in the belief that the spatial arrangement of our surroundings profoundly influences our well-being and prosperity.",
      "At our Vastu Consultation service, we offer personalized guidance and practical solutions to harmonize your living spaces, workplaces, factories and environments. Drawing upon the timeless wisdom of Vastu Shastra, Gitika Sharma analyze the energy flow, orientation, and layout of your space to optimize positive vibrations and enhance overall harmony.",
      "Whether you're designing a new home, renovating an existing space, or seeking to create a more balanced environment, we provide insightful recommendations tailored to your specific needs and goals.",
      "From simple adjustments to comprehensive redesigns, our goal is to help you create spaces that support your health, happiness, and success. Explore the transformative power of Vastu, and unlock the full potential of your living and working environments with our Vastu Consultation services."
    ]
  },
  "numerology-analysis": {
    title: "Numerology Analysis",
    subtitle: "Numerology Analysis",
    bannerImage: "https://gitikasharma.in/wp-content/uploads/2024/03/12.png",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/4-2.png",
    paragraphs: [
      "Welcome to our Numerology Analysis services, where we decode the hidden meanings behind the numbers in your life. Numerology is the ancient study of numbers and their profound mystical significance in shaping our destiny. Through a comprehensive analysis of your birth date and name, we uncover your Life Path number, Expression number, and Soul Urge number. These unique numerical vibrations provide deep insights into your personality traits, innate talents, and potential challenges.",
      "Whether you are seeking clarity on your career path, relationship compatibility, or major life decisions, our numerology consultation offers practical guidance to help you align with your true purpose and maximize your potential."
    ]
  },
  "business-name-logo": {
    title: "Business Name & Logo",
    subtitle: "Business Name & Logo",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80", // Branding
    paragraphs: [
      "Welcome to our Business Name & Logo Consultation services. In the competitive business world, the energetic vibration of your brand's name and visual identity plays a crucial role in attracting success, prosperity, and the right clientele.",
      "Using the principles of Numerology and Vastu Shastra, we analyze and suggest powerful business names that align with your birth chart and the specific industry you are entering. We ensure the numerical vibration of your brand name resonates with abundance and growth.",
      "Additionally, we provide strategic guidance on logo design—including color psychology, shapes, and symbols—to ensure your visual identity creates a positive energetic footprint and fosters lasting brand recognition."
    ]
  }
};

export const COURSES_PAGE_DATA = {
  "palmistry": {
    title: "Palmistry",
    subtitle: "Discover the Secrets of Palmistry and Astrology Combined",
    category: "Foundation Course",
    price: 9240,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/4-5.png",
    paragraphs: [
      "Embark on an illuminating journey into the ancient arts of palmistry and astrology with our comprehensive 15+ hours course on Palmistry Astrology. Explore the fascinating interplay between the lines and mounts of the palm and the cosmic influences of the stars and planets, and unlock the hidden insights of your destiny.",
      "Enroll now and unlock the secrets of Palmistry Astrology. Gain profound insights into yourself and others, and empower yourself to navigate life's journey with clarity, confidence, and wisdom."
    ]
  },
  "vedic-astrology": {
    title: "Vedic Astrology",
    subtitle: "Unlock the Secrets of Vedic Astrology",
    category: "Services",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/02/1-2.png",
    paragraphs: [
      "Embark on a transformative journey into the ancient wisdom of Vedic Astrology with our comprehensive 45+ hours course. Dive deep into the mystical realms of the cosmos, explore the intricate interplay of planetary energies, and unlock the secrets of your destiny.",
      "Enroll now and embark on a transformative journey into the fascinating world of Vedic Astrology. Uncover the mysteries of the cosmos, decode the secrets of your destiny, and empower yourself to navigate life's journey with wisdom and insight."
    ]
  },
  "akashic-records": {
    title: "Akashic Records",
    subtitle: "Embark on a Journey into the Akashic Records",
    category: "Certification Course",
    price: 15999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/7-5.png",
    paragraphs: [
      "Welcome to our transformative 10+ hours course on Akashic Records. Delve into the boundless wisdom and profound insights of the Akashic Records, and unlock the secrets of your soul's journey across lifetimes.",
      "Enroll now and embark on a profound journey of self-discovery and spiritual awakening through the Akashic Records. Gain clarity, healing, and empowerment as you connect with the infinite wisdom and love of the universe."
    ]
  },
  "lal-kitab-astrology": {
    title: "Lal Kitab Astrology",
    subtitle: "Unlock the Mysteries of Lal Kitab Astrology",
    category: "Master Program",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/5-5.png",
    paragraphs: [
      "Embark on an enlightening journey into the ancient wisdom of Lal Kitab Astrology with our comprehensive 45+ hours course. Explore the unique principles, remedies, and predictive techniques of Lal Kitab Astrology, and learn how to harness its transformative power to decipher the secrets of your destiny.",
      "Enroll now and unlock the transformative power of Lal Kitab Astrology. Gain profound insights into your destiny, harness the energies of the cosmos, and empower yourself to create a life filled with abundance, prosperity, and fulfillment."
    ]
  },
  "bhrigu-nandi-nadi": {
    title: "Bhrigu Nandi Nadi",
    subtitle: "Explore the Depths of Bhrigu Nandi Nadi Astrology",
    category: "Advanced Course",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/2-7.png",
    paragraphs: [
      "Embark on an enlightening journey into the ancient wisdom of Bhrigu Nandi Nadi astrology with our comprehensive 45+ hours course. Dive deep into the sacred texts and teachings of this profound astrological tradition, unraveling the mysteries of karma, destiny, and spiritual evolution.",
      "Enroll now and unlock the profound wisdom of Bhrigu Nandi Nadi astrology. Transform your understanding of karma, destiny, and spiritual evolution, and empower yourself to navigate life's journey with clarity, insight, and purpose."
    ]
  },
  "vastu-shastra-course": {
    title: "Vastu Shastra Course",
    subtitle: "Master the Art of Vastu Shastra",
    category: "Master Program",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/6-7.png",
    paragraphs: [
      "Embark on an immersive journey into the ancient science of Vastu Shastra with our comprehensive 45+ hours course on Vastu Consultant. Dive deep into the principles, techniques, and practical applications of Vastu Shastra, and become a certified Vastu Consultant capable of transforming spaces and enhancing the lives of others.",
      "Enroll now and embark on a transformative journey into the ancient science of Vastu Shastra. Become a certified Vastu Consultant and empower yourself to create harmonious and auspicious living and working environments that promote health, happiness, and prosperity."
    ]
  },
  "numerology-course": {
    title: "Numerology",
    subtitle: "Unlock the Secrets of Numerology",
    category: "Foundation Course",
    price: 9240,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://gitikasharma.in/wp-content/uploads/2024/03/3-5.png",
    paragraphs: [
      "Embark on a transformative journey into the mystical realm of numbers with our comprehensive 20+ hours course on Numerology Analysis. Discover the profound insights and practical tools of numerology, and learn how to decode the hidden meanings behind numbers to enhance your life and empower others.",
      "Enroll now and embark on a transformative journey into the world of numerology. Unlock the secrets of numbers, gain profound insights into yourself and others, and empower yourself to create a life filled with purpose, abundance, and fulfillment."
    ]
  }
};
