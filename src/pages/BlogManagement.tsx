import { useState, useEffect } from "react";
import {
  useGetAllBlogsQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  Blog,
  BlogCategory,
} from "../store/api/blogApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Input Component ──────────────────────────────────────────────────────────

function Field({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400 font-medium">{label}</label>
      <input
        {...props}
        className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function TextAreaField({ label, error, ...props }: { label: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400 font-medium">{label}</label>
      <textarea
        {...props}
        rows={3}
        className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 resize-none`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function SelectField({ label, error, children, ...props }: { label: string; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400 font-medium">{label}</label>
      <select
        {...props}
        className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors`}
      >
        {children}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Add Category Modal ───────────────────────────────────────────────────────

function AddCategoryModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) e.slug = "Lowercase letters, numbers, hyphens only";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createCategory({ name: name.trim(), slug: slug.trim() }).unwrap();
      onClose();
    } catch (err: any) {
      setErrors({ submit: err?.data?.message ?? "Failed to create category" });
    }
  };

  return (
    <Modal title="Add Category" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field
          label="Category Name"
          placeholder="e.g. Travel Tips"
          value={name}
          error={errors.name}
          onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }}
        />
        <Field
          label="Slug"
          placeholder="e.g. travel-tips"
          value={slug}
          error={errors.slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        {errors.submit && <p className="text-red-400 text-sm">{errors.submit}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {isLoading ? "Creating…" : "Create Category"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── List Categories Modal ────────────────────────────────────────────────────

function ListCategoriesModal({ onClose }: { onClose: () => void }) {
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    try { await deleteCategory(id).unwrap(); }
    catch (err: any) { alert(err?.data?.message ?? "Failed to delete"); }
    finally { setDeletingId(null); }
  };

  return (
    <Modal title={`Categories (${categories.length})`} onClose={onClose}>
      {isLoading ? (
        <p className="text-gray-400 text-sm text-center py-6">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No categories yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{cat.name}</p>
                <p className="text-gray-500 text-xs">{cat.slug} · {cat._count?.blogs ?? 0} blogs</p>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id || (cat._count?.blogs ?? 0) > 0}
                className="text-red-400 hover:text-red-300 disabled:opacity-30 text-xs transition-colors"
              >
                {deletingId === cat.id ? "…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="pt-4">
        <button onClick={onClose} className="w-full py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">Close</button>
      </div>
    </Modal>
  );
}

// ─── Add / Edit Blog Modal ────────────────────────────────────────────────────

function BlogFormModal({ blog, onClose }: { blog?: Blog; onClose: () => void }) {
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }]  = useUpdateBlogMutation();
  const isLoading = creating || updating;

  const [form, setForm] = useState({
    title:       blog?.title       ?? "",
    description: blog?.description ?? "",
    image:       blog?.image       ?? "",
    authorName:  blog?.authorName  ?? "",
    authorImage: blog?.authorImage ?? "",
    categoryId:  blog?.categoryId  ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.image.trim())       e.image       = "Image URL is required";
    if (!form.authorName.trim())  e.authorName  = "Author name is required";
    if (!form.authorImage.trim()) e.authorImage = "Author image URL is required";
    if (!form.categoryId)         e.categoryId  = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (blog) {
        await updateBlog({ id: blog.id, body: form }).unwrap();
      } else {
        await createBlog(form).unwrap();
      }
      onClose();
    } catch (err: any) {
      setErrors({ submit: err?.data?.message ?? "Failed to save blog" });
    }
  };

  return (
    <Modal title={blog ? "Edit Blog" : "Add Blog"} onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
        <Field label="Title" placeholder="Blog title" value={form.title} error={errors.title} onChange={set("title")} />
        <TextAreaField label="Description" placeholder="Blog description" value={form.description} error={errors.description} onChange={set("description")} />
        <Field label="Cover Image URL" placeholder="https://…" value={form.image} error={errors.image} onChange={set("image")} />
        <Field label="Author Name" placeholder="e.g. Marcus Cole" value={form.authorName} error={errors.authorName} onChange={set("authorName")} />
        <Field label="Author Image URL" placeholder="https://…" value={form.authorImage} error={errors.authorImage} onChange={set("authorImage")} />
        <SelectField label="Category" value={form.categoryId} error={errors.categoryId} onChange={set("categoryId")}>
          <option value="">Select category…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </SelectField>
        {errors.submit && <p className="text-red-400 text-sm">{errors.submit}</p>}
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">Cancel</button>
        <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
          {isLoading ? "Saving…" : blog ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Blog Row ─────────────────────────────────────────────────────────────────

function BlogRow({ blog, onEdit }: { blog: Blog; onEdit: (b: Blog) => void }) {
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

  const handleDelete = async () => {
    if (!confirm(`Delete "${blog.title}"?`)) return;
    try { await deleteBlog(blog.id).unwrap(); }
    catch (err: any) { alert(err?.data?.message ?? "Failed to delete"); }
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-3">
        <img src={blog.image} alt={blog.title} className="w-14 h-10 object-cover rounded-md bg-gray-700" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x40/1f2937/6b7280?text=IMG"; }} />
      </td>
      <td className="px-4 py-3">
        <p className="text-white text-sm font-medium line-clamp-1">{blog.title}</p>
        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{blog.description}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-xs border border-blue-800/50">
          {blog.category?.name ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <img src={blog.authorImage} alt={blog.authorName} className="w-6 h-6 rounded-full object-cover bg-gray-700" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/24x24/1f2937/6b7280?text=A"; }} />
          <span className="text-gray-300 text-xs">{blog.authorName}</span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-gray-400 text-xs">{formatDate(blog.date)}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(blog)} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors">Edit</button>
          <button onClick={handleDelete} disabled={isLoading} className="px-3 py-1 text-xs bg-red-900/40 hover:bg-red-900/70 text-red-300 rounded-md transition-colors disabled:opacity-50">
            {isLoading ? "…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Modal = "addCategory" | "listCategories" | "addBlog" | "editBlog" | null;

export default function BlogManagement() {
  const [modal, setModal]       = useState<Modal>(null);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching } = useGetAllBlogsQuery({
    page,
    limit: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const blogs      = data?.data ?? [];
  const meta       = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const openEdit = (blog: Blog) => { setEditBlog(blog); setModal("editBlog"); };
  const closeModal = () => { setModal(null); setEditBlog(null); };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blog posts and categories</p>
        </div>

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setModal("addCategory")}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Category
          </button>

          <button
            onClick={() => setModal("listCategories")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            List Categories
          </button>

          <button
            onClick={() => setModal("addBlog")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Blog
          </button>
        </div>

        {/* ── Blog Table ───────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-800">
            <div>
              <h2 className="text-white font-semibold">All Blogs</h2>
              {meta && <p className="text-gray-500 text-xs mt-0.5">{meta.total} total posts</p>}
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                placeholder="Search blogs…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 w-56"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-gray-500 text-sm">
                      {debouncedSearch ? `No blogs found for "${debouncedSearch}"` : "No blogs yet. Click Add Blog to create one."}
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <BlogRow key={blog.id} blog={blog} onEdit={openEdit} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs">
                Page {page} of {totalPages}
              </p>
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
      {modal === "addCategory"    && <AddCategoryModal    onClose={closeModal} />}
      {modal === "listCategories" && <ListCategoriesModal onClose={closeModal} />}
      {modal === "addBlog"        && <BlogFormModal       onClose={closeModal} />}
      {modal === "editBlog" && editBlog && <BlogFormModal blog={editBlog} onClose={closeModal} />}
    </div>
  );
}