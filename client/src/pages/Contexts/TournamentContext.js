import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const fetchTournaments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/`
      );
      setTournaments(response.data.tournaments);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <TournamentContext.Provider
      value={{ tournaments, fetchTournaments, setTournaments }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export default TournamentContext;
