import React, { useEffect, useState, useCallback } from 'react';

const sentimentMeta = {
    positive: { label: 'Positive', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', icon: '😊' },
    neutral:  { label: 'Neutral',  color: 'bg-gray-100 text-gray-600 border-gray-200',    dot: 'bg-gray-400',  icon: '😐' },
    negative: { label: 'Negative', color: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500',   icon: '😞' },
};

const ScoreBar = ({ score }) => {
    // score: -1 to +1  →  map to 0-100%
    const pct = Math.round(((score + 1) / 2) * 100);
    const color = score >= 0.2 ? 'bg-green-500' : score <= -0.2 ? 'bg-red-500' : 'bg-yellow-400';
    return (
        <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 w-8 text-right">{score > 0 ? '+' : ''}{score}</span>
        </div>
    );
};

const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
            <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        ))}
    </div>
);

const AdminReviews = () => {
    const [reviews, setReviews]       = useState([]);
    const [stats, setStats]           = useState(null);
    const [loading, setLoading]       = useState(true);
    const [filterSentiment, setFilterSentiment] = useState('');
    const [filterFlagged, setFilterFlagged]     = useState(false);
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [total, setTotal]           = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [reanalyzing, setReanalyzing] = useState(false);
    const limit = 20;

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('adminUser'))?.token
                       || JSON.parse(localStorage.getItem('user'))?.token || '';
            const params = new URLSearchParams({ page, limit });
            if (filterSentiment) params.set('sentiment', filterSentiment);
            if (filterFlagged)   params.set('flagged', 'true');

            const res  = await fetch(`${process.env.REACT_APP_API_URL}/review/admin/all?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
                setStats(data.stats);
                setTotal(data.total);
            }
        } catch (e) {
            console.error('Failed to fetch reviews', e);
        } finally {
            setLoading(false);
        }
    }, [page, filterSentiment, filterFlagged]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleReanalyzeAll = async () => {
        setReanalyzing(true);
        try {
            const token = JSON.parse(localStorage.getItem('adminUser'))?.token
                       || JSON.parse(localStorage.getItem('user'))?.token || '';
            const res  = await fetch(`${process.env.REACT_APP_API_URL}/review/admin/reanalyze`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) { fetchReviews(); }
            else alert(data.message);
        } catch (e) {
            console.error('Reanalyze failed', e);
        } finally {
            setReanalyzing(false);
        }
    };

    const handleDismiss = async (reviewId) => {
        const token = JSON.parse(localStorage.getItem('adminUser'))?.token
                   || JSON.parse(localStorage.getItem('user'))?.token || '';
        await fetch(`${process.env.REACT_APP_API_URL}/review/admin/${reviewId}/dismiss`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        setStats(prev => prev ? { ...prev, flaggedCount: Math.max(0, prev.flaggedCount - 1) } : prev);
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Permanently delete this review?')) return;
        setDeletingId(reviewId);
        const token = JSON.parse(localStorage.getItem('adminUser'))?.token
                   || JSON.parse(localStorage.getItem('user'))?.token || '';
        await fetch(`${process.env.REACT_APP_API_URL}/review/admin/${reviewId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        setTotal(prev => prev - 1);
        setDeletingId(null);
    };

    const filtered = search
        ? reviews.filter(r =>
            r.userName?.toLowerCase().includes(search.toLowerCase()) ||
            r.comment?.toLowerCase().includes(search.toLowerCase()) ||
            r.product?.name?.toLowerCase().includes(search.toLowerCase())
          )
        : reviews;

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reviews & Sentiment</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Monitor all product reviews with AI sentiment analysis</p>
                </div>
                <div className="flex items-center gap-3">
                    {stats?.flaggedCount > 0 && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold animate-pulse">
                            🚨 {stats.flaggedCount} Flagged
                        </div>
                    )}
                    <button
                        onClick={handleReanalyzeAll}
                        disabled={reanalyzing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                        {reanalyzing ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span> Re-analyzing…</>
                        ) : (
                            <>🔄 Re-analyze All</>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Reviews', value: total, icon: '💬', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                        { label: 'Positive',       value: stats.positive, icon: '😊', color: 'bg-green-50 text-green-700 border-green-100' },
                        { label: 'Neutral',        value: stats.neutral,  icon: '😐', color: 'bg-gray-50 text-gray-600 border-gray-100' },
                        { label: 'Negative',       value: stats.negative, icon: '😞', color: 'bg-red-50 text-red-700 border-red-100' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl border p-4 flex items-center gap-4 ${s.color}`}>
                            <span className="text-3xl">{s.icon}</span>
                            <div>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs font-medium opacity-70">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search by reviewer, product, or keyword…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={filterSentiment}
                    onChange={e => { setFilterSentiment(e.target.value); setPage(1); }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Sentiments</option>
                    <option value="positive">😊 Positive</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="negative">😞 Negative</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={filterFlagged}
                        onChange={e => { setFilterFlagged(e.target.checked); setPage(1); }}
                        className="w-4 h-4 accent-red-500"
                    />
                    🚨 Flagged Only
                </label>
                {(filterSentiment || filterFlagged || search) && (
                    <button onClick={() => { setFilterSentiment(''); setFilterFlagged(false); setSearch(''); setPage(1); }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-5xl mb-3">💬</p>
                        <p className="font-medium">No reviews found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-3">Product</div>
                            <div className="col-span-2">Reviewer</div>
                            <div className="col-span-1">Rating</div>
                            <div className="col-span-3">Comment</div>
                            <div className="col-span-2">Sentiment</div>
                            <div className="col-span-1">Actions</div>
                        </div>

                        {filtered.map(review => {
                            const sm = sentimentMeta[review.sentiment] || sentimentMeta.neutral;
                            return (
                                <div
                                    key={review._id}
                                    className={`grid grid-cols-12 gap-4 px-5 py-4 items-start hover:bg-gray-50/50 transition-colors
                                        ${review.flagged ? 'border-l-4 border-red-400 bg-red-50/30' : ''}`}
                                >
                                    {/* Product */}
                                    <div className="col-span-3 flex items-center gap-3">
                                        {review.product?.imageUpload?.[0] ? (
                                            <img src={review.product.imageUpload[0]} alt="" className="w-10 h-10 rounded-lg object-contain bg-gray-100 flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-lg">📦</div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{review.product?.name || 'Unknown Product'}</p>
                                            <p className="text-xs text-gray-400 truncate">{review.product?.category}</p>
                                        </div>
                                    </div>

                                    {/* Reviewer */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {review.userName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 truncate">{review.userName}</p>
                                                {review.verified && (
                                                    <span className="text-[10px] text-green-600 font-medium">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 pl-9">
                                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div className="col-span-1">
                                        <StarDisplay rating={review.rating} />
                                        <span className="text-xs text-gray-500 mt-0.5 block">{review.rating}/5</span>
                                    </div>

                                    {/* Comment */}
                                    <div className="col-span-3">
                                        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{review.comment}</p>
                                        {review.flagged && (
                                            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                                                🚨 Flagged for Review
                                            </span>
                                        )}
                                    </div>

                                    {/* Sentiment */}
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sm.color}`}>
                                            <span className={`w-2 h-2 rounded-full ${sm.dot}`}></span>
                                            {sm.icon} {sm.label}
                                        </span>
                                        <ScoreBar score={review.sentimentScore ?? 0} />
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex flex-col gap-1.5">
                                        {review.flagged && (
                                            <button
                                                onClick={() => handleDismiss(review._id)}
                                                className="text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors whitespace-nowrap"
                                            >
                                                ✓ Dismiss
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            disabled={deletingId === review._id}
                                            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {deletingId === review._id ? '…' : '🗑 Delete'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                ← Prev
                            </button>
                            <span className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-semibold">{page}</span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
