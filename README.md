# Brewly

Brewly is a coffee-themed timer web app for focus sessions and custom brew intervals. It includes animated 3D coffee visuals, completion feedback, day/night themes, ambient audio controls, and Progressive Web App (PWA) support.

## Features

- Start a 25-minute Pomodoro focus session or choose a custom brew duration.
- Pause, resume, reset, and cancel timers.
- See timer progress and completion actions.
- Restore an active or paused timer after reloading the page.
- Use the timer when offline after the app has loaded and its service worker has cached the app.
- Toggle day/night themes and optional ambient café audio.
- Use keyboard-operable controls with accessible labels and visible focus states.
- Install Brewly on supported browsers and devices.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

Install dependencies:

```sh
npm install
```

Start the Vite development server:

```sh
npm run dev
```

Open the URL shown in the terminal (the project defaults to `http://localhost:3000`).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for preview. |
| `node --test src/utils/timerState.test.js` | Run timer-state unit tests. |

To preview a production build:

```sh
npm run build
npm run preview
```

## Deployment

Run `npm run build` and deploy the contents of `dist/` to a static web host. Configure the host to serve `index.html` for application routes and serve `public/manifest.json` and `public/sw.js` from the site root.

## Firebase configuration

The app includes Firebase Authentication and Firestore integration for optional account and focus-stat features. The current values in `src/firebase.js` are placeholders. Replace them with configuration from your Firebase project and enable the Firebase services you use before expecting sign-in or cloud statistics to work.

Do not commit private credentials or secrets to the repository.

## Project structure

```text
src/
  components/       React screens and UI components
  utils/
    timerState.js   Shared timer lifecycle, formatting, and local recovery helpers
public/
  manifest.json     PWA metadata
  sw.js             Service worker and cache behavior
specs/
  001-brew-timer/   Feature specification and implementation documentation
```
