import React, { useState, useEffect } from "react";
import axios from "axios";

import EditModal from "./EditModal";
import ConfirmationModal from "./ConfirmationModal";

const StudentTable = ({ refreshKey }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Fetch students data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/students/get_all_students"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on initial render
  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // Fetch student details by ID for editing
  const fetchStudentById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/students/get_student_by_id/${id}`
      );
      setCurrentStudent(response.data);
      setIsModalOpen(true); // Open the modal with fetched data
    } catch (error) {
      console.error("Error fetching student by ID: " + id, error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedStudentId(id);
    setIsConfirmationModalOpen(true); // Open the modal
  };

  const deleteStudentById = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/students/delete_student_by_id/${selectedStudentId}`
      );
      setIsConfirmationModalOpen(false); // Close the modal
      await fetchData(); // Refresh the table data
    } catch (error) {
      console.error("Error deleting student by ID: " + selectedStudentId, error);
    }
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false); // Close the modal
    setSelectedStudentId(null); // Reset selected ID
  };

  // Update student details and refresh the table
  const updateStudent = async (updatedStudent) => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/students/save_student",
        updatedStudent
      );
      setIsModalOpen(false); // Close the modal
      await fetchData(); // Refresh the table data
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <div
        className="overflow-y-auto rounded-lg shadow-md"
        style={{
          maxWidth: "80%",
          maxHeight: "600px", // Adjust the height to fit 15 rows
          border: "1px solid #ddd",
          padding: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 bg-gray-50"></th>
              <th className="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    title="Edit"
                    onClick={() => fetchStudentById(item.id)}
                  >
                    ✎
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    title="Delete"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    🗑
                  </button>
                  {/* Reusable ConfirmationModal */}
                  <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this student? This action cannot be undone."
                    onConfirm={deleteStudentById}
                    onCancel={handleCancel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <EditModal
          student={currentStudent}
          onClose={() => setIsModalOpen(false)}
          onSave={updateStudent}
        />
      )}
    </div>
  );
};

export default StudentTable;
