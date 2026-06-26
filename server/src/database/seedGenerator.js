const fs = require('fs');

// ─── Configurable Data Pools ───────────────────────────────────────────────────
// Edit these arrays to control what values appear in the generated data.

const NAMES = {
  male: [
    'James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard',
    'Raj', 'Amit', 'Vikram', 'Arjun', 'Sanjay', 'Hiroshi', 'Takeshi',
    'Kenji', 'Wei', 'Chen', 'Hans', 'Klaus', 'Pierre', 'Jean', 'Carlos',
    'Miguel', 'Ahmed', 'Omar', 'Liam', 'Noah', 'Oliver', 'Ethan', 'Lucas',
    'Mateo', 'Hugo', 'Leo', 'Felix', 'Emil', 'Lars', 'Stefan', 'Ryan',
    'Aaron', 'Nathan', 'Henry', 'Peter', 'Alexander', 'Benjamin', 'Samuel',
  ],
  female: [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Jessica',
    'Priya', 'Anita', 'Sunita', 'Kavita', 'Neha', 'Pooja', 'Yuki',
    'Sakura', 'Hana', 'Mei', 'Ling', 'Xia', 'Greta', 'Ingrid', 'Marie',
    'Claire', 'Sophie', 'Sofia', 'Isabella', 'Valentina', 'Fatima',
    'Amira', 'Layla', 'Olivia', 'Ava', 'Mia', 'Charlotte', 'Emma',
    'Astrid', 'Freya', 'Sarah', 'Amanda', 'Rachel', 'Emily', 'Ashley',
  ],
};

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Garcia', 'Miller', 'Davis',
  'Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Tanaka', 'Suzuki',
  'Watanabe', 'Wang', 'Li', 'Zhang', 'Müller', 'Schmidt', 'Dubois',
  'Martin', 'Fernandez', 'Romero', 'Al-Rashid', 'Mansour', 'O\'Brien',
  'Murphy', 'Johansson', 'Andersson', 'Wilson', 'Taylor', 'Moore',
  'Clark', 'Lewis', 'Walker', 'Young', 'King', 'Scott', 'Adams',
];

const DEPARTMENTS = {
  Engineering: [
    'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
    'Principal Engineer', 'Engineering Manager', 'Tech Lead',
    'DevOps Engineer', 'QA Engineer', 'Frontend Developer',
    'Backend Developer', 'Full Stack Developer', 'ML Engineer',
  ],
  HR: [
    'HR Executive', 'HR Manager', 'Senior HR Manager',
    'HR Business Partner', 'Talent Acquisition Specialist',
    'Recruiter', 'Senior Recruiter', 'HR Director',
  ],
  Finance: [
    'Financial Analyst', 'Senior Financial Analyst', 'Accountant',
    'Senior Accountant', 'Finance Manager', 'Controller',
    'Tax Analyst', 'Finance Director',
  ],
  Marketing: [
    'Marketing Executive', 'Marketing Manager', 'Content Strategist',
    'SEO Specialist', 'Digital Marketing Analyst', 'Brand Manager',
    'Marketing Director', 'Social Media Manager',
  ],
  Sales: [
    'Sales Executive', 'Senior Sales Executive', 'Sales Manager',
    'Account Manager', 'Business Development Manager',
    'Regional Sales Manager', 'VP of Sales',
  ],
  Operations: [
    'Operations Analyst', 'Operations Manager', 'Supply Chain Analyst',
    'Logistics Coordinator', 'Operations Director', 'Facilities Manager',
  ],
  Product: [
    'Product Manager', 'Senior Product Manager', 'Product Owner',
    'Associate Product Manager', 'Director of Product',
  ],
  Design: [
    'UI Designer', 'UX Designer', 'Senior UX Designer',
    'UX Researcher', 'Design Lead', 'Creative Director',
  ],
  Legal: [
    'Legal Counsel', 'Senior Legal Counsel', 'Paralegal',
    'Compliance Officer', 'Contract Specialist',
  ],
  'Customer Support': [
    'Support Executive', 'Support Manager', 'Customer Success Manager',
    'Technical Support Engineer', 'Help Desk Analyst',
  ],
  'Data Science': [
    'Data Scientist', 'Senior Data Scientist', 'Data Analyst',
    'Senior Data Analyst', 'Analytics Manager',
  ],
  IT: [
    'System Administrator', 'Network Engineer', 'IT Manager',
    'Security Analyst', 'Database Administrator',
  ],
};

const LOCATIONS = [
  { country: 'India', currency: 'INR', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'], salaryRange: [400000, 3500000] },
  { country: 'USA', currency: 'USD', cities: ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Austin', 'Boston'], salaryRange: [45000, 250000] },
  { country: 'Japan', currency: 'JPY', cities: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Kyoto'], salaryRange: [3500000, 15000000] },
  { country: 'Germany', currency: 'EUR', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Stuttgart'], salaryRange: [35000, 120000] },
  { country: 'UK', currency: 'GBP', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol'], salaryRange: [28000, 110000] },
  { country: 'Canada', currency: 'CAD', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'], salaryRange: [50000, 180000] },
  { country: 'Australia', currency: 'AUD', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'], salaryRange: [55000, 200000] },
  { country: 'France', currency: 'EUR', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse'], salaryRange: [30000, 100000] },
  { country: 'Singapore', currency: 'SGD', cities: ['Singapore'], salaryRange: [40000, 180000] },
  { country: 'UAE', currency: 'AED', cities: ['Dubai', 'Abu Dhabi'], salaryRange: [120000, 600000] },
  { country: 'China', currency: 'CNY', cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'], salaryRange: [150000, 800000] },
  { country: 'Brazil', currency: 'BRL', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'], salaryRange: [50000, 350000] },
  { country: 'South Korea', currency: 'KRW', cities: ['Seoul', 'Busan', 'Incheon'], salaryRange: [30000000, 120000000] },
];

const JOINING_DATE_RANGE = { from: '2015-01-01', to: '2026-06-01' };

// ─── Generator Config ──────────────────────────────────────────────────────────

const config = require('../config');

// ─── Utility Helpers ───────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const roundToNearest = (value, nearest) => Math.round(value / nearest) * nearest;

const randomDate = (from, to) => {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
};


const generateEmployee = (id) => {
  const gender = pick(['male', 'female']);
  const firstName = pick(NAMES[gender]);
  const lastName = pick(LAST_NAMES);

  const department = pick(Object.keys(DEPARTMENTS));
  const designation = pick(DEPARTMENTS[department]);

  const loc = pick(LOCATIONS);
  const salary = roundToNearest(randomInt(...loc.salaryRange), 1000);

  return {
    employeeId: `EMP${String(id).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    gender,
    department,
    designation,
    location: pick(loc.cities),
    country: loc.country,
    currency: loc.currency,
    joiningDate: randomDate(JOINING_DATE_RANGE.from, JOINING_DATE_RANGE.to),
    salary,
  };
};

// ─── Generate Function ─────────────────────────────────────────────────────────

function generate(count, outputPath) {
  const employees = Array.from({ length: count }, (_, i) => generateEmployee(i + 1));
  fs.writeFileSync(outputPath, JSON.stringify(employees, null, 2));
  console.log(`✅ Generated ${employees.length} employees → ${outputPath}`);

  const currencies = new Set(employees.map((e) => e.currency));
  const departments = new Set(employees.map((e) => e.department));
  const countries = new Set(employees.map((e) => e.country));
  const genders = employees.reduce((acc, e) => { acc[e.gender]++; return acc; }, { male: 0, female: 0 });

  console.log(`   Currencies : ${currencies.size} — ${[...currencies].sort().join(', ')}`);
  console.log(`   Departments: ${departments.size} — ${[...departments].sort().join(', ')}`);
  console.log(`   Countries  : ${countries.size} — ${[...countries].sort().join(', ')}`);
  console.log(`   Gender     : M=${genders.male}, F=${genders.female}`);
}

// Run as standalone script
if (require.main === module) {
  const count = parseInt(process.argv[2] || config.employeeCount, 10);
  generate(count, config.dataPath);
}

module.exports = { generate };
