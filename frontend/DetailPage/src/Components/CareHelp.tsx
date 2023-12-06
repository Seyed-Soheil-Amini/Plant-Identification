import CareLogo from '../assets/care.png'
import morphology from '../assets/morphology.png'
import climate from '../assets/climate-pic.png'
import timer from '../assets/timer.png'
import watering from '../assets/watering.png'
import * as React from "react";

function CareHelp({plant, Ref}: { plant: { [key: string]: any }, Ref: React.MutableRefObject<any> }) {

    return (
        <div className='mt-10 lg:mr-[150px] md:mr-[50px] mr-[15px]'>
            <div className='flex mb-7'>
                <img src={CareLogo} className='w-[40px] h-[40px] ml-2'/>
                <h1 ref={ref => Ref.current.care = ref} className='text-[30px]'>راهنمای مراقبت</h1>
            </div>
            <div className='grid lg:grid-cols-2 grid-cols-1 w-[90%] mx-auto gap-5'>
                <div className='grow min-h-[180px] bg-[#E8F5E9] rounded-[50px]
                    shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-7
                    hover:shadow-[inset_1px_-2px_4px_0px_rgba(0,0,0,0.25)] duration-500 transition-all'>
                    <div className='flex justify-between items-stretch'>
                        <div className='grow'>
                            <h1 className='font-bold text-[23px]'>خاک</h1>
                            <p className='mr-2 text-[18px]'>{plant.soil_characteristics}</p>
                        </div>
                        <div className=''>
                            <img className='min-w-[100px] max-w-[100px] h-auto' src={morphology}/>
                        </div>
                    </div>
                </div>
                <div className='grow min-h-[180px] bg-[#E8F5E9] rounded-[50px]
                    shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-7
                    hover:shadow-[inset_1px_-2px_4px_0px_rgba(0,0,0,0.25)] duration-500 transition-all'>
                    <div className='flex justify-between items-stretch'>
                        <div className='grow'>
                            <h1 className='font-bold text-[23px]'>اقلیم</h1>
                            <p className='mr-2 text-[18px]'>{plant.climate}</p>
                        </div>
                        <div className=''>
                            <img className='min-w-[100px] max-w-[100px] h-auto' src={climate}/>
                        </div>
                    </div>
                </div>
                <div className='grow min-h-[180px] bg-[#E8F5E9] rounded-[50px]
                    shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-7
                    hover:shadow-[inset_1px_-2px_4px_0px_rgba(0,0,0,0.25)] duration-500 transition-all'>
                    <div className='flex justify-between items-stretch'>
                        <div className='grow'>
                            <h1 className='font-bold text-[23px]'>آبیاری</h1>
                            <p className='mr-2 text-[18px]'></p>
                        </div>
                        <div className=''>
                            <img className='min-w-[100px] max-w-[100px] h-auto' src={watering}/>
                        </div>
                    </div>
                </div>
                <div className='grow min-h-[180px] bg-[#E8F5E9] rounded-[50px]
                    shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-7
                    hover:shadow-[inset_1px_-2px_4px_0px_rgba(0,0,0,0.25)] duration-500 transition-all'>
                    <div className='flex justify-between items-stretch'>
                        <div className='grow'>
                            <h1 className='font-bold text-[23px]'>زمان کاشت</h1>
                            <p className='mr-2 text-[18px]'></p>
                        </div>
                        <div className=''>
                            <img className='min-w-[100px] max-w-[100px] h-auto' src={timer}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CareHelp
