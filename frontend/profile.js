function loadProfileUI() {
  document.getElementById("content").innerHTML = `

    <div class="card profile-card">
      <div class="profile-header">
        <img src="image.avif" class="profile-img" />
        <h2 id="name">User Name</h2>
        <p id="email">user@email.com</p>
      </div>

      <div class="profile-details">
        <div class="detail">
          <span>Age</span>
          <strong id="age">--</strong>
        </div>

        <div class="detail">
          <span>Phone</span>
          <strong id="phone">--</strong>
        </div>

        <div class="detail">
          <span>Address</span>
          <strong id="address">--</strong>
        </div>
      </div>
    </div>

  `;

  loadProfileData();
}



// Load Profile Data
async function loadProfileData() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  document.getElementById("name").innerText = data.name;
  document.getElementById("email").innerText = data.email;
  document.getElementById("age").innerText = data.age || "--";
  document.getElementById("phone").innerText = data.phone || "--";
  document.getElementById("address").innerText = data.address || "--";

  // 👇 Also update sidebar name
  document.getElementById("userName").innerText = data.name;
}