import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/images`
      );
      setBanners(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <BannerContext.Provider value={{ banners, setBanners }}>
      {children}
    </BannerContext.Provider>
  );
};

export default BannerContext;
