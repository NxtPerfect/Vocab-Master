import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./ErrorPage.tsx";
import Flashcard from "./components/Flashcard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Terms from "./components/Terms.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <React.Suspense fallback={<>Loading...</>}><App /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/flashcard/:language/:level",
    element: <React.Suspense fallback={<>Loading...</>}><Flashcard /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <React.Suspense fallback={<>Loading...</>}><Login /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <React.Suspense fallback={<>Loading..</>}><Register /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/terms",
    element: <React.Suspense fallback={<>Loading...</>}><Terms /></React.Suspense>,
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true}/>
    </QueryClientProvider>
  </React.StrictMode>
);
