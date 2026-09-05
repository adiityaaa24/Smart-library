import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api";   

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [counts, setCounts] = useState({ books: 0, students: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/public_stats/");
        setCounts({
          books: res.data.total_books,
          students: res.data.total_students,
          categories: res.data.total_categories,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
        // fallback: agar API fail ho jaaye toh 0 hi dikhega, crash nahi hoga
      }
    };

    fetchStats();
  }, []);

  const studentUser = JSON.parse(localStorage.getItem("studentUser"));

  const features = [
    {
      icon: "fa-book",
      bg: "#eef2ff",
      color: "text-primary",
      title: "Browse Books",
      desc: "Explore the library catalogue and discover books available to you.",
    },
    {
      icon: "fa-receipt",
      bg: "#ecfdf5",
      color: "text-success",
      title: "Track Issued Books",
      desc: "Keep track of your issued books, return dates and applicable fines.",
    },
    {
      icon: "fa-user-graduate",
      bg: "#fff7ed",
      color: "text-warning",
      title: "Manage Your Account",
      desc: "Keep your profile information and account details organized.",
    },
  ];

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg,#f3f4ff,#fdfbff)",
        minHeight: "100vh"
      }}
    >
      <div className="container">

        {/* Hero Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-7">

            <div
              className="badge bg-primary-subtle text-primary py-2 px-3 rounded-pill fs-6 mb-3"
            >
              <i className="fa-solid fa-book-open me-2"></i>
              Smart Library
            </div>

            <h1 className="fw-bold mb-3" style={{ fontSize: "2.8rem" }}>
              Welcome to Your
              <span className="text-primary"> Smart Library</span>
            </h1>

            <p
              className="text-muted mb-4"
              style={{ fontSize: "1.05rem", maxWidth: "600px" }}
            >
              A simple and modern library management system designed to help
              students discover books, manage issued books and keep track of
              their library activity.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              {studentUser ? (
                <button
                  className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
                  onClick={() => navigate("/user/dashboard")}
                  style={{ transition: "transform 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Go to Dashboard <i className="fa-solid fa-arrow-right ms-2"></i>
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
                    onClick={() => navigate("/user/signup")}
                    style={{ transition: "transform 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Get Started <i className="fa-solid fa-arrow-right ms-2"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
                    onClick={() => navigate("/user/login")}
                    style={{ transition: "transform 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                  style={{ width: "38px", height: "38px", background: "#eef2ff" }}
                >
                  <i className="fa-solid fa-book text-primary"></i>
                </span>
                <span className="small text-muted">Explore Books</span>
              </div>

              <div className="d-flex align-items-center">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                  style={{ width: "38px", height: "38px", background: "#ecfdf5" }}
                >
                  <i className="fa-solid fa-clock-rotate-left text-success"></i>
                </span>
                <span className="small text-muted">Track Your History</span>
              </div>
            </div>

          </div>

          <div className="col-md-5 mt-5 mt-md-0">
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                background: "linear-gradient(145deg,#ffffff,#f5f7ff)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div className="card-body p-5 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{ width: "110px", height: "110px", background: "#eef2ff" }}
                >
                  <i className="fa-solid fa-building-columns text-primary" style={{ fontSize: "3.5rem" }}></i>
                </div>
                <h4 className="fw-semibold mb-2">Manage. Discover. Read.</h4>
                <p className="text-muted small mb-0">Your library experience, organized in one place.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section — real data, direct */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 py-4">
              <h2 className="fw-bold text-primary mb-0">{counts.books}+</h2>
              <p className="text-muted small mb-0">Books Available</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 py-4">
              <h2 className="fw-bold text-success mb-0">{counts.students}+</h2>
              <p className="text-muted small mb-0">Registered Students</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 py-4">
              <h2 className="fw-bold text-warning mb-0">{counts.categories}+</h2>
              <p className="text-muted small mb-0">Categories</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="fw-semibold mb-2">Everything You Need</h3>
          <p className="text-muted">Simple tools to make your library experience easier</p>
        </div>

        <div className="row g-4 mb-5">
          {features.map((f, idx) => (
            <div className="col-md-4" key={idx}>
              <div
                className="card border-0 shadow-sm rounded-4 h-100"
                style={{
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  transform: hoveredCard === idx ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: hoveredCard === idx ? "0 12px 24px rgba(0,0,0,0.08)" : undefined,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-body p-4">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "48px", height: "48px", background: f.bg,
                      transition: "transform 0.25s ease",
                      transform: hoveredCard === idx ? "rotate(-6deg) scale(1.1)" : "rotate(0) scale(1)",
                    }}
                  >
                    <i className={`fa-solid ${f.icon} ${f.color} fs-5`}></i>
                  </span>
                  <h5 className="fw-semibold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: "50px", height: "50px", background: "#eef2ff" }}
            >
              <i className="fa-solid fa-layer-group text-primary"></i>
            </div>
            <h5 className="fw-semibold mb-2">Your Library, Simplified</h5>
            <p className="text-muted small mb-0">
              Smart Library brings books, borrowing history and account
              management together in one clean interface.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home