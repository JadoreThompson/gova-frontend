# Gova - AI-Powered Chat Moderation Platform

<p align="center">
  <img src="src/assets/logo_black.png" alt="Gova Logo" width="200"/>
</p>

**Build safer online communities with intelligent, automated moderation.**

Gova empowers community managers to deploy AI-powered moderators across Discord, Slack, YouTube, and other platforms. Define your community guidelines, configure automated enforcement actions, and let AI handle toxic behavior 24/7 - with full human oversight when needed.

---

## 🌟 Key Features

### 📋 Dynamic Policy Engine

Create nuanced, context-aware moderation guidelines tailored to your community's culture - far beyond simple keyword blocklists.

- **Custom Guidelines**: Define detailed moderation policies in plain language
- **Context-Aware Rules**: AI understands tone, intent, and community norms
- **Multi-Guideline Support**: Manage different policies for different communities


### 🤖 Intelligent AI Moderators

Deploy autonomous AI agents that enforce your guidelines across chat platforms with precision and consistency.

- **Multi-Platform Support**: Discord (live), Slack, YouTube, Telegram (coming soon)
- **Channel-Specific Deployment**: Choose exactly which channels to moderate
- **Real-Time Processing**: Instant message analysis and action execution
- **Configurable Actions**: Mute, ban, kick, or custom enforcement actions


### ⚖️ Approval Workflow System

Maintain human oversight with intelligent escalation for sensitive moderation decisions.

- **Manual Review Queue**: AI flags cases requiring human judgment
- **Action Proposals**: AI recommends actions with reasoning
- **One-Click Approval/Denial**: Review and execute actions instantly
- **Audit Trail**: Complete history of all moderation decisions


### 📊 Moderation Analytics

Track community health and AI performance with comprehensive insights.

- **Activity Metrics**: Monitor messages processed and actions taken
- **Performance Analytics**: Track AI accuracy and moderator activity
- **Trend Visualization**: Identify patterns in community behavior
- **Historical Data**: Long-term community health tracking


### 🔗 Seamless Platform Integration

Connect your community platforms quickly and securely with OAuth 2.0 authentication.

- **Discord Integration**: Full guild and channel access
- **Multi-Account Support**: Manage connections for multiple platforms
- **Secure Authentication**: OAuth 2.0 with encrypted credential storage
- **Easy Connection Management**: Connect or disconnect with one click


---

## 🛠️ Technology Stack

### Frontend Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite 7** - Lightning-fast build tool and HMR
- **React Router v7** - Modern client-side routing

### UI Components & Styling

- **Tailwind CSS v4** - Utility-first CSS with custom design system
- **Radix UI** - Accessible, unstyled component primitives
- **Lucide React** - Beautiful, consistent icon library
- **shadcn/ui** - High-quality, customizable component patterns
- **next-themes** - Seamless dark/light mode support

### State & Data Management

- **TanStack Query (React Query)** - Powerful server state management
- **Zustand** - Lightweight client state management
- **Orval** - Automatic API client generation from OpenAPI specs

### Visualization & Analytics

- **Recharts** - Responsive, composable chart library
- **Day.js** - Efficient date manipulation and formatting

### Developer Experience

- **ESLint 9** - Modern linting with flat config
- **Prettier** - Opinionated code formatting
- **TypeScript ESLint** - Type-aware linting rules

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- Access to the Gova backend API
- Discord Bot Token (for Discord integration)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/gova-frontend.git
cd gova-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DISCORD_BOT_URL=https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID
```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Docker Deployment

**Development:**

```bash
docker-compose -f docker/dev-compose.yaml up
```

**Production:**

```bash
docker-compose -f docker/prod-compose.yaml up
```

---

## 🔌 API Integration

The frontend communicates with the Gova backend API using automatically generated TypeScript clients and React Query hooks.

### Generate API Client

```bash
npm run orval:openapi
```

This generates TypeScript types and React Query hooks in [`src/openapi.ts`](src/openapi.ts) based on the backend's OpenAPI specification.

### API Hooks Examples

```typescript
// Fetch all moderators
const { data: moderators } = useModeratorsQuery({ page: 1 });

// Create a new guideline
const createGuideline = useCreateGuidelineMutation();
createGuideline.mutate({ name: "Community Rules", text: "..." });

// Deploy a moderator
const createModerator = useCreateModeratorMutation();
createModerator.mutate({
  name: "Discord Moderator",
  guideline_id: "...",
  platform: MessagePlatformType.discord,
  conf: { ... }
});

// Approve a moderation action
const approveAction = useApproveActionMutation();
approveAction.mutate({ log_id: "..." });
```

---

## 📱 Core User Flows

### 1. Creating a Guideline

1. Navigate to **Guidelines** → **Create Guideline**
2. Enter guideline name and description
3. Define your community rules and moderation policies
4. Save the guideline for use with moderators

### 2. Connecting Platforms

1. Go to **Connections**
2. Click **Connect** on your desired platform (Discord, Slack, etc.)
3. Authorize the OAuth connection
4. Platform is now ready for moderator deployment

### 3. Deploying a Moderator

1. Navigate to **Moderators** → **Create Moderator**
2. Select a guideline to enforce
3. Choose the platform (Discord, Slack, etc.)
4. Select the server/workspace
5. Choose specific channels to moderate
6. Configure allowed actions (mute, ban, kick)
7. Set approval requirements for sensitive actions
8. Name your moderator and deploy

### 4. Managing Moderation Actions

1. View the **Approval Queue** from any moderator page
2. Review flagged messages and AI-proposed actions
3. Approve or decline actions with a single click
4. Monitor the action history and analytics


---

## 🎨 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run orval:openapi` - Generate API client from OpenAPI spec

---

## 🔒 Security Features

- **OAuth 2.0 Authentication** - Secure platform connections
- **Encrypted Credentials** - Platform tokens stored securely
- **HTTPS Only** - All API communication over secure connections
- **Human Oversight** - Manual approval workflow for sensitive actions
- **Audit Logging** - Complete history of all moderation decisions

---

## 🌐 Supported Platforms

| Platform | Status         | Features                                   |
| -------- | -------------- | ------------------------------------------ |
| Discord  | ✅ Live        | Full integration, OAuth, channel selection |
| Slack    | 🚧 Coming Soon | Workspace integration planned              |
| Telegram | 🚧 Coming Soon | Group chat moderation planned              |
| YouTube  | 🚧 Coming Soon | Comment moderation planned                 |

---

## 📄 License

This project is proprietary software. All rights reserved.