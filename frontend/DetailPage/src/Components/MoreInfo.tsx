import moreIcon from '../assets/more.png'
import * as React from "react";

function MoreInfo({plant, Ref}: { plant: { [key: string]: any }, Ref: React.MutableRefObject<any>}) {

    return (
        <div className='mt-10 lg:mr-[150px] md:mr-[50px] mr-[15px]'>
            <div className='flex mb-7'>
                <img src={moreIcon} className='w-[40px] h-[40px] ml-2'/>
                <h1 ref={ref => Ref.current.moreInfo = ref} className='text-[30px]'>اطلاعات بیشتر</h1>
            </div>
            <div className='w-[90%] mx-auto min-h-[180px] bg-[#E8F5E9] rounded-[50px]
                    shadow-[-4px_4px_4px_0px_rgba(0,0,0,0.25)] p-7
                    hover:shadow-[inset_1px_-2px_4px_0px_rgba(0,0,0,0.25)] duration-500 transition-all'>
                {plant.more_info}
            </div>
        </div>
    )
}

export default MoreInfo
