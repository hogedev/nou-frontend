import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth-store";
import { AppShell } from "./components/layout/AppShell";
import TimelinePage from "./pages/TimelinePage";
import NewEntryPage from "./pages/NewEntryPage";
import EntryDetailPage from "./pages/EntryDetailPage";
import EditEntryPage from "./pages/EditEntryPage";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<TimelinePage />} />
        <Route path="/new" element={<NewEntryPage />} />
        <Route path="/entries/:id" element={<EntryDetailPage />} />
        <Route path="/entries/:id/edit" element={<EditEntryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );
}

export default App;
