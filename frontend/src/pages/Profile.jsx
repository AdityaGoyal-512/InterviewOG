import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfile, reset } from '../features/auth/authSlice'

const ROLES = [
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "Full Stack Python",
  "Full Stack Java",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer (AWS/Azure/GCP)",
  "Cybersecurity Engineer",
  "Blockchain Developer",
  "Mobile Developer (iOS/Android)",
  "Game Developer",
  "UI/UX Designer",
  "QA Automation Engineer",
  "Product Manager"
];
const inputBase = 'w-full bg-white/5 border-2 border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm-4 font-semibold text-white text-base transition-all focus:bg-white/10 focus:border-teal-400 outline-none';
const Profile = () => {
  const dispatch = useDispatch();
  const { user, isSuccess, isError, message, isProfileLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredRole: user?.preferredRole || '',
  })

  useEffect(() => {
    if (!isError && !isSuccess) return
    if (isError) toast.error(message)
    if (isSuccess) toast.success('Profile Updated Successfully')
    dispatch(reset())
  }, [isError, isSuccess, message, dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        preferredRole: user?.preferredRole || '',
      });
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name === user.name && formData.preferredRole === user.preferredRole) {
      toast.info('No changes to save.')
      return
    }
    dispatch(updateProfile(formData))
  }
  return (
    <div
      className="relative min-h-screen bg-black overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
     
      <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 -left-40 h-[28rem] w-[28rem] rounded-full bg-teal-500/15 blur-[130px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-24">
        <div className='rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-12 backdrop-blur-xl'>
          <header className='mb-8'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-white'>Edit Profile</h1>
            <p className='text-sm text-slate-400 mt-1'>
              Update your professional details and preferences
            </p>
          </header>

          <form onSubmit={handleSubmit} className='space-y-6' >

            <FormField label="Full Name">
              <input
                type="text"
                className={inputBase}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your name'
              />
            </FormField>

            <FormField label="Email Address (Fixed)" muted>
              <input
                type="email"
                className='w-full bg-white/5 border-2 border-white/5 rounded-xl sm:rounded-2xl p-3.5 sm-4 font-semibold text-slate-500 text-base cursor-not-allowed'
                disabled
                value={formData.email}
                onChange={handleChange}

              />
            </FormField>

             <FormField label="Target Role">
              <div className='relative'>
                <select name="preferredRole" value={formData.preferredRole} onChange={handleChange} className={`${inputBase} appearance-none`}>
                  {
                    ROLES.map((role) => (
                      <option key={role} value={role} className='bg-black text-white'>{role}</option>
                    ))
                  }

                </select>
                <SelectArrow />
              </div>
            </FormField>

            <div className='pt-4'>
              <button
                type='submit'
                disabled={isProfileLoading}
                className={`w-full flex items-center justify-center gap-2 py-4 font-semibold rounded-xl sm:rounded-2xl transition-all active:scale-[0.98] ${isProfileLoading ? 'bg-white/10 text-slate-500 cursor-wait' : 'bg-white text-black hover:bg-slate-200'}`}>
                {
                  isProfileLoading ? <Loader /> : 'Save Changes'
                }
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

function FormField({ label, children, muted }) {

  return (
    <div className={`space-y-1.5 ${muted ? 'opacity-60' : ''}`}>
      <label className='ml-1 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest'>{label}</label>
      {children}
    </div>

  )
}

function SelectArrow() {
  return (
    <div className='absolute right-4 top-1/2  -translate-y-1/2 pointer-events-none text-slate-500'>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  )
}

function Loader() {
  return (
    <>
      <span className='w-5 h-5 border-2 border-slate-500 border-t-transparent animate-spin rounded-full' />
      <span>Saving...</span>
    </>
  )
}