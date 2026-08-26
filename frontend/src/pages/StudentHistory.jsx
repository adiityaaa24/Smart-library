import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

const StudentHistory = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");


    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchHistory();
      }
    }, []);

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://library-management-system-efu0.onrender.com/api/admin/student_history/${studentId}/`);
        setStudent(res.data.student);
        setIssues(res.data.issues);
      }
      catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load student history");
      }
      finally{
        setLoading(false);
      }
    }
      
    
    
  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-book-open text-primary"></i>Issued Book History</h4>
              <p className='text-muted small'>
                {student ? `History of ${student.full_name} (ID: ${student.student_id}) - ${student.email}` : "Loading student details..."}
              </p>
            </div>
            <button className='btn btn-outline-primary btn-sm'
            onClick={()=>navigate("/admin/manage_students")}>
              <i className="fa-solid fa-user-pen"></i>Back to Students
            </button>
          </div>
        </div>

         <div className='card border-0 shadow-sm rounded-4'>
            <div className='card-body p-4'>
              <h6 className='fw-semibold mb-3'>Students Listing</h6>

              {loading ? (
                <div className='text-center py-4'>
                  <div className='spinner-border text-primary'>
                  </div>
                </div>
              ) : issues.length === 0 ? (

                    <p className='text-muted small'>No issues found for this student.</p>

                ) : (
                  
                  <div className='table-responsive'>
                    <table className='table table-striped table-hover'>
                      <thead className='small text-muted'>
                        <tr>
                          <th>#</th>
                          <th>Student Id</th>
                          <th>Student Name</th>
                          <th>Issued Book</th>
                          <th>Issued Date</th>
                          <th>Return Date</th>
                          <th>Fine (in Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((issue, index) => (
                        <tr key={issue.id}>
                          <td>{index+1}</td>
                          <td>{issue.student_id}</td>
                          <td>{issue.student_name}</td>
                          <td>{issue.book_title}</td>
                          <td>{new Date(issue.issued_at).toLocaleString()}</td>
                          <td>{issue.is_returned ? new Date(issue.returned_at).toLocaleString() : "Not returned"}</td>
                          <td>{issue.is_returned ? issue.fine : "Not returned yet"}</td>
                          
                          

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

export default StudentHistory