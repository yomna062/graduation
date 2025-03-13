import React, { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import Swal from "sweetalert2";
import slidimg from "../../assets/images/doc2.png";
import axiosInstance from "./../Axiosinstance";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [doctorsList, setDoctorsList] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

// ✅ دالة تحديث الـ token
    // const tryRefreshToken = async () => {
    //     const refreshToken = localStorage.getItem("refresh");
    //     if (!refreshToken) return handleLogout(); // 🔴 تسجيل الخروج لو الـ refresh token مفقود

                // const response = await axiosInstance.get("/All_doctors/", {
                //     headers: { Authorization: `Bearer ${token}` },
                // });

    //         if (response.status === 200) {
    //             const data = response.data;
    //             localStorage.setItem("token", data.token);
    //             console.log("✅ Token refreshed:", data.token);
    //             return data.token;
    //         } else {
    //             throw new Error("Failed to refresh token");
    //         }
    //     } catch (err) {
    //         console.error("❌ Error refreshing token:", err);
    //         handleLogout(); // 🔴 تسجيل الخروج لو التحديث فشل
    //     }
    // };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            let token = localStorage.getItem("token");
            // console.log("🔹 Current Token:", token);

            let response = await axiosInstance.get("/All_doctors/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // if (response.status === 401) {
            //     console.warn("⚠️ Token expired — trying to refresh");
            //     token = await tryRefreshToken(); // ✅ تحديث التوكن
            //     if (token) {
            //         response = await axiosInstance.get("/All_doctors/", {
            //             headers: { Authorization: `Bearer ${token}` },
            //         });
            //     }
            // }

            if (response.data && response.data.results) {
                setDoctorsList(response.data.results);
                setError("");
            } else {
                setError("⚠️ No doctors found.");
            }
        } catch (err) {
            console.error("⚠️ Error fetching doctors:", err.response ? err.response.data : err.message);
            setError("⚠️ Failed to fetch doctors.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                setSearching(true);
                const filtered = doctorsList.filter((doctor) =>
                    doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredDoctors(filtered);
                setSearching(false);
            } else {
                setFilteredDoctors([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, doctorsList]);

    const selectDoctor = (name) => {
        setSearchTerm(name);
        setFilteredDoctors([]);
        onSearch(name);
    };

    // ✅ دالة تسجيل الخروج
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const handleSearchClick = () => {
        const isLoggedIn = localStorage.getItem("token");
        if (!isLoggedIn) {
            Swal.fire({
                title: "🔐 Login Required!",
                text: "You need to log in or register to search for doctors.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Register",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#28a745",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = "/register";
                }
            });
        }
    };

    return (
        <div className="relative h-[350px] w-full overflow-hidden">
            <img src={slidimg} alt="sliderimg" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <h3 className="text-2xl font-bold">Search For the Doctor</h3>
                <p className="text-center max-w-md">
                    Search by name or specialization, <br />
                    or chat with our chatbot for recommendations.
                </p>

                <div className="relative w-full max-w-md mt-4">
                    <div className="flex items-center bg-white rounded-full shadow-md p-2 w-full">
                        <AiOutlineUser className="text-2xl text-gray-600 ml-2" />
                        <input
                            type="text"
                            placeholder="Doctor’s Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={handleSearchClick}
                            className="flex-1 outline-none text-gray-600"
                            aria-label="Search for a doctor by name"
                        />
                        <div className="circle py-3 px-4 text-white rounded-full">
                            <i className="fa-solid fa-magnifying-glass" />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    {searching && <p className="text-gray-400 text-center mt-2">Searching...</p>}
                    {loading && <p className="text-white mt-2">Loading doctors...</p>}

                    {filteredDoctors.length > 0 && (
                        <ul className="absolute w-full bg-white shadow-md rounded-lg mt-2 z-50 max-h-60 overflow-y-auto">
                            {filteredDoctors.map((doctor) => (
                                <li
                                    key={doctor.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                                    onClick={() => selectDoctor(doctor.username)}
                                >
                                    {doctor.username} - {doctor.specialization}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
