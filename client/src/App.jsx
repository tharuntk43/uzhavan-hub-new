import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AddPlotModal from './components/AddPlotModal.jsx';
import { CheckCircle, AlertCircle } from './components/icons/LucideIcons.jsx';

// 1. First Screen — Farmer Login (matching uploaded reference image)
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';

// 2. Simple Farmer Dashboard
import DashboardPage from './pages/DashboardPage.jsx';

// 3. The 10 Main Feature Modules
import DecisionEnginePage from './pages/DecisionEnginePage.jsx'; // Module 01: Crop Planning & Guidance
import CropDoctorPage from './pages/CropDoctorPage.jsx';         // Module 02: AI Crop Doctor
import WeatherPage from './pages/WeatherPage.jsx';               // Module 03: Weather & Alerts
import MarketPricesPage from './pages/MarketPricesPage.jsx';     // Module 04: Market Prices & Selling
import GovernmentSchemesPage from './pages/GovernmentSchemesPage.jsx'; // Module 05: Govt Schemes & Subsidies
import AgriculturalLoansPage from './pages/AgriculturalLoansPage.jsx'; // Module 06: Farm Finance & Profit
import CommunityPage from './pages/CommunityPage.jsx';           // Module 07: Community & Expert Support
import MachineryRentalPage from './pages/MachineryRentalPage.jsx'; // Module 08: Equipment & Resource Sharing
import VeterinaryPage from './pages/VeterinaryPage.jsx';         // Module 09: Livestock & Allied (1962 Care)
import ActionPlanPage from './pages/ActionPlanPage.jsx';         // Module 10: Farm Management & Tasks

function MainApp() {
  const { user, toast, showToast, addPlotToState } = useAuth();
  
  // By default, if user is not authenticated, show 'login' screen first!
  const [currentTab, setCurrentTab] = useState(user ? 'dashboard' : 'login');
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);

  // If user state changes, update tab accordingly
  React.useEffect(() => {
    if (user && (currentTab === 'login' || currentTab === 'register')) {
      setCurrentTab('dashboard');
    } else if (!user && currentTab !== 'register') {
      setCurrentTab('login');
    }
  }, [user]);

  const handlePlotAdded = (newPlot) => {
    addPlotToState && addPlotToState(newPlot);
    showToast('New farmland plot registered successfully!', 'success');
  };

  // Render the selected view among the 10 Main Modules
  const renderActiveModule = () => {
    switch (currentTab) {
      // Simple Farmer Dashboard
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddPlot={() => setIsAddPlotOpen(true)}
          />
        );

      // Module 01 — Crop Planning and Farming Guidance
      case 'crop_planning':
        return <DecisionEnginePage onOpenAddPlot={() => setIsAddPlotOpen(true)} />;

      // Module 02 — AI Crop Doctor
      case 'crop_doctor':
        return <CropDoctorPage />;

      // Module 03 — Weather and Alerts
      case 'weather':
        return <WeatherPage />;

      // Module 04 — Market Prices and Selling
      case 'market_prices':
        return <MarketPricesPage />;

      // Module 05 — Government Schemes and Insurance
      case 'government_schemes':
        return <GovernmentSchemesPage />;

      // Module 06 — Farm Finance and Profit
      case 'farm_finance':
        return <AgriculturalLoansPage />;

      // Module 07 — Farmer Community and Expert Support
      case 'community':
        return <CommunityPage />;

      // Module 08 — Equipment and Resource Sharing
      case 'equipment_sharing':
        return <MachineryRentalPage />;

      // Module 09 — Livestock and Allied Farming (1962)
      case 'livestock':
        return <VeterinaryPage />;

      // Module 10 — Farm Management
      case 'farm_management':
        return <ActionPlanPage onOpenAddPlot={() => setIsAddPlotOpen(true)} />;

      default:
        return (
          <DashboardPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddPlot={() => setIsAddPlotOpen(true)}
          />
        );
    }
  };

  // If farmer is not logged in, show the Login or Registration screen
  if (!user) {
    if (currentTab === 'register') {
      return (
        <RegistrationPage
          onSuccess={() => setCurrentTab('dashboard')}
          onCancel={() => setCurrentTab('login')}
          onSwitchToLogin={() => setCurrentTab('login')}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={() => setCurrentTab('dashboard')}
        onSwitchToRegister={() => setCurrentTab('register')}
      />
    );
  }

  // Once authenticated, show clean Simple Farmer Dashboard wrapped in AppLayout
  return (
    <>
      <AppLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddPlot={() => setIsAddPlotOpen(true)}
      >
        {renderActiveModule()}
      </AppLayout>

      {/* Add Farmland Plot Modal */}
      <AddPlotModal
        isOpen={isAddPlotOpen}
        onClose={() => setIsAddPlotOpen(false)}
        onPlotAdded={handlePlotAdded}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0e3820] text-white shadow-2xl text-xs font-semibold border border-emerald-600/40 animate-bounce">
          {toast.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-400" />
          ) : (
            <CheckCircle size={16} className="text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
