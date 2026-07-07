import { g as saveUser, h as saveToken, m as loginApi } from "./api-CZMD1aYE.js";
import { n as Button, t as Input } from "./input-BVh-hg82.js";
import { t as Label } from "./label-DHxyEb6G.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/assets/login-illustration.png
var login_illustration_default = "/assets/login-illustration-7LYW9gEO.png";
//#endregion
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const navigate = useNavigate();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	/** Client-side validation before hitting the API */
	const validate = () => {
		const errs = {};
		if (!userId.trim()) errs.userId = "User ID is required";
		if (!password) errs.password = "Password is required";
		return errs;
	};
	const submit = async (e) => {
		e.preventDefault();
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) return;
		setIsLoading(true);
		try {
			const res = await loginApi({
				userId,
				password
			});
			saveToken(res.data.token);
			saveUser(res.data.user);
			toast.success("Welcome back!");
			navigate({ to: "/" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong.";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-background p-4 sm:p-8 lg:p-10",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "hidden items-center justify-center bg-accent/50 p-12 lg:flex",
				children: /* @__PURE__ */ jsx("img", {
					src: login_illustration_default,
					alt: "Illustration of a person working on a laptop",
					width: 600,
					height: 600,
					className: "max-w-md"
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center p-6 sm:p-12",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "w-full max-w-sm space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm",
								children: "P"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xl font-bold tracking-tight",
								children: ["Prep", /* @__PURE__ */ jsx("span", {
									className: "text-primary",
									children: "Route"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold",
							children: "Login"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Use your company provided login credentials"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx(Label, {
										htmlFor: "userId",
										children: "User ID"
									}),
									/* @__PURE__ */ jsx(Input, {
										id: "userId",
										placeholder: "Enter User ID",
										value: userId,
										onChange: (e) => setUserId(e.target.value),
										"aria-invalid": !!errors.userId,
										disabled: isLoading
									}),
									errors.userId && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.userId
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx(Label, {
										htmlFor: "password",
										children: "Password"
									}),
									/* @__PURE__ */ jsx(Input, {
										id: "password",
										type: "password",
										placeholder: "Enter Password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										"aria-invalid": !!errors.password,
										disabled: isLoading
									}),
									errors.password && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: errors.password
									})
								]
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "text-sm font-medium text-primary hover:underline",
							children: "Forgot password?"
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							className: "w-full h-11 text-base font-semibold",
							disabled: isLoading,
							children: isLoading ? "Logging in…" : "Login"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-center text-xs text-muted-foreground",
							children: [
								"By continuing, you agree to our",
								" ",
								/* @__PURE__ */ jsx(Link, {
									to: "/",
									className: "text-primary hover:underline",
									children: "Terms"
								}),
								"."
							]
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
