import {
  CityInfo,
  Place,
  CulturalTopic,
  Phrase,
  FairPriceItem,
  TravelUpdate,
  SafetyResource
} from '../types';

export const CITIES: CityInfo[] = [
  // North India
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    tagline: 'The Pink City of majestic forts, royal palaces, and vibrant bazaars',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Block Printing', 'Kachoris'],
    description: 'Capital of Rajasthan, famed for UNESCO World Heritage hill forts and pink sandstone architecture.'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'National Capital Territory',
    region: 'North',
    tagline: 'Centuries of monumental Mughal & imperial history meeting vibrant modern life',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Humayun’s Tomb', 'Qutub Minar', 'Old Delhi Food', 'India Gate', 'Red Fort'],
    description: 'India’s storied capital with eight historic cities layered across centuries.'
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    tagline: 'Timeless Mughal architecture and marble mastery on the banks of the Yamuna',
    coordinates: { lat: 27.1767, lng: 78.0081 },
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri', 'Petha Sweets'],
    description: 'Home to the Taj Mahal and grand Mughal capitals.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    tagline: 'One of the world’s oldest living sacred cities along the holy River Ganga',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Ganga Aarti', 'Ghats Walk', 'Sarnath', 'Silk Weaving', 'Morning Boat Ride'],
    description: 'The spiritual heart of India with unbroken cultural rituals spanning millennia.'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    region: 'North',
    tagline: 'The City of Lakes with marble palaces floating on serene waters',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['City Palace Udaipur', 'Lake Pichola', 'Jag Mandir', 'Saheliyon-ki-Bari', 'Rooftop Cafes'],
    description: 'Venice of the East, surrounded by the Aravali hills and romantic lakeside heritage.'
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    region: 'North',
    tagline: 'The Blue City guarded by the colossal Mehrangarh Fortress',
    coordinates: { lat: 26.2389, lng: 73.0243 },
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Mehrangarh Fort', 'Jaswant Thada', 'Blue City Alleys', 'Clock Tower Bazaar', 'Makhaniya Lassi'],
    description: 'Sun city of blue-painted houses beneath Rajasthan’s most imposing cliff fortress.'
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    tagline: 'Spiritual beacon of Sikhism, golden sanctums, and legendary culinary culture',
    coordinates: { lat: 31.6340, lng: 74.8723 },
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Golden Temple', 'Langar Community Kitchen', 'Wagah Border', 'Amritsari Kulcha', 'Jallianwala Bagh'],
    description: 'Spiritual sanctuary featuring the Sri Harmandir Sahib and generous community hospitality.'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    region: 'North',
    tagline: 'Yoga capital of the world in the Himalayan foothills along the crystal Ganga',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    image: 'https://images.unsplash.com/photo-1596768401116-2f16a04870f7?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Laxman Jhula', 'Triveni Ghat Aarti', 'Yoga Ashrams', 'River Rafting', 'Beatles Ashram'],
    description: 'Tranquil Himalayan sanctuary for yoga, meditation, and natural river journeys.'
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'North',
    tagline: 'Colonial hill station surrounded by pine-forested Himalayan ridges',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['The Ridge & Mall Road', 'Jakhoo Temple', 'Toy Train UNESCO', 'Viceregal Lodge'],
    description: 'Historic summer capital in Himachal Pradesh with Victorian architecture.'
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    region: 'North',
    tagline: 'Alpine valleys, cedar woods, and gateways to high Himalayan mountain passes',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Solang Valley', 'Hadimba Temple', 'Old Manali Cafes', 'Rohtang Pass View'],
    description: 'High-altitude mountain hub popular for trekking, cafes, and snow valleys.'
  },

  // West India
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    tagline: 'The bustling financial, artistic, and cinema metropolis on the Arabian Sea',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Gateway of India', 'Marine Drive Queen’s Necklace', 'Elephanta Caves', 'Kala Ghoda Art', 'Vada Pav'],
    description: 'Vibrant coastal megacity blending Victorian Gothic monuments with modern energy.'
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    region: 'West',
    tagline: 'Tropical golden beaches, Portuguese heritage churches, and relaxed village rhythm',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Old Goa Basilica', 'Palolem Beach', 'Fontainhas Latin Quarter', 'Spice Plantations', 'Fort Aguada'],
    description: 'India’s tranquil coastal paradise with lush paddy fields and colonial heritage.'
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    region: 'West',
    tagline: 'Cultural capital of Maharashtra with Maratha fortresses and academic heritage',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Shaniwar Wada', 'Aga Khan Palace', 'Sinhagad Fort', 'Bakeries & Misal Pav'],
    description: 'Historical seat of the Peshwas with leafy streets and vibrant food traditions.'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West',
    tagline: 'India’s first UNESCO World Heritage City with intricate pols and stepwells',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Heritage Old City Walk', 'Gujarati Thali'],
    description: 'Historic trade and textile hub celebrated for wood-carved architecture and textile arts.'
  },

  // South India
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    tagline: 'The Garden City of lush parks, craft breweries, and tech innovation',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Lalbagh Botanical Garden', 'Cubbon Park', 'Bangalore Palace', 'South Indian Filter Coffee', 'Craft Breweries'],
    description: 'Dynamic cosmopolitan metropolis with pleasant weather and verdant botanical gardens.'
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    region: 'South',
    tagline: 'The heritage city of illuminated royal palaces, sandalwood, and silk',
    coordinates: { lat: 12.2958, lng: 76.6394 },
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Mysore Palace', 'Chamundi Hill', 'Devaraja Market', 'Mysore Pak', 'Silk Sarees'],
    description: 'Grand royal capital famed for Indo-Saracenic palace illumination and aromatic spice markets.'
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    region: 'South',
    tagline: 'Historic spice port with Chinese fishing nets, colonial quarters, and backwaters',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Fort Kochi Walk', 'Chinese Fishing Nets', 'Mattancherry Jewish Synagogue', 'Kathakali Dance', 'Kerala Fish Curry'],
    description: 'Age-old maritime melting pot where Portuguese, Dutch, British, and Arab influences converge.'
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    region: 'South',
    tagline: 'Rolling emerald tea plantations nestled in the misty Western Ghats',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Tea Gardens & Museum', 'Eravikulam National Park', 'Mattupetty Dam', 'Fresh Cardamom & Spices'],
    description: 'Pristine hill sanctuary carpeted with sprawling green tea estates.'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South',
    tagline: 'Dravidian temple architecture, classical arts, and expansive coastal promenades',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Kapaleeshwarar Temple', 'Marina Beach', 'San Thome Basilica', 'Classical Carnatic Music', 'Crisp Dosas'],
    description: 'Gateway to South India’s Dravidian cultural heritage and classical traditions.'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    region: 'South',
    tagline: 'The City of Pearls, Nizami palaces, and authentic dum biryani',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Charminar', 'Golconda Fort', 'Chowmahalla Palace', 'Hyderabadi Biryani', 'Laad Bazaar Pearls'],
    description: 'Historic city of Nizams famous for dramatic hill forts and world-renowned culinary art.'
  },
  {
    id: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    region: 'South',
    tagline: 'Queen of the Nilgiris with blue mountain peaks and pine plantations',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Nilgiri Mountain Railway', 'Botanical Gardens', 'Doddabetta Peak', 'Homemade Chocolates'],
    description: 'Scenic hill getaway in the Nilgiri hills with British colonial cottages.'
  },

  // East India
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    tagline: 'City of Joy celebrated for literary culture, grand colonial halls, and sweets',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Victoria Memorial', 'Howrah Bridge', 'Park Street Food', 'Kumartuli Clay Idols', 'Rosogolla'],
    description: 'India’s intellectual and artistic capital with grand avenues and vibrant coffee houses.'
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    region: 'East',
    tagline: 'Champagne of Teas with sunrise panoramas of Mount Kanchenjunga',
    coordinates: { lat: 27.0410, lng: 88.2663 },
    image: 'https://images.unsplash.com/photo-1622308644420-a75d50fb9752?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Tiger Hill Sunrise', 'Himalayan Toy Train', 'Glenary’s Bakery', 'Darjeeling Tea Estates'],
    description: 'Iconic Himalayan ridge town famous for world-class tea and snow-peaked vistas.'
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    region: 'East',
    tagline: 'The Temple City of ancient Kalinga stone architecture and sacred tanks',
    coordinates: { lat: 20.2961, lng: 85.8245 },
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Lingaraj Temple', 'Mukteshwar Temple', 'Udayagiri Caves', 'Odissi Dance', 'Chhena Poda'],
    description: 'Ancient capital of Kalinga featuring centuries of sandstone temple architecture.'
  },
  {
    id: 'puri',
    name: 'Puri',
    state: 'Odisha',
    region: 'East',
    tagline: 'Sacred coastal pilgrimage on the Bay of Bengal and home to the Rath Yatra',
    coordinates: { lat: 19.8135, lng: 85.8312 },
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Jagannath Temple', 'Golden Beach', 'Rath Yatra Festival', 'Konark Sun Temple Excursion'],
    description: 'Spiritual seaside sanctuary celebrated for centuries of temple heritage.'
  },

  // Central India
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    region: 'Central',
    tagline: 'The City of Lakes, begum palaces, and UNESCO pre-historic rock shelters',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Upper Lake', 'Taj-ul-Masajid', 'Bhimbetka Rock Shelters UNESCO', 'Sanchi Stupa Excursion'],
    description: 'Historic city of grand mosques, natural lakes, and nearby ancient Buddhist stupas.'
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    tagline: 'Cleanest city of India and street-food capital with night culinary bazaars',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Sarafa Night Food Market', 'Rajwada Palace', 'Chappan Dukan', 'Poha Jalebi'],
    description: 'Vibrant cultural hub famed for incredible night street food and royal Holkar history.'
  },
  {
    id: 'khajuraho',
    name: 'Khajuraho',
    state: 'Madhya Pradesh',
    region: 'Central',
    tagline: 'UNESCO World Heritage temples renowned for exquisite Nagara stone sculptures',
    coordinates: { lat: 24.8318, lng: 79.9199 },
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Western Group of Temples', 'Kandariya Mahadeva', 'Light & Sound Show', 'Dance Festival'],
    description: 'Masterpiece of medieval Indian stone art and temple architecture.'
  },

  // Northeast India
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    region: 'Northeast',
    tagline: 'Gateway to Northeast India on the banks of the mighty Brahmaputra',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Kamakhya Temple', 'Brahmaputra Sunset Cruise', 'Umananda Island', 'Assam Silk & Tea'],
    description: 'Bustling riverfront gateway surrounded by hills, sacred temples, and tea gardens.'
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    region: 'Northeast',
    tagline: 'Scotland of the East with pine hills, crystal waterfalls, and living root bridges',
    coordinates: { lat: 25.5788, lng: 91.8933 },
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80',
    popularFor: ['Elephant Falls', 'Shillong Peak', 'Police Bazar Cafe Music', 'Cherrapunji Day Excursion'],
    description: 'Lush hill capital celebrated for vibrant music scene, waterfalls, and cloud-draped valleys.'
  }
];

export const PLACES: Place[] = [
  {
    id: 'amber-fort',
    name: 'Amber Fort & Palace',
    hindiName: 'आमेर का किला',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    coordinates: { lat: 26.9855, lng: 75.8513 },
    address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
    description: 'A majestic 16th-century hilltop fortress complex renowned for its ornate Rajput and Mughal architecture, Sheesh Mahal (Mirror Palace), courtyards, and panoramic views of Maota Lake.',
    speciality: 'Intricate mirror mosaics in Sheesh Mahal & sprawling battlements.',
    categories: ['heritage', 'photography', 'viewpoint'],
    tags: ['Best Morning', 'Long Walk', 'Heritage', 'Photography', 'Audio Guide Available'],
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 3840,
    openingHours: {
      regular: '8:00 AM – 5:30 PM, Light Show 6:30 PM – 9:15 PM',
      bestTime: 'Early morning (8:00 AM – 10:00 AM) before tour buses arrive',
      estimatedDurationHours: 2.5
    },
    estimatedCost: {
      indianCitizen: 100,
      foreignNational: 500,
      currency: '₹',
      note: 'Composite Jaipur ticket accepted; Audio guide ~₹200'
    },
    crowdLevel: 'High',
    accessibility: {
      wheelchairAccessible: false,
      restroomsAvailable: true,
      stairsHeavy: true,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-amb-1',
        type: 'ticket',
        title: 'Official Ticket Counter & Composite Pass',
        description: 'Purchase tickets only at the official ASI/Rajasthan Tourism ticket counter near the main Suraj Pol entrance, or book online via rajasthan.gov.in. Ignore unofficial individuals claiming they can bypass ticket queues.',
        severity: 'caution',
        verified: true,
        updatedAt: '2026-08-15'
      },
      {
        id: 'g-amb-2',
        type: 'transport',
        title: 'Ascent to the Fort',
        description: 'You can walk up the paved stone path (10–15 min), take an authorized electric golf cart/jeep from the base parking area (~₹400 roundtrip), or hire an official taxi. Elephant rides are discouraged due to animal welfare considerations.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-10'
      },
      {
        id: 'g-amb-3',
        type: 'scam_prevention',
        title: 'Guide Verification',
        description: 'Hire only Rajasthan Tourism certified guides wearing laminated identity cards issued by the Department of Tourism. Agree on the fee (standard ~₹500 for up to 4 people) before starting.',
        severity: 'caution',
        verified: true,
        updatedAt: '2026-08-01'
      }
    ],
    culture: {
      dressCode: 'Comfortable modest walking attire. Hat and sunglasses recommended due to open stone courtyards.',
      footwearRule: 'allowed',
      photography: 'allowed_free',
      sacredRules: [
        'Shila Devi temple near the main gate requires removing footwear and leather items before stepping inside.'
      ],
      etiquetteTips: [
        'Avoid touching ancient stucco murals and mirror glass in Sheesh Mahal.',
        'Carry a refillable water bottle to stay hydrated during the uphill climb.'
      ]
    },
    travelTips: [
      'Combine your visit with nearby Jaigarh Fort via the subterranean tunnel walkway.',
      'Visit right at opening (8:00 AM) to experience the Sheesh Mahal with soft morning light without crowds.',
      'The Evening Sound & Light show (English & Hindi) has separate admission tickets.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Archaeological Survey of India & Rajasthan Tourism verified',
      confidence: 'High',
      lastVerified: '2026-08-20'
    }
  },
  {
    id: 'city-palace-jaipur',
    name: 'City Palace Jaipur',
    hindiName: 'सिटी पैलेस जयपुर',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    coordinates: { lat: 26.9258, lng: 75.8237 },
    address: 'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur 302002',
    description: 'The royal residence of the Maharaja of Jaipur, featuring courtyards, museums of royal costumes, weaponry, and the world-famous giant silver urns (Gangajalis).',
    speciality: 'Pritam Niwas Chowk with 4 seasonal peacock & lotus doorways.',
    categories: ['heritage', 'museum', 'photography'],
    tags: ['Center of City', 'Museum', 'Heritage', 'Couple Friendly'],
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.6,
    reviewCount: 2950,
    openingHours: {
      regular: '9:30 AM – 5:00 PM, Night view 7:00 PM – 10:00 PM',
      bestTime: '9:30 AM or late afternoon (3:30 PM)',
      estimatedDurationHours: 2.0
    },
    estimatedCost: {
      indianCitizen: 300,
      foreignNational: 700,
      currency: '₹',
      note: 'Special Royal Grandeur Chandra Mahal tour ticket is priced higher (~₹2,500)'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-cpj-1',
        type: 'ticket',
        title: 'Ticket Tiers',
        description: 'Standard Museum Ticket gives access to main courtyards, textile gallery, and arms museum. The premium Chandra Mahal tour includes private royal chambers and tea.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-12'
      }
    ],
    culture: {
      dressCode: 'Smart casual. Modest shoulders and knees appreciated in museum halls.',
      footwearRule: 'allowed',
      photography: 'allowed_free',
      etiquetteTips: [
        'Photography inside the private arms and textile museum halls is strictly prohibited.',
        'Part of the palace remains the private residence of the titular Royal Family.'
      ]
    },
    travelTips: [
      'Directly adjacent to Jantar Mantar and a 5-minute walk from Hawa Mahal.',
      'Stop by the Palace Cafe inside for traditional lassi and snacks in a shaded courtyard.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'City Palace Trust & ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-18'
    }
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    hindiName: 'हवा महल',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    coordinates: { lat: 26.9239, lng: 75.8267 },
    address: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur 302002',
    description: 'A five-story pink sandstone structure with 953 intricate jharokhas (latticed windows), built in 1799 so royal women could observe street festivals unseen.',
    speciality: 'Iconic honeycomb facade and natural cooling breeze architecture.',
    categories: ['heritage', 'photography', 'viewpoint'],
    tags: ['Iconic Facade', 'Quick Visit', 'Photography', 'Best Morning'],
    images: [
      'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 4200,
    openingHours: {
      regular: '9:00 AM – 5:00 PM',
      bestTime: 'Sunrise (6:30 AM – 8:00 AM) for photography from the opposite rooftop cafes',
      estimatedDurationHours: 1.0
    },
    estimatedCost: {
      indianCitizen: 50,
      foreignNational: 200,
      currency: '₹',
      note: 'Included in Jaipur composite ticket'
    },
    crowdLevel: 'High',
    accessibility: {
      wheelchairAccessible: false,
      restroomsAvailable: true,
      stairsHeavy: true,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-hm-1',
        type: 'timing',
        title: 'Best Photo Angle',
        description: 'The iconic honeycomb facade faces the main street. The best exterior photos are taken from the rooftop cafes opposite (e.g., Tattoo Cafe or Wind View Cafe) during morning light.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-15'
      }
    ],
    culture: {
      dressCode: 'Modest casual attire.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'The entrance to walk inside the palace is from the back street, not the main road facade.',
      'The upper ramps are narrow and can be steep; walk carefully.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Rajasthan Tourism verified',
      confidence: 'High',
      lastVerified: '2026-08-15'
    }
  },
  {
    id: 'jantar-mantar-jaipur',
    name: 'Jantar Mantar Observatory',
    hindiName: 'जंतर मंतर',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    coordinates: { lat: 26.9248, lng: 75.8246 },
    address: 'Gangori Bazaar, J.D.A. Market, Pink City, Jaipur 302002',
    description: 'A UNESCO World Heritage site featuring 19 architectural astronomical instruments built by Rajput King Sawai Jai Singh II, including the world’s largest stone sundial.',
    speciality: 'Brihat Samrat Yantra sundial accurate to within 2 seconds.',
    categories: ['heritage', 'museum'],
    tags: ['UNESCO World Heritage', 'Science & Astronomy', 'Educational'],
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewCount: 2100,
    openingHours: {
      regular: '9:00 AM – 5:00 PM',
      bestTime: 'Midday (11:30 AM – 1:30 PM) to watch the shadow instruments actively measuring time',
      estimatedDurationHours: 1.5
    },
    estimatedCost: {
      indianCitizen: 50,
      foreignNational: 200,
      currency: '₹',
      note: 'Jaipur composite ticket valid'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-jm-1',
        type: 'general',
        title: 'Guide Highly Recommended',
        description: 'Without a knowledgeable guide or the official audio guide, the stone instruments look like abstract geometric sculptures. A 30-minute guided explanation reveals their astonishing mathematical functions.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-10'
      }
    ],
    culture: {
      dressCode: 'Sun protection essential (wide-brim hat, sunscreen) as the observatory is fully outdoors.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'Directly adjacent to City Palace; visit them consecutively.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'UNESCO & ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-14'
    }
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    hindiName: 'ताज महल',
    cityId: 'agra',
    cityName: 'Agra',
    state: 'Uttar Pradesh',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
    description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river, commissioned in 1632 by Mughal Emperor Shah Jahan for his wife Mumtaz Mahal. A universal masterpiece of world heritage.',
    speciality: 'Pietra dura marble inlay, symmetrical water gardens, and glowing sunrise tones.',
    categories: ['heritage', 'photography', 'spiritual'],
    tags: ['UNESCO World Heritage', 'Wonders of the World', 'Best Sunrise', 'Strict Security'],
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 14200,
    openingHours: {
      regular: 'Sunrise to Sunset (approx. 6:00 AM – 6:30 PM). CLOSED ON FRIDAYS.',
      bestTime: 'Sunrise (enter queue at 5:30 AM) for magical pink-gold light and cooler temperatures',
      closedOn: 'Fridays (open only for Friday prayers for local residents)',
      estimatedDurationHours: 3.0
    },
    estimatedCost: {
      indianCitizen: 50,
      foreignNational: 1100,
      currency: '₹',
      note: 'Additional ₹200 to step onto the main mausoleum plinth; Shoe covers and water bottle included with foreign ticket'
    },
    crowdLevel: 'Peak',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-tm-1',
        type: 'ticket',
        title: 'Book Tickets Exclusively Online',
        description: 'Physical ticket counters at Taj Mahal are phased out. Purchase tickets exclusively at asi.payumoney.com or through official government portals. Download your QR code onto your phone before arriving, as network signal near the gates can be congested.',
        severity: 'important',
        verified: true,
        updatedAt: '2026-08-22'
      },
      {
        id: 'g-tm-2',
        type: 'scam_prevention',
        title: 'Strict Security & Prohibited Items',
        description: 'Strict security screening: Drone cameras, tripods, large bags/backpacks, tobacco, lighters, chewing gum, food, books, and external charging power banks are prohibited. Bring only a small bag with phone, camera, and passport/ID.',
        severity: 'important',
        verified: true,
        updatedAt: '2026-08-20'
      },
      {
        id: 'g-tm-3',
        type: 'transport',
        title: 'Electric Vehicles / Pollution Free Zone',
        description: 'Vehicles are not permitted within 500m of the monument. Authorized electric golf carts and battery rickshaws shuttle visitors from the East and West parking lots for ₹10–₹20.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-10'
      }
    ],
    culture: {
      dressCode: 'Modest attire covering shoulders and knees. As a functioning mosque and sacred mausoleum, respectful clothing is required.',
      footwearRule: 'shoe_covers_provided',
      photography: 'restricted_inside_sanctum',
      sacredRules: [
        'Photography and loud talking are strictly prohibited inside the main burial chamber/cenotaph room.',
        'Shoe covers must be worn before stepping onto the white marble platform.'
      ],
      etiquetteTips: [
        'Do not touch or lean on the delicate Pietra Dura floral marble carvings.',
        'Keep your ticket with you until exiting the perimeter.'
      ]
    },
    travelTips: [
      'East Gate has historically shorter queues at sunrise compared to West Gate.',
      'For sunset views without the crowds, visit Mehtab Bagh across the Yamuna river.',
      'Night viewing is open for 5 nights around the Full Moon each month (tickets must be booked 24h in advance).'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'ASI Taj Mahal National Authority verified',
      confidence: 'High',
      lastVerified: '2026-08-25'
    }
  },
  {
    id: 'agra-fort',
    name: 'Agra Fort',
    hindiName: 'आगरा का किला',
    cityId: 'agra',
    cityName: 'Agra',
    state: 'Uttar Pradesh',
    coordinates: { lat: 27.1795, lng: 78.0211 },
    address: 'Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003',
    description: 'A massive 16th-century red sandstone fortress that served as the imperial city of Mughal emperors. Features Diwan-i-Aam, Diwan-i-Khas, and the Musamman Burj tower where Shah Jahan was imprisoned with views of the Taj Mahal.',
    speciality: 'Jahangiri Mahal, Sheesh Mahal, and framed vistas of the Taj Mahal.',
    categories: ['heritage', 'viewpoint'],
    tags: ['UNESCO World Heritage', 'Red Sandstone', 'History'],
    images: [
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 3100,
    openingHours: {
      regular: '6:00 AM – 6:00 PM',
      bestTime: 'Morning or late afternoon (3:30 PM – 5:30 PM)',
      estimatedDurationHours: 2.0
    },
    estimatedCost: {
      indianCitizen: 50,
      foreignNational: 650,
      currency: '₹',
      note: 'Discount on ticket if same-day Taj Mahal ticket is presented'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-af-1',
        type: 'ticket',
        title: 'Same Day Taj Ticket Discount',
        description: 'If you already bought a Taj Mahal ticket on the same day, you receive a discount on the Agra Fort entrance ticket at the counter.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-10'
      }
    ],
    culture: {
      dressCode: 'Modest walking attire.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'Only about 25% of the fort is open to the public; the remainder is utilized by the Indian Army.',
      'Stand at the Musamman Burj balcony for the haunting view of the Taj Mahal where Shah Jahan spent his final years.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-15'
    }
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    hindiName: 'हुमायूँ का मक़बरा',
    cityId: 'delhi',
    cityName: 'Delhi',
    state: 'National Capital Territory',
    coordinates: { lat: 28.5933, lng: 77.2507 },
    address: 'Hazrat Nizamuddin Aulia, Mathura Rd, Nizamuddin, New Delhi 110013',
    description: 'The first garden-tomb on the Indian subcontinent, built in 1570, which inspired the architectural design of the Taj Mahal. Set within serene Persian Charbagh gardens with flowing water channels.',
    speciality: 'Red sandstone and white marble symmetry surrounded by pristine Mughal gardens.',
    categories: ['heritage', 'nature', 'photography'],
    tags: ['UNESCO World Heritage', 'Quiet Retreat', 'Photography', 'Best Late Afternoon'],
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewCount: 4600,
    openingHours: {
      regular: '6:00 AM – 6:00 PM',
      bestTime: 'Late afternoon (3:30 PM – 5:30 PM) for golden-hour light on the red sandstone',
      estimatedDurationHours: 2.0
    },
    estimatedCost: {
      indianCitizen: 40,
      foreignNational: 600,
      currency: '₹',
      note: 'Online booking via ASI portal saves ₹5–₹50'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-ht-1',
        type: 'general',
        title: 'Combined Visit with Sunder Nursery',
        description: 'Humayun’s Tomb shares a direct walkway access with Sunder Nursery (a 90-acre heritage park with 16th-century monuments, lakes, and organic cafe). Highly recommended to visit both in one afternoon.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-14'
      }
    ],
    culture: {
      dressCode: 'Modest comfortable casual.',
      footwearRule: 'shoe_covers_provided',
      photography: 'allowed_free',
      etiquetteTips: [
        'Inside the central octagonal cenotaph hall, remove shoes or slip on shoe covers.',
        'Silence is appreciated inside the tomb structure.'
      ]
    },
    travelTips: [
      'Nearest metro station is JLN Stadium (Violet Line) or Khan Market.',
      'Signage around the site details the Aga Khan Trust for Culture restoration project.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'ASI & Aga Khan Trust verified',
      confidence: 'High',
      lastVerified: '2026-08-20'
    }
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar Complex',
    hindiName: 'क़ुतुब मीनार',
    cityId: 'delhi',
    cityName: 'Delhi',
    state: 'National Capital Territory',
    coordinates: { lat: 28.5244, lng: 77.1855 },
    address: 'Seth Sarai, Mehrauli, New Delhi 110030',
    description: 'A 73-meter soaring minaret of victory founded in 1192 by Qutb-ud-din Aibak, alongside the ancient 4th-century rust-resistant Iron Pillar of Chandragupta and Quwwat-ul-Islam Mosque.',
    speciality: 'Fluted red sandstone carving with Quranic verses and the ancient rustless Iron Pillar.',
    categories: ['heritage', 'photography'],
    tags: ['UNESCO World Heritage', 'Historic Monument', 'Delhi Metro Accessible'],
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 5100,
    openingHours: {
      regular: '7:00 AM – 9:00 PM (Illuminated at night)',
      bestTime: 'Morning 8:00 AM or post-sunset for nighttime architectural lighting',
      estimatedDurationHours: 1.5
    },
    estimatedCost: {
      indianCitizen: 40,
      foreignNational: 600,
      currency: '₹'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-qm-1',
        type: 'transport',
        title: 'Metro Connectivity',
        description: 'Qutub Minar Metro Station (Yellow Line) is 1.5 km away. Auto-rickshaws connect the station to the complex for standard ₹30–₹40.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-15'
      }
    ],
    culture: {
      dressCode: 'Casual comfortable attire.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'The illuminated night view (open until 9 PM) offers a dramatic photography perspective.',
      'Mehrauli Archaeological Park is a 10-minute walk through Jamali Kamali for hidden tomb explorers.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-16'
    }
  },
  {
    id: 'dashashwamedh-ghat',
    name: 'Dashashwamedh Ghat & Evening Ganga Aarti',
    hindiName: 'दशाश्वमेध घाट',
    cityId: 'varanasi',
    cityName: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.3076, lng: 83.0107 },
    address: 'Dashashwamedh Ghat Rd, Ghats of Varanasi, Varanasi, Uttar Pradesh 221001',
    description: 'The most vibrant and central ghat on the sacred Ganges river in Varanasi. Every evening at dusk, young priests perform the elaborate Maha Aarti ritual with tiered brass fire lamps, conch shells, and incense.',
    speciality: 'Grand evening fire aarti ceremony viewed from the riverbanks and wooden boats.',
    categories: ['spiritual', 'culture', 'photography'],
    tags: ['Sacred Experience', 'Free Entry', 'Evening Aarti', 'Boat Ride'],
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 6800,
    openingHours: {
      regular: 'Open 24 hours; Evening Aarti begins ~6:30 PM (Winter) or ~7:00 PM (Summer)',
      bestTime: 'Arrive by 5:30 PM to secure a seating spot on the steps or hire a boat',
      estimatedDurationHours: 2.0
    },
    estimatedCost: {
      indianCitizen: 0,
      foreignNational: 0,
      currency: '₹',
      note: 'Aarti viewing on the steps is completely free. Hand-rowed boat seat ~₹150–₹300 per person'
    },
    crowdLevel: 'Peak',
    accessibility: {
      wheelchairAccessible: false,
      restroomsAvailable: true,
      stairsHeavy: true,
      drinkingWaterAvailable: false
    },
    guidance: [
      {
        id: 'g-dg-1',
        type: 'scam_prevention',
        title: 'Boat Fare Verification & Aarti Seating',
        description: 'You do NOT need to pay anyone to stand or sit on the open stone ghat steps. If hiring a boat, negotiate and fix the price beforehand (government suggested rate is ₹100–₹150/hr for shared boat, ₹600–₹1,000 for private rowboat). Pay only after returning to the shore.',
        severity: 'important',
        verified: true,
        updatedAt: '2026-08-20'
      },
      {
        id: 'g-dg-2',
        type: 'clothing',
        title: 'Footwear & Steps Etiquette',
        description: 'Wear comfortable slip-on shoes with good traction, as stone steps near the water can be slippery with river silt. Modest clothing covering shoulders and knees is appropriate.',
        severity: 'caution',
        verified: true,
        updatedAt: '2026-08-10'
      },
      {
        id: 'g-dg-3',
        type: 'scam_prevention',
        title: 'Cremation Ghat Photography Rule (Manikarnika)',
        description: 'Dashashwamedh is a celebration ghat where photography is encouraged. However, at nearby Manikarnika Ghat (cremation ghat), photography of funeral pyres is STRICTLY taboo and offensive. Never photograph cremations, and ignore touts demanding "wood donations".',
        severity: 'important',
        verified: true,
        updatedAt: '2026-08-22'
      }
    ],
    culture: {
      dressCode: 'Respectful modest clothing covering knees and shoulders.',
      footwearRule: 'allowed',
      photography: 'allowed_free',
      sacredRules: [
        'Do not place floating diya lamps in the river if made of plastic or non-biodegradable foil; use only leaf-and-clay diyas.',
        'Be mindful of pilgrims bathing and meditating along the water edge.'
      ],
      etiquetteTips: [
        'A small tip (₹10–₹20) in the aarti donation tray is optional if a priest offers holy flame blessing (tilak/aarti).'
      ]
    },
    travelTips: [
      'Take a 5:30 AM sunrise boat ride from Assi Ghat to Dashashwamedh to witness morning bathing rituals and serene mist.',
      'The narrow alleys (galis) behind the ghats are packed with authentic lassi shops (Blue Lassi) and silk weavers.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Varanasi Smart City & UP Tourism verified',
      confidence: 'High',
      lastVerified: '2026-08-24'
    }
  },
  {
    id: 'basilica-bom-jesus',
    name: 'Basilica of Bom Jesus',
    hindiName: 'बेसिलिका ऑफ बॉम जीसस',
    cityId: 'goa',
    cityName: 'Goa',
    state: 'Goa',
    coordinates: { lat: 15.5009, lng: 73.9116 },
    address: 'Old Goa Rd, Bainguinim, Goa 403402',
    description: 'A 16th-century UNESCO World Heritage church and landmark of baroque Portuguese architecture in Old Goa, housing the sacred mortal remains of St. Francis Xavier.',
    speciality: 'Unplastered laterite facade, gilded baroque altarpiece, and silver casket of St. Francis Xavier.',
    categories: ['spiritual', 'heritage'],
    tags: ['UNESCO World Heritage', 'Old Goa', 'Sacred Church', 'Historic'],
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 3400,
    openingHours: {
      regular: 'Monday–Saturday 9:00 AM – 6:30 PM, Sunday 10:30 AM – 6:30 PM',
      bestTime: 'Morning 9:30 AM to avoid mid-day tour buses',
      estimatedDurationHours: 1.5
    },
    estimatedCost: {
      indianCitizen: 0,
      foreignNational: 0,
      currency: '₹',
      note: 'Free entry; ₹10–₹20 for museum gallery on upper floor'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-bj-1',
        type: 'clothing',
        title: 'Strict Dress Code',
        description: 'As an active Roman Catholic church and pilgrimage sanctuary, strict dress code is enforced at the door. Sleeveless tops, tank tops, short skirts, and beach shorts are not permitted. Shawls/wraps are available for rent at the entrance.',
        severity: 'important',
        verified: true,
        updatedAt: '2026-08-18'
      }
    ],
    culture: {
      dressCode: 'Modest church attire with shoulders and thighs covered.',
      footwearRule: 'allowed',
      photography: 'allowed_free',
      sacredRules: [
        'Maintain silence inside the sanctuary.',
        'Turn off mobile ringers before entering.'
      ]
    },
    travelTips: [
      'Directly across the road from the grand Se Cathedral and Church of St. Francis of Assisi.',
      'Every 10 years, the Exposition of the Relics of St. Francis Xavier draws millions of pilgrims.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Archdiocese of Goa & ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-19'
    }
  },
  {
    id: 'fort-aguada',
    name: 'Fort Aguada & Lighthouse',
    hindiName: 'फोर्ट अगुआड़ा',
    cityId: 'goa',
    cityName: 'Goa',
    state: 'Goa',
    coordinates: { lat: 15.4925, lng: 73.7735 },
    address: 'Aguada Fort Area, Candolim, Goa 403515',
    description: 'A 17th-century Portuguese fortress standing on Sinquerim Beach overlooking the Arabian Sea, featuring a historic four-story lighthouse and ancient freshwater storage cisterns.',
    speciality: 'Panoramic Arabian Sea coastal views and preserved bastion battlements.',
    categories: ['heritage', 'viewpoint', 'photography'],
    tags: ['Sea View', 'Portuguese Fort', 'Sunset Spot', 'Coastal Walk'],
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewCount: 4100,
    openingHours: {
      regular: '9:30 AM – 6:00 PM',
      bestTime: 'Late afternoon (4:30 PM – 6:00 PM) for ocean sunset breezes',
      estimatedDurationHours: 1.5
    },
    estimatedCost: {
      indianCitizen: 50,
      foreignNational: 300,
      currency: '₹'
    },
    crowdLevel: 'Moderate',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-fa-1',
        type: 'timing',
        title: 'Sun Protection',
        description: 'The fort ramparts are wide and exposed to the direct sun with little tree cover. Bring a hat, sunscreen, and water.',
        severity: 'info',
        verified: true,
        updatedAt: '2026-08-10'
      }
    ],
    culture: {
      dressCode: 'Casual beachwear is common outside, but shirts/cover-ups required inside the heritage fort zone.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'The Aguada Central Jail museum situated just below the fort has been restored as a museum of the Goa freedom struggle.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Goa Tourism & ASI verified',
      confidence: 'High',
      lastVerified: '2026-08-15'
    }
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    hindiName: 'गेटवे ऑफ इंडिया',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
    description: 'An iconic 26-meter arch monument overlooking Mumbai harbour, erected in 1924 to commemorate the landing of King George V and Queen Mary. The departure point for boats to Elephanta Caves.',
    speciality: 'Indo-Saracenic basalt arch framing Mumbai Harbour alongside the Taj Mahal Palace Hotel.',
    categories: ['heritage', 'photography', 'viewpoint'],
    tags: ['Iconic Monument', 'Seafront', 'Free Entry', 'Colaba'],
    images: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewCount: 9500,
    openingHours: {
      regular: 'Open 24 hours; Promenade security active',
      bestTime: 'Early morning (6:30 AM – 8:30 AM) or sunset (5:30 PM)',
      estimatedDurationHours: 1.0
    },
    estimatedCost: {
      indianCitizen: 0,
      foreignNational: 0,
      currency: '₹',
      note: 'Monument plaza is free. Elephanta ferry ticket ~₹260 round-trip'
    },
    crowdLevel: 'Peak',
    accessibility: {
      wheelchairAccessible: true,
      restroomsAvailable: true,
      stairsHeavy: false,
      drinkingWaterAvailable: true
    },
    guidance: [
      {
        id: 'g-goi-1',
        type: 'scam_prevention',
        title: 'Instant Photographers & Pigeon Sellers',
        description: 'Dozens of roving photographers offer instant printed photos for ₹50–₹100. Confirm the exact total price and count before agreeing. Ignore touts selling bird seeds or requesting donations.',
        severity: 'caution',
        verified: true,
        updatedAt: '2026-08-20'
      }
    ],
    culture: {
      dressCode: 'Casual city attire.',
      footwearRule: 'allowed',
      photography: 'allowed_free'
    },
    travelTips: [
      'Take the 1-hour scenic ferry to UNESCO Elephanta Caves departing directly from Jetty 1 & 2.',
      'Walk across to the historic Sea Lounge or Leopold Cafe in Colaba for refreshments.'
    ],
    trust: {
      status: 'VERIFIED',
      sourceType: 'Maharashtra Tourism verified',
      confidence: 'High',
      lastVerified: '2026-08-21'
    }
  }
];

export const CULTURAL_TOPICS: CulturalTopic[] = [
  {
    id: 'temple-etiquette',
    title: 'Sacred Temples & Religious Places',
    category: 'sacred',
    summary: 'Essential guidelines for visiting Hindu temples, Jain Derasars, Sikh Gurdwaras, and Mosques across India with reverence.',
    detailedGuide: [
      'In India, religious sites are active places of devotion rather than static museums.',
      'Footwear removal: Always remove shoes, sandals, and leather belts/wallets where indicated before stepping onto temple plinths.',
      'Head coverings: In Sikh Gurdwaras (such as the Golden Temple or Bangla Sahib), both men and women must cover their heads with a scarf or rumal, and wash hands/feet at the entrance pool.',
      'Circumambulation (Pradakshina): Walk around the inner sanctum in a clockwise direction.',
      'Offerings (Prasad): If a priest offers sweet prasad or sacred flame (aarti), receive it respectfully using your right hand cupped over the left.'
    ],
    regionScope: 'All India (National Practice)',
    doList: [
      'Remove footwear and deposit it at designated shoe stands (usually free or ₹5–₹10 token).',
      'Dress modestly with shoulders, chest, and knees covered.',
      'Accept prasad (sacred offering) with both hands or the right hand.',
      'Maintain quiet and turn off mobile phone ringers.'
    ],
    dontList: [
      'Never touch consecrated deity idols or step on the threshold of the inner sanctum.',
      'Do not wear shorts, tank tops, or transparent clothing.',
      'Never photograph people praying or the inner deity sanctum where signs forbid it.',
      'Do not point the soles of your feet towards sacred statues or priests.'
    ],
    culturalContext: 'In Indian spiritual philosophy, the temple represents the cosmic body, and crossing the threshold is a transition from the mundane to the sacred.',
    iconName: 'Building2'
  },
  {
    id: 'dining-norms',
    title: 'Dining Norms & Hand Etiquette',
    category: 'dining',
    summary: 'The cultural significance of the right hand, shared food hygiene (Jhoota), and traditional Indian dining customs.',
    detailedGuide: [
      'Right Hand Rule: Traditional meals (thalis, dosas, rotis) are often eaten using the fingers of the right hand. The left hand is traditionally reserved for personal hygiene and should not be used to touch food or pass dishes.',
      'The Concept of Jhoota (Uchhishta): Food or beverages that have touched someone’s mouth are considered impure to share with others. When sharing water from a communal bottle, pour it directly into your mouth without your lips touching the rim.',
      'Cutlery is always available: In restaurants, spoons and forks are readily provided if you prefer not to eat with your hands.',
      'Vegetarianism (Shakahari): Pure vegetarian food is extraordinarily widespread and delicious. Look for the green dot inside a green square label on all packaged foods in India (red dot indicates non-veg).'
    ],
    regionScope: 'All India (Pan-Indian Norm)',
    doList: [
      'Wash your hands thoroughly before and after every meal.',
      'Use your right hand for eating and passing food containers.',
      'Ask for "Normal Water" or sealed packaged mineral water as per your preference.'
    ],
    dontList: [
      'Do not touch another person’s plate with hands that have touched food.',
      'Do not pass food or cups using the left hand.'
    ],
    culturalContext: 'Ayurvedic tradition values eating with hands as a sensory connection that initiates digestion through tactile temperature and texture perception.',
    iconName: 'Utensils'
  },
  {
    id: 'greetings-courtesy',
    title: 'Greetings & Body Language',
    category: 'greetings',
    summary: 'Using Namaste, handshakes, personal space, and respectful interpersonal gestures in India.',
    detailedGuide: [
      'Namaste / Namaskar: Placing palms together at chest level with a slight bow is the universally appreciated, respectful greeting across India. It honors the divine spirit within the other person.',
      'Adaab: In Muslim-influenced heritage areas (Old Delhi, Lucknow, Hyderabad), a slight bow with the right hand raised to the forehead is a graceful formal greeting.',
      'Handshakes: Common in modern business and urban settings. However, when meeting traditional elders or women in conservative areas, wait for them to initiate a handshake; otherwise, a warm Namaste is always ideal.',
      'Touching Feet (Charan Sparsh): You may see younger people touch elders’ feet as a sign of respect and blessing.'
    ],
    regionScope: 'All India',
    doList: [
      'Greet with "Namaste" and a pleasant smile.',
      'Address elders respectfully using "-ji" suffix (e.g., Uncle-ji, Bhai-ji).',
      'Accept gifts or money with the right hand.'
    ],
    dontList: [
      'Avoid aggressive direct public confrontation; calm, polite persistence works far better.',
      'Avoid intense public displays of romantic affection (PDA), which are frowned upon in traditional areas.'
    ],
    culturalContext: 'The greeting "Namaste" comes from Sanskrit meaning "I bow to the divine in you," transcending social hierarchy.',
    iconName: 'Heart'
  },
  {
    id: 'photography-etiquette',
    title: 'Photography & Filming Etiquette',
    category: 'photography',
    summary: 'Guidelines for photographing monuments, local people, sadhus, and sacred ceremonies respectfully.',
    detailedGuide: [
      'Always ask permission before photographing local people, artisans, street vendors, or women: A friendly gesture pointing to the camera and a smile ("Photo le sakte hain?") is universally understood.',
      'Sadhus and Holy Men: Holy men near ghats or temples may pose for photos and subsequently ask for a dakshina/tip (₹50–₹100). If you take their portrait, offering a small token is standard courtesy.',
      'Airports & Military zones: Photography is strictly prohibited at airports, military stations, and border checkpoints.',
      'Cremation Ghats: Absolute zero-tolerance for photography at cremation grounds (e.g., Manikarnika Ghat in Varanasi).'
    ],
    regionScope: 'All India',
    doList: [
      'Ask consent before taking close-up portraits of individuals.',
      'Show people the photo on your camera screen; it frequently sparks warm conversations.',
      'Check for ASI tripods/commercial camera ticket fees at heritage monuments.'
    ],
    dontList: [
      'Never take photos at cremation pyres or inside active temple sanctums.',
      'Do not use flash inside ancient fresco chambers (such as Ajanta Caves) as it degrades 1000-year-old pigments.'
    ],
    culturalContext: 'Respectful photography builds bridges; treating individuals as human subjects rather than exotic props fosters genuine warmth.',
    iconName: 'Camera'
  },
  {
    id: 'market-bargaining',
    title: 'Market Bargaining & Fair Commerce',
    category: 'shopping',
    summary: 'How to negotiate politely in traditional bazaars, understanding fixed-price vs negotiable shops.',
    detailedGuide: [
      'Where to bargain: Bargaining is expected in street markets (Janpath, Colaba Causeway, Johari Bazaar), auto-rickshaws without functional meters, and independent handicraft stalls.',
      'Where NOT to bargain: Fixed-price emporiums (Central Cottage Industries, State Handloom Co-ops), restaurants, supermarkets, pharmacies, and high-street stores.',
      'Keep it lighthearted and friendly: Bargaining is a polite social dance, not a battle. Smile, banter, and if the price does not suit you, politely say "Thank you" and walk away.'
    ],
    regionScope: 'Traditional Bazaars across India',
    doList: [
      'Counter-offer around 50–60% of the initial quote in tourist street stalls, settling around 70–75%.',
      'Check quality, seams, and fabric authenticity before discussing price.',
      'Keep small currency notes (₹50, ₹100, ₹200) ready for market transactions.'
    ],
    dontList: [
      'Do not get angry or aggressively demean the merchant’s product.',
      'Do not follow touts into commission-based back-alley showrooms claiming "government factory outlet".'
    ],
    culturalContext: 'Commerce in India is inherently relationship-driven; a friendly conversation often yields better prices and genuine tea invitations.',
    iconName: 'ShoppingBag'
  }
];

export const PHRASES: Phrase[] = [
  {
    id: 'p-1',
    originalText: 'नमस्ते',
    phonetic: 'Namaste',
    englishMeaning: 'Hello / Greetings (formal & universal)',
    language: 'Hindi',
    category: 'Greetings',
    contextTip: 'Fold your palms at your chest when saying this.',
    audioPronunciationText: 'Namaste'
  },
  {
    id: 'p-2',
    originalText: 'धन्यवाद / शुक्रिया',
    phonetic: 'Dhanyavaad / Shukriya',
    englishMeaning: 'Thank you',
    language: 'Hindi',
    category: 'Courtesy',
    contextTip: 'Dhanyavaad is Sanskrit-derived; Shukriya is Urdu-derived. Both are widely understood.',
    audioPronunciationText: 'Dhanyavaad'
  },
  {
    id: 'p-3',
    originalText: 'यह कितने का है?',
    phonetic: 'Yeh kitne ka hai?',
    englishMeaning: 'How much does this cost?',
    language: 'Hindi',
    category: 'Shopping',
    contextTip: 'Point to the item in a bazaar while asking.',
    audioPronunciationText: 'Yeh kitne ka hai'
  },
  {
    id: 'p-4',
    originalText: 'थोड़ा कम कीजिए',
    phonetic: 'Thoda kam kijiye',
    englishMeaning: 'Please reduce the price a little (bargaining)',
    language: 'Hindi',
    category: 'Shopping',
    contextTip: 'Say with a warm smile during bazaar negotiations.',
    audioPronunciationText: 'Thoda kam kijiye'
  },
  {
    id: 'p-5',
    originalText: 'क्या आप मीटर चालू करेंगे?',
    phonetic: 'Kya aap meter chalu karenge?',
    englishMeaning: 'Will you turn on the meter? (for Auto/Taxi)',
    language: 'Hindi',
    category: 'Transport',
    contextTip: 'Use when hailing an auto rickshaw in Mumbai, Delhi, or Pune.',
    audioPronunciationText: 'Kya aap meter chalu karenge'
  },
  {
    id: 'p-6',
    originalText: 'मुझे _____ जाना है',
    phonetic: 'Mujhe _____ jaana hai',
    englishMeaning: 'I want to go to _____',
    language: 'Hindi',
    category: 'Transport',
    contextTip: 'Insert the place name (e.g., "Mujhe Amber Fort jaana hai").',
    audioPronunciationText: 'Mujhe jaana hai'
  },
  {
    id: 'p-7',
    originalText: 'कम तीखा बनाइए',
    phonetic: 'Kam teekha banaiye',
    englishMeaning: 'Please make it less spicy',
    language: 'Hindi',
    category: 'Dining',
    contextTip: 'Essential phrase when ordering food at local restaurants.',
    audioPronunciationText: 'Kam teekha banaiye'
  },
  {
    id: 'p-8',
    originalText: 'क्या यह शाकाहारी है?',
    phonetic: 'Kya yeh shakahari hai?',
    englishMeaning: 'Is this vegetarian?',
    language: 'Hindi',
    category: 'Dining',
    contextTip: 'Shakahari means pure vegetarian (no meat, fish, or eggs).',
    audioPronunciationText: 'Kya yeh shakahari hai'
  },
  {
    id: 'p-9',
    originalText: 'पीने का पानी मिलेगा?',
    phonetic: 'Peene ka paani milega?',
    englishMeaning: 'Can I get drinking water?',
    language: 'Hindi',
    category: 'Dining',
    contextTip: 'Ask for "packaged bottle" if you need sealed bottled water.',
    audioPronunciationText: 'Peene ka paani milega'
  },
  {
    id: 'p-10',
    originalText: 'कृपया मदद कीजिए',
    phonetic: 'Kripya madad kijiye',
    englishMeaning: 'Please help me',
    language: 'Hindi',
    category: 'Emergency',
    contextTip: 'Clear, polite call for assistance in public.',
    audioPronunciationText: 'Kripya madad kijiye'
  },
  {
    id: 'p-11',
    originalText: 'अस्पताल कहाँ है?',
    phonetic: 'Aspataal kahan hai?',
    englishMeaning: 'Where is the hospital?',
    language: 'Hindi',
    category: 'Emergency',
    contextTip: 'Use in medical urgent situations.',
    audioPronunciationText: 'Aspataal kahan hai'
  },
  {
    id: 'p-12',
    originalText: 'खम्मा घणी',
    phonetic: 'Khamma Ghani',
    englishMeaning: 'Royal Rajasthani Greeting (Respectful Hello)',
    language: 'Rajasthani',
    category: 'Greetings',
    contextTip: 'Reply with "Ghani Khamma" in Jaipur, Udaipur, and Jodhpur.',
    audioPronunciationText: 'Khamma Ghani'
  }
];

export const FAIR_PRICE_ITEMS: FairPriceItem[] = [
  {
    id: 'fp-1',
    cityId: 'jaipur',
    serviceType: 'auto_rickshaw',
    title: 'Auto Rickshaw (Day City Ride)',
    routeOrItem: 'Per Kilometer rate / Short City Hops (3–5 km)',
    minPrice: 60,
    maxPrice: 120,
    currency: '₹',
    unit: 'per 3–5 km trip (Base ₹30 + ₹15/km)',
    practicalAdvice: 'In Jaipur, auto rickshaws often quote high fixed tourist rates (₹300–₹500) near Hawa Mahal or railway stations. You can negotiate down to ₹80–₹120 for central city hops, or book via Ola/Uber auto for upfront metered pricing.',
    negotiationTips: [
      'Check distance on your map first; multiply km by approx. ₹15–₹20 plus ₹30 base.',
      'Politely state your target price: "₹100 mein chalenge?"',
      'If they insist on taking you to a textile showroom for free, decline politely.'
    ],
    recommendedAlternatives: [
      'Jaipur Metro (Connects Mansarovar to Chandpole/Badi Choupad for ₹10–₹20)',
      'Uber Auto or Ola Auto apps for transparent automated fares'
    ]
  },
  {
    id: 'fp-2',
    cityId: 'jaipur',
    serviceType: 'auto_rickshaw',
    title: 'Jaipur Center to Amber Fort',
    routeOrItem: 'City Center (MI Road / Pink City) to Amber Fort (~11 km one way)',
    minPrice: 250,
    maxPrice: 400,
    currency: '₹',
    unit: 'one way ride',
    practicalAdvice: 'A fair auto rate from Jaipur Old City to Amber Fort is ₹300–₹350. Round trip with 2 hours waiting time is typically ₹600–₹800. For return trips, prepaid taxi counters and Uber are also available at the base of the fort.',
    negotiationTips: [
      'Agree on waiting time and return clearly before departing.',
      'Pay only after you are brought back safely to your destination.'
    ],
    recommendedAlternatives: [
      'AC Low Floor City Bus AC-1 or Bus 5 from Hawa Mahal to Amer (₹35 per person)',
      'Book a registered app-cab for approx. ₹350–₹450 in air-conditioned comfort'
    ]
  },
  {
    id: 'fp-3',
    cityId: 'delhi',
    serviceType: 'taxi',
    title: 'Delhi IGI Airport to Central Delhi (Connaught Place)',
    routeOrItem: 'Terminal 3 to Central Delhi (~16–18 km)',
    minPrice: 450,
    maxPrice: 650,
    currency: '₹',
    unit: 'trip',
    practicalAdvice: 'Do not follow unsolicited drivers approaching inside the arrivals hall. Use only the official Delhi Police Prepaid Taxi Counter outside the terminal doors, or official Uber/Ola pickup bays on Level P4.',
    negotiationTips: [
      'Delhi Police Prepaid counter has fixed transparent receipts with the car number.',
      'Keep the customer copy slip with you and hand the driver the yellow trip slip only upon reaching your hotel.'
    ],
    recommendedAlternatives: [
      'Delhi Airport Metro Express Line: High-speed air-conditioned train directly to New Delhi Station in 19 mins for only ₹60'
    ]
  },
  {
    id: 'fp-4',
    cityId: 'varanasi',
    serviceType: 'boat_ride',
    title: 'Ganges Boat Ride (Morning / Evening Aarti)',
    routeOrItem: 'Assi Ghat to Dashashwamedh / Manikarnika (1.5–2 hours)',
    minPrice: 150,
    maxPrice: 300,
    currency: '₹',
    unit: 'per person (Shared hand-rowed boat) or ₹800–₹1,200 (Private boat)',
    practicalAdvice: 'Boatmen on the ghats may initially quote ₹2,500–₹4,000 to foreign tourists. The standard local rate for a shared rowboat is ₹150–₹250 per seat. Private rowboats are ₹800–₹1,200 total for up to 4–6 people.',
    negotiationTips: [
      'Hand-rowed wooden boats are quieter and more atmospheric than loud diesel motorboats.',
      'Specify the exact route: "Assi to Manikarnika and back to Dashashwamedh".',
      'Pay only after stepping off the boat back on the ghat.'
    ],
    recommendedAlternatives: [
      'UP Tourism Alaknanda AC Catamaran Cruise for fixed scheduled departures with audio commentary'
    ]
  },
  {
    id: 'fp-5',
    cityId: 'jaipur',
    serviceType: 'monument_guide',
    title: 'Approved Monument Guide (Amber Fort / City Palace)',
    routeOrItem: '2-hour comprehensive guided historical walk',
    minPrice: 400,
    maxPrice: 650,
    currency: '₹',
    unit: 'per group (up to 4 visitors)',
    practicalAdvice: 'Always verify the guide’s photo ID badge issued by the Ministry of Tourism (Government of India) or Rajasthan Tourism. Official rates are printed on the tariff board near the ticket kiosk.',
    negotiationTips: [
      'Ask to see their valid government identity card badge before beginning.',
      'Clarify that you do not wish to visit souvenir shops or gemstone stores during the tour.'
    ],
    recommendedAlternatives: [
      'Official ASI Multi-lingual Audio Guide headpiece (~₹200) available at the ticket desk'
    ]
  },
  {
    id: 'fp-6',
    cityId: 'delhi',
    serviceType: 'street_food',
    title: 'Authentic Street Food (Chaat, Kachori, Lassi)',
    routeOrItem: 'Per plate at established clean vendor shops',
    minPrice: 40,
    maxPrice: 100,
    currency: '₹',
    unit: 'per portion',
    practicalAdvice: 'Street food prices are standard and printed on menu boards. Famous shops (e.g., Natraj Dahi Bhalla, Rawat Kachori) charge ₹50–₹90 per portion. Choose vendors with high local turnover where food is freshly fried or prepared hot.',
    negotiationTips: [
      'Street food at established shops has fixed prices; do not haggle over printed food menu rates.'
    ],
    recommendedAlternatives: [
      'Haldiram’s or Bikanervala chain restaurants for hygienic air-conditioned chaat dining'
    ]
  }
];

export const TRAVEL_UPDATES: TravelUpdate[] = [
  {
    id: 'up-1',
    title: 'Jaipur Heritage Monuments: Evening Illumination Schedule',
    summary: 'Amber Fort and Hawa Mahal facade illuminations now operate daily from 6:30 PM to 9:30 PM. Tickets for night viewing at Amber Fort can be bought directly at the gate.',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    relatedPlaceId: 'amber-fort',
    relatedPlaceName: 'Amber Fort & Palace',
    date: '2026-08-25',
    importance: 'medium',
    sourceLabel: 'Rajasthan Tourism Advisory',
    category: 'event'
  },
  {
    id: 'up-2',
    title: 'Taj Mahal: Strict Prohibition on Power Banks & Tripods',
    summary: 'Archaeological Survey of India reiterates that external battery power banks, selfie sticks, and camera tripods must be deposited at the cloakroom before the security screening gate.',
    cityId: 'agra',
    cityName: 'Agra',
    relatedPlaceId: 'taj-mahal',
    relatedPlaceName: 'Taj Mahal',
    date: '2026-08-22',
    importance: 'high',
    sourceLabel: 'ASI Agra Circle Bulletin',
    category: 'advisory'
  },
  {
    id: 'up-3',
    title: 'Varanasi Ghats: Summer/Monsoon Aarti Timings',
    summary: 'The evening Maha Aarti at Dashashwamedh Ghat commences promptly at 6:45 PM. Visitors are advised to arrive on boats or river steps by 5:45 PM for prime seating.',
    cityId: 'varanasi',
    cityName: 'Varanasi',
    relatedPlaceId: 'dashashwamedh-ghat',
    relatedPlaceName: 'Dashashwamedh Ghat',
    date: '2026-08-20',
    importance: 'medium',
    sourceLabel: 'Ganga Seva Nidhi Trust',
    category: 'event'
  },
  {
    id: 'up-4',
    title: 'Delhi Metro QR-Ticketing via WhatsApp Active',
    summary: 'Travelers across Delhi NCR can now purchase instant single-journey metro tickets directly by texting the DMRC WhatsApp bot (+91 96508 55800) in English, avoiding ticket token queues.',
    cityId: 'delhi',
    cityName: 'Delhi',
    date: '2026-08-18',
    importance: 'low',
    sourceLabel: 'Delhi Metro Rail Corporation',
    category: 'advisory'
  }
];

export const SAFETY_RESOURCES: SafetyResource[] = [
  {
    id: 'safe-1',
    type: 'helpline',
    name: 'National Unified Emergency Helpline',
    phoneNumber: '112',
    availableHours: '24/7 (Toll-Free, Multi-lingual)',
    description: 'Universal emergency response for Police, Fire, and Medical assistance anywhere in India.',
    isNational: true
  },
  {
    id: 'safe-2',
    type: 'tourist_desk',
    name: 'Ministry of Tourism 24x7 Multi-lingual Helpline',
    phoneNumber: '1363',
    availableHours: '24/7 (Toll-Free in 12 languages including English, French, German, Spanish, Japanese, Russian)',
    description: 'Official Government of India tourist assistance helpline for travel advisories, emergency guidance, and tourist disputes.',
    isNational: true
  },
  {
    id: 'safe-3',
    type: 'women_safety',
    name: 'National Women Helpline',
    phoneNumber: '1091',
    availableHours: '24/7',
    description: 'Dedicated national helpline for women travelers requiring police assistance or support.',
    isNational: true
  },
  {
    id: 'safe-4',
    type: 'police',
    name: 'Police Emergency Line',
    phoneNumber: '100',
    availableHours: '24/7',
    description: 'Direct police control room dispatch across all Indian states.',
    isNational: true
  },
  {
    id: 'safe-5',
    type: 'hospital',
    name: 'Medical Ambulance Dispatch',
    phoneNumber: '102',
    availableHours: '24/7',
    description: 'National emergency ambulance response service.',
    isNational: true
  },
  {
    id: 'safe-6',
    type: 'hospital',
    name: 'SMS Hospital (Sawai Man Singh)',
    phoneNumber: '+91 141 251 8224',
    address: 'Jawahar Lal Nehru Marg, Ashok Nagar, Jaipur, Rajasthan 302004',
    cityId: 'jaipur',
    availableHours: '24/7 Emergency Trauma Care',
    description: 'Premier tertiary multi-specialty government hospital and trauma center in Jaipur.',
    isNational: false
  },
  {
    id: 'safe-7',
    type: 'hospital',
    name: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
    phoneNumber: '+91 11 2658 8500',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    cityId: 'delhi',
    availableHours: '24/7 Emergency Wing',
    description: 'India’s foremost national medical research hospital and emergency trauma center.',
    isNational: false
  },
  {
    id: 'safe-8',
    type: 'tourist_desk',
    name: 'Jaipur Tourist Police Assistance Booth',
    phoneNumber: '+91 141 260 0386',
    address: 'Near Hawa Mahal & Railway Station, Jaipur',
    cityId: 'jaipur',
    availableHours: '8:00 AM – 10:00 PM',
    description: 'Specialized tourist assistance police desk for addressing overcharging, touts, or lost baggage.',
    isNational: false
  }
];
