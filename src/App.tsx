import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServiceProviderProvider } from './context/ServiceProviderContext';
import { YieldSurveyProvider } from './context/YieldSurveyContext';
import { NegotiationProvider } from './context/NegotiationContext';
import { ContractProvider } from './context/ContractContext';

import AgriDeptDashboard from './pages/dashboard/AgriDeptDashboard';
import ICSDashboard from './pages/dashboard/ICSDashboard';
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import ServiceProviderRegistration from './pages/dashboard/ServiceProviderRegistration';
import RegistrationSuccess from './pages/dashboard/RegistrationSuccess';
import ServiceProviderApprovals from './pages/dashboard/ServiceProviderApprovals';
import UploadSurveyWizard from './pages/dashboard/UploadSurveyWizard';
import SurveySuccess from './pages/dashboard/SurveySuccess';
import SurveyApprovals from './pages/dashboard/SurveyApprovals';
import Marketplace from './pages/dashboard/Marketplace';
import ProductProcurement from './pages/dashboard/ProductProcurement';
import SupplierProfile from './pages/dashboard/SupplierProfile';
import MyEnquiries from './pages/dashboard/MyEnquiries';
import BuyerEnquiries from './pages/dashboard/BuyerEnquiries';
import NegotiationWorkspace from './pages/dashboard/NegotiationWorkspace';

// Contract & Payment Components
import SPContractDashboard from './pages/dashboard/contracts/SPContractDashboard';
import ContractGeneration from './pages/dashboard/contracts/ContractGeneration';
import PaymentConfiguration from './pages/dashboard/payments/PaymentConfiguration';
import BuyerContractDashboard from './pages/dashboard/contracts/BuyerContractDashboard';
import ContractReview from './pages/dashboard/contracts/ContractReview';
import PaymentGateway from './pages/dashboard/payments/PaymentGateway';
import ContractRepository from './pages/dashboard/contracts/ContractRepository';
import TransactionLedger from './pages/dashboard/payments/TransactionLedger';

// Notification Context
import { NotificationProvider } from './context/NotificationContext';
import NotificationOverlay from './components/common/NotificationOverlay';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case 'AGRI_DEPT': return <AgriDeptDashboard />;
    case 'ICS_PROVIDER': return <ICSDashboard />;
    case 'FPO_FARMER': return <FarmerDashboard />;
    case 'BUYER': return <BuyerDashboard />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <ServiceProviderProvider>
            <YieldSurveyProvider>
              <NegotiationProvider>
                <ContractProvider>
                  <Router>
                    <NotificationOverlay />
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="*" element={<div className="p-20 text-center text-xl font-bold">Coming Soon</div>} />
                      </Route>
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<DashboardRouter />} />
                        <Route path="register-sp" element={<ServiceProviderRegistration />} />
                        <Route path="sp-success" element={<RegistrationSuccess />} />
                        <Route path="sp-approvals" element={<ServiceProviderApprovals />} />
                        <Route path="upload-survey" element={<UploadSurveyWizard />} />
                        <Route path="survey-success" element={<SurveySuccess />} />
                        <Route path="survey-approvals" element={<SurveyApprovals />} />
                        <Route path="marketplace" element={<Marketplace />} />
                        <Route path="marketplace/:cropId" element={<ProductProcurement />} />
                        <Route path="supplier/:spId" element={<SupplierProfile />} />
                        <Route path="my-enquiries" element={<MyEnquiries />} />
                        <Route path="buyer-enquiries" element={<BuyerEnquiries />} />
                        <Route path="negotiation/:enquiryId" element={<NegotiationWorkspace />} />
                        
                        {/* Contracts & Payments */}
                        <Route path="sp-contracts" element={<SPContractDashboard />} />
                        <Route path="buyer-contracts" element={<BuyerContractDashboard />} />
                        <Route path="contracts/generate/:enquiryId" element={<ContractGeneration />} />
                        <Route path="contracts/review/:contractId" element={<ContractReview />} />
                        <Route path="payments/config/:contractId" element={<PaymentConfiguration />} />
                        <Route path="payments/gateway/:contractId" element={<PaymentGateway />} />
                        <Route path="contracts/repository" element={<ContractRepository />} />
                        <Route path="payments/ledger" element={<TransactionLedger />} />
                      </Route>
                    </Routes>
                  </Router>
                </ContractProvider>
              </NegotiationProvider>
            </YieldSurveyProvider>
          </ServiceProviderProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
