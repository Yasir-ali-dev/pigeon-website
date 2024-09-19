import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Image, Popconfirm, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const BannerContainer = () => {
  const [images, setImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/images`
      );
      setImages(response.data);
      setUpdateImages(
        response.data.map((image, index) => {
          return {
            imageUrl: image.imageUrl,
            index: index,
            _id: image._id,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  // Handle drag end event to update the order
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const updatedImages = Array.from(images);
    const [reorderedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, reorderedImage);

    // Update the index property of the images
    updatedImages.forEach((image, index) => {
      image.index = index;
    });
    setImages(updatedImages);

    updateImageOrder(updatedImages);
  };

  // Send updated images to the server for saving to the database
  const updateImageOrder = async (updatedImages) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/api/v1/images/update-order`,
        {
          images: updatedImages,
        }
      );
      fetchImages();
      toast.success("Image order updated successfully");
    } catch (error) {
      console.error("Failed to update image order", error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/images/:${id}`,
        config
      );
      fetchImages();
      console.log(response);
    } catch (error) {
      console.error("failed to delete", error);
      toast("you are unauthorized");
    }
  };

  return (
    <Container>
      <div className="py-4">
        <h4 className="px-2">Available Banners</h4>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                className="image-list  d-flex flex-wrap align-items-center"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {updateImages.map((image, index) => (
                  <Draggable
                    key={image._id}
                    draggableId={image._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="image-item "
                        style={{
                          padding: "10px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="d-flex align-items-center flex-wrap gap-3">
                          <img
                            src={`${process.env.REACT_APP_API}/uploads/${image.imageUrl}`}
                            alt={`image-${index + 1}`}
                            style={{
                              borderRadius: "5px",
                              boxShadow: "5px 3px 3px grey",
                            }}
                            width="150"
                            height="50"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="banner-heading">
          Total Banners :<span className="total-banner"> {images.length}</span>
        </h4>
        <Link
          style={{
            textDecoration: "none",
            border: "1px solid blue",
            padding: "4px 10px",
            borderRadius: "5px",
            fontWeight: "600",
          }}
          to={"/banners/bannerForm"}
        >
          Create New Banner
        </Link>
      </div>
      <div className="d-flex gap-3 flex-column">
        {images.map((image) => {
          return (
            <div key={image._id} className="banner-imgs">
              <Image
                width={800}
                style={{ borderRadius: "5px", boxShadow: "5px 3px 3px grey" }}
                src={`${process.env.REACT_APP_API}/uploads/${image.imageUrl}`}
              />
              <div className="py-1">
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => handleDelete(image._id)}
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: "red",
                      }}
                    />
                  }
                >
                  <Button danger>
                    <DeleteOutlined /> Delete Banner
                  </Button>
                  <Toaster />
                </Popconfirm>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default BannerContainer;
