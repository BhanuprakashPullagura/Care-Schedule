import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)

  // State for delete confirmation popup
  const [showPopup, setShowPopup] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  // Handle delete click (show popup)
  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor)
    setShowPopup(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    deleteDoctor(selectedDoctor._id)
    setShowPopup(false)
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll relative'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group'
            key={index}
          >
            <img
              className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500'
              src={item.image}
              alt=""
            />

            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>

              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDeleteClick(item)}
                className='mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600 duration-200'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50'>

          <div className='bg-white p-5 rounded-lg shadow-xl w-80'>
            <h2 className='text-lg font-semibold text-center'>
              Confirm Delete
            </h2>

            <p className='text-sm text-gray-600 mt-2 text-center'>
              Are you sure you want to delete <br />
              <span className='font-bold text-red-600'>{selectedDoctor?.name}</span>?
            </p>

            <div className='flex justify-center gap-3 mt-4'>
              
              <button
                onClick={confirmDelete}
                className='bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 duration-200'
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className='bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 duration-200'
              >
                Cancel
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default DoctorsList
