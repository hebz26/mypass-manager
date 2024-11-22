import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import CardsPage from "./pages/CardsPage";
import LoginsPage from "./pages/LoginsPage";
import NotesPage from "./pages/NotesPage";
import IdentityPage from "./pages/IdentityPage";
import RecoveryPage from "./pages/RecoveryPage";

function App() {
  const [authUser] = useAuthState(auth);

  return (
    <PageLayout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/cards"
          element={authUser ? <CardsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/logins"
          element={authUser ? <LoginsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/secure-notes"
          element={authUser ? <NotesPage /> : <Navigate to="/" />}
        />
        <Route
          path="/identity"
          element={authUser ? <IdentityPage /> : <Navigate to="/" />}
        />
        <Route
          path="/auth"
          element={!authUser ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/recoverPassword"
          element={!authUser ? <RecoveryPage /> : <Navigate to="/" />}
        />
      </Routes>
    </PageLayout>
  );
}

export default App;
