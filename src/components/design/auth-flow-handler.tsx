"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const PENDING_EMAIL_KEY = "unishare:pendingEmail";
const PENDING_NAME_KEY = "unishare:pendingName";
const PENDING_CODE_KEY = "unishare:pendingCode";
const LOGIN_EMAIL_KEY = "unishare:loginEmail";
const LOGIN_CODE_KEY = "unishare:loginCode";
const RESET_EMAIL_KEY = "unishare:resetEmail";
const RESET_CODE_KEY = "unishare:resetCode";
const WELCOME_NAME_KEY = "unishare:welcomeName";

const DEV_NOTE = "Sandbox mode — no real email is sent.";

function goTo(path: string, ms = 900) {
  setTimeout(() => window.location.assign(path), ms);
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok && data.ok !== false, status: res.status, data };
}

/**
 * Wires the original design forms to the real backend. All listeners are
 * attached at document level in the CAPTURE phase, so they run before the
 * pages' own inline scripts while the visual design stays untouched.
 *
 *  /create-account  → POST /api/auth/register      → /confirm-email
 *  /confirm-email   → POST /api/auth/verify        → /student-verification
 *  /log-in          → POST /api/auth/login         → /login-2fa-6-digit-otp
 *  /login-2fa-…otp  → POST /api/auth/login-verify  → /campus-home (session cookie)
 *  /forgot-password → POST /api/auth/forgot        → /reset-password
 *  /reset-password  → POST /api/auth/reset         → /log-in
 *  student verification submit → POST /api/verification/submit → /verification-pending
 *  "Log out" links  → POST /api/auth/logout
 */
export function AuthFlowHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "") || "/";

    // ============================================================ create-account
    if (path === "/create-account") {
      const onSubmit = async (e: Event) => {
        const form = e.target as HTMLFormElement | null;
        if (!form || form.tagName !== "FORM") return;
        e.preventDefault();
        e.stopPropagation();

        const email = (form.querySelector("#email") as HTMLInputElement | null)?.value ?? "";
        const pw = (form.querySelector("#pw") as HTMLInputElement | null)?.value ?? "";
        const pw2 = (form.querySelector("#pw2") as HTMLInputElement | null)?.value ?? "";
        const agree = form.querySelector("input[type=checkbox]") as HTMLInputElement | null;

        if (!email.includes("@") || !email.includes(".")) {
          toast({ title: "Check your email", description: "That does not look like a university email." });
          return;
        }
        if (pw.length < 6) {
          toast({ title: "Password too short", description: "Use at least 6 characters." });
          return;
        }
        if (pw !== pw2) {
          toast({ title: "Passwords do not match", description: "Re-enter the same password in both fields." });
          return;
        }
        if (agree && !agree.checked) {
          toast({ title: "Almost there", description: "Please agree to the Terms of use first." });
          return;
        }

        const btn = form.querySelector("button") as HTMLButtonElement | null;
        if (btn) btn.disabled = true;

        const { ok, data } = await postJson("/api/auth/register", { email, password: pw });
        if (!ok) {
          toast({ title: "Registration failed", description: String(data.error ?? "Try again.") });
          if (btn) btn.disabled = false;
          return;
        }
        sessionStorage.setItem(PENDING_EMAIL_KEY, email);
        sessionStorage.setItem(PENDING_CODE_KEY, String(data.devCode ?? ""));
        const name = email.split("@")[0].split(/[._-]/)[0];
        sessionStorage.setItem(PENDING_NAME_KEY, name.charAt(0).toUpperCase() + name.slice(1));
        toast({
          title: "Account created",
          description: `Your 6-digit code is ${data.devCode} — enter it on the next page. ${DEV_NOTE}`,
          duration: 12000,
        });
        goTo("/confirm-email");
      };
      document.addEventListener("submit", onSubmit, true);
      return () => document.removeEventListener("submit", onSubmit, true);
    }

    // ============================================================ confirm-email
    if (path === "/confirm-email") {
      const pendingEmail = sessionStorage.getItem(PENDING_EMAIL_KEY);
      const codeBoxes = Array.from(
        document.querySelectorAll<HTMLInputElement>(".codes input, #codes input")
      );

      if (pendingEmail) {
        const emailEl = document.querySelector(".email");
        if (emailEl) emailEl.textContent = pendingEmail;
        codeBoxes.forEach((b) => (b.value = ""));
        if (codeBoxes.length) codeBoxes[0].focus();

        const pendingCode = sessionStorage.getItem(PENDING_CODE_KEY);
        if (pendingCode) {
          sessionStorage.removeItem(PENDING_CODE_KEY);
          toast({
            title: `Your code: ${pendingCode}`,
            description: `Type these six digits to continue. ${DEV_NOTE}`,
            duration: 20000,
          });
        }
      }

      const confirmBtn = Array.from(
        document.querySelectorAll<HTMLButtonElement>("button")
      ).find((b) => b.textContent.toLowerCase().includes("confirm"));

      const onConfirm = async () => {
        const email = pendingEmail ?? "";
        const code = codeBoxes.map((b) => b.value.replace(/\D/g, "")).join("");
        if (!email) {
          toast({ title: "No pending registration", description: "Register first — taking you there now." });
          goTo("/create-account", 1200);
          return;
        }
        if (code.length !== 6) {
          toast({ title: "Enter all 6 digits", description: "The code has exactly six digits." });
          return;
        }
        const { ok, data } = await postJson("/api/auth/verify", { email, code });
        if (!ok) {
          toast({ title: "Wrong code", description: String(data.error ?? "Try again.") });
          return;
        }
        sessionStorage.setItem(WELCOME_NAME_KEY, sessionStorage.getItem(PENDING_NAME_KEY) ?? "Student");
        toast({
          title: "Email confirmed 🎉",
          description: "Next step: student verification. Keep your student ID handy.",
          duration: 6000,
        });
        goTo("/student-verification", 1400);
      };

      if (confirmBtn) confirmBtn.addEventListener("click", onConfirm);

      const onResend = async (e: Event) => {
        const anchor = (e.target as HTMLElement | null)?.closest?.("a");
        if (!anchor || !/resend/i.test(anchor.textContent || "")) return;
        e.preventDefault();
        e.stopPropagation();
        const email = pendingEmail ?? "";
        if (!email) {
          toast({ title: "No pending registration", description: "Register first." });
          return;
        }
        const { ok, data } = await postJson("/api/auth/resend", { email, kind: "register" });
        if (!ok) {
          toast({ title: "Could not resend", description: String(data.error ?? "Try again.") });
          return;
        }
        toast({
          title: "New code sent",
          description: `Your code is ${data.devCode} — it expires in 10 minutes. ${DEV_NOTE}`,
          duration: 12000,
        });
      };
      document.addEventListener("click", onResend, true);

      return () => {
        if (confirmBtn) confirmBtn.removeEventListener("click", onConfirm);
        document.removeEventListener("click", onResend, true);
      };
    }

    // ============================================================ log-in
    if (path === "/log-in") {
      const onSubmit = async (e: Event) => {
        const form = e.target as HTMLFormElement | null;
        if (!form || form.tagName !== "FORM") return;
        e.preventDefault();
        e.stopPropagation();

        const email = (form.querySelector("#email") as HTMLInputElement | null)?.value.trim() ?? "";
        const pw = (form.querySelector("#pw") as HTMLInputElement | null)?.value ?? "";

        if (!email.includes("@")) {
          toast({ title: "Check your email", description: "Enter your university email." });
          return;
        }
        if (!pw) {
          toast({ title: "Enter your password", description: "Password cannot be empty." });
          return;
        }

        const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (btn) btn.disabled = true;

        const { ok, data } = await postJson("/api/auth/login", { email, password: pw });
        if (!ok) {
          toast({ title: "Cannot log in", description: String(data.error ?? "Try again.") });
          if (btn) btn.disabled = false;
          return;
        }
        sessionStorage.setItem(LOGIN_EMAIL_KEY, email);
        sessionStorage.setItem(LOGIN_CODE_KEY, String(data.devCode ?? ""));
        toast({
          title: "Code sent",
          description: `Your 6-digit login code is ${data.devCode}. ${DEV_NOTE}`,
          duration: 12000,
        });
        goTo("/login-2fa-6-digit-otp");
      };
      document.addEventListener("submit", onSubmit, true);
      return () => document.removeEventListener("submit", onSubmit, true);
    }

    // ============================================================ login 2FA OTP
    if (path === "/login-2fa-6-digit-otp") {
      const email = sessionStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
      if (!email) {
        toast({ title: "Log in first", description: "Enter your email and password on the log in page." });
        goTo("/log-in", 1400);
        return;
      }

      const code = sessionStorage.getItem(LOGIN_CODE_KEY);
      if (code) {
        sessionStorage.removeItem(LOGIN_CODE_KEY);
        toast({
          title: `Your login code: ${code}`,
          description: `Type these six digits to finish logging in. ${DEV_NOTE}`,
          duration: 20000,
        });
      }

      const err = document.getElementById("oerr");
      const setErr = (msg: string, bad = false) => {
        if (err) {
          err.style.color = bad ? "#b23a2f" : "#0d6b63";
          err.textContent = msg;
        }
      };

      const onSubmit = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const boxes = Array.from(document.querySelectorAll<HTMLInputElement>(".otp input"));
        const digits = boxes.map((b) => b.value.replace(/\D/g, "")).join("");
        if (digits.length < 6) {
          boxes.forEach((b) => !b.value && b.classList.add("bad"));
          setErr("Please enter all 6 digits.", true);
          return;
        }
        setErr("Checking your code…");
        const { ok, data } = await postJson("/api/auth/login-verify", { email, code: digits });
        if (!ok) {
          boxes.forEach((b) => b.classList.add("bad"));
          setErr(String(data.error ?? "That code does not match."), true);
          return;
        }
        sessionStorage.setItem(WELCOME_NAME_KEY, String(data.name ?? "Student"));
        setErr("Code accepted. Logging you in…");
        goTo("/campus-home", 700);
      };
      document.addEventListener("submit", onSubmit, true);

      // Resend code with a 30 s cooldown (replaces the design's demo handler)
      let cooldown: ReturnType<typeof setInterval> | null = null;
      const onResend = async (e: Event) => {
        const btn = (e.target as HTMLElement | null)?.closest?.("#resend");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        if ((btn as HTMLButtonElement).disabled) return;
        const { ok, data } = await postJson("/api/auth/resend", { email, kind: "login" });
        if (!ok) {
          toast({ title: "Could not resend", description: String(data.error ?? "Try again.") });
          return;
        }
        document.querySelectorAll<HTMLInputElement>(".otp input").forEach((b) => {
          b.value = "";
          b.classList.remove("bad", "filled");
        });
        const first = document.querySelector<HTMLInputElement>(".otp input");
        first?.focus();
        setErr("A new login code has been sent.");
        toast({
          title: `New code: ${data.devCode}`,
          description: `It expires in 10 minutes. ${DEV_NOTE}`,
          duration: 12000,
        });
        const el = btn as HTMLButtonElement;
        el.disabled = true;
        el.style.opacity = "0.6";
        let n = 30;
        el.textContent = `Resend code (${n}s)`;
        if (cooldown) clearInterval(cooldown);
        cooldown = setInterval(() => {
          n--;
          if (n <= 0) {
            if (cooldown) clearInterval(cooldown);
            cooldown = null;
            el.disabled = false;
            el.style.opacity = "1";
            el.textContent = "Resend code";
          } else {
            el.textContent = `Resend code (${n}s)`;
          }
        }, 1000);
      };
      document.addEventListener("click", onResend, true);

      return () => {
        document.removeEventListener("submit", onSubmit, true);
        document.removeEventListener("click", onResend, true);
        if (cooldown) clearInterval(cooldown);
      };
    }

    // ============================================================ forgot-password
    if (path === "/forgot-password") {
      const onSubmit = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const em = document.getElementById("femail") as HTMLInputElement | null;
        const err = document.getElementById("ferr");
        const info = document.getElementById("finfo");
        const btn = document.getElementById("fbtn") as HTMLButtonElement | null;
        const v = (em?.value ?? "").trim();

        const setErr = (msg: string, bad = false) => {
          if (err) {
            err.style.color = bad ? "#b23a2f" : "#0d6b63";
            err.textContent = msg;
          }
        };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          em?.classList.add("bad");
          setErr("Please enter a valid university email.", true);
          return;
        }

        if (btn) btn.disabled = true;
        setErr("Checking your email…");
        const { data } = await postJson("/api/auth/forgot", { email: v });
        if (btn) btn.disabled = false;

        if (data.devCode) {
          // account exists → open the reset page with the code applied
          sessionStorage.setItem(RESET_EMAIL_KEY, v);
          sessionStorage.setItem(RESET_CODE_KEY, String(data.devCode));
          setErr("Reset link opened — set a new password now.");
          if (info) info.textContent = "";
          toast({
            title: "Reset link opened",
            description: `Choose a new password for ${v}. ${DEV_NOTE}`,
            duration: 8000,
          });
          goTo("/reset-password", 1100);
        } else {
          // unknown email — same message a real mail service would give
          setErr("If an account exists for " + v + ", you’ll receive a reset link.");
          if (info) info.textContent = "Check your spam folder too.";
          if (btn) btn.innerHTML = "Resend reset link <span aria-hidden=\"true\">→</span>";
          toast({ title: "No account found", description: "We only open a reset for registered emails. Create an account instead?" });
        }
      };
      document.addEventListener("submit", onSubmit, true);
      return () => document.removeEventListener("submit", onSubmit, true);
    }

    // ============================================================ reset-password
    if (path === "/reset-password") {
      const email = sessionStorage.getItem(RESET_EMAIL_KEY) ?? "";
      const code = sessionStorage.getItem(RESET_CODE_KEY) ?? "";
      if (!email || !code) {
        toast({ title: "Start from Forgot password", description: "A reset link is needed to set a new password." });
        goTo("/forgot-password", 1600);
        return;
      }

      const onSubmit = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const npw = document.getElementById("npw") as HTMLInputElement | null;
        const cpw = document.getElementById("cpw") as HTMLInputElement | null;
        const err = document.getElementById("rerr");
        const rlen = document.getElementById("r-len");
        const rmix = document.getElementById("r-mix");
        const match = document.getElementById("match");

        const setErr = (msg: string, bad = false) => {
          if (err) {
            err.style.color = bad ? "#b23a2f" : "#0d6b63";
            err.textContent = msg;
          }
        };

        const nv = npw?.value ?? "";
        const cv = cpw?.value ?? "";
        const okLen = nv.length >= 8;
        const okMix = /[A-Za-z]/.test(nv) && /[0-9]/.test(nv);
        rlen?.classList.toggle("ok", okLen);
        rmix?.classList.toggle("ok", okMix);
        if (!cv) { if (match) { match.className = "mt"; match.textContent = ""; } }
        else if (cv === nv) { if (match) { match.className = "mt ok"; match.textContent = "✓ Passwords match"; } }
        else { if (match) { match.className = "mt no"; match.textContent = "Passwords do not match yet."; } }

        if (!okLen || !okMix) {
          npw?.classList.add("bad");
          setErr("New password needs at least 8 characters with a letter and a number.", true);
          return;
        }
        if (nv !== cv) {
          cpw?.classList.add("bad");
          setErr("Passwords do not match.", true);
          return;
        }

        setErr("Updating your password…");
        const { ok, data } = await postJson("/api/auth/reset", { email, code, password: nv });
        if (!ok) {
          setErr(String(data.error ?? "Could not reset the password."), true);
          return;
        }
        sessionStorage.removeItem(RESET_EMAIL_KEY);
        sessionStorage.removeItem(RESET_CODE_KEY);
        setErr("Password updated. Taking you to log in…");
        toast({
          title: "Password updated",
          description: "Log in with your new password.",
          duration: 6000,
        });
        goTo("/log-in", 1300);
      };
      document.addEventListener("submit", onSubmit, true);
      return () => document.removeEventListener("submit", onSubmit, true);
    }

    // ============================================================ student-verification
    if (path === "/student-verification") {
      // prefill the name from the registration (design ships sample data)
      const pendingName = sessionStorage.getItem(PENDING_NAME_KEY);
      const nameInput = document.getElementById("name") as HTMLInputElement | null;
      if (pendingName && nameInput) {
        const surname = (nameInput.value || "").trim().split(/\s+/).slice(1).join(" ");
        nameInput.value = surname ? `${pendingName} ${surname}` : pendingName;
      }

      const onSubmitClick = async (e: Event) => {
        const btn = (e.target as HTMLElement | null)?.closest?.("button");
        if (!btn || !/submit for review/i.test(btn.textContent || "")) return;
        e.preventDefault();
        e.stopPropagation();

        const val = (id: string) =>
          (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value?.trim() ?? "";
        const agree = document.querySelector(".agree input") as HTMLInputElement | null;

        const fullName = val("name");
        const studentId = val("sid");
        if (!fullName || !studentId) {
          toast({ title: "Missing details", description: "Your full name and student ID number are required." });
          return;
        }
        if (agree && !agree.checked) {
          toast({ title: "One more thing", description: "Please confirm the details and photos are yours." });
          return;
        }

        btn.disabled = true;
        const email =
          sessionStorage.getItem(PENDING_EMAIL_KEY) ??
          sessionStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
        const { ok, data } = await postJson("/api/verification/submit", {
          email,
          fullName,
          studentId,
          department: val("dept"),
          programme: val("prog"),
          academicSession: val("sess"),
        });
        btn.disabled = false;
        if (!ok) {
          toast({ title: "Could not submit", description: String(data.error ?? "Try again.") });
          return;
        }
        toast({
          title: data.alreadyPending ? "Already under review" : "Submitted for review",
          description: "Most reviews finish within a day. We'll notify you by email.",
          duration: 6000,
        });
        goTo("/verification-pending", 1200);
      };
      document.addEventListener("click", onSubmitClick, true);
      return () => document.removeEventListener("click", onSubmitClick, true);
    }

    // ============================================================ campus-home welcome
    if (path === "/campus-home") {
      const welcome = sessionStorage.getItem(WELCOME_NAME_KEY);
      if (welcome) {
        sessionStorage.removeItem(WELCOME_NAME_KEY);
        setTimeout(() => {
          toast({
            title: `Welcome back, ${welcome}! 👋`,
            description: "You're logged in — browse the marketplace or share a ride.",
            duration: 5000,
          });
        }, 600);
      }
    }

    // ============================================================ log out (every page)
    const onLogOut = async (e: Event) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const text = (anchor.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (text !== "log out") return;
      // end the session first, then follow the design's own link
      e.preventDefault();
      e.stopPropagation();
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // continue anyway
      }
      sessionStorage.removeItem(LOGIN_EMAIL_KEY);
      toast({ title: "Logged out", description: "See you soon on campus!" });
      goTo("/", 400);
    };
    document.addEventListener("click", onLogOut, true);
    return () => document.removeEventListener("click", onLogOut, true);
  }, [toast]);

  return null;
}
