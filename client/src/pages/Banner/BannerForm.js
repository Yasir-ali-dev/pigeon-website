import { UploadOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";

import axios from "axios";
import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const BannerForm = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setImageUrl(e.target.files[0]);
  };
  const token = localStorage.getItem("token");

  const configForm = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const handleUpload = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", imageUrl);

      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/images`,
        formData,
        configForm
      );
      toast.success("Banner Uploaded Successfully!");
      setTimeout(() => {
        navigate("/banners");
      }, 3000);
    } catch (error) {
      console.error("failed to upload image");
      toast.error(error.message);
    }
  };

  // Delete Images API

  return (
    <Container className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h4>
          <Tag color="orange">Upload New Banner</Tag>
        </h4>
        <Link
          style={{
            textDecoration: "none",
            border: "1px solid lightblue",
            padding: "2px 4px",
            borderRadius: "5px",
          }}
          to={"/banners"}
        >
          All Banners
        </Link>
      </div>
      <form onSubmit={handleUpload} className="d-flex gap-5">
        <Input type="file" className={"w-50"} onChange={handleInput} />
        <Button
          disabled={imageUrl === null}
          variant="outline-info"
          type="submit"
        >
          <UploadOutlined />
          Upload
        </Button>
        <Toaster />
      </form>
    </Container>
  );
};

export default BannerForm;
