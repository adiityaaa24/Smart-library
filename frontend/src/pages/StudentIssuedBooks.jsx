import {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const StudentIssuedBooks = () => {
   const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [issuedBooks, setIssuedBooks] = useState([]);
  
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
      if(!studentUser){
        navigate("/user/login");
        return;
      }

        const fetchIssuedBooks = async () => {
            setLoading(true);     //api call start hone wala h
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/user_issued_books/", {params: {student_id: studentUser.student_id}});
                //https://1227.0.0.1:8000/api/user_issued_books/?student_id=1
                setIssuedBooks(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch issued books.");
            } finally {
                setLoading(false);
            }
        };

        fetchIssuedBooks();
    }, []);

    const totalIssuedBooks = issuedBooks.length;
    const notReturnedCount = issuedBooks.filter(issue => !issue.is_returned).length;
    const totalFine = issuedBooks.reduce((sum, issue) => sum + (issue.fine || 0), 0);
  
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div className='d-flex'>
            <h3 className='mb-1 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center justify-content-center rounded-3' style={{width: "40px", height:"40px", background:"#0f766e1a"}}>
                <i className='fa-solid fa-receipt text-primary'></i>
              </span>
              <span>My Issued Books</span>
            </h3>
          </div>

          <p className='mt-3'>Welcome {studentUser.full_name || "Guest"}</p>

        </div>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}

        {!loading && (
          <div className="row g-3 mb-4">
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body d-flex align-items-center justify-content-between"> 
                  <div>
                    <p className="text-muted text-uppercase small mb-1">Total Issued Books</p>
                    <h4 className='mb-0'>{totalIssuedBooks}</h4>
                  </div>
                  <span className='d-inline-flex align-items-center justify-content-center rounded-circle' style={{width:"40px", height:"40px", background: "#0f755e1a"}}><i className='fa-solid fa-book-open text-primary'></i></span>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body d-flex align-items-center justify-content-between"> 
                  <div>
                    <p className="text-muted text-uppercase small mb-1">Not Returned</p>
                    <h4 className='mb-0'>{notReturnedCount}</h4>
                  </div>
                  <span className='d-inline-flex align-items-center justify-content-center rounded-circle' style={{width:"40px", height:"40px", background: "#0f755e1a"}}><i className='fa-solid fa-clock text-primary'></i></span>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body d-flex align-items-center justify-content-between"> 
                  <div>
                    <p className="text-muted text-uppercase small mb-1">Total Fine</p>
                    <h4 className='mb-0'>₹{totalFine.toFixed(2)}</h4>
                  </div>
                  <span className='d-inline-flex align-items-center justify-content-center rounded-circle' style={{width:"40px", height:"40px", background: "#0f755e1a"}}><i className='fa-solid fa-coins text-primary'></i></span>
                </div>
              </div>
            </div>
          </div>


        )}

        {!loading && issuedBooks.length === 0 && (
          <div className="text-center my-5">
           <div className="alert alert-info"></div>
           <i className="fa-solid fa-info-circle me-2"></i>No issued books found.
          </div>
        )}
         
        {!loading && issuedBooks.length > 0 && (
          <div className="table-responsive border rounded-3 shadow-sm">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Book Title</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Issue Date</th>
                  <th scope="col">Return Date</th>
                  <th scope="col">Fine</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((issue, index) => (
                  <tr key={issue.id}>
                    <td>{index + 1}</td>
                    <td>{issue.book_title}</td>
                    <td>
                      <span className='badge bg-soft-secondary text-dark border border-secondary-subtle'>{issue.book_isbn}</span>
                    </td>
                    <td>{new Date(issue.issued_at).toLocaleDateString()}</td>
                    
                    <td>{issue.is_returned ? new Date(issue.returned_at).toLocaleDateString() : <span className='text-warning fw-bold'>Not returned yet</span>}</td>
                    
                    <td>₹{issue.fine.toFixed(2)}</td>
                    <td className={issue.is_returned ? 'text-success' : 'text-warning'}>
                      {issue.is_returned ? 'Returned' : 'Not Returned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default StudentIssuedBooks