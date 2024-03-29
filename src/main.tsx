import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home, { languageLoader } from "./components/Home.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Flashcard, { flashcardLoader } from "./components/Flashcard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Terms from "./components/Terms.tsx";
import PageNotFound from "./components/PageNotFound.tsx";
import Layout from "./components/Layout.tsx";
import AuthProvider from "./components/AuthProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    loader: languageLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/flashcard/:language/:level",
    element: <Layout><Flashcard /></Layout>,
    loader: flashcardLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Layout ><Register /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/terms",
    element: <Layout ><Terms /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <Layout><PageNotFound /></Layout>,
  }
]);

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
