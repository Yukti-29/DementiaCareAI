# DementiaCareAI – Hackathon Version

An AI-assisted dementia care and memory-support application focused on patient engagement,
caregiver support, memory activities, conversational assistance, multilingual interaction,
and caregiver insights.

## Repository structure

```text
.
├── frontend/          # React + Vite + TypeScript application
├── python-backend/    # Flask + Python AI/caregiver services
├── .env.example
├── .gitignore
└── README.md
```

## Frontend setup

```bash
cd frontend
npm install
```

Create the environment file:

```bash
copy ..\.env.example .env
```

Then configure the required values and run:

```bash
npm run dev
```

The frontend package includes the Vite/Express development server and Gemini integration.

## Python backend setup

From the repository root:

```bash
cd python-backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your Gemini API key in an environment file before using Gemini-dependent features.

## Important security note

Never commit real API keys, passwords, Supabase secrets, or other credentials.
Use `.env` locally and keep it out of Git.

## Hackathon adaptation

This repository is a hackathon-ready adaptation of an earlier DementiaCareAI project.
The current submission should only include features and code that the current team is
authorized to reuse and modify.

Before submission, update:
- project screenshots
- current team details
- problem statement
- USP/differentiators
- pricing/business model
- memory-game improvements
- deployment URL
- final GitHub repository URL

## Suggested submission checklist

- [ ] `npm install` works in `frontend/`
- [ ] `npm run build` succeeds
- [ ] Gemini/API secrets are stored only in environment variables
- [ ] No `.env` or API key is committed
- [ ] README contains the current project description
- [ ] PPT contains the final GitHub URL
- [ ] Demo URL is working
- [ ] Current hackathon team and contribution details are accurate
