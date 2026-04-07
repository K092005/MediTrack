import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, User, Mail, Lock, Phone, Calendar, Stethoscope, Eye, EyeOff, Heart } from "lucide-react";
import { apiRegister } from "../../api";
import { toast } from "sonner";

type Role = "patient" | "doctor";
type Step = 1 | 2 | 3;

interface FormData {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
  gender: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
  bloodGroup: string;
}

const SPECIALIZATIONS = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "General Medicine", "Psychiatry", "Ophthalmology", "ENT"];
const BLOOD_GROUPS    = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step,         setStep]         = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [form, setForm] = useState<FormData>({
    role: "patient", firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    phone: "", dob: "", gender: "", specialization: "", licenseNumber: "", experience: "", bloodGroup: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (field: keyof FormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.firstName)                                    e.firstName       = "Required";
    if (!form.lastName)                                     e.lastName        = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))  e.email           = "Valid email required";
    if (!form.password || form.password.length < 6)        e.password        = "Min 6 characters";
    if (form.password !== form.confirmPassword)            e.confirmPassword = "Passwords don't match";
    return e;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (!form.phone)  e.phone  = "Required";
    if (!form.dob)    e.dob    = "Required";
    if (!form.gender) e.gender = "Required";
    if (form.role === "doctor") {
      if (!form.specialization) e.specialization = "Required";
      if (!form.licenseNumber)  e.licenseNumber  = "Required";
    } else {
      if (!form.bloodGroup) e.bloodGroup = "Required";
    }
    return e;
  };

  const nextStep = () => {
    const errs = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {};
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(s => Math.min(s + 1, 3) as Step);
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1) as Step);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiRegister({
        name:           `${form.firstName} ${form.lastName}`,
        email:          form.email,
        password:       form.password,
        role:           form.role,
        phone:          form.phone,
        dob:            form.dob,
        gender:         form.gender,
        specialization: form.specialization,
        licenseNumber:  form.licenseNumber,
        experience:     form.experience,
        bloodGroup:     form.bloodGroup,
      });
      toast.success("Account created successfully! Please sign in.");
      navigate("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label, icon: Icon, field, type = "text", placeholder,
  }: { label: string; icon: React.ElementType; field: keyof FormData; type?: string; placeholder?: string }) => (
    <div>
      <label htmlFor={field} className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
        <input
          id={field}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={form[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] placeholder-[#CBD5E1] outline-none transition-all ${
            errors[field] ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF] focus:ring-2 focus:ring-[#2F5DFF]/10"
          }`}
          style={{ fontSize: "14px" }}
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
        />
        {type === "password" && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[field] && (
        <p id={`${field}-error`} className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }} role="alert">
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2F5DFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-[#0F172A]" style={{ fontSize: "26px", fontWeight: 700 }}>Create your account</h2>
          <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>Join MediTrack and streamline your healthcare</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label="Registration Progress">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${s < step ? "bg-[#10B981]" : s === step ? "bg-[#2F5DFF]" : "bg-[#E2E8F0]"}`}
                aria-current={s === step ? "step" : undefined}
              >
                {s < step ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span className="sr-only">Step {s} completed</span>
                  </>
                ) : (
                  <span className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>{s}</span>
                )}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${s < step ? "bg-[#10B981]" : "bg-[#E2E8F0]"}`} aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F1F5F9] p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-[#0F172A] mb-4" style={{ fontWeight: 600 }}>Account Information</h3>
                <div className="flex gap-3 mb-4">
                  {[{ v: "patient" as Role, label: "Patient", icon: User, color: "#FF6B6B" }, { v: "doctor" as Role, label: "Doctor", icon: Stethoscope, color: "#2EC4B6" }].map(r => (
                    <button key={r.v} type="button" onClick={() => set("role", r.v)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${form.role === r.v ? "border-current" : "border-[#E2E8F0]"}`}
                      style={{ borderColor: form.role === r.v ? r.color : undefined, backgroundColor: form.role === r.v ? `${r.color}15` : "transparent" }}>
                      <r.icon className="w-4 h-4" style={{ color: form.role === r.v ? r.color : "#94A3B8" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: form.role === r.v ? r.color : "#64748B" }}>{r.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="First Name" icon={User} field="firstName" placeholder="John" />
                  <InputField label="Last Name"  icon={User} field="lastName"  placeholder="Doe" />
                </div>
                <InputField label="Email Address" icon={Mail} field="email"           type="email"    placeholder="you@example.com" />
                <InputField label="Password"       icon={Lock} field="password"        type="password" placeholder="Min 6 characters" />
                <InputField label="Confirm Password" icon={Lock} field="confirmPassword" type="password" placeholder="Repeat password" />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-[#0F172A] mb-4" style={{ fontWeight: 600 }}>
                  {form.role === "doctor" ? "Professional Details" : "Personal Information"}
                </h3>
                <InputField label="Phone Number"  icon={Phone}    field="phone" placeholder="+1 (555) 000-0000" />
                <InputField label="Date of Birth" icon={Calendar} field="dob"   type="date" />
                <div>
                  <label className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>Gender</label>
                  <div className="flex gap-3">
                    {["Male", "Female", "Other"].map(g => (
                      <button key={g} type="button" onClick={() => set("gender", g)}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all ${form.gender === g ? "border-[#2F5DFF] bg-[#EEF2FF] text-[#2F5DFF]" : "border-[#E2E8F0] text-[#64748B]"}`}
                        style={{ fontSize: "14px", fontWeight: form.gender === g ? 600 : 400 }}>
                        {g}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.gender}</p>}
                </div>
                {form.role === "doctor" ? (
                  <>
                    <div>
                      <label className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>Specialization</label>
                      <select value={form.specialization} onChange={e => set("specialization", e.target.value)}
                        className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] outline-none transition-all ${errors.specialization ? "border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#2F5DFF]"}`}
                        style={{ fontSize: "14px" }}>
                        <option value="">Select specialization</option>
                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.specialization && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.specialization}</p>}
                    </div>
                    <InputField label="License Number"       icon={Stethoscope} field="licenseNumber" placeholder="MED-XXXXXXXX" />
                    <InputField label="Years of Experience"  icon={Calendar}    field="experience"    type="number" placeholder="e.g. 5" />
                  </>
                ) : (
                  <div>
                    <label className="block text-[#334155] mb-1.5" style={{ fontSize: "14px", fontWeight: 500 }}>Blood Group</label>
                    <div className="flex flex-wrap gap-2">
                      {BLOOD_GROUPS.map(bg => (
                        <button key={bg} type="button" onClick={() => set("bloodGroup", bg)}
                          className={`px-4 py-2 rounded-xl border-2 transition-all ${form.bloodGroup === bg ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]" : "border-[#E2E8F0] text-[#64748B]"}`}
                          style={{ fontSize: "13px", fontWeight: form.bloodGroup === bg ? 600 : 400 }}>
                          {bg}
                        </button>
                      ))}
                    </div>
                    {errors.bloodGroup && <p className="text-[#EF4444] mt-1" style={{ fontSize: "12px" }}>{errors.bloodGroup}</p>}
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-[#0F172A] mb-4" style={{ fontWeight: 600 }}>Review Your Information</h3>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name",          value: `${form.firstName} ${form.lastName}` },
                    { label: "Role",          value: form.role.charAt(0).toUpperCase() + form.role.slice(1) },
                    { label: "Email",         value: form.email },
                    { label: "Phone",         value: form.phone },
                    { label: "Date of Birth", value: form.dob },
                    { label: "Gender",        value: form.gender },
                    ...(form.role === "doctor"
                      ? [{ label: "Specialization", value: form.specialization }, { label: "License No.", value: form.licenseNumber }]
                      : [{ label: "Blood Group", value: form.bloodGroup }]),
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-[#F1F5F9]">
                      <span className="text-[#94A3B8]" style={{ fontSize: "14px" }}>{item.label}</span>
                      <span className="text-[#334155]" style={{ fontSize: "14px", fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#F0FFF4] rounded-xl border border-[#86EFAC]">
                  <Heart className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <p className="text-[#16A34A]" style={{ fontSize: "13px" }}>
                    By creating an account you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button type="button" onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all"
                style={{ fontSize: "14px", fontWeight: 500 }}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2F5DFF] text-white rounded-xl hover:bg-[#1E40AF] transition-all"
                style={{ fontSize: "14px", fontWeight: 600 }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button type="button" onClick={handleSubmit} disabled={loading}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all disabled:opacity-70"
                style={{ fontSize: "14px", fontWeight: 600 }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                  : <><Check className="w-4 h-4" /> Create Account</>}
              </motion.button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[#64748B]" style={{ fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/" className="text-[#2F5DFF] hover:text-[#1E40AF]" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
