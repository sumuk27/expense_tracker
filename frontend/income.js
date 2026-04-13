// 🔷 Load Income UI
function loadIncomeUI() {
  document.getElementById("content").innerHTML = `

    <!-- 🔷 Add Income Form -->
    <div class="card">
      <h3>Add Income</h3>

      <div class="form">
        <input type="text" id="source" placeholder="Income Source">
        <input type="number" id="amount" placeholder="Amount">
        <input type="date" id="date">

        <button onclick="addIncome()" class="btn">Add</button>
      </div>
    </div>

    <!-- 🔷 Chart -->
    <div class="card">
      <h3>Income Overview</h3>
      <canvas id="incomeChart"></canvas>
    </div>

    <!-- 🔷 Income List -->
    <div class="card">
      <h3>Income Sources</h3>
      <div id="incomeList"></div>
    </div>
  `;

  loadIncomeData();
}



// Load Income Data
async function loadIncomeData() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/income", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const container = document.getElementById("incomeList");
  container.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <span>
        ${item.source} <br>
        <small>${new Date(item.date).toDateString()}</small>
      </span>

      <div style="display:flex; gap:10px; align-items:center;">
        <span class="green">
          +₹${Number(item.amount).toLocaleString()}
        </span>
        <button onclick="deleteIncome(${item.id})" class="delete-btn">X</button>
      </div>
    `;

    container.appendChild(div);
  });

  loadIncomeChart(data);
}



//Add Income
async function addIncome() {
  const token = localStorage.getItem("token");

  const source = document.getElementById("source").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  if (!source || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("http://localhost:5000/api/income", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ source, amount, date })
  });

  if (res.ok) {
    loadIncomeUI(); // refresh UI
  } else {
    alert("Error adding income");
  }
}



//Delete Income
async function deleteIncome(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/income/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadIncomeData();
}



//Income Chart
function loadIncomeChart(data) {
  new Chart(document.getElementById("incomeChart"), {
    type: "bar",
    data: {
      labels: data.map(i => new Date(i.date).toLocaleDateString()),
      datasets: [{
        label: "Income",
        data: data.map(i => i.amount),
        backgroundColor: "#6C5CE7"
      }]
    }
  });
}