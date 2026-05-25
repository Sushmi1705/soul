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
      { label: "Vastu Consultation", href: "/courses/vastu-consultation" },
      { label: "Numerology Analysis", href: "/courses/numerology-analysis" }
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
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Kundali-analysis-1.png",
    duration: "60 min",
    price: 2499,
  },
  {
    id: "kundali-making",
    title: "Kundali Making",
    desc: "We meticulously craft your personalized birth chart, offering profound insights into the unique cosmic influences shaping your journey.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Kundali-Making.png",
    duration: "45 min",
    price: 1999,
  },
  {
    id: "match-making",
    title: "Match Making",
    desc: "Discover the magic of cosmic connection, embark on a journey of discovery, and let the stars align your path to enduring love.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Match-Making.png",
    duration: "75 min",
    price: 3499,
  },
  {
    id: "numerology-analysis",
    title: "Numerology Analysis",
    desc: "Unveil the mysteries of your destiny and embark on a transformative journey of self-discovery through the wisdom of numbers.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Numerology.png",
    duration: "60 min",
    price: 2199,
  },
  {
    id: "vastu-consultation",
    title: "Vastu Consultation",
    desc: "Create a balanced environment for your home or workspace with insightful recommendations tailored to your specific needs.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Vastu-Consultation.png",
    duration: "90 min",
    price: 4999,
  },
  {
    id: "soul-purpose",
    title: "Soul Purpose",
    desc: "Honor the whispers of your soul and embark on a quest to live a life of purpose, passion, and authenticity.",
    image: "https://gitikasharma.in/wp-content/uploads/2024/02/Soul-Purpose.png",
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
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80",
  },
  {
    id: "bhrigu-nandi-nadi",
    title: "Bhrigu Nandi Nadi",
    category: "Advanced Course",
    price: 27999,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
  },
  {
    id: "lal-kitab-astrology",
    title: "Lal Kitab Astrology",
    category: "Master Program",
    price: 27999,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
  },
  {
    id: "numerology-course",
    title: "Numerology",
    category: "Foundation Course",
    price: 9240,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80",
  },
  {
    id: "palmistry",
    title: "Palmistry",
    category: "Foundation Course",
    price: 9240,
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80",
  },
  {
    id: "vastu-shastra-course",
    title: "Vastu Shastra Course",
    category: "Master Program",
    price: 27999,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
  },
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

export const JOURNAL = [
  {
    id: "vedic-wisdom",
    category: "Vastu Consultation",
    date: "March 7, 2024",
    title:
      "Unlocking Cosmic Wisdom: Exploring Vedic Astrology with Soul Karma",
    excerpt:
      "In a world filled with uncertainty and rapid change, the ancient wisdom of Vedic astrology offers a guiding light to those seeking clarity and meaning.",
    image:
      "https://gitikasharma.in/wp-content/uploads/2024/03/3-8.png",
  },
  {
    id: "nurturing-love",
    category: "Palmistry",
    date: "March 7, 2024",
    title:
      "Nurturing Love: Healing Marriages & Relationships through Astrology Therapy",
    excerpt:
      "In the intricate dance of love and relationships, challenges are inevitable. Yet within the depths of the stars lies a compass for the heart.",
    image:
      "https://gitikasharma.in/wp-content/uploads/2024/03/2-10.png",
  },
  {
    id: "power-of-numbers",
    category: "Vedic Astrology",
    date: "March 7, 2024",
    title:
      "Harnessing the Power of Numbers: Exploring Numerology with Soul Karma",
    excerpt:
      "In the intricate tapestry of the universe, numbers hold a profound significance — the silent language of creation speaking to those who listen.",
    image:
      "https://gitikasharma.in/wp-content/uploads/2024/02/1-3.png",
  },
];

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
      "Welcome to Soul Karma By Gitika Sharma's Health Solutions, where we tap into the ancient wisdom of astrology and holistic practices to support you on your journey towards vibrant health and well-being.",
      "Astrology offers profound insights into your physical constitution, susceptibility to health issues, and potential remedies for restoring balance. Our expert astrologers conduct detailed health analyses, examining the planetary influences in your birth chart to identify potential health risks.",
      "In addition to providing insights into your health profile, we offer planetary remedies to promote healing tailored to your unique cosmic blueprint and specific health concerns."
    ]
  },
  "property-problem": {
    title: "Property Problem",
    subtitle: "Resolve Property Issues With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80", // Real Estate
    paragraphs: [
      "Welcome to Soul Karma's Property Solutions, where we harness the ancient wisdom of astrology to address property-related challenges and facilitate favorable outcomes for our clients.",
      "Astrology offers profound insights into the cosmic energies influencing property transactions, disputes, and investments. Our astrologers conduct detailed analyses of your birth chart and the astrological charts associated with the property in question to identify potential obstacles.",
      "In addition to providing insights and guidance, we offer astrological remedies to mitigate obstacles and enhance the likelihood of a favorable outcome in property matters."
    ]
  },
  "business-growth": {
    title: "Business Growth",
    subtitle: "Unlocking Business Success With Cosmic Insights",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80", // Business
    paragraphs: [
      "Welcome to Soul Karma's Business Solutions, where we leverage the power of astrology and cosmic connections to propel your business towards unparalleled success.",
      "Astrology provides invaluable insights into the cosmic energies influencing your business endeavors. Our astrological consultations help you understand the optimal timings for launches, identify potential challenges, and align your business strategies with the planetary alignments for optimal results.",
      "Vastu Shastra, the ancient science of architecture and spatial arrangement, plays a crucial role in ensuring harmony and prosperity in business environments. Our Vastu consultants analyze the energy flow within your workspace and recommend structural adjustments to attract abundance and success."
    ]
  },
  "professional-growth": {
    title: "Professional Growth",
    subtitle: "Empower Your Professional Journey With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80", // Career/Team
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma, where we harness the ancient wisdom of astrology and modern strategies to unlock your hidden potential and propel you towards professional success.",
      "Astrology offers profound insights into your unique strengths, talents, and career opportunities. Our astrologers conduct in-depth analyses of your birth chart to uncover your vocational aptitudes, optimal career timings, and potential challenges.",
      "Whether you're seeking career advancement, exploring new professional avenues, or seeking clarity on your career path, our cosmic guidance empowers you to make informed decisions and navigate your professional journey with confidence."
    ]
  },
  "education-career": {
    title: "Education & Career",
    subtitle: "Unlock Your Academic And Professional Potential With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80", // Education
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma's Education and Career Solutions, where we harness the power of astrology to illuminate your academic path and professional journey.",
      "Astrology offers profound insights into your innate talents, potential career paths, and optimal timings for career decisions. Our astrologers specialize in career guidance, using your birth chart to identify career opportunities aligned with your unique strengths and aspirations.",
      "Aligning your educational pursuits with the cosmic energies can enhance your learning experience and academic achievements. Our astrologers analyze your birth chart to identify auspicious periods for studying, taking exams, and pursuing higher education."
    ]
  },
  "stress-depression": {
    title: "Stress & Depression",
    subtitle: "Find Inner Peace And Emotional Balance With Cosmic Healing",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80", // Peace
    paragraphs: [
      "Welcome to Soul Karma's Stress and Depression solutions, where we offer compassionate guidance and cosmic remedies to help you find inner peace and emotional balance.",
      "Astrology offers profound insights into the cosmic energies influencing your mental and emotional well-being. Our astrologers conduct detailed analyses of your birth chart to uncover potential sources of stress, anxiety, and depression.",
      "In addition to providing insights and guidance, we offer astrological remedies to alleviate stress and promote emotional healing. From gemstone recommendations to personalized affirmations, our remedies are tailored to address specific areas of imbalance and restore harmony to your mind, body, and spirit."
    ]
  },
  "litigation-conciliation": {
    title: "Litigation Conciliation",
    subtitle: "Resolve Legal Matters With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80", // Law
    paragraphs: [
      "Welcome to Soul Karma's Litigation Conciliation Solutions, where we harness the ancient wisdom of astrology to offer guidance and facilitate favorable outcomes in legal disputes.",
      "Astrology offers unique insights into the cosmic energies influencing legal proceedings and disputes. Our astrologers conduct detailed analyses of the birth charts of the parties involved and the astrological charts associated with the dispute to identify potential obstacles, favorable timings for resolution, and strategies for a positive outcome.",
      "In addition to providing insights and guidance, we offer astrological remedies to mitigate obstacles and enhance the likelihood of a favorable outcome in legal matters."
    ]
  },
  "marriage-relationship": {
    title: "Marriage & Relationship",
    subtitle: "Nurture Your Relationships With Cosmic Harmony",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80", // Wedding
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma's Marriage and Relationship Solutions, where we blend the ancient wisdom of astrology with modern insights to foster deeper connections, enhance compatibility, and cultivate lasting love.",
      "Astrology offers profound insights into the dynamics of your relationships, uncovering unique compatibility factors, karmic connections, and areas for growth. Our astrologers conduct in-depth compatibility analyses, examining the planetary placements and alignments to assess the strengths and challenges within your relationship.",
      "Embarking on the journey of marriage is a significant step in life, and astrology can offer valuable guidance to ensure a strong foundation for your union. Our premarital consultations provide insights into your astrological compatibility, communication styles, and shared goals as a couple."
    ]
  },
  "parent-child-relationship": {
    title: "Parent Child Relationship",
    subtitle: "Strengthen Bonds And Foster Harmony With Cosmic Guidance",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80", // Family
    paragraphs: [
      "Welcome to Soul Karma By Gitika Sharma's Parent-Child Relationship Solutions, where we harness the wisdom of astrology to foster deeper connections, understanding, and harmony between parents and children.",
      "Astrology offers profound insights into the unique dynamics between parents and children, shedding light on their individual personalities, communication styles, and karmic bonds. Our astrologers conduct detailed analyses of the birth charts of parents and children to uncover potential areas of friction, opportunities for growth, and strategies for fostering a harmonious relationship.",
      "Aligning your parenting approach with the cosmic energies can enhance communication, mutual respect, and emotional connection between parents and children. Our parenting guidance sessions empower you with practical strategies for effective communication, discipline, and nurturing."
    ]
  }
};

export const SERVICES_PAGE_DATA = {
  "soul-purpose": {
    title: "Soul Purpose",
    subtitle: "Soul Purpose",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80", // Zodiac circle/meditation
    paragraphs: [
      "Welcome to our Soul Purpose services, where the essence of self-discovery unfolds and the true purpose of your soul is revealed. Your soul's purpose is the guiding light that illuminates your path, infuses your decisions, and empowers you to live a life of meaning and fulfillment.",
      "At Soul Karma, we offer a transformative journey of exploration, introspection, and alignment with your deepest aspirations and desires. Through personalized guidance, intuitive insights, and spiritual practices, we delve into the depths of your inner wisdom, helping you uncover the unique gifts, talents, and contributions that lie within.",
      "Our experienced practitioners and coaches provide gentle guidance, profound insights, and unconditional support as you embark on your path of self-discovery and soul awakening."
    ]
  },
  "match-making": {
    title: "Match Making",
    subtitle: "Match Making",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80", // Kundali/Wedding
    paragraphs: [
      "Welcome to our Match Making services. It is very important in Hindu culture that your Kundali matches with the one you are about to marry. Kundali matching, also known as Guna Milan, is an ancient practice that helps assess compatibility between prospective partners.",
      "Our astrologers analyze the fundamental elements of each individual's Kundali, illuminating compatibility factors, shared goals, and potential challenges. We believe that understanding these dynamics is essential for fostering harmony and long-term commitment.",
      "Whether you're seeking a life partner or exploring a new relationship, our matchmaking service offers personalized insights and guidance to help you navigate the journey of love with confidence and clarity. Discover the magic of cosmic connection, embark on a journey of discovery, and let the stars align your path to enduring love."
    ]
  },
  "kundali-making": {
    title: "Kundali Making",
    subtitle: "Kundali Making",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80", // Chart/Abstract
    paragraphs: [
      "Welcome to our Kundali Making services, where the cosmic map of your life unfolds and the mysteries of your destiny are revealed. Your Kundali, also known as a Birth Chart, is a personalized cosmic blueprint that captures the celestial configurations at the exact moment of your birth.",
      "At Soul Karma, we meticulously craft your personalized birth chart, offering profound insights into the unique cosmic influences shaping your journey. Through deep astrological analysis of planetary placements, houses, and constellations, your Kundali serves as a guiding light.",
      "It helps illuminate your true essence, potential challenges, and overarching life purpose. Discover the intricate patterns and rhythms embedded within your Kundali, whether you seek clarity on your strengths and weaknesses, guidance on career choices, or insights into your relationships."
    ]
  },
  "kundali-analysis": {
    title: "Kundali Analysis",
    subtitle: "Kundali Analysis",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&q=80", // Chart/Abstract
    paragraphs: [
      "At Soul Karma, we delve deep into the layers of your Kundali to unravel the mysteries of your personality, relationships, career, health, and more. Through meticulous examination of planetary placements, cosmic configurations, yogas, and doshas, we unveil the cosmic influences shaping your destiny.",
      "We combine time-honored techniques with contemporary insights to provide you with personalized interpretations and actionable guidance. Whether you seek clarity on life's challenges, opportunities for growth, or a deeper understanding of your true self, our Kundali analysis offers profound insights and invaluable perspectives.",
      "Unlock the secrets of your destiny, illuminate the pathways to fulfillment, and embark on a journey of self-discovery with our comprehensive Kundali analysis services."
    ]
  },
  "vastu-consultation": {
    title: "Vastu Consultation",
    subtitle: "Vastu Consultation",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80", // House/Interior
    paragraphs: [
      "Welcome to our Vastu Consultation services, where the ancient principles of harmonious living meet modern lifestyles. Vastu Shastra is the traditional Indian science of architecture and design, rooted in the belief that the spatial arrangement of our surroundings profoundly influences our well-being and prosperity.",
      "At Soul Karma, we offer personalized guidance and practical solutions to harmonize the energy flow in your living spaces, workplaces, factories, and commercial venues. Drawing upon the timeless wisdom of Vastu Shastra, Gitika Sharma analyzes the energy flow, orientation, and structural dynamics of your premises.",
      "Whether you're building a new home, remodeling an existing space, or seeking to enhance the harmony of your environment, we provide insightful recommendations tailored to your specific needs and goals."
    ]
  },
  "numerology-analysis": {
    title: "Numerology Analysis",
    subtitle: "Numerology Analysis",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80", // Numbers/Abstract
    paragraphs: [
      "Welcome to our Numerology Analysis services, where we decode the hidden meanings behind the numbers in your life. Numerology is the ancient study of numbers and their profound mystical significance in shaping our destiny.",
      "Through a comprehensive analysis of your birth date and name, we uncover your Life Path number, Expression number, and Soul Urge number. These unique numerical vibrations provide deep insights into your personality traits, innate talents, and potential challenges.",
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
    category: "Foundation Course",
    price: 9240,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80",
    paragraphs: [
      "Discover the ancient art of Palmistry and unlock the secrets held within the lines of your hands. This foundational course is designed for beginners who wish to understand how the shape, lines, and mounts of the palm reveal character traits and life potential.",
      "Throughout this comprehensive program, you will learn to read the major lines (Heart, Head, Life, and Fate) and interpret the significance of various markings and hand shapes. Practical exercises and real-life examples will help you build confidence in your readings.",
      "By the end of this course, you will have the knowledge to perform basic palmistry readings for yourself and others, providing valuable insights into personality, career, and relationships."
    ]
  },
  "vedic-astrology": {
    title: "Vedic Astrology",
    category: "Foundation Course",
    price: 15999, // Assuming a price since it wasn't in the COURSES array directly but the subnav
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80",
    paragraphs: [
      "Step into the profound world of Vedic Astrology (Jyotish) and learn to decode the cosmic language of the stars. This course provides a deep dive into the fundamental principles of ancient Indian astrology.",
      "You will study the significance of the 12 Zodiac signs, 9 planets (Navagrahas), and the 12 houses (Bhavas). We will cover how to cast and interpret a basic birth chart, understand planetary transits, and recognize karmic patterns.",
      "Whether you are looking to embark on a professional career as an astrologer or simply seeking profound self-knowledge, this course offers the perfect foundation to guide you on your cosmic journey."
    ]
  },
  "akashic-records": {
    title: "Akashic Records",
    category: "Certification Course",
    price: 15999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80",
    paragraphs: [
      "Access the universal library of your soul's history with our Akashic Records Certification Course. The Akashic Records are an energetic database containing every thought, emotion, and experience of every soul across time.",
      "In this immersive training, you will learn spiritual protocols to safely access your own records and the records of others. We will focus on clearing karmic blocks, healing past-life traumas, and receiving direct guidance from your Masters, Teachers, and Loved Ones.",
      "Upon completion, you will receive a certification empowering you to conduct professional Akashic Record readings and facilitate deep spiritual healing."
    ]
  },
  "lal-kitab-astrology": {
    title: "Lal Kitab Astrology",
    category: "Master Program",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    paragraphs: [
      "Master the unique and practical wisdom of Lal Kitab Astrology. Known for its distinct approach to planetary analysis and highly effective, accessible remedies (Upayas), Lal Kitab is a powerful astrological system.",
      "This Master Program goes beyond basic chart reading, delving into the intricacies of Lal Kitab grammar, the concept of 'blind planets,' and the specific rules for planetary placements in different houses.",
      "You will learn how to prescribe simple, inexpensive remedies to mitigate negative planetary influences and enhance positive ones, making this a highly sought-after skill in the field of astrology."
    ]
  },
  "bhrigu-nandi-nadi": {
    title: "Bhrigu Nandi Nadi",
    category: "Advanced Course",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    paragraphs: [
      "Elevate your astrological expertise with the highly accurate predictive system of Bhrigu Nandi Nadi. This advanced course focuses on a specialized branch of Nadi astrology that relies on planetary combinations rather than traditional house lords.",
      "You will learn the core principles of planetary friendships, enmities, and conjunctions. The course teaches you how to make precise predictions regarding career, marriage, and life events by simply analyzing the interplay of planets in the birth chart.",
      "Designed for intermediate to advanced students, this program will dramatically improve the speed and accuracy of your astrological predictions."
    ]
  },
  "vastu-consultation": {
    title: "Vastu Shastra",
    category: "Master Program",
    price: 27999,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    paragraphs: [
      "Become a master of space and energy with our Vastu Shastra Master Program. This comprehensive course covers the ancient Indian science of architecture, teaching you how to harmonize living and working spaces with natural forces.",
      "We will explore the five elements (Panchamahabhutas), the 16 Vastu zones, and the significance of directions. You will learn practical techniques to identify Vastu defects (Doshas) and implement remedies without structural demolition.",
      "This certification will equip you to offer professional Vastu consultations, helping clients attract health, wealth, and prosperity into their environments."
    ]
  },
  "numerology-analysis": {
    title: "Numerology",
    category: "Foundation Course",
    price: 9240,
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    mainImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80",
    paragraphs: [
      "Unlock the hidden power of numbers with our Numerology Foundation Course. Numbers are the universal language, and this course will teach you how to decode their mystical significance in your life.",
      "You will learn how to calculate and interpret the Life Path, Destiny, and Soul Urge numbers from a birth date and name. We will delve into the energetic vibrations of numbers 1 through 9, as well as Master Numbers.",
      "By the end of the course, you will be able to provide insightful numerology profiles, helping yourself and others make informed decisions about career, relationships, and personal growth."
    ]
  }
};
