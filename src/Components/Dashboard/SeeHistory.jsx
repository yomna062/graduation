import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../Axiosinstance';

function SeeHistory() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(`api/patients/${id}/history/`);
                setHistory(response.data);
                console.log("History response:", response.data);
            } catch (error) {
                console.log(error);
                setError("Failed to load patient history")
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [id])

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Medical History</h2>

                {history.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No medical history found for this patient</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((record) => (
                            <div 
                                key={record.id} 
                                className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Dr. {record.doctor_username || "Unknown"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {record.patient_username ? `Patient: ${record.patient_username}` : ""}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500 text-right">
                                        {formatDate(record.created_at)}
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Notes:</h4>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {record.notes || "No notes available"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SeeHistory