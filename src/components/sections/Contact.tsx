import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Calendar, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { SectionHeading } from "@/components/ui/reveal";

const iconMap: Record<string, typeof Github> = { github: Github, linkedin: Linkedin, twitter: Twitter, mail: Mail };

function QrCode() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => Math.abs(Math.sin(i * 78.233 + 1) * 10000) % 1 > 0.55);
  return (
    <div className="grid aspect-square w-28 grid-cols-[repeat(21,1fr)] gap-px rounded-lg bg-foreground/90 p-2">
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-background" : "bg-transparent"} />
      ))}
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error, textarea }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <div className="relative">
      <label className={`pointer-events-none absolute left-3 font-mono text-xs transition-all ${active ? "top-1.5 text-secondary" : "top-3.5 text-muted-foreground"}`}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          rows={4}
          className="w-full resize-none rounded-xl glass px-3 pb-2 pt-6 text-sm outline-none focus:ring-1 focus:ring-secondary/50"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full rounded-xl glass px-3 pb-2 pt-6 text-sm outline-none focus:ring-1 focus:ring-secondary/50"
        />
      )}
      {error && <p className="mt-1 font-mono text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Invalid email";
    if (msg.trim().length < 10) e.msg = "Message too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName(""); setEmail(""); setMsg("");
    }, 3500);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-28">
      <SectionHeading kicker="// establish_link" title="Let's Connect" subtitle="Open for freelance, full-time roles and collaborations." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass corner-brackets relative rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 className="h-16 w-16 text-success" />
                </motion.div>
                <h3 className="mt-4 text-xl font-bold">Message Transmitted</h3>
                <p className="mt-1 text-sm text-muted-foreground">I'll respond within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Field label="Your Name" value={name} onChange={setName} error={errors.name} />
                <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} />
                <Field label="Message" value={msg} onChange={setMsg} error={errors.msg} textarea />
                <button
                  type="submit"
                  data-cursor="hover"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground neon-glow transition-transform hover:scale-[1.02]"
                >
                  Send Message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="font-mono text-xs uppercase tracking-wider text-secondary">Direct</div>
            <a href={`mailto:${profile.email}`} className="mt-2 block text-sm hover:text-secondary">{profile.email}</a>
            <a href={profile.calendarUrl} data-cursor="hover" className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/15 px-4 py-2 text-xs font-medium text-secondary ring-1 ring-secondary/40">
              <Calendar className="h-4 w-4" /> Book a Call
            </a>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-secondary">Channels</div>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = iconMap[s.icon] ?? Mail;
                return (
                  <a key={s.name} href={s.url} data-cursor="hover" title={s.name} className="flex h-10 w-10 items-center justify-center rounded-xl glass transition-colors hover:text-secondary hover:border-secondary/50">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="glass flex items-center gap-4 rounded-2xl p-6">
            <QrCode />
            <div className="text-xs text-muted-foreground">
              <div className="font-mono text-secondary">SCAN_ME</div>
              <p className="mt-1">Quick link to my profile & resume.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
