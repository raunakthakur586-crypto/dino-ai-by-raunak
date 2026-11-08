# Dino AI by Raunak

A mobile-friendly multilingual AI chat website using Gemini through a Netlify Function.

## Files
- `index.html` — chat interface
- `netlify/functions/chat.mjs` — secure server-side Gemini API request
- `netlify.toml` — Netlify build configuration

## Setup
1. Create a Gemini API key in Google AI Studio.
2. Create a GitHub repository and upload the contents of this folder (not the outer ZIP).
3. In Netlify, import that GitHub repository as a new site.
4. In Netlify site settings, add an environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key
   Give it permission for Functions, then redeploy.
5. Open your deployed Netlify site and test Dino AI.

## Important
- Never paste your API key into `index.html`, public JavaScript, GitHub, or a chat.
- API usage may have free-tier limits and can change. Check your Google AI Studio quota and billing settings.
- The website can reply in many languages, but no AI can guarantee perfect understanding of every language.
- This starter project does not include accounts, permanent chat history, voice, or a Play Store Android package yet.
