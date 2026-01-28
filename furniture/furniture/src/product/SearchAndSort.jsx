import React from "react";
import "./SearchAndSort.css"; 

const SearchAndSort = ({ sortOption, setSortOption }) => {
  return (
    <div className="search-sort-container">


      <div className="sort">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndSort;
