import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/react";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = (params.get("mode") || "").toLowerCase();

    if (m === "signup" || m === "sign-up") {
      setMode("sign-up");
    } else if (m === "signin" || m === "sign-in") {
      setMode("sign-in");
    }
  }, [location.search]);

  function updateMode(newMode: "sign-in" | "sign-up") {
    setMode(newMode);
    const params = new URLSearchParams(location.search);
    params.set("mode", newMode === "sign-up" ? "signup" : "signin");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  return (
    <div className="flex min-h-[70vh] items-start justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Welcome</h2>
          <div className="flex gap-2">
            <button
              onClick={() => updateMode("sign-in")}
                className={`px-3 py-1 rounded ${mode === "sign-in" ? "bg-primary text-primary-foreground" : "bg-transparent"}`}
            >
              Sign in
            </button>
            <button
                onClick={() => updateMode("sign-up")}
                className={`px-3 py-1 rounded ${mode === "sign-up" ? "bg-primary text-primary-foreground" : "bg-transparent"}`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div>
          {mode === "sign-in" ? (
            <SignIn routing="path" path="/auth" />
          ) : (
            <SignUp routing="path" path="/auth" />
          )}
        </div>
      </div>
    </div>
  );
}
