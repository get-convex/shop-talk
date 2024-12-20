# Shop Talk

A real-time collaborative shopping list application that demonstrates the integration of voice capabilities using [daily-bots](dailybots.ai) and [Convex](https://convex.dev/) backend.

## Features

- Real-time collaborative shopping lists
- Voice interaction capabilities powered by daily-bots
- Real-time data synchronization using Convex
- Modern UI built with React and Tailwind CSS

## Development

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
# In one terminal
bun run dev

# In another terminal
bun run dev:convex
```

3. Setup your Convex environment variables
```bash
bun convex env set DAILY_BOTS_KEY {YOUR_KEY}
bun convex env set OPENAI_API_KEY {YOUR_KEY}
```

4. Setup your `.env.local`. Checkout `example.env.local` for what local vars Vite expects

5. Open your browser and navigate to the local development server (typically http://localhost:5173)

## Layout

The project is structured with:
- `/src` - React frontend code
- `/convex` - Convex backend functions
- `/src/voiceManagement` - Voice integration features
- `/src/shoppingLists` - Shopping list related components and logic