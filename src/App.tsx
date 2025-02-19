import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add this to allow Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<></>} />
          )}
        </Routes>
        {/* Render Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" &&
          routes.map((route, index) => (
            <Routes key={index}>
              <Route path={route.path} element={route.element} />
            </Routes>
          ))}
      </div>
    </Suspense>
  );
}

export default App;
