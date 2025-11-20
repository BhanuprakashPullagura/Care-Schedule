// src/pages/Appointment.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol, backendUrl, token, loadDoctorsFromDB } =
    useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const doc = doctors.find((d) => d._id === docId);
    if (doc) {
      setDocInfo({ ...doc, slots_booked: doc.slots_booked || {} });
    }
  };

  const getAvailableSlots = () => {
    if (!docInfo) return;

    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTimeStr = formattedTime;

        const isAvailable =
          !docInfo.slots_booked[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTimeStr);

        if (isAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            slotDate,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    // Defensive checks
    if (!docSlots || docSlots.length === 0) {
      toast.error("No available slots");
      return;
    }
    if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.error("No slots for this day");
      return;
    }

    // If user hasn't clicked a time, pick first available in selected day
    const finalSlotTime = slotTime || docSlots[slotIndex][0].time;
    const dateObj = docSlots[slotIndex][0].datetime;
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime: finalSlotTime,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked");

        // refresh data
        if (typeof loadDoctorsFromDB === "function") {
          await loadDoctorsFromDB();
        }

        // navigate to my appointments
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("bookAppointment error:", error);
      toast.error(error?.response?.data?.message || error.message || "Error");
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (!docInfo) return <div className="p-6">Loading doctor...</div>;

  return (
    <div>
      {/* Doctor details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt=""
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name} <img src={assets.verified_icon} alt="" />
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          <p className="text-sm text-gray-600 max-w-[700px] mt-3">{docInfo.about}</p>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currencySymbol} {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>

        {/* Days Scroll */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div
              onClick={() => {
                setSlotIndex(index);
                // reset slotTime so if user moves day they need to pick (or first will be used)
                setSlotTime("");
              }}
              key={index}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-[#B4B4B4]"
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  );
};

export default Appointment;
