import React, { createContext } from "react";

const ConfigContext = createContext();
export const ConfigProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const configForm = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return (
    <ConfigContext.Provider value={{ configForm, config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
