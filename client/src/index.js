import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ClubsProvider } from "../src/pages/Contexts/ClubsContext";
import { TournamentProvider } from "../src/pages/Contexts/TournamentContext";
import { PigeonProvider } from "../src/pages/Contexts/PigeonContext";
import { BannerProvider } from "../src/pages/Contexts/BannerContext";
import { ConfigProvider } from "../src/pages/Contexts/ConfigContext";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ClubsProvider>
      <TournamentProvider>
        <PigeonProvider>
          <BannerProvider>
            <ConfigProvider>
              <App />
            </ConfigProvider>
          </BannerProvider>
        </PigeonProvider>
      </TournamentProvider>
    </ClubsProvider>
  </BrowserRouter>
);
