import fs from "fs";

const provinces = [
  { id: "phnom-penh", name: "រាជធានីភ្នំពេញ" },
  { id: "4", name: "Battambang" },
  { id: "15", name: "Pursat" },
];

const sports = [
  { name: "អត្តពលកម្ម", category: "រត់ប្រណាំង ១០០ ម៉ែត្រ" },
  { name: "អត្តពលកម្ម", category: "រត់ប្រណាំង ២០០ ម៉ែត្រ" },
  { name: "បាល់ទាត់", category: "បាល់ទាត់ ១១ នាក់ បុរស" },
  { name: "បាល់ទះ", category: "បុរស" },
];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 10)).join("");

const now = () => new Date().toISOString();

const generateRegistration = () => {
  const sport = random(sports);
  const province = random(provinces);
  const id = Date.now() + Math.floor(Math.random() * 10000);

  return {
    id: String(id),
    registeredAt: now(),
    photoUrl: null,
    firstName: "User",
    lastName: randNum(4),
    firstNameKh: "អ្នក",
    lastNameKh: "ប្រើ",
    dateOfBirth: `19${90 + Math.floor(Math.random() * 10)}-0${1 + Math.floor(Math.random() * 8)}-1${Math.floor(Math.random() * 9)}`,
    gender: Math.random() > 0.5 ? "Male" : "Female",
    nationality: "IDCard",
    nationalID: randNum(12),
    phone: "0" + randNum(8),
    position: {
      role: "Athlete",
      coach: null,
      assistant: null,
      leaderRole: null,
      athleteCategory: "Male",
    },
    organization: {
      type: "province",
      id: province.id,
      name: province.name,
      province: province.name,
      department: null,
    },
    eventId: "evt-1",
    sport: sport.name,
    sports: [sport.name],
    sportId: "",
    sportCategory: sport.category,
    status: "pending",
  };
};

const data = Array.from({ length: 1000 }).map(() => ({
  userId: Date.now() + Math.floor(Math.random() * 100000),
  accessTime: now(),
  registrations: Array.from({ length: 1 + Math.floor(Math.random() * 3) })
    .map(generateRegistration),
}));

fs.writeFileSync("registrations_1000.json", JSON.stringify(data, null, 2));
console.log("✅ Generated registrations_1000.json");
