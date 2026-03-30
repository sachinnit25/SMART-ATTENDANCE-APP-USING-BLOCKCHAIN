# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser:
   ```
   http://localhost:5173
   ```

> The app now uses `HashRouter`, so it should work reliably when reloading or opening routes directly.

## Deployment

This project can be deployed to any static-hosting service that supports Vite-built apps.

### Deploy to Vercel

1. Sign in to Vercel and create a new project from your repository.
2. Set the framework preset to `Vite`.
3. Use `npm install` for install command and `npm run build` for build command.
4. Set the publish directory to `dist`.

### Deploy to Netlify

1. Connect your repository to Netlify.
2. Set build command to:
   ```bash
   npm run build
   ```
3. Set publish directory to:
   ```
   dist
   ```

### Deploy to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using GitHub Pages or any static file host.

If you want, I can also add a GitHub Pages deploy script or a Netlify configuration file next.  

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
