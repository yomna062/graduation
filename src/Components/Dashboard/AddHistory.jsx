import { useFormik } from 'formik';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import axiosInstance from '../Axiosinstance';
import toast from 'react-hot-toast';

function AddHistory() {
  const navigate = useNavigate();
  const {id} = useParams()
  const validationSchema = Yup.object({
    notes: Yup.string()
      .required('Notes are required')
      .min(10, 'Notes must be at least 10 characters')
  });

  async function handleSubmit(values) {
    try {
      const response = await axiosInstance.post(`api/patients/${id}/add-history/` , values);
      formik.resetForm();
      toast.success('History added successfully');
      navigate('/panel')
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      notes: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Patient History</h2>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="notes" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Medical Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="6"
              placeholder="Enter detailed patient notes, observations, diagnosis, or treatment information..."
              className={`w-full px-4 py-3 rounded-lg border ${
                formik.touched.notes && formik.errors.notes 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } shadow-sm transition duration-150 ease-in-out`}
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.notes && formik.errors.notes && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.notes}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Save History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHistory;