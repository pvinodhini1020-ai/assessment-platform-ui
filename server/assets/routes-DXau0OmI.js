import { c as getSubjectsApi, u as getTestsApi } from "./api-CZMD1aYE.js";
import { i as cn, n as Button, r as buttonVariants, t as Input } from "./input-BVh-hg82.js";
import { a as SelectValue, c as DropdownMenuContent, i as SelectTrigger, l as DropdownMenuItem, n as SelectContent, o as AppShell, r as SelectItem, s as DropdownMenu, t as Select, u as DropdownMenuTrigger } from "./select-Dsy5LQVe.js";
import { t as Card } from "./card-COiY8HSN.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileText, Filter, Loader2, MoreHorizontal, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { cva } from "class-variance-authority";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/components/ui/table.tsx
var Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ jsx("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
//#endregion
//#region src/components/ui/alert-dialog.tsx
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
//#endregion
//#region src/components/ui/pagination.tsx
var Pagination = ({ className, ...props }) => /* @__PURE__ */ jsx("nav", {
	role: "navigation",
	"aria-label": "pagination",
	className: cn("mx-auto flex w-full justify-center", className),
	...props
});
Pagination.displayName = "Pagination";
var PaginationContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	className: cn("flex flex-row items-center gap-1", className),
	...props
}));
PaginationContent.displayName = "PaginationContent";
var PaginationItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	className: cn("", className),
	...props
}));
PaginationItem.displayName = "PaginationItem";
var PaginationLink = ({ className, isActive, size = "icon", ...props }) => /* @__PURE__ */ jsx("a", {
	"aria-current": isActive ? "page" : void 0,
	className: cn(buttonVariants({
		variant: isActive ? "outline" : "ghost",
		size
	}), className),
	...props
});
PaginationLink.displayName = "PaginationLink";
var PaginationPrevious = ({ className, ...props }) => /* @__PURE__ */ jsxs(PaginationLink, {
	"aria-label": "Go to previous page",
	size: "default",
	className: cn("gap-1 pl-2.5", className),
	...props,
	children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Previous" })]
});
PaginationPrevious.displayName = "PaginationPrevious";
var PaginationNext = ({ className, ...props }) => /* @__PURE__ */ jsxs(PaginationLink, {
	"aria-label": "Go to next page",
	size: "default",
	className: cn("gap-1 pr-2.5", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
});
PaginationNext.displayName = "PaginationNext";
var PaginationEllipsis = ({ className, ...props }) => /* @__PURE__ */ jsxs("span", {
	"aria-hidden": true,
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
		className: "sr-only",
		children: "More pages"
	})]
});
PaginationEllipsis.displayName = "PaginationEllipsis";
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var STATUS_CONFIG = {
	live: {
		label: "Live",
		className: "bg-success/10 text-success border-success/20"
	},
	draft: {
		label: "Draft",
		className: "bg-muted text-muted-foreground border-border"
	},
	scheduled: {
		label: "Scheduled",
		className: "bg-warning/10 text-warning-foreground border-warning/30"
	},
	unpublished: {
		label: "Unpublished",
		className: "bg-secondary text-secondary-foreground border-border"
	},
	expired: {
		label: "Expired",
		className: "bg-destructive/10 text-destructive border-destructive/20"
	}
};
var TYPE_LABEL = {
	chapterwise: "Chapter Wise",
	pyq: "PYQ",
	mock: "Mock Test"
};
function StatusBadge({ status }) {
	const cfg = STATUS_CONFIG[status ?? ""] ?? {
		label: status ?? "—",
		className: "bg-muted text-muted-foreground border-border"
	};
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.className}`,
		children: cfg.label
	});
}
function Dashboard() {
	const [tests, setTests] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const PAGE_SIZE = 10;
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [subject, setSubject] = useState("all");
	const [status, setStatus] = useState("all");
	const handleQuery = (v) => {
		setQuery(v);
		setPage(1);
	};
	const handleSubject = (v) => {
		setSubject(v);
		setPage(1);
	};
	const handleStatus = (v) => {
		setStatus(v);
		setPage(1);
	};
	const [toDelete, setToDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	useEffect(() => {
		async function load() {
			try {
				const [testsRes, subjectsRes] = await Promise.all([getTestsApi(), getSubjectsApi()]);
				setTests(testsRes.data);
				setSubjects(subjectsRes.data);
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Failed to load data.";
				toast.error(msg);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);
	const filtered = tests.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) && (subject === "all" || t.subject === subject) && (status === "all" || (t.status ?? "") === status));
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const stats = [
		{
			label: "Total Tests",
			value: tests.length,
			icon: FileText,
			tone: "bg-primary/10 text-primary"
		},
		{
			label: "Live",
			value: tests.filter((t) => t.status === "live").length,
			icon: CheckCircle2,
			tone: "bg-success/10 text-success"
		},
		{
			label: "Scheduled",
			value: tests.filter((t) => t.status === "scheduled").length,
			icon: Clock,
			tone: "bg-warning/15 text-warning-foreground"
		},
		{
			label: "Draft",
			value: tests.filter((t) => t.status === "draft").length,
			icon: Users,
			tone: "bg-accent text-accent-foreground"
		}
	];
	const confirmDelete = async () => {
		if (!toDelete) return;
		setDeleting(true);
		setTests((prev) => prev.filter((t) => t.id !== toDelete.id));
		toast.success(`Deleted "${toDelete.name}"`);
		setToDelete(null);
		setDeleting(false);
	};
	return /* @__PURE__ */ jsxs(AppShell, { children: [/* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "truncate text-2xl font-bold tracking-tight sm:text-3xl",
						children: "Dashboard"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Manage all your tests, drafts and scheduled publishes."
					})]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					size: "lg",
					className: "shrink-0 shadow-sm",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/tests/create",
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1.5 h-4 w-4" }), " New Test"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: stats.map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ jsx(Card, {
						className: "rounded-2xl p-5 shadow-card transition-shadow hover:shadow-elevated",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-2xl font-bold",
								children: loading ? /* @__PURE__ */ jsx("span", { className: "inline-block h-7 w-8 animate-pulse rounded bg-muted" }) : s.value
							})] }), /* @__PURE__ */ jsx("div", {
								className: `grid h-11 w-11 place-items-center rounded-xl ${s.tone}`,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							})]
						})
					}, s.label);
				})
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "rounded-2xl p-0 shadow-card overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 gap-3 border-b border-border p-5 md:grid-cols-[1fr_auto_auto]",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
									placeholder: "Search tests...",
									value: query,
									onChange: (e) => handleQuery(e.target.value),
									className: "pl-9"
								})]
							}),
							/* @__PURE__ */ jsxs(Select, {
								value: subject,
								onValueChange: handleSubject,
								children: [/* @__PURE__ */ jsxs(SelectTrigger, {
									className: "w-full md:w-44",
									children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1.5 h-4 w-4" }), /* @__PURE__ */ jsx(SelectValue, { placeholder: "Subject" })]
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
									value: "all",
									children: "All Subjects"
								}), subjects.map((s) => /* @__PURE__ */ jsx(SelectItem, {
									value: s.name,
									children: s.name
								}, s.id))] })]
							}),
							/* @__PURE__ */ jsxs(Select, {
								value: status,
								onValueChange: handleStatus,
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "w-full md:w-36",
									children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "live",
										children: "Live"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "draft",
										children: "Draft"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "scheduled",
										children: "Scheduled"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "unpublished",
										children: "Unpublished"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "expired",
										children: "Expired"
									})
								] })]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, {
							className: "bg-muted/40 hover:bg-muted/40",
							children: [
								/* @__PURE__ */ jsx(TableHead, { children: "Test Name" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Type" }),
								/* @__PURE__ */ jsx(TableHead, {
									className: "text-center",
									children: "Questions"
								}),
								/* @__PURE__ */ jsx(TableHead, { children: "Duration" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
								/* @__PURE__ */ jsx(TableHead, { className: "w-12" })
							]
						}) }), /* @__PURE__ */ jsxs(TableBody, { children: [
							loading && Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(TableRow, { children: Array.from({ length: 7 }).map((_, j) => /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-full animate-pulse rounded bg-muted" }) }, j)) }, i)),
							!loading && filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: 7,
								className: "h-32 text-center text-muted-foreground",
								children: "No tests match your filters."
							}) }),
							!loading && paginated.map((t) => /* @__PURE__ */ jsxs(TableRow, {
								className: "transition-colors hover:bg-muted/30",
								children: [
									/* @__PURE__ */ jsx(TableCell, {
										className: "font-medium",
										children: t.name
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-muted-foreground",
										children: t.subject
									}),
									/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "rounded-md font-normal",
										children: TYPE_LABEL[t.type] ?? t.type
									}) }),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-center tabular-nums",
										children: t.total_questions
									}),
									/* @__PURE__ */ jsxs(TableCell, {
										className: "text-muted-foreground",
										children: [t.total_time, " min"]
									}),
									/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: t.status }) }),
									/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8",
											children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
										})
									}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
										align: "end",
										children: [
											/* @__PURE__ */ jsx(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ jsxs(Link, {
													to: "/tests/publish",
													children: [/* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }), " Preview"]
												})
											}),
											/* @__PURE__ */ jsx(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ jsxs(Link, {
													to: "/tests/create",
													children: [/* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }), " Edit"]
												})
											}),
											/* @__PURE__ */ jsxs(DropdownMenuItem, {
												className: "text-destructive focus:text-destructive",
												onClick: () => setToDelete(t),
												children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }), " Delete"]
											})
										]
									})] }) })
								]
							}, t.id))
						] })] })
					}),
					!loading && totalPages > 1 && /* @__PURE__ */ jsxs("div", {
						className: "border-t border-border px-5 py-3 flex items-center justify-between text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							"Showing ",
							(page - 1) * PAGE_SIZE + 1,
							"–",
							Math.min(page * PAGE_SIZE, filtered.length),
							" of ",
							filtered.length
						] }), /* @__PURE__ */ jsx(Pagination, {
							className: "w-auto mx-0",
							children: /* @__PURE__ */ jsxs(PaginationContent, { children: [
								/* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationPrevious, {
									onClick: () => setPage((p) => Math.max(1, p - 1)),
									"aria-disabled": page === 1,
									className: page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
								}) }),
								Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1).reduce((acc, p, idx, arr) => {
									if (idx > 0 && p - arr[idx - 1] > 1) acc.push("ellipsis");
									acc.push(p);
									return acc;
								}, []).map((p, i) => p === "ellipsis" ? /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }, `e-${i}`) : /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationLink, {
									isActive: page === p,
									onClick: () => setPage(p),
									className: "cursor-pointer",
									children: p
								}) }, p)),
								/* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationNext, {
									onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
									"aria-disabled": page === totalPages,
									className: page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
								}) })
							] })
						})]
					})
				]
			})
		]
	}), /* @__PURE__ */ jsx(AlertDialog, {
		open: !!toDelete,
		onOpenChange: (o) => !o && setToDelete(null),
		children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete test?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
			"This will permanently remove \"",
			toDelete?.name,
			"\" and its questions. This action cannot be undone."
		] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
			disabled: deleting,
			children: "Cancel"
		}), /* @__PURE__ */ jsxs(AlertDialogAction, {
			onClick: confirmDelete,
			disabled: deleting,
			className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			children: [deleting ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Delete"]
		})] })] })
	})] });
}
//#endregion
export { Dashboard as component };
