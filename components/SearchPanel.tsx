"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Hotel, MapPin, Plane, Search, Users } from "lucide-react";
import { AIRPORTS, type Airport } from "@/lib/airports";

type Tab = "stays" | "hotels" | "flights";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function airportLabel(airport: Airport) {
  return `${airport.city} (${airport.code}) — ${airport.name}`;
}

function HomeAirportInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const q = normalize(value);
    if (!q) return AIRPORTS.filter((a) => ["ALG", "ORN", "CDG", "IST", "DXB"].includes(a.code)).slice(0, 5);
    return AIRPORTS.filter((airport) => {
      const hay = normalize(`${airport.code} ${airport.city} ${airport.name} ${airport.country}`);
      return hay.includes(q);
    }).slice(0, 6);
  }, [value]);

  return (
    <label className="home-search-airport">
      <span><Plane size={17} /> {label}</span>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && (
        <div className="home-airport-dropdown">
          {results.length ? results.map((airport) => (
            <button
              type="button"
              key={`${airport.code}-${airport.city}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(airportLabel(airport)); setOpen(false); }}
            >
              <b>{airport.code}</b>
              <span><strong>{airport.city}</strong><small>{airport.name}</small><em>{airport.country}</em></span>
            </button>
          )) : <div className="home-airport-empty">Aucun aéroport trouvé</div>}
        </div>
      )}
    </label>
  );
}

export default function SearchPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("stays");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [origin, setOrigin] = useState("");
  const [flightDestination, setFlightDestination] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();

    if (tab === "flights") {
      const params = new URLSearchParams();
      if (origin) params.set("origin", origin);
      if (flightDestination) params.set("destination", flightDestination);
      if (departureDate) params.set("departureDate", departureDate);
      if (returnDate) params.set("returnDate", returnDate);
      params.set("adults", travelers === "4" ? "4" : travelers);
      router.push(`/billetterie?${params.toString()}#demande-billet`);
      return;
    }

    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (departureDate) params.set("date", departureDate);
    if (travelers) params.set("travelers", travelers);
    router.push(`${tab === "stays" ? "/sejours" : "/hotels"}?${params.toString()}`);
  }

  return (
    <form className="search-panel home-search-panel-pro" onSubmit={submit}>
      <div className="search-tabs" role="tablist">
        <button type="button" className={tab === "stays" ? "active" : ""} onClick={() => setTab("stays")}><MapPin size={15} /> Séjours</button>
        <button type="button" className={tab === "hotels" ? "active" : ""} onClick={() => setTab("hotels")}><Hotel size={15} /> Hôtels</button>
        <button type="button" className={tab === "flights" ? "active" : ""} onClick={() => setTab("flights")}><Plane size={15} /> Vols</button>
      </div>

      {tab === "flights" ? (
        <div className="search-fields home-flight-search-fields">
          <HomeAirportInput label="Départ" value={origin} onChange={setOrigin} placeholder="ALG, Alger..." />
          <HomeAirportInput label="Destination" value={flightDestination} onChange={setFlightDestination} placeholder="CDG, Paris..." />
          <label><span><CalendarDays size={17} /> Aller</span><input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} /></label>
          <label><span><CalendarDays size={17} /> Retour</span><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
          <label><span><Users size={17} /> Voyageurs</span><select value={travelers} onChange={(e) => setTravelers(e.target.value)}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option></select></label>
          <button className="search-submit" type="submit"><Plane size={18} /> Demander un vol</button>
        </div>
      ) : (
        <div className="search-fields">
          <label><span><MapPin size={17} /> Destination</span><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={tab === "stays" ? "Où voulez-vous partir ?" : "Ville, pays ou hôtel"} /></label>
          <label><span><CalendarDays size={17} /> Départ</span><input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} /></label>
          <label><span><Users size={17} /> Voyageurs</span><select value={travelers} onChange={(e) => setTravelers(e.target.value)}><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4+ voyageurs</option></select></label>
          <button className="search-submit" type="submit"><Search size={19} /> Rechercher</button>
        </div>
      )}
    </form>
  );
}
