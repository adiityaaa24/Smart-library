import React , {useState, useEffect} from 'react'
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ManageIssuedBooks = () => {
  const [issues, setIssues] = useState([]);
    
    const [loadingList, setLoadingList] = useState(false);
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchIssues();
      }
    }, []);

    const fetchIssues = async () => {
      setLoadingList(true);
      try {
        const res = await api.get("/api/admin/issued_books/");
        setIssues(res.data);
      }
      catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load Issues")
      }
      finally{
        setLoadingList(false);
      }
    }
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-layer-group text-primary"></i>Manage Issued Books</h4>
              <p className='text-muted small'>
                View all issued books, their status, and return details
              </p>
            </div>
            <button className='btn btn-primary btn-sm'
            onClick={()=>navigate("/admin/issue_book")}>
              <i className="fa-solid fa-book"></i>Issue New Book
            </button>
          </div>
        </div>

        
              <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h6 className='fw-semibold mb-3'>Issued Books Listing</h6>

                  {loadingList ? (
                    <div className='text-center py-4'>
                      <div className='spinner-border text-primary'>
                      </div>
                    </div>
                  ) : issues.length === 0 ? (

                        <p className='text-muted small'>No Issued books found</p>

                    ) : (
                     
                      <div className='table-responsive'>
                        <table className='table table-striped table-hover'>
                          <thead className='small text-muted'>
                            <tr>
                              <th>#</th>
                              <th>Student Id</th>
                              <th>Student Name</th>
                              <th>Book Name</th>
                              <th>ISBN</th>
                              <th>Issued Date</th>
                              <th>Return Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {issues.map((issue, index) => (
                            <tr key={issue.id}>
                              <td>{index+1}</td>
                              <td>{issue.student_id}</td>
                              <td>{issue.student_name}</td>
                              <td>{issue.book_title}</td>
                              <td>{issue.book_isbn}</td>
                              <td>{new Date(issue.issued_at).toLocaleDateString()}</td>
                              <td>{issue.is_returned ? new Date(issue.returned_at).toLocaleDateString() :
                              <span className="badge bg-danger"> Not Returned Yet</span>}</td>
                             <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={()=>navigate(`/admin/issued_books/${issue.id}`)}>
                                <i className='fa-solid fa-pen-to-square me-1'></i>Details / Return
                              </button>
                             </td>

                            </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  
                  
                </div>
              </div>
         
          
        
      </div>
    </div>
  )
}

export default ManageIssuedBooks