A web application that automatically generates a professional README.md file for any public or private GitHub repository.
It fetches repository metadata via GitHub API and enriches the content using Google Gemini API to generate sections like description, features, and installation steps.

✨ Features

🔓 Fetch metadata from public repositories (no login required)

🔒 Support for private repositories via GitHub OAuth login

🤖 AI-powered sections (description, features, installation, project structure) using Gemini API

📊 Auto-generated badges for stars, forks, and license

📥 One-click download of generated README.md file

🛠 Tech Stack

Backend: Node.js, Express.js

Frontend: HTML, CSS, Vanilla JavaScript

APIs: GitHub API, Google Gemini API

Auth: GitHub OAuth (for private repos)

Session Management: express-session
