# Kudo Platform Frontend

A modern, responsive, and beautiful peer-to-peer recognition dashboard built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Live Kudos Feed**: Real-time updates of peer appreciation across the organization.
- **Peer Recognition**: Intuitive UI for sending kudos with points and descriptions.
- **Interactive Dashboard**: Track your giving budget and earned points at a glance.
- **Reward Catalog**: Browse and redeem rewards with a seamless grid interface.
- **Activity Notifications**: Persistent notification center for reactions and comments.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler.io/icons)
- **Real-time**: [Socket.io Client](https://socket.io/docs/v4/client-api/)

---

## 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)

---

## Demo

- [Demo](https://kudo.coursity.io.vn/)

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd amanotes-fe
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env # If available, otherwise create it
```
Required variables:
```bash
# The full URL of your Kudo Backend API
VITE_API_URL=http://localhost:3000
```

### 3. Running the App
```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗 Docker Deployment

To build and run the frontend using Docker (with Nginx):
```bash
# Build the image with the API URL baked in
docker build -t kudo-frontend --build-arg VITE_API_URL=https://api.yourdomain.com .

# Run the container
docker run -p 80:80 kudo-frontend
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (outputs to `/dist`) |
| `npm run lint` | Run ESLint to check for code quality |
| `npm run preview` | Locally preview the production build |

---

## 📂 Project Structure

- `/src/apis`: API client definitions using Axios.
- `/src/components`: Reusable UI components (Shadcn + custom).
- `/src/contexts`: React Contexts for Auth, User Data, and WebSockets.
- `/src/hooks`: Custom hooks for data fetching (React Query) and utility logic.
- `/src/pages`: Main application views (Home, SignIn, etc.).
- `/src/types`: TypeScript interfaces and types.

---

## 📄 License
This project is [UNLICENSED](LICENSE).
