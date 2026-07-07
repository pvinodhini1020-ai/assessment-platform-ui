import { d as getToken } from "./api-CZMD1aYE.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/tests.create.tsx
var $$splitComponentImporter = () => import("./tests.create-piChvown.js");
var Route = createFileRoute("/tests/create")({
	beforeLoad: ({ location }) => {
		if (!getToken()) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
	},
	head: () => ({ meta: [{ title: "Create Test" }, {
		name: "description",
		content: "Create a new chapter-wise, PYQ or mock test."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
