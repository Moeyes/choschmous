// Test script to create sample registrations
const testRegistrations = [
  {
    firstName: "Sokha",
    lastName: "Chan",
    firstNameKh: "សុខា",
    lastNameKh: "ចាន់",
    dateOfBirth: "1998-05-15",
    gender: "Male",
    nationality: "IDCard",
    nationalID: "123456789012",
    phone: "012345678",
    sport: "athletics",
    sports: ["athletics"],
    sportCategory: "រត់ប្រណាំង ១០០ ម៉ែត្រ",
    category: "រត់ប្រណាំង ១០០ ម៉ែត្រ",
    eventId: "evt-1",
    position: { role: "Athlete", coach: null, assistant: null },
    organization: {
      type: "province",
      id: "phnom-penh",
      name: "រាជធានីភ្នំពេញ",
      province: "រាជធានីភ្នំពេញ",
      department: null
    }
  },
  {
    firstName: "Sreymom",
    lastName: "Keo",
    firstNameKh: "ស្រីមុំ",
    lastNameKh: "កែវ",
    dateOfBirth: "2000-08-22",
    gender: "Female",
    nationality: "IDCard",
    nationalID: "234567890123",
    phone: "098765432",
    sport: "swimming",
    sports: ["swimming"],
    sportCategory: "ហែលសេរី ១០០ ម៉ែត្រ",
    category: "ហែលសេរី ១០០ ម៉ែត្រ",
    eventId: "evt-1",
    position: { role: "Athlete", coach: null, assistant: null },
    organization: {
      type: "province",
      id: "siem-reap",
      name: "ខេត្តសៀមរាប",
      province: "ខេត្តសៀមរាប",
      department: null
    }
  },
  {
    firstName: "Phearith",
    lastName: "Ouk",
    firstNameKh: "ភារិទ្ធិ",
    lastNameKh: "អ៊ុក",
    dateOfBirth: "1995-03-10",
    gender: "Male",
    nationality: "IDCard",
    nationalID: "345678901234",
    phone: "077123456",
    sport: "football",
    sports: ["football"],
    sportCategory: "បាល់ទាត់ ១១ នាក់ បុរស",
    category: "បាល់ទាត់ ១១ នាក់ បុរស",
    eventId: "evt-1",
    position: { role: "Athlete", coach: null, assistant: null },
    organization: {
      type: "ministry",
      id: "ministry-education",
      name: "ក្រសួងអប់រំ យុវជន និងកីឡា",
      province: null,
      department: "នាយកដ្ឋានកីឡា"
    }
  },
  {
    firstName: "Chantha",
    lastName: "Sok",
    firstNameKh: "ចន្ថា",
    lastNameKh: "សុខ",
    dateOfBirth: "1990-12-05",
    gender: "Male",
    nationality: "IDCard",
    nationalID: "456789012345",
    phone: "085987654",
    sport: "athletics",
    sports: ["athletics"],
    sportCategory: "លោតវែង",
    category: "លោតវែង",
    eventId: "evt-1",
    position: { role: "Leader", leaderRole: "Team Manager", coach: null, assistant: null },
    organization: {
      type: "province",
      id: "battambang",
      name: "ខេត្តបាត់ដំបង",
      province: "ខេត្តបាត់ដំបង",
      department: null
    }
  },
  {
    firstName: "Veasna",
    lastName: "Heng",
    firstNameKh: "វាសនា",
    lastNameKh: "ហេង",
    dateOfBirth: "1997-07-18",
    gender: "Female",
    nationality: "IDCard",
    nationalID: "567890123456",
    phone: "069876543",
    sport: "badminton",
    sports: ["badminton"],
    sportCategory: "ឯកត្តជន នារី",
    category: "ឯកត្តជន នារី",
    eventId: "evt-3",
    position: { role: "Athlete", coach: null, assistant: null },
    organization: {
      type: "province",
      id: "kampong-cham",
      name: "ខេត្តកំពង់ចាម",
      province: "ខេត្តកំពង់ចាម",
      department: null
    }
  }
];

async function createRegistrations() {
  const baseUrl = 'http://localhost:3001';
  const results = [];

  for (const reg of testRegistrations) {
    try {
      const response = await fetch(`${baseUrl}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reg)
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({ success: true, id: data.id, name: `${reg.firstName} ${reg.lastName}` });
        console.log(`✅ Created: ${reg.firstName} ${reg.lastName} (ID: ${data.id})`);
      } else {
        const err = await response.text();
        results.push({ success: false, name: `${reg.firstName} ${reg.lastName}`, error: err });
        console.log(`❌ Failed: ${reg.firstName} ${reg.lastName} - ${err}`);
      }
    } catch (err) {
      results.push({ success: false, name: `${reg.firstName} ${reg.lastName}`, error: String(err) });
      console.log(`❌ Error: ${reg.firstName} ${reg.lastName} - ${err}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`Total: ${results.length}`);
  console.log(`Success: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  return results;
}

createRegistrations().then(() => {
  console.log('\n✅ Test complete');
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
