import { BrowserRouter, Route, Routes } from "react-router";
import DeploymentPage from "./pages/DeploymentPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import HomePage from "./pages/HomePage";
import GuidelinesPage from "./pages/GuidelinesPage";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
