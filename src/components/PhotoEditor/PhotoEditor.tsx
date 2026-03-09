import React, { useCallback, useEffect, useRef, useState } from "react";
import leftImage from "../../assets/left.png";
import rightImage from "../../assets/right.png";
import "./PhotoEditor.css";
import { Position, Transform } from "./types";

/* ── Types ───────────────────────────────────────────── */
type Theme = "dark" | "light";

interface Hat {
  id: string;
  label: string;
  src: string;
  isCustom?: boolean;
}

/* ── Constants ───────────────────────────────────────── */
const STORAGE_THEME = "hat-editor-theme";
const STORAGE_CUSTOM_HATS = "hat-editor-custom-hats";

const BUILTIN_HATS: Hat[] = [
  { id: "right", label: "elizaOS →", src: rightImage },
  { id: "left", label: "elizaOS ←", src: leftImage },
];

const INITIAL_TRANSFORM: Transform = {
  position: { x: 0, y: 0 },
  rotation: 0,
  scale: 1,
  flipX: false,
};

/* ── Helper ──────────────────────────────────────────── */
function loadCustomHats(): Hat[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_HATS);
    return raw ? (JSON.parse(raw) as Hat[]) : [];
  } catch {
    return [];
  }
}

function persistCustomHats(hats: Hat[]): void {
  localStorage.setItem(STORAGE_CUSTOM_HATS, JSON.stringify(hats));
}

/* ── Component ───────────────────────────────────────── */
export const PhotoEditor: React.FC = () => {
  /* Theme */
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_THEME) as Theme | null) ?? "dark",
  );

  /* Hats */
  const [hats, setHats] = useState<Hat[]>(() => [
    ...BUILTIN_HATS,
    ...loadCustomHats(),
  ]);
  const [selectedHatId, setSelectedHatId] = useState<string>("right");
  const currentHat = hats.find((h) => h.id === selectedHatId) ?? hats[0];

  /* Image */
  const [baseImage, setBaseImage] = useState<string>("");
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);

  /* Status toast */
  const [status, setStatus] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const statusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  /* ── Theme effect ──────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  /* ── Cleanup timer on unmount ──────────────────────── */
  useEffect(() => () => clearTimeout(statusTimer.current), []);

  /* ── showStatus (stable ref – empty deps intentional) */
  const showStatus = useCallback(
    (message: string, type: "error" | "success") => {
      clearTimeout(statusTimer.current);
      setStatus({ message, type });
      statusTimer.current = setTimeout(() => setStatus(null), 2200);
    },
    [],
  );

  /* ── Image upload ──────────────────────────────────── */
  const handleBaseImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showStatus("Please select an image file", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setOriginalImageSize({ width: img.width, height: img.height });
          showStatus("Photo loaded!", "success");
        };
        img.src = dataUrl;
        setBaseImage(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [showStatus],
  );

  /* ── Custom hat upload ─────────────────────────────── */
  const handleCustomHatUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showStatus("Please select an image file", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newHat: Hat = {
          id: `custom-${Date.now()}`,
          label: file.name.replace(/\.[^.]+$/, "").slice(0, 20),
          src: dataUrl,
          isCustom: true,
        };
        setHats((prev) => {
          const updated = [...prev, newHat];
          persistCustomHats(updated.filter((h) => h.isCustom));
          return updated;
        });
        setSelectedHatId(newHat.id);
        showStatus("Custom hat added!", "success");
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [showStatus],
  );

  /* ── Remove custom hat ─────────────────────────────── */
  const handleRemoveCustomHat = useCallback((hatId: string) => {
    setHats((prev) => {
      const updated = prev.filter((h) => h.id !== hatId);
      persistCustomHats(updated.filter((h) => h.isCustom));
      return updated;
    });
    setSelectedHatId("right");
  }, []);

  /* ── Drag: touch ───────────────────────────────────── */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        isDragging.current = true;
        const t = e.touches[0];
        dragStart.current = {
          x: t.clientX - transform.position.x,
          y: t.clientY - transform.position.y,
        };
      }
    },
    [transform.position],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging.current && e.touches.length === 1) {
      const t = e.touches[0];
      setTransform((prev) => ({
        ...prev,
        position: {
          x: t.clientX - dragStart.current.x,
          y: t.clientY - dragStart.current.y,
        },
      }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* ── Drag: mouse ───────────────────────────────────── */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - transform.position.x,
        y: e.clientY - transform.position.y,
      };
    },
    [transform.position],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) {
      setTransform((prev) => ({
        ...prev,
        position: {
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        },
      }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* ── Transform controls ────────────────────────────── */
  const handleRotate = useCallback((dir: "left" | "right") => {
    setTransform((p) => ({
      ...p,
      rotation: p.rotation + (dir === "left" ? -15 : 15),
    }));
  }, []);

  const handleScale = useCallback((dir: "up" | "down") => {
    setTransform((p) => ({
      ...p,
      scale: Math.max(0.1, Math.min(7, p.scale * (dir === "up" ? 1.1 : 0.9))),
    }));
  }, []);

  const handleFlip = useCallback(() => {
    setTransform((p) => ({ ...p, flipX: !p.flipX }));
  }, []);

  const handleReset = useCallback(() => {
    setTransform(INITIAL_TRANSFORM);
  }, []);

  /* ── Save / download ───────────────────────────────── */
  const handleSave = useCallback(async () => {
    if (!baseImage || !overlayRef.current || !containerRef.current) {
      showStatus("Please upload a photo first", "error");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const baseImg = new Image();
      baseImg.src = baseImage;
      await new Promise<void>((res) => {
        baseImg.onload = () => res();
      });

      canvas.width = originalImageSize.width;
      canvas.height = originalImageSize.height;
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      const rect = containerRef.current.getBoundingClientRect();
      const containerAspect = rect.width / rect.height;
      const imageAspect = canvas.width / canvas.height;

      let dW = rect.width;
      let dH = rect.height;
      if (containerAspect > imageAspect) dW = dH * imageAspect;
      else dH = dW / imageAspect;

      const scaleX = canvas.width / dW;
      const scaleY = canvas.height / dH;

      if (overlayRef.current.querySelector("img")) {
        const hatImg = new Image();
        hatImg.src = currentHat.src;
        await new Promise<void>((res) => {
          hatImg.onload = () => res();
        });

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.save();
        ctx.translate(
          cx + transform.position.x * scaleX,
          cy + transform.position.y * scaleY,
        );
        ctx.rotate((transform.rotation * Math.PI) / 180);
        ctx.scale(
          transform.scale * (transform.flipX ? -1 : 1),
          transform.scale,
        );

        const ow = 100 * scaleX;
        const oh = (ow * hatImg.height) / hatImg.width;
        ctx.drawImage(hatImg, -ow / 2, -oh / 2, ow, oh);
        ctx.restore();
      }

      const link = document.createElement("a");
      link.download = "you-are-a-partner-now.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showStatus("Saved!", "success");
    } catch (err) {
      console.error("Save error:", err);
      showStatus("Error saving image", "error");
    }
  }, [
    baseImage,
    showStatus,
    originalImageSize.width,
    originalImageSize.height,
    currentHat.src,
    transform.position.x,
    transform.position.y,
    transform.rotation,
    transform.flipX,
    transform.scale,
  ]);

  /* ── Hat overlay CSS vars via ref (avoids inline style JSX prop) */
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.setProperty("--hat-x", `${transform.position.x}px`);
    el.style.setProperty("--hat-y", `${transform.position.y}px`);
    el.style.setProperty("--hat-rotation", `${transform.rotation}deg`);
    el.style.setProperty(
      "--hat-scale-x",
      `${transform.scale * (transform.flipX ? -1 : 1)}`,
    );
    el.style.setProperty("--hat-scale-y", `${transform.scale}`);
  }, [transform]);

  /* ── Render ────────────────────────────────────────── */
  return (
    <div className={`photo-editor-root theme-${theme}`}>
      {/* ── Header ── */}
      <header className="pe-header">
        <div className="pe-header-brand">
          <span className="pe-logo-emoji" aria-hidden="true">
            🎩
          </span>
          <h1 className="pe-title">Put On Your Hat</h1>
        </div>
        <div className="pe-header-right">
          <p className="pe-subtitle">Be a Partner</p>
          <button
            className="pe-theme-btn"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pe-main">
        {/* Canvas area */}
        <section className="pe-canvas-section">
          <label className="pe-upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleBaseImageUpload}
              title="Upload your photo"
            />
            <span className="pe-upload-icon" aria-hidden="true">
              📷
            </span>
            <span>{baseImage ? "Change photo" : "Upload your photo"}</span>
          </label>

          <div
            ref={containerRef}
            className="pe-canvas"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            aria-label="Hat editor canvas"
          >
            {!baseImage && (
              <div className="pe-canvas-placeholder" aria-hidden="true">
                <span className="pe-canvas-placeholder-icon">🖼️</span>
                <span>Upload a photo to get started</span>
              </div>
            )}
            {baseImage && (
              <img src={baseImage} alt="Portrait" className="pe-base-image" />
            )}

            {/* Hat overlay — transform applied via CSS custom properties */}
            <div
              ref={overlayRef}
              className="pe-hat-overlay"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              aria-label="Drag to reposition hat"
            >
              <img
                src={currentHat.src}
                alt={`${currentHat.label} hat`}
                className="pe-hat-image"
                draggable={false}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="pe-controls">
            <div className="pe-controls-row">
              <div className="pe-controls-group">
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={() => handleRotate("left")}
                  title="Rotate left"
                >
                  ⟲ Left
                </button>
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={() => handleRotate("right")}
                  title="Rotate right"
                >
                  ⟳ Right
                </button>
              </div>
              <div className="pe-controls-divider" aria-hidden="true" />
              <div className="pe-controls-group">
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={() => handleScale("up")}
                  title="Scale up"
                >
                  ＋
                </button>
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={() => handleScale("down")}
                  title="Scale down"
                >
                  －
                </button>
              </div>
              <div className="pe-controls-divider" aria-hidden="true" />
              <div className="pe-controls-group">
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={handleFlip}
                  title="Flip hat"
                >
                  ↔ Flip
                </button>
                <button
                  className="pe-btn pe-btn-ghost"
                  onClick={handleReset}
                  title="Reset transform"
                >
                  ↺ Reset
                </button>
              </div>
              <button
                className="pe-btn pe-btn-primary pe-btn-save"
                onClick={handleSave}
                disabled={!baseImage}
                title="Download image with hat"
              >
                💾 Save
              </button>
            </div>
          </div>
        </section>

        {/* Hat selector sidebar */}
        <aside className="pe-sidebar" aria-label="Hat selection">
          <h2 className="pe-sidebar-title">Choose a Hat</h2>

          <div
            className="pe-hat-grid"
            role="listbox"
            aria-label="Available hats"
          >
            {hats.map((hat) => (
              <div key={hat.id} className="pe-hat-card-wrapper">
                <button
                  className={`pe-hat-card${selectedHatId === hat.id ? " pe-hat-card--selected" : ""}`}
                  onClick={() => setSelectedHatId(hat.id)}
                  role="option"
                  aria-selected={selectedHatId === hat.id}
                  aria-label={`${hat.label} hat${hat.isCustom ? " (custom)" : ""}`}
                >
                  <img src={hat.src} alt={hat.label} className="pe-hat-thumb" />
                  <span className="pe-hat-name">{hat.label}</span>
                </button>
                {hat.isCustom && (
                  <button
                    className="pe-hat-remove"
                    onClick={() => handleRemoveCustomHat(hat.id)}
                    aria-label={`Remove ${hat.label}`}
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <label
            className="pe-custom-hat-btn"
            title="Upload a custom hat image"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomHatUpload}
            />
            <span aria-hidden="true">➕</span>
            <span>Upload Custom Hat</span>
          </label>
        </aside>
      </main>

      {/* Status toast */}
      {status && (
        <div
          className={`pe-toast pe-toast--${status.type}`}
          role="status"
          aria-live="polite"
        >
          {status.type === "success" ? "✅" : "❌"} {status.message}
        </div>
      )}

      {/* Footer */}
      <footer className="pe-footer">
        <a
          href="https://x.com/ai16zdao"
          target="_blank"
          rel="noopener noreferrer"
          className="pe-footer-link"
        >
          <span>© 2024 elizaOS</span>
          <svg
            className="pe-footer-x-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </footer>
    </div>
  );
};

export default PhotoEditor;
