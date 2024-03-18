import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEmployeeData, addEmployeeData } from "../RTK/EmployeeSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";
import url from "../utils/constUrl";

function Home() {
  const [showPop, setShowPop] = useState("");
  const [search, setSearch] = useState("");
  const empList = useSelector((store) => store.employee.employeeData);
  const [Data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Search Bar Functionality
  function searchBox(searchText, data) {
    if (!searchText) return data;
    const formatInput = (input) => input.replace(/\s/g, "").toLowerCase();
    return data.filter((value) => {
      const formattedName = formatInput(value.name);
      const formattedEmail = formatInput(value.email);
      const formattedSearchText = formatInput(searchText);
      return (
        formattedName.startsWith(formattedSearchText) ||
        formattedEmail.startsWith(formattedSearchText)
      );
    });
  }
  useEffect(() => {
    setData(searchBox(search, empList));
  }, [empList, search]);

  //Handling Open and Close popup
  const handleAddMemberClick = (details) => setShowPop(details);
  const handleClosePopup = () => setShowPop("");

  //delete employee list
  const deleteEmp = async (details) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${url}/store/employee/${details._id}`, {
        headers: {
          Authorization: token,
        },
      });
      dispatch(deleteEmployeeData(details));
    } catch (error) {
      console.error("Error deleting employee details:", error);
      alert("Failed to delete employee details");
    }
  };

  //check token exist for client side route auth and fetch employee data of specific user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    (async () => {
      try {
        const response = await axios.get(`${url}/store/employee`, {
          headers: {
            Authorization: token,
          },
        });
        dispatch(addEmployeeData(response.data));
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    })();
  }, []);

  return (
    <div className="lg:w-[1000px] mx-auto">
      <div className="flex items-center p-5">
        <h4 className="flex-grow text-center text-xl font-semibold">
          Employees List
        </h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
          onClick={() => {
            localStorage.removeItem("token");
            dispatch(addEmployeeData([]));
            navigate("/");
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </div>

      <div className="bg-lime-600 h-16 w-full flex flex-col justify-center">
        <div className="flex justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 p-1 ml-4 sm:hidden bg-blue-950 text-white rounded-full"
            onClick={handleAddMemberClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
          <button
            className=" hidden sm:block text-white mx-4 w-40 h-10 p-2 rounded-sm bg-blue-950"
            onClick={handleAddMemberClick}
          >
            <h4>Add Member</h4>
          </button>

          <input
            className="border-2 mx-4 w-64 h-10 p-2 rounded-sm text-md italic font-sans outline-none"
            type="text"
            value={search}
            placeholder="Search Id, Name, Email"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
      </div>

      {showPop && <Popup onClose={handleClosePopup} details={showPop} />}

      <table className="hidden sm:block w-full">
        <thead>
          <tr>
            <th className="w-52 border-2 text-center">Emp Id</th>
            <th className="w-52 h-10 border-2 text-center">Name</th>
            <th className="w-52 border-2 text-center">Email Id</th>
            <th className="w-52 border-2 text-center">Position</th>
            <th className="w-52 border-2 text-center">Package/Lpa</th>
            <th className="w-52 border-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Data.length != 0 ? (
            Data.map((details, index) => {
              return (
                <tr className="border-2" key={index}>
                  <td className="w-52 border-x-2 text-center">
                    {details?.empId}
                  </td>
                  <td className="w-52 h-10 border-x-2 text-center">
                    {details?.name}
                  </td>
                  <td className="w-52 border-x-2 text-center">
                    {details?.email}
                  </td>
                  <td className="w-52 border-x-2 text-center">
                    {details?.position}
                  </td>
                  <td className="w-52 border-x-2 text-center">
                    {details?.package}
                  </td>
                  <td className="w-52 border-x-2 text-center">
                    <div className=" flex  justify-around mx-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6"
                        onClick={() => handleAddMemberClick(details)}
                      >
                        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6"
                        onClick={() => deleteEmp(details)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                  className="inline-block mt-20 align-middle"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {Data.length === 0 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          viewBox="0 0 24 24"
          className="mt-40 mx-auto sm:hidden"
        >
          <path
            fill="currentColor"
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25"
          />
          <path
            fill="currentColor"
            d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
          >
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
        </svg>
      ) : (
        Data.map((details, index) => {
          return (
            <div
              className=" w-auto border-2 shadow-lg m-2 sm:hidden rounded-lg flex justify-between"
              key={index}
            >
              <div className="m-4">
                <h4>Emp Id : {details?.empId}</h4>
                <h4>Name &nbsp; &nbsp;: {details?.name}</h4>
                <h4>Email Id : {details?.email}</h4>
                <h4>Position : {details?.position}</h4>
                <h4>Package : {details?.package}</h4>
              </div>
              <div className=" flex flex-col justify-around mx-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-6 h-6"
                  onClick={() => handleAddMemberClick(details)}
                >
                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-6 h-6"
                  onClick={() => deleteEmp(details)}
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Home;
