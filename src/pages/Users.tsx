// import { useState } from "react";
// import {
//   useListUsersQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useSetUserStatusMutation,
//   useDeleteUserMutation,
//   type User,
//   type CreateUserRequest,
//   type UpdateUserRequest,
// } from "../store/api/userApi";

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const SearchIcon = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//     <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//   </svg>
// );
// const PlusIcon = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path d="M12 5v14M5 12h14" />
//   </svg>
// );
// const EditIcon = () => (
//   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//   </svg>
// );
// const TrashIcon = () => (
//   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//     <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//     <path d="M10 11v6M14 11v6M9 6V4h6v2" />
//   </svg>
// );
// const ChevronLeft = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path d="M15 18l-6-6 6-6" />
//   </svg>
// );
// const ChevronRight = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path d="M9 18l6-6-6-6" />
//   </svg>
// );
// const XIcon = () => (
//   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path d="M18 6 6 18M6 6l12 12" />
//   </svg>
// );

// // ─── Avatar ───────────────────────────────────────────────────────────────────

// const AVATAR_COLORS = [
//   { bg: "#EDE9FE", text: "#5B21B6" },
//   { bg: "#D1FAE5", text: "#065F46" },
//   { bg: "#FEE2E2", text: "#991B1B" },
//   { bg: "#DBEAFE", text: "#1E40AF" },
//   { bg: "#FEF3C7", text: "#92400E" },
//   { bg: "#FCE7F3", text: "#9D174D" },
// ];

// function Avatar({ name, size = 36 }: { name: string; size?: number }) {
//   const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
//   const { bg, text } = AVATAR_COLORS[idx];
//   const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
//   return (
//     <div style={{
//       width: size, height: size, borderRadius: "50%",
//       background: bg, color: text,
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       {initials}
//     </div>
//   );
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// interface ModalProps {
//   title: string;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// function Modal({ title, onClose, children }: ModalProps) {
//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 50,
//       background: "rgba(0,0,0,0.45)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       padding: "1rem",
//     }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div style={{
//         background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480,
//         boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
//         fontFamily: "'DM Sans', sans-serif",
//       }}>
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "20px 24px 16px", borderBottom: "1px solid #F1F5F9",
//         }}>
//           <h2 style={{ fontSize: 17, fontWeight: 600, color: "#0F172A", margin: 0 }}>{title}</h2>
//           <button onClick={onClose} style={{
//             background: "none", border: "none", cursor: "pointer",
//             color: "#94A3B8", padding: 4, borderRadius: 8, display: "flex",
//             alignItems: "center",
//           }}>
//             <XIcon />
//           </button>
//         </div>
//         <div style={{ padding: "20px 24px 24px" }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// // ─── Form Field ───────────────────────────────────────────────────────────────

// function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
//   return (
//     <div style={{ marginBottom: 16 }}>
//       <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 6 }}>
//         {label}
//       </label>
//       {children}
//       {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{error}</p>}
//     </div>
//   );
// }

// const inputStyle: React.CSSProperties = {
//   width: "100%", height: 40, padding: "0 12px",
//   border: "1.5px solid #E2E8F0", borderRadius: 10,
//   fontSize: 14, color: "#0F172A", outline: "none",
//   fontFamily: "'DM Sans', sans-serif",
//   boxSizing: "border-box",
//   background: "#F8FAFC",
// };

// // ─── Add / Edit Modal ─────────────────────────────────────────────────────────

// interface UserFormModalProps {
//   editUser?: User | null;
//   onClose: () => void;
// }

// function UserFormModal({ editUser, onClose }: UserFormModalProps) {
//   const isEdit = !!editUser;
//   const [createUser, { isLoading: creating }] = useCreateUserMutation();
//   const [updateUser, { isLoading: updating }]  = useUpdateUserMutation();

//   const [form, setForm] = useState({
//     name:     editUser?.name  ?? "",
//     email:    editUser?.email ?? "",
//     phone:    editUser?.phone ?? "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [apiError, setApiError] = useState("");

//   function validate() {
//     const e: Record<string, string> = {};
//     if (!form.name.trim())  e.name  = "Name is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
//     if (!form.phone.trim()) e.phone = "Phone is required";
//     if (!isEdit && !form.password) e.password = "Password is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   }

//   async function handleSubmit() {
//     if (!validate()) return;
//     setApiError("");
//     try {
//       if (isEdit) {
//         const body: UpdateUserRequest & { userId: string } = {
//           userId: editUser!.id,
//           name:   form.name,
//           email:  form.email,
//           phone:  form.phone,
//         };
//         await updateUser(body).unwrap();
//       } else {
//         const body: CreateUserRequest = {
//           name:     form.name,
//           email:    form.email,
//           phone:    form.phone,
//           password: form.password,
//         };
//         await createUser(body).unwrap();
//       }
//       onClose();
//     } catch {
//       setApiError("Something went wrong. Please try again.");
//     }
//   }

//   const isLoading = creating || updating;

//   return (
//     <Modal title={isEdit ? "Edit user" : "Add new user"} onClose={onClose}>
//       {apiError && (
//         <div style={{
//           background: "#FEF2F2", border: "1px solid #FECACA",
//           borderRadius: 8, padding: "10px 14px", fontSize: 13,
//           color: "#B91C1C", marginBottom: 16,
//         }}>{apiError}</div>
//       )}

//       <Field label="Full name" error={errors.name}>
//         <input
//           style={{ ...inputStyle, borderColor: errors.name ? "#EF4444" : "#E2E8F0" }}
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           placeholder="John Doe"
//         />
//       </Field>
//       <Field label="Email address" error={errors.email}>
//         <input
//           style={{ ...inputStyle, borderColor: errors.email ? "#EF4444" : "#E2E8F0" }}
//           type="email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           placeholder="john@example.com"
//         />
//       </Field>
//       <Field label="Phone number" error={errors.phone}>
//         <input
//           style={{ ...inputStyle, borderColor: errors.phone ? "#EF4444" : "#E2E8F0" }}
//           value={form.phone}
//           onChange={(e) => setForm({ ...form, phone: e.target.value })}
//           placeholder="+91 98765 43210"
//         />
//       </Field>
//       {!isEdit && (
//         <Field label="Password" error={errors.password}>
//           <input
//             style={{ ...inputStyle, borderColor: errors.password ? "#EF4444" : "#E2E8F0" }}
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             placeholder="Min. 6 characters"
//           />
//         </Field>
//       )}

//       <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
//         <button onClick={onClose} style={{
//           flex: 1, height: 40, border: "1.5px solid #E2E8F0", borderRadius: 10,
//           background: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
//           color: "#64748B", fontFamily: "'DM Sans', sans-serif",
//         }}>
//           Cancel
//         </button>
//         <button onClick={handleSubmit} disabled={isLoading} style={{
//           flex: 2, height: 40, border: "none", borderRadius: 10,
//           background: isLoading ? "#93C5FD" : "#2563EB", cursor: isLoading ? "not-allowed" : "pointer",
//           fontSize: 14, fontWeight: 600, color: "#fff",
//           fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
//         }}>
//           {isLoading ? "Saving…" : isEdit ? "Save changes" : "Add user"}
//         </button>
//       </div>
//     </Modal>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────

// function DeleteModal({ user, onClose }: { user: User; onClose: () => void }) {
//   const [deleteUser, { isLoading }] = useDeleteUserMutation();
//   const [apiError, setApiError]     = useState("");

//   async function handleDelete() {
//     setApiError("");
//     try {
//       await deleteUser(user.id).unwrap();
//       onClose();
//     } catch {
//       setApiError("Failed to delete user.");
//     }
//   }

//   return (
//     <Modal title="Delete user" onClose={onClose}>
//       <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
//         <div style={{
//           width: 44, height: 44, borderRadius: 12, background: "#FEF2F2",
//           display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//         }}>
//           <TrashIcon />
//         </div>
//         <div>
//           <p style={{ margin: 0, fontSize: 14, color: "#0F172A", fontWeight: 500 }}>
//             Delete <strong>{user.name}</strong>?
//           </p>
//           <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>
//             This action cannot be undone. The user and all associated data will be permanently removed.
//           </p>
//         </div>
//       </div>
//       {apiError && (
//         <p style={{ fontSize: 13, color: "#EF4444", marginBottom: 12 }}>{apiError}</p>
//       )}
//       <div style={{ display: "flex", gap: 10 }}>
//         <button onClick={onClose} style={{
//           flex: 1, height: 40, border: "1.5px solid #E2E8F0", borderRadius: 10,
//           background: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
//           color: "#64748B", fontFamily: "'DM Sans', sans-serif",
//         }}>
//           Cancel
//         </button>
//         <button onClick={handleDelete} disabled={isLoading} style={{
//           flex: 2, height: 40, border: "none", borderRadius: 10,
//           background: isLoading ? "#FCA5A5" : "#EF4444",
//           cursor: isLoading ? "not-allowed" : "pointer",
//           fontSize: 14, fontWeight: 600, color: "#fff",
//           fontFamily: "'DM Sans', sans-serif",
//         }}>
//           {isLoading ? "Deleting…" : "Yes, delete user"}
//         </button>
//       </div>
//     </Modal>
//   );
// }

// // ─── Status Toggle ────────────────────────────────────────────────────────────

// function StatusToggle({ user }: { user: User }) {
//   const [setStatus, { isLoading }] = useSetUserStatusMutation();

//   async function toggle() {
//     await setStatus({ userId: user.id, isActive: !user.isActive });
//   }

//   return (
//     <button
//       onClick={toggle}
//       disabled={isLoading}
//       title={user.isActive ? "Deactivate user" : "Activate user"}
//       style={{
//         position: "relative", width: 40, height: 22, borderRadius: 11,
//         border: "none", cursor: isLoading ? "not-allowed" : "pointer",
//         background: user.isActive ? "#22C55E" : "#CBD5E1",
//         transition: "background 0.2s", padding: 0, flexShrink: 0,
//         opacity: isLoading ? 0.6 : 1,
//       }}
//     >
//       <span style={{
//         position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%",
//         background: "#fff", transition: "left 0.2s",
//         left: user.isActive ? 21 : 3,
//       }} />
//     </button>
//   );
// }

// // ─── Skeleton Row ─────────────────────────────────────────────────────────────

// function SkeletonRow() {
//   return (
//     <tr>
//       {[44, 160, 160, 120, 80, 80].map((w, i) => (
//         <td key={i} style={{ padding: "14px 16px" }}>
//           <div style={{
//             width: w, height: i === 0 ? 36 : 14, borderRadius: i === 0 ? "50%" : 6,
//             background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
//             backgroundSize: "400% 100%",
//             animation: "shimmer 1.4s infinite",
//           }} />
//         </td>
//       ))}
//     </tr>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function Users() {
//   const [page,   setPage]   = useState(1);
//   const [search, setSearch] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

//   const [showAdd,    setShowAdd]    = useState(false);
//   const [editUser,   setEditUser]   = useState<User | null>(null);
//   const [deleteUser, setDeleteUser] = useState<User | null>(null);

//   const { data, isLoading, isFetching } = useListUsersQuery({
//     page, limit: 10, search: search || undefined, isActive: filterActive,
//   });

//   const users      = data?.data?.users      ?? [];
//   const total      = data?.data?.total      ?? 0;
//   const totalPages = data?.data?.totalPages ?? 1;

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     setSearch(searchInput);
//     setPage(1);
//   }

//   const loading = isLoading || isFetching;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
//         .action-btn { opacity: 0; transition: opacity 0.15s; }
//         tr:hover .action-btn { opacity: 1; }
//         .filter-chip { cursor: pointer; border: 1.5px solid #E2E8F0; border-radius: 20px; padding: 5px 14px; font-size: 13px; font-weight: 500; background: #fff; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
//         .filter-chip.active { background: #EFF6FF; border-color: #BFDBFE; color: #1D4ED8; }
//         .filter-chip:not(.active) { color: #64748B; }
//         .filter-chip:not(.active):hover { background: #F8FAFC; }
//         .page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; cursor: pointer; display:flex; align-items:center; justify-content:center; color: #64748B; transition: all 0.15s; }
//         .page-btn:hover:not(:disabled) { border-color: #93C5FD; color: #2563EB; }
//         .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//         .page-num { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid transparent; background: none; cursor: pointer; font-size: 13px; font-weight: 500; color: #64748B; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
//         .page-num:hover { background: #F8FAFC; }
//         .page-num.current { background: #2563EB; border-color: #2563EB; color: #fff; }
//       `}</style>

//       <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "28px 32px", minHeight: "100vh", background: "#F8FAFC" }}>

//         {/* ── Header ─────────────────────────────────────────────────────── */}
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
//           <div>
//             <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.5px" }}>
//               User management
//             </h1>
//             <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748B" }}>
//               {total > 0 ? `${total} total users` : "Manage your platform users"}
//             </p>
//           </div>
//           <button
//             onClick={() => setShowAdd(true)}
//             style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "0 18px", height: 40, background: "#2563EB",
//               border: "none", borderRadius: 10, cursor: "pointer",
//               fontSize: 14, fontWeight: 600, color: "#fff",
//               fontFamily: "'DM Sans', sans-serif",
//               boxShadow: "0 1px 3px rgba(37,99,235,0.4)",
//             }}
//           >
//             <PlusIcon /> Add user
//           </button>
//         </div>

//         {/* ── Filters ────────────────────────────────────────────────────── */}
//         <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
//           {/* Search */}
//           <form onSubmit={handleSearch} style={{ position: "relative", flexGrow: 1, maxWidth: 360 }}>
//             <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>
//               <SearchIcon />
//             </span>
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search by name or email…"
//               style={{
//                 width: "100%", height: 40, paddingLeft: 38, paddingRight: 12,
//                 border: "1.5px solid #E2E8F0", borderRadius: 10,
//                 fontSize: 14, color: "#0F172A", outline: "none",
//                 fontFamily: "'DM Sans', sans-serif", background: "#fff",
//                 boxSizing: "border-box",
//               }}
//             />
//           </form>

//           {/* Status filters */}
//           <div style={{ display: "flex", gap: 6 }}>
//             {[
//               { label: "All users",  value: undefined   },
//               { label: "Active",     value: true        },
//               { label: "Inactive",   value: false       },
//             ].map(({ label, value }) => (
//               <button
//                 key={label}
//                 className={`filter-chip${filterActive === value ? " active" : ""}`}
//                 onClick={() => { setFilterActive(value); setPage(1); }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Table ──────────────────────────────────────────────────────── */}
//         <div style={{
//           background: "#fff", borderRadius: 16,
//           border: "1px solid #F1F5F9",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//           overflow: "hidden",
//         }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
//               <thead>
//                 <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
//                   {["User", "Email", "Phone", "Role", "Status", "Actions"].map((h) => (
//                     <th key={h} style={{
//                       padding: "12px 16px", textAlign: "left",
//                       fontSize: 11, fontWeight: 600, color: "#94A3B8",
//                       letterSpacing: "0.06em", textTransform: "uppercase",
//                       whiteSpace: "nowrap",
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading
//                   ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
//                   : users.length === 0
//                   ? (
//                     <tr>
//                       <td colSpan={6} style={{ padding: "64px 0", textAlign: "center" }}>
//                         <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
//                         <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#64748B" }}>No users found</p>
//                         <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94A3B8" }}>
//                           {search ? "Try a different search term" : "Add your first user to get started"}
//                         </p>
//                       </td>
//                     </tr>
//                   )
//                   : users.map((user) => (
//                     <tr key={user.id} style={{
//                       borderBottom: "1px solid #F8FAFC",
//                       transition: "background 0.1s",
//                     }}
//                       onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFF")}
//                       onMouseLeave={(e) => (e.currentTarget.style.background = "")}
//                     >
//                       {/* Avatar + Name */}
//                       <td style={{ padding: "12px 16px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                           <Avatar name={user.name} />
//                           <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A", whiteSpace: "nowrap" }}>
//                             {user.name}
//                           </span>
//                         </div>
//                       </td>
//                       {/* Email */}
//                       <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569" }}>
//                         {user.email}
//                       </td>
//                       {/* Phone */}
//                       <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>
//                         {user.phone}
//                       </td>
//                       {/* Role */}
//                       <td style={{ padding: "12px 16px" }}>
//                         <span style={{
//                           display: "inline-block", padding: "3px 10px", borderRadius: 20,
//                           fontSize: 12, fontWeight: 600,
//                           background: user.role === "ADMIN" ? "#EDE9FE" : "#F0FDF4",
//                           color:      user.role === "ADMIN" ? "#5B21B6" : "#15803D",
//                         }}>
//                           {user.role}
//                         </span>
//                       </td>
//                       {/* Status toggle */}
//                       <td style={{ padding: "12px 16px" }}>
//                         <StatusToggle user={user} />
//                       </td>
//                       {/* Actions */}
//                       <td style={{ padding: "12px 16px" }}>
//                         <div style={{ display: "flex", gap: 6 }}>
//                           <button
//                             className="action-btn"
//                             onClick={() => setEditUser(user)}
//                             title="Edit user"
//                             style={{
//                               width: 32, height: 32, borderRadius: 8,
//                               border: "1px solid #E2E8F0", background: "#fff",
//                               cursor: "pointer", display: "flex",
//                               alignItems: "center", justifyContent: "center",
//                               color: "#475569",
//                             }}
//                           >
//                             <EditIcon />
//                           </button>
//                           <button
//                             className="action-btn"
//                             onClick={() => setDeleteUser(user)}
//                             title="Delete user"
//                             style={{
//                               width: 32, height: 32, borderRadius: 8,
//                               border: "1px solid #FEE2E2", background: "#FEF2F2",
//                               cursor: "pointer", display: "flex",
//                               alignItems: "center", justifyContent: "center",
//                               color: "#EF4444",
//                             }}
//                           >
//                             <TrashIcon />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 }
//               </tbody>
//             </table>
//           </div>

//           {/* ── Pagination ───────────────────────────────────────────────── */}
//           {totalPages > 1 && (
//             <div style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "14px 20px", borderTop: "1px solid #F1F5F9",
//             }}>
//               <span style={{ fontSize: 13, color: "#94A3B8" }}>
//                 Page {page} of {totalPages}
//               </span>
//               <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
//                 <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
//                   <ChevronLeft />
//                 </button>
//                 {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                   const start = Math.max(1, Math.min(page - 2, totalPages - 4));
//                   const n = start + i;
//                   return (
//                     <button
//                       key={n}
//                       className={`page-num${n === page ? " current" : ""}`}
//                       onClick={() => setPage(n)}
//                     >
//                       {n}
//                     </button>
//                   );
//                 })}
//                 <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
//                   <ChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Modals ─────────────────────────────────────────────────────────── */}
//       {showAdd  && <UserFormModal onClose={() => setShowAdd(false)} />}
//       {editUser && <UserFormModal editUser={editUser} onClose={() => setEditUser(null)} />}
//       {deleteUser && <DeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} />}
//     </>
//   );
// }

import { useState } from "react";
import {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSetUserStatusMutation,
  useDeleteUserMutation,
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "../store/api/userApi";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm text-gray-400 font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function Input({ error, ...props }: { error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 w-full`}
    />
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function UserFormModal({ editUser, onClose }: { editUser?: User | null; onClose: () => void }) {
  const isEdit = !!editUser;
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [form, setForm] = useState({
    name:     editUser?.name  ?? "",
    email:    editUser?.email ?? "",
    phone:    editUser?.phone ?? "",
    password: "",
  });
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!isEdit && !form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setApiError("");
    try {
      if (isEdit) {
        await updateUser({ userId: editUser!.id, name: form.name, email: form.email, phone: form.phone } as UpdateUserRequest & { userId: string }).unwrap();
      } else {
        await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password } as CreateUserRequest).unwrap();
      }
      onClose();
    } catch {
      setApiError("Something went wrong. Please try again.");
    }
  }

  const isLoading = creating || updating;

  return (
    <Modal title={isEdit ? "Edit User" : "Add New User"} onClose={onClose}>
      {apiError && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-red-300 text-sm mb-4">
          {apiError}
        </div>
      )}
      <Field label="Full Name" error={errors.name}>
        <Input error={errors.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
      </Field>
      <Field label="Email Address" error={errors.email}>
        <Input error={errors.email} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
      </Field>
      <Field label="Phone Number" error={errors.phone}>
        <Input error={errors.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
      </Field>
      {!isEdit && (
        <Field label="Password" error={errors.password}>
          <Input error={errors.password} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" />
        </Field>
      )}
      <div className="flex gap-3 pt-1">
        <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
          {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Add User"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [apiError, setApiError]     = useState("");

  async function handleDelete() {
    setApiError("");
    try {
      await deleteUser(user.id).unwrap();
      onClose();
    } catch {
      setApiError("Failed to delete user.");
    }
  }

  return (
    <Modal title="Delete User" onClose={onClose}>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-11 h-11 rounded-xl bg-red-900/30 border border-red-800/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" strokeWidth={1.8} /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeWidth={1.8} />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" strokeWidth={1.8} />
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium">Delete <span className="text-red-300">{user.name}</span>?</p>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">This action cannot be undone. The user and all associated data will be permanently removed.</p>
        </div>
      </div>
      {apiError && <p className="text-red-400 text-sm mb-3">{apiError}</p>}
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={isLoading} className="flex-[2] py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
          {isLoading ? "Deleting…" : "Yes, Delete User"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Status Toggle ────────────────────────────────────────────────────────────

function StatusToggle({ user }: { user: User }) {
  const [setStatus, { isLoading }] = useSetUserStatusMutation();

  return (
    <button
      onClick={() => setStatus({ userId: user.id, isActive: !user.isActive })}
      disabled={isLoading}
      title={user.isActive ? "Deactivate user" : "Activate user"}
      className={`relative w-10 h-5 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${
        user.isActive ? "bg-emerald-500" : "bg-gray-700"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${user.isActive ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Users() {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [searchInput,  setSearchInput]  = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [showAdd,      setShowAdd]      = useState(false);
  const [editUser,     setEditUser]     = useState<User | null>(null);
  const [deleteUser,   setDeleteUser]   = useState<User | null>(null);

  const { data, isLoading, isFetching } = useListUsersQuery({
    page, limit: 10, search: search || undefined, isActive: filterActive,
  });

  const users      = data?.data?.users      ?? [];
  const total      = data?.data?.total      ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const loading    = isLoading || isFetching;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              {total > 0 ? `${total} total users` : "Manage your platform users"}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/30 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9 pr-4 py-2 w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
            />
          </form>

          <div className="flex gap-2">
            {[
              { label: "All",      value: undefined },
              { label: "Active",   value: true      },
              { label: "Inactive", value: false     },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => { setFilterActive(value as any); setPage(1); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["User", "Email", "Phone", "Role", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <p className="text-gray-500 text-sm">
                        {search ? `No users found for "${search}"` : "No users yet. Click Add User to create one."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors group">

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <span className="text-white text-sm font-medium whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-400 text-sm">{user.email}</td>

                      {/* Phone */}
                      <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">{user.phone}</td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          user.role === "ADMIN"
                            ? "bg-purple-900/30 text-purple-300 border-purple-800/50"
                            : "bg-gray-800 text-gray-300 border-gray-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusToggle user={user} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditUser(user)}
                            className="px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteUser(user)}
                            className="px-2.5 py-1 text-xs bg-red-900/30 hover:bg-red-900/60 text-red-300 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
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
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-md transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const n = start + i;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-7 text-xs rounded-md transition-colors ${
                        n === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-md transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {showAdd    && <UserFormModal onClose={() => setShowAdd(false)} />}
      {editUser   && <UserFormModal editUser={editUser} onClose={() => setEditUser(null)} />}
      {deleteUser && <DeleteModal  user={deleteUser}   onClose={() => setDeleteUser(null)} />}
    </div>
  );
}