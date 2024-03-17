import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEmployeeData, updateEmployeeData } from "../RTK/EmployeeSlice";
import axios from "axios";
import url from "../utils/constUrl";

function Popup({ onClose, details }) {
  const [_id, set_id] = useState(details._id || "");
  const [empId, setEmpId] = useState(details?.empId || "");
  const [name, setName] = useState(details?.name || "");
  const [email, setEmail] = useState(details?.email || "");
  const [position, setPosition] = useState(details?.position || "");
  const [lpa, setLpa] = useState(details?.package || "");
  const dispatch = useDispatch();

  //Add employee data and update If found valid _id then update or add
  let AddEmp = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      let data = {
        empId: empId,
        name: name,
        email: email,
        position: position,
        package: lpa,
      };
      if (_id) {
        await axios.post(`${url}/update/employee/${_id}`, data, {
          headers: {
            Authorization: token,
          },
        });
        data._id = _id;
        dispatch(updateEmployeeData(data));
      } else {
        let response = await axios.post(`${url}/store/employee`, data, {
          headers: {
            Authorization: token,
          },
        });
        dispatch(addEmployeeData(response.data));
      }
      setEmpId("");
      setName("");
      setEmail("");
      setPosition("");
      setLpa("");
    } catch (error) {
      console.error("Error adding employee data:", error);
      alert("Failed to add employee data");
      setEmpId("");
      setName("");
      setEmail("");
      setPosition("");
      setLpa("");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <form
        className="bg-white py-5 m-2 w-[320px] text-center rounded-md"
        onSubmit={AddEmp}
      >
        <div>
          <h4 className="text-xl font-semibold mb-4 p-3 bg-lime-600 ">
            Add Employee
          </h4>
          <input
            className=" p-1 m-1 w-60 shadow border rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="text"
            placeholder="emp id"
            value={empId}
            required
            onChange={(e) => setEmpId(e.target.value)}
          ></input>
          <input
            className=" p-1 m-1 w-60 shadow border rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="text"
            placeholder="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            className=" p-1 m-1 w-60 shadow border rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="email"
            placeholder="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            className=" p-1 m-1 w-60 shadow border rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="text"
            placeholder="position"
            value={position}
            required
            onChange={(e) => setPosition(e.target.value)}
          ></input>
          <input
            className=" p-1 m-1 w-60 shadow border rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="text"
            placeholder="lakhs per annum"
            value={lpa}
            required
            pattern="[0-9]{6,7}"
            title="Please enter a LPA to 100000 to 9999999"
            onChange={(e) => setLpa(e.target.value)}
          ></input>
        </div>
        <div className="flex justify-around mt-3">
          <button
            onClick={onClose}
            className="bg-red-500 text-white w-16 h-7 rounded-sm"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-950 text-white w-16 h-7 rounded-sm"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}

export default Popup;
