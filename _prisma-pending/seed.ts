import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// Cambodian provinces
const provinces = [
  { code: 'phnom-penh', nameKh: 'រាជធានីភ្នំពេញ', nameEn: 'Phnom Penh' },
  { code: 'siem-reap', nameKh: 'ខេត្តសៀមរាប', nameEn: 'Siem Reap' },
  { code: 'battambang', nameKh: 'ខេត្តបាត់ដំបង', nameEn: 'Battambang' },
  { code: 'kampong-cham', nameKh: 'ខេត្តកំពង់ចាម', nameEn: 'Kampong Cham' },
  { code: 'kandal', nameKh: 'ខេត្តកណ្ដាល', nameEn: 'Kandal' },
  { code: 'preah-sihanouk', nameKh: 'ខេត្តព្រះសីហនុ', nameEn: 'Preah Sihanouk' },
  { code: 'takeo', nameKh: 'ខេត្តតាកែវ', nameEn: 'Takeo' },
  { code: 'kampot', nameKh: 'ខេត្តកំពត', nameEn: 'Kampot' },
  { code: 'prey-veng', nameKh: 'ខេត្តព្រៃវែង', nameEn: 'Prey Veng' },
  { code: 'svay-rieng', nameKh: 'ខេត្តស្វាយរៀង', nameEn: 'Svay Rieng' },
  { code: 'koh-kong', nameKh: 'ខេត្តកោះកុង', nameEn: 'Koh Kong' },
  { code: 'pursat', nameKh: 'ខេត្តពោធិ៍សាត់', nameEn: 'Pursat' },
  { code: 'kampong-thom', nameKh: 'ខេត្តកំពង់ធំ', nameEn: 'Kampong Thom' },
  { code: 'kampong-speu', nameKh: 'ខេត្តកំពង់ស្ពឺ', nameEn: 'Kampong Speu' },
  { code: 'kampong-chhnang', nameKh: 'ខេត្តកំពង់ឆ្នាំង', nameEn: 'Kampong Chhnang' },
  { code: 'banteay-meanchey', nameKh: 'ខេត្តបន្ទាយមានជ័យ', nameEn: 'Banteay Meanchey' },
  { code: 'oddar-meanchey', nameKh: 'ខេត្តឧត្តរមានជ័យ', nameEn: 'Oddar Meanchey' },
  { code: 'pailin', nameKh: 'ខេត្តប៉ៃលិន', nameEn: 'Pailin' },
  { code: 'preah-vihear', nameKh: 'ខេត្តព្រះវិហារ', nameEn: 'Preah Vihear' },
  { code: 'stung-treng', nameKh: 'ខេត្តស្ទឹងត្រែង', nameEn: 'Stung Treng' },
  { code: 'ratanakiri', nameKh: 'ខេត្តរតនគិរី', nameEn: 'Ratanakiri' },
  { code: 'mondulkiri', nameKh: 'ខេត្តមណ្ឌលគិរី', nameEn: 'Mondulkiri' },
  { code: 'kratie', nameKh: 'ខេត្តក្រចេះ', nameEn: 'Kratie' },
  { code: 'kep', nameKh: 'ខេត្តកែប', nameEn: 'Kep' },
  { code: 'tboung-khmum', nameKh: 'ខេត្តត្បូងឃ្មុំ', nameEn: 'Tboung Khmum' },
];

// Ministries
const ministries = [
  { code: 'ministry-education', nameKh: 'ក្រសួងអប់រំ យុវជន និងកីឡា', nameEn: 'Ministry of Education, Youth and Sport', departmentKh: 'នាយកដ្ឋានកីឡា' },
  { code: 'ministry-defense', nameKh: 'ក្រសួងការពារជាតិ', nameEn: 'Ministry of National Defense' },
  { code: 'ministry-interior', nameKh: 'ក្រសួងមហាផ្ទៃ', nameEn: 'Ministry of Interior' },
];

// Sports
const sports = [
  { code: 'athletics', nameKh: 'អត្តពលកម្ម', nameEn: 'Athletics', icon: '🏃' },
  { code: 'swimming', nameKh: 'ហែលទឹក', nameEn: 'Swimming', icon: '🏊' },
  { code: 'football', nameKh: 'បាល់ទាត់', nameEn: 'Football', icon: '⚽' },
  { code: 'badminton', nameKh: 'សីដល់', nameEn: 'Badminton', icon: '🏸' },
  { code: 'volleyball', nameKh: 'បាល់ទះ', nameEn: 'Volleyball', icon: '🏐' },
  { code: 'basketball', nameKh: 'បាល់បោះ', nameEn: 'Basketball', icon: '🏀' },
  { code: 'boxing', nameKh: 'ប្រដាល់', nameEn: 'Boxing', icon: '🥊' },
  { code: 'taekwondo', nameKh: 'តេក្វាន់ដូ', nameEn: 'Taekwondo', icon: '🥋' },
  { code: 'table-tennis', nameKh: 'កីឡាវាយកូនបាល់លើតុ', nameEn: 'Table Tennis', icon: '🏓' },
  { code: 'cycling', nameKh: 'កីឡាជិះកង់', nameEn: 'Cycling', icon: '🚴' },
];

// Sport categories
const sportCategories: Record<string, { nameKh: string; nameEn: string; gender: string }[]> = {
  athletics: [
    { nameKh: 'រត់ប្រណាំង ១០០ ម៉ែត្រ បុរស', nameEn: '100m Sprint Men', gender: 'Male' },
    { nameKh: 'រត់ប្រណាំង ១០០ ម៉ែត្រ នារី', nameEn: '100m Sprint Women', gender: 'Female' },
    { nameKh: 'រត់ប្រណាំង ២០០ ម៉ែត្រ បុរស', nameEn: '200m Sprint Men', gender: 'Male' },
    { nameKh: 'រត់ប្រណាំង ២០០ ម៉ែត្រ នារី', nameEn: '200m Sprint Women', gender: 'Female' },
    { nameKh: 'លោតវែង បុរស', nameEn: 'Long Jump Men', gender: 'Male' },
    { nameKh: 'លោតវែង នារី', nameEn: 'Long Jump Women', gender: 'Female' },
  ],
  swimming: [
    { nameKh: 'ហែលសេរី ១០០ ម៉ែត្រ បុរស', nameEn: '100m Freestyle Men', gender: 'Male' },
    { nameKh: 'ហែលសេរី ១០០ ម៉ែត្រ នារី', nameEn: '100m Freestyle Women', gender: 'Female' },
    { nameKh: 'ហែលខ្នង ១០០ ម៉ែត្រ បុរស', nameEn: '100m Backstroke Men', gender: 'Male' },
    { nameKh: 'ហែលខ្នង ១០០ ម៉ែត្រ នារី', nameEn: '100m Backstroke Women', gender: 'Female' },
  ],
  football: [
    { nameKh: 'បាល់ទាត់ ១១ នាក់ បុរស', nameEn: 'Football 11-a-side Men', gender: 'Male' },
    { nameKh: 'បាល់ទាត់ ១១ នាក់ នារី', nameEn: 'Football 11-a-side Women', gender: 'Female' },
    { nameKh: 'បាល់ទាត់ ៥ នាក់ បុរស', nameEn: 'Futsal Men', gender: 'Male' },
  ],
  badminton: [
    { nameKh: 'ឯកត្តជន បុរស', nameEn: 'Singles Men', gender: 'Male' },
    { nameKh: 'ឯកត្តជន នារី', nameEn: 'Singles Women', gender: 'Female' },
    { nameKh: 'គូ បុរស', nameEn: 'Doubles Men', gender: 'Male' },
    { nameKh: 'គូ នារី', nameEn: 'Doubles Women', gender: 'Female' },
    { nameKh: 'គូចម្រុះ', nameEn: 'Mixed Doubles', gender: 'Mixed' },
  ],
  volleyball: [
    { nameKh: 'បាល់ទះ បុរស', nameEn: 'Indoor Volleyball Men', gender: 'Male' },
    { nameKh: 'បាល់ទះ នារី', nameEn: 'Indoor Volleyball Women', gender: 'Female' },
  ],
  basketball: [
    { nameKh: 'បាល់បោះ បុរស', nameEn: 'Basketball Men', gender: 'Male' },
    { nameKh: 'បាល់បោះ នារី', nameEn: 'Basketball Women', gender: 'Female' },
  ],
  boxing: [
    { nameKh: 'ទម្ងន់ស្រាល បុរស', nameEn: 'Lightweight Men', gender: 'Male' },
    { nameKh: 'ទម្ងន់មធ្យម បុរស', nameEn: 'Middleweight Men', gender: 'Male' },
    { nameKh: 'ទម្ងន់ធ្ងន់ បុរស', nameEn: 'Heavyweight Men', gender: 'Male' },
  ],
  taekwondo: [
    { nameKh: 'ក្យូរូហ្គី បុរស', nameEn: 'Kyorugi Men', gender: 'Male' },
    { nameKh: 'ក្យូរូហ្គី នារី', nameEn: 'Kyorugi Women', gender: 'Female' },
    { nameKh: 'ភូមសេ បុរស', nameEn: 'Poomsae Men', gender: 'Male' },
    { nameKh: 'ភូមសេ នារី', nameEn: 'Poomsae Women', gender: 'Female' },
  ],
  'table-tennis': [
    { nameKh: 'ឯកត្តជន បុរស', nameEn: 'Singles Men', gender: 'Male' },
    { nameKh: 'ឯកត្តជន នារី', nameEn: 'Singles Women', gender: 'Female' },
  ],
  cycling: [
    { nameKh: 'ផ្លូវ បុរស', nameEn: 'Road Race Men', gender: 'Male' },
    { nameKh: 'ផ្លូវ នារី', nameEn: 'Road Race Women', gender: 'Female' },
  ],
};

// Events
const events = [
  {
    code: 'evt-1',
    nameKh: 'ការប្រកួតកីឡាជាតិ ២០២៦',
    nameEn: 'National Sports Games 2026',
    description: 'Annual national sports competition',
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-03-25'),
    locationKh: 'រាជធានីភ្នំពេញ',
    status: 'upcoming',
    sportCodes: ['athletics', 'swimming', 'football', 'badminton', 'volleyball', 'basketball'],
  },
  {
    code: 'evt-2',
    nameKh: 'ពានរង្វាន់សាកលវិទ្យាល័យ ២០២៦',
    nameEn: 'University Championship 2026',
    description: 'Inter-university sports championship',
    startDate: new Date('2026-05-01'),
    endDate: new Date('2026-05-10'),
    locationKh: 'ខេត្តសៀមរាប',
    status: 'upcoming',
    sportCodes: ['athletics', 'football', 'badminton', 'table-tennis'],
  },
  {
    code: 'evt-3',
    nameKh: 'ការប្រកួតកីឡាយុវជន ២០២៦',
    nameEn: 'Youth Sports Tournament 2026',
    description: 'Youth sports development tournament',
    startDate: new Date('2026-07-10'),
    endDate: new Date('2026-07-20'),
    locationKh: 'ខេត្តបាត់ដំបង',
    status: 'upcoming',
    sportCodes: ['athletics', 'swimming', 'badminton', 'taekwondo', 'boxing'],
  },
];

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.registration.deleteMany();
  await prisma.eventSport.deleteMany();
  await prisma.sportCategory.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();

  // Seed organizations (provinces)
  console.log('🏛️  Seeding provinces...');
  for (const province of provinces) {
    await prisma.organization.create({
      data: {
        type: 'province',
        code: province.code,
        nameKh: province.nameKh,
        nameEn: province.nameEn,
        provinceKh: province.nameKh,
      },
    });
  }
  console.log(`   ✓ Created ${provinces.length} provinces`);

  // Seed organizations (ministries)
  console.log('🏛️  Seeding ministries...');
  for (const ministry of ministries) {
    await prisma.organization.create({
      data: {
        type: 'ministry',
        code: ministry.code,
        nameKh: ministry.nameKh,
        nameEn: ministry.nameEn,
        departmentKh: ministry.departmentKh,
      },
    });
  }
  console.log(`   ✓ Created ${ministries.length} ministries`);

  // Seed sports
  console.log('🏅 Seeding sports...');
  const sportMap = new Map<string, string>();
  for (const sport of sports) {
    const created = await prisma.sport.create({
      data: {
        code: sport.code,
        nameKh: sport.nameKh,
        nameEn: sport.nameEn,
        icon: sport.icon,
      },
    });
    sportMap.set(sport.code, created.id);
  }
  console.log(`   ✓ Created ${sports.length} sports`);

  // Seed sport categories
  console.log('📋 Seeding sport categories...');
  let categoryCount = 0;
  for (const [sportCode, categories] of Object.entries(sportCategories)) {
    const sportId = sportMap.get(sportCode);
    if (!sportId) continue;

    for (const category of categories) {
      await prisma.sportCategory.create({
        data: {
          sportId,
          nameKh: category.nameKh,
          nameEn: category.nameEn,
          gender: category.gender,
        },
      });
      categoryCount++;
    }
  }
  console.log(`   ✓ Created ${categoryCount} sport categories`);

  // Seed events
  console.log('📅 Seeding events...');
  for (const event of events) {
    const { sportCodes, ...eventData } = event;
    const createdEvent = await prisma.event.create({
      data: eventData,
    });

    // Link sports to event
    for (const sportCode of sportCodes) {
      const sportId = sportMap.get(sportCode);
      if (sportId) {
        await prisma.eventSport.create({
          data: {
            eventId: createdEvent.id,
            sportId,
          },
        });
      }
    }
  }
  console.log(`   ✓ Created ${events.length} events with sport associations`);

  // Create sample registrations
  console.log('📝 Seeding sample registrations...');
  const phnomPenh = await prisma.organization.findUnique({ where: { code: 'phnom-penh' } });
  const siemReap = await prisma.organization.findUnique({ where: { code: 'siem-reap' } });
  const battambang = await prisma.organization.findUnique({ where: { code: 'battambang' } });
  const evt1 = await prisma.event.findUnique({ where: { code: 'evt-1' } });
  const athletics = await prisma.sport.findUnique({ where: { code: 'athletics' } });
  const swimming = await prisma.sport.findUnique({ where: { code: 'swimming' } });

  if (phnomPenh && siemReap && battambang && evt1 && athletics && swimming) {
    const sampleRegistrations = [
      {
        firstName: 'Sokha',
        lastName: 'Chan',
        firstNameKh: 'សុខា',
        lastNameKh: 'ចាន់',
        dateOfBirth: new Date('1998-05-15'),
        gender: 'Male',
        nationalityType: 'IDCard',
        nationalId: '123456789012',
        phone: '012345678',
        role: 'Athlete',
        athleteCategory: 'Male',
        organizationId: phnomPenh.id,
        eventId: evt1.id,
        sportId: athletics.id,
        status: 'pending',
      },
      {
        firstName: 'Sreymom',
        lastName: 'Keo',
        firstNameKh: 'ស្រីមុំ',
        lastNameKh: 'កែវ',
        dateOfBirth: new Date('2000-08-22'),
        gender: 'Female',
        nationalityType: 'IDCard',
        nationalId: '234567890123',
        phone: '098765432',
        role: 'Athlete',
        athleteCategory: 'Female',
        organizationId: siemReap.id,
        eventId: evt1.id,
        sportId: swimming.id,
        status: 'pending',
      },
      {
        firstName: 'Chantha',
        lastName: 'Sok',
        firstNameKh: 'ចន្ថា',
        lastNameKh: 'សុខ',
        dateOfBirth: new Date('1990-12-05'),
        gender: 'Male',
        nationalityType: 'IDCard',
        nationalId: '345678901234',
        phone: '077123456',
        role: 'Leader',
        leaderRole: 'Team Manager',
        organizationId: battambang.id,
        eventId: evt1.id,
        sportId: athletics.id,
        status: 'approved',
      },
    ];

    for (const reg of sampleRegistrations) {
      await prisma.registration.create({ data: reg });
    }
    console.log(`   ✓ Created ${sampleRegistrations.length} sample registrations`);
  }

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
