"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Falha no login");
      }

      const payload = await response.json();
      localStorage.setItem("opscope_token", payload.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#121a28] to-[#0b0f14] flex items-center justify-center px-6">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-2xl font-semibold">OPSCOPE</h1>
        <p className="mt-2 text-sm text-muted">Acesse os modulos de almoxarifado e SST.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase text-muted">Email</label>
            <input
              className="input mt-2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Senha</label>
            <input
              className="input mt-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            className="w-full rounded-lg bg-primary py-2 font-semibold text-black hover:bg-primaryDark transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="mt-6 text-xs text-muted">
          Use os usuarios seed: admin@opscope.local / senha Opscope@123
        </div>
      </div>
    </div>
  );
}
