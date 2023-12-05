import './App.css'
import General from "./Components/General.tsx";
import useSWR from "swr";
import axios from "axios";
import CareHelp from "./Components/CareHelp.tsx";
import Ecology from "./Components/Ecology.tsx";
import MoreInfo from "./Components/MoreInfo.tsx";
import MoreImages from "./Components/MoreImages.tsx";
import {Spinner} from "@material-tailwind/react";
import {useRef} from "react";

function App() {
    const {data: plant, isLoading, error} = useSWR(`/plants/${window.location.pathname.split('/').pop()}`, PlantFetcher)
    const shortcuts = useRef({general: null,care:null,ecology:null,moreInfo:null,moreImages:null})

    if (plant) {
        document.title = plant.persian_name
    }

    if(error) {
        if(error.response.status === 404) {
            return (
                <div className='fixed inset-0 flex items-center justify-center'>
                    <p className='text-red-600 text-[20px]'>404 - صفحه مورد نظر یافت نشد!</p>
                </div>
            )
        } else {
            return (
                <div className='fixed inset-0 flex items-center justify-center'>
                    <p className='text-red-600 text-[20px]'>مشکلی در دریافت اطلاعات وجود دارد!</p>
                </div>
            )
        }
    }

    if (isLoading) {
        return (
            <div className='fixed inset-0 flex flex-col items-center justify-center'>
                <Spinner color='green'/>
                <p className='mt-3 text-[20px] text-green-500'>در حال بارگذاری</p>
            </div>
        )
    }
    return (
        <>
            <General plant={plant} Ref={shortcuts}/>
            <div className='bg-[#348E38] md:mr-[50px] mr-[15px] lg:mr-[150px] h-[2px] my-[70px]'></div>
            <CareHelp plant={plant} Ref={shortcuts}/>
            <div className='bg-[#348E38] md:mr-[50px] mr-[15px] lg:mr-[150px] h-[2px] my-[70px]'></div>
            <Ecology plant={plant} Ref={shortcuts}/>
            <div className='bg-[#348E38] md:mr-[50px] mr-[15px] lg:mr-[150px] h-[2px] my-[70px]'></div>
            <MoreInfo plant={plant} Ref={shortcuts}/>
            <div className='bg-[#348E38] md:mr-[50px] mr-[15px] lg:mr-[150px] h-[2px] my-[70px]'></div>
            <MoreImages plant={plant} Ref={shortcuts}/>
        </>
    )
}

function PlantFetcher(url: string) {
    return axios.get(url).then(res => res.data)
}

export default App
