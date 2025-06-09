import React, { useEffect, useState } from "react";
import axiosInstance from '../Axiosinstance'; // مسار ملف axiosInstance
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

export default function Bounce() {
  const [bonusPoints, setBonusPoints] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(5);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [pharmacies] = useState(["El Ezaby", "El said", "El Araby", "El Shifa"]);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.bonus_points) {
      setBonusPoints(user.bonus_points);
    }
  }, []);

  const handleClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to use your bonus.",
      });
      return;
    }

    const neededPoints = selectedDiscount * 5; // كل 1% = 5 نقاط

    if (bonusPoints < neededPoints) {
      Swal.fire({
        icon: "error",
        title: "Not Enough Points",
        text: `You need ${neededPoints} points for ${selectedDiscount}% discount.`,
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/generate-temporary-coupon/", {
        points: neededPoints,
      });

      if (response.data.message === "done create coupon code") {
        const discountCode = response.data.coupon_code;
        const remainingBonus = response.data.remaining_bonus;

        setCouponCode(discountCode);
        setBonusPoints(remainingBonus);
        setCodeGenerated(true);

        const updatedUser = { ...user, bonus_points: remainingBonus };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        Swal.fire({
          icon: "success",
          title: "Discount Code Created!",
          html: `<strong>${selectedDiscount}%</strong> discount code: <br/><code>${discountCode}</code>`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to communicate with the API.",
      });
      console.error("API error:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    Swal.fire({
      icon: "info",
      title: "Copied!",
      text: "Coupon code copied to clipboard.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <>
      <Helmet>
        <title>Bonus</title>
      </Helmet>

      <div className="flex items-center justify-center h-screen flex-col space-y-6">
        <div className="text-xl font-semibold text-blue-800">
          Your Bonus Points: <span className="text-green-600">{bonusPoints}</span>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-lg text-blue-700 mb-2">Select Discount %</label>
          <select
            value={selectedDiscount}
            onChange={(e) => setSelectedDiscount(parseInt(e.target.value))}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            {Array.from({ length: 6 }, (_, i) => (i + 1) * 5).map((value) => (
              <option key={value} value={value}>
                {value}% ({value * 5} points)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleClick}
          className="bg-green-500 px-6 py-3 rounded-full text-white text-xl hover:bg-green-600 transition"
        >
          Use Bonus Now 🎁
        </button>

        {codeGenerated && (
          <div className="text-center bg-blue-100 p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-xl font-bold text-green-700 mb-2">🎉 Discount Code Created!</h2>
            <p className="text-lg mb-1">Discount: {selectedDiscount}%</p>
            <p className="text-lg mb-1">
              Code:{" "}
              <span className="font-mono text-blue-700">{couponCode}</span>
            </p>
            <button
              onClick={copyToClipboard}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              Copy Code 📋
            </button>
            <p className="text-md text-gray-700 mt-3">
              You can use this code at these pharmacies:
            </p>
            <ul className="list-disc list-inside text-left text-gray-800">
              {pharmacies.map((pharmacy, index) => (
                <li key={index}>{pharmacy} Pharmacy</li>
              ))}
            </ul>
          </div>
        )}

       
           
        
      
      </div>
    </>
  );
}
