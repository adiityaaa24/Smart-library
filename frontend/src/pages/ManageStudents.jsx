import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
    
    const [loadingList, setLoadingList] = useState(false);
    
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
      if(!adminUser) {
        navigate("/admin/login");
      } 
      else {
        fetchStudents();
      }
    }, []);

    const fetchStudents = async () => {
      setLoadingList(true);
      try {
        const res = await axios.get("https://library-management-system-efu0.onrender.com/api/admin/students/");
        setStudents(res.data);
      }
      catch(err){
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load Students")
      }
      finally{
        setLoadingList(false);
      }
    }


    const handleToggleStatus = async (student) => {
      const isCurrentlyActive = student.is_active;
      const url = isCurrentlyActive ? `https://library-management-system-efu0.onrender.com/api/admin/block_student/${student.id}/` : `https://library-management-system-efu0.onrender.com/api/admin/activate_student/${student.id}/`;

      const confirmMessage = isCurrentlyActive ? `Are you sure you want to block ${student.full_name}?` : `Are you sure you want to activate ${student.full_name}?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }
      try {
        const res = await axios.put(url);
        fetchStudents(); // Refresh the list after status change
        toast.success(res.data.message || "Status updated successfully");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to update status");
      }
    };
    

  return (
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8 mx-auto d-flex justify-content-between align-items-center">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-layer-group text-primary"></i>Manage Students</h4>
              <p className='text-muted small'>
                View all registered students, block or activate Students.
              </p>
            </div>
            <button className='btn btn-outline-primary btn-sm'
            onClick={()=>navigate("/admin/manage_issued_books")}>
              <i className="fa-solid fa-book"></i>Issued Books
            </button>
          </div>
        </div>

        
              <div className='card border-0 shadow-sm rounded-4'>
                <div className='card-body p-4'>
                  <h6 className='fw-semibold mb-3'>Students Listing</h6>

                  {loadingList ? (
                    <div className='text-center py-4'>
                      <div className='spinner-border text-primary'>
                      </div>
                    </div>
                  ) : students.length === 0 ? (

                        <p className='text-muted small'>No Students found. Register a student first</p>

                    ) : (
                     
                      <div className='table-responsive'>
                        <table className='table table-striped table-hover'>
                          <thead className='small text-muted'>
                            <tr>
                              <th>#</th>
                              <th>Student Id</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Mobile</th>
                              <th>Reg Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, index) => (
                            <tr key={student.id}>
                              <td>{index+1}</td>
                              <td>{student.student_id}</td>
                              <td>{student.full_name}</td>
                              <td>{student.email}</td>
                              <td>{student.mobile}</td>
                              <td>{new Date(student.created_at).toLocaleDateString()}</td>
                              <td>{student.is_active ? 
                                    (
                                      <span className='badge bg-success-subtle text-success border border-success-subtle'>Active</span>
                                    ) : 
                                    (
                                      <span className='badge bg-secondary-subtle text-secondary border border-secondary-subtle'>Inactive</span>
                                    )}</td>
                              
                              <td className='text-center d-flex'>
                                <button className={student.is_active ? "btn btn-sm btn-outline-danger me-2" : "btn btn-sm btn-outline-success me-2"}
                                onClick={() => handleToggleStatus(student)}>{student.is_active ? (
                                  <>
                                  <i className='fa-solid fa-user-slash me-1'></i>Block
                                  </>
                                ) : (
                                  <>
                                  <i className='fa-solid fa-user-check me-1'></i>Activate
                                  </>
                                )}
                                </button>

                                <button className='btn btn-sm btn-success' onClick={() => navigate(`/admin/student/${student.student_id}/history`)}>
                                  <i className='fa-solid fa-eye me-1'></i>Details
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

export default ManageStudents