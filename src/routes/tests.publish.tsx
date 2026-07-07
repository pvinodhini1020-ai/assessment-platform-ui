import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, CheckCircle2, Loader2, Pencil, X, Brain, Check, Clock, HelpCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getTestApi,
  getQuestionsApi,
  getSubjectsApi,
  getTopicsApi,
  getSubTopicsApi,
  updateTestApi,
  createSubTopicsApi,
  fetchBulkApi,
  getToken,
  type Test,
  type Question,
  type Subject,
  type Topic,
  type SubTopic,
  type TestType,
} from "@/lib/api";

export const Route = createFileRoute("/tests/publish")({
  validateSearch: z.object({ testId: z.string().optional() }),
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Preview & Publish" },
      { name: "description", content: "Review and publish your test." },
    ],
  }),
  component: PreviewPublish,
});

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_KEYS = ["option1", "option2", "option3", "option4"] as const;
const TYPE_TABS: { value: TestType; label: string }[] = [
  { value: "chapterwise", label: "Chapter Wise" },
  { value: "pyq", label: "PYQ" },
  { value: "mock", label: "Mock Test" },
];

interface EditForm {
  type: TestType;
  name: string;
  subject: string;
  topic: string;
  sub_topic: string;
  total_time: string;
  difficulty: "easy" | "medium" | "hard";
  wrong_marks: number;
  unattempt_marks: number;
  correct_marks: number;
  total_questions: string;
  total_marks: string;
}

function PreviewPublish() {
  const navigate = useNavigate();
  const { testId } = Route.useSearch();

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Publish options state
  const [publishTab, setPublishTab] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [liveUntil, setLiveUntil] = useState<"always" | "1week" | "2weeks" | "3weeks" | "1month" | "custom">("always");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  useEffect(() => {
    if (!testId) { setLoading(false); return; }
    Promise.all([getTestApi(testId), getQuestionsApi(testId)])
      .then(([testRes, qRes]) => {
        console.log("Test ID:", testId);
        console.log("Questions API Response:", qRes);
        console.log("Questions data:", qRes.data);
        setTest(testRes.data);
        setQuestions(qRes.data ?? []);
      })
      .catch(() => toast.error("Failed to load test data"))
      .finally(() => setLoading(false));
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
      total_marks: String(test.total_marks),
    });
    getSubjectsApi().then((r) => setSubjects(r.data)).catch(() => { });
    if (test.subject) {
      getTopicsApi(test.subject).then((r) => setTopics(r.data)).catch(() => { });
    }
    if (test.topics?.[0]) {
      getSubTopicsApi([test.topics[0]]).then((r) => setSubTopics(r.data)).catch(() => { });
    }
    setEditOpen(true);
  };

  const setEdit = <K extends keyof EditForm>(k: K, v: EditForm[K]) =>
    setEditForm((f) => f ? { ...f, [k]: v } : f);

  useEffect(() => {
    if (!editForm?.subject) { setTopics([]); return; }
    getTopicsApi(editForm.subject).then((r) => setTopics(r.data)).catch(() => { });
  }, [editForm?.subject]);

  useEffect(() => {
    if (!editForm?.topic) { setSubTopics([]); return; }
    getSubTopicsApi([editForm.topic]).then((r) => setSubTopics(r.data)).catch(() => { });
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
        unattempt_marks: editForm.unattempt_marks,
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

  const handlePublish = async () => {
    if (!testId) return;
    if (questions.length === 0) {
      toast.error("No questions found. Add at least 1 question.");
      return;
    }
    setPublishing(true);
    try {
      await updateTestApi(testId, { status: "live" });
      setPublished(true);
      toast.success("Test published successfully!");
      setTimeout(() => navigate({ to: "/" }), 1800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish test");
    } finally {
      setPublishing(false);
    }
  };

  const handleSchedulePublish = async () => {
    if (!testId) return;
    if (questions.length === 0) {
      toast.error("No questions found. Add at least 1 question.");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both date and time for scheduling.");
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledDateTime <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }

    setScheduling(true);
    try {
      await updateTestApi(testId, {
        status: "scheduled",
        scheduled_date: scheduledDateTime.toISOString()
      });
      setScheduled(true);
      toast.success("Test scheduled successfully!");
      setTimeout(() => navigate({ to: "/" }), 1800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule test");
    } finally {
      setScheduling(false);
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
      // 1. Publish Test API - PUT /tests/:id with status: "live" (Critical)
      console.log("Publishing test...");
      await updateTestApi(testId, { status: "live" });
      console.log("Test published successfully");
      
      // 2. Sub Topic by Topic List API - POST /sub-topics/multi-topics (Non-critical)
      if (test.topics && test.topics.length > 0) {
        try {
          // Check if topics are valid UUIDs before calling the API
          const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
          const validTopicIds = test.topics.filter(topic => isValidUUID(topic));
          
          if (validTopicIds.length > 0) {
            console.log("Creating sub topics...");
            await createSubTopicsApi(validTopicIds);
            console.log("Sub topics created successfully");
          } else {
            console.log("Skipping sub topics API - no valid UUID topic IDs found");
          }
        } catch (subTopicErr) {
          console.error("Sub topics API failed (non-critical):", subTopicErr);
        }
      }
      
      // 3. Fetch Bulk API - POST /questions/fetchBulk (Non-critical)
      const questionIds = questions.map(q => q.id);
      if (questionIds.length > 0) {
        try {
          console.log("Fetching bulk questions...");
          await fetchBulkApi(questionIds);
          console.log("Bulk questions fetched successfully");
        } catch (fetchBulkErr) {
          console.error("Fetch bulk API failed (non-critical):", fetchBulkErr);
        }
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

  // Poll for scheduled tests to auto-publish
  useEffect(() => {
    if (!testId) return;

    const checkScheduledTest = async () => {
      try {
        const res = await getTestApi(testId);
        const currentTest = res.data;

        if (currentTest.status === "scheduled" && currentTest.scheduled_date) {
          const scheduledTime = new Date(currentTest.scheduled_date);
          const now = new Date();

          if (scheduledTime <= now) {
            // Auto-publish the test
            await updateTestApi(testId, { status: "live" });
            toast.success("Test auto-published as scheduled!");
          }
        }
      } catch (err) {
        console.error("Error checking scheduled test:", err);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkScheduledTest, 30000);

    // Initial check
    checkScheduledTest();

    return () => clearInterval(interval);
  }, [testId]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (published) {
    return (
      <AppShell>
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Test published!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your test is now live and available to your students.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  if (scheduled) {
    return (
      <AppShell>
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Test scheduled!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your test will be automatically published on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-white shrink-0">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Test Creation</Link>
            <span className="mx-0.5">/</span>
            <Link to="/tests/create" className="hover:text-foreground">Create Test</Link>
            <span className="mx-0.5">/</span>
            <span className="text-foreground">Preview & Publish</span>
          </nav>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden bg-white">
          {/* Left sidebar - Question Creation */}
          <div className="w-[11.5rem] shrink-0 border-r border-border flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Question Creation</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total Questions: {test?.total_questions ?? 0}</p>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
              {/* Created questions */}
              {questions.slice(0, test?.total_questions).map((q, i) => (
                <button
                  key={q.id}
                  className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded border border-green-500 bg-green-50 hover:bg-green-100"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-[11px] font-medium text-green-600">
                      Question {i + 1}
                    </span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-green-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Test created */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Test created</h2>
                <span className="text-sm text-muted-foreground">All {test?.total_questions} Questions done</span>
              </div>

              {/* Test overview card */}
              {test && (
                <Card className="relative rounded-lg border border-border bg-card px-5 pt-3 pb-4 shadow-sm overflow-hidden">
                  <button className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground" onClick={openEdit}>
                    <Pencil className="h-4 w-4" />
                  </button>

                  <div className="mb-2">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white capitalize">
                      {test.type === "chapterwise" ? "Chapter Wise" : test.type === "pyq" ? "PYQ" : "Mock Test"}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-[15px] font-bold text-foreground">
                      Chapter 1
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-500 px-3 py-0.5 text-[11px] font-semibold text-white tracking-wide">
                      <Check className="h-3 w-5" />
                      {test.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Subject</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">:</span>
                      <span className="font-medium text-foreground">{test.subject}</span>
                    </div>
                    {test.topics?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Topic</span>
                      </div>
                    )}
                    {test.topics?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">:</span>
                        <div className="flex flex-wrap gap-1">
                          {test.topics.slice(0, 3).map((t) => (
                            <span key={t} className="rounded border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {test.sub_topics?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Sub Topic</span>
                      </div>
                    )}
                    {test.sub_topics?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">:</span>
                        <span className="rounded border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700">{test.sub_topics[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm md:absolute md:-bottom-0 md:-right-0 md:my-3 md:mx-2 md:flex-row md:items-center md:px-2 md:py-1.5 text-[12px] font-medium text-[#6B7280]">
                    <div className="flex items-center gap-1.5 px-2">
                      <Clock className="h-4 w-4 text-[#A0A0A0]" />
                      <span>{test.total_time} Min</span>
                    </div>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] md:mx-1"></div>
                    <div className="flex items-center gap-1.5 px-2">
                      <HelpCircle className="h-4 w-4 text-[#A0A0A0]" />
                      <span>{test.total_questions} Q's</span>
                    </div>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] md:mx-1"></div>
                    <div className="flex items-center gap-1.5 px-2">
                      <Award className="h-4 w-4 text-[#A0A0A0]" />
                      <span>{test.total_marks} Marks</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Live Until Section */}
              {/* <Card className="rounded-2xl p-6 shadow-card space-y-4">
                <h2 className="text-base font-semibold">Live Until</h2>
                
                <RadioGroup value={liveUntil} onValueChange={(v) => setLiveUntil(v as typeof liveUntil)}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="always" id="always" />
                      <Label htmlFor="always" className="font-normal cursor-pointer text-sm">Always Available</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="1week" id="1week" />
                      <Label htmlFor="1week" className="font-normal cursor-pointer text-sm">1 Week</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="2weeks" id="2weeks" />
                      <Label htmlFor="2weeks" className="font-normal cursor-pointer text-sm">2 Weeks</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="3weeks" id="3weeks" />
                      <Label htmlFor="3weeks" className="font-normal cursor-pointer text-sm">3 Weeks</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="1month" id="1month" />
                      <Label htmlFor="1month" className="font-normal cursor-pointer text-sm">1 Month</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-normal cursor-pointer text-sm">Custom Duration</Label>
                    </div>
                  </div>
                </RadioGroup>

                {liveUntil === "custom" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm">End Date</Label>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                )}
              </Card> */}

              {/* Publish Tabs */}
              <div className="flex gap-0 border-b border-border">
                <button
                  onClick={() => setPublishTab("now")}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                    publishTab === "now"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Publish Now
                </button>
                <button
                  onClick={() => setPublishTab("schedule")}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                    publishTab === "schedule"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Schedule Publish
                </button>
              </div>

              {/* Publish Now Tab Content */}
              {publishTab === "now" && (
                <>
                  {/* Questions preview */}
                  <Card className="rounded-2xl p-6 shadow-card space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-gray-900">
                        Live Until
                      </h2>

                      <p className="text-sm leading-7 tracking-wide text-gray-500">
                        Choose how long this test should remain available on the platform.
                      </p>
                    </div>
                    <RadioGroup
                      value={liveUntil}
                      onValueChange={(v) => setLiveUntil(v as typeof liveUntil)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="always" id="always" />
                          <Label
                            htmlFor="always"
                            className="cursor-pointer text-sm font-medium"
                          >
                            Always Available
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="1week" id="1week" />
                          <Label
                            htmlFor="1week"
                            className="cursor-pointer text-sm font-medium"
                          >
                            1 Week
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="2weeks" id="2weeks" />
                          <Label
                            htmlFor="2weeks"
                            className="cursor-pointer text-sm font-medium"
                          >
                            2 Weeks
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="3weeks" id="3weeks" />
                          <Label
                            htmlFor="3weeks"
                            className="cursor-pointer text-sm font-medium"
                          >
                            3 Weeks
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="1month" id="1month" />
                          <Label
                            htmlFor="1month"
                            className="cursor-pointer text-sm font-medium"
                          >
                            1 Month
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label
                            htmlFor="custom"
                            className="cursor-pointer text-sm font-medium"
                          >
                            Custom Duration
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {liveUntil === "custom" && (
                      <div className="pt-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">End Date</Label>
                            <Input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="h-11 rounded-lg"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">End Time</Label>
                            <Input
                              type="time"
                              value={customEndTime}
                              onChange={(e) => setCustomEndTime(e.target.value)}
                              className="h-11 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLiveUntil("always");
                          setCustomEndDate("");
                          setCustomEndTime("");
                        }}
                        className="h-10 px-6 rounded-lg border-blue-600 text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={confirming}
                        className="h-10 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {confirming ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {/* Schedule Publish Tab Content */}
              {publishTab === "schedule" && (
                <>
                  {/* Schedule Publish Form */}
                  <Card className="rounded-2xl p-6 shadow-card space-y-6">
                    <div>
                      <h2 className="text-base font-semibold mb-1">Schedule Publish</h2>
                      <p className="text-sm text-muted-foreground">Select a date and time to automatically publish your test.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Date</Label>
                        <Input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Time</Label>
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    {scheduledDate && scheduledTime && (
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                        <p className="text-sm font-medium text-primary">
                          Scheduled for: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-gray-900">
                        Live Until
                      </h2>

                      <p className="text-sm leading-7 tracking-wide text-gray-500">
                        Choose how long this test should remain available on the platform.
                      </p>
                    </div>
                    <RadioGroup
                      value={liveUntil}
                      onValueChange={(v) => setLiveUntil(v as typeof liveUntil)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="always" id="always" />
                          <Label
                            htmlFor="always"
                            className="cursor-pointer text-sm font-medium"
                          >
                            Always Available
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="1week" id="1week" />
                          <Label
                            htmlFor="1week"
                            className="cursor-pointer text-sm font-medium"
                          >
                            1 Week
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="2weeks" id="2weeks" />
                          <Label
                            htmlFor="2weeks"
                            className="cursor-pointer text-sm font-medium"
                          >
                            2 Weeks
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="3weeks" id="3weeks" />
                          <Label
                            htmlFor="3weeks"
                            className="cursor-pointer text-sm font-medium"
                          >
                            3 Weeks
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="1month" id="1month" />
                          <Label
                            htmlFor="1month"
                            className="cursor-pointer text-sm font-medium"
                          >
                            1 Month
                          </Label>
                        </div>

                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label
                            htmlFor="custom"
                            className="cursor-pointer text-sm font-medium"
                          >
                            Custom Duration
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {liveUntil === "custom" && (
                      <div className="pt-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">End Date</Label>
                            <Input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="h-11 rounded-lg"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">End Time</Label>
                            <Input
                              type="time"
                              value={customEndTime}
                              onChange={(e) => setCustomEndTime(e.target.value)}
                              className="h-11 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setLiveUntil("always");
                          setCustomEndDate("");
                          setCustomEndTime("");
                        }}
                        className="h-10 px-6 rounded-lg border-blue-600 text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={() => {
                          // Add your confirm logic here
                          console.log("Confirmed");
                        }}
                        className="h-10 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Confirm
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Test Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-semibold">Edit Test creation</DialogTitle>
            <button onClick={() => setEditOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>

          {editForm && (
            <div className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Type tabs */}
              <div className="flex gap-0 border-b border-border">
                {TYPE_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setEdit("type", tab.value)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                      editForm.type === tab.value
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Row 1: Subject | Name of Test */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Subject</Label>
                  <Select value={editForm.subject} onValueChange={(v) => { setEdit("subject", v); setEdit("topic", ""); setEdit("sub_topic", ""); }}>
                    <SelectTrigger><SelectValue placeholder="Choose from Drop-down" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Name of Test</Label>
                  <Input value={editForm.name} onChange={(e) => setEdit("name", e.target.value)} placeholder="Enter name of Test" />
                </div>
              </div>

              {/* Row 2: Topic | Sub Topic */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Topic</Label>
                  <Select value={editForm.topic} onValueChange={(v) => { setEdit("topic", v); setEdit("sub_topic", ""); }} disabled={!editForm.subject}>
                    <SelectTrigger><SelectValue placeholder="Choose from Drop-down" /></SelectTrigger>
                    <SelectContent>
                      {topics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Sub Topic</Label>
                  <Select value={editForm.sub_topic} onValueChange={(v) => setEdit("sub_topic", v)} disabled={!editForm.topic}>
                    <SelectTrigger><SelectValue placeholder="Choose from Drop-down" /></SelectTrigger>
                    <SelectContent>
                      {subTopics.map((st) => <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Duration | Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Duration (Minutes)</Label>
                  <Input type="number" min={1} value={editForm.total_time} onChange={(e) => setEdit("total_time", e.target.value)} placeholder="Enter the time" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Test Difficulty Level</Label>
                  <RadioGroup
                    value={editForm.difficulty}
                    onValueChange={(v) => setEdit("difficulty", v as EditForm["difficulty"])}
                    className="flex items-center gap-4 h-10"
                  >
                    {(["easy", "medium", "hard"] as const).map((d) => (
                      <div key={d} className="flex items-center gap-1.5">
                        <RadioGroupItem value={d} id={`edit-diff-${d}`} />
                        <Label htmlFor={`edit-diff-${d}`} className="capitalize font-normal cursor-pointer text-sm">
                          {d === "hard" ? "Difficult" : d.charAt(0).toUpperCase() + d.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Marking Scheme */}
              <div>
                <p className="text-sm font-medium mb-3">Marking Scheme:</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Wrong Answer</Label>
                    <Input type="number" value={editForm.wrong_marks} onChange={(e) => setEdit("wrong_marks", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Unattempted</Label>
                    <Input type="number" value={editForm.unattempt_marks} onChange={(e) => setEdit("unattempt_marks", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Correct Answer</Label>
                    <Input type="number" value={editForm.correct_marks} onChange={(e) => setEdit("correct_marks", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">No of Questions</Label>
                    <Input type="number" min={1} placeholder="Ex 200 Marks" value={editForm.total_questions} onChange={(e) => setEdit("total_questions", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Total Marks</Label>
                    <Input type="number" min={0} placeholder="Ex 200 Marks" value={editForm.total_marks} onChange={(e) => setEdit("total_marks", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={saving} className="min-w-20">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
