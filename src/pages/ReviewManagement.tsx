import { useState } from "react";
import {
  useAdminGetAllReviewsQuery,
  useAdminUpdateReviewStatusMutation,
  useAdminDeleteReviewMutation,
  Review,
  ReviewStatus,
} from "../store/api/reviewApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-gray-700"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: ReviewStatus }) => {
  const styles: Record<ReviewStatus, string> = {
    PENDING:  "bg-amber-900/30 text-amber-300 border-amber-800/50",
    APPROVED: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
    REJECTED: "bg-red-900/30 text-red-300 border-red-800/50",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ review, onClose }: { review: Review; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [error, setError]   = useState("");
  const [updateStatus, { isLoading }] = useAdminUpdateReviewStatusMutation();

  const handleReject = async () => {
    if (!reason.trim()) { setError("Rejection reason is required"); return; }
    try {
      await updateStatus({ id: review.id, body: { status: "REJECTED", rejectedReason: reason.trim() } }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message ?? "Failed to reject review");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Reject Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-white text-sm font-medium">{review.title}</p>
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{review.body}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400 font-medium">Reason for rejection <span className="text-red-400">*</span></label>
            <textarea
              rows={3}
              placeholder="Explain why this review is being rejected…"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(""); }}
              className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-500 resize-none`}
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={handleReject} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {isLoading ? "Rejecting…" : "Reject Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

function ViewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Review Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-white font-semibold text-base">{review.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <StarRating rating={review.rating} />
                <span className="text-gray-500 text-xs">{review.rating}/5</span>
              </div>
            </div>
            <StatusBadge status={review.status} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{review.body}</p>
          {review.rejectedReason && (
            <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-medium mb-1">Rejection Reason</p>
              <p className="text-red-300 text-sm">{review.rejectedReason}</p>
            </div>
          )}
          <div className="border-t border-gray-800 pt-3 flex items-center justify-between text-xs text-gray-500">
            <span>By <span className="text-gray-300">{review.user.name}</span></span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className="px-6 pb-5">
          <button onClick={onClose} className="w-full py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Row ───────────────────────────────────────────────────────────────

function ReviewRow({
  review,
  onView,
  onReject,
}: {
  review:   Review;
  onView:   (r: Review) => void;
  onReject: (r: Review) => void;
}) {
  const [approve, { isLoading: approving }] = useAdminUpdateReviewStatusMutation();
  const [remove,  { isLoading: deleting  }] = useAdminDeleteReviewMutation();

  const handleApprove = async () => {
    try { await approve({ id: review.id, body: { status: "APPROVED" } }).unwrap(); }
    catch (err: any) { alert(err?.data?.message ?? "Failed to approve"); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete this review by "${review.user.name}"?`)) return;
    try { await remove(review.id).unwrap(); }
    catch (err: any) { alert(err?.data?.message ?? "Failed to delete"); }
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
      {/* User */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{review.user.name}</p>
            {review.user.email && <p className="text-gray-500 text-xs">{review.user.email}</p>}
          </div>
        </div>
      </td>

      {/* Title + body */}
      <td className="px-4 py-3 max-w-xs">
        <p className="text-white text-sm font-medium line-clamp-1">{review.title}</p>
        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{review.body}</p>
      </td>

      {/* Rating */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="flex flex-col gap-1">
          <StarRating rating={review.rating} />
          <span className="text-gray-500 text-xs">{review.rating}/5</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={review.status} />
      </td>

      {/* Date */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onView(review)}
            className="px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
          >
            View
          </button>
          {review.status === "PENDING" && (
            <>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="px-2.5 py-1 text-xs bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 rounded-md transition-colors disabled:opacity-50"
              >
                {approving ? "…" : "Approve"}
              </button>
              <button
                onClick={() => onReject(review)}
                className="px-2.5 py-1 text-xs bg-amber-900/40 hover:bg-amber-900/70 text-amber-300 rounded-md transition-colors"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-2.5 py-1 text-xs bg-red-900/30 hover:bg-red-900/60 text-red-300 rounded-md transition-colors disabled:opacity-50"
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ActiveModal = { type: "view" | "reject"; review: Review } | null;

export default function ReviewManagement() {
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | "PENDING" | "APPROVED" | "REJECTED">("");
  const [ratingFilter, setRatingFilter] = useState<"" | "1" | "2" | "3" | "4" | "5">("");
  const [activeModal, setActiveModal]   = useState<ActiveModal>(null);

  const { data, isLoading, isFetching } = useAdminGetAllReviewsQuery({
    page,
    limit: 10,
    ...(statusFilter && { status: statusFilter as ReviewStatus }),
    ...(ratingFilter && { rating: Number(ratingFilter) }),
  });

  const reviews    = data?.data ?? [];
  const meta       = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Derive counts from current page — good enough for a summary
  const pendingCount  = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = reviews.filter((r) => r.status === "REJECTED").length;

  const resetFilters = () => { setStatusFilter(""); setRatingFilter(""); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Review Management</h1>
          <p className="text-gray-500 text-sm mt-1">Moderate user reviews — approve or reject before publishing</p>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total"    value={meta?.total    ?? 0} color="text-white" />
          <StatCard label="Pending"  value={pendingCount}        color="text-amber-400" />
          <StatCard label="Approved" value={approvedCount}       color="text-emerald-400" />
          <StatCard label="Rejected" value={rejectedCount}       color="text-red-400" />
        </div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-800">
            <div>
              <h2 className="text-white font-semibold">All Reviews</h2>
              {meta && <p className="text-gray-500 text-xs mt-0.5">{meta.total} total reviews</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              {/* Rating filter */}
              <select
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value as any); setPage(1); }}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">All Ratings</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{"★".repeat(r)} {r} star{r > 1 ? "s" : ""}</option>
                ))}
              </select>

              {/* Clear filters */}
              {(statusFilter || ratingFilter) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-white px-2 py-2 transition-colors"
                >
                  Clear ✕
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <p className="text-gray-500 text-sm">No reviews found</p>
                      {(statusFilter || ratingFilter) && (
                        <button onClick={resetFilters} className="text-blue-400 text-xs mt-2 hover:underline">
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <ReviewRow
                      key={review.id}
                      review={review}
                      onView={(r)   => setActiveModal({ type: "view",   review: r })}
                      onReject={(r) => setActiveModal({ type: "reject", review: r })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-md transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-md transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {activeModal?.type === "view"   && <ViewModal   review={activeModal.review} onClose={() => setActiveModal(null)} />}
      {activeModal?.type === "reject" && <RejectModal review={activeModal.review} onClose={() => setActiveModal(null)} />}
    </div>
  );
}