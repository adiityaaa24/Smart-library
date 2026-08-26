import React , {useState, useEffect} from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const StudentChangePassword = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
    

    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));


    useEffect(() => {
      if(!studentUser){
        navigate("/user/login");
        return;
      }

    },[]);  //empty dependency array means this effect runs only once when the component mounts

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (form.new_password !== form.confirm_password) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      try {
        setSaving(true);
        const res = await axios.post('https://library-management-system-efu0.onrender.com/api/user/change_password/', {
          student_id: studentUser.student_id,
          current_password: form.current_password,
          new_password: form.new_password,
          confirm_password: form.confirm_password
        });
        toast.success(res.data.message || "Password changed successfully.");

        setForm({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });

      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message ||"Failed to change password.");
      } finally {
        setSaving(false);
      }
    };

    
   

  return (
   
    <div className="py-5" style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight:"100vh"}}>
      <div className="container">
        
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className='mb-1 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center justify-content-center rounded-3' style={{width: "40px", height:"40px", background:"#0f766e1a"}}>
                <i className='fa-solid fa-key text-primary'></i>
              </span>
              <span>Change Password</span>
            </h3>

            <p className='text-muted'>Change your account password</p>
          </div>

          <p className='mt-3'>Welcome {studentUser.full_name || "Guest"}</p>

        </div>

        <div className="row justify-content-center">
          <div className="col-md-5">
            
            <div className='card border-0 shadow-sm rounded-4'>
              <div className='card-body p-4'>
                
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label htmlFor="current_password" className='form-label small fw-medium'>Current Password</label>
                    <input type="password" className='form-control' placeholder='Enter current password' required id="current_password"
                      name="current_password" value={form.current_password} onChange={handleChange} />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="new_password" className='form-label small fw-medium'>New Password</label>
                    <input type="password" className='form-control' placeholder='Enter new password' required id="new_password"
                      name="new_password" value={form.new_password} onChange={handleChange} />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="confirm_password" className='form-label small fw-medium'>Confirm Password</label>
                    <input type="password" className='form-control' placeholder='Confirm new password' required id="confirm_password"
                      name="confirm_password" value={form.confirm_password} onChange={handleChange} />
                  </div>
                  <button type="submit" className={`btn ${saving ? "btn-secondary" : "btn-primary"} w-100`} disabled={saving}>
                    {saving ? (
                      <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Changing...</>
                    ) : (
                      <>
                      <i className='fa-solid fa-key'></i>
                      Change Password
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

export default StudentChangePassword;