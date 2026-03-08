import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Loader from '../components/Loader';
import { FiSearch } from 'react-icons/fi';

const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        sort: 'popular',
        category: searchParams.get('category') ? [searchParams.get('category')] : [],
        gender: [],
        priceRange: 200000,
        search: searchParams.get('search') || '',
    });

    useEffect(() => {
        const cat = searchParams.get('category');
        const search = searchParams.get('search');
        if (cat) setFilters((p) => ({ ...p, category: [cat] }));
        if (search) setFilters((p) => ({ ...p, search }));
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.search) params.set('search', filters.search);
                if (filters.category.length) params.set('category', filters.category.join(','));
                if (filters.gender.length) params.set('gender', filters.gender.join(','));
                if (filters.sort) params.set('sort', filters.sort);
                const { data } = await API.get(`/products?${params.toString()}`);
                const filtered = data.filter((p) => {
                    const discountedPrice = p.price - (p.price * p.discount) / 100;
                    return discountedPrice <= filters.priceRange;
                });
                setProducts(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters]);

    return (
        <div className="products-page">
            <FilterSidebar filters={filters} setFilters={setFilters} />
            <div className="products-grid-wrap">
                <div className="products-grid-header">
                    <h2>
                        {filters.search ? `Results for "${filters.search}"` : 'All Products'}
                        <span className="count-badge">{products.length} items</span>
                    </h2>
                </div>
                {loading ? (
                    <Loader />
                ) : products.length === 0 ? (
                    <div className="no-results">
                        <FiSearch size={48} />
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Products;
