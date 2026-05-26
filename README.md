# Eid ul Azha Greeting Backend

This backend allows your Eid greeting page to create short, shareable links that work across devices and browsers.

## Files

- `eid-ul-azha.html` — Your greeting page.
- `eid-ul-azha.html` — Your greeting page.
- `netlify.toml` — Netlify configuration for static publish and function routing.
- `netlify/functions/greetings.js` — Netlify serverless function backend.
- `greetings.json` — Simple storage for generated greetings.
- `package.json` — Optional Node package definition for local use.

## Run locally with Netlify

1. Install Netlify CLI if you want local serverless function preview:
   - `npm install -g netlify-cli`
2. Open a terminal in `C:\Users\saifu\Downloads`
3. Run `netlify dev`
4. Open `http://localhost:8888` in your browser

## How it works

- When a greeting is created, the page POSTs the message data to `/.netlify/functions/greetings`.
- The Netlify function stores the details and returns a short ID.
- The app creates a clean link like `https://your-site.netlify.app/?id=ABC123`.
- When the link is opened, the page fetches `/.netlify/functions/greetings?id=ABC123` and shows the personalized greeting.

## Deploying worldwide on Netlify

1. Push the folder to your Git provider (GitHub, GitLab, Bitbucket).
2. Connect the repo in Netlify and deploy.
3. Netlify will host the HTML page and the serverless function automatically.

> Note: This example uses a JSON file for demo storage. For reliable production persistence across all Netlify function instances, use a real backend database such as Supabase, Firebase, or another hosted datastore.
