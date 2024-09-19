import React from "react";
import { Container } from "react-bootstrap";
import TournamentForm from "./components/TournamentForm";

const CreateTournament = () => {
  return (
    <Container>
      <h5 className="text-center">Create Tournament</h5>
      <TournamentForm />
    </Container>
  );
};

export default CreateTournament;
