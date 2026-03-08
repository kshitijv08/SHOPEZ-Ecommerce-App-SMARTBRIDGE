import { FiSliders } from 'react-icons/fi';

const FilterSidebar = ({ filters, setFilters }) => {
    const handleSort = (value) => setFilters((p) => ({ ...p, sort: value }));

    const handleCategory = (cat) => {
        setFilters((p) => {
            const cats = p.category.includes(cat)
                ? p.category.filter((c) => c !== cat)
                : [...p.category, cat];
            return { ...p, category: cats };
        });
    };

    const handleGender = (g) => {
        setFilters((p) => {
            const genders = p.gender.includes(g)
                ? p.gender.filter((x) => x !== g)
                : [...p.gender, g];
            return { ...p, gender: genders };
        });
    };

    const clearAll = () =>
        setFilters({ sort: 'popular', category: [], gender: [], priceRange: 200000, search: '' });

    return (
        <aside className="filter-sidebar">
            <h3><FiSliders /> Filters</h3>

            <div className="filter-section">
                <h4>Sort By</h4>
                {['popular', 'price_low', 'price_high', 'discount'].map((s) => (
                    <label key={s}>
                        <input type="radio" name="sort" checked={filters.sort === s} onChange={() => handleSort(s)} />
                        {{ popular: 'Popular', price_low: 'Price (Low to High)', price_high: 'Price (High to Low)', discount: 'Discount' }[s]}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <h4>Categories</h4>
                {['mobiles', 'electronics', 'sports-equipment', 'fashion', 'groceries'].map((c) => (
                    <label key={c}>
                        <input type="checkbox" checked={filters.category.includes(c)} onChange={() => handleCategory(c)} />
                        {c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <h4>Gender</h4>
                {['men', 'women', 'unisex'].map((g) => (
                    <label key={g}>
                        <input type="checkbox" checked={filters.gender.includes(g)} onChange={() => handleGender(g)} />
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <h4>Price Range</h4>
                <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={filters.priceRange}
                    onChange={(e) => setFilters((p) => ({ ...p, priceRange: Number(e.target.value) }))}
                />
                <div className="price-range-display">Up to ₹{filters.priceRange.toLocaleString('en-IN')}</div>
            </div>

            <button className="filter-clear" onClick={clearAll}>Clear All Filters</button>
        </aside>
    );
};
export default FilterSidebar;
