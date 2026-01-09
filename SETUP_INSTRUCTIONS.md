# Amadeus API Setup Instructions

## Quick Setup

The error you're seeing (`"Missing API key/secret in .env.local"`) is normal if you haven't configured API credentials yet.

### Option 1: Use Mock Data (Recommended for Development)

The app will automatically use mock data if API credentials are not configured. You can test the entire UI without setting up Amadeus API.

**No action needed** - just use the app normally. Mock flight data will be displayed.

### Option 2: Set Up Real Amadeus API (Optional)

If you want to use real flight data:

1. **Get Amadeus API Credentials:**
   - Go to https://developers.amadeus.com/
   - Sign up for a free account
   - Create a new app
   - Copy your API Key and API Secret

2. **Create `.env.local` file:**
   
   In the root directory of your project (same level as `package.json`), create a file named `.env.local`:
   
   ```env
   AMADEUS_API_KEY=your_api_key_here
   AMADEUS_API_SECRET=your_api_secret_here
   AMADEUS_BASE_URL=https://test.api.amadeus.com
   ```
   
   Replace `your_api_key_here` and `your_api_secret_here` with your actual credentials.

3. **Restart the Development Server:**
   
   Stop your current server (Ctrl+C) and restart it:
   ```bash
   npm run dev
   ```
   
   ⚠️ **Important:** Environment variables are only loaded when the server starts. You MUST restart after creating/editing `.env.local`.

4. **Test the Token Endpoint:**
   
   Open in browser: `http://localhost:3000/api/amadeus/token`
   
   If configured correctly, you'll see JSON with an `access_token`.
   If still missing, you'll see the error message (check your `.env.local` file location and variable names).

## Troubleshooting

### Error: "Missing API key/secret in .env.local"

- ✅ Make sure `.env.local` exists in the project root (not in a subfolder)
- ✅ Make sure variable names are exactly: `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` (no `NEXT_PUBLIC_` prefix!)
- ✅ Make sure you restarted the dev server after creating/editing `.env.local`
- ✅ Make sure there are no spaces around the `=` sign
- ✅ Make sure the file is named exactly `.env.local` (not `.env` or `env.local`)

### File Location

Your project structure should look like:
```
your-project/
├── .env.local          ← Create this file here
├── package.json
├── app/
├── components/
└── ...
```

### Example `.env.local` Content

```env
AMADEUS_API_KEY=abc123xyz456
AMADEUS_API_SECRET=def789uvw012
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

## Using Mock Data (No Setup Required)

If you don't want to set up Amadeus API right now, the app will automatically use mock data. You can:

- Test all UI features
- See flight search results
- Test filters and sorting
- See detailed flight information

All without any API credentials!


