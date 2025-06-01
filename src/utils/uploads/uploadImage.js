import { API_PATHS } from "../apiPath";
import axiosInstance from "../axiosInstance.js";

export const uploadSingleImage = async (imageFile) => {
  // console.log(imageFile);
  const formData = new FormData();
  formData.append("image", imageFile);
  try {
    const response = await axiosInstance.post(API_PATHS.UPLOAD.IMAGE_SINGLE, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const uploadImages = async (imagesFile) => {
  const formData = new FormData();
  for (let i = 0; i < imagesFile.length; i++) {
    formData.append('gallery', imagesFile[i]); 
  }
  try {
    const response = await axiosInstance.post(API_PATHS.UPLOAD.IMAGES, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log(response.data);
    return response.data;
  }
  catch(err)
  {
    console.log(err);
  }
}