const axios = require("axios");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateSection(prompt) {
  if (!GEMINI_API_KEY) return "Gemini API key not provided. Add your key in .env.";

  try {
    const response = await axios.post(
      "https://gemini.googleapis.com/v1/models/text-bison-001:generateText",
      {
        prompt,
        temperature: 0.7,
        maxOutputTokens: 400,
      },
      { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
    );
    return response.data.candidates[0].content;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return "Content could not be generated";
  }
}

async function formatAsBulletPoints(text) {
  if (!text) return "";
  return text
    .split(/\r?\n|,|;/)
    .map(line => line.trim())
    .filter(line => line.length)
    .map(line => `- ${line}`)
    .join("\n");
}

async function generateReadme(repoData) {
  const description =
    repoData.description ||
    (await generateSection(`Write a professional description for the GitHub repo named ${repoData.name}.`));

  const featuresRaw = await generateSection(
    `List 5 main features of the GitHub repo named ${repoData.name}.`
  );
  const features = await formatAsBulletPoints(featuresRaw);

  const installationRaw = await generateSection(
    `Write installation instructions for the GitHub repo named ${repoData.name}.`
  );
  const installation = await formatAsBulletPoints(installationRaw);

  const projectStructureRaw = await generateSection(
    `Describe the typical project structure of the GitHub repo named ${repoData.name}.`
  );
  const projectStructure = await formatAsBulletPoints(projectStructureRaw);

  const techStackRaw =
    repoData.language ||
    (await generateSection(
      `Identify the main technologies used in the GitHub repo named ${repoData.name}.`
    ));
  const techStack = await formatAsBulletPoints(techStackRaw);

  const license = repoData.license || "No license";

  return `
# ${repoData.name}

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

module.exports = { generateReadme };
