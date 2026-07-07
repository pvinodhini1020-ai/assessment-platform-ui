import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, CheckCircle, Circle, ChevronsLeft, Brain, Check, Clock, HelpCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getTestApi,
  getToken,
  API_BASE_URL,
  type Test,
  type Question,
} from "@/lib/api";

export const Route = createFileRoute("/tests/questions")({
  validateSearch: z.object({ testId: z.string().optional() }),
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AddQuestions,
});

const OPTION_KEYS = ["option1", "option2", "option3", "option4"] as const;

const emptyForm = () => ({
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "",
  explanation: "",
  difficulty: "" as "" | "easy" | "medium" | "hard",
  topic: "",
  sub_topic: "",
});

type FormState = ReturnType<typeof emptyForm>;

function qBadgeClass(i: number, isActive: boolean) {
  if (isActive) return "text-green-600";
  return "text-slate-500";
}

function AddQuestions() {
  const navigate = useNavigate();
  const { testId } = Route.useSearch();

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only fetch test metadata — questions start empty (user creates them fresh)
  useEffect(() => {
    if (!testId) { setLoadingPage(false); return; }
    getTestApi(testId)
      .then((res) => setTest(res.data))
      .catch(() => toast.error("Failed to load test data"))
      .finally(() => setLoadingPage(false));
  }, [testId]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.question.trim()) errs.question = "Required";
    if (!form.option1.trim()) errs.option1 = "Required";
    if (!form.option2.trim()) errs.option2 = "Required";
    if (!form.option3.trim()) errs.option3 = "Required";
    if (!form.option4.trim()) errs.option4 = "Required";
    if (!form.correct_option) errs.correct_option = "Select the correct option";
    return errs;
  };

  const resetForm = () => {
    setForm(emptyForm()); setErrors({}); setEditingId(null);
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Save locally without API call
    const newQuestion = {
      id: `temp-${Date.now()}`, // Temporary ID for local storage
      test_id: testId || '',
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
      sub_topic: form.sub_topic,
    };

    if (editingId) {
      setQuestions((qs) => qs.map((q) => (q.id === editingId ? { ...newQuestion, id: editingId } : q)));
      toast.success("Question updated locally");
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success("Question added locally");
    }
    resetForm();
  };

  const handleEdit = (q: Question, idx: number) => {
    setForm({
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correct_option: q.correct_option,
      explanation: q.explanation ?? "",
      difficulty: (q.difficulty as FormState["difficulty"]) ?? "",
      topic: q.topic ?? "",
      sub_topic: q.sub_topic ?? "",
    });
    setEditingId(q.id);
    setErrors({});
  };

  const handleDelete = (id: string) => {
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

    // Save locally without API call
    const newQuestion = {
      id: `temp-${Date.now()}`, // Temporary ID for local storage
      test_id: testId || '',
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
      sub_topic: form.sub_topic,
    };

    if (editingId) {
      setQuestions((qs) => qs.map((q) => (q.id === editingId ? { ...newQuestion, id: editingId } : q)));
      toast.success("Question updated locally");
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success("Question added locally");
    }

    resetForm();
    toast.success("Moving to next question");

    // Scroll to the next question slot in sidebar and focus on question textarea
    setTimeout(() => {
      const nextSlot = document.querySelector(`[data-slot="slot-${questions.length}"]`);
      if (nextSlot) {
        nextSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // Focus on question textarea
      const questionTextarea = document.querySelector('textarea[placeholder="Type here"]') as HTMLTextAreaElement | null;
      if (questionTextarea) {
        questionTextarea.focus();
      }
    }, 100);
  };

  const handleNext = async () => {
    // 1. Validate the final question form data
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please complete all required fields for the final question before continuing");
      return;
    }
  
    // 2. Build the final question object from the current form state
    const finalQuestion = {
      id: editingId || `temp-${Date.now()}`,
      test_id: testId || '',
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
      sub_topic: form.sub_topic,
    };
  
    // 3. Construct the payload array directly combining existing questions and the final one
    let finalQuestionsList = [...questions];
    
    if (editingId) {
      // If editing the last question, swap it out in the array
      finalQuestionsList = finalQuestionsList.map((q) => (q.id === editingId ? finalQuestion : q));
    } else {
      // If it's a new final question, push it to the end
      finalQuestionsList.push(finalQuestion);
    }
  
    // 4. Guard clause check
    if (finalQuestionsList.length === 0) {
      toast.error("Add at least 1 question before continuing");
      return;
    }
  
    if (!testId) return;
    setSaving(true);
  
    try {
      // 5. Delete existing questions for this test to avoid duplicates
      const existingRes = await fetch(`${API_BASE_URL}/questions?test_id=${testId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const existingData = await existingRes.json();
      
      if (existingData.data && existingData.data.length > 0) {
        await Promise.all(
          existingData.data.map((q: Question) =>
            fetch(`${API_BASE_URL}/questions/${q.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${getToken()}` },
            })
          )
        );
      }
  
      // 6. Map everything directly into the bulk payload
      const bulkPayload = {
        questions: finalQuestionsList.map(q => ({
          type: "mcq",
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correct_option: q.correct_option,
          test_id: testId,
          subject: q.subject || test?.subject,
          ...(q.explanation && { explanation: q.explanation }),
          ...(q.difficulty && { difficulty: q.difficulty }),
          ...(q.topic && { topic: q.topic }),
          ...(q.sub_topic && { sub_topic: q.sub_topic }),
        }))
      };
  
      // 7. Fire API Request
      const res = await fetch(`${API_BASE_URL}/questions/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(bulkPayload),
      });
      
      const data = await res.json();
      if (!res.ok || data.status !== "success") throw new Error(data?.message ?? "Failed to upload questions");
  
      toast.success("All questions uploaded successfully");
      navigate({ to: "/tests/publish", search: { testId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload questions");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const total = test?.total_questions ?? 0;
  const currentQNum = editingId
    ? questions.findIndex((q) => q.id === editingId) + 1
    : questions.length + 1;

  const typeLabel =
    test?.type === "chapterwise" ? "Chapter Wise"
      : test?.type === "pyq" ? "PYQ"
        : test?.type === "mock" ? "Mock Test"
          : "Chapter Wise";

          console.log("questions.length",questions.length);
          console.log("total",total);

  const allDone = questions.length + 1 >= total && total > 0;

  return (
    <AppShell>
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>

        {/* Breadcrumb + Publish */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-white shrink-0">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Test Creation</Link>
            <span className="mx-0.5">/</span>
            <Link to="/tests/create" className="hover:text-foreground">Create Test</Link>
            <span className="mx-0.5">/</span>
            <span className="text-foreground">{typeLabel}</span>
          </nav>
          <Button
            size="sm"
            onClick={handleNext}
            className="h-8 rounded-md bg-primary px-5 text-xs text-white"
          >
            Publish
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden bg-white">

          {/* Left sidebar */}
          <div className={cn(
            "shrink-0 border-r border-border flex flex-col overflow-hidden transition-all duration-300",
            isCollapsed ? "w-9" : "w-[11.5rem]"
          )}>
            <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex flex-col">
                  <p className="text-[11px] font-semibold text-foreground">Question Creation</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Total Questions: {total}</p>
                </div>
              )}
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 -mr-1 rounded-sm hover:bg-muted">
                <ChevronsLeft className={cn("h-5 w-5 text-sky-500 transition-transform duration-300", isCollapsed && "rotate-180")} />
              </button>
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                {/* Created questions — clickable to edit */}
                {questions.map((q, i) => {
                  const isActive = editingId === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleEdit(q, i)}
                      className={cn(
                        "w-full text-left flex items-center justify-between px-2 py-1.5 rounded border border-green-500 bg-green-50 hover:bg-green-100",
                        isActive && "ring-2 ring-green-300 ring-offset-1"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-[11px] font-medium text-green-600">
                          Question {i + 1}
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-green-600" />
                    </button>
                  );
                })}

                {/* Remaining empty slots up to total */}
                {Array.from({ length: Math.max(0, total - questions.length) }).map((_, i) => {
                  const slotIdx = questions.length + i;
                  const isNext = i === 0; // only the very next slot is clickable
                  const isActiveNew = isNext && !editingId;
                  return (
                    <button
                      key={`slot-${slotIdx}`}
                      data-slot={`slot-${slotIdx}`}
                      onClick={isNext ? resetForm : undefined}
                      disabled={!isNext}
                      className={cn(
                        "w-full text-left flex items-center justify-between px-2 py-1.5 rounded border disabled:cursor-default",
                        isActiveNew ? "border-green-500 bg-green-50" : "border-transparent",
                        !isNext && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <Circle className={cn("h-3.5 w-3.5", isActiveNew ? "text-green-600" : "text-slate-400")} />
                        <span className={cn("text-[11px] font-medium", isActiveNew ? "text-green-600" : "text-slate-500")}>
                          Question {slotIdx + 1}
                        </span>
                      </div>
                      <ChevronRight className={cn("h-3 w-3", isActiveNew ? "text-green-600" : "text-slate-400")} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right editor */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Scrollable editor */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {test && (
                <div className="relative mt-4 rounded-lg border border-border bg-card px-5 pt-3 pb-4 shadow-sm overflow-hidden">
                  <button className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <div className="mb-2">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {typeLabel}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-[15px] font-bold text-foreground">
                      Chapter 1
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-500 px-3 py-0.5 text-[11px] font-semibold text-white tracking-wide">
                      <Check className="h-3 w-5" />
                      Easy
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
                </div>
              )}

              {/* Question N + MCQ/CRT */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Question {currentQNum}/{total}
                </span>
                <div className="flex items-center gap-1.5">
                  <button type="button" className="rounded border border-primary/40 px-2 py-0.5 text-[11px] text-primary hover:bg-primary/5">
                    + MCQ
                  </button>
                  <button type="button" className="rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/50">
                    CRT
                  </button>
                </div>
              </div>

              {/* Delete Article */}
              {editingId && (
                <button
                  onClick={() => handleDelete(editingId)}
                  className="-mt-2 flex items-center gap-1 text-[11px] text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete Article
                </button>
              )}

              {/* Toolbar + question textarea */}
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-[#f9f9f9] px-2 py-1">
                  {["B", "I", "U", "S", "x₂", "x²", "≡", "≡", "≡", "≡", "⊞", "⊟", "∑", "√", "∞"].map((t, i) => (
                    <button key={i} type="button" className="rounded px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground hover:bg-muted">{t}</button>
                  ))}
                </div>
                <div className="relative">
                  <Textarea
                    value={form.question}
                    onChange={(e) => set("question", e.target.value)}
                    placeholder="Type here"
                    className="min-h-[7.5rem] resize-none rounded-none border-0 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0"
                    aria-invalid={!!errors.question}
                  />
                  <span className="pointer-events-none absolute bottom-2 right-2 select-none text-[10px] text-muted-foreground/30">⊞</span>
                </div>
              </div>
              {errors.question && <p className="text-xs text-destructive -mt-2">{errors.question}</p>}

              {/* Options */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Type the options below</p>
                {errors.correct_option && <p className="text-xs text-destructive">{errors.correct_option}</p>}
                {OPTION_KEYS.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={form.correct_option === key}
                      onChange={() => set("correct_option", key)}
                      className="h-3.5 w-3.5 shrink-0 accent-primary"
                    />
                    <div className="relative flex-1">
                      <Input
                        value={form[key]}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder="Type Option here"
                        className={cn(
                          "h-9 pr-8 text-sm placeholder:text-muted-foreground/40",
                          form.correct_option === key && "border-primary bg-primary/5",
                        )}
                        aria-invalid={!!errors[key]}
                      />
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-[10px] text-muted-foreground/30">⊞</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Solution */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-foreground">Add Solution</p>
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <Textarea
                    value={form.explanation}
                    onChange={(e) => set("explanation", e.target.value)}
                    placeholder="Type here"
                    className="min-h-[5.5rem] resize-none rounded-none border-0 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0"
                  />
                  <span className="pointer-events-none absolute bottom-2 right-2 select-none text-[10px] text-muted-foreground/30">⊞</span>
                </div>
              </div>

              {/* Question settings */}
              <div className="space-y-3 pb-4">
                <p className="text-xs font-semibold text-foreground">Question settings</p>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Level of Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => set("difficulty", v as FormState["difficulty"])}>
                    <SelectTrigger className="h-9 text-sm text-muted-foreground">
                      <SelectValue placeholder="Select from Drop-down" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic — display-only from test, no extra API call */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Topic</Label>
                  <Select value={form.topic} onValueChange={(v) => set("topic", v)}>
                    <SelectTrigger className="h-9 text-sm text-muted-foreground">
                      <SelectValue placeholder="Select from Drop-down" />
                    </SelectTrigger>
                    <SelectContent>
                      {(test?.topics ?? []).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-topic — display-only from test, no extra API call */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Sub-topic</Label>
                  <Select value={form.sub_topic} onValueChange={(v) => set("sub_topic", v)}>
                    <SelectTrigger className="h-9 text-sm text-muted-foreground">
                      <SelectValue placeholder="Select from Drop-down" />
                    </SelectTrigger>
                    <SelectContent>
                      {(test?.sub_topics ?? []).map((st) => (
                        <SelectItem key={st} value={st}>{st}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-border bg-white px-5 py-3">
              <Button
                variant="outline"
                asChild
                className="h-8 border-destructive/50 px-4 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <Link to="/">Exit Test Creation</Link>
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNextQuestion}
                  disabled={saving || allDone}
                  className="h-8 bg-primary px-6 text-xs text-white disabled:opacity-50"
                >
                  {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Next Question
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={saving || !allDone}
                  className="h-8 bg-primary px-6 text-xs text-white disabled:opacity-50"
                >
                  {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
