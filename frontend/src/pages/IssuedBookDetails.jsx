import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

const IssuedBookDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [fine, setFine] = useState("");
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchDetails();
      }
    }, []);

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://library-management-system-efu0.onrender.com/api/issued_books/${id}/`);
        setIssue(res.data);
        if(res.data.fine){
          setFine(res.data.fine);
        }
      }
      catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load Issue Book Details")
      }
      finally{
        setLoading(false);
      }
    }

    const handleReturn = async () => {

      if (!fine || fine < 0) {
        toast.error("Please enter a valid fine amount");
        return;
      }
      
      if(!window.confirm("Are you sure you want to return this book?")){
        return;
      }

      

      setReturning(true);
      try {
        const res = await axios.post(`https://library-management-system-efu0.onrender.com/api/return_book/${id}/`, {fine: fine});
        toast.success("Book returned successfully");
        //navigate("/admin/manage_issued_books");
        fetchDetails(); // Refresh the details after returning the book
      }
      catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to return book")
      }
      finally{
        setReturning(false);
      }
    }

    const bookCoverUrl = issue && issue.book_cover ? 
    (issue.book_cover.startsWith("http://") ? issue.book_cover : `https://library-management-system-efu0.onrender.com${issue.book_cover}`)
    : null;


    // if(loading) { 
     if(loading || !issue){  
      return (
        <div className="py-5 d-flex align-items-center justify-content-center" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
          <div className="spinner-border text-primary"></div>
        </div>
      )
    }
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-layer-group text-primary"></i>Issued Book Details</h4>
              <p className='text-muted small'>
                View student and book details, return status and fine information
              </p>
            </div>
            <button className='btn btn-outline-primary btn-sm'
            onClick={()=>navigate("/admin/manage_issued_books")}>
              <i className="fa-solid fa-layer-group"></i>Back to List
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h5 className='fw-semibold mb-3'>Student Details</h5>
                  <hr />
                  <p className="mb-1">
                    <strong>Student Id : </strong> {issue.student_id}
                  </p>

                  <p className="mb-1"><strong>Student Name : </strong> {issue.student_name}
                  </p>

                  <p className="mb-1"><strong> Fine : </strong> {issue.fine ? ` ₹ ${issue.fine}` : "No fine recorded yet"}
                  </p>
                  
                

                  
                </div>
              </div>
          </div>

          <div className='col-md-6'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <h5 classNName='fw-semibold mb-3'>Book Details</h5>
                <hr />
                {bookCoverUrl && (
                  <img src={bookCoverUrl}
                   style={{
                    width: "100px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "15px",
                   }}
                   alt={issue.book_title}
                  />
                )}

                <p className="mb-1">
                    <strong>Book Name : </strong> {issue.book_title}
                  </p>

                  <p className="mb-1"><strong>Book ISBN : </strong> {issue.book_isbn}
                  </p>

                  <p className="mb-1"><strong> Book Issued Date :  </strong> {new Date(issue.issued_at).toLocaleDateString()}
                  </p>

                  <p className="mb-1"><strong> Book Return Date : </strong> {issue.returned_at ? new Date(issue.returned_at).toLocaleDateString() : "Not returned yet"}
                  </p>
                  
              </div>
            </div>
              
              
              <div className='card border-0 shadow-sm rounded-4 mt-2'>
                <div className='card-body p-4'>
                  <h5 className='fw-semibold mb-3'>Return Book</h5>
                  <hr />
                  {issue.is_returned ? (
                    <p className='text-success'>This book has already been returned. Fine : <strong>₹ {issue.fine || 0}</strong></p>
                  ) : (
                    <>
                    <div className='mb-3'>
                      <label className='form-label small fw-medium'>
                        Fine Amount (₹) (if any)
                        
                      </label>
                      <input type="number" className='form-control' value={fine} onChange={(e) => setFine(e.target.value)} placeholder="Enter fine amount e.g. 0 or 100" />
                    </div>

                    <button className='btn btn-primary' onClick={handleReturn} disabled={returning}>
                      {returning ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Returning...
                        </>
                      ) : (
                        <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Return Book
                        </>
                      )}
                    </button>
                    </>
                  )}
                </div>
              </div>
          </div>
        
        
        
        </div>
              
         
          
        
      </div>
    </div>
  )
}

export default IssuedBookDetails