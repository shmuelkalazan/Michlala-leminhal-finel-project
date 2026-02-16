# Michlala Leminhal

## Environment (one place)

All environment variables live in **one file at the project root**: `.env`

- Copy `.env.example` to `.env` and fill in your values.
- Do not commit `.env` (it is in `.gitignore`).
- The `dev` command copies `.env` to the client so Vite can read it; the server reads from the root `.env` directly.

## Run the project

From the project root:

```bash
# Install dependencies (first time only)
npm install
npm install --prefix client
npm install --prefix server

# Run both client and server (one command)
npm run dev
```

This will start the API server and the Vite dev client. Use `npm run build` to build for production.
