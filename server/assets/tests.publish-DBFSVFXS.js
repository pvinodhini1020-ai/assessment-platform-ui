import { d as getToken } from "./api-CZMD1aYE.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/tests.publish.tsx
var $$splitComponentImporter = () => import("./tests.publish-ByENAIGM.js");
var Route = createFileRoute("/tests/publish")({
	validateSearch: z.object({ testId: z.string().optional() }),
	beforeLoad: ({ location }) => {
		if (!getToken()) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
	},
	head: () => ({ meta: [{ title: "Preview & Publish" }, {
		name: "description",
		content: "Review and publish your test."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
