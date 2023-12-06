import imagesIcon from '../assets/images.png'
import stemIcon from '../assets/stem.png'
import flowerIcon from '../assets/flower.png'
import fruitIcon from '../assets/fruit.png'
import habitatIcon from '../assets/habitat-images-icon.png'
import leafIcon from '../assets/leaf.png'
import {useState} from "react";
import axios from "axios";
import {
    Dialog,
    DialogBody, DialogHeader,
} from "@material-tailwind/react";
import {TfiClose} from "react-icons/tfi";
import * as React from "react";

function MoreImages({plant, Ref}: { plant: { [key: string]: any }, Ref: React.MutableRefObject<any> }) {
    const [activeImageSet, setActiveImageSet] = useState(plant.leaf_image_set)
    const [open, setOpen] = useState<null | string>(null)
    const handleOpenImage = (url: string) => setOpen(url);
    const handleCloseImage = () => setOpen(null);
    return (
        <div className='mt-10 lg:mr-[150px] md:mr-[50px] mr-[15px]'>
            <div className='flex mb-7'>
                <img src={imagesIcon} className='w-[40px] h-[40px] ml-2'/>
                <h1 ref={ref => Ref.current.moreImages = ref} className='text-[30px]'>تصاویر بیشتر</h1>
            </div>
            <div className='w-[100%] mx-auto border-[1px] border-black h-[500px]
                rounded-2xl mb-[100px] relative overflow-x-hidden flex'>
                <div className='z-20 w-[166px] mx-auto border-[1px] border-black
                                min-h-[100px] rounded-2xl absolute right-0 top-[50%] translate-y-[-50%]
                                translate-x-[112px] hover:translate-x-[47px] max-sm:hover:translate-x-[112px] pr-[50px] py-2 duration-200'>
                    <div className='flex max-sm:flex-row-reverse justify-between px-2 py-1 h-[43px]
                         w-[110px] items-center hover:bg-green-700 hover:bg-opacity-10 rounded-2xl
                            transition-all duration-200' onClick={() => setActiveImageSet([...plant.leaf_image_set])}>
                        <p className='text-gray-500 text-[16px] hidden sm:block'>برگ</p>
                        <img src={leafIcon} className='max-h-full'/>
                    </div>
                    <div className='flex max-sm:flex-row-reverse justify-between px-2 py-1 h-[43px]
                         w-[110px] items-center hover:bg-green-700 hover:bg-opacity-10 rounded-2xl
                            transition-all duration-200' onClick={() => setActiveImageSet([...plant.stem_image_set])}>
                        <p className='text-gray-500 text-[16px] hidden sm:block'>ساقه</p>
                        <img src={stemIcon} className='max-h-full'/>
                    </div>
                    <div className='flex max-sm:flex-row-reverse justify-between px-2 py-1 h-[43px]
                         w-[110px] items-center hover:bg-green-700 hover:bg-opacity-10 rounded-2xl
                            transition-all duration-200' onClick={() => setActiveImageSet([...plant.fruit_image_set])}>
                        <p className='text-gray-500 text-[16px] hidden sm:block'>میوه</p>
                        <img src={fruitIcon} className='max-h-full'/>
                    </div>
                    <div className='flex max-sm:flex-row-reverse justify-between px-2 py-1 h-[43px]
                         w-[110px] items-center hover:bg-green-700 hover:bg-opacity-10 rounded-2xl
                            transition-all duration-200' onClick={() => setActiveImageSet([...plant.flower_image_set])}>
                        <p className='text-gray-500 text-[16px] hidden sm:block'>گلبرگ</p>
                        <img src={flowerIcon} className='max-h-full'/>
                    </div>
                    <div className='flex max-sm:flex-row-reverse justify-between px-2 py-1 h-[43px]
                         w-[110px] items-center hover:bg-green-700 hover:bg-opacity-10 rounded-2xl
                            transition-all duration-200' onClick={() => setActiveImageSet([...plant.habitat_image_set])}>
                        <p className='text-gray-500 text-[16px] hidden sm:block'>زیستگاه</p>
                        <img src={habitatIcon} className='max-h-full'/>
                    </div>
                </div>
                <div className='z-0 h-[90%] bg-green-700 w-[1.5px] my-auto mr-[130px] max-sm:mr-[70px]'></div>
                <div className='z-0 h-[90%] my-auto w-[75%] max-sm:w-[70%] mx-auto grid grid-cols-2 lg:grid-cols-6 md:grid-cols-5
                                sm:grid-cols-3 md:gap-2 gap-1 justify-items-stretch justify-center content-start overflow-y-auto'>
                    {activeImageSet.map((i: { image: string, thumbnail_image: string}) => {
                        return (
                            <img src={`${axios.defaults.baseURL}${i.thumbnail_image}`}
                                 className='h-[100px] object-cover rounded'
                                 onClick={() => handleOpenImage(`${axios.defaults.baseURL}${i.image}`)}/>
                        )
                    })}
                </div>
            </div>
            <Dialog size="xl" open={!!open} handler={handleCloseImage}>
                <DialogHeader className='p-2'>
                    <TfiClose onClick={handleCloseImage} className='w-[20px] h-[20px]' />
                </DialogHeader>
                <DialogBody className="p-0">
                    <img
                        className="max-h-[500px] w-full object-cover object-center"
                        src={open as string}
                    />
                </DialogBody>
            </Dialog>
        </div>
    )
}

export default MoreImages
