import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import About from "./pages/About";
import ChezNamana from "./pages/ChezNamana";
import CircuitDetails from "./pages/CircuitDetails";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import NotFound from "./pages/NotFound";
import AdminGuard from "./layouts/AdminLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/a-propos"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/chez-l-habitant"
          element={
            <PublicLayout>
              <ChezNamana />
            </PublicLayout>
          }
        />
        <Route
          path="/circuits/:id"
          element={
            <PublicLayout>
              <CircuitDetails />
            </PublicLayout>
          }
        />
        <Route
          path="/devis"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
