"use client";
import { useState } from "react";

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 border-b border-[#0F0F0F]/[0.07] last:border-0">
      <div>
        <h2 className="text-sm font-bold text-[#0F0F0F] [font-family:'Instrument_Serif',serif] mb-1">{title}</h2>
        <p className="text-xs text-[#6B6660] leading-relaxed">{desc}</p>
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6660]">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-[#6B6660]/60">{hint}</p>}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-[#0F0F0F]" : "bg-[#0F0F0F]/20"}`}>
      <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${enabled ? "left-[23px]" : "left-[3px]"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("TriggerInsta123");
  const [email, setEmail] = useState("user@example.com");
  const [igHandle, setIgHandle] = useState("@TriggerInsta123");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyTrigger, setNotifyTrigger] = useState(false);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="relative min-h-screen bg-[#F4F1EB] px-4 py-10 sm:px-6 lg:px-8 flex flex-col">
      <div className="relative z-10 w-full flex-1 flex flex-col">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-[#0F0F0F] tracking-tight [font-family:'Instrument_Serif',serif]">Settings</h1>
          <p className="text-xs text-[#6B6660] mt-1">Manage your account, integrations and preferences.</p>
        </div>

        <div className="bg-white/60 border border-[#0F0F0F]/[0.07] rounded-2xl px-8 backdrop-blur-sm flex-1">

          {/* Profile */}
          <Section title="Profile" desc="Your public name and contact details.">
            <Field label="Display name">
              <input
                className="bg-transparent border-b border-[#0F0F0F]/[0.1] py-2.5 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email address" hint="Used for login and notifications.">
              <input
                type="email"
                className="bg-transparent border-b border-[#0F0F0F]/[0.1] py-2.5 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </Section>

          {/* Instagram */}
          <Section title="Instagram account" desc="The connected Instagram account used for automations.">
            <Field label="Instagram handle" hint="This is the account TriggerInsta monitors for comments.">
              <input
                className="bg-transparent border-b border-[#0F0F0F]/[0.1] py-2.5 text-sm font-medium text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]/30 transition-all placeholder:text-[#6B6660]/40"
                value={igHandle} onChange={(e) => setIgHandle(e.target.value)}
              />
            </Field>
            <div className="flex items-center justify-between bg-[#0F0F0F]/[0.03] border border-[#0F0F0F]/[0.07] rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium text-[#0F0F0F]">Connected</p>
                  <p className="text-[10px] text-[#6B6660]">TriggerInsta123 · Instagram Business</p>
                </div>
              </div>
              <button className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">Disconnect</button>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications" desc="Choose when and how you get notified.">
            {[
              { label: "Email notifications", sub: "Receive a summary of activity to your email.", state: notifyEmail, toggle: () => setNotifyEmail(!notifyEmail) },
              { label: "Trigger alerts", sub: "Get notified each time a keyword is triggered.", state: notifyTrigger, toggle: () => setNotifyTrigger(!notifyTrigger) },
              { label: "Weekly digest", sub: "A weekly report of your automation performance.", state: notifyWeekly, toggle: () => setNotifyWeekly(!notifyWeekly) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#0F0F0F]/[0.05] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#0F0F0F]">{item.label}</p>
                  <p className="text-[11px] text-[#6B6660] mt-0.5">{item.sub}</p>
                </div>
                <Toggle enabled={item.state} onChange={item.toggle} />
              </div>
            ))}
          </Section>

          {/* Plan */}
          <Section title="Plan & billing" desc="Your current plan and usage.">
            <div className="flex items-center justify-between bg-[#0F0F0F]/[0.03] border border-[#0F0F0F]/[0.07] rounded-xl px-4 py-4">
              <div>
                <p className="text-sm font-bold text-[#0F0F0F] [font-family:'Instrument_Serif',serif]">Free plan</p>
                <p className="text-[11px] text-[#6B6660] mt-0.5">9 triggers included · 0 used</p>
              </div>
              <button className="text-xs font-medium text-white bg-[#0F0F0F] px-4 py-2 rounded-full hover:opacity-85 transition-all">
                Upgrade to Pro
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6B6660]">Triggers used</span>
                <span className="font-medium text-[#0F0F0F]">0 / 9</span>
              </div>
              <div className="h-1.5 bg-[#0F0F0F]/[0.07] rounded-full overflow-hidden">
                <div className="h-full bg-[#0F0F0F] rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          </Section>

          {/* Danger zone */}
          <Section title="Danger zone" desc="Irreversible actions. Proceed with caution.">
            <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-4">
              <div>
                <p className="text-sm font-medium text-red-700">Delete account</p>
                <p className="text-[11px] text-red-400 mt-0.5">Permanently delete your account and all data.</p>
              </div>
              <button className="text-xs font-medium text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-100 transition-all">
                Delete account
              </button>
            </div>
          </Section>

        </div>

        {/* Save bar */}
        <div className="flex items-center justify-end mt-6 gap-4">
          <p className="text-xs text-[#6B6660]">{saved ? "Changes saved." : "Unsaved changes will be lost."}</p>
          <button
            onClick={handleSave}
            className="text-white font-medium text-sm px-8 py-3 rounded-full hover:-translate-y-0.5 transition-all bg-[#0F0F0F] hover:opacity-85 flex items-center gap-2"
          >
            {saved ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Saved</>
            ) : "Save changes"}
          </button>
        </div>

      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>
    </section>
  );
}
