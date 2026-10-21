"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { checkInGuest, undoCheckIn, type CheckInResult } from "@/app/actions/admin";

export type CheckInGuest = { id: string; name: string; rsvp: string; pax: number; checkedIn: boolean };

/** Pemindai bawaan browser (Chrome/Android). Tidak ada di semua browser, jadi pencarian nama selalu tersedia. */
type Detector = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };
type DetectorCtor = new (opts: { formats: string[] }) => Detector;

export default function CheckInClient({ invId, guests: initial }: { invId: string; guests: CheckInGuest[] }) {
  const [guests, setGuests] = useState(initial);
  const [query, setQuery] = useState("");
  const [banner, setBanner] = useState<CheckInResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const lastScan = useRef({ value: "", at: 0 });

  const marked = (id: string, checkedIn: boolean) => setGuests((gs) => gs.map((g) => (g.id === id ? { ...g, checkedIn } : g)));

  const doCheckIn = async (ref: { id?: string; to?: string }) => {
    setBusy(true);
    try {
      const res = await checkInGuest(invId, ref);
      setBanner(res);
      if (res.ok) {
        const hit = guests.find((g) => (ref.id ? g.id === ref.id : g.name === res.name));
        if (hit) marked(hit.id, true);
      }
      return res;
    } finally {
      setBusy(false);
    }
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return guests.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8);
  }, [guests, query]);

  const total = guests.length;
  const inCount = guests.filter((g) => g.checkedIn).length;
  const inPeople = guests.filter((g) => g.checkedIn).reduce((n, g) => n + (g.rsvp === "yes" ? g.pax : 1), 0);

  // Pemindaian kamera: baca kode QR link personal, ambil ?to= lalu check-in.
  useEffect(() => {
    if (!scanning) return;
    const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
    if (!Ctor || !navigator.mediaDevices?.getUserMedia) {
      setScanNote("Browser ini belum mendukung pemindaian kamera. Gunakan pencarian nama di bawah.");
      setScanning(false);
      return;
    }
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let alive = true;
    const detector = new Ctor({ formats: ["qr_code"] });

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        if (!alive) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        const v = video.current;
        if (!v) return;
        v.srcObject = s;
        void v.play();
        timer = setInterval(async () => {
          if (!v.videoWidth) return;
          try {
            const codes = await detector.detect(v);
            const raw = codes[0]?.rawValue;
            if (!raw) return;
            const now = Date.now();
            if (raw === lastScan.current.value && now - lastScan.current.at < 4000) return; // abaikan pindaian ganda
            lastScan.current = { value: raw, at: now };
            let to = "";
            try {
              to = new URL(raw).searchParams.get("to") ?? "";
            } catch {}
            if (!to) {
              setBanner({ ok: false, message: "Kode QR ini bukan tiket undangan." });
              return;
            }
            await doCheckIn({ to });
          } catch {}
        }, 450);
      })
      .catch(() => {
        setScanNote("Kamera tidak bisa dibuka. Izinkan akses kamera atau gunakan pencarian nama.");
        setScanning(false);
      });

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  return (
    <div className="checkin">
      <div className="stats">
        <div className="stat ok">
          <strong>{inCount}</strong>
          <span>Tamu sudah check-in</span>
        </div>
        <div className="stat ok">
          <strong>{inPeople}</strong>
          <span>Total orang hadir</span>
        </div>
        <div className="stat wait">
          <strong>{total - inCount}</strong>
          <span>Belum datang</span>
        </div>
      </div>

      {banner && (
        <div className={`checkin-banner ${banner.ok ? (banner.already ? "warn" : "ok") : "err"}`} role="status">
          <strong>{banner.message}</strong>
          {banner.ok && banner.pax ? <span>{banner.pax} orang</span> : null}
        </div>
      )}

      <div className="card">
        <h2>Pindai tiket QR</h2>
        <p className="hint">Minta tamu menunjukkan kode QR dari undangan mereka (di bagian RSVP), lalu arahkan kamera ke kode itu.</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => setScanning((s) => !s)}>
            {scanning ? "Matikan kamera" : "Nyalakan kamera"}
          </button>
          {scanNote && <span className="msg err">{scanNote}</span>}
        </div>
        {scanning && <video ref={video} className="scan-video" muted playsInline />}
      </div>

      <div className="card">
        <h2>Cari nama</h2>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik nama tamu..." aria-label="Cari tamu" autoComplete="off" />
        <ul className="checkin-list">
          {matches.map((g) => (
            <li key={g.id}>
              <span>
                <strong>{g.name}</strong>
                <small className="hint">
                  {" "}
                  · {g.rsvp === "yes" ? `Hadir (${g.pax})` : g.rsvp === "no" ? "Tidak hadir" : "Belum konfirmasi"}
                </small>
              </span>
              {g.checkedIn ? (
                <button
                  type="button"
                  className="btn small ghost"
                  onClick={async () => {
                    await undoCheckIn(invId, g.id);
                    marked(g.id, false);
                  }}
                >
                  Batalkan check-in
                </button>
              ) : (
                <button type="button" className="btn small alt" disabled={busy} onClick={() => doCheckIn({ id: g.id })}>
                  Check-in
                </button>
              )}
            </li>
          ))}
          {query.trim() && matches.length === 0 && <li className="hint">Nama tidak ditemukan di daftar tamu.</li>}
        </ul>
      </div>
    </div>
  );
}
