"use client";

import "@/app/pages.css";
import "@/app/dashboard.css";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Heart, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type State =
  | { status: "loading" }
  | { status: "ready"; isLoggedIn: boolean }
  | { status: "joining" }
  | { status: "success" }
  | { status: "already_connected" }
  | { status: "own_code" }
  | { status: "invalid" }
  | { status: "error"; message: string };

export default function JoinClient({ code }: { code: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const init = async () => {
      // Validate the code exists
      const { data: couple, error } = await supabase
        .from("couples")
        .select("id, invite_code, status, created_by")
        .eq("invite_code", code.toUpperCase())
        .single();

      if (error || !couple) {
        setState({ status: "invalid" });
        return;
      }

      // Check auth state
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState({ status: "ready", isLoggedIn: false });
        return;
      }

      // User is logged in — check if it's their own code
      if (couple.created_by === user.id) {
        setState({ status: "own_code" });
        return;
      }

      // Check if already in a couple
      const { data: membership } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", user.id)
        .single();

      if (membership?.couple_id === couple.id) {
        // Already in this exact couple — treat as success
        setState({ status: "already_connected" });
        return;
      }

      setState({ status: "ready", isLoggedIn: true });
    };

    init();
  }, [code, supabase]);

  const handleJoin = async () => {
    setState({ status: "joining" });
    const supabaseClient = createClient();

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      setState({ status: "ready", isLoggedIn: false });
      return;
    }

    try {
      const { data: couple } = await supabaseClient
        .from("couples")
        .select("id, status, created_by")
        .eq("invite_code", code.toUpperCase())
        .single();

      if (!couple) { setState({ status: "invalid" }); return; }

      // Leave any existing waiting couple first
      const { data: existing } = await supabaseClient
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", user.id)
        .single();

      if (existing?.couple_id && existing.couple_id !== couple.id) {
        const { data: existingCouple } = await supabaseClient
          .from("couples")
          .select("status, created_by")
          .eq("id", existing.couple_id)
          .single();

        if (existingCouple?.status === "connected") {
          setState({ status: "already_connected" });
          return;
        }
        // Abandon waiting couple
        if (existingCouple?.created_by === user.id) {
          await supabaseClient.from("couples").delete().eq("id", existing.couple_id);
        } else {
          await supabaseClient.from("couple_members")
            .delete()
            .eq("couple_id", existing.couple_id)
            .eq("user_id", user.id);
        }
      }

      await supabaseClient.from("couple_members").upsert(
        { couple_id: couple.id, user_id: user.id },
        { onConflict: "couple_id,user_id" }
      );

      await supabaseClient.from("couples")
        .update({ status: "connected" })
        .eq("id", couple.id);

      setState({ status: "success" });
      setTimeout(() => router.push("/discover"), 2000);
    } catch (err: any) {
      setState({ status: "error", message: err?.message ?? "Something went wrong" });
    }
  };

  const loginUrl = `/login?redirect=${encodeURIComponent(`/join/${code}`)}`;

  return (
    <div className="join-page">
      {/* Background orbs */}
      <div className="join-orb join-orb-1" />
      <div className="join-orb join-orb-2" />

      <div className="join-card">
        {/* Logo */}
        <div className="join-logo-wrap">
          <Image src="/logo.png" alt="Namely" width={56} height={56} className="join-logo" priority />
        </div>

        {/* Loading */}
        {state.status === "loading" && (
          <div className="join-state">
            <Loader2 size={32} className="join-spin" />
            <p>Checking invite…</p>
          </div>
        )}

        {/* Invalid code */}
        {state.status === "invalid" && (
          <div className="join-state">
            <div className="join-icon join-icon--error"><AlertCircle size={28} /></div>
            <h2>Invalid Invite</h2>
            <p>This invite link is no longer valid or has already been used.</p>
            <Link href="/login" className="btn btn--primary">Open Namely</Link>
          </div>
        )}

        {/* Own code */}
        {state.status === "own_code" && (
          <div className="join-state">
            <div className="join-icon">😅</div>
            <h2>That&apos;s your own code!</h2>
            <p>Share this link with your partner so they can join you.</p>
            <Link href="/discover" className="btn btn--primary">Go to Discover</Link>
          </div>
        )}

        {/* Already connected */}
        {state.status === "already_connected" && (
          <div className="join-state">
            <div className="join-icon join-icon--success"><CheckCircle size={28} /></div>
            <h2>Already connected!</h2>
            <p>You&apos;re already linked with your partner.</p>
            <Link href="/discover" className="btn btn--primary">Start Swiping →</Link>
          </div>
        )}

        {/* Success */}
        {state.status === "success" && (
          <div className="join-state">
            <div className="join-icon join-icon--success">💑</div>
            <h2>You&apos;re connected!</h2>
            <p>Taking you to Discover…</p>
            <div className="join-progress-bar"><div className="join-progress-fill" /></div>
          </div>
        )}

        {/* Error */}
        {state.status === "error" && (
          <div className="join-state">
            <div className="join-icon join-icon--error"><AlertCircle size={28} /></div>
            <h2>Something went wrong</h2>
            <p>{state.message}</p>
            <button className="btn btn--primary" onClick={handleJoin}>Try Again</button>
          </div>
        )}

        {/* Ready state */}
        {state.status === "ready" && (
          <>
            <div className="join-hero">
              <div className="join-icon join-icon--heart"><Heart size={28} fill="white" /></div>
            </div>
            <h1 className="join-title">You&apos;ve been invited!</h1>
            <p className="join-subtitle">
              Your partner wants to discover baby names together on Namely.
            </p>

            <div className="join-code-badge">
              <span className="join-code-label">Invite code</span>
              <span className="join-code-value">{code.toUpperCase()}</span>
            </div>

            {state.isLoggedIn ? (
              /* Logged-in: single join button */
              <div className="join-actions">
                <button className="btn btn--primary join-cta" onClick={handleJoin}>
                  <Users size={18} /> Join &amp; Start Swiping
                </button>
              </div>
            ) : (
              /* Guest: prompt to sign up or sign in */
              <div className="join-actions">
                <Link href={loginUrl} className="btn btn--primary join-cta">
                  Create Account &amp; Join
                </Link>
                <Link href={loginUrl} className="btn btn--ghost join-cta-secondary">
                  Sign In &amp; Join
                </Link>
                <p className="join-legal">
                  By joining you agree to our{" "}
                  <Link href="/terms">Terms</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>.
                </p>
              </div>
            )}
          </>
        )}

        {/* Joining spinner overlay */}
        {state.status === "joining" && (
          <div className="join-state">
            <Loader2 size={32} className="join-spin" />
            <p>Linking accounts…</p>
          </div>
        )}
      </div>
    </div>
  );
}
