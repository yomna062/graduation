import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // تأكد من استيراد Link
import axiosInstance from "../Axiosinstance";

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/api/top-doctors/");
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-blue-600 font-semibold">Loading...</div>;
  }

  return (
    <div className="font-bold text-center text-2xl mb-6">
      <h3>Top Rated Doctors</h3>

      <div className="mx-11 px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {doctors.map((doctor) => (
            <Link
              to={`/Doctor-details/${doctor.id}`}
              key={doctor.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  src={doctor.profile_picture}
                  alt={doctor.username}
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-sm px-2 py-1 rounded-lg shadow-md">
                  ⭐{Number.isInteger(doctor.avg_rating) ? doctor.avg_rating : doctor.avg_rating.toFixed(2)}
                </div>
              </div>
              <div className="p-4 text-left">
                <h5 className="text-xl font-semibold text-gray-900">
                  {doctor.first_name} {doctor.last_name}
                </h5>
                <p className=" text-md">{doctor.specialization}</p>
                <p className="text-lg text-gray-500 py-2">
                    {doctor.location.split(" ").slice(0, 2).join(" ")}
                  </p>
                <p className="mt-2 text-2xl font-semibold">{doctor.consultation_price} EGP</p>
                  <Link to={`/Doctor-details/${doctor.id}`} key={doctor.id}>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 text-lg rounded-md hover:bg-blue-700 transition-colors">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;
