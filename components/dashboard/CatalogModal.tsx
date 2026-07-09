"use client";

import { createClient } from "@/lib/supabase-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Plus, Check, Globe, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import type { NameEntry } from "@/hooks/useSwipes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingIds: Set<string>;
  onAddName: (name: NameEntry) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const GENDERS = ["All", "Boy", "Girl", "Unisex"] as const;
type Gender = (typeof GENDERS)[number];
const PAGE_SIZE = 40;
const FREE_LIMIT = 100;

export default function CatalogModal({ isOpen, onClose, existingIds, onAddName, isPremium, onUpgrade }: Props) {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<Gender>("All");
  const [results, setResults] = useState<NameEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0); // 0-indexed
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const displayCount = isPremium ? totalCount : Math.min(totalCount, FREE_LIMIT);
  const totalPages = Math.ceil(displayCount / PAGE_SIZE);

  const fetchNames = useCallback(
    async (q: string, g: Gender, pg: number) => {
      setIsLoading(true);
      try {
        let from = pg * PAGE_SIZE;
        let to = from + PAGE_SIZE - 1;

        if (!isPremium) {
          if (from >= FREE_LIMIT) {
             setResults([]);
             setIsLoading(false);
             return;
          }
          if (to >= FREE_LIMIT) {
             to = FREE_LIMIT - 1;
          }
        }

        // Base query with gender filter
        let countQ = supabase.from("names").select("id", { count: "exact", head: true });
        let dataQ = supabase.from("names").select("*").range(from, to).order("name");

        if (g !== "All") {
          const gKey = g.toLowerCase();
          countQ = countQ.eq("gender", gKey) as any;
          dataQ = dataQ.eq("gender", gKey) as any;
        }

        // Add search filter on top
        if (q.trim().length >= 1) {
          countQ = countQ.ilike("name", `${q.trim()}%`) as any;
          dataQ = dataQ.ilike("name", `${q.trim()}%`) as any;
        }

        const [{ count }, { data }] = await Promise.all([countQ, dataQ]);
        setTotalCount(count ?? 0);
        setResults((data as NameEntry[]) ?? []);
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setGender("All");
      setPage(0);
      setAdded(new Set());
      fetchNames("", "All", 0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Scroll results to top on page change
  useEffect(() => {
    resultsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPage(0);
      fetchNames(v, gender, 0);
    }, 280);
  };

  const handleGenderChange = (g: Gender) => {
    setGender(g);
    setPage(0);
    fetchNames(query, g, 0);
  };

  const handlePageChange = (pg: number) => {
    setPage(pg);
    fetchNames(query, gender, pg);
  };

  const handleAdd = (name: NameEntry) => {
    if (added.has(name.id) || existingIds.has(name.id)) return;
    setAdded((prev) => new Set(prev).add(name.id));
    onAddName(name);
  };

  const clearSearch = () => {
    setQuery("");
    setPage(0);
    fetchNames("", gender, 0);
    inputRef.current?.focus();
  };

  // Pagination page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const pages: (number | "…")[] = [];
    if (page <= 3) {
      pages.push(0, 1, 2, 3, 4, "…", totalPages - 1);
    } else if (page >= totalPages - 4) {
      pages.push(0, "…", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pages.push(0, "…", page - 1, page, page + 1, "…", totalPages - 1);
    }
    return pages;
  };

  if (!isOpen) return null;

  return (
    <div className="catalog-backdrop" onClick={onClose}>
      <div className="catalog-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="catalog-header">
          <div>
            <h2 className="catalog-title">Name Catalog</h2>
            <p className="catalog-subtitle">
              {isLoading ? "Loading…" : `${totalCount.toLocaleString()} names`}
              {gender !== "All" ? ` · ${gender}` : ""}
              {query ? ` · "${query}"` : ""}
            </p>
          </div>
          <button className="catalog-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Search bar */}
        <div className="catalog-search">
          <Search size={16} className="catalog-search__icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search names… e.g. Luna, Oliver"
            value={query}
            onChange={handleQueryChange}
            className="catalog-search__input"
            autoComplete="off"
          />
          {query && (
            <button className="catalog-search__clear" onClick={clearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Gender filter pills */}
        <div className="catalog-filters">
          {GENDERS.map((g) => (
            <button
              key={g}
              className={`catalog-pill ${gender === g ? "catalog-pill--active" : ""}`}
              onClick={() => handleGenderChange(g)}
            >
              {g}
            </button>
          ))}
          {!isLoading && totalCount > 0 && (
            <span className="catalog-filters__count">
              Page {page + 1} of {totalPages}
            </span>
          )}
        </div>

        {/* Results list */}
        <div className="catalog-results" ref={resultsRef}>
          {isLoading && (
            <div className="catalog-empty">
              <div className="dash-loading__spinner" style={{ margin: "0 auto" }} />
              <p>Loading names…</p>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="catalog-empty">
              <p>No names found{query ? ` for "${query}"` : ""}.</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="catalog-list">
              {results.map((n) => {
                const alreadyIn = existingIds.has(n.id) || added.has(n.id);
                return (
                  <li key={n.id} className="catalog-item">
                    <div className="catalog-item__left">
                      <span className="catalog-item__badge" data-gender={n.gender}>
                        {n.gender === "boy" ? "♂" : n.gender === "girl" ? "♀" : "⚥"}
                      </span>
                      <div className="catalog-item__info">
                        <span className="catalog-item__name">{n.name}</span>
                        <span className="catalog-item__meta">
                          {n.origin && (
                            <span className="catalog-item__origin">
                              <Globe size={10} /> {n.origin}
                            </span>
                          )}
                          {n.meaning && (
                            <span className="catalog-item__meaning"> · {n.meaning}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`catalog-item__btn ${alreadyIn ? "catalog-item__btn--done" : ""}`}
                      onClick={() => handleAdd(n)}
                      disabled={alreadyIn}
                      title={alreadyIn ? "Already in queue" : "Add to queue"}
                    >
                      {alreadyIn ? <Check size={15} /> : <Plus size={15} />}
                      <span>{alreadyIn ? "Added" : "Add"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Premium Banner */}
          {!isLoading && !isPremium && totalCount > FREE_LIMIT && (
            <div className="catalog-upgrade-banner">
              <div className="catalog-upgrade-banner__left">
                <div className="catalog-upgrade-icon">
                  <Crown size={16} fill="currentColor" />
                </div>
                <div>
                  <strong>Unlock {totalCount.toLocaleString()} names</strong>
                  <p>You&apos;ve reached the free limit.</p>
                </div>
              </div>
              <button className="catalog-upgrade-btn" onClick={onUpgrade}>
                Upgrade
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="catalog-pagination">
            <button
              className="catalog-page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="catalog-page-ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  className={`catalog-page-btn ${page === p ? "catalog-page-btn--active" : ""}`}
                  onClick={() => handlePageChange(p as number)}
                >
                  {(p as number) + 1}
                </button>
              )
            )}

            <button
              className="catalog-page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Footer when names added */}
        {added.size > 0 && (
          <div className="catalog-footer">
            <span className="catalog-footer__count">
              ✓ {added.size} name{added.size !== 1 ? "s" : ""} added to queue
            </span>
            <button className="btn btn--primary btn--sm" onClick={onClose}>
              Start Swiping →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
