import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login, googleLogin, reset } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset())
    }

    if (isSuccess || user) {
      navigate('/');
      dispatch(reset())
    }


  }, [user, isError, isSuccess, message, navigate, dispatch])



  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {

      email,
      password
    }
    dispatch(login(userData))

  }

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential))
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-black'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white'></div>
      </div>
    )
  }

  return (
    <div
      className="relative flex justify-center items-center min-h-[90vh] overflow-hidden bg-black px-4 py-10"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >

      {/* ambient corner glows, purely decorative */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-teal-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 sm:p-10 shadow-2xl backdrop-blur-xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Log in</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed px-2">
            Log in to your account
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.51 7.12" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email address"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-white/30 focus:bg-white/10"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-white/30 focus:bg-white/10"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3.5 rounded-full font-semibold text-sm mt-3 transition-all hover:bg-slate-200 active:scale-[0.98]"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            theme="filled_black"
            size="large"
            width="100%"
            text="continue_with"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Didn't have an account? <Link to="/register" className="text-white font-semibold hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  )
}

export default Login