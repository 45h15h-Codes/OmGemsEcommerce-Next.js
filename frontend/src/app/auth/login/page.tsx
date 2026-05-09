"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/auth";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// ─── Zod Schema ─────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Demo accounts for quick filling ────────────────────────

const DEMO_ACCOUNTS = [
  { label: "Super Admin", email: "admin@omgems.com" },
  { label: "Admin", email: "manager@omgems.com" },
  { label: "Partner", email: "vendor@partner.com" },
  { label: "Wholesale", email: "buyer@wholesale.com" },
  { label: "Retail", email: "customer@retail.com" },
];

// ─── Component ──────────────────────────────────────────────

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@omgems.com",
      password: "password",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    try {
      const user = await login(data);

      // Navigate to callback URL or role-based dashboard
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (user.redirect_path) {
        router.push(user.redirect_path);
      } else {
        router.push("/account"); // Fallback
      }
    } catch (err: unknown) {
      const error = err as { validationErrors?: Record<string, string[]>; message?: string };
      const message = error.validationErrors
        ? Object.values(error.validationErrors).flat().join(". ")
        : error.message ||
          "Authentication failed. Please verify your credentials.";
      setServerError(message);
    }
  };

  const fillDemoAccount = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "password", { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex text-foreground bg-background selection:bg-accent selection:text-foreground">
      {/* Left side: Editorial Image */}
      <div className="hidden lg:flex w-1/2 relative bg-muted items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted opacity-50 mix-blend-multiply" />

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center px-12"
        >
          <div className="font-serif italic text-4xl mb-4 tracking-tight text-muted-foreground">
            Om Gems
          </div>
          <p className="text-muted-foreground/80 tracking-widest text-sm uppercase">
            Exclusive Digital Salon
          </p>
        </motion.div>

        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-border" />
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo element for mobile */}
          <div className="lg:hidden font-serif italic text-3xl mb-12 tracking-tight text-foreground text-center">
            Om Gems
          </div>

          <div className="mb-12">
            <h1 className="font-serif text-3xl tracking-tight mb-3">
              Authentification
            </h1>
            <p className="text-muted-foreground text-sm font-sans tracking-wide">
              Please enter your credentials to access the Maison.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 font-sans"
            noValidate
          >
            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-[13px] text-red-800 bg-red-50 dark:bg-red-950/30 dark:text-red-300 p-4 border border-red-100 dark:border-red-900/50"
              >
                {serverError}
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Email field */}
              <div className="group relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="block w-full bg-transparent border-b border-border py-3 text-foreground placeholder-transparent focus:outline-none focus:border-foreground transition-colors peer text-sm"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:text-foreground peer-focus:uppercase tracking-wider peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:text-muted-foreground"
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="group relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="block w-full bg-transparent border-b border-border py-3 text-foreground placeholder-transparent focus:outline-none focus:border-foreground transition-colors peer text-sm tracking-widest"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:text-foreground peer-focus:uppercase tracking-wider peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:text-muted-foreground cursor-text"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs tracking-wider uppercase">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors pb-0.5 border-b border-transparent hover:border-foreground"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-4 w-4 text-background"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating
                  </span>
                ) : (
                  <span className="flex items-center gap-4">
                    Enter
                    <span className="block w-6 h-[1px] bg-background transform origin-left transition-transform group-hover:scale-x-150" />
                  </span>
                )}
              </motion.button>
            </div>
          </form>

          {/* Demo account helper row */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 text-center">
              Demonstration Access
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {DEMO_ACCOUNTS.map((role) => (
                <button
                  key={role.email}
                  type="button"
                  onClick={() => fillDemoAccount(role.email)}
                  className="text-[11px] border border-border px-3 py-1.5 hover:border-foreground hover:bg-muted transition-all"
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
