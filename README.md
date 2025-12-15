# Clinical Cosmos - Data Manager Tool

A comprehensive clinical trial data management platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Study Management**: Manage clinical trials and study configurations
- **Data Integration**: Connect and sync data from EDC systems, labs, and other sources
- **AI-Powered Tools**: 
  - Data Manager.AI for automated data quality checks
  - Central Monitor.AI for real-time monitoring
  - Signal Detection for safety monitoring
- **Task Management**: Track and manage study-related tasks
- **Risk Profiles**: Monitor and analyze risk across trials, sites, and resources
- **Analytics & Reporting**: Comprehensive dashboards and data visualization
- **Notifications**: Real-time alerts and notifications system
- **Administration**: User management, roles, permissions, and system configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## 🛠️ Installation

1. **Clone the repository** (or download the ZIP file):
```bash
git clone https://github.com/Ruthravarshan/Data-Manager-Tool.git
cd Data-Manager-Tool
```

2. **Navigate to the application directory**:
```bash
cd clinical-cosmos-app
```

3. **Install dependencies**:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run dev
```

The application will start at `http://localhost:5173/`

### Production Build

To create an optimized production build:

```bash
npm run build
```

The build files will be generated in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
clinical-cosmos-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── StudyManagement.tsx
│   │   ├── DataIntegration.tsx
│   │   ├── DataManagerAI.tsx
│   │   ├── CentralMonitorAI.tsx
│   │   ├── SignalDetection.tsx
│   │   ├── Tasks.tsx
│   │   ├── RiskProfiles.tsx
│   │   ├── Analytics.tsx
│   │   ├── Notifications.tsx
│   │   └── Admin.tsx
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## 🎨 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Utilities**: clsx, tailwind-merge

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Accessing the Application

Once the development server is running:

1. Open your browser and navigate to `http://localhost:5173/`
2. The dashboard will load automatically
3. Use the sidebar navigation to access different modules:
   - Dashboard
   - Study Management
   - Data Integration
   - Trial Data Management
   - Data Manager.AI
   - Central Monitor.AI
   - Signal Detection
   - Tasks
   - Risk Profiles
   - Analytics
   - Notifications
   - Admin

## 👥 Default Users (Demo)

The application includes sample user data for demonstration:
- **System Administrator**: madhu
- **Medical Monitor**: nivaasgd
- Additional users visible in the Admin panel

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Ensure you're using the correct Node.js version
node --version  # Should be v16 or higher

# Try rebuilding
npm run build
```

## 📝 Notes

- This is a demo application with sample data
- All data displayed is for demonstration purposes
- The application runs entirely in the browser (no backend required)
- Interactive features include tab navigation, filtering, and data visualization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Built with ❤️ for Clinical Research Teams**
