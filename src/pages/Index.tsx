import { useState, useEffect, useRef, useMemo } from 'react';
import RelayStats from '@/components/RelayStats';

// ── Animated title ──────────────────────────────────────────────
const TITLE_ANIM_CSS = `@keyframes titleLetterIn{from{transform:translateX(-80px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes titleSuffixIn{from{opacity:0}to{opacity:1}}`;
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}
function AnimatedTitle({ accent, rest = '', from: f, to: t, suffixRgba, fontSize = 'clamp(36px, 7.5vw, 51px)' }: { accent: string; rest?: string; from: string; to: string; suffixRgba: string; fontSize?: string }) {
  const ac = accent.split(''), rc = rest.split('');
  const total = ac.length + rc.length;
  const dur = 350, stagger = total > 1 ? (1200 - dur) / (total - 1) : 0;
  const fromRgb = hexToRgb(f);
  const toRgb = hexToRgb(t);
  const aLen = ac.length;
  return (
    <>
      <style>{TITLE_ANIM_CSS}</style>
      <h1 className="font-bold tracking-tight" style={{ fontSize }}>
        {ac.map((ch, i) => {
          const start = lerpRgb(fromRgb, toRgb, aLen > 0 ? i / aLen : 0);
          const end   = lerpRgb(fromRgb, toRgb, aLen > 0 ? (i + 1) / aLen : 1);
          return (
            <span key={i} className="inline-block"
              style={{ background: `linear-gradient(to right,${start},${end})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: `titleLetterIn ${dur}ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round(i * stagger)}ms` }}
            >{ch === ' ' ? ' ' : ch}</span>
          );
        })}
        {rc.map((ch, i) => (
          <span key={i + ac.length} className="inline-block"
            style={{ color: suffixRgba, animation: `titleSuffixIn 600ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round((ac.length + i) * stagger)}ms` }}
          >{ch === ' ' ? ' ' : ch}</span>
        ))}
      </h1>
    </>
  );
}

const NstartHand = () => (
  <a href="https://nstart.me/en" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity shrink-0">
    <svg className="h-[92px] w-auto" fill="#fbbf24" viewBox="0 0 210 282">
      <path fillRule="evenodd" clipRule="evenodd" d="M57.143 98.9848C58.6367 95.1177 62.1322 93.1733 65.8719 92.1713C74.9767 89.7317 81.3757 95.1838 85.1202 100.138C87.0353 102.672 88.5381 105.402 89.6797 107.666C90.3271 108.95 90.784 109.916 91.1512 110.693C91.5296 111.493 91.8127 112.092 92.1107 112.628L92.3791 113.112L92.5365 113.642C92.9678 115.095 93.7096 117.176 94.4929 118.735C94.6234 118.994 94.7454 119.22 94.8568 119.411C96.2962 119.978 97.4576 121.196 97.8887 122.805C98.6106 125.499 97.0117 128.268 94.3176 128.99C90.8191 129.928 88.423 127.512 87.7439 126.76C86.7757 125.688 86.0213 124.371 85.4685 123.271C84.4243 121.194 83.5514 118.773 83.0054 117.015C82.6598 116.345 82.2327 115.455 81.797 114.546C81.4081 113.735 81.0122 112.91 80.6612 112.214C79.6317 110.173 78.4453 108.058 77.0622 106.228C74.2102 102.455 71.5767 101.099 68.4861 101.928C67.2891 102.248 66.763 102.551 66.5602 102.706C66.5455 102.953 66.5618 103.751 67.1654 105.569C67.7276 107.262 68.5363 109.136 69.5419 111.467C69.899 112.294 70.281 113.18 70.6855 114.135C72.1619 117.62 73.7875 121.713 75.0216 126.318C75.7971 129.213 76.5206 132.737 77.2684 136.379C77.6581 138.278 78.0544 140.208 78.468 142.098C79.7244 147.838 81.2286 153.692 83.4154 159.022C87.7563 169.603 94.3593 177.289 106.433 178.342L106.529 178.351L106.625 178.363C109.419 178.714 112.697 177.918 115.701 177.112C118.395 176.391 121.165 177.989 121.887 180.684C122.608 183.378 121.01 186.147 118.316 186.869L118.166 186.909C115.421 187.645 110.401 188.991 105.464 188.396C88.154 186.849 79.1418 175.217 74.0708 162.856C71.5471 156.704 69.8952 150.17 68.6012 144.257C68.1109 142.017 67.6816 139.921 67.2802 137.961C66.5822 134.553 65.9686 131.557 65.2653 128.932C64.212 125.001 62.7989 121.412 61.3851 118.074C61.0692 117.329 60.7434 116.574 60.4177 115.82C59.3548 113.359 58.2928 110.9 57.5795 108.751C56.6874 106.064 55.8077 102.442 57.143 98.9848ZM66.4502 102.814C66.4467 102.813 66.46 102.792 66.5009 102.755C66.4742 102.797 66.4537 102.815 66.4502 102.814Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M110.765 100.588C105.447 106.291 101.312 115.759 99.3897 122.479C98.6226 125.16 95.8269 126.712 93.1453 125.945C90.4637 125.178 88.9117 122.383 89.6788 119.701C91.8059 112.265 96.5106 101.065 103.377 93.7002C106.832 89.9939 111.303 86.7601 116.731 86.0659C122.387 85.3426 127.938 87.5088 133.082 92.3049L133.115 92.3362L133.148 92.3681C137.351 96.4319 138.339 102.566 138.148 108.032C137.949 113.717 136.446 119.945 134.287 125.595C132.132 131.235 129.187 136.66 125.845 140.636C124.178 142.619 122.255 144.43 120.101 145.672C117.93 146.924 115.206 147.765 112.252 147.16C109.337 146.564 106.744 145.387 104.783 143.392C102.786 141.361 101.852 138.897 101.552 136.487C101 132.048 102.548 127.175 103.955 123.382C106.452 116.654 109.786 109.569 110.805 107.805C112.2 105.389 115.288 104.562 117.704 105.956C120.119 107.351 120.947 110.439 119.552 112.855C118.921 113.948 115.814 120.46 113.425 126.896C111.989 130.765 111.361 133.516 111.576 135.241C111.659 135.914 111.844 136.167 111.986 136.311C112.162 136.491 112.72 136.941 114.239 137.257C114.319 137.249 114.575 137.199 115.057 136.921C115.849 136.465 116.9 135.58 118.113 134.136C120.532 131.258 122.973 126.908 124.852 121.99C126.726 117.084 127.904 111.973 128.054 107.679C128.21 103.204 127.233 100.723 126.154 99.6553C122.606 96.3623 119.932 95.8391 118.012 96.0847C115.858 96.3602 113.401 97.7603 110.765 100.588Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M148.576 99.5765C147.378 97.8131 145.202 95.6384 142.159 94.4817C138.745 93.1841 134.64 93.342 130.601 96.0088C128.274 97.5456 127.633 100.678 129.17 103.006C130.706 105.333 133.839 105.975 136.167 104.438C136.898 103.955 137.405 103.832 137.696 103.801C137.992 103.769 138.272 103.81 138.57 103.923C139.285 104.195 139.945 104.834 140.233 105.27L140.315 105.394L140.404 105.513C141.425 106.878 142.178 109.533 142.032 113.653C141.891 117.623 140.936 122.239 139.41 126.752C137.884 131.261 135.869 135.427 133.77 138.525C132.722 140.073 131.721 141.252 130.838 142.06C129.92 142.9 129.36 143.128 129.206 143.17C128.698 143.306 128.451 143.278 128.388 143.266C128.367 143.248 128.329 143.21 128.274 143.135C127.88 142.603 127.203 140.925 127.411 137.461C127.578 134.677 125.456 132.285 122.672 132.118C119.888 131.951 117.495 134.072 117.329 136.857C117.058 141.364 117.724 145.861 120.157 149.146C121.436 150.873 123.188 152.225 125.367 152.905C127.514 153.575 129.73 153.486 131.82 152.926C134.105 152.314 136.064 150.968 137.656 149.512C139.282 148.024 140.782 146.184 142.133 144.189C144.835 140.2 147.221 135.181 148.977 129.989C150.733 124.799 151.942 119.195 152.126 114.011C152.302 109.023 151.557 103.642 148.576 99.5765Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M186.841 91.1686C185.772 91.5973 185.168 92.2069 184.973 92.544C183.264 95.5056 179.325 100.324 175.48 104.794C171.507 109.414 167.22 114.13 164.478 117.072C162.576 119.112 159.38 119.224 157.34 117.322C155.3 115.42 155.188 112.224 157.09 110.184C159.763 107.317 163.956 102.703 167.822 98.2078C171.818 93.5623 175.079 89.4804 176.226 87.4938C177.817 84.7382 180.464 82.8432 183.083 81.7933C185.71 80.7403 188.941 80.2834 192.028 81.1664C195.357 82.1186 198.189 84.5703 199.383 88.482C200.486 92.0952 200.034 96.4116 198.408 101.218C192.231 119.477 179.621 133.86 174.895 138.051C173.698 139.112 172.27 141.273 170.323 145.956C168.418 150.541 166.292 156.814 163.351 165.509C160.041 175.292 152.771 183.982 144.169 188.607C135.418 193.311 124.606 194.032 115.772 186.268C113.677 184.427 113.471 181.236 115.312 179.141C117.153 177.046 120.344 176.84 122.439 178.681C127.282 182.937 133.283 182.991 139.386 179.71C145.636 176.35 151.258 169.738 153.783 162.273L153.849 162.079C156.711 153.619 158.943 147.019 160.996 142.08C163.023 137.203 165.165 133.179 168.193 130.494C171.917 127.192 183.347 114.22 188.84 97.9817C190.131 94.1642 189.957 92.1976 189.722 91.4309C189.582 90.972 189.465 90.9385 189.263 90.8808L189.25 90.8772C188.798 90.7479 187.902 90.7432 186.841 91.1686Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M87.4391 172.66C90.1332 171.938 92.9024 173.537 93.6243 176.231C94.4031 179.138 94.2478 183.011 93.9724 186.046C93.6772 189.298 93.1456 192.495 92.737 194.492C92.1778 197.225 89.5094 198.987 86.7768 198.427C84.0443 197.868 82.2825 195.2 82.8416 192.467C83.1876 190.777 83.6573 187.954 83.9133 185.133C84.1891 182.095 84.1349 179.841 83.868 178.845C83.1462 176.151 84.745 173.382 87.4391 172.66Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M137.693 185.612C139.544 187.699 139.352 190.891 137.266 192.742C133.64 195.957 128.811 202.842 126.912 207.176C125.793 209.731 122.814 210.895 120.26 209.775C117.705 208.656 116.541 205.678 117.661 203.123C120.087 197.584 125.741 189.462 130.564 185.184C132.651 183.334 135.843 183.525 137.693 185.612Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M143.142 106.629C143.189 103.84 145.487 101.617 148.275 101.663C152.563 101.733 158.532 103.631 162.187 109.36C165.863 115.122 166.352 123.427 162.604 134.507C160.305 141.303 157.71 146.407 154.909 150.066C152.117 153.714 148.909 156.189 145.365 157.139C137.608 159.218 131.981 153.53 130.512 148.048C129.79 145.354 131.389 142.585 134.083 141.863C136.777 141.141 139.546 142.74 140.268 145.434C140.76 147.269 141.972 147.592 142.751 147.383C143.476 147.189 144.96 146.446 146.888 143.927C148.807 141.42 150.959 137.41 153.036 131.27C156.29 121.652 155.029 116.919 153.672 114.793C152.294 112.633 149.948 111.792 148.109 111.762C145.32 111.716 143.096 109.418 143.142 106.629Z"/>
    </svg>
  </a>
);

// ── Constants ─────────────────────────────────────────────────────────────────
const RELAY_URL = 'wss://relay.fizx.uk';
const CHALLENGE_KIND = 30078;
const CORAL:   [number, number, number] = [255, 120,  73];
const AMBER:   [number, number, number] = [255, 179,  71];
const SQUARE_COUNT = 21;
const SQUARE_DIM = '#161e2e';

function lerpColor(a: [number,number,number], b: [number,number,number], t: number) {
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
}

const SQUARE_COLORS = Array.from({ length: SQUARE_COUNT }, (_, i) => {
  const t = i < 10 ? i / 10 : (SQUARE_COUNT - 1 - i) / 10;
  return lerpColor(CORAL, AMBER, t);
});

// ── Types ─────────────────────────────────────────────────────────────────────
type Verdict = 'agreed' | 'disagreed' | 'pending';
type TruthResult = 'true' | 'false' | 'both-false' | 'pending';
type Step = 'A' | 'B' | 'vote' | 'done';

interface Challenge {
  id: string;
  statementA: string;
  statementB: string;
  pubkeyA: string;
  pubkeyB: string;
  verdict: Verdict;
  result: TruthResult;
  createdAt: number;
}

interface Draft {
  id: string;
  statementA: string;
  statementB: string;
  pubkeyA: string;
  pubkeyB: string;
  verdict: Verdict;
  result: TruthResult;
  step: Step;
}

interface Statement { text: string; pubkey?: string; published: boolean; }

// ── Deterministic hash ────────────────────────────────────────────────────────
function fnv32(str: string): number[] {
  const out: number[] = [];
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  for (let i = 0; i < 8; i++) {
    h ^= (i * 0x9e3779b9) >>> 0;
    h = Math.imul(h, 0x01000193) >>> 0;
    out.push(h);
  }
  return out;
}

// ── NpubIcon: 5×5 symmetric pixel grid ───────────────────────────────────────
function NpubIcon({ pubkey, size = 28 }: { pubkey: string; size?: number }) {
  if (!pubkey) return <div style={{ width: size, height: size }} className="bg-border/20 border border-border/30" />;
  const h = fnv32(pubkey);
  const hue = h[0] % 360;
  const fill = `hsl(${hue},${50 + (h[1] % 20)}%,${55 + (h[2] % 15)}%)`;
  const ps = Math.max(1, Math.floor(size / 5));
  const dim = ps * 5;
  let src = h[3]; let bit = 0;
  const cells: boolean[][] = Array.from({ length: 5 }, () => {
    const row: boolean[] = [];
    for (let c = 0; c < 3; c++) {
      if (bit >= 32) { src = h[4 + Math.floor(bit / 32)]; bit = 0; }
      row.push(((src >> (bit % 32)) & 1) === 1); bit++;
    }
    return [row[0], row[1], row[2], row[1], row[0]];
  });
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ imageRendering: 'pixelated' }}>
      <rect width={dim} height={dim} fill="#0d111788" />
      {cells.flatMap((row, r) => row.map((on, c) =>
        on ? <rect key={`${r}-${c}`} x={c*ps} y={r*ps} width={ps} height={ps} fill={fill} /> : null
      ))}
    </svg>
  );
}

// ── ChallengeIcon: 4×4 two-tone grid ─────────────────────────────────────────
function ChallengeIcon({ id, size = 28 }: { id: string; size?: number }) {
  const h = fnv32(id);
  const hue1 = h[0] % 360;
  const c1 = `hsl(${hue1},65%,60%)`;
  const c2 = `hsl(${(hue1 + 137) % 360},65%,60%)`;
  const ps = Math.max(1, Math.floor(size / 4));
  const dim = ps * 4;
  const cells = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => {
      const idx = r * 4 + c;
      return (h[2 + Math.floor(idx / 5)] >> ((idx % 5) * 2)) & 3;
    })
  );
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ imageRendering: 'pixelated' }}>
      <rect width={dim} height={dim} fill="#0d111788" />
      {cells.flatMap((row, r) => row.map((v, c) =>
        v === 0 ? null : <rect key={`${r}-${c}`} x={c*ps} y={r*ps} width={ps} height={ps} fill={v === 1 ? c1 : c2} />
      ))}
    </svg>
  );
}


// ── Nostr login ───────────────────────────────────────────────────────────────
declare global {
  interface Window { nostr?: { getPublicKey(): Promise<string>; signEvent(e: object): Promise<object> } }
}

function useNostrLogin() {
  const [pubkey, setPubkey] = useState<string | null>(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('nostr_pk');
      if (p) { localStorage.setItem('nostr_pubkey', p); return p; }
      return localStorage.getItem('nostr_pubkey');
    } catch { return null; }
  });
  useEffect(() => { if (new URLSearchParams(window.location.search).get('nostr_pk')) window.history.replaceState({}, '', window.location.pathname); }, []);
  const login = async () => {
    if (typeof window !== 'undefined' && window.nostr) {
      try { const pk = await window.nostr.getPublicKey(); if (pk) { setPubkey(pk); localStorage.setItem('nostr_pubkey', pk); } } catch {}
      return;
    }
    const cb = `${window.location.origin}${window.location.pathname}?nostr_pk={signature}`;
    window.location.href = `nostrsigner:getpubkey?compressionType=none&returnType=signature&type=get_public_key&callbackUrl=${encodeURIComponent(cb)}`;
  };
  const logout = () => { setPubkey(null); try { localStorage.removeItem('nostr_pubkey'); } catch {} };
  return { pubkey, login, logout };
}

// Light-weight kind:0 lookup so the nav login button can show the user's
// avatar + display name. Lazy: only opens a socket once `pubkey` is set.
function useUserProfile(pubkey: string | null) {
  const [profile, setProfile] = useState<{ name?: string; display_name?: string; picture?: string } | null>(null);
  useEffect(() => {
    if (!pubkey) { setProfile(null); return; }
    setProfile(null);
    const relays = ['wss://relay.fizx.uk', 'wss://nos.lol'];
    const sockets: WebSocket[] = [];
    let latestTs = 0;
    relays.forEach(url => {
      let ws: WebSocket;
      try { ws = new WebSocket(url); } catch { return; }
      sockets.push(ws);
      const subId = `prof-${Math.random().toString(36).slice(2, 8)}`;
      ws.onopen = () => { try { ws.send(JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }])); } catch { /* ignore */ } };
      ws.onmessage = (e) => {
        try {
          const m = JSON.parse(e.data as string);
          if (!Array.isArray(m)) return;
          if (m[0] === 'EVENT' && m[1] === subId) {
            const ev = m[2];
            if (ev?.created_at > latestTs) {
              latestTs = ev.created_at;
              try {
                const p = JSON.parse(ev.content);
                if (p && typeof p === 'object') setProfile(p);
              } catch { /* malformed metadata */ }
            }
          } else if (m[0] === 'EOSE') {
            try { ws.close(); } catch { /* ignore */ }
          }
        } catch { /* malformed frame */ }
      };
    });
    return () => { sockets.forEach(s => { try { s.close(); } catch { /* ignore */ } }); };
  }, [pubkey]);
  return profile;
}

function NostrLogin({ pubkey, login, logout }: { pubkey: string | null; login: () => void; logout: () => void }) {
  const profile = useUserProfile(pubkey);
  if (pubkey) {
    const label = profile?.display_name || profile?.name || `${pubkey.slice(0, 8)}…`;
    return (
      <button onClick={logout} title={`Signed in as ${label} — click to log out`} className="font-mono text-[11px] px-1.5 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
        {profile?.picture ? (
          <span className="w-4 h-4 rounded-full shrink-0 bg-muted bg-cover bg-center ring-1 ring-primary/30" style={{ backgroundImage: `url(${JSON.stringify(profile.picture)})` }} aria-hidden />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
        <span className="hidden sm:inline max-w-[7rem] truncate">{label}</span>
        <span className="text-muted-foreground/50 ml-0.5">×</span>
      </button>
    );
  }
  return (
    <button onClick={login} className="font-mono text-[11px] px-2 py-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span className="hidden sm:inline">Log in with Nostr</span>
    </button>
  );
}

// ── Relay helpers ─────────────────────────────────────────────────────────────
function parseChallenge(event: Record<string, unknown>): Challenge | null {
  try {
    const tags = (event.tags as string[][]) ?? [];
    const d = tags.find(t => t[0] === 'd')?.[1];
    if (!d) return null;
    const pubkeyA = tags.find(t => t[0] === 'pubkey-a')?.[1] ?? (event.pubkey as string);
    const pubkeyB = tags.find(t => t[0] === 'pubkey-b')?.[1] ?? '';
    const verdict = (tags.find(t => t[0] === 'verdict')?.[1] ?? 'pending') as Verdict;
    const result = (tags.find(t => t[0] === 'result')?.[1] ?? 'pending') as TruthResult;
    const content = JSON.parse((event.content as string) ?? '{}') as Record<string, string>;
    if (!content.statementA) return null;
    return { id: d, statementA: content.statementA, statementB: content.statementB ?? '',
      pubkeyA, pubkeyB, verdict, result, createdAt: event.created_at as number };
  } catch { return null; }
}

async function publishChallenge(ch: Draft): Promise<boolean> {
  if (!window.nostr) return false;
  try {
    const signed = await window.nostr.signEvent({
      kind: CHALLENGE_KIND,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['d', ch.id], ['t', 'truthstakes'],
        ['pubkey-a', ch.pubkeyA], ['pubkey-b', ch.pubkeyB],
        ['verdict', ch.verdict], ['result', ch.result]],
      content: JSON.stringify({ statementA: ch.statementA, statementB: ch.statementB }),
    });
    return new Promise((resolve) => {
      let done = false;
      const ws = new WebSocket(RELAY_URL);
      const timer = setTimeout(() => { ws.close(); if (!done) { done = true; resolve(false); } }, 6000);
      ws.onopen = () => ws.send(JSON.stringify(['EVENT', signed]));
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data as string) as unknown[];
          if (msg[0] === 'OK' || msg[0] === 'EVENT') { clearTimeout(timer); ws.close(); if (!done) { done = true; resolve(true); } }
        } catch {}
      };
      ws.onerror = () => { clearTimeout(timer); if (!done) { done = true; resolve(false); } };
    });
  } catch { return false; }
}

async function publishStatement(side: 1 | 2, text: string, pubkey: string): Promise<boolean> {
  if (!window.nostr) return false;
  try {
    const signed = await window.nostr.signEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['t', 'truthstakes'], ['t', `side-${side}`]],
      content: text,
    }) as object;
    const ws = new WebSocket(RELAY_URL);
    await new Promise<void>((res, rej) => {
      ws.onopen = () => ws.send(JSON.stringify(['EVENT', signed]));
      ws.onmessage = () => { ws.close(); res(); };
      ws.onerror = rej;
      setTimeout(() => { ws.close(); rej(); }, 5000);
    });
    return true;
  } catch { return false; }
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO: Challenge[] = [
  {
    id: 'demo-claude-code',
    statementA: 'Claude Code is the go-to desktop tool.',
    statementB: 'Claude Code is just another IDE plugin.',
    pubkeyA: 'a388c7ec5a20f7996e93e6c4585f0f2df782e6c8ecff1ce5cb5be58b77ff8b16',
    pubkeyB: '6216af13b33224ed42802399cc8b59d08005faf2d892e94a8a01c622f0d37fc6',
    verdict: 'disagreed', result: 'true',
    createdAt: Math.floor(Date.now() / 1000) - 3600,
  },
  {
    id: 'demo-red-sonia',
    statementA: 'Red Sonia (2025) is a must-see film.',
    statementB: 'Red Sonia (2025) is overhyped.',
    pubkeyA: '916c25cf07a65b36fa7805f31f750fcb27f5cce2d39a7ac92035570aa2672a2d',
    pubkeyB: 'a388c7ec5a20f7996e93e6c4585f0f2df782e6c8ecff1ce5cb5be58b77ff8b16',
    verdict: 'disagreed', result: 'pending',
    createdAt: Math.floor(Date.now() / 1000) - 7200,
  },
];

// ── GameBoard ─────────────────────────────────────────────────────────────────
function GameBoard({ score1, score2 }: { score1: number; score2: number }) {
  const total = score1 + score2;
  const pct1 = total > 0 ? (score1 / total) * 100 : 50;
  return (
    <div className="space-y-3">
      <div className="flex justify-between font-mono text-sm">
        <span className="text-primary font-bold">Side A · {score1}</span>
        <span style={{ color: 'rgb(167 139 250)' }} className="font-bold">{score2} · Side B</span>
      </div>
      <div className="h-2 bg-border/30 flex overflow-hidden">
        <div className="bg-primary transition-all duration-700" style={{ width: `${pct1}%` }} />
        <div className="transition-all duration-700" style={{ backgroundColor: 'rgb(167 139 250)', width: `${100-pct1}%` }} />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 21 }, (_, i) => (
          <div key={`a${i}`} className="flex-1 h-1.5 transition-all duration-300"
            style={{ backgroundColor: i < score1 ? 'rgb(52 211 153)' : 'rgb(30 45 61)' }} />
        ))}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 21 }, (_, i) => (
          <div key={`b${i}`} className="flex-1 h-1.5 transition-all duration-300"
            style={{ backgroundColor: i < score2 ? 'rgb(167 139 250)' : 'rgb(30 45 61)' }} />
        ))}
      </div>
    </div>
  );
}

// ── StatementInput ────────────────────────────────────────────────────────────
function StatementInput({ onSubmit, placeholder, disabled }: { onSubmit: (t: string) => void; placeholder?: string; disabled?: boolean }) {
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; onSubmit(t); setText(''); }} className="flex items-center gap-2">
      <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} disabled={disabled}
        className="flex-1 bg-transparent border border-border px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 transition-colors disabled:opacity-40" />
      <button type="submit" disabled={disabled || !text.trim()}
        className="shrink-0 font-mono text-xs px-3 py-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        post
      </button>
    </form>
  );
}

// ── ChallengeCard (history list item) ────────────────────────────────────────
function ChallengeCard({ ch, active, onClick }: { ch: Challenge; active: boolean; onClick: () => void }) {
  const oneP = ch.pubkeyA === ch.pubkeyB || !ch.pubkeyB;
  const vc = ch.verdict === 'agreed' ? 'text-primary' : ch.verdict === 'disagreed' ? 'text-purple-400' : 'text-muted-foreground/30';
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2.5 border-b border-border transition-colors flex gap-2.5 items-start ${active ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/5 border-l-2 border-l-transparent'}`}>
      <div className="shrink-0 mt-0.5"><ChallengeIcon id={ch.id} size={24} /></div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1 mb-0.5">
          <NpubIcon pubkey={ch.pubkeyA} size={12} />
          {!oneP && <NpubIcon pubkey={ch.pubkeyB} size={12} />}
          {oneP && <span className="text-[8px] font-mono text-muted-foreground/30 border border-border/40 px-0.5 leading-tight">1P</span>}
          <span className={`ml-auto text-[8px] font-mono ${vc} shrink-0`}>{ch.verdict === 'pending' ? '···' : ch.verdict}</span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground/80 truncate leading-tight">{ch.statementA}</p>
        {ch.statementB && <p className="text-[10px] font-mono text-muted-foreground/40 truncate leading-tight">{ch.statementB}</p>}
      </div>
    </button>
  );
}

// ── ChallengeDetail (history right panel) ────────────────────────────────────
function ChallengeDetail({ ch, onNew }: { ch: Challenge; onNew: () => void }) {
  const oneP = ch.pubkeyA === ch.pubkeyB || !ch.pubkeyB;
  const vc = ch.verdict === 'agreed' ? 'text-primary' : ch.verdict === 'disagreed' ? 'text-purple-400' : 'text-muted-foreground/40';
  const date = new Date(ch.createdAt * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <ChallengeIcon id={ch.id} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-mono ${vc}`}>{ch.verdict === 'pending' ? 'pending' : ch.verdict}</span>
            {oneP && <span className="text-[9px] font-mono text-muted-foreground/30 border border-border/40 px-1">1P</span>}
            {ch.id.startsWith('demo-') && <span className="text-[9px] font-mono text-muted-foreground/30 border border-border/40 px-1">demo</span>}
            <span className="text-[10px] font-mono text-muted-foreground/30 ml-auto">{date}</span>
          </div>
          {ch.result !== 'pending' && (
            <div className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">statement A: <span className="text-primary/70">{ch.result}</span></div>
          )}
        </div>
        <button onClick={onNew} className="shrink-0 text-[10px] font-mono text-muted-foreground/40 hover:text-primary border border-border/40 px-2 py-1 transition-colors">+ new</button>
      </div>
      <div className="border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <NpubIcon pubkey={ch.pubkeyA} size={20} />
          <span className="text-[10px] font-mono text-muted-foreground/50">{ch.pubkeyA.slice(0, 8)}…</span>
          <span className="ml-auto text-[9px] font-mono text-primary/60 border border-primary/20 px-1">A</span>
        </div>
        <p className="text-sm font-mono text-foreground leading-relaxed">"{ch.statementA}"</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-[10px] font-mono text-muted-foreground/20 tracking-widest">VS</span>
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <div className="border border-purple-400/20 bg-purple-400/5 p-4">
        {ch.statementB ? (
          <>
            <div className="flex items-center gap-2 mb-2.5">
              <NpubIcon pubkey={ch.pubkeyB || ch.pubkeyA} size={20} />
              <span className="text-[10px] font-mono text-muted-foreground/50">{(ch.pubkeyB || ch.pubkeyA).slice(0, 8)}…</span>
              <span className="ml-auto text-[9px] font-mono text-purple-400/60 border border-purple-400/20 px-1">B</span>
            </div>
            <p className="text-sm font-mono text-foreground leading-relaxed">"{ch.statementB}"</p>
          </>
        ) : (
          <p className="text-sm font-mono text-muted-foreground/25 italic">awaiting challenger…</p>
        )}
      </div>
    </div>
  );
}

// ── NewChallengeWizard ────────────────────────────────────────────────────────
function NewChallengeWizard({ draft, pubkey, publishing, onUpdate, onPublish, onCancel }:
  { draft: Draft; pubkey: string | null; publishing: boolean; onUpdate: (d: Partial<Draft>) => void; onPublish: () => void; onCancel: () => void }) {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const steps: Step[] = ['A', 'B', 'vote'];
  const stepIdx = steps.indexOf(draft.step);
  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <ChallengeIcon id={draft.id} size={40} />
        <div className="flex-1">
          <div className="text-[10px] font-mono text-muted-foreground/50 flex items-center gap-2">
            new challenge
            {draft.pubkeyA === draft.pubkeyB && pubkey && <span className="border border-border/40 px-1 text-[9px]">1P</span>}
          </div>
          <div className="flex gap-1 mt-1.5">
            {steps.map((s, i) => (
              <div key={s} className={`flex-1 h-0.5 transition-colors ${i < stepIdx ? 'bg-primary/40' : i === stepIdx ? 'bg-primary' : 'bg-border/40'}`} />
            ))}
          </div>
        </div>
        <button onClick={onCancel} className="shrink-0 text-[10px] font-mono text-muted-foreground/30 hover:text-red-400 border border-border/40 px-2 py-1 transition-colors">cancel</button>
      </div>

      {draft.step === 'A' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <NpubIcon pubkey={pubkey ?? ''} size={20} />
            <span className="text-[10px] font-mono text-muted-foreground/50">{pubkey ? pubkey.slice(0,8)+'…' : 'not logged in'}</span>
            <span className="ml-auto text-[9px] font-mono text-primary/70 border border-primary/30 px-1">SIDE A</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const v = inputA.trim(); if (!v) return; onUpdate({ statementA: v, step: 'B' }); setInputA(''); }} className="flex flex-col gap-2">
            <input value={inputA} onChange={e => setInputA(e.target.value)} placeholder="Enter your statement…" autoFocus
              className="bg-transparent border border-border font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/25" />
            <div className="text-[10px] font-mono text-muted-foreground/30 italic px-1">e.g. "Claude Code is the go-to desktop tool."</div>
            <button type="submit" disabled={!inputA.trim()} className="font-mono text-xs px-3 py-2 border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">next →</button>
          </form>
        </div>
      )}

      {draft.step === 'B' && (
        <div className="flex flex-col gap-4">
          <div className="border border-primary/20 bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1"><NpubIcon pubkey={draft.pubkeyA} size={12} /><span className="text-[9px] font-mono text-muted-foreground/40">{draft.pubkeyA.slice(0,8)}…</span></div>
            <p className="text-[11px] font-mono text-foreground/80">"{draft.statementA}"</p>
          </div>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border/40" /><span className="text-[10px] font-mono text-muted-foreground/20">VS</span><div className="flex-1 h-px bg-border/40" /></div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <NpubIcon pubkey={pubkey ?? ''} size={20} />
              <span className="text-[10px] font-mono text-muted-foreground/50">{draft.pubkeyA === pubkey ? 'you (1P)' : 'challenger'}</span>
              <span className="ml-auto text-[9px] font-mono text-purple-400/70 border border-purple-400/30 px-1">SIDE B</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const v = inputB.trim(); if (!v) return; onUpdate({ statementB: v, pubkeyB: pubkey ?? draft.pubkeyA, step: 'vote' }); setInputB(''); }} className="flex flex-col gap-2">
              <input value={inputB} onChange={e => setInputB(e.target.value)} placeholder="Counter or compare…" autoFocus
                className="bg-transparent border border-border font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-purple-400/50 text-foreground placeholder:text-muted-foreground/25" />
              <div className="text-[10px] font-mono text-muted-foreground/30 italic px-1">e.g. "Red Sonia (2025) is a must-see film."</div>
              <button type="submit" disabled={!inputB.trim()} className="font-mono text-xs px-3 py-2 border border-purple-400/40 text-purple-400 hover:bg-purple-400/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">next →</button>
            </form>
          </div>
        </div>
      )}

      {draft.step === 'vote' && (
        <div className="flex flex-col gap-4">
          <div className="border border-primary/20 bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1"><NpubIcon pubkey={draft.pubkeyA} size={12} /><span className="text-[9px] font-mono text-muted-foreground/40">{draft.pubkeyA.slice(0,8)}…</span><span className="ml-auto text-[9px] font-mono text-primary/40">A</span></div>
            <p className="text-[11px] font-mono text-foreground/80">"{draft.statementA}"</p>
          </div>
          <div className="border border-purple-400/20 bg-purple-400/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1"><NpubIcon pubkey={draft.pubkeyB} size={12} /><span className="text-[9px] font-mono text-muted-foreground/40">{draft.pubkeyB.slice(0,8)}…</span><span className="ml-auto text-[9px] font-mono text-purple-400/40">B</span></div>
            <p className="text-[11px] font-mono text-foreground/80">"{draft.statementB}"</p>
          </div>
          <div>
            <div className="text-[9px] font-mono text-muted-foreground/40 mb-1.5 uppercase tracking-wider">do they agree?</div>
            <div className="flex gap-2">
              {(['agreed', 'disagreed'] as Verdict[]).map(v => (
                <button key={v} onClick={() => onUpdate({ verdict: v })}
                  className={`flex-1 font-mono text-xs py-2 border transition-colors ${draft.verdict === v ? v === 'agreed' ? 'border-primary bg-primary/10 text-primary' : 'border-purple-400 bg-purple-400/10 text-purple-400' : 'border-border text-muted-foreground/60 hover:border-border/80'}`}>
                  {v === 'agreed' ? '✓ agreed' : '✗ disagreed'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-muted-foreground/40 mb-1.5 uppercase tracking-wider">statement A is…</div>
            <div className="flex gap-2">
              {(['true', 'false', 'both-false'] as TruthResult[]).map(r => (
                <button key={r} onClick={() => onUpdate({ result: r })}
                  className={`flex-1 font-mono text-[10px] py-2 border transition-colors ${draft.result === r ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground/60 hover:border-border/80'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onPublish} disabled={publishing || draft.verdict === 'pending' || draft.result === 'pending' || !pubkey}
            className="font-mono text-xs px-3 py-2.5 border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
            {publishing ? 'publishing…' : !pubkey ? 'log in to publish' : '✦ publish to nostr'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── GameView (classic layout with icons + stats) ──────────────────────────────
function GameView({ pubkey, challenges }: { pubkey: string | null; challenges: Challenge[] }) {
  const [score1, setScore1] = useState(21);
  const [score2, setScore2] = useState(21);
  const [statements1, setStatements1] = useState<Statement[]>([]);
  const [statements2, setStatements2] = useState<Statement[]>([]);
  const [publishing, setPublishing] = useState(false);

  const stats = useMemo(() => {
    if (!pubkey) return null;
    const mine = challenges.filter(c => !c.id.startsWith('demo-') && (c.pubkeyA === pubkey || c.pubkeyB === pubkey));
    if (!mine.length) return null;
    const wins = mine.filter(c => (c.pubkeyA === pubkey && c.result === 'true') || (c.pubkeyB === pubkey && c.result === 'false')).length;
    const losses = mine.filter(c => (c.pubkeyA === pubkey && c.result === 'false') || (c.pubkeyB === pubkey && c.result === 'true')).length;
    const pending = mine.filter(c => c.verdict === 'pending').length;
    return { total: mine.length, wins, losses, pending };
  }, [pubkey, challenges]);

  const handleSubmit = async (side: 1 | 2, text: string) => {
    const stmt: Statement = { text, pubkey: pubkey ?? undefined, published: false };
    if (side === 1) setStatements1(p => [stmt, ...p]);
    else setStatements2(p => [stmt, ...p]);
    if (pubkey) {
      setPublishing(true);
      const ok = await publishStatement(side, text, pubkey);
      setPublishing(false);
      if (ok) {
        if (side === 1) setStatements1(p => p.map((s, i) => i === 0 ? { ...s, published: true } : s));
        else setStatements2(p => p.map((s, i) => i === 0 ? { ...s, published: true } : s));
      }
    }
  };

  const adjudicate = (w: 1 | 2) => {
    if (w === 1) { setScore1(s => s + 1); setScore2(s => Math.max(0, s - 1)); }
    else { setScore1(s => Math.max(0, s - 1)); setScore2(s => s + 1); }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

      {/* Stats bar (logged in only) */}
      {pubkey && (
        <div className="border border-border/40 bg-card/20 px-4 py-2.5 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <NpubIcon pubkey={pubkey} size={20} />
            <span className="text-[10px] font-mono text-muted-foreground/60">{pubkey.slice(0, 8)}…</span>
          </div>
          {stats ? (
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono">
                <span className="text-primary">{stats.wins}W</span>
                <span className="text-muted-foreground/30 mx-1">·</span>
                <span className="text-red-400/70">{stats.losses}L</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/40">{stats.total} challenges</span>
              {stats.pending > 0 && (
                <span className="text-[10px] font-mono text-yellow-400/70">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400/70 mr-1 animate-pulse" />
                  {stats.pending} pending
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground/30">no challenges yet</span>
          )}
        </div>
      )}

      {/* Score */}
      <section>
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">score</h2>
        <div className="border border-border bg-card/30 p-4">
          <GameBoard score1={score1} score2={score2} />
        </div>
      </section>

      {/* Adjudicate */}
      <section>
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">adjudicate</h2>
        <div className="flex gap-3">
          <button onClick={() => adjudicate(1)} className="font-mono text-xs px-4 py-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors">Side A Wins</button>
          <button onClick={() => adjudicate(2)} className="font-mono text-xs px-4 py-2 border border-purple-400/50 text-purple-400 hover:bg-purple-400/10 transition-colors">Side B Wins</button>
        </div>
      </section>

      {/* Statements */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-[9px] font-mono uppercase tracking-widest text-primary/70">Side A</h2>
          <StatementInput onSubmit={(t) => handleSubmit(1, t)} placeholder="State your case for Side A…" disabled={publishing} />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {statements1.length === 0 ? (
              <div className="border border-border/30 bg-card/20 px-3 py-2 opacity-40">
                <div className="flex items-center gap-1.5 mb-1">
                  <NpubIcon pubkey="a388c7ec5a20f7996e93e6c4585f0f2df782e6c8ecff1ce5cb5be58b77ff8b16" size={12} />
                  <span className="text-[9px] font-mono text-muted-foreground/40">a388c7ec…</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground/50 italic">"Claude Code is the go-to desktop tool."</p>
              </div>
            ) : statements1.map((s, i) => (
              <div key={i} className="border border-border/60 bg-card/50 px-3 py-2 space-y-1">
                <div className="flex items-center gap-1.5">
                  {s.pubkey && <NpubIcon pubkey={s.pubkey} size={12} />}
                  {s.pubkey && <span className="text-[9px] font-mono text-muted-foreground/50">{s.pubkey.slice(0,8)}…</span>}
                  {s.published && <span className="text-[9px] font-mono text-primary/50 ml-auto">✦ nostr</span>}
                </div>
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[9px] font-mono uppercase tracking-widest text-purple-400/70">Side B</h2>
          <StatementInput onSubmit={(t) => handleSubmit(2, t)} placeholder="State your case for Side B…" disabled={publishing} />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {statements2.length === 0 ? (
              <div className="border border-border/30 bg-card/20 px-3 py-2 opacity-40">
                <div className="flex items-center gap-1.5 mb-1">
                  <NpubIcon pubkey="6216af13b33224ed42802399cc8b59d08005faf2d892e94a8a01c622f0d37fc6" size={12} />
                  <span className="text-[9px] font-mono text-muted-foreground/40">6216af13…</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground/50 italic">"Red Sonia (2025) is a must-see film."</p>
              </div>
            ) : statements2.map((s, i) => (
              <div key={i} className="border border-border/60 bg-card/50 px-3 py-2 space-y-1">
                <div className="flex items-center gap-1.5">
                  {s.pubkey && <NpubIcon pubkey={s.pubkey} size={12} />}
                  {s.pubkey && <span className="text-[9px] font-mono text-muted-foreground/50">{s.pubkey.slice(0,8)}…</span>}
                  {s.published && <span className="text-[9px] font-mono text-purple-400/50 ml-auto">✦ nostr</span>}
                </div>
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent challenges strip */}
      {challenges.length > 0 && (
        <section>
          <h2 className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">recent challenges</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {challenges.slice(0, 6).map(c => (
              <div key={c.id} className="shrink-0 border border-border/40 bg-card/20 px-3 py-2 w-44 space-y-1">
                <div className="flex items-center gap-1.5">
                  <ChallengeIcon id={c.id} size={16} />
                  <NpubIcon pubkey={c.pubkeyA} size={10} />
                  {c.pubkeyB && c.pubkeyB !== c.pubkeyA && <NpubIcon pubkey={c.pubkeyB} size={10} />}
                  <span className={`ml-auto text-[8px] font-mono ${c.verdict === 'agreed' ? 'text-primary/60' : c.verdict === 'disagreed' ? 'text-purple-400/60' : 'text-muted-foreground/30'}`}>
                    {c.verdict === 'pending' ? '···' : c.verdict}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground/60 truncate">{c.statementA}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border/30 pt-4">
        <p className="text-center text-xs font-mono text-primary/40">✦ built with claude</p>
      </footer>
    </div>
  );
}

// ── HistoryView (split-panel challenges) ──────────────────────────────────────
function HistoryView({ pubkey, challenges, onUpdate }: {
  pubkey: string | null;
  challenges: Challenge[];
  onUpdate: (fn: (c: Challenge[]) => Challenge[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [publishing, setPublishing] = useState(false);

  const filtered = challenges.filter(c =>
    !search ||
    c.statementA.toLowerCase().includes(search.toLowerCase()) ||
    c.statementB.toLowerCase().includes(search.toLowerCase()) ||
    c.pubkeyA.startsWith(search.toLowerCase()) || c.pubkeyB.startsWith(search.toLowerCase())
  );

  function startNew() {
    if (!pubkey) return;
    setSelected(null);
    setDraft({ id: crypto.randomUUID(), statementA: '', statementB: '', pubkeyA: pubkey, pubkeyB: pubkey, verdict: 'pending', result: 'pending', step: 'A' });
  }

  async function handlePublish() {
    if (!draft || !pubkey) return;
    setPublishing(true);
    const ok = await publishChallenge(draft);
    setPublishing(false);
    if (ok) {
      const finished: Challenge = { ...draft };
      onUpdate(c => [finished, ...c.filter(x => x.id !== finished.id)]);
      setSelected(finished);
      setDraft(null);
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* List */}
      <div className="w-64 sm:w-72 shrink-0 border-r border-border flex flex-col">
        <div className="p-2 border-b border-border/60 flex items-center gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search…"
            className="flex-1 bg-transparent border border-border/40 font-mono text-[10px] px-2 py-1.5 focus:outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/25" />
          <button onClick={startNew} disabled={!pubkey} title={!pubkey ? 'Log in to create' : 'New challenge'}
            className="shrink-0 text-[10px] font-mono text-muted-foreground/40 hover:text-primary border border-border/40 px-2 py-1.5 transition-colors disabled:opacity-25 disabled:cursor-not-allowed">
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0
            ? <div className="p-4 text-[10px] font-mono text-muted-foreground/30">no results</div>
            : filtered.map(c => (
                <ChallengeCard key={c.id} ch={c} active={selected?.id === c.id && !draft}
                  onClick={() => { setSelected(c); setDraft(null); }} />
              ))
          }
        </div>
      </div>
      {/* Detail */}
      <div className="flex-1 overflow-y-auto">
        {draft ? (
          <NewChallengeWizard draft={draft} pubkey={pubkey} publishing={publishing}
            onUpdate={u => setDraft(d => d ? { ...d, ...u } : null)}
            onPublish={handlePublish} onCancel={() => setDraft(null)} />
        ) : selected ? (
          <ChallengeDetail ch={selected} onNew={startNew} />
        ) : (
          <div className="p-6 flex flex-col items-center justify-center gap-5 h-full">
            <div className="max-w-xs w-full space-y-3">
              <div className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-wider">example flow</div>
              <div className="border border-border/40 p-4 space-y-3">
                <div className="border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <NpubIcon pubkey="a388c7ec5a20f7996e93e6c4585f0f2df782e6c8ecff1ce5cb5be58b77ff8b16" size={12} />
                    <span className="text-[9px] font-mono text-muted-foreground/40">a388c7ec…</span>
                  </div>
                  <p className="text-[11px] font-mono text-foreground/70">"Claude Code is the go-to desktop tool."</p>
                </div>
                <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border/30" /><span className="text-[9px] font-mono text-muted-foreground/15">VS</span><div className="flex-1 h-px bg-border/30" /></div>
                <div className="border border-purple-400/20 bg-purple-400/5 px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <NpubIcon pubkey="6216af13b33224ed42802399cc8b59d08005faf2d892e94a8a01c622f0d37fc6" size={12} />
                    <span className="text-[9px] font-mono text-muted-foreground/40">6216af13…</span>
                  </div>
                  <p className="text-[11px] font-mono text-foreground/70">"Red Sonia (2025) is a must-see film."</p>
                </div>
                <div className="pt-1 border-t border-border/30 flex gap-3">
                  <span className="text-[9px] font-mono text-purple-400/50">disagreed</span>
                  <span className="text-[9px] font-mono text-primary/50">A: true · B: pending</span>
                </div>
              </div>
            </div>
            <button onClick={startNew} disabled={!pubkey}
              className="font-mono text-xs px-5 py-2.5 border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
              {pubkey ? '+ new challenge' : 'log in to create'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const { pubkey, login, logout } = useNostrLogin();
  const [view, setView] = useState<'game' | 'history'>('game');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t < SQUARE_COUNT ? t + 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchChallenges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchChallenges() {
    setLoading(true);
    loadedRef.current = false;
    const ws = new WebSocket(RELAY_URL);
    const subId = 'ts-' + Date.now();
    const collected: Challenge[] = [];

    const finish = (items: Challenge[]) => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      try { ws.close(); } catch {}
      const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);
      setChallenges(sorted.length > 0 ? sorted : DEMO);
      setLoading(false);
    };

    const timer = setTimeout(() => finish(collected), 8000);
    ws.onopen = () => ws.send(JSON.stringify(['REQ', subId, { kinds: [CHALLENGE_KIND], '#t': ['truthstakes'], limit: 100 }]));
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data as string) as unknown[];
        if (msg[0] === 'EVENT' && msg[2]) { const ch = parseChallenge(msg[2] as Record<string,unknown>); if (ch) collected.push(ch); }
        else if (msg[0] === 'EOSE') { clearTimeout(timer); finish(collected); }
      } catch {}
    };
    ws.onerror = () => { clearTimeout(timer); finish(collected); };
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Nav — standard pattern */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <a href="https://upleb.uk" className="font-mono text-[11px] sm:text-[12px] text-muted-foreground/50 hover:text-primary transition-colors shrink-0">upleb</a>
          {(() => {
            const SUBS = ['blst','fx','glmps','npub','pls','smpl','trth'] as const;
            const cur = SUBS.find((s) => window.location.hostname === `${s}.upleb.uk`);
            return <>
              {cur && <span className="font-mono text-[11px] sm:text-[12px] text-primary whitespace-nowrap shrink-0 cursor-default">{cur}</span>}
              <div className="flex-1 flex justify-center items-center gap-x-3 overflow-x-auto">
                {SUBS.filter((s) => s !== cur).map((sub) => (
                  <a key={sub} href={`https://${sub}.upleb.uk`} className="text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap text-[11px] sm:text-[12px] font-mono">{sub}</a>
                ))}
              </div>
            </>;
          })()}
          <div className="shrink-0 flex justify-end w-[34px] sm:w-[160px]"><NostrLogin pubkey={pubkey} login={login} logout={logout} /></div>
        </div>
      </nav>

      {/* Header — standard pattern */}
      <div className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <AnimatedTitle accent="trth" rest="" from="#FF7849" to="#FFB347" suffixRgba="rgba(255,120,73,0.2)" />
            <NstartHand />
          </div>
          <div className="flex items-center gap-[3px] mb-2">
            {SQUARE_COLORS.map((litColor, i) => (
              <div key={i} className="flex-1 h-[2px] transition-colors duration-300"
                style={{ backgroundColor: i < tick ? litColor : SQUARE_DIM }} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="h-[2px] bg-primary/50 shrink-0" style={{ width: 'calc((100% - 60px) / 21)' }} />
            <p className="text-sm text-muted-foreground flex-1 flex items-center gap-2 flex-wrap">
              <span>
                truth stakes{' '}
                <span className="inline-block rounded-full bg-accent text-accent-foreground font-mono text-[10px] px-2 py-0.5 align-middle">
                  kind {CHALLENGE_KIND}
                </span>
                {loading && <span className="text-muted-foreground/40 animate-pulse ml-1">syncing…</span>}
              </span>
            </p>
            <div className="flex shrink-0">
              <button onClick={() => setView('game')}
                className={`font-mono text-[10px] px-3 py-1.5 border-l border-t border-b transition-colors ${view === 'game' ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground/40 hover:text-muted-foreground/70'}`}>
                game
              </button>
              <button onClick={() => setView('history')}
                className={`font-mono text-[10px] px-3 py-1.5 border transition-colors ${view === 'history' ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground/40 hover:text-muted-foreground/70'}`}>
                hist
              </button>
            </div>
          </div>
          <RelayStats
            className="mt-2"
            urls={[RELAY_URL]}
            filter={{ kinds: [CHALLENGE_KIND], '#t': ['truthstakes'], limit: 100 }}
          />
        </div>
      </div>

      {/* Content */}
      {view === 'history' ? (
        <div className="flex flex-1 overflow-hidden">
          <HistoryView pubkey={pubkey} challenges={challenges} onUpdate={fn => setChallenges(fn)} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <GameView pubkey={pubkey} challenges={challenges} />
        </div>
      )}
    </div>
  );
}
