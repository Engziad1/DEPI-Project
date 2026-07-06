// src/pages/AnimalSoundsGame.tsx
// ============================================================
// لعبة "أصوات الحيوانات" — تدريب على التمييز السمعي-البصري
// (Auditory-Visual Discrimination Training)
//
// الفكرة العلمية: الطفل يسمع صوت حيوان (مثير سمعي) ويختار
// الصورة المطابقة له من 3 خيارات (مثير بصري). هذا النمط من
// التدريب أساسي في بروتوكولات ABA لتقوية اللغة الاستقبالية
// (Receptive Language) قبل اللغة التعبيرية (Expressive
// Language)، خصوصاً للأطفال غير اللفظيين أو محدودي اللغة.
//
// نفس نمط التكامل المستخدم في MemoryGame.tsx بالظبط:
// onComplete / onExit props، ونفس أسلوب الـ Inline Styles
// المعتمد على memoryTokens لضمان اتساق بصري كامل.
// ============================================================
import { useState, useRef } from "react";
import { memoryTokens as T } from "./theme";

interface Animal {
  name: string;
  sound: string;
  image: string;
}

interface AnimalSoundsGameProps {
  onComplete?: (result: { score: number; level: number }) => void;
  onExit?: () => void;
}

// ملحوظة: صورتا القطة والكلب مصدرهما خارجي (Pixabay) بقرار
// صريح من فريق المشروع، بخلاف باقي الحيوانات المخزّنة محلياً
// في public/images. أي تغيير مستقبلي في هذا القرار يكفي فيه
// تعديل الرابطين هنا فقط.
const ANIMALS: Animal[] = [
  { name: "قطة",    sound: "/sounds/cat.mp3",      image: "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_640.jpg" },
  { name: "كلب",    sound: "/sounds/dog.mp3",      image: "https://cdn.pixabay.com/photo/2016/02/19/15/46/labrador-retriever-1210559_640.jpg" },
  { name: "بقرة",   sound: "/sounds/cow.mp3",      image: "/images/cow.jpg" },
  { name: "حصان",   sound: "/sounds/horse.mp3",    image: "/images/horse.jpg" },
  { name: "دجاجة",  sound: "/sounds/chicken.mp3",  image: "/images/chicken.jpg" },
  { name: "خروف",   sound: "/sounds/sheep.mp3",    image: "/images/sheep.jpg" },
  { name: "بطة",    sound: "/sounds/duck.mp3",     image: "/images/duck.jpg" },
  { name: "فيل",    sound: "/sounds/elephant.mp3", image: "/images/elephant.jpg" },
  { name: "ذئب",    sound: "/sounds/wolf.mp3",     image: "/images/wolf.jpg" },
  { name: "غوريلا", sound: "/sounds/gorilla.mp3",  image: "/images/gorilla.jpg" },
];

const TOTAL_LEVELS = 10;
const POINTS_PER_LEVEL = 10;

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="11" width="8" height="10" rx="2" fill="white" />
      <path d="M10 11L20 4V28L10 21V11Z" fill="white" />
      {active && (
        <>
          <path d="M23 10C25.2 11.8 26.5 13.8 26.5 16C26.5 18.2 25.2 20.2 23 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 7C28.5 9.8 30.5 12.8 30.5 16C30.5 19.2 28.5 22.2 25 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function AnimalSoundsGame({ onComplete, onExit }: AnimalSoundsGameProps = {}) {
  const [state, setState] = useState<"start" | "playing" | "finished">("start");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<Animal | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sequenceRef = useRef<Animal[]>([]);

  function startLevel(lvl: number, seq: Animal[]) {
    const tgt = seq[lvl - 1];
    const distractors = ANIMALS.filter((a) => a.name !== tgt.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    setOptions([tgt, ...distractors].sort(() => Math.random() - 0.5));
    setTarget(tgt);
    setFeedback(null);
    setPicked(null);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = tgt.sound;
        audioRef.current.play().catch(() => {});
      }
    }, 350);
  }

  function startGame() {
    const seq = [...ANIMALS].sort(() => Math.random() - 0.5);
    sequenceRef.current = seq;
    setState("playing");
    setLevel(1);
    setLives(3);
    setScore(0);
    startLevel(1, seq);
  }

  function replaySound() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function pick(animal: Animal) {
    if (feedback || !target) return;
    setPicked(animal.name);

    if (animal.name === target.name) {
      const newScore = score + POINTS_PER_LEVEL;
      setFeedback("correct");
      setScore(newScore);
      setTimeout(() => {
        if (level < TOTAL_LEVELS) {
          const next = level + 1;
          setLevel(next);
          startLevel(next, sequenceRef.current);
        } else {
          setState("finished");
          onComplete?.({ score: newScore, level: TOTAL_LEVELS });
        }
      }, 1100);
    } else {
      setFeedback("wrong");
      const remaining = lives - 1;
      setTimeout(() => {
        if (remaining <= 0) {
          setLives(0);
          setState("finished");
          onComplete?.({ score, level });
        } else {
          setLives(remaining);
          setFeedback(null);
          setPicked(null);
        }
      }, 1100);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'Tajawal', sans-serif",
        direction: "rtl",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes appear { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 ${T.primary}33; } 50% { box-shadow:0 0 0 14px ${T.primary}00; } }
        .as-screen { animation: appear 0.25s ease; }
        .as-sound-btn:active { transform: scale(0.96); }
        .as-card:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {onExit && (
        <button
          onClick={onExit}
          aria-label="الرجوع إلى الألعاب"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            background: T.surface,
            border: `2px solid ${T.border}`,
            borderRadius: 999,
            padding: "8px 16px",
            cursor: "pointer",
            color: T.textMuted,
            fontWeight: 700,
            fontSize: 13,
            fontFamily: "inherit",
            boxShadow: `0 2px 8px ${T.shadow}`,
          }}
        >
          → رجوع
        </button>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
          margin: "0 auto",
          padding: "28px 16px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <audio
          ref={audioRef}
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
        />

        {state === "start" && (
          <div className="as-screen" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: 40 }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: 18, background: T.primary,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
                boxShadow: `0 8px 24px ${T.primary}44`,
              }}
            >
              🐾
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: T.text, margin: 0 }}>أصوات الحيوانات</h1>
            <p style={{ fontSize: 15, color: T.textMuted, maxWidth: 300, margin: 0, lineHeight: 1.7 }}>
              اسمع صوت الحيوان، واختار صورته الصح
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {["10 مستويات", "3 محاولات", `${POINTS_PER_LEVEL} نقط للمستوى`].map((chip) => (
                <span
                  key={chip}
                  style={{
                    fontSize: 12, fontWeight: 700, color: T.primary,
                    background: T.primaryBg, borderRadius: 999, padding: "6px 14px",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
            <button
              onClick={startGame}
              style={{
                marginTop: 8, padding: "14px 36px", borderRadius: 999, border: "none",
                background: T.primary, color: "#fff", fontSize: 16, fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 22px ${T.primary}44`,
              }}
            >
              ابدأ اللعب
            </button>
          </div>
        )}

        {state === "playing" && target && (
          <div className="as-screen" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: "100%", display: "flex", justifyContent: "space-around",
                background: T.surface, borderRadius: 18, padding: "14px 10px",
                boxShadow: `0 2px 10px ${T.shadow}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700 }}>المستوى</div>
                <div style={{ fontSize: 16, color: T.text, fontWeight: 900 }}>{level} / {TOTAL_LEVELS}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700 }}>النقاط</div>
                <div style={{ fontSize: 16, color: T.text, fontWeight: 900 }}>{score}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, marginBottom: 4 }}>المحاولات</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 9, height: 9, borderRadius: "50%",
                        background: i >= lives ? T.border : T.success,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: T.textMuted, margin: 0, textAlign: "center" }}>
              اضغط على الزرار واسمع الصوت، ثم اختار الحيوان
            </p>

            <button
              className="as-sound-btn"
              onClick={replaySound}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                width: 96, height: 96, borderRadius: "50%", border: "none",
                background: T.secondary, cursor: "pointer",
                animation: playing ? "none" : "pulseRing 2s ease-in-out infinite",
              }}
            >
              <SpeakerIcon active={playing} />
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>
                {playing ? "بيشتغل..." : "اسمع"}
              </span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" }}>
              {options.map((animal) => {
                const isPicked = picked === animal.name;
                const borderColor = isPicked
                  ? feedback === "correct"
                    ? T.success
                    : T.primary
                  : T.border;
                return (
                  <button
                    key={animal.name}
                    className="as-card"
                    onClick={() => pick(animal)}
                    disabled={Boolean(feedback)}
                    style={{
                      position: "relative", border: `3px solid ${borderColor}`, borderRadius: 16,
                      overflow: "hidden", background: T.surface, cursor: feedback ? "default" : "pointer",
                      padding: 0, aspectRatio: "1", display: "flex", flexDirection: "column",
                    }}
                  >
                    <img
                      src={animal.image}
                      alt={animal.name}
                      style={{ width: "100%", flex: 1, objectFit: "cover", background: T.bg }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.background = T.border;
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 800, color: T.text, padding: "6px 0", textAlign: "center" }}>
                      {animal.name}
                    </span>
                    {isPicked && feedback && (
                      <span
                        style={{
                          position: "absolute", top: 6, left: 6, fontSize: 11, fontWeight: 800,
                          padding: "2px 8px", borderRadius: 999, color: "#fff",
                          background: feedback === "correct" ? T.success : T.primary,
                        }}
                      >
                        {feedback === "correct" ? "صح ✓" : "حاول تاني"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {state === "finished" && (
          <div className="as-screen" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 40 }}>
            <div style={{ fontSize: 48 }}>{score >= 50 ? "🏆" : "🌟"}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: T.text, margin: 0 }}>
              {score >= 50 ? "مبروك، كسبت!" : "أحسنت، حاول تاني!"}
            </h1>
            <div
              style={{
                background: T.surfaceAlt ?? T.surface, borderRadius: 16, padding: "16px 32px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 900, color: T.primary }}>{score}</span>
              <span style={{ fontSize: 12, color: T.textMuted }}>نقطة من {TOTAL_LEVELS * POINTS_PER_LEVEL}</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={startGame}
                style={{
                  padding: "12px 28px", borderRadius: 999, border: "none",
                  background: T.primary, color: "#fff", fontSize: 14, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                العب تاني
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  style={{
                    padding: "12px 28px", borderRadius: 999, border: `2px solid ${T.border}`,
                    background: "transparent", color: T.textMuted, fontSize: 14, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  رجوع للألعاب
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
