import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-toastify/dist/ReactToastify.min.css";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { isEmpty } from "lodash";

const Dropzone = ({ imageName, handler, icon }) => {
  const [image, setImage] = useState("");
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (imageName === "Flower") handler({ name: "flower", value: file });
      else if (imageName === "Fruit") handler({ name: "fruit", value: file });
      else if (imageName === "Stem") handler({ name: "stem", value: file });
      else handler({ name: "leaf", value: file });
      setImage(reader.result);
    };

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.info(`Image size exceeds the limit (Max size 10MB)`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.info("Only image files are allowed");
        return;
      }
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  const handleRemove = () => {
    setImage("");
    if (imageName === "Flower") handler({ name: "flower", value: {} });
    else if (imageName === "Fruit") handler({ name: "fruit", value: {} });
    else if (imageName === "Stem") handler({ name: "stem", value: {} });
    else handler({ name: "leaf", value: {} });
  };

  return (
    <div className="flex-row w-1/2 h-40 md:h-60 md:w-1/5 mb-2 md:mb-0">
      <div
        className="flex justify-content-center text-center items-center border-1 rounded-sm border-dashed border-green-700 cursor-pointer h-4/5 md:h-3/4"
        {...getRootProps()}
      >
        <input type="file" name={imageName} {...getInputProps()} />
        {isEmpty(image) ? (
          <div className="items-center mb-2.5 md:mb-5">
            <div className="flex justify-content-center mx-auto pt-2 md:pb-5">
              <img className="w-5 h-5 md:w-14 md:h-14" src={icon} />
              <h6 className="h-2/5 my-auto pl-1 md:pl-3 text-md md:text-3xl">
                {imageName}
              </h6>
            </div>
            <FaPlus className="mx-auto text-center mt-2 text-lg md:text-3xl" />
          </div>
        ) : (
          <img
            className="flex mx-auto my-auto"
            src={image}
            alt="Selected image preview"
          />
        )}
      </div>
      {!isEmpty(image) && (
        <div className="flex justify-content-center mt-1 md:mt-3">
          <button
            type="button"
            className="border border-red-700 focus:ring-4 font-medium rounded-md text-xs md:text-sm px-3 py-2 md:px-5 md:py-2.5 text-center mb-0 md:mb-2 border-red-500 text-white bg-red-600 hover:bg-red-500"
            onClick={() => handleRemove()}
          >
            remove
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
