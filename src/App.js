import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import saeLogo from "./assets/sae-logo.jpg"; // replace with your SAE crest/wordmark


const GAS_URL = process.env.REACT_APP_GAS_URL || "";

/** Brand colors */
const SAE_PURPLE = "#6A498E";
const SAE_GOLD = "#F4BD1D";


const COLOR_STYLES = {
  purple: {
    card: `bg-gradient-to-br from-[rgba(106,73,142,0.12)] via-[rgba(106,73,142,0.08)] to-white/40`,
    avatar: `bg-[#6A498E] text-white`,
    memberPill: `bg-[#6A498E] text-white`,
    badge: `bg-[#6A498E] text-white`,
  },
  gold: {
    card: `bg-gradient-to-br from-[rgba(244,189,29,0.18)] via-[rgba(244,189,29,0.10)] to-white/40`,
    avatar: `bg-[#F4BD1D] text-stone-900`,
    memberPill: `bg-[#F4BD1D] text-stone-900`,
    badge: `bg-[#F4BD1D] text-stone-900`,
  },
  eta: {
    card: "bg-gradient-to-br from-blue-50/70 via-blue-50/60 to-white/30",
    avatar: "bg-blue-900/90 text-blue-100",
    memberPill: "bg-blue-200/60 border-blue-900/10 text-stone-900",
    badge: "bg-blue-900 text-blue-100",
  },
  epsilon: {
    card: "bg-gradient-to-br from-amber-50/70 via-amber-50/60 to-white/30",
    avatar: "bg-amber-900/90 text-amber-100",
    memberPill: "bg-amber-200/60 border-amber-900/10 text-stone-900",
    badge: "bg-amber-900 text-amber-100",
  },
  zeta: {
    card: "bg-gradient-to-br from-rose-50/70 via-rose-50/60 to-white/30",
    avatar: "bg-rose-900/90 text-rose-100",
    memberPill: "bg-rose-200/60 border-rose-900/10 text-stone-900",
    badge: "bg-rose-900 text-rose-100",
  },
  iota: {
    card: "bg-gradient-to-br from-pink-50/70 via-pink-50/60 to-white/30",
    avatar: "bg-pink-900/90 text-pink-100",
    memberPill: "bg-pink-200/60 border-pink-900/10 text-stone-900",
    badge: "bg-pink-900 text-pink-100",
  },
  theta: {
    card: "bg-gradient-to-br from-green-50/70 via-green-50/60 to-white/30",
    avatar: "bg-green-900/90 text-green-100",
    memberPill: "bg-green-200/60 border-green-900/10 text-stone-900",
    badge: "bg-green-900 text-green-100",
  },
  gamma: {
    card: "bg-gradient-to-br from-teal-50/70 via-teal-50/60 to-white/30",
    avatar: "bg-teal-900/90 text-teal-100",
    memberPill: "bg-teal-200/60 border-teal-900/10 text-stone-900",
    badge: "bg-teal-900 text-teal-100",
  },
  delta: {
    card: "bg-gradient-to-br from-gray-50/70 via-gray-50/60 to-white/30",
    avatar: "bg-gray-900/90 text-gray-100",
    memberPill: "bg-gray-200/60 border-gray-900/10 text-stone-900",
    badge: "bg-gray-900 text-gray-100",
  },
  alpha: {
    card: "bg-gradient-to-br from-orange-50/70 via-orange-50/60 to-white/30",
    avatar: "bg-orange-900/90 text-orange-100",
    memberPill: "bg-orange-200/60 border-orange-900/10 text-stone-900",
    badge: "bg-orange-900 text-orange-100",
  },
  default: {
    card: "bg-gradient-to-br from-stone-50/70 via-stone-50/60 to-white/30",
    avatar: `bg-[#6A498E] text-white`,
    memberPill: `bg-[#F4BD1D] text-stone-900`,
    badge: `bg-[#6A498E] text-white`,
  },
};

/** Podium overrides (top 3) */
const PODIUM_STYLES = {
  1: {
    emoji: "🥇",
    theme: {
      card: "bg-gradient-to-br from-amber-50/80 via-yellow-50/70 to-white/40",
      avatar: "bg-amber-500 text-amber-50",
      memberPill: "bg-amber-200/70 border-amber-900/10 text-stone-900",
      badge: "bg-amber-600 text-amber-50",
    },
  },
  2: {
    emoji: "🥈",
    theme: {
      card: "bg-gradient-to-br from-zinc-50/80 via-gray-50/70 to-white/50",
      avatar: "bg-zinc-500 text-zinc-50",
      memberPill: "bg-zinc-300 text-stone-900",
      badge: "bg-zinc-600 text-white",
    },
  },
  3: {
    emoji: "🥉",
    theme: {
      card: "bg-gradient-to-br from-amber-50/80 via-orange-50/70 to-white/50",
      avatar: "bg-amber-700 text-amber-50",
      memberPill: "bg-amber-300 text-stone-900",
      badge: "bg-amber-700 text-amber-50",
    },
  },
};

/** === UTIL === */
function LoadingCard({ lines = 3 }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-5 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${
            i === 0 ? "w-2/3" : i === lines - 1 ? "w-1/3" : "w-full"
          } bg-stone-300/40 rounded mb-3`}
        />
      ))}
    </div>
  );
}

function Page({ title, right, children }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          {title}
        </h1>
        {right}
      </div>
      {children}
    </div>
  );
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (isNaN(diff) || diff < 0) return dateString;
  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}


/** === PAGES === */
function MembersPage({ data }) {
  const [query, setQuery] = useState("");

  // tie-aware rank map based on full dataset
  const scoreToRank = useMemo(() => {
    const scores = (data || []).map(m => Number(m.Points) || 0);
    const uniqDesc = [...new Set(scores)].sort((a, b) => b - a);
    const map = {};
    uniqDesc.forEach((score, i) => { map[score] = i + 1; });
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter((m) =>
      String(m.First + " " + m.Last || "").toLowerCase().includes(q)
    );
  }, [data, query]);

  
  const searchBox = (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search members…"
        aria-label="Search members by name"
        className="w-48 sm:w-56 md:w-72 rounded-xl border border-white/30 bg-white/60 backdrop-blur px-3 py-2 text-sm text-stone-900 placeholder-stone-500 shadow focus:outline-none focus:ring-2 focus:ring-[rgba(244,189,29,0.6)]"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
          aria-label="Clear search"
          title="Clear"
        >
          ×
        </button>
      )}
    </div>
  );

  return (
    <Page title="Brothers" right={searchBox}>
      <div className="grid md:grid-cols-2 gap-6">
        {!data?.length ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : !filtered.length ? (
          <div className="col-span-full text-center text-stone-600 font-medium py-8">
            No member found
          </div>
        ) : (
          filtered.map((m, idx) => {
            const member = (m.First + " " + m.Last || "");
            const colorKey = String(m.class || m.Class || "").toLowerCase();
            const pointsNum = Number(m.Points) || 0;

            const rank = scoreToRank[pointsNum];
            const isPodium = rank >= 1 && rank <= 3;

            const baseTheme = COLOR_STYLES[colorKey] || COLOR_STYLES.default;
            const theme = isPodium ? PODIUM_STYLES[rank].theme : baseTheme;
            const medalEmoji = isPodium ? PODIUM_STYLES[rank].emoji : null;
            const klass = (m.Class || m.class || "").trim();
            const positionsRaw = (m.role || m.Role || "").trim();
            const positions = positionsRaw
              ? positionsRaw.split(",").map(s => s.trim()).filter(Boolean)
              : [];

            return (
              <div
              key={idx}
              className={`rounded-2xl border border-white/25 backdrop-blur-xl shadow-2xl p-5 ${theme.card}`}
            >
              {/* One row; constrain left side so the row fits */}
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                {/* LEFT: avatar + name + pills; capped width on mobile */}
                <div className="flex items-center gap-2 min-w-0 basis-0 flex-grow max-w-[72vw] sm:max-w-none">
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold ${theme.avatar} shrink-0`}>
                    {member?.[0]?.toUpperCase() ?? "S"}
                  </div>
            
                  <div className="min-w-0 flex-1">
                    {/* name + medal (name can truncate) */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-lg font-bold text-stone-900 truncate">
                        {member}
                      </div>
                      {medalEmoji && <span className="text-2xl shrink-0">{medalEmoji}</span>}
                    </div>
            
                    {/* pills: single line, scroll horizontally if needed */}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {klass && (
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.memberPill} shrink-0`}>
                          Class: {klass}
                        </div>
                      )}
                      {positions.map((pos, i) => (
                        <div key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.memberPill} shrink-0`}>
                          {pos}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            
                {/* RIGHT: points — fixed width, never wraps */}
                <div className="flex flex-col items-end shrink-0 whitespace-nowrap pl-1">
                  <div className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-none">{pointsNum}</div>
                  <div className="text-sm sm:text-base font-semibold text-stone-600">
                    point{Math.abs(pointsNum) === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </div>
            
            );
          })
        )}
      </div>
    </Page>
  );
}

function UpdatesPage({ data, colors }) {
  const sorted = useMemo(() => {
    return [...(data || [])].sort((a, b) => {
      const da = Date.parse(a.Timestamp || "");
      const db = Date.parse(b.Timestamp || "");
      return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
    });
  }, [data]);

  return (
    <Page title="House Updates">
      {!data?.length ? (
        <div className="grid gap-4">
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((u, i) => {
            const ts = u.Timestamp || "";
            const member = (u.Member || "Member").trim();
            const pts = u.Points ?? "";
            const desc = u.Description || "";
            const dispPts =
              String(pts).startsWith("+") || String(pts).startsWith("-")
                ? String(pts)
                : `+${pts}`;

            const colorKey = (colors?.[member] || "").toLowerCase();
            console.log(colors)
            const theme =
              COLOR_STYLES[colorKey] || COLOR_STYLES.default;
            console.log(theme)
            return (
              <div
                key={i}
                className={`rounded-2xl border border-white/25 backdrop-blur-xl shadow-xl p-5 ${theme.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-stone-500">{timeAgo(ts)}</div>
                    <div className="mt-1 text-lg font-semibold text-stone-900">
                      {dispPts} point{Math.abs(parseInt(dispPts, 10)) === 1 ? "" : "s"}
                    </div>
                    <div className="text-stone-700 mt-1">{desc}</div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${theme.badge}`}>
                    {member}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}

function RulesPage({ data }) {
  return (
    <Page title="How to Earn Points">
      {!data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
         {data.map((r, i) => {
          const cat = r.Category || "General";
          const rule = r.Rule || "";
          const pts  = r.Points ?? r["Points/Reward"] ?? "";

          return (
            <div
              key={i}
              className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl shadow-xl p-5 bg-gradient-to-br from-[rgba(106,73,142,0.10)] via-stone-50/70 to-white/30"
            >
              <div className="flex items-start justify-between gap-4">
                {/* left: category + rule + points */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-600">{cat}</div>
                  <div className="mt-1 text-stone-900 font-semibold">{rule}</div>

                  {/* SAE Gold points/reward pill */}
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4BD1D] text-stone-900 border border-[rgba(0,0,0,0.06)] text-sm shadow-sm">
                    <span className="font-bold">{pts}</span>
                    <span>{isNaN(Number(pts)) ? "reward" : "points"}</span>
                  </div>
                </div>


              </div>
            </div>
          );
        })}

        </div>
      )}
    </Page>
  );
}



/** === NAV & CHROME === */
function Nav() {
  const linkBase =
    "px-4 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow hover:bg-white/20 transition";
  const inactive = "text-stone-700";
  const active = "text-stone-900 font-semibold bg-white/40";

  return (
    <div className="sticky top-0 z-40">
    <div className="bg-gradient-to-b from-[rgba(106,73,142,0.14)] to-transparent backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Left: logo + title */}
          <div className="flex items-center gap-3">
            <img
              src={saeLogo}
              alt="SAE"
              className="h-12 w-12 rounded-xl object-cover shadow-md"
            />
            <div className="text-lg font-extrabold tracking-tight text-stone-900">
              PSU ΣAE House Points
            </div>
          </div>

          {/* Right: nav */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              Brothers
            </NavLink>
            <NavLink to="/updates" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              Updates
            </NavLink>
            <NavLink to="/rules" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
              Rules
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 
      bg-[radial-gradient(circle_at_1px_1px,rgba(28,25,23,0.08)_1px,transparent_1px)] 
      [background-size:18px_18px] 
      bg-[rgba(244,189,29,0.15)]"      />
  );
}
const ACCESS_CODE = (process.env.REACT_APP_ACCESS_CODE || "").trim();

function PasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(
    typeof window !== "undefined" && localStorage.getItem("sae_access_ok") === "1"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // tiny hardening: blur the page behind the gate
    if (!authed) document.documentElement.style.filter = "none";
    return () => { document.documentElement.style.filter = ""; };
  }, [authed]);

  const submit = (e) => {
    e.preventDefault();
    if (!ACCESS_CODE) {
      setError("Access code is not configured. Set REACT_APP_ACCESS_CODE in your .env.");
      return;
    }
    if (input.trim().toLowerCase() === ACCESS_CODE) {
      localStorage.setItem("sae_access_ok", "1");
      setAuthed(true);
    } else {
      setError("Incorrect code. Try again.");
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgba(244,189,29,0.18)]">
      <div className="w-full max-w-md rounded-2xl border border-white/25 backdrop-blur-xl shadow-xl p-6
                      bg-gradient-to-br from-[rgba(106,73,142,0.15)] via-[rgba(106,73,142,0.08)] to-white/70">
        <div className="text-center mb-4">
          <div className="text-2xl font-extrabold text-stone-900">SAE House Points</div>
          <div className="text-stone-600 text-sm mt-1">Enter the access code to continue</div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Access code"
            className="w-full rounded-xl border border-white/30 bg-white/70 backdrop-blur px-3 py-2 text-sm
                       text-stone-900 placeholder-stone-500 shadow focus:outline-none focus:ring-2
                       focus:ring-[rgba(244,189,29,0.6)]"
          />
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-xl font-semibold shadow
                       bg-[#F4BD1D] text-stone-900 hover:brightness-105 transition"
          >
            Unlock
          </button>
        </form>

        <div className="mt-4 text-[11px] text-stone-500 text-center">
          Ask someone for the current code.
        </div>
      </div>
    </div>
  );
}

/** === APP === */
export default function App() {
  const [members, setMembers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [rules, setRules] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const colorMap = useMemo(() => {
    const map = {};
    for (const m of members) {
      const name = (m.First + ' ' + m.Last || m.first + ' ' +m.last || "").trim();
      const color = String(m.class || m.Class || "").trim().toLowerCase();
      if (name) map[name] = color;
    }
    return map;
  }, [members]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!GAS_URL) throw new Error("Missing REACT_APP_GAS_URL (.env).");
        setStatus("loading");
        const res = await fetch(`${GAS_URL}?cacheBust=${Date.now()}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;

        const membersData = json.members || [];
        membersData.sort((a, b) => (b.Points || 0) - (a.Points || 0));
        setMembers(membersData);
        setUpdates(json.updates || []);
        setRules(json.rules || []);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load data");
        setStatus("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <PasswordGate>
      <div className="min-h-screen">
        <Background />
        <Nav />
  
        {status === "loading" && (
          <div className="mx-auto max-w-6xl px-4 mt-6">
            <div className="rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md shadow p-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#F4BD1D] animate-ping" />
              <div className="text-stone-800 font-medium">Fetching ΣAE data…</div>
            </div>
          </div>
        )}
  
        {status === "error" && (
          <div className="mx-auto max-w-6xl px-4 mt-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-800 p-4">
              <div className="font-semibold">Error</div>
              <div className="text-sm mt-1">{error}</div>
              <div className="text-sm mt-2 text-red-700/80">
                Ensure your Apps Script Web App is deployed and public, and that REACT_APP_GAS_URL is set.
              </div>
            </div>
          </div>
        )}
  
        <Routes>
          <Route path="/" element={<MembersPage data={members} />} />
          <Route path="/updates" element={<UpdatesPage data={updates} colors={colorMap} />} />
          <Route path="/rules" element={<RulesPage data={rules} />} />
        </Routes>
      </div>
    </PasswordGate>
  );
}  