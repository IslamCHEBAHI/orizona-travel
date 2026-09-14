import Link from "next/link";
import { Phone, Mail, MapPin, PlaneTakeoff } from "lucide-react";

function InstagramIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.7 22v-8.8h3l.45-3.45H13.7V7.55c0-1 .28-1.68 1.72-1.68h1.84V2.8c-.32-.04-1.41-.14-2.68-.14-2.65 0-4.47 1.62-4.47 4.6v2.5H7.1v3.45h3.01V22h3.59Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">

        {/* =========================================
            PARTIE HAUTE : A PROPOS + LOCALISATION
        ========================================= */}

        <div className="footer-premium-top">

          {/* A PROPOS */}

          <div className="footer-about">

            <span className="footer-eyebrow">
              À PROPOS
            </span>

            <h2>
              Votre voyage commence
              <em> avec nous.</em>
            </h2>

            <p className="footer-about-text">
              Nous imaginons des voyages adaptés à vos envies,
              avec une sélection de destinations, séjours et hôtels
              soigneusement choisis et un accompagnement personnalisé
              avant, pendant et après votre départ.
            </p>


            <div className="footer-contact-list">

              <div className="footer-contact-item">

                <span className="footer-contact-icon">
                  📍
                </span>

                <div>
                  <small>Notre agence</small>

                  <strong>
                    Votre adresse, Alger
                  </strong>
                </div>

              </div>


              <div className="footer-contact-item">

                <span className="footer-contact-icon">
                  ☎
                </span>

                <div>
                  <small>Téléphone</small>

                  <strong>
                    +213 XX XX XX XX XX
                  </strong>
                </div>

              </div>


              <div className="footer-contact-item">

                <span className="footer-contact-icon">
                  ✉
                </span>

                <div>
                  <small>E-mail</small>

                  <strong>
                    contact@votreagence.com
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* MAP */}

          <div className="footer-location">

            <div className="footer-location-heading">

              <div>

                <span className="footer-eyebrow">
                  NOUS TROUVER
                </span>

                <h3>
                  Passez nous voir.
                </h3>

              </div>

              <a
                href="https://maps.app.goo.gl/ZRQaJa7L5JLmJyWH8"
                target="_blank"
                rel="noreferrer"
                className="footer-map-link"
              >
                Itinéraire →
              </a>

            </div>

            <div className="footer-map">

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14461.439378910998!2d3.0496447657885684!3d36.790649990009115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb300d70ec411%3A0xdcd8958db0e1eeca!2sNelson%20Town%20Square%2C%20Bab%20El%20Oued%2016000!5e1!3m2!1sfr!2sdz!4v1787685216658!5m2!1sfr!2sdz"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de notre agence"
              />

              <div className="footer-map-badge">

                <span>
                  📍
                </span>

                <div>
                  <strong>
                    Notre agence
                  </strong>

                  <small>
                    Alger, Algérie
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>
        
        {/* =========================================
            COPYRIGHT
        ========================================= */}
        <div className="footer-premium-bottom">

          <p>© 2026 CHEBAHI Islam. Tous droits réservés.</p>
          <div>
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
