import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Star, Check, ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { apiBookAppointment } from "../../api";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

const APPOINTMENT_TYPES = [
  "General Consultation", "Follow-up Visit", "Diagnostic Review",
  "Specialist Consultation", "Annual Checkup",
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function generateCalendarDays(year: number, month: number) {
  return {
    firstDay:    new Date(year, month, 1).getDay(),
    daysInMonth: new Date(year, month + 1, 0).getDate(),
  };
}

export default function BookAppointment() {
  const { user } = useAuth();
  const { doctors, refreshAppointments } = useData();

  const [step,           setStep]           = useState<Step>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate,   setSelectedDate]   = useState<number | null>(null);
  const [selectedTime,   setSelectedTime]   = useState<string | null>(null);
  const [selectedType,   setSelectedType]   = useState<string>("");
  const [carouselStart,  setCarouselStart]  = useState(0);
  const [calYear]                           = useState(new Date().getFullYear());
  const [calMonth,       setCalMonth]       = useState(new Date().getMonth());
  const [loading,        setLoading]        = useState(false);

  const activeDoctors = doctors.filter(d => d.status === "active");
  const cardsPerView  = 3;
  const maxCarousel   = Math.max(0, activeDoctors.length - cardsPerView);

  const { firstDay, daysInMonth } = generateCalendarDays(calYear, calMonth);
  const doctor      = doctors.find(d => d.id === selectedDoctor);

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !doctor || !user) return;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
    setLoading(true);
    try {
      await apiBookAppointment({
        patient_user_id: user.id,
        doctor_user_id:  selectedDoctor,
        date:            dateStr,
        time_slot:       selectedTime,
        type:            selectedType || "General Consultation",
      });
      await refreshAppointments();
      toast.success("Appointment booked successfully!");
      setStep(4);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return !!selectedDoctor;
    if (step === 2) return !!selectedDate;
    if (step === 3) return !!selectedTime;
    return false;
  };

  const StepHeader = () => (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map(s => (
        <React.Fragment key={s}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${s < step ? "bg-[#10B981]" : s === step ? "bg-[#FF6B6B]" : "bg-[#E2E8F0]"}`}>
            {s < step ? <Check className="w-4 h-4 text-white" /> : <span className="text-white" style={{ fontSize: "12px", fontWeight: 700 }}>{s}</span>}
          </div>
          {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${s < step ? "bg-[#10B981]" : "bg-[#E2E8F0]"}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#0F172A]" style={{ fontSize: "22px", fontWeight: 700 }}>Book Appointment</h1>
        <p className="text-[#64748B] mt-0.5" style={{ fontSize: "14px" }}>Schedule your visit in a few simple steps</p>
      </div>

      {/* Step 4: Success */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-[#F1F5F9] p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-[#D1FAE5] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#10B981]" />
          </motion.div>
          <h2 className="text-[#0F172A] mb-2" style={{ fontSize: "24px", fontWeight: 700 }}>Appointment Confirmed!</h2>
          <p className="text-[#64748B] mb-2" style={{ fontSize: "15px" }}>Your appointment has been successfully booked.</p>
          {doctor && (
            <div className="inline-flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-3 mt-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#E6FBF9] flex items-center justify-center overflow-hidden">
                {doctor.avatar
                  ? <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                  : <span className="text-[#2EC4B6] font-bold">{doctor.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>}
              </div>
              <div className="text-left">
                <p className="text-[#0F172A]" style={{ fontSize: "14px", fontWeight: 600 }}>{doctor.name}</p>
                <p className="text-[#64748B]" style={{ fontSize: "12px" }}>
                  {MONTHS[calMonth]} {selectedDate}, {calYear} · {selectedTime}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep(1); setSelectedDoctor(null); setSelectedDate(null); setSelectedTime(null); }}
              className="px-6 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all"
              style={{ fontSize: "14px", fontWeight: 500 }}>
              Book Another
            </button>
          </div>
        </motion.div>
      )}

      {/* Steps 1–3 */}
      {step !== 4 && (
        <motion.div key={`step${step}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          className="bg-white rounded-2xl border border-[#F1F5F9] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="p-6 border-b border-[#F8FAFC]">
            <StepHeader />
            <h3 className="text-[#0F172A]" style={{ fontSize: "18px", fontWeight: 700 }}>
              {step === 1 ? "Choose Your Doctor" : step === 2 ? "Select a Date" : "Select Time Slot"}
            </h3>
            <p className="text-[#64748B] mt-1" style={{ fontSize: "14px" }}>
              {step === 1 ? "Browse available specialists" : step === 2 ? "Pick your preferred date" : "Choose an available time"}
            </p>
          </div>

          <div className="p-6">
            {/* Step 1: Select Doctor */}
            {step === 1 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#64748B]" style={{ fontSize: "13px" }}>{activeDoctors.length} available doctors</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCarouselStart(i => Math.max(0, i - 1))} disabled={carouselStart === 0}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCarouselStart(i => Math.min(maxCarousel, i + 1))} disabled={carouselStart >= maxCarousel}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {activeDoctors.slice(carouselStart, carouselStart + cardsPerView).map(doc => (
                    <motion.div key={doc.id} whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                      onClick={() => setSelectedDoctor(doc.id)}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                        selectedDoctor === doc.id ? "border-[#FF6B6B] bg-[#FFF8F8]" : "border-[#E2E8F0] hover:border-[#FF6B6B]/50"
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#E2E8F0] bg-[#E6FBF9] flex items-center justify-center">
                          {doc.avatar
                            ? <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                            : <span className="text-[#2EC4B6] font-bold">{doc.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>}
                        </div>
                        {selectedDoctor === doc.id && (
                          <div className="w-6 h-6 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[#0F172A]" style={{ fontSize: "15px", fontWeight: 600 }}>{doc.name}</p>
                      <p className="text-[#64748B] mb-3" style={{ fontSize: "12px" }}>{doc.specialization}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{doc.rating}</span>
                        </div>
                        <span className="text-[#94A3B8]" style={{ fontSize: "11px" }}>·</span>
                        <span className="text-[#64748B]" style={{ fontSize: "12px" }}>{doc.experience}y exp</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {doc.availability.slice(0, 3).map(d => (
                          <span key={d} className="text-[10px] px-1.5 py-0.5 bg-[#EEF2FF] text-[#2F5DFF] rounded">{d}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <label className="block text-[#334155] mb-2" style={{ fontSize: "14px", fontWeight: 500 }}>Appointment Type (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {APPOINTMENT_TYPES.map(type => (
                      <button key={type} type="button" onClick={() => setSelectedType(selectedType === type ? "" : type)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${
                          selectedType === type
                            ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]"
                            : "border-[#E2E8F0] text-[#64748B] hover:border-[#FF6B6B]/50"
                        }`}
                        style={{ fontSize: "13px", fontWeight: selectedType === type ? 600 : 400 }}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Date */}
            {step === 2 && (
              <div className="max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCalMonth(m => Math.max(0, m - 1))}
                    className="p-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => setCalMonth(m => Math.min(11, m + 1))}
                    className="p-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS_SHORT.map(d => (
                    <div key={d} className="text-center py-2" style={{ fontSize: "12px", fontWeight: 600, color: "#94A3B8" }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day     = i + 1;
                    const today   = new Date();
                    const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
                    const isPast  = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const isSel   = selectedDate === day;
                    return (
                      <motion.button key={day} type="button"
                        onClick={() => !isPast && setSelectedDate(day)}
                        whileHover={!isPast ? { scale: 1.1 } : {}}
                        whileTap={!isPast ? { scale: 0.95 } : {}}
                        disabled={isPast}
                        className={`aspect-square flex items-center justify-center rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                          isSel   ? "bg-[#FF6B6B] text-white shadow-[0_4px_12px_rgba(255,107,107,0.4)]"
                          : isToday ? "bg-[#FFF0F0] text-[#FF6B6B] border border-[#FF6B6B]"
                          : "hover:bg-[#FFF0F0] text-[#334155]"
                        }`}
                        style={{ fontSize: "13px", fontWeight: isSel || isToday ? 700 : 400 }}>
                        {day}
                      </motion.button>
                    );
                  })}
                </div>
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-[#FFF0F0] border border-[#FFD4D4] rounded-xl flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF6B6B]" />
                    <span className="text-[#EF4444]" style={{ fontSize: "13px", fontWeight: 600 }}>
                      Selected: {MONTHS[calMonth]} {selectedDate}, {calYear}
                    </span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Select Time */}
            {step === 3 && (
              <div>
                <p className="text-[#64748B] mb-4" style={{ fontSize: "13px" }}>
                  {MONTHS[calMonth]} {selectedDate} · {doctor?.name}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const isSel = selectedTime === slot;
                    return (
                      <motion.button key={slot} type="button"
                        onClick={() => setSelectedTime(slot)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                          isSel
                            ? "border-[#FF6B6B] bg-[#FF6B6B] text-white shadow-[0_4px_12px_rgba(255,107,107,0.3)]"
                            : "border-[#E2E8F0] text-[#334155] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
                        }`}
                        style={{ fontSize: "12px", fontWeight: isSel ? 700 : 400 }}>
                        {slot}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-[#F8FAFC] flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => (s - 1) as Step)}
                className="flex items-center gap-2 px-5 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all"
                style={{ fontSize: "14px", fontWeight: 500 }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <motion.button type="button"
                onClick={() => canNext() && setStep(s => (s + 1) as Step)}
                disabled={!canNext()}
                whileHover={canNext() ? { y: -1 } : {}}
                whileTap={canNext() ? { scale: 0.98 } : {}}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#EF4444] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontSize: "14px", fontWeight: 600 }}>
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button type="button"
                onClick={handleBook}
                disabled={!canNext() || loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all disabled:opacity-40"
                style={{ fontSize: "14px", fontWeight: 600 }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...</>
                  : <><CheckCircle className="w-4 h-4" /> Confirm Booking</>}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
