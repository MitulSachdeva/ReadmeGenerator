const axios = require("axios");

async function getRepoData(owner, repo, token) {
  try {
    const headers = {
      "User-Agent": "readme-generator",
      ...(token ? { Authorization: `token ${token}` } : {}),
      "Accept": "application/vnd.github.v3+json"
    };

    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });

    return {
      owner: data.owner.login,      
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      url: data.html_url,
      license: data.license ? data.license.name : "No license",
    };
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Failed to fetch repo data. Check repo name or token.");
  }
}

module.exports = { getRepoData };
