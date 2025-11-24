import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]); // array of arrays (7 days)
  const [slotIndex, setSlotIndex] = useState(0); // selected day index (0..6)
  const [slotTime, setSlotTime] = useState(""); // selected time string e.g. "10:30 AM"

  const fetchDocInfo = async () => {
    const doc = doctors.find((d) => d._id === docId);
    setDocInfo(doc || null);
  };

  // round date up to next 30-minute boundary (if it's exactly on boundary, keep it)
  const roundUpToNext30 = (date) => {
    const dt = new Date(date);
    const minutes = dt.getMinutes();
    const remainder = minutes % 30;
    if (remainder === 0) return dt; // already on boundary
    dt.setMinutes(minutes + (30 - remainder));
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    return dt;
  };

  // generate available slots for next 7 days (10:00 -> 21:00, 30-min intervals)
  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();
    const slotsForWeek = [];

    for (let i = 0; i < 7; i++) {
      // create start and end for this day
      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() + i);
      dayStart.setHours(10, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(21, 0, 0, 0); // exclusive end (stop when slot >= dayEnd)

      // if this is today, ensure we start from next available 30-min slot after now
      if (
        dayStart.getFullYear() === today.getFullYear() &&
        dayStart.getMonth() === today.getMonth() &&
        dayStart.getDate() === today.getDate()
      ) {
        const nowRounded = roundUpToNext30(today);
        // start from max(dayStart, nowRounded)
        if (nowRounded > dayStart) dayStart.setTime(nowRounded.getTime());
      }

      const timeSlots = [];
      const slotDateKeyParts = {
        day: dayStart.getDate(),
        month: dayStart.getMonth() + 1, // use 1-based month for keys
        year: dayStart.getFullYear(),
      };
      const slotDateKey = `${slotDateKeyParts.day}_${slotDateKeyParts.month}_${slotDateKeyParts.year}`;

      // iterate in 30-min increments
      const current = new Date(dayStart);
      while (current < dayEnd) {
        const formattedTime = current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Guard `slots_booked` existence before checking includes
        const bookedForDay =
          docInfo.slots_booked && docInfo.slots_booked[slotDateKey]
            ? docInfo.slots_booked[slotDateKey]
            : [];

        const isBooked = bookedForDay.includes(formattedTime);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(current),
            time: formattedTime,
          });
        }

        // next slot +30 min
        current.setMinutes(current.getMinutes() + 30);
      }

      slotsForWeek.push(timeSlots);
    }

    setDocSlots(slotsForWeek);
    // reset selection to first day if there are no slots for previously selected index
    setSlotIndex((prevIndex) =>
      slotsForWeek[prevIndex] && slotsForWeek[prevIndex].length > 0
        ? prevIndex
        : 0
    );
    setSlotTime("");
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.warn("Please select a valid date slot");
      return;
    }

    // find exact selected slot object for datetime
    const selectedSlot = docSlots[slotIndex].find((s) => s.time === slotTime);
    if (!selectedSlot) {
      toast.warn("Selected slot not found. Please choose another slot.");
      return;
    }

    try {
      const date = selectedSlot.datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data?.success) {
        toast.success(data.message || "Appointment booked");
        getDoctorsData?.();
        navigate("/my-appointments");
      } else {
        toast.error(data?.message || "Failed to book appointment");
      }
    } catch (error) {
      // prefer structured error messages
      toast.error(error?.response?.data?.message || error.message || "Error");
    }
  };

  useEffect(() => {
    fetchDocInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docInfo]);

  // console.log for debugging only
  // console.log("docSlots", docSlots);

  return (
    docInfo && (
      <div>
        {/* Doctor Detail */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg "
              src={docInfo.image}
              alt={`${docInfo.name}`}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee :{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll [&::-webkit-scrollbar]:hidden mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime("");
                  }}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5f6FFF] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] ? daysOfWeek[item[0].datetime.getDay()] : "-"}</p>
                  <p>{item[0] ? item[0].datetime.getDate() : "-"}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll [&::-webkit-scrollbar]:hidden mt-4">
            {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5f6FFF] text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6  shadow-md hover:bg-[#4a56e0] transition-colors duration-200"
          >
            Book an appointment
          </button>
        </div>

        {/* listing RelatedDoctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
