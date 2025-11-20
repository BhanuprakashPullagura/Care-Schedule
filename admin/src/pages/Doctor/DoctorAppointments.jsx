import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, backendUrl } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  // ⭐ NEW STATES FOR PRESCRIPTION POPUP
  const [showPresPopup, setShowPresPopup] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [prescriptionText, setPrescriptionText] = useState("")

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // ⭐ NEW — Submit prescription to backend
  const submitPrescription = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/add-prescription`,
        {
          appointmentId: selectedAppointmentId,
          prescription: prescriptionText
        },
        {
          headers: { dtoken: dToken }
        }
      );

      if (data.success) {
        toast.success("Prescription Added");
        setShowPresPopup(false);
        getAppointments();  // refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error saving prescription");
      console.log(error);
    }
  };

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1.5fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Prescription</p>
        </div>

        {appointments.map((item, index) => (
          <div 
            className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base 
            sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1.5fr] 
            gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' 
            key={index}
          >
            <p className='max-sm:hidden'>{index+1}</p>

            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> 
              <p>{item.userData.name}</p>
            </div>

            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <p>{currency}{item.amount}</p>

            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex items-center'>
                    <img 
                      onClick={() => cancelAppointment(item._id)} 
                      className='w-10 cursor-pointer' 
                      src={assets.cancel_icon} 
                      alt="" 
                    />
                    <img 
                      onClick={() => completeAppointment(item._id)} 
                      className='w-10 cursor-pointer' 
                      src={assets.tick_icon} 
                      alt="" 
                    />
                  </div>
            }

            {/* ⭐ Add / Edit Prescription Button */}
            <button
              className='text-blue-600 underline text-sm'
              onClick={() => {
                setSelectedAppointmentId(item._id);
                setPrescriptionText(item.prescription || "");
                setShowPresPopup(true);
              }}
            >
              {item.prescription ? "Edit" : "Add"} Prescription
            </button>

          </div>
        ))}
      </div>

      {/* ⭐ POPUP UI */}
      {showPresPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded w-96 shadow-lg'>
            <h2 className='text-lg font-semibold mb-3'>Write Prescription</h2>

            <textarea
              className='w-full h-40 border p-2 rounded'
              placeholder='Enter prescription details...'
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
            ></textarea>

            <div className='flex justify-end mt-3 gap-2'>
              <button
                className='px-4 py-1 rounded bg-gray-300'
                onClick={() => setShowPresPopup(false)}
              >
                Cancel
              </button>

              <button
                className='px-4 py-1 rounded bg-blue-600 text-white'
                onClick={submitPrescription}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorAppointments
