import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

// API URL: Live Render backend
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://educational-backend23.onrender.com"
).replace(/\/+$/, "");

function AdminCareers() {
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    education: "",
    skills: "",
    courses: "",
    roadmap: "",
  });

  // ===============================
  // FETCH CAREERS
  // ===============================

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/careers`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load careers"
        );
      }

      setCareers(data.careers || []);
    } catch (err) {
      console.error("Career fetch error:", err);
      setError("Careers load nahi ho pa rahi hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // RESET FORM
  // ===============================

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      category: "",
      description: "",
      education: "",
      skills: "",
      courses: "",
      roadmap: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ===============================
  // EDIT CAREER
  // ===============================

  const handleEdit = (career) => {
    setEditingId(career._id);

    setForm({
      title: career.title || "",
      slug: career.slug || "",
      category: career.category || "",
      description: career.description || "",
      education: career.education || "",
      skills: (career.skills || []).join(", "),
      courses: (career.courses || []).join(", "),
      roadmap: (career.roadmap || []).join("\n"),
    });

    setShowForm(true);
  };

  // ===============================
  // ADD / UPDATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        category: form.category.trim(),
        description: form.description.trim(),
        education: form.education.trim(),

        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        courses: form.courses
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        roadmap: form.roadmap
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const url = editingId
        ? `${API_URL}/api/admin/careers/${editingId}`
        : `${API_URL}/api/admin/careers`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Career save failed"
        );
      }

      alert(
        editingId
          ? "Career updated successfully!"
          : "Career added successfully!"
      );

      resetForm();
      await fetchCareers();
    } catch (err) {
      console.error("Career save error:", err);
      setError(err.message || "Career save nahi ho paayi.");
    }
  };

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this career?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/careers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      alert("Career deleted successfully!");

      await fetchCareers();
    } catch (err) {
      console.error("Career delete error:", err);
      setError(err.message || "Career delete nahi ho paayi.");
    }
  };

  return (
    <section className="admin-page">

      {/* HEADER */}

      <header className="admin-header">
        <div>
          <span className="admin-label">
            WEBSITE
          </span>

          <h1>Career Management</h1>

          <p>
            Add, edit and delete career information.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* ADD BUTTON */}

      {!showForm && (
        <button
          className="content-btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: "20px" }}
        >
          + Add Career
        </button>
      )}

      {/* FORM */}

      {showForm && (
        <div className="content-card">
          <h2>
            {editingId ? "Edit Career" : "Add New Career"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Career Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Software Developer"
                required
              />
            </div>

            <div className="input-group">
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="software-developer"
                required
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Technology"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Career description..."
                rows="4"
                required
              />
            </div>

            <div className="input-group">
              <label>Education</label>
              <textarea
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="Required education..."
                rows="4"
                required
              />
            </div>

            <div className="input-group">
              <label>
                Skills
                <small> (comma separated)</small>
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="input-group">
              <label>
                Courses
                <small> (comma separated)</small>
              </label>
              <input
                type="text"
                name="courses"
                value={form.courses}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="input-group">
              <label>
                Roadmap
                <small> (one step per line)</small>
              </label>
              <textarea
                name="roadmap"
                value={form.roadmap}
                onChange={handleChange}
                placeholder={`Learn programming
Learn HTML CSS JavaScript
Learn React
Build projects`}
                rows="8"
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="content-btn"
              >
                {editingId ? "Update Career" : "Add Career"}
              </button>

              <button
                type="button"
                className="content-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CAREER LIST */}

      {!showForm && (
        <div className="content-card">
          <h2>All Careers</h2>

          {loading ? (
            <div className="empty-state">
              <h3>Loading careers...</h3>
            </div>
          ) : careers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No careers found</h3>
              <p>Add your first career.</p>
            </div>
          ) : (
            <div className="assessment-list">
              {careers.map((career) => (
                <div
                  className="assessment-row"
                  key={career._id}
                >
                  <div className="student-avatar">
                    🎓
                  </div>

                  <div className="assessment-info">
                    <strong>{career.title}</strong>
                    <span>{career.category}</span>
                  </div>

                  <div className="assessment-career">
                    <span>Slug</span>
                    <strong>{career.slug}</strong>
                  </div>

                  <button
                    className="content-btn"
                    onClick={() => handleEdit(career)}
                  >
                    Edit
                  </button>

                  <button
                    className="content-btn"
                    onClick={() => handleDelete(career._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminCareers;