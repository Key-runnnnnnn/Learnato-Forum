import { FaFilter, FaTimes } from "react-icons/fa";

interface FilterOption {
  label: string;
  value: string;
}

interface FiltersProps {
  sortBy: string;
  filterAnswered: string;
  onSortChange: (value: string) => void;
  onFilterAnsweredChange: (value: string) => void;
  onClearFilters: () => void;
}

const Filters = ({
  sortBy,
  filterAnswered,
  onSortChange,
  onFilterAnsweredChange,
  onClearFilters,
}: FiltersProps) => {
  const sortOptions: FilterOption[] = [
    { label: "Most Votes", value: "votes" },
    { label: "Most Recent", value: "date" },
    { label: "Most Replies", value: "replies" },
    { label: "Oldest First", value: "oldest" },
  ];

  const answeredOptions: FilterOption[] = [
    { label: "All Questions", value: "all" },
    { label: "Answered Only", value: "answered" },
    { label: "Unanswered Only", value: "unanswered" },
  ];

  const hasActiveFilters = filterAnswered !== "all" || sortBy !== "votes";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filters & Sorting</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Sort By */}
          <div className="flex-1 sm:flex-initial">
            <label
              htmlFor="sortBy"
              className="block text-xs text-gray-600 mb-1"
            >
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Answered */}
          <div className="flex-1 sm:flex-initial">
            <label
              htmlFor="filterAnswered"
              className="block text-xs text-gray-600 mb-1"
            >
              Status
            </label>
            <select
              id="filterAnswered"
              value={filterAnswered}
              onChange={(e) => onFilterAnsweredChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {answeredOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium mt-auto"
            >
              <FaTimes />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
