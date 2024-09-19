import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const PigeonContext = createContext();

export const PigeonProvider = ({ children }) => {
  const [owners, setOwners] = useState([]);

  const fetchPigeonOwner = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/allowners`
      );

      setOwners(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  useEffect(() => {
    fetchPigeonOwner();
  }, []);

  return (
    <PigeonContext.Provider value={{ owners, setOwners }}>
      {children}
    </PigeonContext.Provider>
  );
};

export default PigeonContext;
