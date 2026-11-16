import type { AmenityId, SessionId, Specialist, Venue, VenueQuery } from "./types";
export { DISTRICTS, REGIONS, parsePlace, placeLabel, placeValue } from "./districts";

export const PLATFORM = {
  phone: "+998 97 360 87 87",
  phoneHref: "tel:+998973608787",
  email: "info@toyxona.uz",
};

export const AMENITIES: { id: AmenityId; name: string }[] = [
  { id: "parking", name: "Avtoturargoh" },
  { id: "wifi", name: "Wi-Fi" },
  { id: "ac", name: "Konditsioner" },
  { id: "stage", name: "Sahna" },
  { id: "led", name: "LED ekran" },
  { id: "sound", name: "Ovoz uskunalari" },
  { id: "kids", name: "Bolalar maydoni" },
  { id: "halal", name: "Halol sertifikati" },
];

export const SESSIONS: { id: SessionId; name: string; time: string }[] = [
  { id: "morning", name: "Nahorgi", time: "06:00" },
  { id: "lunch", name: "Obedki", time: "12:00" },
  { id: "evening", name: "Kechki", time: "18:00" },
];

export const SPECIALIST_CATEGORIES: { id: string; name: string; short: string; icon: string; group?: "rental" }[] = [
  { id: "host", name: "Boshlovchi", short: "Boshlovchilar", icon: "🎤" },
  { id: "photo", name: "Fotograf", short: "Foto va Video", icon: "📷" },
  { id: "video", name: "Videograf", short: "Foto va Video", icon: "🎬" },
  { id: "liveband", name: "Jonli ijro", short: "Sozandalar", icon: "🎻" },
  { id: "cortege", name: "Kortej", short: "Avto Ijara", icon: "🚗" },
  { id: "artist", name: "Artist", short: "Artist", icon: "🎵" },
  { id: "dj", name: "DJ", short: "DJ", icon: "🎧" },
  { id: "animator", name: "Animator", short: "Animator", icon: "🎈" },
  { id: "decor", name: "Dekor", short: "Dekor", icon: "🎀" },
  { id: "florist", name: "Florist", short: "Florist", icon: "🌸" },
  { id: "catering", name: "Katering", short: "Katering", icon: "🍽️" },
  { id: "makeup", name: "Vizajist", short: "Vizajist", icon: "💄" },
  { id: "ensemble", name: "Ansambl", short: "Ansambl", icon: "🥁" },
  { id: "karnay", name: "Karnay-surnay", short: "Karnay-surnay", icon: "🎺" },
  { id: "drone", name: "Dron", short: "Dron", icon: "🚁" },
  { id: "fire", name: "Olov shou", short: "Olov shou", icon: "🔥" },
  { id: "cake", name: "Tortchi", short: "Tortchilar", icon: "🎂" },
  { id: "bar", name: "Bar", short: "Bar", icon: "🥂" },
  {"id": "rental-snacks", "name": "Ijaraga: Chaq chuq", "short": "Ijaraga: Chaq chuq", "icon": "🥜", "group": "rental"},
  {"id": "rental-water", "name": "Ijaraga: Ichimliklar", "short": "Ijaraga: Ichimliklar", "icon": "💧", "group": "rental"},
  {"id": "rental-fruit", "name": "Ijaraga: Mevalar", "short": "Ijaraga: Mevalar", "icon": "🍎", "group": "rental"},
  {"id": "rental-dress", "name": "Ijaraga: Kelin liboslar", "short": "Ijaraga: Kelin liboslar", "icon": "👰", "group": "rental"},
  {"id": "rental-suit", "name": "Ijaraga: Kuyov kastyumlar", "short": "Ijaraga: Kuyov kastyumlar", "icon": "🤵", "group": "rental"},
  {"id": "rental-dishes", "name": "Ijaraga: Idishlar", "short": "Ijaraga: Idishlar", "icon": "🍽️", "group": "rental"},
  {"id": "rental-furniture", "name": "Ijaraga: Stol stullar", "short": "Ijaraga: Stol stullar", "icon": "🪑", "group": "rental"},
  {"id": "gift-baskets", "name": "Sovg'a savatchalari", "short": "Sovg'a savatchalari", "icon": "🎁"},
  {"id": "trucks", "name": "Yuk mashinalari", "short": "Yuk mashinalari", "icon": "🚚"},
  {"id": "bottle-collection", "name": "Shisha idishlarni qabul qilish", "short": "Shisha idishlarni qabul qilish", "icon": "♻️"},
  {"id": "salad", "name": "Salatchi", "short": "Salatchi", "icon": "🥗"},
];

export const RENTAL_CATEGORIES = SPECIALIST_CATEGORIES.filter((item) => item.group === "rental");

const ALL_AMENITIES: AmenityId[] = AMENITIES.map((item) => item.id);

function photo(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

const hallShots = [
  "photo-1519167758481-83f550bb49b3",
  "photo-1464366400600-7168b8af9bc3",
  "photo-1519741497674-611481863552",
  "photo-1519225421980-715cb0215aed",
  "photo-1478146896981-b80fe463b330",
  "photo-1522673607200-164d1b6ce486",
  "photo-1465495976277-4387d4b0b4c6",
  "photo-1414235077428-338989a2e8c0",
  "photo-1555244162-803834f70033",
  "photo-1566073771259-6a8506099945",
  "photo-1542314831-068cd1dbfeeb",
  "photo-1571896349842-33c89424de2d",
  "photo-1520854221256-17451cc331bf",
];

function gallery(start: number) {
  return [0, 1, 2, 3].map((offset) => photo(hallShots[(start + offset) % hallShots.length], 900));
}

export const venues: Venue[] = [
  {
    id: 1,
    name: "Afsona",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Mustaqillik shohko'chasi",
    phone: "+998 71 200 10 01",
    hours: "09:00 - 23:00",
    description: "Keng zal, sahna va kechki yoritish bilan oilaviy va hashamatli tadbirlar uchun saroy.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[0]),
    gallery: gallery(0),
    amenities: ALL_AMENITIES,
    halls: [],
    menu: ["Milliy taomlar", "Yevropa taomlari", "Shirinliklar", "Ichimliklar"],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: 2,
    name: "Al qasr",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, A. Navoiy ko'chasi",
    phone: "+998 71 200 10 02",
    hours: "09:00 - 23:00",
    description: "Ikki zal, LED ekran va alohida bolalar maydoni. Narx mehmon soniga qarab kelishiladi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: 180000,
    image: photo(hallShots[1]),
    gallery: gallery(1),
    amenities: ["parking", "wifi", "ac", "stage", "led", "sound", "halal"],
    halls: [
      { id: "asosiy", name: "Asosiy zal", capacity: 350, price: 180000 },
      { id: "vip", name: "VIP zal", capacity: 120, price: 250000 },
    ],
    menu: ["Palov", "Go'shtli taomlar", "Salatlar", "Tort"],
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 3,
    name: "Bahora",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Bahor ko'chasi",
    phone: "+998 71 200 10 03",
    hours: "09:00 - 23:00",
    description: "Yorug' zal va ochiq hovli. Nahorgi, obedki va kechki seanslar alohida band qilinadi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[2]),
    gallery: gallery(2),
    amenities: ALL_AMENITIES,
    halls: [],
    menu: ["Kelishilgan menyu"],
    rating: 4.7,
    reviewCount: 11,
  },
  {
    id: 4,
    name: "Bek",
    region: "Xorazm",
    district: "Xiva tumani",
    address: "Xiva tumani, markaz",
    phone: "+998 71 200 10 04",
    hours: "08:00 - 23:00",
    description: "Tuman markazidagi zal. Sig'im 200 dan 491 kishigacha.",
    minGuests: 200,
    maxGuests: 491,
    priceFrom: null,
    image: photo(hallShots[3]),
    gallery: gallery(3),
    amenities: ["parking", "ac", "stage", "sound", "halal"],
    halls: [{ id: "katta", name: "Katta zal", capacity: 491, price: null }],
    menu: ["Milliy dasturxona"],
    rating: 4.4,
    reviewCount: 9,
  },
  {
    id: 5,
    name: "Demir",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Sanoat zonasi yonida",
    phone: "+998 71 200 10 05",
    hours: "09:00 - 23:00",
    description: "Keng avtoturargoh va sahna. Ovoz uskunalari zal narxiga kiradi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[4]),
    gallery: gallery(4),
    amenities: ["parking", "wifi", "ac", "stage", "sound", "kids", "halal"],
    halls: [],
    menu: ["Kelishilgan menyu"],
    rating: 4.5,
    reviewCount: 14,
  },
  {
    id: 6,
    name: "Jahon",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Jahon ko'chasi",
    phone: "+998 71 200 10 06",
    hours: "09:00 - 23:00",
    description: "LED ekran va konditsionerli zal. Bandlik kalendari har kuni yangilanadi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: 150000,
    image: photo(hallShots[5]),
    gallery: gallery(5),
    amenities: ["parking", "wifi", "ac", "stage", "led", "sound", "halal"],
    halls: [{ id: "asosiy", name: "Asosiy zal", capacity: 420, price: 150000 }],
    menu: ["Issiq taomlar", "Salatlar", "Mevalar"],
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 7,
    name: "Oqshom",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Oqshom mahallasi",
    phone: "+998 71 200 10 07",
    hours: "09:00 - 23:00",
    description: "Kechki tadbirlar uchun yoritilgan sahna va alohida kiyinish xonasi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[6]),
    gallery: gallery(6),
    amenities: ["parking", "ac", "stage", "led", "sound", "halal"],
    halls: [],
    menu: ["Kelishilgan menyu"],
    rating: 4.3,
    reviewCount: 7,
  },
  {
    id: 8,
    name: "Osiyo",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Sharq ko'chasi",
    phone: "+998 71 200 10 08",
    hours: "09:00 - 23:00",
    description: "Oilaviy to'ylar va yubileylar uchun qulay joylashuv.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[7]),
    gallery: gallery(7),
    amenities: ["parking", "wifi", "ac", "sound", "kids", "halal"],
    halls: [],
    menu: ["Milliy taomlar", "Ichimliklar"],
    rating: 4.2,
    reviewCount: 6,
  },
  {
    id: 9,
    name: "Samo",
    region: "Xorazm",
    district: "Sharof Rashidov",
    address: "Sharof Rashidov tumani",
    phone: "+998 71 200 10 09",
    hours: "09:00 - 22:00",
    description: "Sig'im hozircha kelishiladi. Sana bo'yicha bandlikni kalendardan tekshiring.",
    minGuests: 0,
    maxGuests: 0,
    priceFrom: null,
    image: photo(hallShots[8]),
    gallery: gallery(8),
    amenities: ["parking", "ac", "halal"],
    halls: [],
    menu: ["Kelishilgan menyu"],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 10,
    name: "Shohsaroy",
    region: "Xorazm",
    district: "Sharof Rashidov",
    address: "Sharof Rashidov tumani, Shohsaroy",
    phone: "+998 71 200 10 10",
    hours: "09:00 - 23:00",
    description: "Hashamatli bezak va keng zal. Mehmon sig'imi 100 dan 500 gacha.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[9]),
    gallery: gallery(9),
    amenities: ["parking", "wifi", "ac", "stage", "led", "sound", "kids", "halal"],
    halls: [],
    menu: ["To'liq banket"],
    rating: 4.8,
    reviewCount: 16,
  },
  {
    id: 11,
    name: "Versal",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Versal majmuasi",
    phone: "+998 71 200 10 11",
    hours: "09:00 - 23:00",
    description: "Klassik bezakli zal, sahna va alohida fotosessiya burchagi.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: 200000,
    image: photo(hallShots[10]),
    gallery: gallery(10),
    amenities: ALL_AMENITIES,
    halls: [
      { id: "klassik", name: "Klassik zal", capacity: 400, price: 200000 },
      { id: "kichik", name: "Kichik zal", capacity: 150, price: 140000 },
    ],
    menu: ["Banket menyusi", "Shirinlik stoli"],
    rating: 4.7,
    reviewCount: 21,
  },
  {
    id: 12,
    name: "Visol",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Visol ko'chasi",
    phone: "+998 71 200 10 12",
    hours: "09:00 - 23:00",
    description: "Shahar ichida qulay manzil. Wi-Fi va konditsioner mavjud.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[11]),
    gallery: gallery(11),
    amenities: ["parking", "wifi", "ac", "stage", "sound", "halal"],
    halls: [],
    menu: ["Kelishilgan menyu"],
    rating: 4.1,
    reviewCount: 5,
  },
  {
    id: 13,
    name: "Yakkasaroy",
    region: "Xorazm",
    district: "Urganch shahri",
    address: "Urganch shahri, Yakkasaroy mahallasi",
    phone: "+998 71 200 10 13",
    hours: "09:00 - 23:00",
    description: "Oilaviy tadbirlar uchun yopiq zal va bolalar maydoni.",
    minGuests: 100,
    maxGuests: 500,
    priceFrom: null,
    image: photo(hallShots[12]),
    gallery: gallery(12),
    amenities: ["parking", "ac", "stage", "sound", "kids", "halal"],
    halls: [],
    menu: ["Milliy dasturxona", "Choy va shirinlik"],
    rating: 4.6,
    reviewCount: 12,
  },
];

export const exampleSpecialists: Specialist[] = [
  {"id": -1, "name": "Chaq-chuq dasturxoni (namuna)", "categoryId": "rental-snacks", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. To'y dasturxoni uchun chaq-chuq to'plamlari."},
  {"id": -2, "name": "Musaffo ichimliklar (namuna)", "categoryId": "rental-water", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Tadbirlar uchun suv va ichimliklarni yetkazib berish."},
  {"id": -3, "name": "Mevali dasturxon (namuna)", "categoryId": "rental-fruit", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. To'y dasturxoni uchun meva to'plamlari va bezaklari."},
  {"id": -4, "name": "Nafis kelin liboslari (namuna)", "categoryId": "rental-dress", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Kelin ko'ylaklarini moslab berish va ijaraga topshirish."},
  {"id": -5, "name": "Bek kuyov liboslari (namuna)", "categoryId": "rental-suit", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Kuyovlar uchun turli o'lchamdagi kostyumlar ijarasi."},
  {"id": -6, "name": "Nafis idishlar (namuna)", "categoryId": "rental-dishes", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Banket uchun likopcha, piyola va boshqa idishlar ijarasi."},
  {"id": -7, "name": "Qulay stol-stullar (namuna)", "categoryId": "rental-furniture", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Tadbirlar uchun stol va stullarni yetkazish va o'rnatish."},
  {"id": -8, "name": "Nafis savatchalar (namuna)", "categoryId": "gift-baskets", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. To'y va marosimlar uchun sovg'a savatchalarini tayyorlash."},
  {"id": -9, "name": "Xorazm yuk tashish (namuna)", "categoryId": "trucks", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Tadbir jihozlari va yuklarini tashish xizmati."},
  {"id": -10, "name": "Toza marosim (namuna)", "categoryId": "bottle-collection", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Tadbirlardan so'ng bo'sh shisha idishlarni yig'ish va qabul qilish."},
  {"id": -11, "name": "Mohira salatlari (namuna)", "categoryId": "salad", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Banketlar uchun yangi mahsulotlardan turli salatlar tayyorlash."},
  {"id": -12, "name": "Shirin lahza tortlari (namuna)", "categoryId": "cake", "region": "Xorazm", "district": "Urganch shahri", "phone": "", "priceFrom": null, "rating": 0, "reviewCount": 0, "image": "https://images.unsplash.com/photo-1535254973040-607b92a456ab?auto=format&fit=crop&w=800&q=80", "bio": "Namuna e’lon. Buyurtma asosida to'y tortlari va shirinliklar tayyorlash."},
];

export const specialists: Specialist[] = [
  ...exampleSpecialists,
  { id: 33, name: "Zilola media official", categoryId: "video", region: "Xorazm", phone: "+998 71 300 10 33", priceFrom: 5000000, rating: 4.9, reviewCount: 12, image: photo("photo-1492691527719-9d1e07e534b4", 800), bio: "To'y va yubiley videolarini to'liq montaj bilan topshiramiz.", featured: true },
  { id: 34, name: "Anvar Photographer", categoryId: "photo", region: "Xorazm", phone: "+998 71 300 10 34", priceFrom: 5000000, rating: 4.8, reviewCount: 8, image: photo("photo-1554048612-b6a482bc67e5", 800), bio: "Juftlik va oilaviy fotosessiya, zal ichida reportaj." },
  { id: 35, name: "Xorazm Kartej Baxora", categoryId: "cortege", region: "Xorazm", phone: "+998 71 300 10 35", priceFrom: 5000000, rating: 4.7, reviewCount: 15, image: photo("photo-1503376780353-7e6692767b70", 800), bio: "Beztilgan kortej va haydovchi xizmati." },
  { id: 36, name: "Vip avto Xorazm kortej", categoryId: "cortege", region: "Xorazm", phone: "+998 71 300 10 36", priceFrom: 5000000, rating: 4.6, reviewCount: 9, image: photo("photo-1492144534655-ae79c964c9d7", 800), bio: "Premium avtomobillar to'y kuni uchun." },
  { id: 37, name: "Disney Xorazm", categoryId: "animator", region: "Xorazm", phone: "+998 71 300 10 37", priceFrom: 5000000, rating: 4.8, reviewCount: 24, image: photo("photo-1503454537195-1dcabb73ffb9", 800), bio: "Bolalar dasturi va animatorlar." },
  { id: 38, name: "Madagaskar uz", categoryId: "animator", region: "Xorazm", phone: "+998 71 300 10 38", priceFrom: 5000000, rating: 4.5, reviewCount: 11, image: photo("photo-1472162072942-cd5147eb3902", 800), bio: "Bolalar shou va o'yinlar." },
  { id: 39, name: "Creative Studio", categoryId: "video", region: "Xorazm", phone: "+998 71 300 10 39", priceFrom: 5000000, rating: 4.7, reviewCount: 19, image: photo("photo-1492691527719-9d1e07e534b4", 800), bio: "Klip va to'liq to'y filmi." },
  { id: 40, name: "Ibragimoff production", categoryId: "video", region: "Xorazm", phone: "+998 71 300 10 40", priceFrom: 5000000, rating: 4.8, reviewCount: 17, image: photo("photo-1574717024653-61fd2cf4d44d", 800), bio: "Ko'p kamerali suratga olish." },
  { id: 41, name: "Ra'no Sharipova", categoryId: "host", region: "Xorazm", phone: "+998 71 300 10 41", priceFrom: 5000000, rating: 4.9, reviewCount: 22, image: photo("photo-1524504388940-b1c1722653e1", 800), bio: "O'zbek va rus tillarida boshlovchilik.", featured: true },
  { id: 42, name: "Feeruza Asqarova", categoryId: "host", region: "Xorazm", phone: "+998 71 300 10 42", priceFrom: 5000000, rating: 4.7, reviewCount: 13, image: photo("photo-1544005313-94ddf0286df2", 800), bio: "Oilaviy tadbirlar uchun boshlovchi." },
  { id: 43, name: "Elyor Ravshanov", categoryId: "host", region: "Xorazm", phone: "+998 71 300 10 43", priceFrom: 5000000, rating: 4.6, reviewCount: 10, image: photo("photo-1500648767791-00dcc994a43e", 800), bio: "Jonli muloqot va musobaqalar." },
  { id: 44, name: "Muhammad Ali Munavvarov", categoryId: "artist", region: "Xorazm", phone: "+998 71 300 10 44", priceFrom: 1500000, rating: 4.9, reviewCount: 28, image: photo("photo-1511671782779-c97d3d27a1d4", 800), bio: "Jonli qo'shiq va mehmonlar bilan dastur.", featured: true },
  { id: 45, name: "Ozod Isayev", categoryId: "host", region: "Xorazm", phone: "+998 71 300 10 45", priceFrom: 300000, rating: 4.4, reviewCount: 6, image: photo("photo-1506794778202-cad84cf45f1d", 800), bio: "Yosh boshlovchi. Qisqa va to'liq dastur." },
  { id: 46, name: "Ansambl", categoryId: "ensemble", region: "Xorazm", phone: "+998 71 300 10 46", priceFrom: 2124000, rating: 4.9, reviewCount: 36, image: photo("photo-1511192336575-5a79af67a986", 800), bio: "Jonli ansambl: soz va qo'shiq." },
  { id: 47, name: "Vizajist", categoryId: "makeup", region: "Xorazm", phone: "+998 71 300 10 47", priceFrom: 4147000, rating: 5, reviewCount: 32, image: photo("photo-1487412947147-5cebf100ffc2", 800), bio: "Kelin va kelin opa-singillar uchun vizaj." },
  { id: 48, name: "Olov shou", categoryId: "fire", region: "Xorazm", phone: "+998 71 300 10 48", priceFrom: 2245000, rating: 4.5, reviewCount: 18, image: photo("photo-1492684223066-81342ee5ff30", 800), bio: "Kechki olov shou, xavfsizlik talablari bilan." },
  { id: 49, name: "Dron", categoryId: "drone", region: "Xorazm", phone: "+998 71 300 10 49", priceFrom: 3808000, rating: 4.8, reviewCount: 5, image: photo("photo-1473968512647-3e447244af8f", 800), bio: "Havo videosi va kortej kuzatuvi.", featured: true },
  { id: 50, name: "Florist", categoryId: "florist", region: "Xorazm", phone: "+998 71 300 10 50", priceFrom: 3989000, rating: 3.8, reviewCount: 37, image: photo("photo-1487530811176-3780de880c2d", 800), bio: "Zal bezagi va kelin guldastasi." },
  { id: 51, name: "Dekor", categoryId: "decor", region: "Xorazm", phone: "+998 71 300 10 51", priceFrom: 1369000, rating: 4.1, reviewCount: 40, image: photo("photo-1478146896981-b80fe463b330", 800), bio: "Zal, stol va sahna dekoratsiyasi." },
  { id: 52, name: "DJ", categoryId: "dj", region: "Xorazm", phone: "+998 71 300 10 52", priceFrom: 4207000, rating: 3.7, reviewCount: 11, image: photo("photo-1571266028243-d220c6a8b4c6", 800), bio: "Kechki musiqa va apparatura." },
];

export function amenityName(id: AmenityId) {
  return AMENITIES.find((item) => item.id === id)?.name || id;
}

export function categoryById(id: string) {
  return SPECIALIST_CATEGORIES.find((item) => item.id === id);
}

export function venueById(id: number | string) {
  return venues.find((item) => item.id === Number(id));
}

export function specialistById(id: number | string) {
  return specialists.find((item) => item.id === Number(id));
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso() {
  return toIsoDate(new Date());
}

export function sessionLoad(seed: number, iso: string): 0 | 1 | 2 | 3 {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return 0;
  const n = (seed * 13 + year + month * 3 + day * 7) % 10;
  if (n === 0) return 3;
  if (n === 1) return 2;
  if (n === 2) return 1;
  return 0;
}

export function sessionsFromLoad(level: 0 | 1 | 2 | 3): SessionId[] {
  if (level >= 3) return ["morning", "lunch", "evening"];
  if (level === 2) return ["morning", "lunch"];
  if (level === 1) return ["evening"];
  return [];
}

export function isPastDate(iso: string) {
  return iso < todayIso();
}

export function locationLabel(region: string, district: string) {
  return `${region}, ${district}`;
}

export function capacityLabel(venue: Venue) {
  if (!venue.maxGuests) return "—";
  return `${venue.minGuests} - ${venue.maxGuests} kishi`;
}

export function mapsUrl(venue: Venue) {
  const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function filterVenues(
  source: Venue[],
  query: VenueQuery,
  taken?: (venueId: number, iso: string) => SessionId[],
) {
  const q = query.q?.trim().toLowerCase();
  return source.filter((venue) => {
    if (q && !`${venue.name} ${venue.district} ${venue.region}`.toLowerCase().includes(q)) return false;
    if (query.district && venue.district !== query.district) return false;
    if (query.region && venue.region !== query.region) return false;
    if (query.guests && venue.maxGuests && venue.maxGuests < query.guests) return false;
    if (query.guests && !venue.maxGuests) return false;
    if (query.amenities?.length && !query.amenities.every((id) => venue.amenities.includes(id))) return false;
    if (query.date) {
      const booked = taken ? taken(venue.id, query.date) : [];
      if (booked.length >= SESSIONS.length) return false;
    }
    return true;
  });
}

export function filterSpecialists(
  source: Specialist[],
  query: { q?: string; category?: string; region?: string; district?: string },
) {
  const q = query.q?.trim().toLowerCase();
  return source.filter((item) => {
    const category = categoryById(item.categoryId);
    if (q && !`${item.name} ${category?.name || ""} ${item.region} ${item.district || ""}`.toLowerCase().includes(q)) return false;
    if (query.category === "rental") {
      if (category?.group !== "rental") return false;
    } else if (query.category && item.categoryId !== query.category) return false;
    if (query.region && item.region !== query.region) return false;
    if (query.district && item.district && item.district !== query.district) return false;
    return true;
  });
}

export function queryFromParams(params: URLSearchParams): VenueQuery {
  const guests = Number(params.get("guests") || "");
  const amenities = AMENITIES.map((item) => item.id).filter((id) => params.get(id) === "1");
  return {
    q: params.get("q") || undefined,
    date: params.get("date") || undefined,
    region: params.get("region") || undefined,
    district: params.get("district") || undefined,
    guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    amenities,
  };
}

export function paramsFromQuery(query: VenueQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.date) params.set("date", query.date);
  if (query.region) params.set("region", query.region);
  if (query.district) params.set("district", query.district);
  if (query.guests) params.set("guests", String(query.guests));
  query.amenities?.forEach((id) => params.set(id, "1"));
  return params;
}

export function catalogPath(query: VenueQuery) {
  const search = paramsFromQuery(query).toString();
  return search ? `/katalog?${search}` : "/katalog";
}
