"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError(
        "Adresse e-mail ou mot de passe incorrect."
      );

      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-visual">
        <img loading="lazy" decoding="async"
          src="/images/admin-login.jpg"
          alt=""
        />

        <div className="admin-login-visual-overlay" />

        <div className="admin-login-brand">
          <span className="admin-login-brand-label">
            Administration
          </span>

          <h1>
            Votre espace de gestion,
            <br />
            en toute simplicité.
          </h1>

          <p>
            Gérez vos destinations, hôtels,
            promotions et contenus depuis
            un espace sécurisé.
          </p>
        </div>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-form-wrapper">
          <div className="admin-login-heading">
            <span className="admin-login-eyebrow">
              Espace sécurisé
            </span>

            <h2>
              Bienvenue
            </h2>

            <p>
              Connectez-vous pour accéder
              à votre tableau de bord.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="admin-login-form"
          >
            <div className="admin-login-field">
              <label htmlFor="email">
                Adresse e-mail
              </label>

              <div className="admin-login-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@agence.dz"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="password">
                Mot de passe
              </label>

              <div className="admin-login-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </span>

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>
          </form>

          <p className="admin-login-security">
            Accès réservé au personnel autorisé.
          </p>
        </div>
      </section>
    </main>
  );
}