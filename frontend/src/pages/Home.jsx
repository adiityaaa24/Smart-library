import React from 'react'

const Home = () => {
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

            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "#eef2ff"
                  }}
                >
                  <i className="fa-solid fa-book text-primary"></i>
                </span>
                <span className="small text-muted">
                  Explore Books
                </span>
              </div>

              <div className="d-flex align-items-center">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "#ecfdf5"
                  }}
                >
                  <i className="fa-solid fa-clock-rotate-left text-success"></i>
                </span>
                <span className="small text-muted">
                  Track Your History
                </span>
              </div>
            </div>

          </div>

          {/* Hero Illustration */}
          <div className="col-md-5 mt-5 mt-md-0">
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                background: "linear-gradient(145deg,#ffffff,#f5f7ff)"
              }}
            >
              <div className="card-body p-5 text-center">

                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "110px",
                    height: "110px",
                    background: "#eef2ff"
                  }}
                >
                  <i
                    className="fa-solid fa-building-columns text-primary"
                    style={{ fontSize: "3.5rem" }}
                  ></i>
                </div>

                <h4 className="fw-semibold mb-2">
                  Manage. Discover. Read.
                </h4>

                <p className="text-muted small mb-0">
                  Your library experience, organized in one place.
                </p>

              </div>
            </div>
          </div>
        </div>


        {/* Features Heading */}
        <div className="text-center mb-4">
          <h3 className="fw-semibold mb-2">
            Everything You Need
          </h3>

          <p className="text-muted">
            Simple tools to make your library experience easier
          </p>
        </div>


        {/* Feature Cards */}
        <div className="row g-4 mb-5">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#eef2ff"
                  }}
                >
                  <i className="fa-solid fa-book text-primary fs-5"></i>
                </span>

                <h5 className="fw-semibold">
                  Browse Books
                </h5>

                <p className="text-muted small mb-0">
                  Explore the library catalogue and discover books
                  available to you.
                </p>

              </div>
            </div>
          </div>


          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#ecfdf5"
                  }}
                >
                  <i className="fa-solid fa-receipt text-success fs-5"></i>
                </span>

                <h5 className="fw-semibold">
                  Track Issued Books
                </h5>

                <p className="text-muted small mb-0">
                  Keep track of your issued books, return dates and
                  applicable fines.
                </p>

              </div>
            </div>
          </div>


          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#fff7ed"
                  }}
                >
                  <i className="fa-solid fa-user-graduate text-warning fs-5"></i>
                </span>

                <h5 className="fw-semibold">
                  Manage Your Account
                </h5>

                <p className="text-muted small mb-0">
                  Keep your profile information and account details
                  organized.
                </p>

              </div>
            </div>
          </div>

        </div>


        {/* Bottom Section */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 text-center">

            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "50px",
                height: "50px",
                background: "#eef2ff"
              }}
            >
              <i className="fa-solid fa-layer-group text-primary"></i>
            </div>

            <h5 className="fw-semibold mb-2">
              Your Library, Simplified
            </h5>

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