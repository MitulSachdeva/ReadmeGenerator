# README Generator

An AI-powered web application that automatically generates professional README.md files for GitHub repositories. The application supports both public and private repositories, fetches repository metadata using the GitHub API, and leverages Google's Gemini AI to generate structured documentation sections.

## 🌐 Live Demo

**Live Application:** https://readmegenerator-production.up.railway.app/

## ✨ Features

* 🔓 Generate README files for public GitHub repositories without authentication
* 🔒 Access private repositories securely through GitHub OAuth
* 🤖 AI-generated documentation powered by Google Gemini
* 📝 Automatic generation of:

  * Project Description
  * Features
  * Installation Instructions
  * Tech Stack
  * Project Structure
* 📊 Auto-generated GitHub badges for stars, forks, and license
* 📥 One-click README.md download
* ⚡ Fast and simple user interface

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* Express Session

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### APIs & Services

* GitHub REST API
* Google Gemini API

### Authentication

* GitHub OAuth 2.0

## 🏗 Architecture

```text
User Input
    │
    ▼
GitHub Repository
    │
    ▼
GitHub API
    │
    ▼
Repository Metadata
    │
    ▼
Gemini API
    │
    ▼
Generated README
    │
    ▼
Download README.md
```

## 🚀 Getting Started

### Prerequisites

* Node.js
* GitHub OAuth Application
* Gemini API Key

### Installation

```bash
git clone https://github.com/MitulSachdeva/ReadmeGenerator.git
cd ReadmeGenerator
npm install
```

### Environment Variables

Create a `.env` file:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/callback
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
```

### Run Locally

```bash
npm start
```

## 📸 Screenshots

Add screenshots of:

* Home Page
* GitHub Login Flow
* Generated README Output

## 🔮 Future Improvements

* Repository structure analysis
* Smarter README generation using source code context
* Multiple README templates
* README preview editor
* Support for additional AI providers

## 📄 License

This project is available under the MIT License.
