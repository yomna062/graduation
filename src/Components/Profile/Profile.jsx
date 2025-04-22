import React, { useEffect, useState } from "react";
import axiosInstance from "../Axiosinstance";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    profile_picture: "",
    is_doctor: false,
    location: "",
    age: "",
    bio: "",
    consultation_price: "",
    role: "",
    is_approved: false,
    gender: "",
    specialization: "",
    bonus_points: 0,
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/api/profile/")
      .then((res) => {
        const updatedProfile = res.data;
        if (updatedProfile.role !== "doctor") {
          updatedProfile.location = "";
          updatedProfile.consultation_price = "";
        }
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profile_picture: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("is_doctor", profile.is_doctor);
    formData.append("role", profile.role || "Patient");
    formData.append("is_approved", profile.is_approved);

    let hasChanges = false;

    const fieldsToCompare = [
      "username",
      "phone_number",
      "first_name",
      "last_name",
      "age",
      "bio",
      "location",
      "consultation_price"
    ];

    fieldsToCompare.forEach((field) => {
      if (profile[field] !== originalProfile?.[field]) {
        hasChanges = true;
        if (profile[field] !== undefined && profile[field] !== null) {
          formData.append(field, profile[field]);
        }
      }
    });

    if (image) {
      formData.append("profile_picture", image);
      hasChanges = true;
    }

    if (!hasChanges) {
      Swal.fire({
        icon: "info",
        title: "No changes detected",
        text: "You haven't made any changes to your profile.",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/api/profile/", formData);
      setProfile(response.data);
      setOriginalProfile(response.data);

      if (response.data.profile_picture) {
        const userData = JSON.parse(localStorage.getItem("user")) || {};
        userData.profileImage = response.data.profile_picture;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        showConfirmButton: false,
        timer: 1500,
      });

      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.detail || "Something went wrong",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-10 px-5">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-blue-600 text-center">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <label
                  htmlFor="profile_picture"
                  className="bg-gray-100 px-4 py-2 rounded-md text-blue-600 font-medium cursor-pointer hover:bg-gray-200 transition"
                >
                  Edit Profile Image
                </label>
                <input
                  id="profile_picture"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 text-gray-500 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={profile.phone_number || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {profile.role === "doctor" && (
                <>
                  <div>
                    <label className="block mb-1 text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-700">Consultation Price</label>
                    <input
                      type="number"
                      name="consultation_price"
                      value={profile.consultation_price || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-700">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={profile.specialization || ""}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 text-gray-500 p-2 rounded-lg"
                    />
                  </div>
                </>
              )}

              {profile.role === "patient" && (
                <>
                  <div>
                    <label className="block mb-1 text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profile.age || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-700">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      value={profile.gender || ""}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 text-gray-500 p-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-700">Bonus Points</label>
                    <input
                      type="number"
                      name="bonus_points"
                      value={profile.bonus_points || 0}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 text-gray-500 p-2 rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={profile.role || ""}
                disabled
                className="w-full border border-gray-300 bg-gray-100 text-gray-500 p-2 rounded-lg"
              />
            </div>

            {profile.role === "doctor" && (
              <div>
                <label className="block mb-1 text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
