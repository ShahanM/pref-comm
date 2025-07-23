import React from "react";
import {
	Outlet,
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from "react-router-dom";
import "../styles/main.css";


import HomePage from "../pages/HomePage";
import MovieRatingPage from "../pages/MovieRatingPage";
import VisualizationLayout from "./VisualizationLayout";
import { VizContainer } from "./VizContainer";

export default function App() {
	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	)
}

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={<HomePage />} />
				<Route path="ratemovies" element={<MovieRatingPage />} />
			</Route>
			<Route path="/viz" element={<VisualizationLayout />}>
				<Route index element={<VizContainer />} />
				<Route path=":vizId" element={<VizContainer />} />
			</Route>
		</Route>
	), { basename: "/preference-visualization" }
)

export function DefaultLayout() {
	return (<Outlet />)
}
