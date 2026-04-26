// ======================== ETHIOPIAN REGIONS & CITIES DATA ========================
const ethiopianRegions = {
    "Addis Ababa": ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    "Afar": ["Semera", "Asayita", "Awash", "Dubti", "Mille", "Chifra"],
    "Amhara": ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Debre Tabor", "Lalibela", "Woldia", "Kombolcha", "Bati", "Sekota"],
    "Benishangul-Gumuz": ["Asosa", "Metekel", "Assosa", "Kurmuk", "Dibate"],
    "Dire Dawa": ["Dire Dawa City", "Gende Kore", "Melka Jebdu", "Haramaya Area"],
    "Gambela": ["Gambela", "Itang", "Akobo", "Gog", "Jor"],
    "Harari": ["Harar", "Jugol", "Aboker", "Dire Teyara"],
    "Oromia": ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte", "Bale Robe", "Assela", "Metehara", "Burayu", "Dembi Dolo", "Gimbi"],
    "Sidama": ["Hawassa", "Yirgalem", "Aleta Wondo", "Wendo Genet", "Bona", "Daye"],
    "Somali": ["Jijiga", "Dollo", "Gode", "Kebri Dahar", "Warder", "Degahbur"],
    "South West Ethiopia": ["Bonga", "Mizan Aman", "Tepi", "Bench Maji", "Kaffa"],
    "Tigray": ["Mekelle", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Wukro", "Maychew"],
    "Central Ethiopia": ["Hosaena", "Worabe", "Butajira", "Gubre", "Sodo"],
    "South Ethiopia": ["Arba Minch", "Jinka", "Konso", "Dilla", "Wolaita Sodo", "Boditi"]
};

// ======================== GLOBAL VARIABLES ========================
let students = [];
let adminEmail = "duladagn25@gmail.com";
let adminPhone = "0715806962";
let uploadedFiles = [];

// Load data from localStorage
function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedFiles = localStorage.getItem('uploadedFiles');

    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    if (savedFiles) {
        uploadedFiles = JSON.parse(savedFiles);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
}

let currentPage = "dashboard";

// ======================== HELPER FUNCTIONS ========================

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Get cities based on region
function getCitiesForRegion(region) {
    return ethiopianRegions[region] || ["Main City", "Town Center"];
}

// Populate city dropdown based on selected region
function populateCities(region, citySelectElem) {
    if (!citySelectElem) return;
    const cities = getCitiesForRegion(region);
    citySelectElem.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelectElem.appendChild(option);
    });
}

// Show notification message
function showNotification(msg, type = "success") {
    const notif = document.createElement('div');
    notif.className = `notification ${type === 'error' ? 'error' : ''}`;
    notif.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Update admin email display in top bar
function updateAdminEmailDisplay() {
    const span = document.getElementById("adminEmailDisplay");
    if (span) span.innerText = adminEmail;
}

// ======================== PAGE RENDERERS ========================

// Dashboard Page
function renderDashboard() {
    const total = students.length;
    const regionsCount = Object.keys(ethiopianRegions).length;
    const totalCities = Object.values(ethiopianRegions).flat().length;
    const recent = [...students].reverse().slice(0, 5);
    const totalFiles = uploadedFiles.length;

    return `
        <div class="card">
            <h2><i class="fas fa-chalkboard-user"></i> እንኳን ደህና መጡ! Welcome Admin</h2>
            <p style="margin: 10px 0 20px;">You have full control over student registrations, Ethiopian regions/cities, and admin credentials.</p>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-user-graduate"></i>
                    <h3>${total}</h3>
                    <p>Total Students</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>${regionsCount}</h3>
                    <p>Ethiopian Regions</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-city"></i>
                    <h3>${totalCities}</h3>
                    <p>Cities Available</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-file-upload"></i>
                    <h3>${totalFiles}</h3>
                    <p>Uploaded Files</p>
                </div>
            </div>
            <h3>📌 የቅርብ ጊዜ ተማሪዎች | Recent Students</h3>
            ${total === 0 ?
            '<p class="admin-email-box">No students registered yet. Use "Register Student" to add Ethiopian students.</p>' :
            `<div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>City</th>
                                <th>Course</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recent.map(s => `
                                <tr>
                                    <td data-label="Full Name">${escapeHtml(s.fullName)}</td>
                                    <td data-label="Email">${escapeHtml(s.email)}</td>
                                    <td data-label="Phone">${escapeHtml(s.phone || 'N/A')}</td>
                                    <td data-label="Region">${escapeHtml(s.region)}</td>
                                    <td data-label="City">${escapeHtml(s.city)}</td>
                                    <td data-label="Course">${escapeHtml(s.course || 'Frontend Dev')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`
        }
            <div class="admin-email-box">
                <i class="fas fa-envelope"></i> <strong>Admin Email:</strong> ${adminEmail}<br>
                <i class="fas fa-phone"></i> <strong>Admin Phone:</strong> ${adminPhone}<br>
                <i class="fas fa-globe"></i> Ethiopia Education Hub
            </div>
        </div>
    `;
}

// Registration Page with Phone Number
function renderRegisterPage() {
    const regionOptions = Object.keys(ethiopianRegions).map(reg => `<option value="${reg}">${reg}</option>`).join('');
    return `
        <div class="card">
            <h2><i class="fas fa-address-card"></i> ተማሪ ምዝገባ | Student Registration (Ethiopia)</h2>
            <form id="studentRegForm">
                <div class="form-grid">
                    <div class="input-group">
                        <label>Full Name *</label>
                        <input type="text" id="fullName" placeholder="Biruk Alemu" required>
                    </div>
                    <div class="input-group">
                        <label>Email *</label>
                        <input type="email" id="email" placeholder="student@example.com" required>
                    </div>
                    <div class="input-group">
                        <label>Phone Number *</label>
                        <input type="tel" id="phone" placeholder="09xxxxxxxx" required>
                    </div>
                    <div class="input-group">
                        <label>Region (ክልል) *</label>
                        <select id="regionSelect" required>${regionOptions}</select>
                    </div>
                    <div class="input-group">
                        <label>City / Town *</label>
                        <select id="citySelect" required></select>
                    </div>
                    <div class="input-group">
                        <label>Course / Program</label>
                        <input type="text" id="course" placeholder="Frontend Development, Full Stack, UI/UX">
                    </div>
                </div>
                <button type="submit"><i class="fas fa-save"></i> Register Student</button>
            </form>
            <div id="regMessage"></div>
        </div>
    `;
}

// Student List Page with Phone Number
function renderStudentsList() {
    if (students.length === 0) {
        return `
            <div class="card">
                <h2><i class="fas fa-users-slash"></i> No Students</h2>
                <p>No registered students yet. Add using registration panel.</p>
            </div>
        `;
    }
    return `
        <div class="card">
            <h2><i class="fas fa-list"></i> ተማሪዎች ዝርዝር | All Students (${students.length})</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Region</th>
                            <th>City</th>
                            <th>Course</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map((s, idx) => `
                            <tr>
                                <td data-label="ID">${idx + 1}</td>
                                <td data-label="Full Name">${escapeHtml(s.fullName)}</td>
                                <td data-label="Email">${escapeHtml(s.email)}</td>
                                <td data-label="Phone">${escapeHtml(s.phone || 'N/A')}</td>
                                <td data-label="Region">${escapeHtml(s.region)}</td>
                                <td data-label="City">${escapeHtml(s.city)}</td>
                                <td data-label="Course">${escapeHtml(s.course || 'Frontend Dev')}</td>
                                <td data-label="Action">
                                    <button class="delete-btn" data-idx="${idx}">
                                        <i class="fas fa-trash-alt"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="admin-email-box" style="margin-top: 15px;">
                <i class="fas fa-trash"></i> Click delete to remove any student (Admin only).
            </p>
        </div>
    `;
}

// Upload File Page
function renderUploadPage() {
    return `
        <div class="card">
            <h2><i class="fas fa-upload"></i> Upload Files</h2>
            <p>Upload study materials, assignments, or any files for your students.</p>
            
            <div class="file-upload-area" id="fileUploadArea">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click or drag files here to upload</p>
                <input type="file" id="fileInput" multiple style="display: none;">
            </div>
            
            <div id="uploadMessage"></div>
            
            <div class="uploaded-files" id="uploadedFilesList">
                <h3>📁 Uploaded Files (${uploadedFiles.length})</h3>
                ${uploadedFiles.length === 0 ? '<p>No files uploaded yet.</p>' :
            uploadedFiles.map((file, idx) => `
                        <div class="file-item">
                            <div>
                                <i class="fas fa-file"></i>
                                <a href="${file.url}" target="_blank">${escapeHtml(file.name)}</a>
                                <small style="color: #64748b; margin-left: 10px;">(${(file.size / 1024).toFixed(2)} KB)</small>
                            </div>
                            <button class="delete-btn" data-file-idx="${idx}" style="background: #fee2e2;">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    `).join('')
        }
            </div>
            
            <div class="admin-email-box" style="margin-top: 20px;">
                <i class="fas fa-info-circle"></i> <strong>Note:</strong> Files are stored in your browser's localStorage. For permanent storage, you'll need a backend server.
            </div>
        </div>
    `;
}

// Admin Zone Page
function renderAdminZone() {
    return `
        <div class="card">
            <h2><i class="fas fa-laptop-code"></i> Administrator Panel</h2>
            <p>Modify admin email and phone. You are the super admin of this Ethiopian Student Hub.</p>
            <div class="form-grid" style="margin: 20px 0;">
                <div class="input-group">
                    <label>Admin Email Address</label>
                    <input type="email" id="newAdminEmail" value="${adminEmail}" placeholder="admin@domain.com">
                </div>
                <div class="input-group">
                    <label>Admin Phone Number</label>
                    <input type="tel" id="newAdminPhone" value="${adminPhone}" placeholder="09xxxxxxxx">
                </div>
            </div>
            <button id="updateAdminInfoBtn"><i class="fas fa-sync-alt"></i> Update Admin Information</button>
            <div id="adminMsg" style="margin-top: 15px;"></div>
            <hr style="margin: 25px 0;">
            <h3><i class="fas fa-flag-checkered"></i> Ethiopian Regions Data</h3>
            <p>Currently supported regions: <strong>${Object.keys(ethiopianRegions).join(", ")}</strong></p>
            <p><i class="fas fa-database"></i> Total students in system: ${students.length}</p>
            <div class="admin-email-box">
                <strong>📧 Admin Email:</strong> ${adminEmail}<br>
                <strong>📞 Admin Phone:</strong> ${adminPhone}<br>
                <small>You control the whole frontend study platform</small>
            </div>
        </div>
    `;
}

// About Page
function renderAbout() {
    return `
        <div class="card">
            <h2><i class="fas fa-heart"></i> About EduEthiopia Admin</h2>
            <p><strong>Frontend Development Study Project</strong> — Complete student registration and admin dashboard with Ethiopian regions & cities.</p>
            <p>✅ Admin can: add/delete students, change admin email/phone, view dashboard analytics.<br>
            ✅ Dynamic Ethiopia region + city dropdown (realistic data).<br>
            ✅ File upload system (store in browser localStorage).<br>
            ✅ Student phone number included.<br>
            ✅ Fully responsive, HTML/CSS/JS, FontAwesome icons.<br>
            ✅ Perfect for GitHub deployment — one file, zero backend, works offline.</p>
            <p><i class="fas fa-code"></i> Technologies: HTML5, CSS3 (Grid/Flex), Vanilla JavaScript, localStorage.</p>
            <div class="admin-email-box">
                <i class="fas fa-map-pin"></i> Made for Ethiopian students & frontend learners.
            </div>
        </div>
    `;
}

// Contact Page with Admin Phone
function renderContact() {
    return `
        <div class="card">
            <h2><i class="fas fa-phone-alt"></i> Contact Admin & Support</h2>
            <div class="admin-email-box">
                <p><i class="fas fa-envelope"></i> <strong>Admin Email:</strong> ${adminEmail}</p>
                <p><i class="fas fa-phone"></i> <strong>Admin Phone:</strong> <a href="tel:${adminPhone}">${adminPhone}</a></p>
                <p><i class="fas fa-map-marker-alt"></i> <strong>Head Office:</strong> Addis Ababa, Ethiopia - Bole, Edna Mall</p>
                <p><i class="fab fa-telegram"></i> Telegram: @EduEthiopiaAdmin</p>
                <p><i class="fab fa-whatsapp"></i> WhatsApp: ${adminPhone}</p>
                <p>For any issues regarding student registration, regional data, or city management, reach out directly.</p>
            </div>
        </div>
    `;
}

// ======================== EVENT HANDLERS ========================

// Handle registration form submission
function handleRegistration() {
    const form = document.getElementById('studentRegForm');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const region = document.getElementById('regionSelect').value;
        const city = document.getElementById('citySelect').value;
        const course = document.getElementById('course').value.trim() || "Frontend Development";

        if (!fullName || !email || !phone || !region || !city) {
            const msgDiv = document.getElementById('regMessage');
            msgDiv.innerHTML = '<div class="error-msg">❌ Please fill all required fields!</div>';
            setTimeout(() => msgDiv.innerHTML = '', 2500);
            return;
        }

        // Validate Ethiopian phone number (simple validation)
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(phone)) {
            const msgDiv = document.getElementById('regMessage');
            msgDiv.innerHTML = '<div class="error-msg">❌ Please enter a valid Ethiopian phone number (09xxxxxxxx or 07xxxxxxxx)!</div>';
            setTimeout(() => msgDiv.innerHTML = '', 3000);
            return;
        }

        const emailExists = students.some(s => s.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            const msgDiv = document.getElementById('regMessage');
            msgDiv.innerHTML = '<div class="error-msg">⚠️ Email already registered!</div>';
            return;
        }

        students.push({ fullName, email, phone, region, city, course });
        saveData();

        const msgDiv = document.getElementById('regMessage');
        msgDiv.innerHTML = '<div class="success-msg">✅ Student registered successfully! 🇪🇹</div>';
        form.reset();

        // Reset region/city after reset
        const regionSelect = document.getElementById('regionSelect');
        const citySelect = document.getElementById('citySelect');
        if (regionSelect && citySelect) {
            const defaultRegion = regionSelect.value;
            populateCities(defaultRegion, citySelect);
        }

        showNotification(`${fullName} added to Ethiopia students`, "success");
        setTimeout(() => msgDiv.innerHTML = '', 2000);
    };

    // Handle region change to update cities
    const regionSelect = document.getElementById('regionSelect');
    const citySelect = document.getElementById('citySelect');
    if (regionSelect && citySelect) {
        const updateCitiesHandler = () => populateCities(regionSelect.value, citySelect);
        regionSelect.addEventListener('change', updateCitiesHandler);
        populateCities(regionSelect.value, citySelect);
    }
}

// Handle student deletion
function handleStudentDeletion() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = btn.getAttribute('data-idx');
            if (idx !== null && confirm('Delete this student permanently from Ethiopia records?')) {
                const deleted = students.splice(parseInt(idx), 1);
                saveData();
                showNotification(`Removed ${deleted[0].fullName}`, "success");
                renderPage(currentPage);
            }
        });
    });
}

// Handle file uploads
function handleFileUpload() {
    const fileArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');

    if (!fileArea || !fileInput) return;

    fileArea.addEventListener('click', () => fileInput.click());

    fileArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileArea.style.borderColor = '#2563eb';
        fileArea.style.background = '#f1f5f9';
    });

    fileArea.addEventListener('dragleave', () => {
        fileArea.style.borderColor = '#cbd5e1';
        fileArea.style.background = 'transparent';
    });

    fileArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileArea.style.borderColor = '#cbd5e1';
        fileArea.style.background = 'transparent';
        if (e.dataTransfer.files.length) {
            processFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            processFiles(fileInput.files);
        }
    });

    function processFiles(files) {
        Array.from(files).forEach(file => {
            // Create a local object URL for the file
            const url = URL.createObjectURL(file);
            uploadedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                url: url
            });
        });
        saveData();
        showNotification(`${files.length} file(s) uploaded successfully`, "success");
        renderPage('upload');
    }

    // Handle file deletion
    document.querySelectorAll('[data-file-idx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = btn.getAttribute('data-file-idx');
            if (idx !== null && confirm('Delete this file?')) {
                const deleted = uploadedFiles.splice(parseInt(idx), 1);
                saveData();
                showNotification(`Removed file: ${deleted[0].name}`, "success");
                renderPage('upload');
            }
        });
    });
}

// Handle Admin Zone Info Update
function handleAdminUpdate() {
    const btn = document.getElementById('updateAdminInfoBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const newEmail = document.getElementById('newAdminEmail').value.trim();
        const newPhone = document.getElementById('newAdminPhone').value.trim();

        if (!newEmail || !newPhone) {
            const msgDiv = document.getElementById('adminMsg');
            msgDiv.innerHTML = '<div class="error-msg">❌ Fields cannot be empty!</div>';
            return;
        }

        adminEmail = newEmail;
        adminPhone = newPhone;
        updateAdminEmailDisplay();

        const msgDiv = document.getElementById('adminMsg');
        msgDiv.innerHTML = '<div class="success-msg">✅ Admin info updated!</div>';
        showNotification('Admin credentials updated successfully', 'success');
        setTimeout(() => msgDiv.innerHTML = '', 3000);
    });
}

// Navigation & Page Rendering
const pageTitles = {
    dashboard: "📊 Admin Dashboard",
    register: "📝 Register Student",
    students: "📋 Student List",
    upload: "📁 Upload File",
    admin: "⚙️ Admin Zone",
    about: "ℹ️ About System",
    contact: "📞 Contact Us"
};

function renderPage(pageId) {
    currentPage = pageId;
    const container = document.getElementById('pageContentContainer');
    const titleElem = document.getElementById('dynamicTitle');

    if (titleElem) titleElem.innerText = pageTitles[pageId] || "EduEthiopia Portal";

    let htmlContent = "";
    switch (pageId) {
        case 'dashboard': htmlContent = renderDashboard(); break;
        case 'register': htmlContent = renderRegisterPage(); break;
        case 'students': htmlContent = renderStudentsList(); break;
        case 'upload': htmlContent = renderUploadPage(); break;
        case 'admin': htmlContent = renderAdminZone(); break;
        case 'about': htmlContent = renderAbout(); break;
        case 'contact': htmlContent = renderContact(); break;
        default: htmlContent = renderDashboard(); break;
    }

    if (container) {
        container.innerHTML = htmlContent;
    }

    // Attach event listeners based on page
    if (pageId === 'register') handleRegistration();
    if (pageId === 'students') handleStudentDeletion();
    if (pageId === 'upload') handleFileUpload();
    if (pageId === 'admin') handleAdminUpdate();
}

// Initialization
function initApp() {
    loadData();
    updateAdminEmailDisplay();

    // Setup Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const page = item.getAttribute('data-page');
            if (page) renderPage(page);
        });
    });

    // Initial Render
    renderPage('dashboard');
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
