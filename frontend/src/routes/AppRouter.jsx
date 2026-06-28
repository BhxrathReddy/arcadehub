// src/routes/AppRouter.jsx

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import LeaderboardPage from "../pages/LeaderboardPage";
import GamesPage from "../pages/GamesPage";
import ProtectedRoute from "./ProtectedRoute";
import SnakePage from "../games/snake/SnakePage";
import MemoryMatchPage from "../games/memory-match/MemoryMatchPage";
import TypingTestPage from "../games/typing-test/TypingTestPage";
import TicTacToePage from "../games/tic-tac-toe/TicTacToePage";
import ProfilePage from "../pages/ProfilePage";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/snake"
          element={
            <ProtectedRoute>
              <SnakePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/memory-match"
          element={
            <ProtectedRoute>
              <MemoryMatchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/typing-test"
          element={
            <ProtectedRoute>
              <TypingTestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/tic-tac-toe"
          element={
            <ProtectedRoute>
              <TicTacToePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
