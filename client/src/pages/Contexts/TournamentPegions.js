import React, { createContext, useState } from "react";
import axios from "axios";
const TournamentPigeonsContext = createContext();
export const TournamentProvider = ({ children }) => {
  const [owners, setOwners] = useState([]);
  const fetchTournamentPigeons = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/pigeonOwners/:${id}`
      );
      if (response.data.success) {
        setOwners(response.data.pigeonOwners);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  return (
    <TournamentPigeonsContext.Provider
      value={{ owners, setOwners, fetchTournamentPigeons }}
    >
      {children}
    </TournamentPigeonsContext.Provider>
  );
};

export default TournamentPigeonsContext;
