import { useEffect, useState } from "react";
import "./../styles/adminDashboard.css";

// const API_URL = "http://localhost:5000/api/admin";
const API_URL = import.meta.env.VITE_API_URL;



// =====================================================
// LOAN STUDENTS MANAGER
// =====================================================

function LoanStudentsManager({ goBack }) {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoanStudents = async () => {
    try {
      setLoading(true);
      setError("");

      // const response = await fetch(
      //   "http://localhost:5000/api/loan/enquiries"
      // );
      const response = await fetch(
        `${API_URL}/api/loan/enquiries`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to load loan students"
        );
      }

      setStudents(data.enquiries || []);

    } catch (err) {
      console.error(
        "Loan students error:",
        err
      );

      setError(
        "Loan students could not be loaded."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanStudents();
  }, []);

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this loan enquiry?"
      );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `${API_URL}/api/loan/enquiries/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
          "Enquiry could not be deleted"
        );
      }

      alert(
        "Loan enquiry deleted successfully!"
      );

      fetchLoanStudents();

    } catch (err) {

      console.error(
        "Loan student delete error:",
        err
      );

      setError(
        err.message ||
        "Enquiry could not be deleted."
      );
    }
  };

  return (
    <section className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <div>

          <span className="admin-label">
            EDUCATION LOAN
          </span>

          <h1>
            Loan Students
          </h1>

          <p>
            View students who submitted education
            loan enquiries.
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={goBack}
        >
          ← Back
        </button>

      </header>


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* SUMMARY */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>

            <span>
              Total Loan Students
            </span>

            <strong>
              {loading
                ? "..."
                : students.length}
            </strong>

            <small>
              Education loan enquiries
            </small>

          </div>

        </div>

      </div>


      {/* STUDENT LIST */}

      <div className="content-card">

        <div className="section-header">

          <div>

            <h2>
              Education Loan Students
            </h2>

            <p>
              All education loan enquiry submissions.
            </p>

          </div>

          <button
            className="refresh-btn"
            onClick={fetchLoanStudents}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading loan students...
            </h3>

          </div>

        ) : students.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🎓
            </div>

            <h3>
              No loan students yet
            </h3>

            <p>
              Education loan form submissions
              will appear here.
            </p>

          </div>

        ) : (

          <div className="loan-students-list">

            {students.map((student) => (

              <div
                className="loan-student-card"
                key={student._id}
              >

                {/* STUDENT HEADER */}

                <div className="loan-student-header">

                  <div className="student-avatar">
                    {(
                      student.name || "S"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="loan-student-main">

                    <h3>
                      {student.name}
                    </h3>

                    <span>
                      🎓 Education Loan
                    </span>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        student._id
                      )
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>


                {/* STUDENT DETAILS */}

                <div className="loan-student-details">

                  <div>
                    <span>
                      Email
                    </span>

                    <strong>
                      {student.email}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Phone
                    </span>

                    <strong>
                      {student.phone}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Enquiry Type
                    </span>

                    <strong>
                      {student.enquiryType}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Submitted On
                    </span>

                    <strong>
                      {student.createdAt
                        ? new Date(
                          student.createdAt
                        ).toLocaleString()
                        : "—"}
                    </strong>
                  </div>

                </div>


                {/* MESSAGE */}

                <div className="loan-student-message">

                  <span>
                    Message
                  </span>

                  <p>
                    {student.message}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}


// =====================================================
// CAREER MANAGER
// =====================================================

function CareerManager({ goBack }) {
  const emptyCareer = {
    slug: "",
    title: "",
    category: "",
    description: "",
    education: "",
    skills: "",
    courses: "",
    roadmap: "",
  };

  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState(emptyCareer);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/careers`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load careers");
      }

      setCareers(data.careers || []);
    } catch (err) {
      console.error("Career fetch error:", err);
      setError("Careers could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyCareer);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const careerData = {
        slug: form.slug.trim(),
        title: form.title.trim(),
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
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Career could not be saved"
        );
      }

      alert(
        editingId
          ? "Career updated successfully!"
          : "Career added successfully!"
      );

      resetForm();
      fetchCareers();

    } catch (err) {
      console.error("Career save error:", err);
      setError(err.message || "Career could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (career) => {
    setEditingId(career._id);

    setForm({
      slug: career.slug || "",
      title: career.title || "",
      category: career.category || "",
      description: career.description || "",
      education: career.education || "",
      skills: Array.isArray(career.skills)
        ? career.skills.join(", ")
        : "",
      courses: Array.isArray(career.courses)
        ? career.courses.join(", ")
        : "",
      roadmap: Array.isArray(career.roadmap)
        ? career.roadmap.join("\n")
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this career?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/admin/careers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Career could not be deleted"
        );
      }

      alert("Career deleted successfully!");

      fetchCareers();

    } catch (err) {
      console.error("Career delete error:", err);
      setError(err.message || "Career could not be deleted.");
    }
  };

  return (
    <section className="admin-page">

      <header className="admin-header">
        <div>
          <span className="admin-label">
            WEBSITE
          </span>

          <h1>
            Career Management
          </h1>

          <p>
            Add, edit and delete career information displayed
            on your website.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={goBack}
        >
          ← Back
        </button>
      </header>


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* =====================================================
          CAREER FORM
      ===================================================== */}

      <div className="content-card">

        <div className="content-icon">
          {editingId ? "✏️" : "🎓"}
        </div>

        <h2>
          {editingId
            ? "Edit Career"
            : "Add New Career"}
        </h2>

        <p>
          Enter career information below.
        </p>


        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >

          <div className="form-grid">

            <div className="input-group">
              <label>
                Career Slug
              </label>

              <input
                type="text"
                name="slug"
                placeholder="software-developer"
                value={form.slug}
                onChange={handleChange}
                required
              />
            </div>


            <div className="input-group">
              <label>
                Career Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Software Developer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>


            <div className="input-group">
              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                placeholder="Technology"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          <div className="input-group">
            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter career description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>


          <div className="input-group">
            <label>
              Education Required
            </label>

            <textarea
              name="education"
              placeholder="Enter education requirements"
              value={form.education}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>


          <div className="input-group">
            <label>
              Skills
            </label>

            <textarea
              name="skills"
              placeholder="HTML, CSS, JavaScript, React, Node.js"
              value={form.skills}
              onChange={handleChange}
              rows="3"
              required
            />

            <small>
              Separate skills using commas.
            </small>
          </div>


          <div className="input-group">
            <label>
              Courses
            </label>

            <textarea
              name="courses"
              placeholder="Web Development, JavaScript, React"
              value={form.courses}
              onChange={handleChange}
              rows="3"
              required
            />

            <small>
              Separate courses using commas.
            </small>
          </div>


          <div className="input-group">
            <label>
              Career Roadmap
            </label>

            <textarea
              name="roadmap"
              placeholder={
                "Learn programming\nBuild projects\nLearn React\nApply for internships"
              }
              value={form.roadmap}
              onChange={handleChange}
              rows="6"
              required
            />

            <small>
              Write each roadmap step on a new line.
            </small>
          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="content-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Career"
                  : "Add Career"}
            </button>


            {editingId && (
              <button
                type="button"
                className="refresh-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =====================================================
          CAREER LIST
      ===================================================== */}

      <div className="content-card">

        <div className="section-header">

          <div>
            <h2>
              Career List
            </h2>

            <p>
              Manage all careers stored in MongoDB.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchCareers}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="empty-state">
            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading careers...
            </h3>
          </div>

        ) : careers.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🎓
            </div>

            <h3>
              No careers found
            </h3>

            <p>
              Add your first career using the form above.
            </p>

          </div>

        ) : (

          <div className="admin-items-list">

            {careers.map((career) => (

              <div
                className="admin-item"
                key={career._id}
              >

                <div className="admin-item-info">

                  <strong>
                    {career.title}
                  </strong>

                  <span>
                    {career.category}
                  </span>

                  <small>
                    /{career.slug}
                  </small>

                </div>


                <div className="admin-item-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(career)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(career._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}


// =====================================================
// JOB MANAGER
// =====================================================

function JobManager({ type, goBack }) {
  const isGovernment = type === "government";

  const emptyJob = {
    title: "",
    organization: "",
    company: "",
    location: "",

    // Private Job fields
    salary: "",
    experience: "",
    jobType: "Full Time",
    skills: "",
    technologies: "",
    icon: "💼",

    // Existing fields
    qualification: "",
    lastDate: "",
    description: "",
    applyLink: "",
  };

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const baseURL = `${API_URL}/jobs/${type}`;

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(baseURL);
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load jobs"
        );
      }

      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Jobs fetch error:", err);

      setError(
        "Jobs could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm(emptyJob);
    setEditingId(null);
  };

  // =====================================================
  // SUBMIT JOB
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const jobData = {
        ...form,

        title:
          form.title.trim(),

        location:
          form.location.trim(),

        qualification:
          form.qualification.trim(),

        lastDate:
          form.lastDate.trim(),

        description:
          form.description.trim(),

        applyLink:
          form.applyLink.trim(),
      };

      // =================================================
      // PRIVATE JOB
      // =================================================

      if (!isGovernment) {
        jobData.company =
          form.company.trim();

        jobData.salary =
          form.salary.trim();

        jobData.experience =
          form.experience.trim();

        jobData.type =
          form.jobType.trim() || "Full Time";

        jobData.icon =
          form.icon.trim() || "💼";

        jobData.skills =
          form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

        jobData.technologies =
          form.technologies
            .split(",")
            .map((technology) =>
              technology.trim()
            )
            .filter(Boolean);
      }

      // =================================================
      // GOVERNMENT JOB
      // =================================================

      if (isGovernment) {
        jobData.organization =
          form.organization.trim();
      }

      // =================================================
      // URL + METHOD
      // =================================================

      const url = editingId
        ? `${baseURL}/${editingId}`
        : baseURL;

      const method = editingId
        ? "PUT"
        : "POST";

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(jobData),
      });

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
          "Job could not be saved"
        );
      }

      alert(
        editingId
          ? "Job updated successfully!"
          : "Job added successfully!"
      );

      resetForm();

      await fetchJobs();

    } catch (err) {
      console.error(
        "Job save error:",
        err
      );

      setError(
        err.message ||
        "Job could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT JOB
  // =====================================================

  const handleEdit = (job) => {
    setEditingId(job._id);

    setForm({
      title:
        job.title || "",

      organization:
        job.organization || "",

      company:
        job.company || "",

      location:
        job.location || "",

      salary:
        job.salary || "",

      experience:
        job.experience || "",

      jobType:
        job.type || "Full Time",

      skills:
        Array.isArray(job.skills)
          ? job.skills.join(", ")
          : "",

      technologies:
        Array.isArray(job.technologies)
          ? job.technologies.join(", ")
          : "",

      icon:
        job.icon || "💼",

      qualification:
        job.qualification || "",

      lastDate:
        job.lastDate || "",

      description:
        job.description || "",

      applyLink:
        job.applyLink || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${baseURL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
          "Job could not be deleted"
        );
      }

      alert(
        "Job deleted successfully!"
      );

      fetchJobs();

    } catch (err) {
      console.error(
        "Job delete error:",
        err
      );

      setError(
        err.message ||
        "Job could not be deleted."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="admin-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">

        <div>

          <span className="admin-label">
            JOBS
          </span>

          <h1>
            {isGovernment
              ? "Government Jobs"
              : "Private Jobs"}
          </h1>

          <p>
            Manage{" "}
            {isGovernment
              ? "government"
              : "private sector"}{" "}
            job listings.
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={goBack}
        >
          ← Back
        </button>

      </header>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* =================================================
          JOB FORM
      ================================================= */}

      <div className="content-card">

        <div className="content-icon">
          {isGovernment
            ? "🏛️"
            : "💼"}
        </div>

        <h2>
          {editingId
            ? "Edit Job"
            : `Add ${isGovernment
              ? "Government"
              : "Private"
            } Job`}
        </h2>

        <p>
          Enter job information below.
        </p>


        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="form-grid">

            {/* JOB TITLE */}

            <div className="input-group">

              <label>
                Job Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Software Developer"
                value={form.title}
                onChange={handleChange}
                required
              />

            </div>


            {/* COMPANY / ORGANIZATION */}

            <div className="input-group">

              <label>
                {isGovernment
                  ? "Organization"
                  : "Company"}
              </label>

              <input
                type="text"
                name={
                  isGovernment
                    ? "organization"
                    : "company"
                }
                placeholder={
                  isGovernment
                    ? "UPSC"
                    : "TCS"
                }
                value={
                  isGovernment
                    ? form.organization
                    : form.company
                }
                onChange={handleChange}
                required
              />

            </div>


            {/* LOCATION */}

            <div className="input-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Lucknow / Delhi / Remote"
                value={form.location}
                onChange={handleChange}
                required
              />

            </div>


            {/* QUALIFICATION */}

            <div className="input-group">

              <label>
                Qualification
              </label>

              <input
                type="text"
                name="qualification"
                placeholder="Graduate / B.Tech / BCA"
                value={form.qualification}
                onChange={handleChange}
                required={isGovernment}
              />

            </div>


            {/* LAST DATE */}

            <div className="input-group">

              <label>
                Last Date
              </label>

              <input
                type="text"
                name="lastDate"
                placeholder="30 September 2026"
                value={form.lastDate}
                onChange={handleChange}
              />

            </div>


            {/* =================================================
                PRIVATE JOB ONLY
            ================================================= */}

            {!isGovernment && (
              <>

                {/* SALARY */}

                <div className="input-group">

                  <label>
                    Salary
                  </label>

                  <input
                    type="text"
                    name="salary"
                    placeholder="₹4 - ₹8 LPA"
                    value={form.salary}
                    onChange={handleChange}
                  />

                </div>


                {/* EXPERIENCE */}

                <div className="input-group">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    placeholder="Fresher / Entry Level"
                    value={form.experience}
                    onChange={handleChange}
                  />

                </div>


                {/* JOB TYPE */}

                <div className="input-group">

                  <label>
                    Job Type
                  </label>

                  <input
                    type="text"
                    name="jobType"
                    placeholder="Full Time"
                    value={form.jobType}
                    onChange={handleChange}
                  />

                </div>


                {/* ICON */}

                <div className="input-group">

                  <label>
                    Job Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    placeholder="💻"
                    value={form.icon}
                    onChange={handleChange}
                  />

                </div>

              </>
            )}

          </div>


          {/* =================================================
              PRIVATE JOB SKILLS
          ================================================= */}

          {!isGovernment && (
            <>

              <div className="input-group">

                <label>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="Problem Solving, Debugging, Teamwork"
                  value={form.skills}
                  onChange={handleChange}
                />

                <small>
                  Separate skills with commas.
                </small>

              </div>


              <div className="input-group">

                <label>
                  Languages & Technologies
                </label>

                <input
                  type="text"
                  name="technologies"
                  placeholder="JavaScript, React, HTML, CSS"
                  value={form.technologies}
                  onChange={handleChange}
                />

                <small>
                  Separate technologies with commas.
                </small>

              </div>

            </>
          )}


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="input-group">

            <label>
              Job Description
            </label>

            <textarea
              name="description"
              placeholder="Enter job description"
              value={form.description}
              onChange={handleChange}
              rows="5"
            />

          </div>


          {/* =================================================
              APPLY LINK
          ================================================= */}

          <div className="input-group">

            <label>
              Apply Link
            </label>

            <input
              type="text"
              name="applyLink"
              placeholder="https://example.com/apply"
              value={form.applyLink}
              onChange={handleChange}
            />

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="submit"
              className="content-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Job"
                  : "Add Job"}
            </button>


            {editingId && (
              <button
                type="button"
                className="refresh-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =================================================
          JOB LIST
      ================================================= */}

      <div className="content-card">

        <div className="section-header">

          <div>

            <h2>
              {isGovernment
                ? "Government Job List"
                : "Private Job List"}
            </h2>

            <p>
              Manage jobs stored in MongoDB.
            </p>

          </div>


          <button
            className="refresh-btn"
            onClick={fetchJobs}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading jobs...
            </h3>

          </div>

        ) : jobs.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              {isGovernment
                ? "🏛️"
                : "💼"}
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Add your first job using the form above.
            </p>

          </div>

        ) : (

          <div className="admin-items-list">

            {jobs.map((job) => (

              <div
                className="admin-item"
                key={job._id}
              >

                <div className="admin-item-info">

                  <strong>
                    {job.title}
                  </strong>

                  <span>
                    {isGovernment
                      ? job.organization
                      : job.company}
                  </span>

                  <small>
                    📍 {job.location}
                  </small>

                </div>


                <div className="admin-item-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(job)
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(job._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}


// =====================================================
// MAIN ADMIN DASHBOARD
// =====================================================

function AdminDashboard() {

  const [activePage, setActivePage] =
    useState("dashboard");

  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalStudents: 0,
    totalRecommendations: 0,
  });

  const [recentAssessments, setRecentAssessments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/stats`
      );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to load dashboard"
        );
      }

      setStats(data.stats);

      setRecentAssessments(
        data.recentAssessments || []
      );

    } catch (err) {

      console.error(
        "Dashboard error:",
        err
      );

      setError(
        "Dashboard data could not be loaded."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href =
      "/admin/login";
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-dashboard">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-logo">
            🎓
          </div>

          <div>

            <h2>
              Educational
            </h2>

            <span>
              Admin Panel
            </span>

          </div>

        </div>


        <nav className="admin-nav">

          <button
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            📊
            <span>
              Dashboard
            </span>
          </button>



          <button
            className={
              activePage === "loanStudents"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("loanStudents")
            }
          >
            🎓
            <span>
              Loan Students
            </span>
          </button>


          <button
            className={
              activePage === "content"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("content")
            }
          >
            📝
            <span>
              Website Content
            </span>
          </button>

        </nav>


        <div className="sidebar-bottom">

          <a href="/">
            🌐
            <span>
              View Website
            </span>
          </a>


          <button
            onClick={handleLogout}
          >
            🚪
            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main">


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activePage === "dashboard" && (

          <>

            <header className="admin-header">

              <div>

                <span className="admin-label">
                  ADMIN PANEL
                </span>

                <h1>
                  Dashboard 👋
                </h1>

                <p>
                  Manage and monitor your website and students.
                </p>

              </div>


              <button
                className="refresh-btn"
                onClick={fetchDashboardData}
              >
                ↻ Refresh
              </button>

            </header>


            {error && (
              <div className="dashboard-error">
                {error}
              </div>
            )}


            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon">
                  👥
                </div>

                <div>

                  <span>
                    Total Students
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.totalStudents}
                  </strong>

                  <small>
                    Registered students
                  </small>

                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  📝
                </div>

                <div>

                  <span>
                    Assessments
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.totalAssessments}
                  </strong>

                  <small>
                    Completed assessments
                  </small>

                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🎯
                </div>

                <div>

                  <span>
                    Recommendations
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.totalRecommendations}
                  </strong>

                  <small>
                    Career recommendations
                  </small>

                </div>

              </div>

            </section>


            <section className="dashboard-section">

              <div className="section-header">

                <div>

                  <h2>
                    Recent Students
                  </h2>

                  <p>
                    Latest assessment submissions.
                  </p>

                </div>

              </div>


              {loading ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    ⏳
                  </div>

                  <h3>
                    Loading...
                  </h3>

                </div>

              ) : recentAssessments.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    👥
                  </div>

                  <h3>
                    No students yet
                  </h3>

                  <p>
                    Student activity will appear here.
                  </p>

                </div>

              ) : (

                <div className="assessment-list">

                  {recentAssessments.map(
                    (assessment, index) => (

                      <div
                        className="assessment-row"
                        key={
                          assessment._id ||
                          index
                        }
                      >

                        <div className="student-avatar">

                          {(
                            assessment.name ||
                            "S"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div className="assessment-info">

                          <strong>
                            {assessment.name ||
                              "Unknown Student"}
                          </strong>

                          <span>
                            {assessment.email ||
                              "Email not available"}
                          </span>

                        </div>


                        <div className="assessment-career">

                          <span>
                            Career
                          </span>

                          <strong>
                            {assessment.career ||
                              assessment.recommendation ||
                              "Not available"}
                          </strong>

                        </div>


                        <div className="assessment-date">

                          {assessment.createdAt
                            ? new Date(
                              assessment.createdAt
                            ).toLocaleDateString()
                            : "—"}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </>

        )}


        {/* =====================================================
            STUDENTS
        ===================================================== */}

        {activePage === "students" && (

          <section className="admin-page">

            <header className="admin-header">

              <div>

                <span className="admin-label">
                  STUDENTS
                </span>

                <h1>
                  Students
                </h1>

                <p>
                  View basic information about students.
                </p>

              </div>

            </header>


            <div className="content-card">

              <h2>
                Student Management
              </h2>

              <p>
                Student information will be connected here.
              </p>

              <div className="coming-soon">

                <div className="empty-icon">
                  👥
                </div>

                <h3>
                  Student Data
                </h3>

                <p>
                  Student management can be added next.
                </p>

              </div>

            </div>

          </section>

        )}

        {/* =====================================================
    LOAN STUDENTS
===================================================== */}

        {activePage === "loanStudents" && (

          <LoanStudentsManager
            goBack={() =>
              setActivePage("dashboard")
            }
          />

        )}


        {/* =====================================================
            WEBSITE CONTENT
        ===================================================== */}

        {activePage === "content" && (

          <section className="admin-page">

            <header className="admin-header">

              <div>

                <span className="admin-label">
                  WEBSITE
                </span>

                <h1>
                  Website Content
                </h1>

                <p>
                  Manage your website content from this section.
                </p>

              </div>

            </header>


            <div className="content-grid">


              {/* CAREERS */}

              <div className="content-card">

                <div className="content-icon">
                  🎓
                </div>

                <h2>
                  Career Details
                </h2>

                <p>
                  Add, edit and delete career information,
                  skills, courses and roadmaps.
                </p>

                <button
                  className="content-btn"
                  onClick={() =>
                    setActivePage("careers")
                  }
                >
                  Manage Careers
                </button>

              </div>


              {/* GOVERNMENT JOBS */}

              <div className="content-card">

                <div className="content-icon">
                  🏛️
                </div>

                <h2>
                  Government Jobs
                </h2>

                <p>
                  Add, edit and delete government jobs.
                </p>

                <button
                  className="content-btn"
                  onClick={() =>
                    setActivePage("governmentJobs")
                  }
                >
                  Manage Government Jobs
                </button>

              </div>


              {/* PRIVATE JOBS */}

              <div className="content-card">

                <div className="content-icon">
                  💼
                </div>

                <h2>
                  Private Jobs
                </h2>

                <p>
                  Add, edit and delete private sector jobs.
                </p>

                <button
                  className="content-btn"
                  onClick={() =>
                    setActivePage("privateJobs")
                  }
                >
                  Manage Private Jobs
                </button>

              </div>



            </div>

          </section>

        )}


        {/* =====================================================
            CAREERS
        ===================================================== */}

        {activePage === "careers" && (

          <CareerManager
            goBack={() =>
              setActivePage("content")
            }
          />

        )}


        {/* =====================================================
            GOVERNMENT JOBS
        ===================================================== */}

        {activePage === "governmentJobs" && (

          <JobManager
            type="government"
            goBack={() =>
              setActivePage("content")
            }
          />

        )}


        {/* =====================================================
            PRIVATE JOBS
        ===================================================== */}

        {activePage === "privateJobs" && (

          <JobManager
            type="private"
            goBack={() =>
              setActivePage("content")
            }
          />

        )}


      </main>

    </div>
  );
}

export default AdminDashboard;