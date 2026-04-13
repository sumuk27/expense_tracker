// 🔷 Load Expense UI
function loadExpenseUI() {
  document.getElementById("content").innerHTML = `

    <!-- 🔷 Add Expense Form -->
    <div class="card">
      <h3>Add Expense</h3>

      <div class="form">
        <input type="text" id="category" placeholder="Category">
        <input type="number" id="amount" placeholder="Amount">
        <input type="date" id="date">

        <button onclick="addExpense()" class="btn">Add</button>
      </div>
    </div>

    <!-- 🔷 Chart -->
    <div class="card">
      <h3>Expense Overview</h3>
      <canvas id="expenseChart"></canvas>
    </div>

    <!-- 🔷 Expense List -->
    <div class="card">
      <h3>Recent Expenses</h3>
      <div id="expenseList"></div>
    </div>
  `;

  loadExpenseData();
}


//Load Expense Data
async function loadExpenseData() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/expense", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const container = document.getElementById("expenseList");
  container.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <span>
        ${item.category} <br>
        <small>${new Date(item.date).toDateString()}</small>
      </span>

      <div style="display:flex; gap:10px; align-items:center;">
        <span class="red">
          -₹${Number(item.amount).toLocaleString()}
        </span>
        <button onclick="deleteExpense(${item.id})" class="delete-btn">X</button>
      </div>
    `;

    container.appendChild(div);
  });

  loadExpenseChart(data);
}



//Add Expense
async function addExpense() {
  const token = localStorage.getItem("token");

  const category = document.getElementById("category").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  if (!category || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("http://localhost:5000/api/expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ category, amount, date })
  });

  if (res.ok) {
    loadExpenseUI(); // refresh UI
  } else {
    alert("Error adding expense");
  }
}


//Delete Expense
async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/expense/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadExpenseData();
}



// 📊 Expense Chart
function loadExpenseChart(data) {
  new Chart(document.getElementById("expenseChart"), {
    type: "line",
    data: {
      labels: data.map(e => new Date(e.date).toLocaleDateString()),
      datasets: [{
        label: "Expenses",
        data: data.map(e => e.amount),
        borderColor: "#FF4D4D",
        fill: false
      }]
    }
  });
}