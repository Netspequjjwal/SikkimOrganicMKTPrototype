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
import { OrderProvider } from './context/OrderContext';
import { ActionCenterProvider } from './context/ActionCenterContext';
import { TCProviderWrapper } from './context/TCContext';
import { Toaster } from 'react-hot-toast';

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

// Order Fulfilment
import BuyerOrderDashboard from './pages/dashboard/orders/BuyerOrderDashboard';
import SPOrderDashboard from './pages/dashboard/orders/SPOrderDashboard';
import OrderRepository from './pages/dashboard/orders/OrderRepository';
import OrderWorkspace from './pages/dashboard/orders/OrderWorkspace';

// Notification Context
import { NotificationProvider } from './context/NotificationContext';
import NotificationOverlay from './components/common/NotificationOverlay';

// TC Services (CaaS)
import TCMarketplace from './pages/dashboard/tc/TCMarketplace';
import TCProviderProfile from './pages/dashboard/tc/TCProviderProfile';
import TCRequestWizard from './pages/dashboard/tc/TCRequestWizard';
import TCProviderDashboard from './pages/dashboard/tc/TCProviderDashboard';
import TCRequestWorkspace from './pages/dashboard/tc/TCRequestWorkspace';
import TCOfferBuilder from './pages/dashboard/tc/TCOfferBuilder';
import TCProposalReview from './pages/dashboard/tc/TCProposalReview';
import TCPayment from './pages/dashboard/tc/TCPayment';
import TCVault from './pages/dashboard/tc/TCVault';

// FPO Specific
import PublishProduct from './pages/dashboard/fpo/PublishProduct';

// Agri Dept Modules
import ICSProductListing from './pages/dashboard/agri/ICSProductListing';
import FPOProductListing from './pages/dashboard/agri/FPOProductListing';
import AnalyticsReports from './pages/dashboard/agri/AnalyticsReports';
import FPORegistration from './pages/dashboard/agri/FPORegistration';

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
              <TCProviderWrapper>
                <NegotiationProvider>
                  <ContractProvider>
                    <OrderProvider>
                      <Router>
                        <Toaster position="top-right" />
                        <NotificationOverlay />
                        <ActionCenterProvider>
                          <Routes>
                            <Route path="/" element={<MainLayout />}>
                              <Route index element={<Home />} />
                              <Route path="login" element={<Login />} />
                            </Route>

                            <Route path="/dashboard" element={
                              <ProtectedRoute>
                                <DashboardLayout />
                              </ProtectedRoute>
                            }>
                              <Route index element={<DashboardRouter />} />
                              
                              {/* Common Dashboards */}
                              <Route path="sp-registration" element={<ServiceProviderRegistration />} />
                              <Route path="registration-success" element={<RegistrationSuccess />} />
                              <Route path="sp-approvals" element={<ServiceProviderApprovals />} />
                              <Route path="survey" element={<UploadSurveyWizard />} />
                              <Route path="survey-success" element={<SurveySuccess />} />
                              <Route path="survey-approvals" element={<SurveyApprovals />} />
                              
                              {/* Agri Dept Additions */}
                              <Route path="agri/fpo-registration" element={<FPORegistration />} />
                              <Route path="agri/ics-products" element={<ICSProductListing />} />
                              <Route path="agri/fpo-products" element={<FPOProductListing />} />
                              <Route path="agri/analytics" element={<AnalyticsReports />} />
                              
                              {/* Negotiation & Procurement */}
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

                              {/* Orders & Fulfilment */}
                              <Route path="buyer-orders" element={<BuyerOrderDashboard />} />
                              <Route path="sp-orders" element={<SPOrderDashboard />} />
                              <Route path="orders/repository" element={<OrderRepository />} />
                              <Route path="orders/:orderId" element={<OrderWorkspace />} />
                              {/* TC Marketplace & Services */}
                              <Route path="tc/marketplace" element={<TCMarketplace />} />
                              <Route path="tc/provider/:providerId" element={<TCProviderProfile />} />
                              <Route path="tc/request/:providerId" element={<TCRequestWizard />} />
                              <Route path="tc/requests" element={<TCProviderDashboard />} />
                              <Route path="tc/requests/:requestId" element={<TCRequestWorkspace />} />
                              <Route path="tc/offer/:requestId" element={<TCOfferBuilder />} />
                              <Route path="tc/proposal/:requestId" element={<TCProposalReview />} />
                              <Route path="tc/payment/:requestId" element={<TCPayment />} />
                              <Route path="tc/vault" element={<TCVault />} />

                              {/* FPO Specific */}
                              <Route path="fpo/publish" element={<PublishProduct />} />
                            </Route>
                          </Routes>
                        </ActionCenterProvider>
                      </Router>
                    </OrderProvider>
                  </ContractProvider>
                </NegotiationProvider>
              </TCProviderWrapper>
            </YieldSurveyProvider>
          </ServiceProviderProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
