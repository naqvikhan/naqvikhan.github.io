/* Tweaks island — applies tweak values to the document root.
   Page is vanilla; this only renders the floating panel. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sand"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const r = document.documentElement;
  r.setAttribute("data-palette", t.palette);
  /* finalized choices: serif type · grid-reveal glow · vibrant dark accents */
  r.setAttribute("data-type", "editorial");
  r.setAttribute("data-herobg", "grid");
  r.setAttribute("data-tint", "vibrant");
  r.setAttribute("data-accent", "multi");
}

/* System dark-mode preference (auto light/dark) */
const SYS_DARK = (typeof window !== "undefined" && window.matchMedia)
  ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;

function TweaksApp() {
  const [t, setTweak] = useTweaks({ ...TWEAK_DEFAULTS, palette: SYS_DARK ? "dusk" : "sand" });
  const manualRef = React.useRef(false);
  React.useEffect(() => { applyTweaks(t); }, [t.palette]);

  /* follow the system theme live, unless the user has manually overridden it */
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => { if (!manualRef.current) setTweak("palette", e.matches ? "dusk" : "sand"); };
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange); };
  }, [setTweak]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" value={t.palette}
        options={[
          { value: "sand", label: "Sand — light" },
          { value: "dusk", label: "Dusk — dark" }
        ]}
        onChange={(v) => { manualRef.current = true; setTweak("palette", v); }} />
    </TweaksPanel>
  );
}

/* palette swatches (sand = light, dusk = dark) */
const PALETTE_SWATCHES = [
  { name: "sand", colors: ["#c4673b", "#f3ece0", "#7f9a6a"] },
  { name: "dusk", colors: ["#e0905c", "#221c19", "#9fb27e"] }
];
function paletteSwatch(name) {
  const p = PALETTE_SWATCHES.find(x => x.name === name) || PALETTE_SWATCHES[0];
  return p.colors;
}
function swatchToName(arr) {
  const key = JSON.stringify(arr).toLowerCase();
  const m = PALETTE_SWATCHES.find(p => JSON.stringify(p.colors).toLowerCase() === key);
  return m ? m.name : "sand";
}

(function mount() {
  applyTweaks({ ...TWEAK_DEFAULTS, palette: SYS_DARK ? "dusk" : "sand" });
  ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
})();
