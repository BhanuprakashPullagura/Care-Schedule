// src/pages/MyAppointment.jsx

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf"; //  PDF LIBRARY

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // confirmation popup
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ---------------- PDF DOWNLOAD FUNCTION ----------------
  const downloadPDF = (appt) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("CareSchedule - Medical Prescription", 20, 20);

    doc.setFontSize(12);
    doc.text(`Doctor: ${appt.docData?.name}`, 20, 40);
    doc.text(`Patient: ${appt.userData?.name}`, 20, 50);
    doc.text(`Date: ${appt.slotDate?.replace(/_/g, "/")}`, 20, 60);

    doc.text(`Diagnosis: ${appt.diagnosis || "N/A"}`, 20, 80);
    doc.text(`Prescription: ${appt.prescription || "N/A"}`, 20, 100);
    doc.text(`Notes: ${appt.notes || "N/A"}`, 20, 120);

    doc.save("prescription.pdf");
  };

  // ---------------- PAYMENT FUNCTION (NEW) ----------------
  const handlePayment = async (appt) => {
    try {
      // 1️⃣ Create order
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-order`,
        { amount: appt.amount }
      );

      if (!data.success) {
        toast.error("Order failed");
        return;
      }

      // Razorpay options
      const options = {
        key: "rzp_test_SbI16MtcmWuFkh",
        amount: data.order.amount,
        currency: "INR",
        name: "CareSchedule",
        description: "Appointment Payment",
        order_id: data.order.id,

        handler: async function () {
          // 3️⃣ Verify payment
          const verify = await axios.post(
            `${backendUrl}/api/user/verify-payment`,
            { appointmentId: appt._id }
          );

          if (verify.data.success) {
            toast.success("Payment Successful ✅");
            loadAppointments();
          } else {
            toast.error("Payment failed");
          }
        },
      };

      //  Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error("Payment error");
    }
  };

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
  const confirmCancel = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowModal(true);
  };

  const handleCancelConfirmed = async () => {
    if (!selectedAppointment) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: selectedAppointment },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        loadAppointments();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Error cancelling appointment"
      );
    } finally {
      setShowModal(false);
      setSelectedAppointment(null);
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Appointments</h2>

      {appointments.map((appt) => {
        const isDisabled = appt.cancelled || appt.isCompleted;

        return (
          <div
            key={appt._id}
            className="flex flex-col gap-4 border-b pb-6 pt-4"
          >
            {/* ---------------- TOP SECTION ---------------- */}
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
                </p>

                <p className="text-sm mt-2">
                  <strong>Date & Time:</strong>{" "}
                  {appt.slotDate?.replace(/_/g, "/")} | {appt.slotTime}
                </p>

                {appt.cancelled && (
                  <p className="text-red-600 font-semibold mt-2">Cancelled</p>
                )}

                {appt.isCompleted && (
                  <p className="text-green-600 font-semibold mt-2">
                    Appointment Completed
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 items-end">

                {/* Cancel Button */}
                <button
                  onClick={() => confirmCancel(appt._id)}
                  disabled={isDisabled}
                  className={`px-4 py-2 border rounded text-red-600 ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel Appointment
                </button>

                {/*  PAYMENT BUTTON (NEW) */}
                <button
                  onClick={() => handlePayment(appt)}
                  disabled={appt.payment}
                  className={`px-4 py-2 rounded text-white ${
                    appt.payment ? "bg-gray-400" : "bg-green-600"
                  }`}
                >
                  {appt.payment ? "Paid" : "Pay Now"}
                </button>

              </div>
            </div>

            {/* ---------------- MEDICAL RECORD ---------------- */}
            <div className="mt-2">
              {appt.isCompleted ? (
                <div className="bg-green-50 border border-green-300 p-3 rounded-md">

                  <p className="font-semibold text-green-700 mb-2">
                    Medical Record
                  </p>

                  <p className="text-sm text-gray-700">
                    <b>Diagnosis:</b> {appt.diagnosis || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <b>Prescription:</b> {appt.prescription || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <b>Notes:</b> {appt.notes || "N/A"}
                  </p>

                  <button
                    onClick={() => downloadPDF(appt)}
                    className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Download PDF
                  </button>

                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Medical record not available yet.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* ---------------- CONFIRMATION POPUP ---------------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded">
            <p>Cancel appointment?</p>

            <button onClick={() => setShowModal(false)}>No</button>
            <button onClick={handleCancelConfirmed}>Yes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointment;