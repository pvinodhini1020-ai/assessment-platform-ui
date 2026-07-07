import { _ as updateTestApi, a as fetchBulkApi, c as getSubjectsApi, f as getTopicsApi, l as getTestApi, o as getQuestionsApi, r as createSubTopicsApi, s as getSubTopicsApi } from "./api-CZMD1aYE.js";
import { t as Route } from "./tests.publish-DBFSVFXS.js";
import { i as cn, n as Button, t as Input } from "./input-BVh-hg82.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, o as AppShell, r as SelectItem, t as Select } from "./select-Dsy5LQVe.js";
import { t as Card } from "./card-COiY8HSN.js";
import { t as Label } from "./label-DHxyEb6G.js";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-wJFczXHl.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Award, Brain, Check, CheckCircle2, ChevronRight, Clock, HelpCircle, Loader2, Pencil, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//#region src/components/ui/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region src/routes/tests.publish.tsx?tsr-split=component
var TYPE_TABS = [
	{
		value: "chapterwise",
		label: "Chapter Wise"
	},
	{
		value: "pyq",
		label: "PYQ"
	},
	{
		value: "mock",
		label: "Mock Test"
	}
];
function PreviewPublish() {
	const navigate = useNavigate();
	const { testId } = Route.useSearch();
	const [test, setTest] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [publishing, setPublishing] = useState(false);
	const [published, setPublished] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [publishTab, setPublishTab] = useState("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [scheduling, setScheduling] = useState(false);
	const [scheduled, setScheduled] = useState(false);
	const [liveUntil, setLiveUntil] = useState("always");
	const [customEndDate, setCustomEndDate] = useState("");
	const [customEndTime, setCustomEndTime] = useState("");
	const [editOpen, setEditOpen] = useState(false);
	const [editForm, setEditForm] = useState(null);
	const [saving, setSaving] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [topics, setTopics] = useState([]);
	const [subTopics, setSubTopics] = useState([]);
	useEffect(() => {
		if (!testId) {
			setLoading(false);
			return;
		}
		Promise.all([getTestApi(testId), getQuestionsApi(testId)]).then(([testRes, qRes]) => {
			console.log("Test ID:", testId);
			console.log("Questions API Response:", qRes);
			console.log("Questions data:", qRes.data);
			setTest(testRes.data);
			setQuestions(qRes.data ?? []);
		}).catch(() => toast.error("Failed to load test data")).finally(() => setLoading(false));
	}, [testId]);
	const openEdit = () => {
		if (!test) return;
		setEditForm({
			type: test.type,
			name: test.name,
			subject: test.subject,
			topic: test.topics?.[0] ?? "",
			sub_topic: test.sub_topics?.[0] ?? "",
			total_time: String(test.total_time),
			difficulty: test.difficulty,
			wrong_marks: -1,
			unattempt_marks: 0,
			correct_marks: 4,
			total_questions: String(test.total_questions),
			total_marks: String(test.total_marks)
		});
		getSubjectsApi().then((r) => setSubjects(r.data)).catch(() => {});
		if (test.subject) getTopicsApi(test.subject).then((r) => setTopics(r.data)).catch(() => {});
		if (test.topics?.[0]) getSubTopicsApi([test.topics[0]]).then((r) => setSubTopics(r.data)).catch(() => {});
		setEditOpen(true);
	};
	const setEdit = (k, v) => setEditForm((f) => f ? {
		...f,
		[k]: v
	} : f);
	useEffect(() => {
		if (!editForm?.subject) {
			setTopics([]);
			return;
		}
		getTopicsApi(editForm.subject).then((r) => setTopics(r.data)).catch(() => {});
	}, [editForm?.subject]);
	useEffect(() => {
		if (!editForm?.topic) {
			setSubTopics([]);
			return;
		}
		getSubTopicsApi([editForm.topic]).then((r) => setSubTopics(r.data)).catch(() => {});
	}, [editForm?.topic]);
	const handleSaveEdit = async () => {
		if (!testId || !editForm) return;
		setSaving(true);
		try {
			const res = await updateTestApi(testId, {
				name: editForm.name,
				type: editForm.type,
				subject: editForm.subject,
				topics: editForm.topic ? [editForm.topic] : [],
				sub_topics: editForm.sub_topic ? [editForm.sub_topic] : [],
				difficulty: editForm.difficulty,
				total_time: Number(editForm.total_time),
				total_marks: Number(editForm.total_marks) || 0,
				total_questions: Number(editForm.total_questions),
				correct_marks: editForm.correct_marks,
				wrong_marks: editForm.wrong_marks,
				unattempt_marks: editForm.unattempt_marks
			});
			setTest(res.data);
			toast.success("Test updated");
			setEditOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update test");
		} finally {
			setSaving(false);
		}
	};
	const handleConfirm = async () => {
		if (!testId || !test) return;
		if (questions.length === 0) {
			toast.error("No questions found. Add at least 1 question.");
			return;
		}
		setConfirming(true);
		try {
			console.log("Publishing test...");
			await updateTestApi(testId, { status: "live" });
			console.log("Test published successfully");
			if (test.topics && test.topics.length > 0) try {
				const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
				const validTopicIds = test.topics.filter((topic) => isValidUUID(topic));
				if (validTopicIds.length > 0) {
					console.log("Creating sub topics...");
					await createSubTopicsApi(validTopicIds);
					console.log("Sub topics created successfully");
				} else console.log("Skipping sub topics API - no valid UUID topic IDs found");
			} catch (subTopicErr) {
				console.error("Sub topics API failed (non-critical):", subTopicErr);
			}
			const questionIds = questions.map((q) => q.id);
			if (questionIds.length > 0) try {
				console.log("Fetching bulk questions...");
				await fetchBulkApi(questionIds);
				console.log("Bulk questions fetched successfully");
			} catch (fetchBulkErr) {
				console.error("Fetch bulk API failed (non-critical):", fetchBulkErr);
			}
			setPublished(true);
			toast.success("Test published successfully!");
			setTimeout(() => navigate({ to: "/" }), 1800);
		} catch (err) {
			console.error("Error in handleConfirm:", err);
			toast.error(err instanceof Error ? err.message : "Failed to publish test");
		} finally {
			setConfirming(false);
		}
	};
	useEffect(() => {
		if (!testId) return;
		const checkScheduledTest = async () => {
			try {
				const currentTest = (await getTestApi(testId)).data;
				if (currentTest.status === "scheduled" && currentTest.scheduled_date) {
					if (new Date(currentTest.scheduled_date) <= /* @__PURE__ */ new Date()) {
						await updateTestApi(testId, { status: "live" });
						toast.success("Test auto-published as scheduled!");
					}
				}
			} catch (err) {
				console.error("Error checking scheduled test:", err);
			}
		};
		const interval = setInterval(checkScheduledTest, 3e4);
		checkScheduledTest();
		return () => clearInterval(interval);
	}, [testId]);
	if (loading) return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })
	}) });
	if (published) return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success",
				children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-5 text-2xl font-bold",
				children: "Test published!"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your test is now live and available to your students."
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					children: "Back to dashboard"
				})
			})
		]
	}) });
	if (scheduled) return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary",
				children: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-5 text-2xl font-bold",
				children: "Test scheduled!"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Your test will be automatically published on ",
					(/* @__PURE__ */ new Date(`${scheduledDate}T${scheduledTime}`)).toLocaleString(),
					"."
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					children: "Back to dashboard"
				})
			})
		]
	}) });
	return /* @__PURE__ */ jsxs(AppShell, { children: [/* @__PURE__ */ jsxs("div", {
		className: "-m-4 sm:-m-6 lg:-m-8 flex flex-col",
		style: { height: "calc(100vh - 3.5rem)" },
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-between px-6 py-2 border-b border-border bg-white shrink-0",
			children: /* @__PURE__ */ jsxs("nav", {
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
						children: "Preview & Publish"
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 overflow-hidden bg-white",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "w-[11.5rem] shrink-0 border-r border-border flex flex-col overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-3 py-2.5 border-b border-border",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[11px] font-semibold text-foreground",
						children: "Question Creation"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: ["Total Questions: ", test?.total_questions ?? 0]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex-1 overflow-y-auto py-2 px-2 space-y-1",
					children: questions.slice(0, test?.total_questions).map((q, i) => /* @__PURE__ */ jsxs("button", {
						className: "w-full text-left flex items-center justify-between px-2 py-1.5 rounded border border-green-500 bg-green-50 hover:bg-green-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-green-600" }), /* @__PURE__ */ jsxs("span", {
								className: "text-[11px] font-medium text-green-600",
								children: ["Question ", i + 1]
							})]
						}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3 text-green-600" })]
					}, q.id))
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-1 flex-col overflow-hidden",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto px-5 py-4 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-semibold",
								children: "Test created"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-sm text-muted-foreground",
								children: [
									"All ",
									test?.total_questions,
									" Questions done"
								]
							})]
						}),
						test && /* @__PURE__ */ jsxs(Card, {
							className: "relative rounded-lg border border-border bg-card px-5 pt-3 pb-4 shadow-sm overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("button", {
									className: "absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground",
									onClick: openEdit,
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mb-2",
									children: /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white capitalize",
										children: test.type === "chapterwise" ? "Chapter Wise" : test.type === "pyq" ? "PYQ" : "Mock Test"
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
											children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-5" }), test.difficulty]
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
							className: "flex gap-0 border-b border-border",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setPublishTab("now"),
								className: cn("px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors", publishTab === "now" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
								children: "Publish Now"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setPublishTab("schedule"),
								className: cn("px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors", publishTab === "schedule" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
								children: "Schedule Publish"
							})]
						}),
						publishTab === "now" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Card, {
							className: "rounded-2xl p-6 shadow-card space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-base font-semibold text-gray-900",
										children: "Live Until"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm leading-7 tracking-wide text-gray-500",
										children: "Choose how long this test should remain available on the platform."
									})]
								}),
								/* @__PURE__ */ jsx(RadioGroup, {
									value: liveUntil,
									onValueChange: (v) => setLiveUntil(v),
									children: /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "always",
													id: "always"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "always",
													className: "cursor-pointer text-sm font-medium",
													children: "Always Available"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "1week",
													id: "1week"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "1week",
													className: "cursor-pointer text-sm font-medium",
													children: "1 Week"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "2weeks",
													id: "2weeks"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "2weeks",
													className: "cursor-pointer text-sm font-medium",
													children: "2 Weeks"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "3weeks",
													id: "3weeks"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "3weeks",
													className: "cursor-pointer text-sm font-medium",
													children: "3 Weeks"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "1month",
													id: "1month"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "1month",
													className: "cursor-pointer text-sm font-medium",
													children: "1 Month"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "custom",
													id: "custom"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "custom",
													className: "cursor-pointer text-sm font-medium",
													children: "Custom Duration"
												})]
											})
										]
									})
								}),
								liveUntil === "custom" && /* @__PURE__ */ jsx("div", {
									className: "pt-3 space-y-4",
									children: /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												className: "text-sm font-medium",
												children: "End Date"
											}), /* @__PURE__ */ jsx(Input, {
												type: "date",
												value: customEndDate,
												onChange: (e) => setCustomEndDate(e.target.value),
												min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
												className: "h-11 rounded-lg"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												className: "text-sm font-medium",
												children: "End Time"
											}), /* @__PURE__ */ jsx(Input, {
												type: "time",
												value: customEndTime,
												onChange: (e) => setCustomEndTime(e.target.value),
												className: "h-11 rounded-lg"
											})]
										})]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-3 pt-2",
									children: [/* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											setLiveUntil("always");
											setCustomEndDate("");
											setCustomEndTime("");
										},
										className: "h-10 px-6 rounded-lg border-blue-600 text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700",
										children: "Cancel"
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										onClick: handleConfirm,
										disabled: confirming,
										className: "h-10 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700",
										children: confirming ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Confirming..."] }) : "Confirm"
									})]
								})
							]
						}) }),
						publishTab === "schedule" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Card, {
							className: "rounded-2xl p-6 shadow-card space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-semibold mb-1",
									children: "Schedule Publish"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground",
									children: "Select a date and time to automatically publish your test."
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-sm",
											children: "Date"
										}), /* @__PURE__ */ jsx(Input, {
											type: "date",
											value: scheduledDate,
											onChange: (e) => setScheduledDate(e.target.value),
											min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
											className: "h-10"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-sm",
											children: "Time"
										}), /* @__PURE__ */ jsx(Input, {
											type: "time",
											value: scheduledTime,
											onChange: (e) => setScheduledTime(e.target.value),
											className: "h-10"
										})]
									})]
								}),
								scheduledDate && scheduledTime && /* @__PURE__ */ jsx("div", {
									className: "rounded-lg bg-primary/5 border border-primary/20 p-4",
									children: /* @__PURE__ */ jsxs("p", {
										className: "text-sm font-medium text-primary",
										children: ["Scheduled for: ", (/* @__PURE__ */ new Date(`${scheduledDate}T${scheduledTime}`)).toLocaleString()]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-base font-semibold text-gray-900",
										children: "Live Until"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm leading-7 tracking-wide text-gray-500",
										children: "Choose how long this test should remain available on the platform."
									})]
								}),
								/* @__PURE__ */ jsx(RadioGroup, {
									value: liveUntil,
									onValueChange: (v) => setLiveUntil(v),
									children: /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "always",
													id: "always"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "always",
													className: "cursor-pointer text-sm font-medium",
													children: "Always Available"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "1week",
													id: "1week"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "1week",
													className: "cursor-pointer text-sm font-medium",
													children: "1 Week"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "2weeks",
													id: "2weeks"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "2weeks",
													className: "cursor-pointer text-sm font-medium",
													children: "2 Weeks"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "3weeks",
													id: "3weeks"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "3weeks",
													className: "cursor-pointer text-sm font-medium",
													children: "3 Weeks"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "1month",
													id: "1month"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "1month",
													className: "cursor-pointer text-sm font-medium",
													children: "1 Month"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(RadioGroupItem, {
													value: "custom",
													id: "custom"
												}), /* @__PURE__ */ jsx(Label, {
													htmlFor: "custom",
													className: "cursor-pointer text-sm font-medium",
													children: "Custom Duration"
												})]
											})
										]
									})
								}),
								liveUntil === "custom" && /* @__PURE__ */ jsx("div", {
									className: "pt-3 space-y-4",
									children: /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												className: "text-sm font-medium",
												children: "End Date"
											}), /* @__PURE__ */ jsx(Input, {
												type: "date",
												value: customEndDate,
												onChange: (e) => setCustomEndDate(e.target.value),
												min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
												className: "h-11 rounded-lg"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ jsx(Label, {
												className: "text-sm font-medium",
												children: "End Time"
											}), /* @__PURE__ */ jsx(Input, {
												type: "time",
												value: customEndTime,
												onChange: (e) => setCustomEndTime(e.target.value),
												className: "h-11 rounded-lg"
											})]
										})]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-3 pt-2",
									children: [/* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											setLiveUntil("always");
											setCustomEndDate("");
											setCustomEndTime("");
										},
										className: "h-10 px-6 rounded-lg border-blue-600 text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700",
										children: "Cancel"
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										onClick: () => {
											console.log("Confirmed");
										},
										className: "h-10 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700",
										children: "Confirm"
									})]
								})
							]
						}) })
					]
				})
			})]
		})]
	}), /* @__PURE__ */ jsx(Dialog, {
		open: editOpen,
		onOpenChange: setEditOpen,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-2xl p-0 gap-0 overflow-hidden",
			children: [/* @__PURE__ */ jsxs(DialogHeader, {
				className: "px-6 pt-5 pb-4 border-b border-border flex flex-row items-center justify-between",
				children: [/* @__PURE__ */ jsx(DialogTitle, {
					className: "text-base font-semibold",
					children: "Edit Test creation"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setEditOpen(false),
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), editForm && /* @__PURE__ */ jsxs("div", {
				className: "px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex gap-0 border-b border-border",
						children: TYPE_TABS.map((tab) => /* @__PURE__ */ jsx("button", {
							onClick: () => setEdit("type", tab.value),
							className: cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors", editForm.type === tab.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
							children: tab.label
						}, tab.value))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Subject"
							}), /* @__PURE__ */ jsxs(Select, {
								value: editForm.subject,
								onValueChange: (v) => {
									setEdit("subject", v);
									setEdit("topic", "");
									setEdit("sub_topic", "");
								},
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: subjects.map((s) => /* @__PURE__ */ jsx(SelectItem, {
									value: s.id,
									children: s.name
								}, s.id)) })]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Name of Test"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.name,
								onChange: (e) => setEdit("name", e.target.value),
								placeholder: "Enter name of Test"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Topic"
							}), /* @__PURE__ */ jsxs(Select, {
								value: editForm.topic,
								onValueChange: (v) => {
									setEdit("topic", v);
									setEdit("sub_topic", "");
								},
								disabled: !editForm.subject,
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: topics.map((t) => /* @__PURE__ */ jsx(SelectItem, {
									value: t.id,
									children: t.name
								}, t.id)) })]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Sub Topic"
							}), /* @__PURE__ */ jsxs(Select, {
								value: editForm.sub_topic,
								onValueChange: (v) => setEdit("sub_topic", v),
								disabled: !editForm.topic,
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose from Drop-down" }) }), /* @__PURE__ */ jsx(SelectContent, { children: subTopics.map((st) => /* @__PURE__ */ jsx(SelectItem, {
									value: st.id,
									children: st.name
								}, st.id)) })]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Duration (Minutes)"
							}), /* @__PURE__ */ jsx(Input, {
								type: "number",
								min: 1,
								value: editForm.total_time,
								onChange: (e) => setEdit("total_time", e.target.value),
								placeholder: "Enter the time"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								className: "text-sm",
								children: "Test Difficulty Level"
							}), /* @__PURE__ */ jsx(RadioGroup, {
								value: editForm.difficulty,
								onValueChange: (v) => setEdit("difficulty", v),
								className: "flex items-center gap-4 h-10",
								children: [
									"easy",
									"medium",
									"hard"
								].map((d) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(RadioGroupItem, {
										value: d,
										id: `edit-diff-${d}`
									}), /* @__PURE__ */ jsx(Label, {
										htmlFor: `edit-diff-${d}`,
										className: "capitalize font-normal cursor-pointer text-sm",
										children: d === "hard" ? "Difficult" : d.charAt(0).toUpperCase() + d.slice(1)
									})]
								}, d))
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium mb-3",
						children: "Marking Scheme:"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 sm:grid-cols-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs text-muted-foreground",
									children: "Wrong Answer"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: editForm.wrong_marks,
									onChange: (e) => setEdit("wrong_marks", Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs text-muted-foreground",
									children: "Unattempted"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: editForm.unattempt_marks,
									onChange: (e) => setEdit("unattempt_marks", Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs text-muted-foreground",
									children: "Correct Answer"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: editForm.correct_marks,
									onChange: (e) => setEdit("correct_marks", Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs text-muted-foreground",
									children: "No of Questions"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 1,
									placeholder: "Ex 200 Marks",
									value: editForm.total_questions,
									onChange: (e) => setEdit("total_questions", e.target.value)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs text-muted-foreground",
									children: "Total Marks"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 0,
									placeholder: "Ex 200 Marks",
									value: editForm.total_marks,
									onChange: (e) => setEdit("total_marks", e.target.value)
								})]
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setEditOpen(false),
							disabled: saving,
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							onClick: handleSaveEdit,
							disabled: saving,
							className: "min-w-20",
							children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Save"]
						})]
					})
				]
			})]
		})
	})] });
}
//#endregion
export { PreviewPublish as component };
