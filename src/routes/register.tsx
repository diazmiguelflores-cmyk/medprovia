import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container, PageHero } from "@/components/site/primitives";
import { sendEmailNotification, OFFICIAL_EMAIL } from "@/lib/email";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Get Verified", "Submit your medical license for direct verification — usually approved within 24 hours."),
  component: Register,
});

const steps = ["Practitioner", "Profession", "License", "Clinic", "Review"];
const licenses = ["MD", "DO", "DDS/DMD", "NP", "PA", "RN injector", "DVM"];

type RegisterData = {
  first: string;
  last: string;
  email: string;
  phone: string;
  license: string;
  specialty: string;
  licenseNo: string;
  state: string;
  file: string;
  clinic: string;
  address: string;
  city: string;
  country: string;
};

const initialData: RegisterData = {
  first: "",
  last: "",
  email: "",
  phone: "",
  license: "MD",
  specialty: "",
  licenseNo: "",
  state: "",
  file: "",
  clinic: "",
  address: "",
  city: "",
  country: "",
};

function Register() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [d, setD] = useState<RegisterData>(initialData);

  const set = (k: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setD((x) => ({ ...x, [k]: e.target.value }));

  const field = (k: keyof RegisterData, label: string, type = "text", placeholder?: string) => (
    <div className="space-y-2">
      <Label htmlFor={k} className="text-xs font-medium text-foreground">{label} *</Label>
      <Input id={k} type={type} required placeholder={placeholder} value={d[k]} onChange={set(k)} className="h-12 rounded-xl" />
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await sendEmailNotification({
        type: "verification",
        subject: `[License Verification] ${d.first} ${d.last} — ${d.clinic || "Clinic Application"}`,
        senderName: `${d.first} ${d.last}`.trim(),
        senderEmail: d.email,
        clinicName: d.clinic,
        data: {
          "Practitioner Name": `${d.first} ${d.last}`.trim(),
          "Professional Email": d.email,
          "Contact Phone": d.phone || "—",
          "License Type": d.license,
          "Specialty / Specialty Practice": d.specialty || "—",
          "License Number": d.licenseNo,
          "Issuing State / Country": d.state,
          "License Document": d.file || "Pending file upload",
          "Clinic Name": d.clinic,
          "Clinic Address": d.address,
          "Country": d.country,
          "Submitted To": OFFICIAL_EMAIL,
        },
      });
      toast.success("Verification request submitted to " + OFFICIAL_EMAIL);
      setDone(true);
    } catch (err) {
      toast.error("Submission error. Please email " + OFFICIAL_EMAIL + " directly.");
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <Container className="py-24 text-center lg:pt-40">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-foreground">Verification details submitted</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Your credentials and clinic documentation have been securely transmitted to our compliance desk at <strong className="text-foreground">{OFFICIAL_EMAIL}</strong>.
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
          Our team verifies medical licenses against state registers within 24 business hours and will email your approval.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/shop">Browse products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Container>
    );

  return (
    <>
      <PageHero eyebrow="License Verification" title="Verify your clinical credentials" sub="Medprovia supplies verified medical practices and licensed clinicians worldwide." />
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
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft"
          onSubmit={handleSubmit}
        >
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-5 sm:grid-cols-2">
              {step === 0 && (
                <>
                  {field("first", "First name", "text", "Dr. Sarah")}
                  {field("last", "Last name", "text", "Miller")}
                  {field("email", "Work / Clinic email", "email", "dr.miller@practice.com")}
                  {field("phone", "Direct phone", "tel", "+1 (555) 019-2834")}
                </>
              )}
              {step === 1 && (
                <div className="sm:col-span-2">
                  <p className="mb-3 text-sm font-medium text-foreground">License type *</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {licenses.map((l) => (
                      <button type="button" key={l} onClick={() => setD((x) => ({ ...x, license: l }))} aria-pressed={d["license"] === l} className={cn("min-h-12 rounded-xl border px-3 text-sm font-medium transition", d["license"] === l ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted")}>{l}</button>
                    ))}
                  </div>
                  <div className="mt-5">{field("specialty", "Specialty / Clinical practice", "text", "Dermatology, Aesthetics, Plastic Surgery...")}</div>
                </div>
              )}
              {step === 2 && (
                <>
                  {field("licenseNo", "Medical license number", "text", "MD-98432-NY")}
                  {field("state", "Issuing state / country", "text", "New York, USA")}
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground sm:col-span-2 hover:border-primary/50 transition">
                    <Upload className="h-6 w-6 text-primary" />
                    <span>{d["file"] ? `Selected: ${d["file"]}` : "Upload license copy (PDF, PNG or JPG)"}</span>
                    <span className="text-xs text-muted-foreground">Max 10MB</span>
                    <input type="file" className="sr-only" onChange={(e) => setD((x) => ({ ...x, file: e.target.files?.[0]?.name ?? "" }))} />
                  </label>
                </>
              )}
              {step === 3 && (
                <>
                  {field("clinic", "Clinic / Practice name", "text", "Eastside Aesthetic Institute")}
                  {field("address", "Clinic address", "text", "Suite 400, 100 Medical Plaza")}
                  {field("city", "City", "text", "New York")}
                  {field("country", "Country", "text", "United States")}
                </>
              )}
              {step === 4 && (
                <div className="sm:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 p-3 text-xs text-foreground">
                    <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                    <span>All information will be emailed directly to <strong>{OFFICIAL_EMAIL}</strong> for validation against state registries.</span>
                  </div>
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    {Object.entries(d).map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-muted/60 p-3">
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                        <dd className="font-medium text-foreground mt-0.5">{v || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-gold" />Verification usually completed within 24 business hours.</p>
          <div className="mt-6 flex justify-between gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" disabled={step === 0 || loading} onClick={() => setStep(step - 1)}>Back</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : step === steps.length - 1 ? (
                "Submit verification to email"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
}
