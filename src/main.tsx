import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Error.tsx";
import Flashcard from "./components/Flashcard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <Error />,
	},
	{
		path: "/flashcard/:language/:level",
		element: <Flashcard />,
		errorElement: <Error />,
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <Error />,
	},
	{
		path: "/register",
		element: <Register />,
		errorElement: <Error />,
	},
]);
// <React.StrictMode>
// <RouterProvider router={router} />
// </React.StrictMode>,

ReactDOM.createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />,
);
