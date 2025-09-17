import * as React from "react";
import { useLocation } from "react-router-dom";

export function RouteProgress() {
  const location = useLocation();
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
    setProgress(10);
    const start = window.setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 10 : p));
    }, 200);

    return () => {
      window.clearInterval(start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  React.useEffect(() => {
    const onLoad = () => {
      setProgress(100);
      const t = window.setTimeout(() => setVisible(false), 400);
      return () => window.clearTimeout(t);
    };
    onLoad();
  }, [location.pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-violet-500 to-cyan-400"
        style={{ width: `${progress}%`, transition: "width 200ms ease" }}
      />
    </div>
  );
}
