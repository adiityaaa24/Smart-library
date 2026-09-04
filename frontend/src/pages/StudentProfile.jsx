import React , {useState, useEffect} from 'react'
import api from "../api";   
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    student_id: "",
    full_name: "",
    mobile: "",
    email: "",
  });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
      if(!studentUser){
        navigate("/user/login");
        return;
      }

        const fetchProfile = async () => {
            setLoading(true);
            try {
               
                const res = await api.get('/api/user/profile/');
                setProfile({
                  student_id: res.data.student_id,
                  full_name: res.data.full_name,
                  mobile: res.data.mobile,
                  email: res.data.email,
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    },[]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setSaving(true);
        
        const res = await api.put('/api/user/profile/', {
          full_name: profile.full_name,
          mobile: profile.mobile,
        });
        toast.success("Profile updated successfully.");

        const updatedUser = {
          ...studentUser,
          full_name: profile.full_name,
        };
        localStorage.setItem("studentUser", JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile.");
      } finally {
        setSaving(false);
      }
    };

    if(loading){
      return (
        <div className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
   

  return (
   
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className='mb-1 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center justify-content-center rounded-3' style={{width: "40px", height:"40px", background:"#0f766e1a"}}>
                <i className='fa-solid fa-user-graduate text-primary'></i>
              </span>
              <span>My Profile</span>
            </h3>

            <p className='text-muted'>Manage your personal information </p>
          </div>

          <p className='mt-3'>Welcome {studentUser.full_name || "Guest"}</p>

        </div>

        <div className='row justify-content-center'>
          <div className='col-md-7'>
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label htmlFor="student_id" className='form-label '>Student ID</label>
                    <input type="text" name="student_id" id="student_id" className='form-control bg-light' value={profile.student_id} readOnly />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="full_name" className='form-label '>Full Name</label>
                    <input type="text" name="full_name" id="full_name" className='form-control' value={profile.full_name} onChange={handleChange} />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="email" className='form-label '>Email</label>
                    <input type="email" name="email" id="email" className='form-control bg-light' value={profile.email} onChange={handleChange} readOnly />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="mobile" className='form-label '>Mobile Number</label>
                    <input type="number" name="mobile" id="mobile" className='form-control'  value={profile.mobile} onChange={handleChange} />
                  </div>
                  <button type="submit" className={`btn ${saving ? "btn-secondary" : "btn-primary"} w-100`} disabled={saving}>
                    {saving ? (
                      <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...</>
                    ) : (
                      <>
                      <i className='fa-solid fa-save'></i>
                      Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
    
  )
}

export default StudentProfile