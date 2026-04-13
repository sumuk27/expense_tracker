// login page
const API_URL = "http://localhost:5000/api/auth";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    // ✅ save token
    localStorage.setItem("token", data.token);

    // ✅ redirect
    window.location.href = "index.html";   //previously it was dashboard
  } else {
    alert(data.message);
  }
}


// register page
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name, email, password, age, phone, address
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert(data.message);
  }
}








// dashboard page
const BASE_URL = "http://localhost:5000/api";

async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  // Update UI
  document.getElementById("balance").innerText = "₹" + data.balance;
  document.getElementById("income").innerText = "₹" + data.totalIncome;
  document.getElementById("expense").innerText = "₹" + data.totalExpense;

  // Transactions
  const list = document.getElementById("transactionsList");
  list.innerHTML = "";

  data.recentTransactions.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.title} - ₹${t.amount} (${t.type})`;
    list.appendChild(li);
  });
}







// logout fuction
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}







// auto loadDashboard
if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}



// charts
async function loadCharts() {
  const token = localStorage.getItem("token");

  // 📊 Get dashboard data (for pie)
  const dashRes = await fetch("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const dashData = await dashRes.json();

  // 🥧 Pie Chart
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [dashData.totalIncome, dashData.totalExpense]
      }]
    }
  });

  // 📈 Get 30-day expense data
  const expRes = await fetch("http://localhost:5000/api/charts/expense", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const expData = await expRes.json();

  const labels = expData.map(d => d.day);
  const values = expData.map(d => d.total);

  // 📈 Line Chart
  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Last 30 Days Expenses",
        data: values,
        fill: false
      }]
    }
  });
}

// auto load charts
if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
  loadCharts();
}




//income page
async function loadIncome() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/income", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const list = document.getElementById("incomeList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.source} - ₹${item.amount} 
      <button onclick="deleteIncome(${item.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}



//add income
async function addIncome() {
  const token = localStorage.getItem("token");

  const source = document.getElementById("source").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  const res = await fetch("http://localhost:5000/api/income", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ source, amount, date })
  });

  if (res.ok) {
    loadIncome(); // refresh list
  } else {
    alert("Error adding income");
  }
}



//delete income
async function deleteIncome(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/income/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadIncome();
}


//auto load income page
if (window.location.pathname.includes("income.html")) {
  loadIncome();
}





//expense page
async function loadExpense() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/expense", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.category} - ₹${item.amount}
      <button onclick="deleteExpense(${item.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}



//add expense
async function addExpense() {
  const token = localStorage.getItem("token");

  const category = document.getElementById("category").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  const res = await fetch("http://localhost:5000/api/expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ category, amount, date })
  });

  if (res.ok) {
    loadExpense();
  } else {
    alert("Error adding expense");
  }
}



//delete expense
async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/expense/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadExpense();
}

//auto load expense page
if (window.location.pathname.includes("expense.html")) {
  loadExpense();
}






// profile page
async function loadProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  document.getElementById("name").innerText = data.name;
  document.getElementById("email").innerText = data.email;
  document.getElementById("age").innerText = data.age;
  document.getElementById("phone").innerText = data.phone;
  document.getElementById("address").innerText = data.address;
}

// auto load profile page
if (window.location.pathname.includes("profile.html")) {
  loadProfile();
}





























///// CANCEL ALL THE NEW FEATURES TO USE PREVIOUS METHODS








/////////////////////
// // new features
//////////////////////


function loadPage(page) {
  if (page === "dashboard") loadDashboardUI();
  if (page === "income") loadIncomeUI();
  if (page === "expense") loadExpenseUI();
  if (page === "profile") loadProfileUI();
}

//default page
window.onload = () => {
  loadPage("dashboard");
};

















// // //protect routes
// // window.onload = () => {
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     window.location.href = "login.html";
// //   } else {
// //     loadPage("dashboard");
// //   }
// // };
































































