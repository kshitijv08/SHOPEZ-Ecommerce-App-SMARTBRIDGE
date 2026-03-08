import { useState, useEffect } from 'react';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiDollarSign, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import API from '../services/api';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

const tabs = [
    { key: 'overview', label: 'Overview', icon: <FiGrid /> },
    { key: 'products', label: 'Products', icon: <FiPackage /> },
    { key: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { key: 'users', label: 'Users', icon: <FiUsers /> },
    { key: 'settings', label: 'Settings', icon: <FiSettings /> },
];

const emptyProduct = { title: '', description: '', mainImg: '', carousel: [], sizes: [], category: 'mobiles', gender: '', price: '', discount: '', stock: 100 };

const AdminDashboard = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({});
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editProduct, setEditProduct] = useState(emptyProduct);
    const [editId, setEditId] = useState(null);
    const [banner, setBanner] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                if (activeTab === 'overview') {
                    const [s, o] = await Promise.all([API.get('/admin/stats'), API.get('/admin/orders')]);
                    setStats(s.data); setOrders(o.data.slice(0, 10));
                } else if (activeTab === 'products') {
                    const { data } = await API.get('/products'); setProducts(data);
                } else if (activeTab === 'orders') {
                    const { data } = await API.get('/admin/orders'); setOrders(data);
                } else if (activeTab === 'users') {
                    const { data } = await API.get('/admin/users'); setUsers(data);
                } else if (activeTab === 'settings') {
                    const { data } = await API.get('/admin/banner'); setBanner(data.banner || '');
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, [activeTab]);

    const handleStatusChange = async (id, status) => {
        try {
            await API.put(`/admin/orders/${id}`, { orderStatus: status }); addToast('Status updated', 'success');
            setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
        } catch { addToast('Update failed', 'error'); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await API.delete(`/admin/users/${id}`); setUsers(prev => prev.filter(u => u._id !== id)); addToast('User deleted', 'success');
        } catch { addToast('Delete failed', 'error'); }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...editProduct, price: Number(editProduct.price), discount: Number(editProduct.discount), stock: Number(editProduct.stock),
            sizes: typeof editProduct.sizes === 'string' ? editProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) : editProduct.sizes,
            carousel: typeof editProduct.carousel === 'string' ? editProduct.carousel.split(',').map(s => s.trim()).filter(Boolean) : editProduct.carousel,
        };
        try {
            if (editId) { await API.put(`/products/${editId}`, payload); addToast('Product updated', 'success'); }
            else { await API.post('/products', payload); addToast('Product added', 'success'); }
            setModal(false); setEditProduct(emptyProduct); setEditId(null);
            const { data } = await API.get('/products'); setProducts(data);
        } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
    };

    const openEdit = (p) => {
        setEditProduct({ ...p, sizes: p.sizes?.join(', ') || '', carousel: p.carousel?.join(', ') || '' });
        setEditId(p._id); setModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Deactivate this product?')) return;
        try {
            await API.delete(`/products/${id}`); setProducts(prev => prev.filter(p => p._id !== id)); addToast('Product deactivated', 'success');
        } catch { addToast('Failed', 'error'); }
    };

    const saveBanner = async () => {
        try { await API.post('/admin/banner', { banner }); addToast('Banner updated', 'success'); }
        catch { addToast('Failed', 'error'); }
    };

    const statusOpts = ['order placed', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled'];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">Shop<span>EZ</span> Admin</div>
                {tabs.map(t => (
                    <div key={t.key} className={`admin-nav-item ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                        {t.icon} <span>{t.label}</span>
                    </div>
                ))}
            </aside>

            <div className="admin-content">
                {loading ? <Loader /> : (
                    <>
                        {/* OVERVIEW */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="stat-cards">
                                    {[{ icon: <FiUsers />, val: stats.totalUsers, label: 'Total Users' }, { icon: <FiPackage />, val: stats.totalProducts, label: 'Total Products' }, { icon: <FiShoppingBag />, val: stats.totalOrders, label: 'Total Orders' }, { icon: <FiDollarSign />, val: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, label: 'Total Revenue' }]
                                        .map((s, i) => (
                                            <div className="stat-card" key={i}><div className="stat-card-icon">{s.icon}</div><div className="stat-card-info"><h3>{s.val}</h3><p>{s.label}</p></div></div>
                                        ))}
                                </div>
                                <div className="admin-table-wrap">
                                    <div className="admin-table-header"><h3>Recent Orders</h3></div>
                                    <table><thead><tr><th>Order ID</th><th>Product</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                                        <tbody>{orders.map(o => (
                                            <tr key={o._id}><td style={{ fontSize: 11 }}>{o._id.slice(-8)}</td><td>{o.title}</td><td>{o.name}</td><td>₹{Math.round(o.price - (o.price * o.discount / 100)).toLocaleString('en-IN')}</td>
                                                <td><span className={`status-badge ${o.orderStatus.replace(/\s+/g, '-')}`}>{o.orderStatus}</span></td></tr>
                                        ))}</tbody></table>
                                </div>
                            </>
                        )}

                        {/* PRODUCTS */}
                        {activeTab === 'products' && (
                            <div className="admin-table-wrap">
                                <div className="admin-table-header"><h3>Products</h3><button className="btn-primary" onClick={() => { setEditProduct(emptyProduct); setEditId(null); setModal(true); }}><FiPlus /> Add Product</button></div>
                                <table><thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Actions</th></tr></thead>
                                    <tbody>{products.map(p => (
                                        <tr key={p._id}><td><img src={p.mainImg} alt="" /></td><td>{p.title}</td><td>{p.category}</td><td>₹{p.price.toLocaleString('en-IN')}</td><td>{p.discount}%</td><td>{p.stock}</td>
                                            <td><button className="btn-primary" style={{ marginRight: 6 }} onClick={() => openEdit(p)}><FiEdit /></button><button className="btn-danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button></td></tr>
                                    ))}</tbody></table>
                            </div>
                        )}

                        {/* ORDERS */}
                        {activeTab === 'orders' && (
                            <div className="admin-table-wrap">
                                <div className="admin-table-header"><h3>All Orders</h3></div>
                                <table><thead><tr><th>ID</th><th>Image</th><th>Product</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
                                    <tbody>{orders.map(o => (
                                        <tr key={o._id}><td style={{ fontSize: 11 }}>{o._id.slice(-8)}</td><td><img src={o.mainImg} alt="" /></td><td>{o.title}</td><td>{o.name}</td>
                                            <td>₹{Math.round(o.price - (o.price * o.discount / 100)).toLocaleString('en-IN')}</td><td>{o.paymentMethod}</td>
                                            <td><select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}>{statusOpts.map(s => <option key={s} value={s}>{s}</option>)}</select></td></tr>
                                    ))}</tbody></table>
                            </div>
                        )}

                        {/* USERS */}
                        {activeTab === 'users' && (
                            <div className="admin-table-wrap">
                                <div className="admin-table-header"><h3>Users</h3></div>
                                <table><thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Joined</th><th>Actions</th></tr></thead>
                                    <tbody>{users.map(u => (
                                        <tr key={u._id}><td>{u.username}</td><td>{u.email}</td><td>{u.usertype}</td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>{u.usertype !== 'admin' && <button className="btn-danger" onClick={() => handleDeleteUser(u._id)}><FiTrash2 /> Delete</button>}</td></tr>
                                    ))}</tbody></table>
                            </div>
                        )}

                        {/* SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="admin-table-wrap" style={{ padding: 24 }}>
                                <h3 style={{ marginBottom: 16 }}>Banner Settings</h3>
                                <div className="form-group"><label>Banner Image URL</label><input value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="Unsplash URL" /></div>
                                {banner && <img src={banner} alt="Preview" style={{ maxHeight: 160, marginTop: 12, borderRadius: 4 }} />}
                                <button className="btn-primary" onClick={saveBanner} style={{ marginTop: 16 }}>Save Banner</button>
                            </div>
                        )}
                    </>
                )}

                {/* MODAL */}
                {modal && (
                    <div className="modal-overlay" onClick={() => setModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleProductSubmit}>
                                {[{ n: 'title', l: 'Title' }, { n: 'description', l: 'Description' }, { n: 'mainImg', l: 'Main Image URL' }, { n: 'carousel', l: 'Carousel URLs (comma-separated)' }, { n: 'sizes', l: 'Sizes (comma-separated)' }]
                                    .map(f => (<div className="form-group" key={f.n}><label>{f.l}</label><input value={editProduct[f.n]} onChange={e => setEditProduct({ ...editProduct, [f.n]: e.target.value })} required={f.n === 'title' || f.n === 'description' || f.n === 'mainImg'} /></div>))}
                                <div className="form-row">
                                    <div className="form-group"><label>Category</label><select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}>
                                        {['mobiles', 'electronics', 'sports-equipment', 'fashion', 'groceries'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                    <div className="form-group"><label>Gender</label><select value={editProduct.gender} onChange={e => setEditProduct({ ...editProduct, gender: e.target.value })}>
                                        <option value="">None</option>{['men', 'women', 'unisex'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label>Price (₹)</label><input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} required /></div>
                                    <div className="form-group"><label>Discount (%)</label><input type="number" value={editProduct.discount} onChange={e => setEditProduct({ ...editProduct, discount: e.target.value })} required /></div>
                                    <div className="form-group"><label>Stock</label><input type="number" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })} /></div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-danger" onClick={() => setModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'} Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminDashboard;
