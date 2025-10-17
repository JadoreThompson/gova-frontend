import { BrowserRouter, Route, Routes } from "react-router";
import DeploymentPage from "./pages/DeploymentPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import HomePage from "./pages/HomePage";
import ModeratorsPage from "./pages/ModeratorsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route
            path="/deployment/:deploymentId"
            element={<DeploymentPage />}
          />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/moderators" element={<ModeratorsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
