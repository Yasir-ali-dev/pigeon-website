import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Createclub from "./pages/Createclub";
import TournamentsContainer from "./pages/TournamentsContainer";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournament from "./pages/CreateTournament";
import Layout from "./pages/Layout";
import TournamentLayout from "./pages/TournamentLayout";
import ClubContainer from "./pages/ClubContainer";
import Clubs from "./pages/Clubs";
import ClubDashboardContainer from "./pages/ClubOwnerDashboard/ClubDashboardContainer";
import ClubTournaments from "./pages/ClubOwnerDashboard/ClubTournaments";
import TournamentForm from "./pages/components/TournamentForm";
import PigeonOwnerContainer from "./pages/PigeonOwner/PigeonOwnerContainer";
import PigeonOwnerForm from "./pages/PigeonOwner/PigeonOwnerForm";
import PigeonResultsForm from "./pages/results/PigeonResultsForm";
import PegionOwnersResult from "./pages/results/PegionOwnersResult";
import PigeonOwnerResultUpdate from "./pages/results/PigeonOwnerResultUpdate";
import BannerForm from "./pages/Banner/BannerForm";
import BannerContainer from "./pages/Banner/BannerContainer";
import BannerLayout from "./pages/Banner/BannerLayout";

import ClubOwnerDashboard from "./pages/ClubOwnerDashboard/ClubOwnerDashboard";
import LandingClubs from "./pages/LandingComponents/LandingClubs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPigeonForm from "./pages/AdminPigeonOwnerContainer/AdminPigeonForm";
import AdminPigeonOwnerContainer from "./pages/AdminPigeonOwnerContainer/AdminPigeonOwnerContainer";
import AdminPigeonOwners from "./pages/AdminPigeonOwnerContainer/AdminPigeonOwners";
import AdminViewPigeonOwnerResult from "./pages/AdminPigeonOwnerContainer/AdminViewPigeonOwnerResult";
import AdminAddPigeonOwnerResult from "./pages/AdminPigeonOwnerContainer/AdminAddPigeonOwnerResult";
import AdminUpdatePigeonOwnerResult from "./pages/AdminPigeonOwnerContainer/AdminUpdatePigeonOwnerResult";
import TournamentFormUpdate from "./pages/ClubOwnerDashboard/TournamentFormUpdate";
import UnAuthorized from "./pages/components/UnAuthorized";
import { AdminRoutes, ClubOwnerRoutes } from "./pages/components/getUserRole";
import PageNotFound from "./pages/components/PageNotFound";
import Test from "./pages/components/Test";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route element={<AdminRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            {/* clubs */}
            <Route path="/clubs" element={<ClubContainer />}>
              <Route index element={<Clubs />} />
              <Route path="create" element={<Createclub />} />
            </Route>
            {/* tournaments */}
            <Route element={<TournamentLayout />}>
              <Route
                path="/tournaments"
                index
                element={<TournamentsContainer />}
              />
              <Route
                path="/tournaments/tournamentForm"
                element={<CreateTournament />}
              />
              <Route path="/tournaments/:id" element={<TournamentDetails />} />
            </Route>

            {/* bannners */}
            <Route element={<BannerLayout />}>
              <Route path="/banners/bannerForm" element={<BannerForm />} />
              <Route path="/banners" index element={<BannerContainer />} />
            </Route>

            <Route path="/pigeonOwners" element={<AdminPigeonOwnerContainer />}>
              <Route path="pigeonOwnerForm" element={<AdminPigeonForm />} />
              <Route index element={<AdminPigeonOwners />} />
            </Route>
            <Route
              path="/pigeonOwners/pigeonOwnerResult"
              element={<AdminViewPigeonOwnerResult />}
            />
            <Route
              path="/pigeonOwners/addPigeonOwnerResult"
              element={<AdminAddPigeonOwnerResult />}
            />
            <Route
              path="/pigeonOwners/updatePigeonOwnerResult"
              element={<AdminUpdatePigeonOwnerResult />}
            />
          </Route>
        </Route>
        {/* club owner dashboard */}
        <Route element={<ClubOwnerRoutes />}>
          <Route path="club/:id/" element={<ClubOwnerDashboard />} />
          <Route path="club/:id/" element={<ClubDashboardContainer />}>
            <Route path="tournaments" index element={<ClubTournaments />} />
            <Route path="createTournaments" element={<TournamentForm />} />
            <Route path="tournaments/:id" element={<TournamentFormUpdate />} />

            {/*pigeon owners  */}
            <Route path="pigeonOwners" element={<PigeonOwnerContainer />} />
            <Route path="pigeonOwnerForm" element={<PigeonOwnerForm />} />
            <Route path="pigeonResultForm" element={<PigeonResultsForm />} />
            <Route path="pigeonOwnerResults" element={<PegionOwnersResult />} />
            <Route
              path="pigeonOwnerResultUpdate"
              element={<PigeonOwnerResultUpdate />}
            />
          </Route>
        </Route>

        <Route path="/cl" element={<LandingClubs />} />
        <Route path="unauthorized" element={<UnAuthorized />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
