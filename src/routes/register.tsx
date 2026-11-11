import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container, PageHero } from "@/components/site/primitives";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Get Verified", "Register your professional account and verify your license — usually within 24 hours."),
  component: Register,
});

const steps = ["Account", "Profession", "License", "Clinic", "Review"];
const licenses = ["MD", "DO", "DDS/DMD", "NP", "PA", "RN injector", "DVM"];

function Register() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [d, setD] = useState<Record<string, string>>({ license: "MD" });
  const setVerified = useStore((s) => s.setVerified);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setD((x) => ({ ...x, [k]: e.target.value }));
  const field = (k: string, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} required value={d[k] ?? ""} onChange={set(k)} className="h-12 rounded-xl" />
    </div>
  );

  if (done)
    return (
      <Container className="py-24 text-center lg:pt-40">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></span>
        <h1 className="mt-6 text-4xl text-foreground">Application received</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">Verification usually completes within 24 hours. We'll email you once approved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild><Link to="/shop">Browse products</Link></Button>
          <Button variant="outline" onClick={() => setVerified(true)}>Demo: mark as verified</Button>
        </div>
      </Container>
    );

  return (
    <>
      <PageHero eyebrow="Get Verified" title="Create your professional account" sub="Medprovia supplies licensed healthcare professionals only." />
      <Container className="max-w-3xl py-10">
        <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-2 text-center">
              <span className={cn("grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold", i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary text-primary" : "border-border text-muted-foreground")} aria-current={i === step ? "step" : undefined}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">{s}</span>
            </li>
          ))}
        </ol>
        <form
          className="rounded-3xl border border-border bg-card p-6 sm:p-8"
          onSubmit={(e) => { e.preventDefault(); step < steps.length - 1 ? setStep(step + 1) : setDone(true); }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-5 sm:grid-cols-2">
              {step === 0 && <>{field("first", "First name")}{field("last", "Last name")}{field("email", "Work email", "email")}{field("password", "Password", "password")}</>}
              {step === 1 && (
                <div className="sm:col-span-2">
                  <p className="mb-3 text-sm font-medium text-foreground">License type</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {licenses.map((l) => (
                      <button type="button" key={l} onClick={() => setD((x) => ({ ...x, license: l }))} aria-pressed={d["license"] === l} className={cn("min-h-12 rounded-xl border px-3 text-sm font-medium", d["license"] === l ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground")}>{l}</button>
                    ))}
                  </div>
                  <div className="mt-5">{field("specialty", "Specialty / profession")}</div>
                </div>
              )}
              {step === 2 && (
                <>
                  {field("licenseNo", "License number")}{field("state", "Issuing state / country")}
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground sm:col-span-2">
                    <Upload className="h-6 w-6 text-primary" />{d["file"] ? d["file"] : "Upload license (PDF or image)"}
                    <input type="file" className="sr-only" onChange={(e) => setD((x) => ({ ...x, file: e.target.files?.[0]?.name ?? "" }))} />
                  </label>
                </>
              )}
              {step === 3 && <>{field("clinic", "Clinic / business name")}{field("phone", "Phone", "tel")}{field("address", "Address")}{field("country", "Country")}</>}
              {step === 4 && (
                <dl className="grid gap-3 text-sm sm:col-span-2 sm:grid-cols-2">
                  {Object.entries(d).filter(([k]) => k !== "password").map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-muted p-3"><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="font-medium text-foreground">{v || "—"}</dd></div>
                  ))}
                </dl>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-gold" />Verification usually within 24 hours.</p>
          <div className="mt-6 flex justify-between gap-2">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <Button type="submit">{step === steps.length - 1 ? "Submit for verification" : "Continue"}</Button>
          </div>
        </form>
      </Container>
    </>
  );
}
