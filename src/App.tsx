import { Routes, Route, useRoutes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import ProjectSetupPage from "./components/ProjectSetupPage";
import AudienceStep from "./components/steps/AudienceStep";
import RequirementsStep from "./components/steps/RequirementsStep";
import DesignStep from "./components/steps/DesignStep";
import PromptResult from "./components/PromptResult";
import Home from "./components/home";
import routes from "tempo-routes";

export default function App() {
  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/setup" element={<ProjectSetupPage />} />
        <Route path="/steps/audience" element={<AudienceStep />} />
        <Route path="/steps/requirements" element={<RequirementsStep />} />
        <Route path="/steps/design" element={<DesignStep />} />
        <Route path="/preview" element={<PromptResult />} />

        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </>
  );
}
