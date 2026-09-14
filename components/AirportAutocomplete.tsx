"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Plane, Search } from "lucide-react";
import { AIRPORTS, type Airport } from "@/lib/airports";

type Props = {
  name: "origin" | "destination";
  label: string;
  placeholder: string;
  icon?: "plane" | "pin";
  required?: boolean;
  initialValue?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function canonicalValue(airport: Airport) {
  return `${airport.city} (${airport.code}) — ${airport.name}`;
}

export default function AirportAutocomplete({
  name,
  label,
  placeholder,
  icon = "plane",
  required = false,
  initialValue = "",
}: Props) {
  const [query, setQuery] = useState(initialValue);
  const [selected, setSelected] = useState<Airport | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) {
      return AIRPORTS.filter((airport) =>
        ["ALG", "ORN", "CDG", "IST", "DXB", "DOH"].includes(airport.code)
      ).slice(0, 6);
    }

    return AIRPORTS
      .map((airport) => {
        const code = normalize(airport.code);
        const city = normalize(airport.city);
        const airportName = normalize(airport.name);
        const country = normalize(airport.country);

        let score = 0;
        if (code === q) score += 100;
        else if (code.startsWith(q)) score += 80;
        else if (code.includes(q)) score += 55;

        if (city === q) score += 75;
        else if (city.startsWith(q)) score += 55;
        else if (city.includes(q)) score += 35;

        if (airportName.startsWith(q)) score += 30;
        else if (airportName.includes(q)) score += 20;

        if (country.startsWith(q)) score += 14;
        else if (country.includes(q)) score += 8;

        return { airport, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city, "fr"))
      .slice(0, 8)
      .map((item) => item.airport);
  }, [query]);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function choose(airport: Airport) {
    setSelected(airport);
    setQuery(`${airport.city} (${airport.code})`);
    setOpen(false);
  }

  const Icon = icon === "pin" ? MapPin : Plane;

  return (
    <div className="ticket-airport-field ticket-field ticket-field-large" ref={rootRef}>
      <span><Icon size={15} /> {label}</span>

      <div className="ticket-airport-input-wrap">
        <Search size={14} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!open || results.length === 0) return;

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % results.length);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => (index - 1 + results.length) % results.length);
            }

            if (event.key === "Enter") {
              event.preventDefault();
              choose(results[activeIndex]);
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          required={required}
          aria-autocomplete="list"
          aria-expanded={open}
        />
      </div>

      <input
        type="hidden"
        name={name}
        value={selected ? canonicalValue(selected) : query.trim()}
      />

      {open && (
        <div className="ticket-airport-dropdown" role="listbox">
          {results.length > 0 ? (
            results.map((airport, index) => (
              <button
                type="button"
                key={`${airport.code}-${airport.city}`}
                className={index === activeIndex ? "active" : ""}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(airport)}
              >
                <span className="ticket-airport-code">{airport.code}</span>
                <span className="ticket-airport-copy">
                  <strong>{airport.city}</strong>
                  <small>{airport.name}</small>
                  <em>{airport.country}</em>
                </span>
                <span className="ticket-airport-select">Choisir</span>
              </button>
            ))
          ) : (
            <div className="ticket-airport-empty">
              <MapPin size={17} />
              <span>Aucun aéroport trouvé. Essayez un code IATA, une ville ou un pays.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
