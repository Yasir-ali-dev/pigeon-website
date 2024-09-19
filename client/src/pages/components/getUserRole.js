import { Outlet } from "react-router-dom";
import UnAuthorized from "./UnAuthorized";

export const getUserRole = () => {
  const userRoleString = localStorage.getItem("user"); // or wherever you're getting the JSON string

  // Check if the data exists before parsing
  if (!userRoleString) {
    console.error("No data found to parse");
    return null;
  }

  try {
    const userRole = JSON.parse(userRoleString);
    return userRole.role;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const ClubOwnerRoutes = () => {
  const role = getUserRole();
  return role === 0 ? <Outlet /> : <UnAuthorized />;
};

export const AdminRoutes = () => {
  const role = getUserRole();
  return role === 1 ? <Outlet /> : <UnAuthorized />;
};
