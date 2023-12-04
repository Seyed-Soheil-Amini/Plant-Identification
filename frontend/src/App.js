import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import phoneScreen from "./img/focusPhone3.jpg";
import petalIcon from "./img/petal-icon.png";
import fruitIcon from "./img/fruit-icon.png";
import stemIcon from "./img/stem-icon.png";
import leafIcon from "./img/leaf-icon.png";
import { useState } from "react";
import Dropzone from "./components/Dropzone";
import { isEmpty } from "lodash";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ResultModal from "./components/ResultModal";

function App() {
  const [images, setImage] = useState({
    flower: {},
    fruit: {},
    stem: {},
    leaf: {}
  });

  const [isWaiting, setIsWaiting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const handleChange = (event) => {
    const { name, value } = event;
    setImage((prevImages) => {
      return { ...prevImages, [name]: value };
    });
  };

  const handleSubmit = async () => {
    // const apiUrl = window.location.origin+"/plants/identify/";
    const apiUrl = "http://127.0.0.1:8000/plants/identify/";
    setIsWaiting(true);
    await axios
      .post(apiUrl, images, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        setIsWaiting(false);
        setResult(res.data);
        setShowResult(true);
      })
      .catch((err) => {
        setIsWaiting(false);
        console.log(err);
      });
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <>
      <ToastContainer />
      <meta charSet="utf-8" />
      <title>Identify</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta content="" name="keywords" />
      <meta content="" name="description" />
      <div
        className="container-fluid page-header py-5 mb-4 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container text-center py-5">
          <h1 className="display-3 text-white mb-4 animated slideInDown">
            idn-tit
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="text-light">idn-subtit1\ &nbsp;</li>
              <li className="text-light">idn-subtit2\ &nbsp;</li>
              <li className="text-light" aria-current="page">
                idn-subtit3
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container-fluid flex-row md:flex md:flex-col justify-content-between">
        <div className="w-auto md:w-2/3 flex justify-end mx-auto">
          <div className="flex flex-col wow fadeInUp">
            <h2 className="text-uppercase text-lg md:text-3xl">
              idn-guides-tit
            </h2>
            <p className="mb-4 text-xs md:text-sm">
              <ol className="fw-medium list-decimal space-y-2 space-overflow-y-auto">
                <li>idn-guides1 </li>
                <li>
                  idn-guides2.{" "}
                  <ul className="list-disc">
                    <li>idn-guides2-sub.</li>
                  </ul>
                </li>
                <li>idn-guides3.</li>
                <li>idn-guides4</li>
              </ol>
            </p>
            <div
              className="flex p-3 md:p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-3 h-3 md:w-4 md:h-4 me-1.5 md:me-3 mt-[2px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Danger</span>
              <div>
                <span className="font-medium">idn-dng-tit:</span>
                <ul className="mt-1.5 list-disc list-inside text-xs md:text-sm">
                  <li>idn-img-guide1</li>
                  <li>idn-img-guide2-tit</li>
                  <li>idn-img-guide3-tit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="my-auto mx-auto w-2/3 h-auto md:w-1/3 md:h-full">
          <img
            src={phoneScreen}
            className="rounded-md mx-auto h-full w-full md:h-1/2 md:w-2/3"
          />
        </div>
      </div>
      <hr className="my-4 mx-3 border-4 border-green-700 rounded-5" />{" "}
      <div
        className={`mx-2.5 md:mx-5 px-1 md:px-3 bg-green-50 pb-2 ${
          isWaiting && "opacity-75"
        }`}
      >
        <section className="bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')]">
          <div className="py-8 px-1 mx-auto max-w-screen-xl text-center lg:py-16 z-10">
            <h1 className="mb-2.5 md:mb-4 text-xl font-extrabold tracking-tight leading-none text-green-900 md:text-5xl lg:text-6xl">
              idn-upload-pr-tit
            </h1>
            <p className="mb-2 md:mb-8 text-xs md:text-xl font-normal text-gray-500 sm:px-16 lg:px-48">
              idn-plch-txt
            </p>
          </div>
          <div className="bg-gradient-to-b from-blue-50 to-transparent w-full h-full z-0" />
        </section>
        <div className="flex flex-col md:flex-row items-center justify-content-between py-2 px-2 mt-2 text-green-700 font-medium h-auto md:h-80">
          <Dropzone
            imageName="Flower"
            handler={handleChange}
            icon={petalIcon}
          />
          <Dropzone
            imageName={"Fruit"}
            handler={handleChange}
            icon={fruitIcon}
          />
          <Dropzone imageName={"Stem"} handler={handleChange} icon={stemIcon} />
          <Dropzone imageName={"Leaf"} handler={handleChange} icon={leafIcon} />
        </div>
        {!(
          isEmpty(images.flower) &&
          isEmpty(images.fruit) &&
          isEmpty(images.leaf) &&
          isEmpty(images.stem)
        ) && (
          <button
            type="button"
            className="flex mx-auto text-white font-medium rounded-md text-xs md:text-sm py-2 px-5 md:py-2.5 text-center mb-2"
            style={{ backgroundColor: "#348E38" }}
            onClick={handleSubmit}
          >
            {isWaiting ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin my-auto"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <FaSearch className="flex items-center mr-2 my-auto" />
            )}
            {isWaiting ? "idn-wait-text" : "idn-upload-btn"}
          </button>
        )}
      </div>
      <hr className="my-4 mx-3 border-4 border-green-700 rounded-5" />
      {(showResult || isWaiting) && (
        <ResultModal
          res={result}
          handleClose={handleCloseResult}
          waiting={isWaiting}
        />
      )}
    </>
  );
}

export default App;
