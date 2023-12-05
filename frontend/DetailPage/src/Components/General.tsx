import infoLogo from '../assets/Info.png'
import InfoGrey from '../assets/info-grey.svg'
import CareGrey from '../assets/care-grey.png'
import HabitatGrey from '../assets/habitat-grey.png'
import MoreGrey from '../assets/more-grey.png'
import ImagesGrey from '../assets/images-grey.png'
import {Carousel, IconButton} from "@material-tailwind/react";
import axios from "axios";
import * as React from "react";

function General({plant, Ref}: { plant: { [key: string]: any }, Ref: React.MutableRefObject<any>}) {

    return (
        <div className='flex w-full mt-10 items-stretch'>
            <div dir='ltr' className='hidden lg:block fixed top-[50px] py-2 hover:px-2 flex-col overflow-x-hidden items-end bg-[#E8F5E9] w-[40px] mx-3 rounded-[20px]  hover:w-[125px] transition-all duration-50'>
                <div className='px-1 py-[1px] text-gray-600 hover:text-green-950 flex justify-between w-[110px] rounded-xl
                                    hover:border-[1px] hover:border-green-950 duration-100
                                    box-border items-center my-[2px]'
                                    onClick={() => Ref.current.general.scrollIntoView()}>
                    <img src={InfoGrey} />
                    <p className='pr-1 tracking-tight text-[13px]'>جامع</p>
                </div>
                <div className='px-1 py-[1px] text-gray-600 hover:text-green-950 flex justify-between w-[110px] rounded-xl
                                    hover:border-[1px] hover:border-green-950 duration-100
                                    box-border items-center my-[2px]'
                                    onClick={() => Ref.current.care.scrollIntoView()}>
                    <img src={CareGrey} className='h-[32px] w-[32px]'/>
                    <p className='pr-1 tracking-tight text-[12px]'>مراقبت</p>
                </div>
                <div className='px-1 py-[1px] text-gray-600 hover:text-green-950 flex justify-between w-[110px] rounded-xl
                                    hover:border-[1px] hover:border-green-950 duration-100
                                    box-border items-center my-[2px]'
                                    onClick={() => Ref.current.ecology.scrollIntoView()}>
                    <img src={HabitatGrey} className='h-[32px] w-[32px]'/>
                    <p className='pr-1 tracking-tight text-[12px]'>بوم شناسی</p>
                </div>
                <div className='px-1 py-[1px] text-gray-600 hover:text-green-950 flex justify-between w-[110px] rounded-xl
                                    hover:border-[1px] hover:border-green-950 duration-100
                                    box-border items-center my-[2px]'
                                    onClick={() => Ref.current.moreInfo.scrollIntoView()}>
                    <img src={MoreGrey} className='h-[32px] w-[32px]'/>
                    <p className='pr-1 tracking-tight text-[12px]'>بیشتر</p>
                </div>
                <div className='px-1 py-[1px] text-gray-600 hover:text-green-950 flex justify-between w-[110px] rounded-xl
                                    hover:border-[1px] hover:border-green-950 duration-100
                                    box-border items-center mb-[5px]'
                                    onClick={() => Ref.current.moreImages.scrollIntoView()}>
                    <img src={ImagesGrey} className='h-[30px] w-[30px]'/>
                    <p className='pr-1 tracking-tight text-[12px]'>تصاویر</p>
                </div>
            </div>
            <div className='lg:mr-[150px] md:mr-[50px] mr-[15px]'>
                <div className='flex mb-7'>
                    <img src={infoLogo} className='w-[40px] h-[40px] ml-2'/>
                    <h1 ref={ref => Ref.current.general = ref} className='text-[30px]'>جامع</h1>
                </div>
                <div className='flex flex-col items-center justify-center lg:flex-row md:ml-10'>
                    <div className='grow-[2] ps-10'>
                        <h1 className='font-bold text-[25px]'>{plant.persian_name}</h1>
                        <p className='font-semibold text-[20px]>{plant.family} mt-3'>{plant.family}</p>
                        <p className='text-[16px] mt-3 ms-2'>{plant.more_info}</p>
                    </div>
                    <div className='min-w-[3px] mx-[15px] bg-[#E8F5E9] rounded'></div>
                    <div dir='ltr' className='grow'>
                        <Carousel
                            className="rounded-xl w-[400px] mt-10"
                            prevArrow={({handlePrev}) => (
                                <IconButton
                                    variant="text"
                                    color="white"
                                    size="lg"
                                    onClick={handlePrev}
                                    className="!absolute top-2/4 left-4 -translate-y-2/4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                </IconButton>
                            )}
                            nextArrow={({handleNext}) => (
                                <IconButton
                                    variant="text"
                                    color="white"
                                    size="lg"
                                    onClick={handleNext}
                                    className="!absolute top-2/4 !right-4 -translate-y-2/4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </IconButton>
                            )}
                        >
                            {/*<img src={`${axios.defaults.baseURL}${plant.image}`}/>*/}
                            {/*<img src={`${axios.defaults.baseURL}${plant.stem_image_set[0]}`}/>*/}
                            <img
                                src={`${axios.defaults.baseURL}${plant.image}`}
                                alt="image 1"
                                className="h-full w-full object-cover"
                            />
                            {plant.stem_image_set.length > 0 && <img
                                src={`${axios.defaults.baseURL}${plant.stem_image_set[Math.floor(Math.random() * plant.stem_image_set.length)].image}`}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />}
                            {plant.flower_image_set.length > 0 && <img
                                src={`${axios.defaults.baseURL}${plant.flower_image_set[Math.floor(Math.random() * plant.flower_image_set.length)].image}`}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />}
                            {plant.leaf_image_set.length > 0 && <img
                                src={`${axios.defaults.baseURL}${plant.leaf_image_set[Math.floor(Math.random() * plant.leaf_image_set.length)].image}`}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />}
                            {plant.habitat_image_set.length > 0 && <img
                                src={`${axios.defaults.baseURL}${plant.habitat_image_set[Math.floor(Math.random() * plant.habitat_image_set.length)].image}`}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />}
                            {plant.fruit_image_set.length > 0 && <img
                                src={`${axios.defaults.baseURL}${plant.fruit_image_set[Math.floor(Math.random() * plant.fruit_image_set.length)].image}`}
                                alt="image 2"
                                className="h-full w-full object-cover"
                            />}
                            {/*{plant.video_aparat_id && <iframe*/}
                            {/*    src={`https://www.aparat.com/video/video/embed/videohash/${plant.video_aparat_id}/vt/frame`}*/}
                            {/*    allowFullScreen={true}*/}
                            {/*    className="h-full w-full object-cover"*/}
                            {/*></iframe>}*/}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default General
