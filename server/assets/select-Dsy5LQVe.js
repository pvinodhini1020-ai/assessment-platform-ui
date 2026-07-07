import { n as clearToken, p as getUser } from "./api-CZMD1aYE.js";
import { i as cn, n as Button } from "./input-BVh-hg82.js";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronDown, ChevronRight, ChevronUp, Circle, FlaskConical, LayoutDashboard, LineChart, LogOut, Menu, RefreshCw, Settings, X } from "lucide-react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/components/ui/avatar.tsx
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/app-shell.tsx
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/tests/create",
		label: "Test Creation",
		icon: FlaskConical
	},
	{
		to: "/tests/publish",
		label: "Test Tracking",
		icon: LineChart
	}
];
function Logo() {
	return /* @__PURE__ */ jsxs(Link, {
		to: "/",
		className: "flex items-center gap-0.5",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "text-xl font-bold tracking-tight text-foreground",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-primary",
				children: "P"
			}), "rep"]
		}), /* @__PURE__ */ jsx("span", {
			className: "text-xl font-bold tracking-tight text-primary",
			children: "route"
		})]
	});
}
function SidebarContent({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const signOut = () => {
		clearToken();
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col",
		children: [/* @__PURE__ */ jsx("nav", {
			className: "flex-1 pt-4",
			children: nav.map((item) => {
				const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
				const Icon = item.icon;
				return /* @__PURE__ */ jsxs(Link, {
					to: item.to,
					onClick: onNavigate,
					className: cn("flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2", active ? "border-l-primary text-primary font-medium bg-primary/5" : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"),
					children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: item.label })]
				}, item.to);
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "p-4 border-t border-border",
			children: /* @__PURE__ */ jsxs("button", {
				onClick: signOut,
				className: "flex w-full items-center gap-3 px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50",
				children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), " Sign out"]
			})
		})]
	});
}
function AppShell({ children }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	const user = getUser();
	const signOut = () => {
		clearToken();
		navigate({ to: "/login" });
	};
	const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "AW";
	const displayName = user?.name ?? "Alex Wando";
	const displayRole = user?.role ?? "Admin";
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen w-full bg-background",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "fixed top-0 left-0 right-0 z-30 flex h-14 items-center border-b border-border bg-white px-4 sm:px-6",
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "icon",
						className: "lg:hidden mr-2 h-8 w-8",
						onClick: () => setMobileOpen((v) => !v),
						"aria-label": "Toggle menu",
						children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Logo, {}),
					/* @__PURE__ */ jsxs("div", {
						className: "ml-auto flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							className: "text-muted-foreground hover:text-foreground transition-colors",
							"aria-label": "Refresh",
							children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsxs("button", {
								className: "flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted",
								children: [/* @__PURE__ */ jsx(Avatar, {
									className: "h-8 w-8",
									children: /* @__PURE__ */ jsx(AvatarFallback, {
										className: "bg-orange-400 text-white text-xs font-semibold",
										children: initials
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "hidden text-left sm:block",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium leading-tight",
										children: displayName
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground leading-tight capitalize",
										children: displayRole
									})]
								})]
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "w-48",
							children: [
								/* @__PURE__ */ jsx(DropdownMenuLabel, { children: "My Account" }),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, { children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }), " Settings"] }),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: signOut,
									className: "cursor-pointer",
									children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
								})
							]
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsx("aside", {
				className: "fixed top-14 bottom-0 left-0 z-20 hidden w-48 border-r border-border bg-white lg:flex lg:flex-col",
				children: /* @__PURE__ */ jsx(SidebarContent, {})
			}),
			mobileOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-foreground/20 backdrop-blur-sm",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ jsx("aside", {
					className: "absolute top-14 bottom-0 left-0 w-48 border-r border-border bg-white shadow-xl flex flex-col",
					children: /* @__PURE__ */ jsx(SidebarContent, { onNavigate: () => setMobileOpen(false) })
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "pt-14 lg:pl-48",
				children: /* @__PURE__ */ jsx("main", {
					className: "p-4 sm:p-6 lg:p-8",
					children
				})
			})
		]
	});
}
//#endregion
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
export { SelectValue as a, DropdownMenuContent as c, SelectTrigger as i, DropdownMenuItem as l, SelectContent as n, AppShell as o, SelectItem as r, DropdownMenu as s, Select as t, DropdownMenuTrigger as u };
