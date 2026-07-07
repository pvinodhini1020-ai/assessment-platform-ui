import { d as getToken, l as getTestApi, t as API_BASE_URL } from "./api-CZMD1aYE.js";
import { t as Route } from "./tests.questions-Bgym5sjt.js";
import { i as cn, n as Button, t as Input } from "./input-BVh-hg82.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as AppShell, r as SelectItem, t as Select } from "./select-Dsy5LQVe.js";
import { t as Label } from "./label-DHxyEb6G.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Award, Brain, Check, CheckCircle, ChevronRight, ChevronsLeft, Circle, Clock, HelpCircle, Loader2, Pencil, Trash2 } from "lucide-react";
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/routes/tests.questions.tsx?tsr-split=component
var OPTION_KEYS = [
	"option1",
	"option2",
	"option3",
	"option4"
];
var emptyForm = () => ({
	question: "",
	option1: "",
	option2: "",
	option3: "",
	option4: "",
	correct_option: "",
	explanation: "",
	difficulty: "",
	topic: "",
	sub_topic: ""
});
function AddQuestions() {
	const navigate = useNavigate();
	const { testId } = Route.useSearch();
	const [test, setTest] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loadingPage, setLoadingPage] = useState(true);
	const [form, setForm] = useState(emptyForm());
	const [errors, setErrors] = useState({});
	const [editingId, setEditingId] = useState(null);
	const [saving, setSaving] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	useEffect(() => {
		if (!testId) {
			setLoadingPage(false);
			return;
		}
		getTestApi(testId).then((res) => setTest(res.data)).catch(() => toast.error("Failed to load test data")).finally(() => setLoadingPage(false));
	}, [testId]);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const validate = () => {
		const errs = {};
		if (!form.question.trim()) errs.question = "Required";
		if (!form.option1.trim()) errs.option1 = "Required";
		if (!form.option2.trim()) errs.option2 = "Required";
		if (!form.option3.trim()) errs.option3 = "Required";
		if (!form.option4.trim()) errs.option4 = "Required";
		if (!form.correct_option) errs.correct_option = "Select the correct option";
		return errs;
	};
	const resetForm = () => {
		setForm(emptyForm());
		setErrors({});
		setEditingId(null);
	};
	const handleEdit = (q, idx) => {
		setForm({
			question: q.question,
			option1: q.option1,
			option2: q.option2,
			option3: q.option3,
			option4: q.option4,
			correct_option: q.correct_option,
			explanation: q.explanation ?? "",
			difficulty: q.difficulty ?? "",
			topic: q.topic ?? "",
			sub_topic: q.sub_topic ?? ""
		});
		setEditingId(q.id);
		setErrors({});
	};
	const handleDelete = (id) => {
		setQuestions((qs) => qs.filter((q) => q.id !== id));
		toast.success("Question deleted locally");
		resetForm();
	};
	const handleNextQuestion = async () => {
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) {
			toast.error("Please complete all required fields before moving to next question");
			return;
		}
		const newQuestion = {
			id: `temp-${Date.now()}`,
			test_id: testId || "",
			question: form.question,
			option1: form.option1,
			option2: form.option2,
			option3: form.option3,
			option4: form.option4,
			correct_option: form.correct_option,
			subject: test?.subject,
			explanation: form.explanation,
			difficulty: form.difficulty,
			topic: form.topic,
			sub_topic: form.sub_topic
		};
		if (editingId) {
			setQuestions((qs) => qs.map((q) => q.id === editingId ? {
				...newQuestion,
				id: editingId
			} : q));
			toast.success("Question updated locally");
		} else {
			setQuestions((prev) => [...prev, newQuestion]);
			toast.success("Question added locally");
		}
		resetForm();
		toast.success("Moving to next question");
		setTimeout(() => {
			const nextSlot = document.querySelector(`[data-slot="slot-${questions.length}"]`);
			if (nextSlot) nextSlot.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			});
			const questionTextarea = document.querySelector("textarea[placeholder=\"Type here\"]");
			if (questionTextarea) questionTextarea.focus();
		}, 100);
	};
	const handleNext = async () => {
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) {
			toast.error("Please complete all required fields for the final question before continuing");
			return;
		}
		const finalQuestion = {
			id: editingId || `temp-${Date.now()}`,
			test_id: testId || "",
			question: form.question,
			option1: form.option1,
			option2: form.option2,
			option3: form.option3,
			option4: form.option4,
			correct_option: form.correct_option,
			subject: test?.subject,
			explanation: form.explanation,
			difficulty: form.difficulty,
			topic: form.topic,
			sub_topic: form.sub_topic
		};
		let finalQuestionsList = [...questions];
		if (editingId) finalQuestionsList = finalQuestionsList.map((q) => q.id === editingId ? finalQuestion : q);
		else finalQuestionsList.push(finalQuestion);
		if (finalQuestionsList.length === 0) {
			toast.error("Add at least 1 question before continuing");
			return;
		}
		if (!testId) return;
		setSaving(true);
		try {
			const existingData = await (await fetch(`${API_BASE_URL}/questions?test_id=${testId}`, { headers: { Authorization: `Bearer ${getToken()}` } })).json();
			if (existingData.data && existingData.data.length > 0) await Promise.all(existingData.data.map((q) => fetch(`${API_BASE_URL}/questions/${q.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${getToken()}` }
			})));
			const bulkPayload = { questions: finalQuestionsList.map((q) => ({
				type: "mcq",
				question: q.question,
				option1: q.option1,
				option2: q.option2,
				option3: q.option3,
				option4: q.option4,
				correct_option: q.correct_option,
				test_id: testId,
				subject: q.subject || test?.subject,
				...q.explanation && { explanation: q.explanation },
				...q.difficulty && { difficulty: q.difficulty },
				...q.topic && { topic: q.topic },
				...q.sub_topic && { sub_topic: q.sub_topic }
			})) };
			const res = await fetch(`${API_BASE_URL}/questions/bulk`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`
				},
				body: JSON.stringify(bulkPayload)
			});
			const data = await res.json();
			if (!res.ok || data.status !== "success") throw new Error(data?.message ?? "Failed to upload questions");
			toast.success("All questions uploaded successfully");
			navigate({
				to: "/tests/publish",
				search: { testId }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to upload questions");
		} finally {
			setSaving(false);
		}
	};
	if (loadingPage) return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
	}) });
	const total = test?.total_questions ?? 0;
	const currentQNum = editingId ? questions.findIndex((q) => q.id === editingId) + 1 : questions.length + 1;
	const typeLabel = test?.type === "chapterwise" ? "Chapter Wise" : test?.type === "pyq" ? "PYQ" : test?.type === "mock" ? "Mock Test" : "Chapter Wise";
	console.log("questions.length", questions.length);
	console.log("total", total);
	const allDone = questions.length + 1 >= total && total > 0;
	return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "-m-4 sm:-m-6 lg:-m-8 flex flex-col",
		style: { height: "calc(100vh - 3.5rem)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-6 py-2 border-b border-border bg-white shrink-0",
			children: [/* @__PURE__ */ jsxs("nav", {
				className: "flex items-center gap-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "Test Creation"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mx-0.5",
						children: "/"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/tests/create",
						className: "hover:text-foreground",
						children: "Create Test"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mx-0.5",
						children: "/"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-foreground",
						children: typeLabel
					})
				]
			}), /* @__PURE__ */ jsx(Button, {
				size: "sm",
				onClick: handleNext,
				className: "h-8 rounded-md bg-primary px-5 text-xs text-white",
				children: "Publish"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 overflow-hidden bg-white",
			children: [/* @__PURE__ */ jsxs("div", {
				className: cn("shrink-0 border-r border-border flex flex-col overflow-hidden transition-all duration-300", isCollapsed ? "w-9" : "w-[11.5rem]"),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-3 py-2.5 border-b border-border flex items-center justify-between",
					children: [!isCollapsed && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-semibold text-foreground",
							children: "Question Creation"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: ["Total Questions: ", total]
						})]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setIsCollapsed(!isCollapsed),
						className: "p-1 -mr-1 rounded-sm hover:bg-muted",
						children: /* @__PURE__ */ jsx(ChevronsLeft, { className: cn("h-5 w-5 text-sky-500 transition-transform duration-300", isCollapsed && "rotate-180") })
					})]
				}), !isCollapsed && /* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto py-2 px-2 space-y-1",
					children: [questions.map((q, i) => {
						return /* @__PURE__ */ jsxs("button", {
							onClick: () => handleEdit(q, i),
							className: cn("w-full text-left flex items-center justify-between px-2 py-1.5 rounded border border-green-500 bg-green-50 hover:bg-green-100", editingId === q.id && "ring-2 ring-green-300 ring-offset-1"),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5 text-green-600" }), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-medium text-green-600",
									children: ["Question ", i + 1]
								})]
							}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3 text-green-600" })]
						}, q.id);
					}), Array.from({ length: Math.max(0, total - questions.length) }).map((_, i) => {
						const slotIdx = questions.length + i;
						const isNext = i === 0;
						const isActiveNew = isNext && !editingId;
						return /* @__PURE__ */ jsxs("button", {
							"data-slot": `slot-${slotIdx}`,
							onClick: isNext ? resetForm : void 0,
							disabled: !isNext,
							className: cn("w-full text-left flex items-center justify-between px-2 py-1.5 rounded border disabled:cursor-default", isActiveNew ? "border-green-500 bg-green-50" : "border-transparent", !isNext && "opacity-50"),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Circle, { className: cn("h-3.5 w-3.5", isActiveNew ? "text-green-600" : "text-slate-400") }), /* @__PURE__ */ jsxs("span", {
									className: cn("text-[11px] font-medium", isActiveNew ? "text-green-600" : "text-slate-500"),
									children: ["Question ", slotIdx + 1]
								})]
							}), /* @__PURE__ */ jsx(ChevronRight, { className: cn("h-3 w-3", isActiveNew ? "text-green-600" : "text-slate-400") })]
						}, `slot-${slotIdx}`);
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto px-5 py-4 space-y-4",
					children: [
						test && /* @__PURE__ */ jsxs("div", {
							className: "relative mt-4 rounded-lg border border-border bg-card px-5 pt-3 pb-4 shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("button", {
									className: "absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground",
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mb-2",
									children: /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white",
										children: typeLabel
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3 flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(Brain, { className: "h-5 w-5 text-primary" }),
										/* @__PURE__ */ jsx("span", {
											className: "text-[15px] font-bold text-foreground",
											children: "Chapter 1"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1.5 rounded-full border border-green-300 bg-green-500 px-3 py-0.5 text-[11px] font-semibold text-white tracking-wide",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-5" }), "Easy"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[13px]",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex items-center gap-1.5",
											children: /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Subject"
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: ":"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-medium text-foreground",
												children: test.subject
											})]
										}),
										test.topics?.length > 0 && /* @__PURE__ */ jsx("div", {
											className: "flex items-center gap-1.5",
											children: /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Topic"
											})
										}),
										test.topics?.length > 0 && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: ":"
											}), /* @__PURE__ */ jsx("div", {
												className: "flex flex-wrap gap-1",
												children: test.topics.slice(0, 3).map((t) => /* @__PURE__ */ jsx("span", {
													className: "rounded border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700",
													children: t
												}, t))
											})]
										}),
										test.sub_topics?.length > 0 && /* @__PURE__ */ jsx("div", {
											className: "flex items-center gap-1.5",
											children: /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Sub Topic"
											})
										}),
										test.sub_topics?.length > 0 && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: ":"
											}), /* @__PURE__ */ jsx("span", {
												className: "rounded border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700",
												children: test.sub_topics[0]
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex flex-col gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm md:absolute md:-bottom-0 md:-right-0 md:my-3 md:mx-2 md:flex-row md:items-center md:px-2 md:py-1.5 text-[12px] font-medium text-[#6B7280]",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 px-2",
											children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-[#A0A0A0]" }), /* @__PURE__ */ jsxs("span", { children: [test.total_time, " Min"] })]
										}),
										/* @__PURE__ */ jsx("div", { className: "h-4 w-[1px] bg-[#E5E7EB] md:mx-1" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 px-2",
											children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4 text-[#A0A0A0]" }), /* @__PURE__ */ jsxs("span", { children: [test.total_questions, " Q's"] })]
										}),
										/* @__PURE__ */ jsx("div", { className: "h-4 w-[1px] bg-[#E5E7EB] md:mx-1" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 px-2",
											children: [/* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-[#A0A0A0]" }), /* @__PURE__ */ jsxs("span", { children: [test.total_marks, " Marks"] })]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-sm font-semibold text-foreground",
								children: [
									"Question ",
									currentQNum,
									"/",
									total
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "rounded border border-primary/40 px-2 py-0.5 text-[11px] text-primary hover:bg-primary/5",
									children: "+ MCQ"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/50",
									children: "CRT"
								})]
							})]
						}),
						editingId && /* @__PURE__ */ jsxs("button", {
							onClick: () => handleDelete(editingId),
							className: "-mt-2 flex items-center gap-1 text-[11px] text-destructive hover:underline",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), "Delete Article"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "overflow-hidden rounded-lg border border-border",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center gap-0.5 border-b border-border bg-[#f9f9f9] px-2 py-1",
								children: [
									"B",
									"I",
									"U",
									"S",
									"x₂",
									"x²",
									"≡",
									"≡",
									"≡",
									"≡",
									"⊞",
									"⊟",
									"∑",
									"√",
									"∞"
								].map((t, i) => /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "rounded px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground hover:bg-muted",
									children: t
								}, i))
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Textarea, {
									value: form.question,
									onChange: (e) => set("question", e.target.value),
									placeholder: "Type here",
									className: "min-h-[7.5rem] resize-none rounded-none border-0 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0",
									"aria-invalid": !!errors.question
								}), /* @__PURE__ */ jsx("span", {
									className: "pointer-events-none absolute bottom-2 right-2 select-none text-[10px] text-muted-foreground/30",
									children: "⊞"
								})]
							})]
						}),
						errors.question && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-destructive -mt-2",
							children: errors.question
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-medium text-foreground",
									children: "Type the options below"
								}),
								errors.correct_option && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-destructive",
									children: errors.correct_option
								}),
								OPTION_KEYS.map((key) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "radio",
										name: "correct_option",
										checked: form.correct_option === key,
										onChange: () => set("correct_option", key),
										className: "h-3.5 w-3.5 shrink-0 accent-primary"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative flex-1",
										children: [/* @__PURE__ */ jsx(Input, {
											value: form[key],
											onChange: (e) => set(key, e.target.value),
											placeholder: "Type Option here",
											className: cn("h-9 pr-8 text-sm placeholder:text-muted-foreground/40", form.correct_option === key && "border-primary bg-primary/5"),
											"aria-invalid": !!errors[key]
										}), /* @__PURE__ */ jsx("span", {
											className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-[10px] text-muted-foreground/30",
											children: "⊞"
										})]
									})]
								}, key))
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium text-foreground",
								children: "Add Solution"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative overflow-hidden rounded-lg border border-border",
								children: [/* @__PURE__ */ jsx(Textarea, {
									value: form.explanation,
									onChange: (e) => set("explanation", e.target.value),
									placeholder: "Type here",
									className: "min-h-[5.5rem] resize-none rounded-none border-0 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0"
								}), /* @__PURE__ */ jsx("span", {
									className: "pointer-events-none absolute bottom-2 right-2 select-none text-[10px] text-muted-foreground/30",
									children: "⊞"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3 pb-4",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold text-foreground",
									children: "Question settings"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx(Label, {
										className: "text-xs text-muted-foreground",
										children: "Level of Difficulty"
									}), /* @__PURE__ */ jsxs(Select, {
										value: form.difficulty,
										onValueChange: (v) => set("difficulty", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-9 text-sm text-muted-foreground",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select from Drop-down" })
										}), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "easy",
												children: "Easy"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "medium",
												children: "Medium"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "hard",
												children: "Hard"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx(Label, {
										className: "text-xs text-muted-foreground",
										children: "Topic"
									}), /* @__PURE__ */ jsxs(Select, {
										value: form.topic,
										onValueChange: (v) => set("topic", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-9 text-sm text-muted-foreground",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select from Drop-down" })
										}), /* @__PURE__ */ jsx(SelectContent, { children: (test?.topics ?? []).map((t) => /* @__PURE__ */ jsx(SelectItem, {
											value: t,
											children: t
										}, t)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx(Label, {
										className: "text-xs text-muted-foreground",
										children: "Sub-topic"
									}), /* @__PURE__ */ jsxs(Select, {
										value: form.sub_topic,
										onValueChange: (v) => set("sub_topic", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-9 text-sm text-muted-foreground",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select from Drop-down" })
										}), /* @__PURE__ */ jsx(SelectContent, { children: (test?.sub_topics ?? []).map((st) => /* @__PURE__ */ jsx(SelectItem, {
											value: st,
											children: st
										}, st)) })]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center justify-between border-t border-border bg-white px-5 py-3",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						asChild: true,
						className: "h-8 border-destructive/50 px-4 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/",
							children: "Exit Test Creation"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs(Button, {
							onClick: handleNextQuestion,
							disabled: saving || allDone,
							className: "h-8 bg-primary px-6 text-xs text-white disabled:opacity-50",
							children: [saving && /* @__PURE__ */ jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Next Question"]
						}), /* @__PURE__ */ jsxs(Button, {
							onClick: handleNext,
							disabled: saving || !allDone,
							className: "h-8 bg-primary px-6 text-xs text-white disabled:opacity-50",
							children: [saving && /* @__PURE__ */ jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Next"]
						})]
					})]
				})]
			})]
		})]
	}) });
}
//#endregion
export { AddQuestions as component };
