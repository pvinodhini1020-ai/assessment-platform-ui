import { d as getToken } from "./api-CZMD1aYE.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/tests.questions.tsx
var $$splitComponentImporter = () => import("./tests.questions-CHXqvk8c.js");
var Route = createFileRoute("/tests/questions")({
	validateSearch: z.object({ testId: z.string().optional() }),
	beforeLoad: ({ location }) => {
		if (!getToken()) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
