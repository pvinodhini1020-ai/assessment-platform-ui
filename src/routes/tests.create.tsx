import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getSubjectsApi,
  getTopicsApi,
  getSubTopicsApi,
  createTestApi,
  getToken,
  type Subject,
  type Topic,
  type SubTopic,
  type TestType,
} from "@/lib/api";

export const Route = createFileRoute("/tests/create")({
  beforeLoad: ({ location }) => {
    if (!getToken()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [
      { title: "Create Test" },
      { name: "description", content: "Create a new chapter-wise, PYQ or mock test." },
    ],
  }),
  component: CreateTest,
});

const TYPE_LABEL: Record<TestType, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

interface FormState {
  name: string;
  type: TestType;
  subject: string;
  topic: string;
  sub_topic: string;
  difficulty: "easy" | "medium" | "hard";
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: string;
  total_marks: string;
  total_questions: string;
}

function CreateTest() {
  const navigate = useNavigate();
  const { type: routeType } = Route.useSearch() as { type?: TestType };

  const [form, setForm] = useState<FormState>({
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
    total_questions: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const [subjects, setSubjects]     = useState<Subject[]>([]);
  const [topics, setTopics]         = useState<Topic[]>([]);
  const [subTopics, setSubTopics]   = useState<SubTopic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTopics, setLoadingTopics]     = useState(false);
  const [loadingSubTopics, setLoadingSubTopics] = useState(false);

  useEffect(() => {
    getSubjectsApi()
      .then((r) => setSubjects(r.data))
      .catch(() => toast.error("Failed to load subjects"))
      .finally(() => setLoadingSubjects(false));
  }, []);

  useEffect(() => {
    if (!form.subject) { setTopics([]); return; }
    setLoadingTopics(true);
    setForm((f) => ({ ...f, topic: "", sub_topic: "" }));
    setSubTopics([]);
    getTopicsApi(form.subject)
      .then((r) => setTopics(r.data))
      .catch(() => toast.error("Failed to load topics"))
      .finally(() => setLoadingTopics(false));
  }, [form.subject]);

  useEffect(() => {
    if (!form.topic) { setSubTopics([]); return; }
    setLoadingSubTopics(true);
    setForm((f) => ({ ...f, sub_topic: "" }));
    getSubTopicsApi([form.topic])
      .then((r) => setSubTopics(r.data))
      .catch(() => toast.error("Failed to load sub-topics"))
      .finally(() => setLoadingSubTopics(false));
  }, [form.topic]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim())      errs.name            = "Required";
    if (!form.subject)          errs.subject         = "Required";
    if (!form.topic)            errs.topic           = "Required";
    if (!form.total_time)       errs.total_time      = "Required";
    if (!form.total_questions)  errs.total_questions = "Required";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error("Please complete required fields"); return; }

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
        status: "draft",
      });
      toast.success("Test created");
      navigate({ to: "/tests/questions", search: { testId: res.data.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Test Creation</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-medium border-b border-dashed border-primary">
            Create Test
          </span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{TYPE_LABEL[form.type]}</span>
        </nav>

        <Card className="rounded-2xl p-6 shadow-card space-y-5">

          {/* Row 1: Subject | Name of Test */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Subject" error={errors.subject}>
              <Select value={form.subject} onValueChange={(v) => set("subject", v)} disabled={loadingSubjects}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingSubjects ? "Loading…" : "Choose from Drop-down"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Name of Test" error={errors.name}>
              <Input
                placeholder="Enter name of Test"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
              />
            </Field>
          </div>

          {/* Row 2: Topic | Sub Topic */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Topic" error={errors.topic}>
              <Select value={form.topic} onValueChange={(v) => set("topic", v)} disabled={!form.subject || loadingTopics}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingTopics ? "Loading…" : "Choose from Drop-down"} />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Sub Topic">
              <Select value={form.sub_topic} onValueChange={(v) => set("sub_topic", v)} disabled={!form.topic || loadingSubTopics}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingSubTopics ? "Loading…" : "Choose from Drop-down"} />
                </SelectTrigger>
                <SelectContent>
                  {subTopics.map((st) => (
                    <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Row 3: Duration | Difficulty */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Duration (Minutes)" error={errors.total_time}>
              <Input
                type="number"
                min={1}
                placeholder="Enter the time"
                value={form.total_time}
                onChange={(e) => set("total_time", e.target.value)}
                aria-invalid={!!errors.total_time}
              />
            </Field>

            <Field label="Test Difficulty Level">
              <RadioGroup
                value={form.difficulty}
                onValueChange={(v) => set("difficulty", v as typeof form.difficulty)}
                className="flex items-center gap-6 h-10"
              >
                {DIFFICULTIES.map((d) => (
                  <div key={d} className="flex items-center gap-2">
                    <RadioGroupItem value={d} id={`diff-${d}`} />
                    <Label htmlFor={`diff-${d}`} className="capitalize font-normal cursor-pointer">
                      {d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Difficult"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Field>
          </div>

          {/* Marking Scheme */}
          <div>
            <p className="text-sm font-medium mb-3">Marking Scheme</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <Field label="Wrong Answer">
                <Input
                  type="number"
                  value={form.wrong_marks}
                  onChange={(e) => set("wrong_marks", Number(e.target.value))}
                />
              </Field>
              <Field label="Unattempted">
                <Input
                  type="number"
                  value={form.unattempt_marks}
                  onChange={(e) => set("unattempt_marks", Number(e.target.value))}
                />
              </Field>
              <Field label="Correct Answer">
                <Input
                  type="number"
                  value={form.correct_marks}
                  onChange={(e) => set("correct_marks", Number(e.target.value))}
                />
              </Field>
              <Field label="No of Questions" error={errors.total_questions}>
                <Input
                  type="number"
                  min={1}
                  placeholder="Ex 200 Marks"
                  value={form.total_questions}
                  onChange={(e) => set("total_questions", e.target.value)}
                  aria-invalid={!!errors.total_questions}
                />
              </Field>
              <Field label="Total Marks">
                <Input
                  type="number"
                  min={0}
                  placeholder="Ex 200 Marks"
                  value={form.total_marks}
                  onChange={(e) => set("total_marks", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" asChild disabled={submitting}>
              <Link to="/">Cancel</Link>
            </Button>
            <Button onClick={submit} disabled={submitting} className="min-w-24">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Next
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
