import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import Flashcard from "./components/Flashcard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Terms from "./components/Terms.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/flashcard/:language/:level",
		element: <Flashcard />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/register",
		element: <Register />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/terms",
		element: <Terms />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
