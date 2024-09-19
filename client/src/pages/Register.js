import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import axios  from 'axios'
import {useNavigate} from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast"


const Register = () => {

  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
    

  const handlesubmit = async(e) =>{
    e.preventDefault()
    try {
      const res = await axios.post('/api/v1/auth/register',{email,name,password,role:1}
      );
      if( res.data.success){
        toast.success( res.data.message)
        navigate('/signin')
      }
      else{
        toast.error(res.data.message) 
      }
    } catch (error) {
      console.log(error)
      toast.error('Something Went wrong')
  }
};


  return (
   <>
 <main id='okz'>
  <div className="container">
    <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex justify-content-center py-4">
              <a href="index.html" className="logo d-flex align-items-center w-auto">
                
                <span className="d-none d-lg-block">EKO BUDGET</span>
              </a>
            </div>{/* End Logo */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="pt-0 pb-2">
                  <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                  <p className="text-center small">Enter your personal details to create account</p>
                </div>
                <form onSubmit={handlesubmit} className="row g-3 needs-validation" >
                  <div className="col-12">   
                    <div className="input-group has-validation">
                      <span className="input-group-text" id="inputGroupPrepend">@</span>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" className="form-control" id="yourEmail" required placeholder='Enter Your Email'/>
                    <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                     
                    </div>
                  </div>
                  <div className="col-12">
                    
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" className="form-control" id="yourName" required placeholder='Enter Your Name'/>
                    <div className="invalid-feedback">Please, enter your name!</div>
                  </div>
                
                  <div className="col-12">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" className="form-control" id="yourPassword" required placeholder='Enter Your Password'/>
                    <div className="invalid-feedback">Please enter your password!</div>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" name="terms" type="checkbox" defaultValue id="acceptTerms" required />
                      <label className="form-check-label" htmlFor="acceptTerms">I agree and accept the <a href="#a">terms and conditions</a></label>
                      <div className="invalid-feedback">You must agree before submitting.</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">Create Account</button>
                  <Toaster />

                  </div>
                  <div className="col-12">
                    <p className="small mb-0 pb-2 pt-1">Already have an account? <Link to="/signin">Log in</Link></p>
                  </div>
                </form>
              </div>
            </div>
 
          </div>
        </div>
      </div>
    </section>
  </div>
</main>{/* End #main */}

   </>
  )
}

export default Register