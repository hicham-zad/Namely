"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSwipes, type NameEntry } from "@/hooks/useSwipes";
import { useCouple } from "@/hooks/useCouple";
import { Heart, Search, X, Globe } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function LikesPage() {
  const { user } = useAuth();
  const { couple } = useCouple();
  const { fetchLikes, unlikeName } = useSwipes(couple?.id ?? null);
  const [likes, setLikes] = useState<NameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchLikes();
    setLikes(data);
    setIsLoading(false);
  }, [fetchLikes]);

  useEffect(() => { load(); }, []);
  useEffect(() => {}, [search, filterGender]);

  const handleUnlike = async (nameId: string) => {
    await unlikeName(nameId);
    setLikes((prev) => prev.filter((n) => n.id !== nameId));
  };

  const filtered = likes.filter((n) => {
    if (search && !n.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterGender !== "all" && n.gender !== filterGender) return false;
    return true;
  });

  const genderLabel = (g: string) => g === "boy" ? "♂ Boy" : g === "girl" ? "♀ Girl" : "⚥ Unisex";

  return (
    <div className="likes-page">
      <div className="likes-page__header">
        <div>
          <h1>My Likes</h1>
          <p className="text-muted">{likes.length} name{likes.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="likes-page__filters">
        <div className="likes-page__search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search your likes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="likes-page__search-clear">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="likes-page__gender-filter">
          {["all", "boy", "girl", "unisex"].map((g) => (
            <button
              key={g}
              className={`chip ${filterGender === g ? "chip--selected" : ""}`}
              onClick={() => setFilterGender(g)}
            >
              {g === "all" ? "All" : genderLabel(g)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="likes-page__loading"><div className="dash-loading__spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="likes-page__empty">
          <Heart size={40} className="text-muted" />
          <h2>{likes.length === 0 ? "No likes yet" : "No results"}</h2>
          <p>{likes.length === 0 ? "Swipe right on names you love — they'll appear here." : "Try a different search or filter."}</p>
        </div>
      ) : (
        <div className="name-grid">
          {filtered.map((name) => (
            <div key={name.id} className="name-tile">
              <div className="name-tile__header">
                <span className="name-tile__gender" data-gender={name.gender}>
                  {genderLabel(name.gender)}
                </span>
                <button className="name-tile__remove" onClick={() => handleUnlike(name.id)} title="Unlike">
                  <X size={13} />
                </button>
              </div>
              <div className="name-tile__name">{name.name}</div>
              {name.meaning && <p className="name-tile__meaning">{name.meaning}</p>}
              <div className="name-tile__tags">
                {name.origin && (
                  <span className="name-tile__tag name-tile__tag--origin">
                    <Globe size={10} /> {name.origin}
                  </span>
                )}
                {name.style_tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="name-tile__tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
