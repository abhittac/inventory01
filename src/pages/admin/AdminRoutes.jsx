import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminSalesOverview from './AdminSalesOverview';
import WCutFlexoPage from './production/WCutFlexoPage';
import WCutBagMakingPage from './production/WCutBagMakingPage';
import DCutOpsertPage from './production/DCutOpsertPage';
import DCutBagMakingPage from './production/DCutBagMakingPage';
import UserManagement from '../UserManagement';
import RoleManagement from '../RoleManagement';
import DeliveryList from '../../components/admin/delivery/DeliveryList';
import BagColorPage from '../BagColor';
import FabricQualityPage from '../FabricQuality';
import GSMPage from '../GSMPage';
import SizePage from '../SizePage';
import HandleColorPage from '../HandleColor';

import RollSizePage from '../RollSize';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="roles" element={<RoleManagement />} />
      <Route path="delivery" element={<DeliveryList />} />
      <Route path="sales/*" element={<AdminSalesOverview />} />
      <Route path="flexo/*" element={<WCutFlexoPage />} />
      <Route path="wcut/*" element={<WCutBagMakingPage />} />
      <Route path="opsert/*" element={<DCutOpsertPage />} />
      <Route path="dcut/*" element={<DCutBagMakingPage />} />
      {/* 🆕 New routes */}
      <Route path="bag-color" element={<BagColorPage />} />
      <Route path="fabric-quality" element={<FabricQualityPage />} />
      <Route path="gsm" element={<GSMPage />} />
      <Route path="size" element={<SizePage />} />
      <Route path="handle-color" element={<HandleColorPage />} />
      <Route path="roll-size" element={<RollSizePage />} />
    </Routes>
  );
}