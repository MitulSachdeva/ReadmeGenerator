function loginWithGitHub() {
  window.location.href = "/auth/login";
}

async function fetchRepo() {
  const owner = document.getElementById("owner").value.trim();
  const repo = document.getElementById("repo").value.trim();

  if (!owner || !repo) {
    alert("Please enter both owner and repo");
    return;
  }

  try {
    const res = await fetch(`/repo?owner=${owner}&repo=${repo}`);
    const data = await res.json();

    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    alert("Error fetching repo data.");
  }
}

// Trigger README download
function downloadReadme() {
  const owner = document.getElementById("owner").value.trim();
  const repo = document.getElementById("repo").value.trim();

  if (!owner || !repo) {
    alert("Please enter both owner and repo");
    return;
  }

  window.location.href = `/readme?owner=${owner}&repo=${repo}`;
}

window.onload = () => {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("repo-section").style.display = "block";
};
