import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ClubsContext = createContext();
export const ClubsProvider = ({ children }) => {
  const [clubs, setClubs] = useState([]);
  const token = localStorage.getItem("token");

  const configForm = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/clubs`,
          configForm
        );

        if (response.data.success) {
          setClubs(response.data.clubs);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  return (
    <ClubsContext.Provider value={{ clubs, setClubs }}>
      {children}
    </ClubsContext.Provider>
  );
};

export default ClubsContext;
