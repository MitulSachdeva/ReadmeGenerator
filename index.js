require("dotenv").config();
const express = require("express");
const axios = require("axios");
const session = require("express-session");
const path = require("path");

const { getRepoData } = require("./github");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(
  session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  })
);

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateSection(prompt) {
  if (!GEMINI_API_KEY) return "- To be added";

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "- To be added"
    );
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    return "- To be added";
  }
}

async function generateReadme(repoData) {
  const description =
    repoData.description ||
    (await generateSection(`Write a professional description for ${repoData.name}`));

  const features =
    (await generateSection(`List 5 main features of ${repoData.name}`)) ||
    "- To be added";

  const installation =
    (await generateSection(`Write installation instructions for ${repoData.name}`)) ||
    "- To be added";

  const projectStructure =
    (await generateSection(`Describe the typical project structure of ${repoData.name}`)) ||
    "- To be added";

  const techStack = repoData.language || "- To be added";
  const license = repoData.license || "No license";

  const badges = `
![Stars](https://img.shields.io/github/stars/${repoData.owner}/${repoData.name}.svg)
![Forks](https://img.shields.io/github/forks/${repoData.owner}/${repoData.name}.svg)
![License](https://img.shields.io/github/license/${repoData.owner}/${repoData.name}.svg)
`;

  const toc = `
## Table of Contents
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Repo Stats](#repo-stats)
- [License](#license)
`;

  return `
# ${repoData.name}

${badges}

${toc}

## Description
${description}

## Features
${features}

## Installation
${installation}

## Tech Stack
${techStack}

## Project Structure
${projectStructure}

## Repo Stats
- ⭐ Stars: ${repoData.stars}
- 🍴 Forks: ${repoData.forks}
- 📝 Language: ${repoData.language || "Not specified"}
- 🔗 [View on GitHub](${repoData.url})

## License
${license}
  `.trim();
}

app.get("/auth/login", (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
  res.redirect(redirectUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenResp = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    req.session.githubToken = tokenResp.data.access_token;
    res.redirect("/?loggedIn=true");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
});

app.get("/repo", async (req, res) => {
  const { owner, repo } = req.query;
  const token = req.session.githubToken || null;

  if (!owner || !repo) {
    return res.status(400).json({ error: "Provide owner and repo" });
  }

  try {
    const repoData = await getRepoData(owner, repo, token);

    repoData.owner = owner;

    res.json(repoData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/readme", async (req, res) => {
  const { owner, repo } = req.query;
  const token = req.session.githubToken || null;

  if (!owner || !repo) {
    return res.status(400).json({ error: "Provide owner and repo" });
  }

  try {
    const repoData = await getRepoData(owner, repo, token);

    repoData.owner = owner;

    const readme = await generateReadme(repoData);

    res.setHeader("Content-Disposition", "attachment; filename=README.md");
    res.setHeader("Content-Type", "text/markdown");
    res.send(readme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
