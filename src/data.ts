import { City, SpotLocation } from './types';

export const CITIES: City[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    tagline: 'Imperial Bastions & The Scent of Roasted Cardamom',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop',
    introParagraph1: 'Delhi, the historic heart of India, has risen from the ashes of seven great empires. It is a city of layers, where monumental Mughal red sandstone forts and sleek 21st-century architectural domes sit side-by-side. The atmosphere is dense with the aroma of charcoal-fired rotis, fresh marigolds, and ancient dust stirred up by modern rickshaws.',
    introParagraph2: 'Beyond the crowded avenues of Connaught Place, Old Delhi hides its most treasured secrets in tiny, dark alleys. From a 10th-century geometric stepwell hidden under street-level high-rises to spice storage attics unchanged since the times of Shah Jahan, Delhi reward explorers who look beyond the standard monuments.',
    bestTimeToVisit: 'October to March (Pleasant winter breeze)',
    howToReach: 'Direct international & domestic flights to Indira Gandhi International Airport (DEL) or express trains arriving directly at New Delhi Railway Station.',
    idealDuration: '3 to 4 Days of historical tracing',
    climate: 'Dry, crisp winters followed by intense, energetic pre-monsoon summers',
    localSecretRecipe: 'Slow-cooked Daulat ki Chaat with saffron foam and pistachios',
    bgColorClass: 'from-[#cd7c64] to-[#f4ebe1]',
    accentColorClass: 'bg-brutal-yellow',
    secondaryColorClass: 'bg-brutal-green',
    mapX: 46,
    mapY: 34
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    tagline: 'Pink Sandstone Façades & Hidden Escher Stepwells',
    heroImage: 'https://images.unsplash.com/photo-1695395550316-8995ae9d35ff?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    introParagraph1: 'Founded in 1727 by Maharaja Sawai Jai Singh II, the Pink City of Jaipur is a marvel of early architectural plan layouts and stellar celestial astronomy. Drenched in terracotta pink—the traditional color of hospitality—the old city features royal courtyards, bustling bazaar gates, and dramatic fortress ramparts holding watch on parallel mountain ridges.',
    introParagraph2: 'But deep in the outskirts near historic temples, the desert hides its most graphic treasures. Hand-carved geometric stepwells descending deep into the earth in Escher-like repeating stone stairways offer a quiet, shadow-and-light sanctuary from the blazing desert sun, away from standard tourist tracks.',
    bestTimeToVisit: 'November to February (Cool evenings)',
    howToReach: 'Direct flights to Jaipur International Airport (JAI) or a scenic 5-hour drive on the national highway from Delhi.',
    idealDuration: '2 to 3 Days of Royal Exploration',
    climate: 'Warm, semi-arid desert environment with beautiful cool sand breezes after dark',
    localSecretRecipe: 'Cardamom-infused Pyaz ki Kachori with sweet mint chutney',
    bgColorClass: 'from-[#cd7c64] to-[#f4ebe1]',
    accentColorClass: 'bg-[#FFB800]',
    secondaryColorClass: 'bg-[#ff5a00]',
    mapX: 38,
    mapY: 42
  },
  {
    id: 'madurai',
    name: 'Madurai',
    country: 'India',
    tagline: 'Towering Sanctum Gopurams & Midnight Jasmine Alleys',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
    introParagraph1: 'Madurai is one of the oldest continuously inhabited cities on Earth, built in the shape of a sacred lotus around the grand Meenakshi Amman Temple. The skyline is dominated by towering, multi-colored Gopurams (temple gates) adorned with thousands of stone figures of gods, demons, and mythic beasts, rising like heavy mountains above quiet residential roofs.',
    introParagraph2: 'While devotees crowd the temple gates, Madurai’s real essence flows through its midnight markets. Indulge in the hand-woven cotton markets, and venture into the cool, silent colonnades of historic palaces where massive 17th-century white pillars cast dramatic giant shadows long after the incense of the evening rituals has cleared.',
    bestTimeToVisit: 'October to March (Post-monsoon freshness)',
    howToReach: 'Madurai Domestic Airport (IXM) with connections from Chennai and Bangalore, or direct express trains from major southern hubs.',
    idealDuration: '2 to 3 Days of Temple Wanderings',
    climate: 'Tropical climate; hot throughout the year with cool monsoon showers in autumn',
    localSecretRecipe: 'Frothy, ice-cold Jigarthanda milk dessert with wild sarsaparilla syrup',
    bgColorClass: 'from-[#cd7c64] to-[#f4ebe1]',
    accentColorClass: 'bg-brutal-purple',
    secondaryColorClass: 'bg-brutal-pink',
    mapX: 47,
    mapY: 88
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry',
    country: 'India',
    tagline: 'Vibrant Mustard Bougainvillea Rails & Deep Roman Ruins',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
    introParagraph1: 'Perched on the Coromandel Coast of the Bay of Bengal, Pondicherry is a sensory cross-over of French colonial plan architecture, mustard-colored villas, and traditional Tamil salt-breezed fishing culture. Streets named "Rue" are decorated with heavy magenta bougainvillea hanging over white brick walls, creating a slow-paced seaside escape.',
    introParagraph2: 'But a brief journey south to the muddy lagoons reveals Pondicherry’s deeper, secret history. Buried beneath the shoreline lies Arikamedu, a ancient archaeological site that was a thriving Greco-Roman trading port 2,000 years ago. Here, ancient Roman amphorae and brick walls sit silently in the coastal shade, almost untouched by modern footpaths.',
    bestTimeToVisit: 'October to February (Perfect beach breezes)',
    howToReach: 'Fly into Chennai International Airport (MAA) followed by a stunning 3-hour taxi drive along the scenic East Coast Road (ECR).',
    idealDuration: '2 to 3 Days of Slow Biking',
    climate: 'Tropical wet and dry; sweet maritime winds keep the afternoons refreshing',
    localSecretRecipe: 'Spicy Creole Fish Curry simmered with locally sun-dried Vadouvan herbs',
    bgColorClass: 'from-[#cd7c64] to-[#f4ebe1]',
    accentColorClass: 'bg-brutal-green',
    secondaryColorClass: 'bg-[#00F0FF]',
    mapX: 53,
    mapY: 79
  }
];

export const CITY_LOCATIONS: Record<string, SpotLocation[]> = {
  delhi: [
    {
      id: 'd1',
      title: 'The Monumental Red Fort (Lal Qila)',
      type: 'famous',
      tagline: 'The Sandstone Palace of Imperial Sovereigns',
      description: 'The spectacular Mughal administrative crown built of massive red sandstone. Its dramatic octagonal walls enclose magnificent peacock-throne pavilions, white marble audience halls, and beautiful manicured gardens where grand streams of mountain water once ran.',
      highlights: [
        '**The Lahori Gate:** Stand beneath the massive, imposing central gate where India’s independence flag is unfurled.',
        '**Diwan-i-Khas Auditorium:** Admire the delicate pillars of the royal hall where the legendary sapphire-studded Peacock Throne once rested.',
        '**Chhatta Chowk Bazaar:** Walk through the historic vault covered bazaar inside the main gate, once selling royal silks.'
      ],
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      cost: '₹50 INR (Residents) / ₹600 (Foreigners)',
      timeOfDay: 'Morning (8:30 AM) to skip midday sun heat'
    },
    {
      id: 'd2',
      title: 'Qutub Minar & Iron Pillar',
      type: 'famous',
      tagline: 'Five-Storey Fluted Victory Tower in Ancient Ruins',
      description: 'A towering 73-meter minaret covered in intricate Arabic calligraphy and floral carvings. Standing next to it is the legendary 4th-century Iron Pillar of Chandragupta II, which has completely resisted rust for over 1,600 years through advanced metallurgy.',
      highlights: [
        '**Fluted Red Sandstone:** Gaze up at the dramatic balconies resting on elaborate carving brackets.',
        '**The Rust-Free Column:** Witness the ancient 7-meter iron pillar that defies modern corrosion sciences.',
        '**Alai Darwaza Gateway:** Photograph the beautiful white marble inlaid arch arches of the Quranic gateway.'
      ],
      image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=500&auto=format&fit=crop',
      rating: 4.9,
      cost: '₹40 INR / ₹600',
      timeOfDay: 'Golden Sunset for deep red sandstone reflections'
    },
    {
      id: 'd3',
      title: 'Agrasen ki Baoli Stepwell',
      type: 'gem',
      tagline: 'Ancient 104-Step Subterranean Stone Sanctuary',
      description: 'An ancient, beautifully preserved medieval stepwell hidden directly in the heart of New Delhi. Comprising 103 stone steps descending into the silent, cool earth, it is flanked by three stories of arched niches and is home to thousands of whispering pigeons.',
      highlights: [
        '**The Subterranean Descent:** Walk down the massive dry stone steps and feel the temperature drop over 10 degrees.',
        '**Pigeon Wall Archways:** Admire the rhythmic symmetry of the ancient brick corridors flanking the central well shafts.',
        '**Metropolitan Oasis Contrast:** Feel the eerie quiet as city high-rises peek directly over the stepwell rim.'
      ],
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=500&auto=format&fit=crop',
      rating: 4.7,
      cost: 'Free Admission',
      timeOfDay: 'Late afternoon (4:00 PM) for deep atmospheric shadows'
    },
    {
      id: 'd4',
      title: 'Khari Baoli Herb & Spice Sanctuary',
      type: 'gem',
      tagline: 'Asia’s Largest Open-Air Spice Trade Network',
      description: 'An explosive, chaotic sensory wonderland operating in Old Delhi since the mid-17th century. Thousands of wholesale merchant cells trade raw chillis, turmeric, and cardamom from mountains of woven burlap sacks, where spicy dust hangs like a golden mist.',
      highlights: [
        '**The Chili Rooftop View:** Ascend hidden brick staircases to view the bustling interior trade courts from high-altitude ledges.',
        '**Burlap Sack Mountains:** Watch heavy laborers carry massive shipments of fresh ginger and cinnamon on wooden charts.',
        '**Aged Alleys of Scent:** Challenge your senses along paths heavy with the sweet aroma of pure rosewater and dried saffron.'
      ],
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      cost: 'Free (Watch out for flying chili dust!)',
      timeOfDay: '11:00 AM to see wholesale trading in full speed'
    }
  ],
  jaipur: [
    {
      id: 'jp1',
      title: 'Hawa Mahal (The Wind Palace)',
      type: 'famous',
      tagline: 'A Five-Storey Screen of 953 Intricate Jali Windows',
      description: 'The iconic crown palace built for Royal Mughal and Rajput women to observe daily street life secretively. Formed of pink and red sandstone with 953 miniature casements, its geometric design channels cool breezes continuously through high-speed draft physics.',
      highlights: [
        '**The Latticed Rose Wall:** Stand across the road to admire the honeycomb symmetry of pink royal balconies.',
        '**Internal Sandstone Ramps:** Walk raw brick passages built with ramps instead of stairs to assist royal palanquins.',
        '**Rooftop Jali Lookouts:** Look through the colored glass windows for custom viewpoints over the City Palace court.'
      ],
      image: 'https://images.unsplash.com/photo-1695395550316-8995ae9d35ff?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      rating: 4.9,
      cost: '₹50 INR / ₹200 (Foreigners)',
      timeOfDay: 'Sunrise (6:30 AM) when the facade glows in orange gold'
    },
    {
      id: 'jp2',
      title: 'Amber Fort Elephant Ramparts',
      type: 'famous',
      tagline: 'Monolithic Hilltop Palace and Golden Shish Mahal',
      description: 'A spectacular hillside fortress commanding Maota Lake. Built with yellow and pink sandstone, it features massive imperial gates, pillared courts, and the mirror-inlaid Hall of Vikram, which glows entirely under a single match light.',
      highlights: [
        '**Sheesh Mahal (Mirror Hall):** Experience a ceiling covered in imported Belgian glass creating thousands of star reflections.',
        '**Ganesh Pol Gateway:** Witness the stunning hand-painted fresco entrance decorated with traditional organic pigments.',
        '**Maota Lake Mirror Garden:** Walk flanking the water terrace overlooking beautiful floating geometric layouts.'
      ],
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      cost: '₹100 INR / ₹500',
      timeOfDay: 'Morning (9:00 AM) to experience the cool marble chambers'
    },
    {
      id: 'jp3',
      title: 'Panna Meena ka Kund Stepwell',
      type: 'gem',
      tagline: 'Eight-Storey Symmetrical Escher Stair-Cube Stepwell',
      description: 'A breathtaking 16th-century stepwell that looks like a concrete work of mathematical art. Built with perfectly symmetrical crisscrossing stairs descending down to a glowing pool, the stepwell’s design creates a hypnotic grid pattern.',
      highlights: [
        '**Symmetrical Stair Grid:** View the beautiful, geometric lines of the steps catching sharp angular shadows.',
        '**The Sub-Level Verandahs:** Photograph the circular archways where travelers used to sit in the shade to beat desert heat.',
        '**Village Secret Silence:** Enjoy the relative quiet as local kids play cricket on the outer brick boundaries.'
      ],
      image: 'https://plus.unsplash.com/premium_photo-1661962678180-6b45623230c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // fallback
      rating: 4.9,
      cost: 'Free (Stepping down is restricted for safety, but view is incredible)',
      timeOfDay: 'Noon on sunny days for sharp contrast lines'
    },
    {
      id: 'jp4',
      title: 'Galta Ji Temple (The Monkey Canyon Sanctuary)',
      type: 'gem',
      tagline: 'Geothermal Sacred Hot Springs Wedged in a Mountain Crevice',
      description: 'An ancient, rustic pilgrimage site built within a narrow mountain pass of the Aravalli hills. Famous for its natural mountain springs that feed seven sacred stone water pools, it is inhabited by thousands of friendly Rhesus macaque monkeys.',
      highlights: [
        '**The Upper Geothermal Pool:** Walk to the high water reservoir feeding crystal waters through a natural cow head spout.',
        '**Sunset Temple Peak:** Walk a cobblestone path to the sun-god ridge for panoramic Jaipur desert views.',
        '**Monkey Assembly Courtyard:** Feed friendly temple monkeys under the guidance of orange-clad ashram priests.'
      ],
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.7,
      cost: 'Free (Small smartphone photography fee of ₹50)',
      timeOfDay: 'Late afternoon (4:30 PM) when monkeys descend to bathe'
    }
  ],
  madurai: [
    {
      id: 'md1',
      title: 'Madurai Meenakshi Amman Temple',
      type: 'famous',
      tagline: 'Fourteen Sky-Scraper Gopurams Adorned with 33,000 Statues',
      description: 'The monumental pinnacle of Dravidian architecture. Stretching across 15 acres, this temple complex features 14 towering gopurams fully layered with 33,000 highly expressive multi-chrome statues of deities, demons, and mythic beasts.',
      highlights: [
        '**Hall of Thousand Pillars:** Wander an ancient granite hall where 985 pillars are hand-carved with lifelike detail.',
        '**Golden Lotus Tank:** Sit by the sacred temple pool reflecting the colossal South Tower under standard oil lights.',
        '**The Elephant Blessing Gateway:** Meet the temple elephant inside the dark corridors who offers blessings for small coins.'
      ],
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=500&auto=format&fit=crop',
      rating: 4.9,
      cost: 'Free Admission (Inner sanctum queuing varies)',
      timeOfDay: 'Night-time (7:00 PM) to see the sacred chariots and oil fire ceremonies'
    },
    {
      id: 'md2',
      title: 'Thirumalai Nayakkar Palace Pillars',
      type: 'famous',
      tagline: 'Massive White Stucco Pillars of Italian-Dravidian Royalty',
      description: 'A grand 17th-century palace constructed by King Thirumalai Nayak. Blending Italian-Baroque aesthetics with classic Dravidian arch layouts, it is world-famous for its central courtyard flanked by massive white pillars standing 20 meters tall.',
      highlights: [
        '**The Colossal White Pillars:** Touch the massive, smooth columns built of polished shell lime and sand stucco.',
        '**Audience Octagonal Dome:** Gaze up at the structural dome constructed entirely without structural iron beams.',
        '**Light & Sound Theatre:** Attend the dramatic evening show highlighting royal South Indian history.'
      ],
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.7,
      cost: '₹50 INR / ₹150 (Foreigners)',
      timeOfDay: '2:00 PM to watch the clean shafts of light filter between pillars'
    },
    {
      id: 'md3',
      title: 'Vilachery Pottery Art Village',
      type: 'gem',
      tagline: 'Alleys Where Tiny Mud Figurines Come to Life',
      description: 'A modest, vibrant village on Madurai’s southern outskirts where entire families of potters have sculpted papier-mâché and clay idols for centuries. Every back porch is a mini-museum of drying statues of Indian deities painted in bright, vibrant colors.',
      highlights: [
        '**Hand-Spinning Clay Wheels:** Watch master potters spin clay using hand-balanced wooden cartwheels.',
        '**The Clay-Drying Streets:** Walk along roads lined with thousands of drying heads and hands of cosmic deities.',
        '**Terracotta Kilns:** Lean over active fire kilns fueled by burning rice husks for dynamic rustic textures.'
      ],
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      cost: 'Free (Purchasing local clay toys is encouraged)',
      timeOfDay: 'Morning (10:00 AM) to see artists hand-painting with brushes'
    },
    {
      id: 'md4',
      title: 'Samanar Hills Jain Rock Beds',
      type: 'gem',
      tagline: 'Ancient Jain Monks Stone Beds Over Keelakuilkudi Village',
      description: 'A peaceful, wind-swept rocky hill standing 15km from the temple bustle. It holds 2,000-year-old bare stone carving beds used by ancient Jain monks, alongside beautiful lotus-filled mountain springs and rock-cut carvings.',
      highlights: [
        '**Ancient Stone Beds:** Discover the flat, hand-carved rock ledges where hermit monks studied and fast.',
        '**Sacred Lotus Spring:** Splash cool mountain spring water populated with pink lilies from a stone reservoir.',
        '**Peacock Wood Canopy:** Spot wild peacocks showing off their feathers across the dry scrub slopes.'
      ],
      image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.6,
      cost: 'Free',
      timeOfDay: 'Twilight (5:30 PM) for deep orange skies over rice paddies'
    }
  ],
  pondicherry: [
    {
      id: 'p1',
      title: 'Pondicherry French Quarter Walks',
      type: 'famous',
      tagline: 'Bougainvillea-Lined French Colonial Bungalows',
      description: 'A clean, geometric coastal district filled with mustard-and-white colonial mansions, sweeping wooden louver shutter windows, and French-language street markers called "Rue". The streets offer a peaceful, aesthetic escape by the breaking surf.',
      highlights: [
        '**The Mustard Frontages:** Tour beautiful Rue de la Marine lined with classic pastel colonial brick walls.',
        '**Warm Bougainvillea Trails:** Photograph huge overhead canopies of bright pink paper flowers climbing clean gates.',
        '**Seaside Promenade:** Cycle at sunset next to the monumental black-stone Gandhi Statue bordering the ocean.'
      ],
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      cost: 'Free Admission',
      timeOfDay: 'Cool mornings (7:00 AM) by bicycle'
    },
    {
      id: 'p2',
      title: 'Auroville Matrimandir Dome',
      type: 'famous',
      tagline: 'A Golden Sphere of Concentric Gilded Discs',
      description: 'An architectural marvel situated in the experimental township of Auroville. Looking like a massive gold-plated sphere rising out of red soil, it contains a pristine white marble meditation hall lit by an active sun tracking crystal.',
      highlights: [
        '**Gilded Disc Facade:** Admire the thousands of individual gold-leaf-covered convex discs reflecting local pine woods.',
        '**The Spiral Amphitheater:** Sit on the circular red-sandstone steps surrounding a giant marble loyalty urn.',
        '**Inner Meditation Sphere:** Experience total absolute silence inside the white marble dome illuminated by a single vertical sun shaft.'
      ],
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.7,
      cost: 'Free (Requires online prior booking for inner entry)',
      timeOfDay: 'Mid-Morning (9:30 AM)'
    },
    {
      id: 'p3',
      title: 'Arikamedu Roman Trading Ruins',
      type: 'gem',
      tagline: 'The Forgotten Greco-Roman Maritime Outpost in Coconut Alleys',
      description: 'A peaceful, overgrown archaeological site holding the remains of an active Roman trading harbor dating to the 1st century BC. Thick brick walls and warehouse foundations peek out from coconut palms, where Romans traded glass beads and red pottery.',
      highlights: [
        '**The Red Brick Warehouse Walls:** Touch the actual Roman-standard brick structures standing next to the Ariyankuppam river.',
        '**Bead Trade History:** Walk dry shores where ancient Roman coins, glass beads, and olive-oil amphorae shards are still excavated.',
        '**Secluded River Pier:** Listen to coastal kingfishers dive in deep, silent salt lagoons away from any cars.'
      ],
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.7,
      cost: 'Free',
      timeOfDay: 'Midday under the shade of thick mango groves'
    },
    {
      id: 'p4',
      title: 'Cluny Sisters Embroidery Hearth',
      type: 'gem',
      tagline: 'Quiet Colonial Atelier Supporting Local Women Artists',
      description: 'A beautiful 18th-century French mansion where a small group of highly talented local craft women create the world’s most delicate embroidery under regional nuns. The compound features silent botanical courtyards with singing birds.',
      highlights: [
        '**The Needle-Work Atelier:** Watch needle masters capture lifelike birds and roses on pure linen threads.',
        '**Classic French Verandah:** Relax in a high-arched courtyard complete with pastel lime wash walls.',
        '**Linen Gallery:** Browse exclusive hand-made napkins, sheets, and curtains untouched by industrial machines.'
      ],
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=500&auto=format&fit=crop', // fallback
      rating: 4.9,
      cost: 'Free (Exquisite purchases sustain local women wages)',
      timeOfDay: '11:00 AM when light fills the high-arched rooms'
    }
  ]
};
