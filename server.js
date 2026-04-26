const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbFile = './database.json';

// Build initial database structure if it doesn't exist
function initDatabase() {
  if (!fs.existsSync(dbFile)) {
    const initialData = {
      users: [
        { id: 1, full_name: 'System Admin', email: 'admin@ethioedu.com', password: 'password', role: 'admin' },
        { id: 2, full_name: 'Abebe Bikila', email: 'abebe@example.com', password: 'password', role: 'student' },
        { id: 3, full_name: 'Tirunesh Dibaba', email: 'tirunesh@example.com', password: 'password', role: 'student' }
      ],
      students: [
        { id: 1, user_id: 2, first_name: 'Abebe', last_name: 'Bikila', gender: 'Male', course: 'Computer Science', status: 'Active' },
        { id: 2, user_id: 3, first_name: 'Tirunesh', last_name: 'Dibaba', gender: 'Female', course: 'Engineering', status: 'Active' }
      ]
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
    console.log('Built local JSON database successfully!');
  }
}

initDatabase();

function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// --- API Endpoints ---

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { fullName, email, password, gender, dob, phone, address } = req.body;
  const db = readDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const userId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  db.users.push({ id: userId, full_name: fullName, email, password, role: 'student' });

  const studentId = db.students.length > 0 ? Math.max(...db.students.map(s => s.id)) + 1 : 1;
  const nameParts = fullName.split(' ');
  
  db.students.push({
    id: studentId,
    user_id: userId,
    first_name: nameParts[0],
    last_name: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
    gender,
    course: 'Pending Course',
    status: 'Active'
  });

  writeDB(db);
  res.json({ success: true, message: 'Registration successful' });
});

app.get('/api/students', (req, res) => {
  const db = readDB();
  
  const studentsList = db.students.map(s => {
    const user = db.users.find(u => u.id === s.user_id);
    return {
      id: s.id,
      name: `${s.first_name} ${s.last_name}`.trim(),
      email: user ? user.email : '',
      gender: s.gender,
      course: s.course,
      status: s.status
    };
  });

  res.json({ success: true, data: studentsList });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
