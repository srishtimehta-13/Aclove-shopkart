function SearchBar({ value, onChange, placeholder = "Search curated objects, attire, home...", onClear, className = "" }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="pointer-events-none absolute left-4 text-[#71977C]">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#D9D0C3] bg-[#FCFAF6] py-2.5 pl-11 pr-10 text-sm text-[#292A2A] placeholder-[#8E8A85] outline-none transition-all duration-200 focus:border-[#17483F] focus:bg-white focus:ring-1 focus:ring-[#17483F]/30"
      />

      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(""))}
          className="absolute right-3.5 text-xs text-[#8E8A85] hover:text-[#17483F] transition-colors"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
