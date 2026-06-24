"""
Enriched astrological report templates for personalized horoscope generation.
Each section key maps to a list of template paragraphs with format placeholders
for the user's actual astrological parameters (name, Rasi, Nakshatra, Lagna,
and all 9 Vedic planetary positions).

build_personalized_section() selects 2-4 paragraphs per section, interpolates
the user's data, and joins them into a cohesive multi-paragraph reading.
"""


def build_personalized_section(rng, section_key, ctx, fallback_fn=None):
    """Generate a detailed, personalized multi-paragraph astrological section.

    Args:
        rng: seeded random.Random instance for deterministic variety
        section_key: key into ENRICHED_POOLS (e.g. "personality_strengths")
        ctx: dict with name, rasi, nakshatra, lagna, zodiac, planetary_positions
        fallback_fn: optional callable(rng, key) for old-style fallback
    """
    name = ctx.get("name", "Dear One")
    first_name = name.split()[0] if name else "Dear One"
    rasi = ctx.get("rasi", "Aries")
    nakshatra = ctx.get("nakshatra", "Ashwini")
    lagna = ctx.get("lagna", "Aries")
    zodiac = ctx.get("zodiac", "Aries")
    pp = ctx.get("planetary_positions", {})

    fmt = dict(
        name=name, first_name=first_name,
        rasi=rasi, nakshatra=nakshatra, lagna=lagna, zodiac=zodiac,
        sun=pp.get("Sun", "Aries"), moon=pp.get("Moon", "Aries"),
        mars=pp.get("Mars", "Aries"), mercury=pp.get("Mercury", "Aries"),
        jupiter=pp.get("Jupiter", "Aries"), venus=pp.get("Venus", "Aries"),
        saturn=pp.get("Saturn", "Aries"), rahu=pp.get("Rahu", "Aries"),
        ketu=pp.get("Ketu", "Aries"),
    )

    templates = ENRICHED_POOLS.get(section_key, [])
    if not templates:
        if fallback_fn:
            return fallback_fn(rng, section_key)
        return "The cosmic alignments are working in your favor, bringing focus and balance."

    # Life-report sections get more paragraphs than forecast sections
    is_life = section_key.startswith(("personality_", "career_", "relationship_",
                                      "financial_", "health_", "spiritual_"))
    lo, hi = (3, 4) if is_life else (2, 3)
    count = min(len(templates), rng.randint(lo, hi))
    selected = rng.sample(templates, count)

    paragraphs = []
    for tmpl in selected:
        try:
            paragraphs.append(tmpl.format(**fmt))
        except (KeyError, IndexError, ValueError):
            paragraphs.append(tmpl)

    return "\n\n".join(paragraphs)


# ---------------------------------------------------------------------------
# Enriched template pools — every paragraph includes {name}/{first_name},
# planetary placements, Rasi, Nakshatra, and Lagna for deep personalization.
# ---------------------------------------------------------------------------

ENRICHED_POOLS = {

    # =====================================================================
    #  PERSONALITY
    # =====================================================================

    "personality_strengths": [
        "{name}, your birth under the luminous {nakshatra} Nakshatra with your Moon residing in {rasi} grants you an exceptionally resilient and determined inner nature. This celestial combination endows you with the rare ability to remain composed under intense pressure, drawing strength from deep emotional reserves that most people never access. Your Lagna in {lagna} amplifies your outward confidence, making you appear grounded and reliable. People naturally turn to you as an anchor in times of uncertainty, sensing the quiet authority that flows from your chart.",

        "The placement of Jupiter in {jupiter} within your birth chart reveals a naturally generous and philosophical spirit, {first_name}. You possess an innate wisdom that allows you to see the broader picture when others are trapped in narrow perspectives. Combined with your {nakshatra} Nakshatra influence, this creates a personality that is both intellectually curious and deeply empathetic. Your ability to hold space for others while maintaining your own emotional equilibrium is one of your most powerful yet understated gifts.",

        "With Mercury stationed in {mercury} at the time of your birth, {name}, you carry a sharp, analytical mind that processes information with remarkable speed and accuracy. This mental agility, combined with the intuitive depth of your {rasi} Moon sign, creates a rare bridge between logic and instinct. You have the capacity to make sound decisions under pressure because you unconsciously weigh both rational evidence and emotional intelligence. This dual-processing ability is a cornerstone strength.",

        "Your Sun in {sun} illuminates a core identity built on authenticity and personal integrity, {first_name}. Unlike many who bend to social expectations, your celestial blueprint encourages you to stay true to your values even when it requires standing alone. The influence of your {lagna} Lagna gives you the courage to express unpopular truths with grace, earning deep respect from those who truly know you. This authenticity becomes magnetic over time, attracting opportunities and relationships that align with your highest purpose.",

        "The Mars placement in {mars} within your natal chart, {name}, infuses your personality with a quiet but unstoppable determination. When you commit to a goal, you pursue it with steady, focused intensity that others find both admirable and inspiring. This warrior energy, tempered by the softer emotional currents of your {nakshatra} Nakshatra, means you fight your battles with strategy rather than aggression. Your resilience is not loud or flashy — it is the deep, enduring kind that outlasts every storm and emerges stronger on the other side."
    ],

    "personality_weaknesses": [
        "{name}, while your {rasi} Moon sign grants you profound emotional depth, it can also create a tendency toward over-analysis and rumination. Your mind, influenced by Mercury in {mercury}, sometimes spirals into cycles of overthinking where you replay conversations and decisions long after they have passed. This mental pattern can create unnecessary anxiety and delay critical actions. The remedy lies in developing mindfulness practices that anchor you in the present, allowing your powerful intellect to serve you rather than imprison you.",

        "With Saturn positioned in {saturn} in your birth chart, {first_name}, you carry a deep-seated fear of failure that, while motivating in small doses, can become paralyzing when unchecked. This Saturnian influence creates impossibly high standards for yourself — standards you would never impose on others. You may find yourself procrastinating on important projects not from laziness, but from a subconscious fear that the result will not meet your exacting criteria. Learning to embrace imperfect action over perfect inaction is a crucial growth edge.",

        "The Rahu placement in {rahu} within your natal chart, {name}, indicates a soul-level pattern of chasing external validation and material benchmarks as proof of self-worth. There are seasons when you may become so consumed by achievement that you neglect emotional needs and close relationships. This restless desire for more is Rahu's signature pattern. Your growth lies in recognizing that your intrinsic value is not determined by external accomplishments, but by the depth of your character.",

        "Your Venus in {venus}, while granting you appreciation for beauty and harmony, also creates a vulnerability to people-pleasing behavior, {first_name}. You may find it genuinely difficult to say no, set firm boundaries, or express displeasure even when treated unfairly. This desire to maintain peace at all costs can lead to resentment building beneath your composed exterior. The {nakshatra} Nakshatra influence suggests that learning to voice your needs directly and gracefully is one of the most transformative lessons of your lifetime.",

        "With Ketu in {ketu} in your chart, {name}, you carry an unconscious tendency to detach emotionally during moments that require your full engagement. This manifests as periodic withdrawal from relationships or commitments just when they reach critical depth. People close to you may perceive this as inconsistency, when it is actually a spiritual defense mechanism rooted in deep karmic patterns. Recognizing this consciously and choosing to stay present through discomfort will unlock profound personal growth."
    ],

    "personality_talents": [
        "Hidden within the celestial architecture of your chart, {name}, lies a remarkable talent for intuitive problem-solving. The combination of your {nakshatra} Nakshatra perception and Mercury in {mercury} gives you an almost psychic ability to identify patterns and connections that others completely miss. You can walk into a chaotic situation and instinctively see the thread that unravels the entire knot. This makes you an exceptional counselor, strategist, and mediator — roles where your natural gifts flourish with extraordinary impact.",

        "{first_name}, your Jupiter in {jupiter} combined with your {lagna} Lagna reveals a latent gift for teaching, mentoring, and transmitting complex ideas in accessible ways. Whether through writing, speaking, or one-on-one guidance, you have a rare ability to make difficult concepts feel approachable and empowering. This talent often goes unnoticed because you exercise it so naturally, but it is a genuine cosmic gift that, when cultivated deliberately, can become a powerful vehicle for influence and lasting service.",

        "The Venus placement in {venus} in your birth chart, {name}, conceals an extraordinary talent for creating beauty, harmony, and aesthetic experiences. This may manifest as an eye for design, sensitivity to music, a gift for styling environments, or an ability to orchestrate experiences that elevate the moods of everyone present. Your {rasi} Moon sign adds emotional depth to this aesthetic intelligence, allowing you to create not just beautiful things but meaningful ones that touch the soul.",

        "Your Mars in {mars} harbors a hidden talent for crisis management and decisive leadership under pressure, {first_name}. While you may not seek out leadership roles, you discover your most powerful capabilities precisely when circumstances demand immediate, courageous action. This latent warrior energy, combined with the emotional intelligence of your {nakshatra} Nakshatra, means you lead through calm clarity that inspires trust in those around you during the most challenging moments.",

        "A deeply concealed gift in your chart, {name}, is your capacity for spiritual perception and energetic sensitivity. The Ketu placement in {ketu} grants you access to layers of reality that most people cannot perceive — a subtle awareness of energies, intentions, and unspoken truths. You may experience this as strong gut feelings, vivid dreams, or an uncanny ability to read people's true motivations. Honoring and developing this sensitivity will become one of your greatest assets in both personal and professional domains."
    ],

    "personality_nature": [
        "{name}, your emotional nature is profoundly shaped by the Moon's placement in {rasi}, creating a rich inner world that operates on multiple levels simultaneously. You experience feelings with an intensity that few people around you can fully appreciate. The {nakshatra} Nakshatra influence adds spiritual sensitivity, meaning your emotions often carry intuitive messages about the people and situations around you. Learning to distinguish between your own feelings and those you absorb from your environment is a lifelong practice worth mastering.",

        "With Venus in {venus} and your Moon in {rasi}, {first_name}, your emotional core is wired for deep, meaningful connection. Surface-level relationships leave you feeling hollow, and you instinctively seek bonds that offer mutual vulnerability and authentic exchange. This emotional depth is both your greatest gift and challenge — it allows you to love profoundly, but it also means that dishonesty or emotional neglect wounds you more deeply. Surrounding yourself with emotionally mature individuals is essential for your well-being.",

        "The interplay between your Sun in {sun} and Moon in {rasi} creates a fascinating emotional duality, {name}. Outwardly, you project confidence, stability, and composure — the signature of your {lagna} Lagna. Internally, your emotional waters run deep and turbulent, processing complex feelings that your public persona rarely reveals. This gap between inner experience and outer expression can create periods of loneliness, as others assume you are fine when you are navigating profound emotional landscapes.",

        "Saturn in {saturn} in your chart, {first_name}, adds emotional maturity and restraint that sometimes manifests as emotional guardedness. You learned early in life to contain your feelings rather than freely express them. While this Saturnian discipline gives you extraordinary emotional resilience, it can also create barriers to intimacy. Your {nakshatra} Nakshatra gently encourages you to soften these walls with trusted people, allowing vulnerability to strengthen rather than threaten your foundations.",

        "Your emotional nature carries a distinctly philosophical quality thanks to Jupiter's presence in {jupiter}, {name}. You process feelings through the lens of meaning — asking not just what you feel, but why you feel it and what lesson it carries. This philosophical emotional intelligence allows you to recover from setbacks faster than most, because you instinctively search for growth within every painful experience. However, this same tendency can sometimes intellectualize emotions that simply need to be felt and released."
    ],

    # =====================================================================
    #  CAREER
    # =====================================================================

    "career_growth": [
        "{name}, your professional trajectory is powerfully shaped by the Sun in {sun} and Saturn in {saturn}, creating a career path that rewards patience, discipline, and long-term strategic thinking. Unlike those who achieve overnight success, your chart indicates a gradual but ultimately far more sustainable rise to professional prominence. The early years may test your resolve through slow progress, but these are Saturnian lessons building the unshakeable foundation upon which your greatest achievements will stand. Trust the timing of your ascent.",

        "With Mercury in {mercury} governing your professional communication, {first_name}, you possess a significant advantage in any field valuing clarity, analysis, and the ability to translate complex information into actionable insights. Your {lagna} Lagna adds a commanding presence in professional settings, ensuring your ideas are seriously considered. The {nakshatra} Nakshatra influence suggests your career will undergo at least one significant evolution, leading toward work aligned with your soul's authentic purpose.",

        "Jupiter's placement in {jupiter}, {name}, indicates that your career growth will be significantly accelerated by mentors and influential guides who recognize your potential before you fully see it yourself. These Jupiterian figures will appear at critical junctures, offering opportunities, wisdom, or connections that reshape your professional landscape. Your role is to remain open to guidance, even when Mars in {mars} urges stubborn independence. Collaboration and humility are catalysts for advancement.",

        "The Rahu placement in {rahu} in your natal chart, {first_name}, suggests your most significant career breakthroughs will come through unconventional paths, emerging technologies, or roles that did not exist when you started working. Rahu rewards innovation and calculated risk-taking. You are cosmically designed to be a pioneer in your field, not a follower of established methods. The challenge is balancing this drive for novelty with the disciplined execution that Saturn in {saturn} demands for lasting success.",

        "Your career timeline, {name}, is marked by distinct phases of intense growth followed by periods of apparent stagnation — a pattern directly linked to Saturn and Jupiter transits through your professional houses. During growth phases, seize every opportunity for visibility and skill acquisition. During plateaus, focus on consolidation and building internal capabilities that power your next surge. Understanding this cyclical nature prevents frustration and maximizes momentum."
    ],

    "career_business": [
        "{name}, your entrepreneurial potential is highlighted by a strong Mercury in {mercury}, indicating exceptional skill in negotiations, trade, and strategic alliances. Your {rasi} Moon sign provides the emotional intelligence to read markets, clients, and partners with uncanny accuracy. Combined with the steady discipline of Saturn in {saturn}, you have the cosmic ingredients for building ventures that grow slowly but withstand economic turbulence that destroys less grounded enterprises.",

        "Regarding independent ventures, {first_name}, your chart shows a calling for consultancy, advisory roles, or service-based businesses where your personal expertise is the core product. Jupiter in {jupiter} suggests success in fields related to education, technology, wellness, or philosophical services. Your {nakshatra} Nakshatra influence ensures you attract clients who genuinely resonate with your values, creating a business built on trust and repeat engagement rather than aggressive marketing.",

        "The Mars placement in {mars} within your business house, {name}, grants you the competitive drive needed to survive in challenging markets. However, your greatest business advantage is not aggression but strategic patience. You excel at identifying underserved niches, building systematic processes, and creating value that compounds over time. Rahu in {rahu} adds a gift for spotting trends before they become mainstream, giving you a critical first-mover advantage in emerging sectors.",

        "Your Venus in {venus} brings a unique aesthetic sensibility to your business ventures, {first_name}. Whether you are in a creative industry or a technical field, your ability to make products, services, and brand experiences feel premium and carefully curated sets you apart from competitors. Clients and customers instinctively feel the quality of care you invest. This Venusian touch transforms ordinary businesses into brands that inspire genuine loyalty and emotional attachment.",

        "With your Lagna in {lagna} and Sun in {sun}, {name}, you project natural authority that attracts partnerships and investment. People trust your judgment and vision, which is your most valuable business asset. The Ketu influence in {ketu} suggests you may eventually move toward a purpose-driven enterprise that balances profit with meaningful social contribution — a transition that will feel deeply fulfilling and ultimately prove more financially sustainable than purely profit-motivated ventures."
    ],

    "career_leadership": [
        "Your leadership profile, {name}, is characterized by quiet authority, strategic foresight, and exceptional empathy — a combination shaped by your {lagna} Lagna and Moon in {rasi}. You do not lead through dominance or volume but through the consistent quality of your decisions and the genuine care you show for those in your charge. This servant-leadership style, while slower to establish, builds far deeper loyalty and team cohesion than more authoritarian approaches.",

        "As a leader, the stars reveal that you operate with charismatic influence and clear vision, {first_name}. Mercury in {mercury} gives you the ability to articulate a compelling direction, while Jupiter in {jupiter} provides the philosophical depth to connect daily work to larger purpose. Your {nakshatra} Nakshatra influence adds a layer of intuitive people-reading that helps you place the right individuals in the right roles, maximizing collective potential.",

        "Saturn in {saturn} grants you a leadership style built on structured discipline, high standards, and fair judgment, {name}. You expect excellence but you lead by example, never asking others to do what you would not do yourself. This Saturnian integrity earns you credibility that no title or position can manufacture. Your teams know they can trust your word, your process, and your commitment to their development.",

        "With Mars in {mars} in your chart, {first_name}, you excel in leadership scenarios that require decisive action under uncertainty. While others deliberate endlessly, you can assess a complex situation, identify the critical path, and mobilize resources with impressive speed. This is not impulsiveness — it is the product of your analytical Mercury in {mercury} working in concert with martial decisiveness. In crisis situations, you are the leader everyone instinctively turns to.",

        "Your leadership potential is marked by innovative problem-solving and an open collaborative style, {name}, courtesy of Rahu in {rahu}. You challenge conventional thinking, encourage experimentation, and create environments where creative risk-taking is safe. Your Venus in {venus} softens this disruptive energy with warmth and inclusivity, ensuring that your push for innovation never alienates team members. This combination makes you especially effective in organizations undergoing transformation or rapid growth."
    ],

    # =====================================================================
    #  RELATIONSHIP
    # =====================================================================

    "relationship_marriage": [
        "{name}, your marriage sector is influenced by Venus in {venus} and the seventh house dynamics of your {lagna} Lagna, indicating a marital path that deepens and enriches over time. Your ideal partner will likely possess qualities associated with your seventh house sign — someone who complements rather than mirrors your personality. The {nakshatra} Nakshatra influence suggests that your most fulfilling relationship will be one that supports mutual spiritual and emotional growth, not just material compatibility.",

        "Regarding marital life, {first_name}, your chart highlights a path of deep transformation through intimate partnership. Jupiter in {jupiter} promises a spouse who brings wisdom, optimism, and philosophical depth to your union. However, Saturn in {saturn} warns that the relationship will require patience during testing periods — phases that, when navigated with mutual respect, forge an unbreakable bond that lesser relationships cannot survive. Your marriage will be defined by its ability to endure and evolve.",

        "The Moon in {rasi} in your chart, {name}, reveals that emotional security within marriage is your deepest need. You thrive when your partner provides consistent warmth, honest communication, and a safe space for vulnerability. Rahu in {rahu} may create periods where external ambitions compete with domestic harmony — a tension you must manage consciously. The most successful phase of your married life begins when you learn to prioritize emotional presence over professional accomplishment.",

        "Mars in {mars} brings passion and intensity to your marital dynamics, {first_name}. Your partnerships will never be bland or routine — there is a cosmic spark that keeps the relationship vibrant. However, this same Martian energy can create friction if both partners insist on dominance. The celestial advice for your marriage is to channel this fire into shared adventures, collaborative projects, and constructive debates rather than allowing it to become destructive conflict.",

        "With Ketu in {ketu} influencing your relationship sector, {name}, you carry a karmic pattern of emotional detachment at critical moments in your marriage. This is not indifference but a deep spiritual pattern of protecting yourself from the vulnerability that true intimacy demands. Recognizing this tendency and consciously choosing engagement over withdrawal will transform your marital experience from comfortable coexistence into profound spiritual partnership."
    ],

    "relationship_compatibility": [
        "{name}, your Vedic compatibility profile is shaped by the interplay between your {rasi} Moon sign and your {nakshatra} Nakshatra, creating specific harmonic frequencies that resonate with certain zodiac energies. You are most naturally compatible with partners whose Moon signs form trine or sextile aspects with your own, particularly those born under nakshatras that share your elemental affinity. Venus in {venus} adds a preference for partners who value aesthetic beauty, emotional refinement, and thoughtful communication.",

        "Your {lagna} Lagna creates an attraction pattern, {first_name}, where you are drawn to individuals who embody the qualities of your seventh house. This often means you are attracted to people who possess strengths that complement your perceived weaknesses — creating a dynamic of mutual completion. Jupiter in {jupiter} ensures that your most successful relationships will be those where both partners support each other's growth rather than reinforcing comfortable stagnation.",

        "The Mercury placement in {mercury}, {name}, indicates that intellectual compatibility is non-negotiable for your long-term happiness. You need a partner who can match your conversational depth, appreciate your analytical observations, and engage in meaningful dialogue that goes beyond daily logistics. Relationships that lack this mental connection, regardless of physical or financial compatibility, will eventually leave you feeling profoundly lonely and unfulfilled.",

        "Saturn in {saturn} in your relationship house, {first_name}, suggests that age differences, cultural differences, or unconventional relationship timelines may feature prominently in your love story. You may marry later than peers, or choose a partner that surprises your social circle. These Saturnian patterns are not obstacles but cosmic design — ensuring that when you commit, you do so with the maturity and self-knowledge necessary for a lasting, meaningful partnership.",

        "Mars in {mars} and Venus in {venus} together define your romantic chemistry, {name}. You are attracted to partners who balance strength with tenderness, ambition with warmth, and independence with loyalty. The {nakshatra} Nakshatra influence adds a preference for partners who possess spiritual depth or philosophical curiosity. Your most compatible relationships will be those where passion is sustained not just through physical attraction but through continuous intellectual and spiritual discovery."
    ],

    "relationship_family": [
        "Your domestic alignment, {name}, is deeply influenced by the Moon in {rasi} and the fourth house dynamics of your chart. Family represents not just a social unit but an emotional anchor that directly impacts your professional performance, health, and spiritual well-being. The {nakshatra} Nakshatra influence creates a strong attachment to ancestral wisdom, family traditions, and the emotional legacy passed down through generations. Honoring these roots while forging your own path is a lifelong balancing act.",

        "Jupiter in {jupiter} blesses your family life with periods of abundance, celebration, and joyful expansion, {first_name}. Children, if present, will bring transformative growth to your character — challenging your patience but rewarding you with unconditional love that heals deep wounds. Saturn in {saturn} ensures that your family responsibilities are taken seriously, sometimes to the point of self-sacrifice. Learning to nurture yourself with the same dedication you show your family is a crucial lesson.",

        "With Venus in {venus} influencing your domestic sphere, {name}, your home environment must reflect beauty, order, and harmonious energy for you to feel psychologically grounded. Cluttered, chaotic, or aesthetically neglected living spaces directly drain your emotional reserves and impact your mood. Investing in your home environment is not vanity — it is a practical act of self-care that the cosmos strongly endorses for your specific chart configuration.",

        "The Rahu influence in {rahu} on your family dynamics, {first_name}, suggests potential tensions around generational expectations versus personal ambitions. Your family may have strong opinions about your life path, career choices, or relationship decisions that conflict with your soul's direction. Navigating these tensions with honesty and compassion — rather than rebellion or silent compliance — is essential for maintaining family harmony while honoring your authentic self.",

        "Mars in {mars} in your family sector, {name}, indicates that you may take on a protective, guardian-like role within your family structure. You are the person family members call in emergencies, the one who steps up during crises, and the one who fights fiercely for the well-being of those you love. While this protective instinct is admirable, your {nakshatra} Nakshatra reminds you to also allow family members the space to face their own challenges and grow through their own struggles."
    ],

    # =====================================================================
    #  FINANCIAL
    # =====================================================================

    "financial_wealth": [
        "{name}, your wealth potential is fundamentally anchored by Jupiter in {jupiter} and the second house dynamics of your chart, indicating a pattern of gradual, systematic wealth accumulation rather than sudden windfalls. Your {rasi} Moon sign provides the emotional discipline to delay gratification and invest in long-term assets. Saturn in {saturn} reinforces this patient approach, rewarding consistent effort over speculative gambling. Your greatest financial growth will come in the second half of your productive years, building on foundations laid earlier.",

        "The Mercury placement in {mercury}, {first_name}, grants you a sharp financial mind capable of analyzing investment opportunities, market patterns, and economic trends with above-average accuracy. Combined with the practical instincts of your {lagna} Lagna, you have a natural talent for identifying value where others see risk. Your wealth trajectory is closely linked to your willingness to educate yourself about financial instruments, tax strategies, and asset diversification — knowledge that directly translates into compounding returns.",

        "Venus in {venus} in your wealth sector, {name}, suggests that your most profitable ventures will be those connected to beauty, luxury, quality craftsmanship, creativity, or services that enhance people's quality of life. You have an instinctive understanding of what people value and are willing to pay a premium for. This Venusian wealth insight, combined with the disciplined execution of Saturn in {saturn}, creates a powerful formula for building lasting financial abundance.",

        "Rahu in {rahu} in your chart, {first_name}, indicates periods of rapid, unexpected financial growth — but also warns of equal potential for sudden losses if greed overrides prudence. The key to unlocking Rahu's wealth potential without suffering its penalties is to maintain strict ethical boundaries in all financial dealings and to reinvest gains into stable, diversified assets rather than chasing increasingly speculative returns. Your {nakshatra} Nakshatra encourages a dharmic approach to wealth creation.",

        "Your Sun in {sun} illuminates a wealth identity tied to professional expertise and personal reputation, {name}. Unlike those who build wealth through inheritance or passive investments, your primary wealth engine is your own skill, knowledge, and professional credibility. Investing in your education, certifications, and personal brand will consistently yield the highest returns of any financial strategy available to you. Your reputation is your most valuable financial asset."
    ],

    "financial_habits": [
        "Your money habits, {name}, are characterized by the interplay between your frugal Saturn in {saturn} and your appreciative Venus in {venus}. This creates an internal tension between the desire to save every rupee and the equally strong desire to enjoy quality experiences and beautiful things. The key to financial harmony in your chart is not choosing one extreme over the other, but creating a structured budget that explicitly allocates funds for both security and enjoyment — without guilt for either.",

        "Mercury in {mercury} gives you a natural inclination toward tracking, analyzing, and optimizing your finances, {first_name}. You may enjoy spreadsheets, budgeting apps, or financial planning tools that give you a clear picture of your monetary landscape. Your {rasi} Moon sign adds emotional awareness to financial decisions — you instinctively know when a purchase is driven by genuine need versus emotional compensation. Trusting this internal compass while maintaining systematic tracking is your ideal financial practice.",

        "Jupiter in {jupiter} in your chart, {name}, creates a generous financial nature that can sometimes work against your own accumulation goals. You are the person who picks up the bill, lends money to friends without expecting repayment, and donates to causes that move you emotionally. While this generosity is spiritually commendable and karmically positive, your {nakshatra} Nakshatra advises establishing clear boundaries — a set percentage for giving and a non-negotiable minimum for personal savings.",

        "The Mars placement in {mars}, {first_name}, infuses your financial behavior with a competitive edge. You may be motivated by financial goals that involve outperforming benchmarks, achieving specific targets by certain dates, or building wealth faster than peers. This competitive energy, when channeled into disciplined investment strategies rather than impulsive trading, becomes a powerful wealth-building force. The danger zone is allowing ego-driven decisions to override your naturally sound financial instincts.",

        "Rahu in {rahu} can create phases of compulsive spending on status symbols, technology, or experiences designed to project success, {name}. During these Rahu-influenced periods, you may find yourself making purchases that feel urgent and essential in the moment but generate regret shortly afterward. Implementing a mandatory cooling-off period for any purchase above a set threshold is an effective strategy for your specific chart pattern. Your Saturn in {saturn} will thank you for this discipline."
    ],

    "financial_opportunities": [
        "Key wealth opportunities in your life, {name}, will emerge from the intersection of your Mercury in {mercury} analytical abilities and Jupiter in {jupiter} expansive vision. The stars indicate that your greatest financial breakthroughs will come through knowledge-based ventures — consulting, education, technology, or information services where your intellectual capital is the primary asset. The {nakshatra} Nakshatra influence suggests that these opportunities will multiply significantly when you align your work with a genuine sense of purpose and service.",

        "Your Venus in {venus}, {first_name}, opens lucrative opportunities in creative industries, luxury goods, wellness services, real estate, or any sector where aesthetic quality commands premium pricing. You have a natural ability to create or identify products and services that people emotionally connect with and are willing to pay a premium for. Combining this Venusian market sense with the structured discipline of your Saturn in {saturn} creates a sustainable wealth-building formula.",

        "Rahu in {rahu} in your financial house, {name}, points to exceptional opportunities in emerging technologies, digital platforms, international trade, or unconventional investment vehicles. You are cosmically positioned to benefit from disruptions that threaten traditional industries — but only if you stay informed, adaptable, and willing to move before the mainstream. Your {lagna} Lagna gives you the confidence to act on opportunities that others are too cautious to pursue.",

        "The Mars placement in {mars}, {first_name}, indicates that competitive markets, performance-based roles, or commissioned positions where compensation scales with results are particularly favorable for your wealth growth. You thrive financially when your income is directly tied to your effort and output rather than fixed by bureaucratic salary structures. This Martian financial energy also suggests potential in sports, fitness, defense, or engineering-related investment sectors.",

        "Jupiter's transit patterns through your chart, {name}, indicate specific windows of financial opportunity that repeat on approximately twelve-year cycles. During these Jupiterian windows, investments made with careful research yield disproportionately high returns. The current positioning of your planets suggests that the coming period is ripe for strategic financial moves — particularly those involving long-term asset acquisition, skill-based income diversification, or establishing passive revenue streams."
    ],

    # =====================================================================
    #  HEALTH
    # =====================================================================

    "health_physical": [
        "{name}, your physical constitution is shaped by the Sun in {sun} and Mars in {mars}, creating a body that thrives on regular, moderate physical activity but suffers significantly from prolonged sedentary periods. Your {rasi} Moon sign governs your digestive system, making dietary choices a crucial determinant of your overall energy levels. The {nakshatra} Nakshatra influence suggests particular sensitivity to seasonal transitions — your body may require deliberate adjustments in diet and exercise routine as seasons change.",

        "With Saturn in {saturn} in your health sector, {first_name}, you have a constitution built for endurance rather than explosive power. Your body rewards consistency over intensity — regular daily movement is far more beneficial than sporadic intense workouts followed by weeks of inactivity. Joint health, bone density, and skeletal alignment deserve special attention, as Saturn governs these structural elements. Incorporating weight-bearing exercises, calcium-rich foods, and regular posture correction will serve you well long-term.",

        "Mercury in {mercury} directly influences your nervous system, {name}, creating a mind-body connection where mental stress rapidly manifests as physical symptoms — tension headaches, digestive disruption, shoulder tightness, or sleep disturbance. Your body is essentially a barometer for your mental state. This means that conventional medical approaches alone may not resolve recurring physical complaints; addressing the underlying mental and emotional stress is equally critical for your specific chart.",

        "Venus in {venus} governs your kidneys, hormonal balance, and reproductive health, {first_name}. Adequate hydration, hormonal awareness, and regular health screenings in these areas are cosmically advised for your chart. Your {nakshatra} Nakshatra also highlights the throat and thyroid region as areas deserving periodic attention. A diet rich in antioxidants, healthy fats, and anti-inflammatory foods will directly support the Venusian organs in your constitution.",

        "The Rahu-Ketu axis across {rahu} and {ketu} in your chart, {name}, suggests that your health challenges may sometimes be difficult to diagnose through conventional means. You may experience symptoms that are vague, intermittent, or that do not fit neatly into standard medical categories. An integrative approach that combines modern diagnostics with traditional Ayurvedic or Vedic health practices will be particularly effective for your unique constitutional pattern."
    ],

    "health_mental": [
        "Mentally, {name}, your chart indicates a highly active intellect that requires intentional periods of quiet, screen-free rest, and meditative practice. Mercury in {mercury} creates a mind that processes continuously — even during sleep your subconscious is analyzing, sorting, and problem-solving. While this mental engine is a tremendous professional asset, it also means you are uniquely susceptible to cognitive fatigue and burnout. Scheduling deliberate mental rest is not luxury but medical necessity for your chart.",

        "Your Moon in {rasi}, {first_name}, creates emotional tides that directly influence your cognitive clarity. During emotionally turbulent periods, your typically sharp analytical abilities become clouded, and decision-making quality drops significantly. Developing awareness of these emotional-cognitive cycles and delaying important decisions during emotional low points is a practical strategy. Your {nakshatra} Nakshatra supports practices like journaling, breathwork, or guided meditation to restore mental equilibrium.",

        "Saturn in {saturn} adds a dimension of psychological resilience to your mental makeup, {name}, but also creates a tendency toward negative self-talk, catastrophic thinking, and chronic worry about future scenarios that may never materialize. This Saturnian mental pattern is not a character flaw but a planetary influence that can be managed through cognitive behavioral techniques, positive affirmations, and regular contact with optimistic, encouraging individuals who balance your cautious perspective.",

        "Jupiter in {jupiter} provides philosophical depth that serves as a powerful mental health resource, {first_name}. When others are consumed by anxiety over life's uncertainties, your Jupiterian perspective allows you to contextualize challenges within a larger framework of meaning and growth. Cultivating this philosophical outlook through reading, spiritual study, or meaningful conversations is not just intellectual enrichment but a genuine mental health practice for your specific chart.",

        "The Rahu influence in {rahu} on your mental patterns, {name}, can create periods of obsessive thinking, information overload, or anxiety about keeping pace with rapidly changing environments. Digital detoxes, nature immersion, and grounding practices are especially effective remedies for your chart. Your {nakshatra} Nakshatra suggests that connecting with earth elements — gardening, walking barefoot, or spending time near natural water — rapidly restores mental clarity and emotional balance."
    ],

    "health_lifestyle": [
        "Your ideal lifestyle, {name}, according to the cosmic blueprint of your chart, integrates natural rhythms, wholesome nutrition, and daily outdoor activity as non-negotiable foundations. The Sun in {sun} thrives on consistent wake-sleep cycles aligned with sunrise, while your Moon in {rasi} requires regular mealtimes to maintain digestive harmony. Your {nakshatra} Nakshatra influence suggests that routines established before 7 AM set the energetic tone for your entire day — making a structured morning practice your most powerful wellness tool.",

        "With Venus in {venus} governing your pleasure centers, {first_name}, your lifestyle must include regular doses of beauty, creative expression, and sensory enjoyment to maintain psychological balance. This is not indulgence — it is a physiological need specific to your chart. Schedule weekly activities that feed your aesthetic soul — visiting gardens, listening to live music, cooking elaborate meals, or arranging your living space. These Venusian practices directly boost your immune function and emotional resilience.",

        "Saturn in {saturn} in your lifestyle sector, {name}, advises a disciplined approach to health that prioritizes consistency over perfection. Rather than dramatic lifestyle overhauls, your chart responds best to small, sustainable changes implemented gradually and maintained indefinitely. A fifteen-minute daily walk is cosmically more valuable for your constitution than an occasional intensive fitness retreat. Patience and steady dedication are the keywords for your health optimization strategy.",

        "Mars in {mars} adds a need for physical challenge and competitive stimulation in your lifestyle, {first_name}. Purely passive relaxation quickly becomes boring and counterproductive for your Mars-influenced constitution. You need activities that engage both mind and body — martial arts, strategic sports, hiking challenging trails, or physical projects that produce tangible results. This Martian need for active engagement must be honored to prevent the restlessness and irritability that arise from physical stagnation.",

        "Your {nakshatra} Nakshatra, {name}, carries specific dietary and lifestyle recommendations rooted in thousands of years of Vedic observation. Aligning your daily routine with these Nakshatra-specific guidelines — including optimal meal timing, recommended food categories, favorable colors for your environment, and ideal meditation practices — creates a subtle but powerful harmonic alignment between your physical habits and celestial energies. This alignment compounds over time, producing noticeable improvements in vitality and emotional stability."
    ],

    # =====================================================================
    #  SPIRITUAL
    # =====================================================================

    "spiritual_karma": [
        "{name}, your karmic path is fundamentally defined by Saturn's position in {saturn}, the great cosmic teacher of patience, discipline, and accountability. This placement indicates that your soul chose this lifetime to confront and resolve patterns around responsibility, authority, and the honest use of power. The karmic lessons are rarely comfortable, but every challenge Saturn delivers is precisely calibrated to strengthen the specific qualities your soul needs to evolve to its next level of spiritual maturity.",

        "The Rahu-Ketu axis across {rahu} and {ketu} in your chart, {first_name}, reveals the central karmic tension of your lifetime. Rahu in {rahu} represents the desires, ambitions, and worldly experiences your soul is hungry to explore in this incarnation — often areas where you lack past-life experience and therefore approach with obsessive intensity. Ketu in {ketu} represents the skills and wisdom you have already mastered in previous lifetimes — abilities that come so naturally you may take them for granted. Balancing these poles is your core karmic assignment.",

        "Your Moon in {rasi} carries emotional karma related to nurturing, security, and belonging, {name}. You may have entered this lifetime with unresolved patterns around receiving care, expressing emotional needs, or creating a sense of home and safety. The {nakshatra} Nakshatra influence adds specific nuances to this emotional karma — ancestral patterns, family debts of gratitude, or inherited emotional wounds that your soul volunteered to heal and transcend in this incarnation.",

        "Jupiter in {jupiter} in your chart, {first_name}, indicates positive karmic credits in the domains of wisdom, teaching, and spiritual guidance. These are areas where past-life merit has been accumulated and where this lifetime offers opportunities to both benefit from and further expand this karmic investment. When you act as a guide, mentor, or source of wisdom for others, you are directly engaging with your most powerful positive karma and generating further spiritual merit.",

        "Mars in {mars} carries warrior karma, {name} — past-life patterns related to courage, conflict, protection, and the use of force. Your soul is working through questions about when action is righteous, when patience is more powerful than aggression, and how to channel intense energy toward construction rather than destruction. The {nakshatra} Nakshatra placement refines this Mars karma with specific lessons about the relationship between power and compassion in your evolutionary journey."
    ],

    "spiritual_lessons": [
        "A major life lesson for your soul, {name}, is mastering the art of detachment from external validation and trusting your inner voice. Saturn in {saturn} and Ketu in {ketu} together create a powerful spiritual curriculum around self-reliance, authentic self-expression, and the courage to walk an unconventional path without needing approval from family, society, or peers. This lesson may manifest through repeated situations where external validation is withdrawn precisely to force you back to your internal compass.",

        "Your chart reveals a significant spiritual lesson around the balance between material success and internal peace, {first_name}. The Rahu placement in {rahu} creates a strong gravitational pull toward worldly achievement, while Jupiter in {jupiter} calls you toward philosophical depth and spiritual meaning. The lesson is not choosing one over the other but learning to pursue material goals with spiritual consciousness and to practice spirituality without abandoning practical responsibility.",

        "The Moon in {rasi} carries a key spiritual lesson about emotional sovereignty, {name} — the ability to experience intense feelings without being controlled by them. Your {nakshatra} Nakshatra specifically teaches the difference between emotional depth and emotional reactivity. You are learning to feel everything fully while maintaining the witnessing awareness that prevents emotions from hijacking your decisions, relationships, or sense of self. This is one of the most advanced spiritual capacities your soul is developing.",

        "Venus in {venus} presents a spiritual lesson about the relationship between love and attachment, {first_name}. You are learning to love generously without possessiveness, to appreciate beauty without clinging to it, and to enjoy pleasure without becoming dependent on it. This Venusian lesson is subtle but profound — it asks you to hold everything you love with open hands, trusting that what is truly meant for you cannot be lost, and what leaves was never truly yours.",

        "Mars in {mars} and Saturn in {saturn} together present a spiritual lesson about the right use of will and discipline, {name}. You are learning when to push forward and when to surrender, when to fight and when to accept, when to assert your boundaries and when to soften them. This dynamic tension between Martian action and Saturnian patience is the forge in which your spiritual character is being tempered — creating a soul of extraordinary strength, wisdom, and balanced power."
    ],

    "spiritual_purpose": [
        "Your ultimate soul purpose, {name}, as encoded in your celestial blueprint, is to guide and uplift others through the wisdom you accumulate through your own trials and transformations. Jupiter in {jupiter} and your {nakshatra} Nakshatra together point toward a life mission centered on wisdom-sharing — whether through teaching, counseling, writing, healing, or simply being a model of conscious living that inspires others to examine their own paths. Your purpose is not to have all the answers but to ask the questions that awaken others.",

        "With your Lagna in {lagna} and Sun in {sun}, {first_name}, your divine purpose involves bringing order, clarity, and structure to environments that are chaotic, confused, or lacking direction. You are a cosmic architect — someone whose presence naturally organizes energy, resolves confusion, and creates frameworks within which others can thrive. This purpose may manifest in organizational leadership, community building, systems design, or any role where you create structures that serve collective well-being.",

        "The Rahu-Ketu axis across {rahu} and {ketu}, {name}, reveals a life purpose that bridges two worlds — the material and the spiritual, the traditional and the innovative, the individual and the collective. You are here to demonstrate that these apparent opposites can be harmonized, that spiritual depth does not require material poverty, and that innovation can honor tradition rather than destroy it. This bridge-building purpose makes your life inherently interesting and your contribution uniquely valuable.",

        "Your Moon in {rasi} and Venus in {venus} together point toward a purpose centered on emotional healing and the creation of beauty that serves a deeper function, {first_name}. You are here to show that aesthetics and functionality, emotion and logic, softness and strength are not opposing forces but complementary expressions of a unified cosmic intelligence. Whether through art, design, therapy, hospitality, or parenting, your purpose is to create environments and experiences that heal, nourish, and elevate.",

        "Saturn in {saturn} as a key purpose-indicator in your chart, {name}, suggests that your divine mission involves mastering and then teaching the disciplines of patience, perseverance, and ethical conduct. Your life is designed to demonstrate that shortcuts lead to dead ends, that integrity is the only sustainable foundation, and that the rewards of disciplined effort far exceed the fleeting pleasures of easy gains. By living these principles authentically, you become a lighthouse for others navigating the temptation of the expedient path."
    ],

    # =====================================================================
    #  TODAY'S PREDICTION
    # =====================================================================

    "today_overall": [
        "Today, {name}, the cosmic energies flowing through your {rasi} Moon sign and {lagna} Lagna create a powerful opportunity for clarity and intentional action. The current transit of the Moon through your chart activates your house of personal initiative, making this an excellent day to begin projects you have been contemplating. Trust the intuitive nudges you receive before noon — they carry the signature of your {nakshatra} Nakshatra's deep wisdom. Stay grounded and let your natural decisiveness guide you.",

        "Under the current lunar influence, {first_name}, your emotional intelligence is heightened, allowing you to navigate interpersonal dynamics with unusual grace and perceptiveness. Mercury's current position amplifies communication from your natal Mercury in {mercury}, making this a favorable day for important conversations, negotiations, or written correspondence. Avoid rushing through interactions — the cosmic energy today rewards thoughtful, deliberate engagement.",

        "With planetary forces activating your solar house today, {name}, you will feel a strong impulse to restructure your daily routine and clarify your priorities. This urge comes from Saturn's interaction with your natal Saturn in {saturn} and should be honored rather than resisted. Spend some time this morning writing down your top three priorities for the week. This simple act of alignment will amplify your effectiveness throughout the day.",

        "Today's celestial pattern indicates that your intuition, guided by the {nakshatra} Nakshatra influence, is operating at peak capacity, {first_name}. Pay special attention to dreams from last night and spontaneous thoughts that arise during quiet moments. Jupiter's current aspect to your natal Jupiter in {jupiter} suggests that philosophical insights and creative solutions will emerge naturally. Keep a note-taking device close — your best ideas today will arrive unannounced.",

        "As celestial bodies transit through your chart today, {name}, a wave of constructive enthusiasm is boosting your mental focus and creative energy. Mars is energizing your natal Mars in {mars}, bringing determination and courage to tackle challenges you may have been avoiding. This is a day for bold action in areas where hesitation has been holding you back. The cosmos is providing the push — your job is to move in the direction your heart has been pointing."
    ],

    "today_career": [
        "In your professional domain today, {name}, the planetary transits suggest a sudden rise in creative ideas and collaboration opportunities. Mercury's current aspect to your natal Mercury in {mercury} sharpens your analytical abilities, making complex tasks feel more manageable. Your {lagna} Lagna adds an extra layer of professional magnetism — colleagues and superiors will be more receptive to your input than usual. Approach any meetings or presentations with confidence; the stars support clear, impactful communication.",

        "Regarding your career path today, {first_name}, Saturn's transit is interacting with your natal Saturn in {saturn}, creating a powerful focus on long-term strategy rather than short-term gains. Use this energy to review your professional development plan, update your skills inventory, or have a strategic conversation with a mentor. The {nakshatra} Nakshatra influence supports detailed planning work that will pay dividends in the coming months.",

        "Your workspace is charged with productive cosmic energy today, {name}, courtesy of Jupiter's favorable aspect to your natal chart. This is an excellent day for pitching ideas, submitting proposals, or initiating conversations about advancement. The key is to lead with value rather than ambition — show decision-makers what you can contribute, and recognition will follow naturally. Your Mars in {mars} adds persuasive energy to your professional interactions.",

        "A favorable aspect from the transiting Sun to your natal Mercury in {mercury} makes today exceptional for intellectual work, {first_name}. Research, analysis, writing, and any task requiring sustained mental focus will benefit from this cosmic tailwind. Your {rasi} Moon sign adds emotional intelligence to your professional interactions, helping you read the room and adjust your approach for maximum effectiveness. Trust your instincts about timing — if something feels premature, it probably is.",

        "Today's cosmic currents in your career house, {name}, are showing recognition for persistent efforts. The Saturn transit rewards those who have been consistently dedicated, and your chart indicates that quiet, sustained work is beginning to attract the attention it deserves. A senior figure or decision-maker may offer unexpected acknowledgment or opportunity. Your {nakshatra} Nakshatra urges you to receive this gracefully while continuing to deliver excellent work."
    ],

    "today_finance": [
        "Financially, {name}, today's planetary positions suggest a favorable day for reviewing and optimizing your financial strategy. Jupiter's aspect to your wealth house creates an expansive energy around money consciousness — this is an excellent time to research investment options, review subscription costs, or optimize your budget. Your Mercury in {mercury} provides the analytical clarity needed to make sound financial decisions. Avoid impulse purchases but remain open to valuable opportunities.",

        "Regarding your wealth and resources today, {first_name}, Venus's transit is interacting with your natal Venus in {venus}, heightening both your appreciation for quality and your spending impulses. The cosmic advice is to enjoy the beauty around you without reaching for your wallet — window-shop, browse, and bookmark items for later review. Saturn in {saturn} supports a disciplined approach to finances today. Small acts of financial optimization will compound into significant gains.",

        "Your monetary house is experiencing a stabilizing transit today, {name}, suggesting this is a better day for consolidating existing resources than for taking on new financial commitments. The {nakshatra} Nakshatra influence encourages gratitude for what you currently have rather than anxiety about what you lack. A balanced perspective on finances today will reveal that you are in a more secure position than your worries may suggest.",

        "Cosmic financial patterns today show, {first_name}, that creative ideas could point toward a secondary stream of income. Mars in {mars} adds entrepreneurial energy to your financial thinking. Pay attention to problems you notice in your daily life — your natural problem-solving abilities, influenced by Mercury in {mercury}, may identify a service gap that represents a genuine business opportunity. Even noting the idea down is a valuable step forward.",

        "In terms of material security today, {name}, the stars highlight that a balance between spending and saving is essential. Rahu's current transit may create an urge for unnecessary luxury purchases that feel urgent but are not. Your Saturn in {saturn} provides the counterbalancing discipline to resist impulsive financial decisions. Focus on utility rather than luxury, and channel any financial restlessness into productive research about long-term wealth-building strategies."
    ],

    "today_relationship": [
        "In your social and emotional circle today, {name}, Venus's transit activates warm, connective energies in your relationship house. This is an excellent day for expressing appreciation to loved ones, reconnecting with friends you have been meaning to contact, or having a heartfelt conversation with a partner. Your Moon in {rasi} amplifies your emotional receptivity, making it easier to sense and respond to the unspoken needs of those around you.",

        "Your personal relationships are influenced by a transit that brings deep empathy and mutual support today, {first_name}. Mercury's aspect to your natal Mercury in {mercury} enhances communication within close relationships, making this a favorable time for clearing up misunderstandings or sharing feelings you have been holding back. The {nakshatra} Nakshatra influence adds a layer of spiritual connection to your interactions — conversations today may reach unusual depth and meaning.",

        "Regarding matters of the heart today, {name}, Jupiter's transit through your relationship sector encourages generosity, forgiveness, and expansive love. If there have been tensions with a partner, family member, or close friend, the cosmic energy today supports reconciliation and renewed understanding. Your Venus in {venus} adds charm and diplomatic grace to your interactions. A gentle gesture or kind word will heal more than you realize.",

        "The emotional current today encourages you to reconnect with an old friend or family member who has been on your mind, {first_name}. This impulse is not random — it is your {nakshatra} Nakshatra's intuitive radar detecting that this person needs your presence or that the reconnection will bring unexpected blessings. Mars in {mars} provides the initiative to make the first move. Be honest about your emotional needs without being demanding.",

        "Communication with loved ones is enhanced today, {name}, creating opportunities for warmth, shared joy, and deeper bonding. Your {lagna} Lagna projects reassuring stability that helps others feel safe opening up to you. The challenge today is listening more than speaking — your Mercury in {mercury} may make you eager to analyze and advise, but what your relationships need most is your attentive, non-judgmental presence."
    ],

    "today_health": [
        "Health-wise, {name}, today's planetary alignments suggest focusing on hydration, posture correction, and light physical movement. Your Sun in {sun} benefits from morning sunlight exposure — even fifteen minutes of outdoor time before 9 AM will positively influence your circadian rhythm and mood throughout the day. The {nakshatra} Nakshatra influence emphasizes the connection between respiratory health and mental clarity. Deep breathing exercises will be particularly effective today.",

        "Regarding physical and mental wellness today, {first_name}, Mars's transit is boosting your overall stamina and physical energy, making this a great day for exercise, sports, or physically demanding tasks. Your Mars in {mars} responds strongly to this cosmic activation. However, avoid overexertion — the goal is energizing movement, not exhausting effort. A brisk walk, yoga session, or moderate workout will yield the best mind-body benefits.",

        "Your physical vitality today is supported by favorable planetary aspects, {name}, but Mercury's transit warns against mental overload. Your Mercury in {mercury} is working overtime, which can create tension headaches or eye strain if not managed. Take regular breaks from screens, step outside periodically, and ensure you are drinking adequate water. Saturn in {saturn} reminds you that sustainable energy comes from disciplined self-care, not caffeine-fueled pushing through fatigue.",

        "Today's cosmic health alignment, {first_name}, highlights the importance of balancing active work hours with intentional rest periods. Your Moon in {rasi} is particularly sensitive to emotional stress today, which can manifest as digestive discomfort or disrupted sleep patterns. Incorporate calming foods — warm beverages, light soups, and fresh fruits — and avoid heavy, processed meals especially in the evening. Your {nakshatra} Nakshatra supports early-evening relaxation routines.",

        "In terms of well-being today, {name}, planetary energies indicate that your emotional and physical states are closely linked. Venus in {venus} suggests that activities bringing beauty and pleasure into your day will have measurable positive health effects — listening to music, spending time in a garden, or wearing colors that uplift your mood. These are not trivial suggestions; for your specific chart, aesthetic nourishment directly supports immune function and stress resilience."
    ],

    # =====================================================================
    #  TOMORROW'S PREDICTION
    # =====================================================================

    "tomorrow_energy": [
        "Tomorrow's cosmic atmosphere, {name}, brings a powerful drive for personal initiatives and new projects. The Moon's transit through your chart activates your {rasi} energy center, creating a day where emotional clarity and practical action align beautifully. Your {nakshatra} Nakshatra influence suggests that ideas arising tomorrow morning carry particular significance. Jupiter's aspect to your natal chart brings optimism and expansive thinking. Align your actions with your long-term vision and take steady, measured steps.",

        "The energetic signature of tomorrow highlights a calm, grounding energy that favors organization and focused execution, {first_name}. Saturn's transit interacts with your natal Saturn in {saturn}, rewarding disciplined work and systematic problem-solving. This is not a day for spontaneous adventure but for methodical progress on existing commitments. Your Mercury in {mercury} will be especially sharp, making analytical tasks feel effortless.",

        "As we look to tomorrow, {name}, the alignments indicate a highly social vibe encouraging connection and communication. Venus's transit activates your relationship sector, while Mercury enhances your natal Mercury in {mercury} for clear, charming self-expression. This is an excellent day for networking, reconnecting with colleagues, or having conversations that have been postponed. Open your heart to collaborative ventures and shared goals.",

        "Tomorrow's planetary positions manifest a major shift toward emotional reflection and inner growth, {first_name}. The Moon's transit through a contemplative sector of your chart, combined with Ketu's influence in {ketu}, creates space for profound self-discovery. Prepare for insights that arrive through quiet moments rather than active pursuit. Journaling, meditation, or solitary walks will be especially productive. Trust the flow of events without forcing outcomes.",

        "The energetic field surrounding you tomorrow, {name}, suggests an intense surge of creative energy and inspiration, fueled by Venus in {venus} and the artistic sensitivity of your {nakshatra} Nakshatra. Whether you express this through work, art, relationships, or personal projects, the cosmic current supports bold, imaginative action. Capture every idea that comes to you — tomorrow's creative insights may have lasting value."
    ],

    "tomorrow_career": [
        "Tomorrow in your career, {name}, the stars indicate a chance to present your ideas to key decision-makers. Mercury's transit enhances your natal Mercury in {mercury}, giving your words precision and persuasive power. Your {lagna} Lagna projects professional authority that commands attention. Prepare tonight for any important meetings or communications — the cosmic energy favors those who combine inspiration with preparation.",

        "Regarding your workspace tomorrow, {first_name}, Saturn's transit creates a busy schedule with multiple tasks requiring coordination and disciplined time management. Your Saturn in {saturn} thrives under this structured pressure. Prioritize your tasks by impact rather than urgency, double-check important documents for accuracy, and maintain a proactive stance. Tomorrow favors slow, steady progress over rushed shortcuts.",

        "Your professional house tomorrow will experience a breakthrough, {name}, in a problem or project you have been analyzing for weeks. Jupiter's favorable aspect to your chart creates sudden clarity and creative solutions. The {nakshatra} Nakshatra influence ensures that these insights are practical and implementable, not just theoretical. Act on fresh ideas quickly before the momentum fades. Stay collaborative and value input from colleagues.",

        "The career alignment for tomorrow shows positive recognition for your dedication and attention to detail, {first_name}. The Sun's transit illuminates your professional contributions, making them visible to people who matter. Mars in {mars} adds competitive energy — use it to push for excellence rather than for office politics. Your work ethic, combined with your {rasi} emotional intelligence, is your strongest professional asset.",

        "Planetary transits tomorrow suggest that your work life, {name}, will benefit from unexpected connections or information that reshapes your approach to a current challenge. Rahu's influence in {rahu} favors unconventional solutions and cross-disciplinary thinking. Keep your professional goals aligned with your personal values — this alignment is what distinguishes sustainable career success from hollow achievement."
    ],

    "tomorrow_finance": [
        "Financially, tomorrow highlights the need to review your long-term investments and savings strategy, {name}. Jupiter's transit creates an expansive view of your financial landscape, while Saturn in {saturn} urges practical, conservative action. Your Mercury in {mercury} provides the analytical clarity to identify optimization opportunities in your existing portfolio. Prioritize financial clarity in all partnerships and agreements you encounter.",

        "Regarding material security tomorrow, {first_name}, the cosmic pattern suggests an opportunity to optimize your budget and reduce unnecessary overhead. Venus in {venus} may create temptations for luxury spending, but your {nakshatra} Nakshatra wisdom advises restraint. Focus on building a reliable emergency fund and avoiding impulse purchases. A conservative approach to spending will yield peace of mind and long-term security.",

        "Your financial house tomorrow, {name}, will be influenced by a stable transit showing no major surprises or disruptions. This is actually positive — stability allows for thoughtful planning without the pressure of urgency. Use this calm energy to research financial opportunities, compare investment options, or consult a trusted advisor about your long-term wealth strategy. Boring financial days are often the most productive for wealth building.",

        "Tomorrow's planetary positions regarding wealth, {first_name}, show caution in signing financial agreements or high-cost contracts. Mercury's retrograde influence on your chart suggests that hidden details or unfavorable terms may not be immediately apparent. Take your time, read the fine print, and trust your instincts if something feels rushed. Your Saturn in {saturn} supports patience over haste in all financial decisions.",

        "In terms of resources tomorrow, {name}, a favorable aspect for planning future monetary ventures emerges from Jupiter's interaction with your wealth house. This is an excellent day for financial visioning — setting goals, creating budgets, and mapping out your path to specific financial milestones. Your {rasi} Moon sign adds emotional wisdom to financial decisions. Trust your feelings about money matters as much as your analysis."
    ],

    "tomorrow_relationship": [
        "In terms of relationships tomorrow, {name}, the cosmic alignment favors warm, constructive dialogues that clarify long-term goals and deepen emotional understanding. Venus's transit through your relationship sector enhances your {venus} natal influence, creating opportunities for romantic connection, friendship renewal, and family bonding. Express your appreciation through meaningful actions rather than just words — your {nakshatra} Nakshatra supports gestures of genuine care.",

        "Matters of connection and love tomorrow, {first_name}, will bring a deeper emotional bond through shared experiences with someone close to you. The Moon's transit through your chart activates your {rasi} emotional depth, making you more attuned to your partner's or friend's unspoken feelings. Allow others to share their perspectives without interrupting. A small token of kindness will go a long way in strengthening your most important bonds.",

        "Your relationship sector tomorrow is influenced by Saturn in {saturn}, {name}, creating a focus on giving space and practicing active patience. Not every relationship challenge requires immediate resolution — some tensions dissolve naturally when both parties are given room to process independently. Stay authentic to your feelings while remaining empathetic. Your Mercury in {mercury} helps you choose words that build bridges rather than walls.",

        "Tomorrow's energetic ties with family and partners, {first_name}, show an opportunity to resolve a lingering disagreement with an open mind and generous heart. Jupiter's transit supports forgiveness and mutual understanding. Your {nakshatra} Nakshatra influence adds wisdom to your emotional responses, helping you see the bigger picture beyond momentary frustration. Reconnect with your core support system for grounding and renewed perspective.",

        "Socially, tomorrow's celestial alignments suggest a pleasant surprise from someone close to your heart, {name}. Venus in {venus} and the Moon in your relationship sector create warm, nurturing energies that favor quality time, shared laughter, and genuine emotional presence. The cosmic advice is simple: be present, be kind, and be open to the beautiful connections that tomorrow wants to offer you."
    ],

    "tomorrow_health": [
        "Regarding your wellness tomorrow, {name}, the stars advise incorporating mindful stretching or yoga into your morning routine. The Moon's transit through your health sector, combined with your {rasi} sensitivity, suggests that tomorrow's energy will be best utilized when you start with physical movement. Mars in {mars} supports more vigorous exercise if you feel up to it. Drink plenty of water and prioritize natural, unprocessed foods throughout the day.",

        "Tomorrow's health outlook highlights steady, sustainable energy levels throughout the day, {first_name}, courtesy of Saturn's stabilizing transit through your vitality sector. Your Saturn in {saturn} rewards consistency — maintain regular mealtimes, hydration, and sleep patterns rather than pushing through fatigue. The {nakshatra} Nakshatra influence suggests that restorative activities releasing tension from your shoulders and neck will be particularly beneficial.",

        "In terms of physical energy tomorrow, {name}, the transits support refreshing your sleep hygiene and reducing screen time in the evening. Mercury's influence on your natal Mercury in {mercury} may create mental restlessness that interferes with quality sleep. A peaceful evening routine — dim lighting, warm beverages, light reading — will ensure deep, restorative rest. Avoid excessive caffeine or stimulants after mid-afternoon.",

        "Wellness patterns tomorrow show a need for balanced nutrition that fuels your system efficiently, {first_name}. Venus in {venus} may create cravings for comfort foods, but your chart responds best to a balanced meal plan rich in vegetables, lean proteins, and whole grains. Your {nakshatra} Nakshatra suggests spending time outdoors to absorb fresh, grounding energy. Even ten minutes of nature exposure will measurably boost your mood and vitality.",

        "Tomorrow, your physical house suggests focusing on digestive health, {name}. The Moon's transit through your {rasi} sector directly influences your gut, making dietary choices more impactful than usual. Opt for warm, easily digestible meals and avoid raw, cold, or heavy foods in the evening. A gentle abdominal massage or warm compress before bed will support both digestion and restful sleep, aligning with your chart's specific needs."
    ],

    # =====================================================================
    #  WEEKLY FORECAST
    # =====================================================================

    "weekly_overall": [
        "This week, {name}, the planetary influences suggest a significant shift in your focus and priorities as Jupiter and Saturn interact with key points in your chart. Your {rasi} Moon sign is receiving energizing aspects that amplify emotional clarity and intuitive decision-making. The {nakshatra} Nakshatra influence this week supports strategic planning and intentional goal-setting. Stay grounded, trust the timing of your journey, and be open to unexpected changes that bring growth.",

        "Over the course of the coming week, {first_name}, opportunities for collaboration, networking, and expanding your social circle will arise naturally. Mercury's transit enhances your natal Mercury in {mercury}, making communication effortless and persuasive. Your {lagna} Lagna projects warmth and competence that draws people toward your ideas. Focus on clear communication to avoid misunderstandings, and take time to recharge your energy between social engagements.",

        "As the weekly alignment unfolds, {name}, a wave of positive energy will boost your confidence and drive, particularly in areas connected to your Sun in {sun}. This is an excellent week for starting new projects, making important decisions, or having conversations that have been postponed. The {nakshatra} Nakshatra influence supports bold action backed by careful thought. Be open to insights that arrive through unexpected channels.",

        "Your solar chart this week, {first_name}, indicates a period where self-reflection and emotional balance take priority over external achievement. Saturn's transit encourages you to slow down, reassess your commitments, and ensure your current path aligns with your deeper values. This is not stagnation — it is strategic recalibration. Your Moon in {rasi} supports inner work that pays dividends in external results over the following weeks.",

        "This week brings a powerful alignment between your personal planets and transiting Jupiter, {name}, creating an atmosphere of growth, optimism, and expanded possibility. Your {lagna} Lagna receives supportive aspects that enhance your public presence and professional credibility. Mars in {mars} adds determined energy to your initiatives. Channel this cosmic tailwind into your most important goals and watch momentum build."
    ],

    "weekly_career": [
        "In your career this week, {name}, the stars show a busy schedule filled with meetings, coordination tasks, and collaborative projects. Mercury's transit amplifies your natal Mercury in {mercury}, making you the communicative hub of your professional environment. Your {lagna} Lagna projects leadership energy that attracts responsibility and visibility. Maintain a proactive attitude, double-check details, and trust your capabilities — recognition follows consistent excellence.",

        "Your professional life this week is marked by a potential breakthrough in a complex problem or project, {first_name}. Jupiter's favorable aspect to your chart creates sudden clarity and creative solutions that have eluded you. Your {nakshatra} Nakshatra influence ensures these insights are practical and actionable. Act quickly on fresh ideas while the cosmic momentum supports execution. Trust your professional instincts.",

        "Regarding your work this week, {name}, Saturn's transit through your career sector highlights the importance of structured planning and meticulous execution. Projects requiring attention to detail, compliance, or systematic organization will benefit most from this energy. Your Saturn in {saturn} adds disciplined focus. Keep your professional boundaries clear, delegate where possible, and prioritize tasks that advance your long-term career goals.",

        "In terms of professional projects, {first_name}, Mars's transit energizes your career house, bringing competitive drive and the confidence to pursue opportunities aggressively. Your Mars in {mars} amplifies this energy, making this an excellent week for negotiations, presentations, or pitching ideas to leadership. The {nakshatra} Nakshatra influence adds emotional intelligence to your professional interactions — read the room carefully before making your move.",

        "Your career this week receives a Jupiterian blessing, {name}, creating opportunities for professional growth, mentorship, and skill development. A senior figure or experienced colleague may offer guidance that accelerates your career trajectory. Be receptive to feedback, even when it challenges your assumptions. Your Mercury in {mercury} helps you absorb and integrate new information rapidly. This week's professional lessons will have lasting impact."
    ],

    "weekly_finance": [
        "Financially this week, {name}, the planetary alignments point to a stable period with opportunities for budgeting optimization and strategic planning. Jupiter in {jupiter} expands your financial perspective, encouraging you to think bigger about wealth creation while Saturn in {saturn} keeps you grounded in practical reality. Review your expenses, eliminate unnecessary subscriptions, and reallocate savings toward higher-yield opportunities.",

        "Regarding material security this week, {first_name}, Venus's transit through your financial sector creates appreciation for quality and beauty but also potential temptation for unnecessary spending. Your {nakshatra} Nakshatra influence advises conscious spending — ask whether each purchase truly serves your well-being or merely provides temporary emotional satisfaction. A conservative financial stance this week will generate long-term peace of mind.",

        "Your wealth sector this week experiences transits showing steady flow of resources but a clear need for long-term planning, {name}. Mercury in {mercury} supports detailed financial analysis — use this energy to compare insurance plans, review investment performance, or explore tax-optimization strategies. Small financial decisions made this week will compound into significant gains over the coming months.",

        "In terms of finances this week, {first_name}, unexpected minor rewards or returns from past efforts may materialize, courtesy of Jupiter's generous transit. These could take the form of refunds, bonuses, favors returned, or opportunities to monetize a skill you had not previously considered. Stay alert to these small financial blessings and reinvest them wisely. Your Saturn in {saturn} supports a disciplined approach to windfall management.",

        "This week's financial energy, {name}, strongly supports prudent resource management and long-term wealth building over speculative risk-taking. The Rahu transit may create the illusion of easy money through shortcuts or unverified opportunities — your {nakshatra} Nakshatra wisdom advises caution. Seek counsel from trusted advisors before making any significant financial commitments. Patience and due diligence are your greatest financial allies this week."
    ],

    "weekly_relationship": [
        "In your relationships this week, {name}, Venus's transit creates nurturing conditions for deep connections and meaningful conversations with loved ones. Your Moon in {rasi} amplifies emotional receptivity, making it easier to sense and respond to partner needs. The {nakshatra} Nakshatra influence supports active listening and empathetic presence. Express appreciation clearly and consistently — small gestures of love have outsized impact this week.",

        "Matters of love and family this week bring opportunities for resolving long-standing misunderstandings with patience and grace, {first_name}. Saturn's stabilizing influence on your relationship sector encourages mature, thoughtful communication. Mercury in {mercury} helps you choose words carefully. Be patient with loved ones as energies settle into new patterns. A supportive approach to conflict resolution will strengthen bonds permanently.",

        "Regarding connections this week, {name}, Jupiter's expansive transit through your social sector encourages sharing creative experiences and quality time with a partner or close friend. Your Venus in {venus} adds charm and warmth to all interactions. This is an excellent week for date nights, family gatherings, or reconnecting with old companions. Keep your heart open but maintain healthy personal boundaries.",

        "Socially, the weekly planetary pattern highlights expanding your support network and deepening existing bonds, {first_name}. Mars in {mars} provides the initiative to reach out, while your {lagna} Lagna projects inviting warmth. Someone you meet casually this week may eventually become a significant presence in your life. Pay attention to connections that feel effortless and meaningful — they carry cosmic significance for your growth.",

        "Your relationships this week are blessed by a harmonious Venus-Jupiter transit, {name}, creating an atmosphere of generosity, forgiveness, and shared joy. The {nakshatra} Nakshatra influence adds spiritual depth to your connections, encouraging conversations that go beyond surface pleasantries into genuine soul sharing. This is one of the best weeks this month for relationship nurturing. Invest your emotional energy where it matters most."
    ],

    "weekly_health": [
        "Regarding your wellness this week, {name}, the planetary transits support establishing consistent sleeping patterns and incorporating regular light exercise into your daily routine. Mars in {mars} provides physical energy while Saturn in {saturn} emphasizes sustainability over intensity. Your {nakshatra} Nakshatra influence suggests paying special attention to hydration and fresh air. Take regular breaks from work to clear your mind — your productivity will actually increase.",

        "This week's health outlook highlights the need to balance active hours with restorative rest, {first_name}. The Moon's transit through your health sector activates your {rasi} sensitivity, making it important to honor your body's signals rather than pushing through fatigue. Incorporate green, nourishing meals and avoid processed foods. Adequate recovery time at night is essential — aim for consistent sleep and wake times.",

        "In terms of physical energy this week, {name}, Jupiter's transit supports incorporating mindfulness practices, stretching, and stress management techniques into your daily schedule. Your Mercury in {mercury} may create mental restlessness that physical activity can effectively channel. Fresh air, nature walks, and movement that combines body and mind (yoga, tai chi, swimming) are especially favorable for your chart this week.",

        "Wellness patterns this week emphasize the power of releasing emotional stress through intentional breathing exercises and physical movement, {first_name}. Venus in {venus} supports self-care rituals that feel nurturing and pleasurable. Your {nakshatra} Nakshatra recommends a mid-week assessment of your energy levels with adjustments to diet and sleep accordingly. Listen to your physical signals — your body communicates clearly when you pay attention.",

        "Your health this week, {name}, benefits from a stabilizing Saturnian influence that rewards consistency and discipline. Small daily habits — a morning walk, adequate water, balanced meals, screen-free wind-down before bed — will compound into noticeable vitality improvements. Mars in {mars} provides the motivation to maintain these habits even when convenience tempts you toward shortcuts. Invest in your body this week; it will repay you generously."
    ],

    # =====================================================================
    #  MONTHLY FORECAST
    # =====================================================================

    "monthly_overall": [
        "This month, {name}, the overarching cosmic alignments suggest a pivotal cycle of personal growth and alignment. Jupiter's transit through your chart activates expansion in areas connected to your {rasi} Moon sign, while Saturn in {saturn} provides the structural discipline to channel this growth productively. The {nakshatra} Nakshatra influence this month supports major decisions regarding career, relationships, and life direction. Embrace the natural flow of transitions and trust your evolving understanding of yourself.",

        "Throughout the coming month, {first_name}, planetary cycles reveal that major decisions regarding career direction and relationship commitments will take center stage. Mercury's extended influence on your natal Mercury in {mercury} enhances communication and negotiation abilities for the entire month. Your {lagna} Lagna projects confidence that attracts opportunity. Focus your energies on high-priority goals, and trust the timing of your journey even when progress feels slower than desired.",

        "As the monthly transit map takes shape, {name}, the stars indicate that emotional depth and spiritual understanding will guide your path more powerfully than logic alone. The Moon's journey through your chart this month activates different sectors of your life in sequence, creating a natural rhythm of action and reflection. Your {nakshatra} Nakshatra wisdom suggests surrendering to this rhythm rather than fighting it. Let go of old patterns to make space for incoming blessings.",

        "Your chart this month, {first_name}, receives a significant boost from Jupiter's favorable aspect, creating an atmosphere of optimism, growth, and expanded possibility. Mars in {mars} adds determined energy to your monthly initiatives. This is an excellent month for launching projects, deepening relationships, or making changes you have been contemplating. The cosmic energy supports bold, authentic action aligned with your values.",

        "This month brings transformative energy to your chart, {name}, as Saturn and Jupiter activate key developmental houses. Your {rasi} Moon sign receives clarifying aspects that enhance emotional intelligence and decision-making quality. The {nakshatra} Nakshatra influence suggests that this month's challenges are actually accelerated growth opportunities in disguise. Patience and systematic planning are key to navigating incoming changes with grace and effectiveness."
    ],

    "monthly_career": [
        "In your professional sphere this month, {name}, the planetary transits highlight significant career growth and potential leadership assignments. Jupiter's expansive influence on your career house creates opportunities for visibility, promotion, or scope expansion. Your Mercury in {mercury} sharpens professional communication throughout the month. Invest in continuous learning, accept challenging assignments, and position yourself for the advancement that the cosmos is preparing for you.",

        "Regarding career progression this month, {first_name}, Saturn's transit through your professional sector rewards disciplined execution and long-term strategic thinking. This is not a month for shortcuts or surface-level effort — deep, quality work will be recognized and rewarded. Your {lagna} Lagna projects professional authority that inspires trust. A senior mentor or influential figure will play a key role in your growth. Stay aligned with integrity and double down on execution.",

        "Your vocation this month, {name}, is influenced by a powerful transit that favors adaptable individuals who can navigate structural change with composure. Mars in {mars} provides the competitive drive to thrive in evolving environments, while your {nakshatra} Nakshatra influence adds emotional intelligence to professional interactions. Value feedback as a tool for refinement, and approach office dynamics with strategic patience rather than reactive emotion.",

        "In terms of professional growth this month, {first_name}, Rahu's transit through your career sector creates unconventional opportunities that may initially seem risky or unorthodox. Your entrepreneurial instincts, fueled by Mars in {mars}, will help you evaluate which risks are worth taking. The key is balancing innovation with the systematic execution that Saturn in {saturn} demands. Constructive collaborations and expanding your professional network will accelerate your trajectory.",

        "Career momentum builds significantly this month, {name}, as Jupiter and Mercury form favorable aspects to your chart. Your communication skills, enhanced by Mercury in {mercury}, will be your greatest professional asset. Whether presenting, writing, negotiating, or simply contributing in meetings, your words carry unusual weight and influence this month. Your {nakshatra} Nakshatra adds intuitive insight to professional decisions — trust those gut feelings about opportunities and partnerships."
    ],

    "monthly_finance": [
        "Materially this month, {name}, the planetary alignments highlight the necessity of securing your assets and updating your financial strategies. Jupiter in {jupiter} creates expansive financial vision, while Saturn in {saturn} ensures practical execution. Your Mercury in {mercury} provides the analytical clarity for detailed financial planning. Avoid impulsive investments in volatile markets and focus on steady, sustainable wealth accumulation aligned with your long-term security goals.",

        "Regarding wealth accumulation this month, {first_name}, a major window opens for financial planning and consolidation. Venus's transit through your wealth sector enhances your ability to attract resources and identify value. Your {nakshatra} Nakshatra influence supports prudent budgeting that balances present enjoyment with future security. Verify contracts and financial agreements thoroughly — hidden clauses may not be immediately apparent.",

        "Your financial house this month shows steady progress, {name}, linked to disciplined habits and strategic resource management. Mars in {mars} adds entrepreneurial energy that can be channeled into income diversification. Your {rasi} Moon sign provides emotional wisdom about financial decisions — trust your feelings about money matters alongside rational analysis. A disciplined monthly savings strategy will manifest noticeable growth.",

        "In terms of resources this month, {first_name}, Rahu's transit creates interesting but potentially speculative financial opportunities. The cosmic advice is to research thoroughly before committing capital. Your Saturn in {saturn} provides the patience to wait for the right moment rather than rushing into every opportunity. Cautious investments in established, secure assets are favored over high-risk ventures this month.",

        "Financial patterns this month, {name}, suggest opportunities to establish secondary income streams or monetize skills and knowledge that you currently offer for free. Jupiter's expansive influence on your wealth sector encourages thinking bigger about your earning potential. Your Mercury in {mercury} identifies practical implementation steps. Start small, test the market, and scale what works. This month's financial seeds will bear fruit in the coming quarter."
    ],

    "monthly_relationship": [
        "Relationship-wise this month, {name}, the planetary alignments create conditions for deepening domestic commitments and healing past conflicts. Venus's extended transit through your relationship sector amplifies love, warmth, and romantic energy. Your Moon in {rasi} enhances emotional sensitivity, making you more attuned to partner needs. Express your love through consistent support and dedication. Patience will dissolve any temporary celestial friction between you and loved ones.",

        "Matters of the heart this month, {first_name}, call for clear communication and emotional vulnerability with your partner or closest companions. Mercury in {mercury} provides the words; your {nakshatra} Nakshatra provides the wisdom to know when and how to use them. Jupiter's transit supports mutual growth and shared goal-setting within your most important relationships. Balance your personal space with quality time together.",

        "Your social and domestic sphere this month is under a cycle of expansion and renewal, {name}. Mars in {mars} adds passion and energy to your interactions, while Venus in {venus} softens this intensity with warmth and charm. New connections formed this month carry potential for long-term significance. Your {lagna} Lagna projects an inviting energy that draws people toward your orbit naturally.",

        "Regarding emotional bonds this month, {first_name}, Saturn's transit through your relationship sector highlights redefining boundaries to ensure both individual and shared growth. This may involve honest conversations about needs, expectations, and future direction. While initially uncomfortable, these Saturnian relationship conversations create the foundation for lasting, mature partnerships. Your {nakshatra} Nakshatra supports constructive honesty delivered with compassion.",

        "This month blesses your relationships with Jupiter's generous, forgiving energy, {name}. If past months have brought tension or distance in important relationships, this is the cosmic correction period. Your Moon in {rasi} amplifies your capacity for empathy and emotional healing. A supportive community network is your greatest strength this month. Invest in the relationships that nourish your spirit and reflect your values."
    ],

    "monthly_health": [
        "In terms of vitality this month, {name}, planetary transits advise focusing on cellular renewal, hydration, and nutritional optimization. Mars in {mars} provides strong physical energy that should be channeled into regular exercise. Your {rasi} Moon sign governs digestive health this month — pay attention to food combinations and meal timing. Saturn in {saturn} supports establishing health routines that you can maintain indefinitely. Consistency trumps intensity.",

        "Regarding your health this month, {first_name}, the celestial guidance emphasizes maintaining a systematic exercise and recovery routine. Jupiter's transit supports overall vitality, but Venus in {venus} may create cravings for comfort foods that derail nutritional goals. Your {nakshatra} Nakshatra specifically recommends incorporating cooling, anti-inflammatory foods and reducing processed sugar. Ensure consistent physical activity to boost circulation and mood stability.",

        "Your physical and mental well-being this month, {name}, is supported by mindful relaxation and effective stress management. Mercury's influence on your natal Mercury in {mercury} creates mental intensity that requires intentional rest periods. The {nakshatra} Nakshatra influence highlights the throat, respiratory system, and skin as areas deserving attention this month. Nature walks, clean eating, and adequate sleep will enhance your overall aura and vitality.",

        "Wellness patterns for this monthly cycle, {first_name}, highlight the importance of aligning your activities with seasonal energy changes. Mars in {mars} provides the drive for physical challenges, while Saturn in {saturn} reminds you to respect recovery periods. Your Moon in {rasi} responds strongly to environmental factors — ensure your living and working spaces are clean, well-ventilated, and emotionally comfortable. Environmental wellness directly impacts your physical health.",

        "This month's health focus, {name}, should include regular self-assessment of energy levels, stress indicators, and sleep quality. Jupiter's supportive transit provides overall resilience, but your {nakshatra} Nakshatra warns against taking good health for granted. Preventive measures — regular movement, mindful eating, stress management, and adequate rest — are more effective than reactive treatments. Make sleep quality a priority for deep physical and cellular repair throughout the month."
    ],
}
