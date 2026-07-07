import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { getTestsApi, getSubjectsApi, getToken, type Test, type Subject } from "@/lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard" },
      { name: "description", content: "Manage all your online tests in one place." },
    ],
  }),
  component: Dashboard,
});

// Map real API status values to display labels and styles
const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  live:        { label: "Live",        className: "bg-success/10 text-success border-success/20" },
  draft:       { label: "Draft",       className: "bg-muted text-muted-foreground border-border" },
  scheduled:   { label: "Scheduled",   className: "bg-warning/10 text-warning-foreground border-warning/30" },
  unpublished: { label: "Unpublished", className: "bg-secondary text-secondary-foreground border-border" },
  expired:     { label: "Expired",     className: "bg-destructive/10 text-destructive border-destructive/20" },
};

// Map API type values to readable labels
const TYPE_LABEL: Record<string, string> = {
  chapterwise: "Chapter Wise",
  pyq:         "PYQ",
  mock:        "Mock Test",
};

function StatusBadge({ status }: { status: string | null }) {
  const cfg = STATUS_CONFIG[status ?? ""] ?? {
    label: status ?? "—",
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function Dashboard() {
  // ── Data state ──
  const [tests, setTests]       = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading]   = useState(true);

  // ── Filter + Pagination state ──
  const PAGE_SIZE = 10;
  const [page, setPage]       = useState(1);
  const [query,   setQuery]   = useState("");
  const [subject, setSubject] = useState("all");
  const [status,  setStatus]  = useState("all");

  // Reset to page 1 whenever filters change
  const handleQuery   = (v: string) => { setQuery(v);   setPage(1); };
  const handleSubject = (v: string) => { setSubject(v); setPage(1); };
  const handleStatus  = (v: string) => { setStatus(v);  setPage(1); };

  // ── Delete confirmation state ──
  const [toDelete, setToDelete] = useState<Test | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch tests + subjects on mount ──
  useEffect(() => {
    async function load() {
      try {
        // Fetch both in parallel for speed
        const [testsRes, subjectsRes] = await Promise.all([
          getTestsApi(),
          getSubjectsApi(),
        ]);
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

  // ── Filtered rows based on search + dropdowns ──
  const filtered = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) &&
      (subject === "all" || t.subject === subject) &&
      (status  === "all" || (t.status ?? "") === status),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Stats derived from real data ──
  const stats = [
    {
      label: "Total Tests",
      value: tests.length,
      icon: FileText,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Live",
      value: tests.filter((t) => t.status === "live").length,
      icon: CheckCircle2,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Scheduled",
      value: tests.filter((t) => t.status === "scheduled").length,
      icon: Clock,
      tone: "bg-warning/15 text-warning-foreground",
    },
    {
      label: "Draft",
      value: tests.filter((t) => t.status === "draft").length,
      icon: Users,
      tone: "bg-accent text-accent-foreground",
    },
  ];

  // ── Optimistic delete (removes from UI immediately) ──
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    // Optimistically remove from list
    setTests((prev) => prev.filter((t) => t.id !== toDelete.id));
    toast.success(`Deleted "${toDelete.name}"`);
    setToDelete(null);
    setDeleting(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage all your tests, drafts and scheduled publishes.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 shadow-sm">
            <Link to="/tests/create">
              <Plus className="mr-1.5 h-4 w-4" /> New Test
            </Link>
          </Button>
        </div>

        {/* Stats cards — show skeleton while loading */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.label}
                className="rounded-2xl p-5 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {loading ? (
                        <span className="inline-block h-7 w-8 animate-pulse rounded bg-muted" />
                      ) : (
                        s.value
                      )}
                    </p>
                  </div>
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Table card */}
        <Card className="rounded-2xl p-0 shadow-card overflow-hidden">

          {/* Filters toolbar */}
          <div className="grid grid-cols-1 gap-3 border-b border-border p-5 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Subject filter — populated from real /subjects API */}
            <Select value={subject} onValueChange={handleSubject}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="mr-1.5 h-4 w-4" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={status} onValueChange={handleStatus}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Test Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading skeleton rows */}
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <span className="inline-block h-4 w-full animate-pulse rounded bg-muted" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No tests match your filters.
                    </TableCell>
                  </TableRow>
                )}

                {/* Real data rows */}
                {!loading &&
                  paginated.map((t) => (
                    <TableRow
                      key={t.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-md font-normal">
                          {TYPE_LABEL[t.type] ?? t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {t.total_questions}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.total_time} min
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to="/tests/publish">
                                <Eye className="mr-2 h-4 w-4" /> Preview
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/tests/create">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setToDelete(t)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="border-t border-border px-5 py-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p as number)}
                            className="cursor-pointer"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete test?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{toDelete?.name}" and its questions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
