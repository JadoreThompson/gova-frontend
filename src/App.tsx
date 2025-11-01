import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ContactUsPage from "./pages/ContactUsPage";
import CreateModeratorPage from "./pages/CreateModeratorPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import LoginPage from "./pages/LoginPage";
import ModeratorPage from "./pages/ModeratorPage";
import ModeratorsPage from "./pages/ModeratorsPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import Page500 from "./pages/page500";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Navigate to="/pricing" />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/moderators" element={<ModeratorsPage />} />
          <Route path="/moderators/:moderatorId" element={<ModeratorPage />} />
          <Route path="/moderators/create" element={<CreateModeratorPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/500" element={<Page500 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
