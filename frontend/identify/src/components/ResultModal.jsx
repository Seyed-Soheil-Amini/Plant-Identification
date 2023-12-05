import React from "react";
import Modal from "react-modal";
import closeIcon from "../img/Cancel.png";
import { isEmpty } from "lodash";
import waitGif from "../img/flower_load.gif";

const ResultModal = ({ res, handleClose, waiting }) => {
  // const baseUrl = "http://127.0.0.1:8000/plant/";
  const baseUrl = `${window.location.origin}/plant/`;
  return (
    <Modal
      isOpen={true}
      className={
        "overflow-auto max-h-90vh h-5/6 w-3/4 md:w-2/4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md px-2 py-1 w-400 max-w-full bg-green-100"
      }
    >
      {waiting ? (
        <img src={waitGif} className="mx-auto my-5 h-80 w-80" />
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-content-end w-full">
            <img
              className="w-8 h-8 cursor-pointer"
              src={closeIcon}
              onClick={() => handleClose()}
            />
          </div>
          <div className="">
            <div className="bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')]">
              <h1 className="mb-3 text-center text-xl font-bold tracking-tight leading-none text-green-900 md:text-3xl lg:text-4xl">
                گیاهان شناسایی شده
              </h1>
            </div>
            <div className="flex flex-col w-5/6 mx-auto">
              <div className="text-center text-gray-600">
                <div className="flex-row md:flex md:flex-col justify-content-between w-full">
                  <div className="w-full h-full md:w-1/2 md:h-1/2">
                    {!isEmpty(res.main_result.image) && (
                      <img
                        src={window.location.origin + res.main_result.image}
                        // src={"http://127.0.0.1:8000" + res.main_result.image}
                        className="mx-auto h-30 w-30 rounded-2"
                      />
                    )}
                    <div className="flex justify-content-between pt-2">
                      {!isEmpty(res.main_result.other_images) &&
                        res.main_result.other_images.map((image) => {
                          return (
                            <img
                              src={window.location.origin + image.image}
                              // src={"http://127.0.0.1:8000" + image.image}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-md mx-auto"
                              alt="image2"
                            />
                          );
                        })}
                    </div>
                  </div>
                  <div className="my-auto">
                    <h3 className="font-serif text-lg md:text-3xl pt-1">
                      <b>{res.main_result.scientific_name}</b>
                    </h3>
                    <h5 className="font-serif text-sm md:text-lg">
                      {res.main_result.family}
                    </h5>
                  </div>
                </div>
                <div className="mx-auto mt-1.5 md:mt-3">
                  <a href={baseUrl + res.main_result.id} target="_blank">
                    <button
                      className="border-success-subtle font-semibold text-gray-200 bg-green-950 hover:bg-white hover:text-green-800 tracking-tight rounded-lg py-1.5 px-2.5 border-1 text-xs md:text-sm"
                      // style={{ backgroundColor: "#0F4229" }}
                    >
                      اطلاعات بیشتر
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="my-2 mx-2 h-1 rounded-2"
              style={{ backgroundColor: "#0F4229" }}
            />
            <div className="">
              <div className="bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')]">
                <h1 className="mb-2 text-center text-sm font-medium tracking-tight leading-none text-green-900 md:text-xl lg:text-2xl">
                  نتایج مشابه
                </h1>
              </div>
              <div className="flex justify-content-center pt-1">
                {!isEmpty(res.result_2) && (
                  <a href={baseUrl + res.result_2.id} target="_blank">
                    <div className="items-center flex-row mx-2 cursor-pointer">
                      <img
                        src={window.location.origin + res.result_2.image}
                        // src={"http://127.0.0.1:8000" + res.result_2.image}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-md mx-auto"
                        alt="image1"
                      />
                      <button className="font-medium pt-2 mx-auto text-xs md:text-sm text-gray-700">
                        {res.result_2.scientific_name}
                      </button>
                    </div>
                  </a>
                )}
                {!isEmpty(res.result_3) && (
                  <a href={baseUrl + res.result_3.id} target="_blank">
                    <div className="items-center flex-row mx-2 cursor-pointer">
                      <img
                        src={window.location.origin + res.result_3.image}
                        // src={"http://127.0.0.1:8000" + res.result_3.image}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-md mx-auto"
                        alt="image2"
                      />
                      <button className="font-medium pt-2 mx-auto text-xs md:text-sm text-gray-700">
                        {res.result_3.scientific_name}
                      </button>
                    </div>
                  </a>
                )}
                {!isEmpty(res.result_4) && (
                  <a href={baseUrl + res.result_4.id} target="_blank">
                    <div className="items-center flex-row mx-2 cursor-pointer">
                      <img
                        src={window.location.origin + res.result_4.image}
                        // src={"http://127.0.0.1:8000" + res.result_4.image}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-md"
                        alt="image3"
                      />
                      <button className="font-medium pt-2 mx-auto text-xs md:text-sm text-gray-700">
                        {res.result_4.scientific_name}
                      </button>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </Modal>
  );
};

export default ResultModal;
