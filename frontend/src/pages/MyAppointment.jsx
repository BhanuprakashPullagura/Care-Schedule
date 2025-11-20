// src/pages/MyAppointment.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD APPOINTMENTS ----------------
  const loadAppointments = async () => {
    if (!token) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CANCEL APPOINTMENT ----------------
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        loadAppointments(); // refresh updated list
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Error cancelling appointment"
      );
    }
  };

  // LOAD ON TOKEN CHANGE
  useEffect(() => {
    loadAppointments();
  }, [token]);

  // ---------------- UI STATES ----------------
  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!appointments.length)
    return <div className="p-6 text-center">No appointments found.</div>;

  // ---------------- RENDER LIST ----------------
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Appointments</h2>

      {appointments.map((appt) => (
        <div
          key={appt._id}
          className="flex flex-col gap-4 border-b pb-6 pt-4"
        >
          {/* TOP SECTION */}
          <div className="flex items-start gap-6">
            {/* Doctor Image */}
            <div className="w-28 h-28 bg-[#F3F7FF] rounded-lg overflow-hidden">
              <img
                src={appt.docData?.image || "/placeholder.png"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Appointment Details */}
            <div className="flex-1">
              <p className="font-medium text-lg">{appt.docData?.name}</p>
              <p className="text-sm text-gray-600">
                {appt.docData?.speciality}
              </p>

              <p className="text-sm mt-2">
                <strong>Address:</strong>{" "}
                {appt.docData?.address?.line1 || "N/A"}
                {appt.docData?.address?.line2
                  ? `, ${appt.docData.address.line2}`
                  : ""}
              </p>

              <p className="text-sm mt-2">
                <strong>Date & Time:</strong>{" "}
                {appt.slotDate?.replace(/_/g, "/")} | {appt.slotTime}
              </p>

              {appt.cancelled && (
                <p className="text-red-600 font-semibold mt-2">Cancelled</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => handleCancel(appt._id)}
                disabled={appt.cancelled}
                className={`px-4 py-2 border rounded text-red-600 ${
                  appt.cancelled ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Cancel Appointment
              </button>
            </div>
          </div>

          {/* ⭐ PRESCRIPTION SECTION */}
          <div className="mt-2">
            {appt.prescription && appt.prescription.trim() !== "" ? (
              <div className="bg-green-50 border border-green-300 p-3 rounded-md">
                <p className="font-semibold text-green-700 mb-1">
                  Prescription:
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {appt.prescription}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No prescription added yet.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointment;
