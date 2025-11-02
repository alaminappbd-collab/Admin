// (This is a long file, as it contains all admin logic)
document.addEventListener('DOMContentLoaded', () => {

    // --- DATABASE INITIALIZATION ---
    // (This is the same as the user app to ensure data is shared)
    function initDB() {
        const defaults = {
            users: [
                {id:1, name:"Rakib", phone:"+8801765432109", password: "123", balance:500, plan: 1, referralBalance: 50, referralCode:"RAKIB123", referredBy: null, status: "active", lastLogin: "2025-11-01T10:00:00", ip: "192.168.1.1", planEndDate: "2025-12-31T23:59:59"},
                {id:2, name:"Nusrat", phone:"+8801555555555", password: "123", balance:3000, plan: 3, referralBalance: 100, referralCode:"NUS123", referredBy: "+8801765432109", status: "active", lastLogin: "2025-11-02T11:00:00", ip: "192.168.1.2", planEndDate: "2026-01-31T23:59:59"},
            ],
            deposits: [
                {id:1, userPhone:"+8801765432109", amount:500, method:"Bkash", txnId: "ABC1234", status:"Pending", date: "2025-11-01T10:00:00"},
                {id:2, userPhone:"+8801555555555", amount:1000, method:"USDT", txnId: "XYZ5678", status:"Approved", date: "2025-11-02T11:00:00"},
            ],
            withdraws: [
                {id:1, userPhone:"+8801555555555", amount:300, method:"USDT", wallet: "T...", status:"Approved", date: "2025-11-01T15:00:00"},
                {id:2, userPhone:"+8801765432109", amount:500, method:"Bkash", wallet: "017...", status:"Pending", date: "2025-11-02T12:00:00"},
            ],
            plans: [
                {id:1, name:"Plan 1", price:500, reward:50, validity:60},
                {id:2, name:"Plan 2", price:1000, reward:100, validity:60},
                {id:3, name:"Plan 3", price:2000, reward:200, validity:90},
                {id:4, name:"Plan 4", price:3000, reward:300, validity:120},
                {id:5, name:"Plan 5", price:5000, reward:500, validity:180},
                {id:6, name:"Plan 6", price:10000, reward:1000, validity:365}
            ],
            tasks: [
                { id: 1, name: "Daily Ad View", rewardSource: "plan", isCompleted: false, completedDate: null }
            ],
            settings: {
                adminUser: "admin",
                adminPass: "12345",
                minDeposit: 200,
                minDepositUSD: 2,
                withdrawRate: 120, // 1 USD = 120 BDT
                dailyWithdrawLimit: 10000,
                referralDepositBonus: 0.10, // 10%
                referralPlanBonus: 50, // ৳50
                allTasksBonus: 20,
                announcement: "Welcome to RAZA CASH! Invest today and earn daily. Join our Telegram for updates.",
                paymentMethods: [
                    { name: "Bkash", address: "01700000000 (Personal)"},
                    { name: "Nagad", address: "01800000000 (Personal)"},
                    { name: "USDT (TRC20)", address: "TXYZ...ADDRESS...123"},
                    { name: "BTC", address: "bc1q...address...456"},
                    { name: "Binance", address: "user@binance.com"},
                    { name: "Payeer", address: "P12345678"},
                ]
            }
        };
        for (const key in defaults) {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaults[key]));
            }
        }
    }

    // --- MULTI-LANGUAGE ENGINE ---
    const translations = {
        en: {
            "dashboard": "Dashboard", "manageUsers": "Manage Users", "manageDeposits": "Manage Deposits", "manageWithdraws": "Manage Withdraws",
            "managePlans": "Manage Plans", "settings": "Settings", "logout": "Logout", "totalUsers": "Total Users", "totalDeposits": "Total Deposits",
            "totalWithdraws": "Total Withdraws", "activePlans": "Active Plans", "recentActivity": "Recent Activity", "pendingDeposits": "Pending Deposits",
            "pendingWithdraws": "Pending Withdrawals", "user": "User", "amount": "Amount", "method": "Method", "id": "ID", "name": "Name",
            "phone": "Phone", "balance": "Balance", "plan": "Plan", "status": "Status", "actions": "Actions", "edit": "Edit", "delete": "Delete",
            "ban": "Ban", "unban": "Unban", "editUser": "Edit User", "referralBalance": "Referral Balance", "newPassword": "New Password (Optional)",
            "saveChanges": "Save Changes", "pending": "Pending", "approved": "Approved", "rejected": "Rejected", "date": "Date",
            "txnId": "Txn ID", "approve": "Approve", "reject": "Reject", "walletAddress": "Wallet", "addNewPlan": "Add New Plan",
            "planName": "Plan Name", "price": "Price", "dailyReward": "Daily Reward", "validityDays": "Validity (Days)", "addPlan": "Add Plan",
            "existingPlans": "Existing Plans", "validity": "Validity", "editPlan": "Edit Plan", "generalSettings": "General Settings",
            "minDepositBdt": "Min Deposit (BDT)", "minDepositUsd": "Min Deposit (USD)", "withdrawRateUsd": "Withdraw Rate (1 USD = BDT)",
            "dailyWithdrawLimit": "Daily Withdraw Limit (BDT)", "referralSettings": "Referral Settings", "refDepositBonus": "Deposit Bonus (%)",
            "refPlanBonus": "Plan Buy Bonus (BDT)", "allTasksBonus": "All Tasks Bonus (BDT)", "paymentMethods": "Payment Methods", "addMethod": "Add Method",
            "announcement": "Announcement", "announcementText": "Announcement Text (Marquee)", "adminSettings": "Admin Settings",
            "adminUser": "Admin Username", "adminPass": "New Admin Password", "saveSettings": "Save All Settings",
            "dataManagement": "Data Management", "exportData": "Export All Data (JSON)", "resetData": "Reset All Data (Danger!)"
        },
        bn: {
            "dashboard": "ড্যাশবোর্ড", "manageUsers": "ব্যবহারকারী পরিচালনা", "manageDeposits": "জমা পরিচালনা", "manageWithdraws": "উত্তোলন পরিচালনা",
            "managePlans": "প্ল্যান পরিচালনা", "settings": "সেটিংস", "logout": "লগআউট", "totalUsers": "মোট ব্যবহারকারী", "totalDeposits": "মোট জমা",
            "totalWithdraws": "মোট উত্তোলন", "activePlans": "সক্রিয় প্ল্যান", "recentActivity": "সাম্প্রতিক কার্যকলাপ", "pendingDeposits": "অপেক্ষমান জমা",
            "pendingWithdraws": "অপেক্ষমান উত্তোলন", "user": "ব্যবহারকারী", "amount": "পরিমাণ", "method": "পদ্ধতি", "id": "আইডি", "name": "নাম",
            "phone": "ফোন", "balance": "ব্যালেন্স", "plan": "প্ল্যান", "status": "স্ট্যাটাস", "actions": "কার্যক্রম", "edit": "সম্পাদনা", "delete": "মুছুন",
            "ban": "নিষিদ্ধ", "unban": "ফিরিয়ে আনা", "editUser": "ব্যবহারকারী সম্পাদনা", "referralBalance": "রেফারেল ব্যালেন্স", "newPassword": "নতুন পাসওয়ার্ড (ঐচ্ছিক)",
            "saveChanges": "পরিবর্তন সংরক্ষণ", "pending": "অপেক্ষমান", "approved": "অনুমোদিত", "rejected": "প্রত্যাখ্যাত", "date": "তারিখ",
            "txnId": "লেনদেন আইডি", "approve": "অনুমোদন", "reject": "প্রত্যাখ্যান", "walletAddress": "ওয়ালেট", "addNewPlan": "নতুন প্ল্যান যোগ",
            "planName": "প্ল্যানের নাম", "price": "মূল্য", "dailyReward": "দৈনিক পুরস্কার", "validityDays": "মেয়াদ (দিন)", "addPlan": "প্ল্যান যোগ",
            "existingPlans": "বিদ্যমান প্ল্যান", "validity": "মেয়াদ", "editPlan": "প্ল্যান সম্পাদনা", "generalSettings": "সাধারণ সেটিংস",
            "minDepositBdt": "ন্যূনতম জমা (BDT)", "minDepositUsd": "ন্যূনতম জমা (USD)", "withdrawRateUsd": "উত্তোলন হার (১ USD = BDT)",
            "dailyWithdrawLimit": "দৈনিক উত্তোলন সীমা (BDT)", "referralSettings": "রেফারেল সেটিংস", "refDepositBonus": "জমা বোনাস (%)",
            "refPlanBonus": "প্ল্যান ক্রয় বোনাস (BDT)", "allTasksBonus": "সকল টাস্ক বোনাস (BDT)", "paymentMethods": "পেমেন্ট পদ্ধতি", "addMethod": "পদ্ধতি যোগ",
            "announcement": "বিজ্ঞপ্তি", "announcementText": "বিজ্ঞপ্তি টেক্সট (Marquee)", "adminSettings": "অ্যাডমিন সেটিংস",
            "adminUser": "অ্যাডমিন ইউজারনেম", "adminPass": "নতুন অ্যাডমিন পাসওয়ার্ড", "saveSettings": "সকল সেটিংস সংরক্ষণ",
            "dataManagement": "ডেটা ম্যানেজমেন্ট", "exportData": "সম্পূর্ণ ডেটা এক্সপোর্ট (JSON)", "resetData": "সম্পূর্ণ ডেটা রিসেট (বিপজ্জনক!)"
        },
        hi: {
            "dashboard": "डैशबोर्ड", "manageUsers": "उपयोगकर्ता प्रबंधित करें", "manageDeposits": "जमा प्रबंधित करें", "manageWithdraws": "निकासी प्रबंधित करें",
            "managePlans": "प्लान प्रबंधित करें", "settings": "सेटिंग्स", "logout": "लॉग आउट", "totalUsers": "कुल उपयोगकर्ता", "totalDeposits": "कुल जमा",
            "totalWithdraws": "कुल निकासी", "activePlans": "सक्रिय प्लान", "recentActivity": "हाल की गतिविधि", "pendingDeposits": "लंबित जमा",
            "pendingWithdraws": "लंबित निकासी", "user": "उपयोगकर्ता", "amount": "राशि", "method": "विधि", "id": "ID", "name": "नाम",
            "phone": "फ़ोन", "balance": "बैलेंस", "plan": "प्लान", "status": "स्थिति", "actions": "कार्रवाई", "edit": "संपादित करें", "delete": "हटाएं",
            "ban": "प्रतिबंधित", "unban": "प्रतिबंध हटाएँ", "editUser": "उपयोगकर्ता संपादित करें", "referralBalance": "रेफरल बैलेंस", "newPassword": "नया पासवर्ड (वैकल्पिक)",
            "saveChanges": "बदलाव सहेजें", "pending": "लंबित", "approved": "स्वीकृत", "rejected": "अस्वीकृत", "date": "दिनांक",
            "txnId": "लेन-देन आईडी", "approve": "स्वीकृत करें", "reject": "अस्वीकृत करें", "walletAddress": "वॉलेट", "addNewPlan": "नया प्लान जोड़ें",
            "planName": "प्लान का नाम", "price": "कीमत", "dailyReward": "दैनिक इनाम", "validityDays": "वैधता (दिन)", "addPlan": "प्लान जोड़ें",
            "existingPlans": "मौजूदा प्लान", "validity": "वैधता", "editPlan": "प्लान संपादित करें", "generalSettings": "सामान्य सेटिंग्स",
            "minDepositBdt": "न्यूनतम जमा (BDT)", "minDepositUsd": "न्यूनतम जमा (USD)", "withdrawRateUsd": "निकासी दर (1 USD = BDT)",
            "dailyWithdrawLimit": "दैनिक निकासी सीमा (BDT)", "referralSettings": "रेफरल सेटिंग्स", "refDepositBonus": "जमा बोनस (%)",
            "refPlanBonus": "प्लान खरीदें बोनस (BDT)", "allTasksBonus": "सभी टास्क बोनस (BDT)", "paymentMethods": "भुगतान विधियाँ", "addMethod": "विधि जोड़ें",
            "announcement": "घोषणा", "announcementText": "घोषणा टेक्स्ट (मार्की)", "adminSettings": "एडमिन सेटिंग्स",
            "adminUser": "एडमिन उपयोगकर्ता नाम", "adminPass": "नया एडमिन पासवर्ड", "saveSettings": "सभी सेटिंग्स सहेजें",
            "dataManagement": "डेटा प्रबंधन", "exportData": "सभी डेटा निर्यात करें (JSON)", "resetData": "सभी डेटा रीसेट करें (खतरा!)"
        }
    };
    
    function setLanguage(lang) {
        localStorage.setItem('adminLang', lang);
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        const currentLang = localStorage.getItem('adminLang') || 'en';
        langSelect.value = currentLang;
        setLanguage(currentLang);
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }


    // --- UTILITY FUNCTIONS ---
    function getDB(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
    function setDB(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    function getSettings() {
        return JSON.parse(localStorage.getItem('settings')) || {};
    }
    function saveSettings(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // --- AUTHENTICATION ---
    initDB();
    const path = window.location.pathname;
    
    // Auth Guard
    if (!path.endsWith('login.html') && localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    if (path.endsWith('login.html') && localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }

    // --- Login Page Logic ---
    if (path.endsWith('login.html')) {
        const loginForm = document.getElementById('admin-login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const settings = getSettings();
            const user = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;

            if (user === settings.adminUser && pass === settings.adminPass) {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid admin credentials.');
            }
        });
        return; // Stop script execution for login page
    }
    
    // --- COMMON ADMIN PAGE LOGIC (Sidebar toggle, Logout) ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    const logoutBtn = document.getElementById('admin-logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'login.html';
            }
        });
    }
    
    // --- Dashboard Page (dashboard.html) ---
    if (path.endsWith('dashboard.html')) {
        const users = getDB('users');
        const deposits = getDB('deposits');
        const withdraws = getDB('withdraws');

        document.getElementById('stat-total-users').innerText = users.length;
        
        const totalDeposits = deposits
            .filter(d => d.status === 'Approved')
            .reduce((sum, d) => sum + d.amount, 0);
        document.getElementById('stat-total-deposits').innerText = `৳${totalDeposits.toFixed(2)}`;
        
        const totalWithdraws = withdraws
            .filter(w => w.status === 'Approved')
            .reduce((sum, w) => sum + w.amount, 0);
        document.getElementById('stat-total-withdraws').innerText = `৳${totalWithdraws.toFixed(2)}`;
        
        const activePlans = users.filter(u => u.plan !== null).length;
        document.getElementById('stat-active-plans').innerText = activePlans;

        // Recent Pending
        const pendingDeposits = deposits.filter(d => d.status === 'Pending').slice(0, 5);
        const recentDepositsBody = document.getElementById('recent-deposits');
        recentDepositsBody.innerHTML = '';
        pendingDeposits.forEach(d => {
            recentDepositsBody.innerHTML += `
                <tr>
                    <td>${d.userPhone}</td>
                    <td>৳${d.amount}</td>
                    <td>${d.method}</td>
                </tr>
            `;
        });
        
        const pendingWithdraws = withdraws.filter(w => w.status === 'Pending').slice(0, 5);
        const recentWithdrawsBody = document.getElementById('recent-withdraws');
        recentWithdrawsBody.innerHTML = '';
        pendingWithdraws.forEach(w => {
            recentWithdrawsBody.innerHTML += `
                <tr>
                    <td>${w.userPhone}</td>
                    <td>৳${w.amount}</td>
                    <td>${w.method}</td>
                </tr>
            `;
        });
    }

    // --- Manage Users Page (users.html) ---
    if (path.endsWith('users.html')) {
        const usersTableBody = document.getElementById('users-table-body');
        const userSearch = document.getElementById('user-search');
        const modal = document.getElementById('edit-user-modal');
        const closeModalBtn = modal.querySelector('.close-btn');
        const editForm = document.getElementById('edit-user-form');
        let users = getDB('users');
        const plans = getDB('plans');

        function renderUsers(filteredUsers = users) {
            usersTableBody.innerHTML = '';
            filteredUsers.forEach(user => {
                const planName = user.plan ? plans.find(p => p.id === user.plan)?.name : 'None';
                usersTableBody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.phone}</td>
                        <td>৳${user.balance.toFixed(2)}</td>
                        <td>${planName}</td>
                        <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
                        <td class="actions">
                            <button class="btn-icon edit" data-id="${user.id}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon ban" data-id="${user.id}" title="${user.status === 'banned' ? 'Unban' : 'Ban'}">
                                <i class="fas ${user.status === 'banned' ? 'fa-check-circle' : 'fa-ban'}"></i>
                            </button>
                            <button class="btn-icon delete" data-id="${user.id}" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        
        userSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = users.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.phone.includes(query) ||
                u.id.toString() === query
            );
            renderUsers(filtered);
        });

        usersTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const id = parseInt(btn.dataset.id);
            const user = users.find(u => u.id === id);
            const userIndex = users.findIndex(u => u.id === id);

            if (btn.classList.contains('edit')) {
                document.getElementById('edit-user-id').value = user.id;
                document.getElementById('edit-user-name').value = user.name;
                document.getElementById('edit-user-phone').value = user.phone;
                document.getElementById('edit-user-balance').value = user.balance;
                document.getElementById('edit-user-ref-balance').value = user.referralBalance;
                document.getElementById('edit-user-password').value = '';
                modal.classList.add('open');
            }
            
            if (btn.classList.contains('ban')) {
                const newStatus = user.status === 'banned' ? 'active' : 'banned';
                if (confirm(`Are you sure you want to ${newStatus === 'banned' ? 'ban' : 'unban'} this user?`)) {
                    users[userIndex].status = newStatus;
                    setDB('users', users);
                    renderUsers();
                }
            }
            
            if (btn.classList.contains('delete')) {
                if (confirm(`Are you sure you want to DELETE this user? This is irreversible.`)) {
                    users.splice(userIndex, 1);
                    setDB('users', users);
                    // Also delete their deposits, withdraws etc. (optional)
                    // let deposits = getDB('deposits').filter(d => d.userPhone !== user.phone);
                    // setDB('deposits', deposits);
                    renderUsers();
                }
            }
        });
        
        closeModalBtn.onclick = () => modal.classList.remove('open');
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };
        
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-user-id').value);
            const userIndex = users.findIndex(u => u.id === id);
            
            users[userIndex].name = document.getElementById('edit-user-name').value;
            users[userIndex].balance = parseFloat(document.getElementById('edit-user-balance').value);
            users[userIndex].referralBalance = parseFloat(document.getElementById('edit-user-ref-balance').value);
            
            const newPass = document.getElementById('edit-user-password').value;
            if (newPass) {
                users[userIndex].password = newPass;
            }
            
            setDB('users', users);
            modal.classList.remove('open');
            renderUsers();
            alert('User updated successfully!');
        });
        
        renderUsers();
    }
    
    // --- Manage Deposits Page (deposits.html) ---
    if (path.endsWith('deposits.html')) {
        const depositsTableBody = document.getElementById('deposits-table-body');
        const tabs = document.querySelector('.tabs');
        let deposits = getDB('deposits');
        let users = getDB('users');
        let settings = getSettings();
        let currentTab = 'pending';
        
        function renderDeposits(status) {
            depos