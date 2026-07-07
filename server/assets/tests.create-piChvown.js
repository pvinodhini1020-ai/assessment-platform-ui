import { c as getSubjectsApi, f as getTopicsApi, i as createTestApi, s as getSubTopicsApi } from "./api-CZMD1aYE.js";
import { t as Route } from "./tests.create-C4Ml93ZY.js";
import { n as Button, t as Input } from "./input-BVh-hg82.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as AppShell, r as SelectItem, t as Select } from "./select-Dsy5LQVe.js";
import { t as Card } from "./card-COiY8HSN.js";
import { t as Label } from "./label-DHxyEb6G.js";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-wJFczXHl.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ChevronRight, Loader2 } from "lucide-react";
//#region src/routes/tests.create.tsx?tsr-split=component
var TYPE_LABEL = {
	chapterwise: "Chapter Wise",
	pyq: "PYQ",
	mock: "Mock Test"
};
var DIFFICULTIES = [
	"easy",
	"medium",
	"hard"
];
function CreateTest() {
	const navigate = useNavigate();
	const { type: routeType } = Route.useSearch();
	const [form, setForm] = useState({
		name: "",
		type: routeType ?? "chapterwise",
		subject: "",
		topic: "",
		sub_topic: "",
		difficulty: "easy",
		correct_marks: 4,
		wrong_marks: -1,
		unattempt_marks: 0,
		total_time: "",
		total_marks: "",
		total_questions: ""
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [topics, setTopics] = useState([]);
	const [subTopics, setSubTopics] = useState([]);
	const [loadingSubjects, setLoadingSubjects] = useState(true);
	const [loadingTopics, setLoadingTopics] = useState(false);
	const [loadingSubTopics, setLoadingSubTopics] = useState(false);
	useEffect(() => {
		getSubjectsApi().then((r) => setSubjects(r.data)).catch(() => toast.error("Failed to load subjects")).finally(() => setLoadingSubjects(false));
	}, []);
	useEffect(() => {
		if (!form.subject) {
			setTopics([]);
			return;
		}
		setLoadingTopics(true);
		setForm((f) => ({
			...f,
			topic: "",
			sub_topic: ""
		}));
		setSubTopics([]);
		getTopicsApi(form.subject).then((r) => setTopics(r.data)).catch(() => toast.error("Failed to load topics")).finally(() => setLoadingTopics(false));
	}, [form.subject]);
	useEffect(() => {
		if (!form.topic) {
			setSubTopics([]);
			return;
		}
		setLoadingSubTopics(true);
		setForm((f) => ({
			...f,
			sub_topic: ""
		}));
		getSubTopicsApi([form.topic]).then((r) => setSubTopics(r.data)).catch(() => toast.error("Failed to load sub-topics")).finally(() => setLoadingSubTopics(false));
	}, [form.topic]);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const validate = () => {
		const errs = {};
		if (!form.name.trim()) errs.name = "Required";
		if (!form.subject) errs.subject = "Required";
		if (!form.topic) errs.topic = "Required";
		if (!form.total_time) errs.total_time = "Required";
		if (!form.total_questions) errs.total_questions = "Required";
		return errs;
	};
	const submit = async () => {
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) {
			toast.error("Please complete required fields");
			return;
		}
		setSubmitting(true);
		try {
			const res = await createTestApi({
				name: form.name,
				type: form.type,
				subject: form.subject,
				topics: form.topic ? [form.topic] : [],
				sub_topics: form.sub_topic ? [form.sub_topic] : [],
				correct_marks: form.correct_marks,
				wrong_marks: form.wrong_marks,
				unattempt_marks: form.unattempt_marks,
				difficulty: form.difficulty,
				total_time: Number(form.total_time),
				total_marks: Number(form.total_marks) || 0,
				total_questions: Number(form.total_questions),
				status: "draft"
			});
			toast.success("Test created");
			navigate({
				to: "/tests/questions",
				search: { testId: res.data.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl space-y-5",
		children: [/* @__PURE__ */ jsxs("nav", {
			className: "flex items-center gap-1 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "hover:text-foreground",
					children: "Test Creation"
				}),
				/* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ jsx("span", {
					className: "text-primary font-medium border-b border-dashed border-primary",
					children: "Create Test"
				}),
				/* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ jsx("span", {
					className: "text-foreground",
					children: TYPE_LABEL[form.type]
				})
			]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "rounded-2xl p-6 shadow-card space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-5 md:grid-cols-2",
					children: [/* @__PURE__ */ jsx(Field, {
						label: "Subject",
						error: errors.subject,
						children: /* @__PURE__ */ jsxs(Select, {
							value: form.subject,
							onValueChange: (v) => set("subject", v),
							disabled: loadingSubjects,
							children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loadingSubjects ? "Loading…" : "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: subjects.map((s) => /* @__PURE__ */ jsx(SelectItem, {
								value: s.id,
								children: s.name
							}, s.id)) })]
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: "Name of Test",
						error: errors.name,
						children: /* @__PURE__ */ jsx(Input, {
							placeholder: "Enter name of Test",
							value: form.name,
							onChange: (e) => set("name", e.target.value),
							"aria-invalid": !!errors.name
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-5 md:grid-cols-2",
					children: [/* @__PURE__ */ jsx(Field, {
						label: "Topic",
						error: errors.topic,
						children: /* @__PURE__ */ jsxs(Select, {
							value: form.topic,
							onValueChange: (v) => set("topic", v),
							disabled: !form.subject || loadingTopics,
							children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loadingTopics ? "Loading…" : "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: topics.map((t) => /* @__PURE__ */ jsx(SelectItem, {
								value: t.id,
								children: t.name
							}, t.id)) })]
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: "Sub Topic",
						children: /* @__PURE__ */ jsxs(Select, {
							value: form.sub_topic,
							onValueChange: (v) => set("sub_topic", v),
							disabled: !form.topic || loadingSubTopics,
							children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loadingSubTopics ? "Loading…" : "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: subTopics.map((st) => /* @__PURE__ */ jsx(SelectItem, {
								value: st.id,
								children: st.name
							}, st.id)) })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-5 md:grid-cols-2",
					children: [/* @__PURE__ */ jsx(Field, {
						label: "Duration (Minutes)",
						error: errors.total_time,
						children: /* @__PURE__ */ jsx(Input, {
							type: "number",
							min: 1,
							placeholder: "Enter the time",
							value: form.total_time,
							onChange: (e) => set("total_time", e.target.value),
							"aria-invalid": !!errors.total_time
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: "Test Difficulty Level",
						children: /* @__PURE__ */ jsx(RadioGroup, {
							value: form.difficulty,
							onValueChange: (v) => set("difficulty", v),
							className: "flex items-center gap-6 h-10",
							children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(RadioGroupItem, {
									value: d,
									id: `diff-${d}`
								}), /* @__PURE__ */ jsx(Label, {
									htmlFor: `diff-${d}`,
									className: "capitalize font-normal cursor-pointer",
									children: d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Difficult"
								})]
							}, d))
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium mb-3",
					children: "Marking Scheme"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-5",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Wrong Answer",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: form.wrong_marks,
								onChange: (e) => set("wrong_marks", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Unattempted",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: form.unattempt_marks,
								onChange: (e) => set("unattempt_marks", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Correct Answer",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: form.correct_marks,
								onChange: (e) => set("correct_marks", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "No of Questions",
							error: errors.total_questions,
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								min: 1,
								placeholder: "Ex 200 Marks",
								value: form.total_questions,
								onChange: (e) => set("total_questions", e.target.value),
								"aria-invalid": !!errors.total_questions
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Total Marks",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								min: 0,
								placeholder: "Ex 200 Marks",
								value: form.total_marks,
								onChange: (e) => set("total_marks", e.target.value)
							})
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-3 pt-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						asChild: true,
						disabled: submitting,
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							children: "Cancel"
						})
					}), /* @__PURE__ */ jsxs(Button, {
						onClick: submit,
						disabled: submitting,
						className: "min-w-24",
						children: [submitting ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Next"]
					})]
				})
			]
		})]
	}) });
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ jsx(Label, {
				className: "text-sm font-medium text-foreground",
				children: label
			}),
			children,
			error && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-destructive",
				children: error
			})
		]
	});
}
//#endregion
export { CreateTest as component };
