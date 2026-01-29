const fs = require('fs');

// Sample data arrays
const khmerFirstNames = ['សុខា', 'សុភា', 'ចាន់', 'រ៉ា', 'សុខ', 'វី', 'លី', 'ហេង', 'សុន', 'កែវ', 'ស៊ុន', 'ឈន', 'ពេជ្រ', 'សុធា', 'នី', 'រដ្ឋា', 'ស្រី', 'មុនី', 'ពិសី', 'សោម'];
const khmerLastNames = ['រដ្ឋ', 'ធី', 'វុធ', 'ចាន់', 'លី', 'ហេង', 'សុខ', 'ណារ៉ា', 'ភក្តី', 'ម៉េង', 'វ៉ាន់', 'ឆាយ', 'អ៊ុក', 'ប៊ុន', 'ហ៊ុន', 'ផល', 'ធារ៉ា', 'ណា', 'មិន', 'សោភា'];
const englishFirstNames = ['Sokha', 'Sophal', 'Dara', 'Ratha', 'Visal', 'Srey', 'Bopha', 'Chenda', 'Kimly', 'Kunthea', 'Mony', 'Phalla', 'Rithy', 'Samnang', 'Vanna', 'Kosal', 'Pheaktra', 'Serey', 'Chanthy', 'Pisey'];
const englishLastNames = ['Chan', 'Sok', 'Heng', 'Lim', 'Peng', 'Chea', 'Kim', 'Vong', 'Touch', 'Kong', 'Seng', 'Mao', 'Pov', 'Noun', 'Ros', 'San', 'Tan', 'Yin', 'Oun', 'Sam'];

const sports = [
  { name: 'អត្តពលកម្ម', id: 'athletics', categories: ['រត់ប្រណាំង ១០០ ម៉ែត្រ', 'រត់ប្រណាំង ២០០ ម៉ែត្រ', 'រត់ប្រណាំង ៤០០ ម៉ែត្រ', 'លោតឆ្ងាយ', 'បោះក្រាស់'] },
  { name: 'បាល់ទាត់', id: 'football', categories: ['បាល់ទាត់ ១១ នាក់ បុរស', 'បាល់ទាត់ ១១ នាក់ នារី', 'បុរស', 'នារី'] },
  { name: 'បាល់បោះ', id: 'basketball', categories: ['បុរស', 'នារី', '៥ នាក់'] },
  { name: 'បាល់ទះ', id: 'volleyball', categories: ['បុរស', 'នារី', 'បាល់ទះឆ្នេរ'] },
  { name: 'ហែលទឹក', id: 'swimming', categories: ['ហែលសេរី ៥០ម', 'ហែលសេរី ១០០ម', 'ហែលខ្នង', 'ហែលកូនក្រពើ'] },
  { name: 'កូនបាល់', id: 'badminton', categories: ['បុរសឯកត្តជន', 'នារីឯកត្តជន', 'បុរសគូ', 'នារីគូ'] }
];

const organizations = [
  { id: 'm-1', type: 'ministry', name: 'Ministry of Interior', khmerName: 'ក្រសួងមហាផ្ទៃ' },
  { id: 'm-2', type: 'ministry', name: 'Ministry of National Defense', khmerName: 'ក្រសួងការពារជាតិ' },
  { id: 'm-3', type: 'ministry', name: 'Ministry of economy', khmerName: 'ក្រសួងសេដ្ឋកិច្ច' },
  { id: '1', type: 'province', name: 'Phnom Penh', khmerName: 'ភ្នំពេញ' },
  { id: '2', type: 'province', name: 'Kandal', khmerName: 'កណ្តាល' },
  { id: '3', type: 'province', name: 'Siem Reap', khmerName: 'សៀមរាប' },
  { id: '4', type: 'province', name: 'Battambang', khmerName: 'បាត់ដំបង' },
  { id: '5', type: 'province', name: 'Kampong Cham', khmerName: 'កំពង់ចាម' },
  { id: '6', type: 'province', name: 'Kampong Speu', khmerName: 'កំពង់ស្ពឺ' },
  { id: '7', type: 'province', name: 'Prey Veng', khmerName: 'ព្រៃវែង' },
  { id: '8', type: 'province', name: 'Takeo', khmerName: 'តាកែវ' },
  { id: '15', type: 'province', name: 'Pursat', khmerName: 'ពោធិ៍សាត់' }
];

const leaderRoles = ['coach', 'delegate', 'assistant', 'manager', 'technical staff'];
const statuses = ['pending', 'approved', 'rejected'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generatePhoneNumber() {
  const prefixes = ['012', '015', '016', '017', '069', '070', '077', '078', '085', '089', '092', '096', '097', '098', '099'];
  return randomElement(prefixes) + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
}

function generateNationalID() {
  return Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
}

const registrations = [];
let currentUserId = Date.now();

for (let i = 0; i < 1000; i++) {
  const userId = currentUserId + i * 1000;
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const isAthlete = Math.random() > 0.3; // 70% athletes, 30% leaders
  const sport = randomElement(sports);
  const org = randomElement(organizations);
  const dob = randomDate(new Date(1980, 0, 1), new Date(2008, 11, 31));
  const registeredAt = randomDate(new Date(2026, 0, 1), new Date());
  const accessTime = new Date(registeredAt.getTime() + Math.random() * 3600000);
  
  const registration = {
    firstName: randomElement(englishFirstNames),
    lastName: randomElement(englishLastNames),
    firstNameKh: randomElement(khmerFirstNames),
    lastNameKh: randomElement(khmerLastNames),
    dateOfBirth: formatDate(dob),
    gender: gender,
    nationality: Math.random() > 0.5 ? 'IDCard' : 'BirthCertificate',
    nationalID: generateNationalID(),
    phone: generatePhoneNumber(),
    position: isAthlete ? {
      role: 'Athlete',
      coach: null,
      assistant: null,
      leaderRole: null,
      athleteCategory: gender
    } : {
      role: 'Leader',
      coach: null,
      assistant: null,
      leaderRole: randomElement(leaderRoles),
      athleteCategory: null
    },
    organization: {
      type: org.type,
      id: org.id,
      name: org.name,
      province: org.type === 'province' ? org.name : null,
      department: org.type === 'ministry' ? org.name : null
    },
    eventId: 'evt-' + (Math.floor(Math.random() * 5) + 1),
    sport: sport.name,
    sports: [sport.name],
    sportId: sport.id,
    sportCategory: randomElement(sport.categories),
    photoUrl: Math.random() > 0.3 ? `/uploads/${userId}-photo.jpg` : null,
    status: randomElement(statuses),
    id: userId.toString(),
    registeredAt: registeredAt.toISOString()
  };
  
  // Group some registrations together by userId
  if (i % 7 === 0 || i === 0) {
    // New user
    registrations.push({
      userId: userId,
      accessTime: accessTime.toISOString(),
      registrations: [registration]
    });
  } else {
    // Add to last user's registrations
    const lastUserIndex = registrations.length - 1;
    registrations[lastUserIndex].registrations.push(registration);
    registrations[lastUserIndex].accessTime = accessTime.toISOString();
  }
}

fs.writeFileSync('registrations.json', JSON.stringify(registrations, null, 2));
console.log(`✅ Generated ${registrations.length} user groups with 1000 total registrations`);
console.log(`📊 Distribution:`);
console.log(`   - Athletes: ~700`);
console.log(`   - Leaders: ~300`);
console.log(`   - Male: ~${registrations.reduce((sum, u) => sum + u.registrations.filter(r => r.gender === 'Male').length, 0)}`);
console.log(`   - Female: ~${registrations.reduce((sum, u) => sum + u.registrations.filter(r => r.gender === 'Female').length, 0)}`);
console.log(`   - Pending: ~${registrations.reduce((sum, u) => sum + u.registrations.filter(r => r.status === 'pending').length, 0)}`);
console.log(`   - Approved: ~${registrations.reduce((sum, u) => sum + u.registrations.filter(r => r.status === 'approved').length, 0)}`);
console.log(`   - Rejected: ~${registrations.reduce((sum, u) => sum + u.registrations.filter(r => r.status === 'rejected').length, 0)}`);
