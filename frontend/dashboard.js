function loadDashboardUI() {
  document.getElementById("content").innerHTML = `
    
    <!-- 🔷 Top Cards -->
    <div class="grid">
      <div class="card">
        <h4>Total Balance</h4>
        <h2 id="balance">₹0</h2>
      </div>

      <div class="card">
        <h4>Total Income</h4>
        <h2 id="income">₹0</h2>
      </div>

      <div class="card">
        <h4>Total Expense</h4>
        <h2 id="expense">₹0</h2>
      </div>
    </div>

    <!-- 🔷 Middle Section -->
    <div class="grid">

      <!-- Transactions -->
      <div class="card" style="flex:1">
        <h3>Recent Transactions</h3>
        <div id="transactions"></div>
      </div>

      <!-- Pie Chart -->
      <div class="card" style="flex:1">
        <h3>Financial Overview</h3>
        <canvas id="pieChart"></canvas>
      </div>

    </div>

    <!-- 🔷 Bottom Chart -->
    <div class="card">
      <h3>Last 30 Days Expenses</h3>
      <canvas id="lineChart"></canvas>
    </div>
  `;

  loadDashboardData();
}


//data logic
async function loadDashboardData() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  // Update cards
  document.getElementById("balance").innerText =
    "₹" + Number(data.balance).toLocaleString();

  document.getElementById("income").innerText =
    "₹" + Number(data.totalIncome).toLocaleString();

  document.getElementById("expense").innerText =
    "₹" + Number(data.totalExpense).toLocaleString();

  // Transactions
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  data.recentTransactions.forEach(t => {
    const div = document.createElement("div");

    const color = t.type === "income" ? "green" : "red";
    const sign = t.type === "income" ? "+" : "-";

    div.className = "item";
    div.innerHTML = `
      <span>${t.title}</span>
      <span class="${color}">
        ${sign}₹${Number(t.amount).toLocaleString()}
      </span>
    `;

    container.appendChild(div);
  });

  loadCharts();
}




//charts
async function loadCharts() {
  const token = localStorage.getItem("token");

  // Pie
  const dashRes = await fetch("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const dashData = await dashRes.json();

  new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [dashData.totalIncome, dashData.totalExpense],
        backgroundColor: ["#6C5CE7", "#FF4D4D"]
      }]
    }
  });

  // Line
  const expRes = await fetch("http://localhost:5000/api/charts/expense", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const expData = await expRes.json();

  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: expData.map(d => d.day),
      datasets: [{
        label: "Expenses",
        data: expData.map(d => d.total),
        borderColor: "#6C5CE7",
        fill: false
      }]
    }
  });
}