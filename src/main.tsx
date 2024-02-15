import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./ErrorPage.tsx";
import Flashcard, { flashcardLoader } from "./components/Flashcard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Terms from "./components/Terms.tsx";
import PageNotFound from "./components/PageNotFound.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <React.Suspense fallback={<h1>Loading...</h1>}><App /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/flashcard/:language/:level",
    element: <React.Suspense fallback={<h1>Loading...</h1>}><Flashcard /></React.Suspense>,
    loader: flashcardLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <React.Suspense fallback={<h1>Loading...</h1>}><Login /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <React.Suspense fallback={<h1>Loading..</h1>}><Register /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/terms",
    element: <React.Suspense fallback={<h1>Loading...</h1>}><Terms /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  }
]);

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
);
