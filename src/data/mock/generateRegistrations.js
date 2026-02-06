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
const randNum = (len) =>
  [...Array(len)].map(() => Math.floor(Math.random() * 10)).join("");
const now = () => new Date().toISOString();

// ID counter for generating unique sequential IDs
let idCounter = 1;

/**
 * Generate a unique registration ID based on role and date
 * Format: {ROLE_PREFIX}-{YYYYMMDD}-{SEQ}
 */
function generateRegistrationId(role) {
  const rolePrefix = role === "Leader" ? "LEAD" : "ATH";
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const seqStr = String(idCounter++).padStart(3, "0");
  return `${rolePrefix}-${dateStr}-${seqStr}`;
}

const generateRegistration = () => {
  const sport = random(sports);
  const province = random(provinces);
  const isLeader = Math.random() > 0.8; // 20% chance to be a leader
  const role = isLeader ? "Leader" : "Athlete";

  return {
    id: generateRegistrationId(role),
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
    position: isLeader
      ? {
          role: "Leader",
          leaderRole: random([
            "គ្រូបង្វឹក",
            "គ្រូជំនួយ",
            "អ្នកគ្រប់គ្រង",
            "វេជ្ជបណ្ឌិត",
          ]),
          athleteCategory: null,
        }
      : {
          role: "Athlete",
          athleteCategory: Math.random() > 0.5 ? "Male" : "Female",
          leaderRole: null,
        },
    organization: {
      type: "province",
      id: province.id,
      name: province.name,
    },
    eventId: "evt-1",
    sport: sport.name,
    sportId: sport.name.toLowerCase().replace(/\s+/g, "-"),
    sportCategory: sport.category,
    status: random(["pending", "approved", "rejected"]),
    name: `User ${randNum(4)}`,
    province: province.name,
  };
};

const data = Array.from({ length: 1000 }).map(() => ({
  userId: Date.now() + Math.floor(Math.random() * 100000),
  accessTime: now(),
  registrations: Array.from({ length: 1 + Math.floor(Math.random() * 3) }).map(
    generateRegistration,
  ),
}));

fs.writeFileSync("registrations_1000.json", JSON.stringify(data, null, 2));
console.log("✅ Generated registrations_1000.json");
