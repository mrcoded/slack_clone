# Slack Clone: Real-Time Workspace Platform

This is a Next.js and TypeScript-based real-time communication platform built to mirror the core functionality of Slack. It focuses on multi-tenancy, instant data synchronization, and complex UI layouts using convex to handle the backend.

## Getting Started

To get started with the Slack Clone, follow these steps:

1. Clone the repository: `git clone [https://github.com/mrcoded/slack_clone.git](https://github.com/mrcoded/slack_clone.git)`
2. Install dependencies: `npm install` or `yarn install`
3. Create a `.env` file in the root directory and add the following environment variables:

# Convex Backend (Required) & Authentication (Convex Auth)

NEXT_PUBLIC_CONVEX_URL="https://your-deployment-name.convex.cloud"
CONVEX_DEPLOYMENT="dev:your-deployment-name"

# Site URL (For Webhooks and Auth Redirects)

CONVEX_SITE_URL="https://your-deployment-name.convex.site"

4. Start the Convex Backend:
   In one terminal, run: npx convex dev

5. Run the development server: In a second terminal, run: npm run dev

6. Open http://localhost:3000 to view your workspace.

## Features

- **Multi-Tenant Workspaces**: Create unique workspaces with private invite codes and member management.

- **Real-Time Messaging**: Instant chat functionality powered by Convex WebSockets—zero latency, no polling.

- **Threaded Replies**: Keep conversations organized with message threading.

- **Channel Architecture**: Create channels within each workspace.

- **Rich UI Components**: Resizable sidebars, emoji reactions, and image uploads in messages and thread replies.

- **URL-Driven State**: Navigation and modal states are synced with the URL using nuqs for better shareability.

## Usage

Here are some tips for using the Slack Clone:

- **Creating a Workspace**: Click the "+" icon in the workspace sidebar to initialize a new organization.

- **Joining via Invite**: Use a unique 6-digit invite code to join an existing workspace.

- **Add Reactions to messages**: Hover on messages to use the emoji icon to add an emoji to a message.

- **Managing Panels**: Hover over the edges of the sidebar to drag and resize the layout to your preference.

- **Real-time Sync**: Open the app in two different browsers; notice how messages appear instantly across both without refreshing.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
