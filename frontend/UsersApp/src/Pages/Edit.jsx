/* eslint-disable no-unused-vars */
import axios from "axios"
import {Await, defer, useAsyncValue, useLoaderData, useNavigate} from "react-router-dom"
import requireAuth, {baseUrl} from "../assets/assets"
import {Suspense, useEffect, useRef, useState} from "react"
import {useForm} from "react-hook-form";
import Select from "react-select";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {CircularProgress} from "@mui/material";


export async function loader({params}) {
    await requireAuth()
    const data = axios.get(`/plants/${params.id}/`, {
        withCredentials: true
    })
    const med = axios.get('/plants/medicine/')
    return defer({plant: data, med: med})
}


export default function Edit() {
    const dataPromises = useLoaderData()
    return (
        <Suspense fallback={<div className='d-flex w-100 h-100'><CircularProgress className='m-auto' style={{
            width: '60px',
            height: '60px'
        }} color='success'/></div>}>
            <Await resolve={dataPromises.plant}>
                {({data}) => {
                    return (
                        <Suspense fallback={<div className='d-flex w-100 h-100'><CircularProgress className='m-auto' style={{
                            width: '60px',
                            height: '60px'
                        }} color='success'/></div>
                        }>
                            <Await resolve={dataPromises.med}>
                                <Form data={data}/>
                            </Await>
                        </Suspense>
                    )
                }}
            </Await>
        </Suspense>
    )
}

function Form({data}){
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('')
    const navigate = useNavigate()
    const firstMedValues = useRef()
    const [numberOfInputs, setNumberOfInputs] = useState([1, 1, 1, 1, 1])
    const {register, handleSubmit, unregister, setError, clearErrors, formState: {errors, isSubmitting}} = useForm();

    function renderFileInputs(num, kind) {
        let inputs = []
        for (let i = 0; i < num; i++) {
            inputs.push(
                <div className="multi-image-input">
                    <input className="my-5" type="file" multiple
                           accept={acceptedImageFormats} {...register(`${kind}_${i}`)} />
                </div>
            )
        }
        return inputs
    }


    function handleAddFileInput(i) {
        setNumberOfInputs((prev) => {
            let newArray = [...prev]
            newArray[i]++
            return newArray
        })
    }

    function handleDeleteFileInput(i, kind) {
        unregister(`${kind}_${numberOfInputs[i] - 1}`)
        setNumberOfInputs((prev) => {
            let newArray = [...prev]
            newArray[i]--
            return newArray
        })
    }

    function renderAlreadyAddedImages(data, kind) {
        let images = []
        if (data?.length > 0) {
            for (let i = 0; i < data.length; i++) {
                images.push(
                    <div className="my-4">
                        <a className="link-success" href={`${window.location.origin}${data[i].image}`}>عکس {i + 1}</a>
                        <p className="d-inline"
                           style={{marginLeft: '5px', marginRight: '15px', fontSize: '12px', color: 'red'}}>حذف</p>
                        <input className="btn btn-link" style={{color: 'red'}}
                               type="checkbox" {...register(`del_${kind}Images_${data[i].id}`)} />
                    </div>
                )

            }
            return images
        }
    }

    const [refresh, setRefresh] = useState()
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(null)
    const [dialogColor, setDialogColor] = useState('green')

    const handleClose = () => {
        setOpenDialog(false);
        clearErrors('duplicateNameError')
        clearErrors('unhandledError')
        if (refresh) navigate(0)
    };
    const med = useAsyncValue()
    const optionList = useRef()
    useEffect(()=>{
        data.aparat_video_link = data.video_aparat_id ? `https://www.aparat.com/v/${data.video_aparat_id}` : ''
        data.medOptions = med.data
        data.selectedMed = data.medicinal_properties.map(option => {
            return {
                value: option.medicine,
                label: med.data.filter(med => med.id === option.medicine)[0].property_name,
                id: option.id
            }
        })
        optionList.current = data.medOptions.map(option => {
            return {value: option.id, label: option.property_name}
        })
        firstMedValues.current = data.medicinal_properties.map(obj => obj.medicine)
        setSelectedOptions(data.selectedMed)
    },[])

    const [selectedOptions, setSelectedOptions] = useState();

    function handleSelect(data) {
        setSelectedOptions(data);
    }
    async function onSubmit(fdata) {
        const formData = new FormData()
        formData.append('pk', data.id)
        const deleteFormData = new FormData()
        const stemFormData = new FormData()
        const leafFormData = new FormData()
        const habitatFormData = new FormData()
        const flowerFormData = new FormData()
        const fruitFormData = new FormData()
        var uploadErrors = []
        const numberOfImages = [data.flower_image_set.length, data.leaf_image_set.length,
            data.stem_image_set.length, data.habitat_image_set.length, data.fruit_image_set.length]
        for (const key in fdata) {
            if (key.includes('flower_')) {
                numberOfImages[0] += fdata[key].length
            } else if (key.includes('leaf_')) {
                numberOfImages[1] += fdata[key].length
            } else if (key.includes('stem_')) {
                numberOfImages[2] += fdata[key].length
            } else if (key.includes('habitat_') && (!key.includes("characteristics"))) {
                numberOfImages[3] += fdata[key].length
            } else if (key.includes('fruit_')) {
                numberOfImages[4] += fdata[key].length
            } else if (key.includes('del_flowerImages_')) {
                if (fdata[key]) numberOfImages[0]--
            } else if (key.includes('del_habitatImages_')) {
                if (fdata[key]) numberOfImages[3]--
            } else if (key.includes('del_stemImages_')) {
                if (fdata[key]) numberOfImages[2]--
            } else if (key.includes('del_leafImages_')) {
                if (fdata[key]) numberOfImages[1]--
            } else if (key.includes('del_fruitImages_')) {
                if (fdata[key]) numberOfImages[4]--
            }
        }
        if (numberOfImages[0] > 100) {
            setDialogMessage("تعداد عکس بیش از حد مجاز برای گل")
            setDialogColor('red')
            setOpenDialog(true)
            return
        }
        if (numberOfImages[1] > 100) {
            setDialogMessage("تعداد عکس بیش از حد مجاز برای برگ")
            setDialogColor('red')
            setOpenDialog(true)
            return
        }
        if (numberOfImages[2] > 100) {
            setDialogMessage("تعداد عکس بیش از حد مجاز برای ساقه")
            setDialogColor('red')
            setOpenDialog(true)
            return
        }
        if (numberOfImages[3] > 100) {
            setDialogMessage("تعداد عکس بیش از حد مجاز برای زیستگاه")
            setDialogColor('red')
            setOpenDialog(true)
            return
        }
        if (numberOfImages[4] > 100) {
            setDialogMessage("تعداد عکس بیش از حد مجاز برای میوه")
            setDialogColor('red')
            setOpenDialog(true)
            return
        }
        for (const key in fdata) {
            if (key.includes('image')) {
                if (fdata[key].length === 0) continue
                else formData.append('image', fdata[key][0])
            } else if (key === 'habitat_characteristics') {
                formData.append(key, fdata[key])
                continue
            } else if (key === 'aparat_video_link') {
                if (fdata[key] === '') formData.append(key, '')
                else if (data.aparat_video_link === '') formData.append(key, fdata[key])
                else if (fdata?.aparat_video_link.match(urlRegex)[1] !== data?.aparat_video_link.match(urlRegex)[1]) {
                    formData.append(key, fdata[key])
                }
            } else if (key.includes('flower_')) {
                for (const i of fdata[key]) {
                    flowerFormData.append('flower_image_set', i)
                }
            } else if (key.includes('leaf_')) {
                for (const i of fdata[key]) {
                    leafFormData.append('leaf_image_set', i)
                }
            } else if (key.includes('stem_')) {
                for (const i of fdata[key]) {
                    stemFormData.append('stem_image_set', i)
                }
            } else if (key.includes('habitat_') && (!key.includes("characteristics"))) {
                for (const i of fdata[key]) {
                    habitatFormData.append('habitat_image_set', i)
                }
            } else if (key.includes('fruit_')) {
                for (const i of fdata[key]) {
                    fruitFormData.append('fruit_image_set', i)
                }
            } else if (key.includes('del_flowerImages_')) {
                if (fdata[key]) deleteFormData.append('flower_id', key.split('_')[2])
            } else if (key.includes('del_habitatImages_')) {
                if (fdata[key]) deleteFormData.append('habitat_id', key.split('_')[2])
            } else if (key.includes('del_stemImages_')) {
                if (fdata[key]) deleteFormData.append('stem_id', key.split('_')[2])
            } else if (key.includes('del_leafImages_')) {
                if (fdata[key]) deleteFormData.append('leaf_id', key.split('_')[2])
            } else if (key.includes('del_fruitImages_')) {
                if (fdata[key]) deleteFormData.append('fruit_id', key.split('_')[2])
            } else {
                formData.append(key, fdata[key])
            }
        }
        if (selectedOptions) {
            for (const m of selectedOptions) {
                if (!firstMedValues.current.includes(m.value)) formData.append('medicinal_properties', m.value)
            }
        }
        const selectedOptionsValues = selectedOptions.map(obj => obj.value)
        for (const m of firstMedValues.current) {
            if (!selectedOptionsValues.includes(m)) {
                for (const x of data.medicinal_properties) {
                    if (x.medicine === m) {
                        deleteFormData.append('medicine_id', x.id)
                        break
                    }
                }
            }
        }
        try {
            const plant = await axios.put(`/plants/${data.id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            const deleteData = await axios.delete('/plants/delete/options/', {data: deleteFormData})
            stemFormData.append('plant_id', plant.data.id)
            leafFormData.append('plant_id', plant.data.id)
            fruitFormData.append('plant_id', plant.data.id)
            flowerFormData.append('plant_id', plant.data.id)
            habitatFormData.append('plant_id', plant.data.id)
        } catch (error) {
            console.log(error)
            if (error?.request?.response.includes("Plant with this Persian Name already exists") ||
                error?.request?.response.includes("Plant with this scientific Name already exists")) {
                setError('duplicateNameError', {
                    type: 'focus',
                    message: 'گیاهی با این نام از قبل وجود دارد!'
                }, {shouldFocus: true})
                setDialogMessage('گیاهی با این نام از قبل وجود دارد')
                setDialogColor('red')
                setOpenDialog(true)
            } else if (error?.response?.data === 'Video not found!') {
                setDialogMessage("ویدیوی آپارات با این لینک یافت نشد!")
                setDialogColor('red')
                setOpenDialog(true)
            } else if (error?.response?.data === 'Video link is not correct!') {
                setDialogMessage("لینک ویدیو آپارات نامعتبر!")
                setDialogColor('red')
                setOpenDialog(true)
            } else if (error?.response?.data === 'Video link already exists!') {
                setDialogMessage("گیاه دیگری با همین لینک ویدیو وجود دارد!")
                setDialogColor('red')
                setOpenDialog(true)
            } else {
                setDialogMessage("مشکلی در ثبت اطلاعات وجود دارد!")
                setDialogColor('red')
                setOpenDialog(true)
            }
            return
        }
        try {
            setUploadStatus('برگ')
            const leafData = await axios.post('/plants/leaf/', leafFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setProgress(progress);
                }
            })
        } catch (e) {
            uploadErrors.push('آپلود عکس های برگ با مشکل مواجه شد')
        }
        try {
            setUploadStatus('ساقه')
            const stemData = await axios.post('/plants/stem/', stemFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setProgress(progress);
                }
            })
        } catch (e) {
            uploadErrors.push('آپلود عکس های ساقه با مشکل مواجه شد')
        }
        try {
            setUploadStatus('گل')
            const flowerData = await axios.post('/plants/flower/', flowerFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setProgress(progress);
                }
            })
        } catch (e) {
            uploadErrors.push('آپلود عکس های گل با مشکل مواجه شد')
        }
        try {
            setUploadStatus('زیستگاه')
            const habitatData = await axios.post('/plants/habitat/', habitatFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setProgress(progress);
                }
            })
        } catch (e) {
            uploadErrors.push('آپلود عکس های زیستگاه با مشکل مواجه شد')
        }
        try {
            setUploadStatus('میوه')
            const fruitData = await axios.post('/plants/fruit/', fruitFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setProgress(progress);
                }
            })
        } catch (e) {
            uploadErrors.push('آپلود عکس های میوه با مشکل مواجه شد')
        }
        if (uploadErrors.length > 0) {
            setDialogMessage(uploadErrors.map((e, index) => {
                return (<p key={index}>{e}</p>)
            }))
            setDialogColor('red')
            setOpenDialog(true)
            setRefresh(true)
            return
        }
        setDialogMessage('اطلاعات جدید با موفقیت اضافه شد')
        setDialogColor('green')
        setOpenDialog(true)
        setRefresh(true)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className="d-flex flex-column mx-auto mt-5 form-wrapper fade-in">
            <div>
                <Dialog aria-describedby="dialog-content" open={openDialog}>
                    <DialogTitle>
                        <IconButton onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 5,
                                        top: 5,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                        >
                            <CloseRoundedIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <div
                                style={(errors?.duplicateNameError || errors.unhandledError) ? {color: 'red'} : {color: dialogColor}}>
                                {dialogMessage}
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">نام فارسی:</h5>
                <input defaultValue={data.persian_name}
                       className={"plant-input " + (errors.persian_name ? 'input-req' : 'input')}
                       type="text" {...register("persian_name", {required: true})} />
                {errors?.persian_name?.type === 'required' &&
                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">عکس اصلی:</h5>
                <input className="" type="file" {...register("image")} />
                {data.image && <a className="link-success mt-3 d-inline"
                                  href={baseUrl + data.image}>عکس فعلی</a>}
                {/* {errors?.image?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>} */}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">نام علمی:</h5>
                <input defaultValue={data.scientific_name}
                       className={"plant-input " + (errors.scientific_name ? 'input-req' : 'input')}
                       type="text" {...register("scientific_name", {required: true})} />
                {errors?.scientific_name?.type === 'required' &&
                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">تیره:</h5>
                <textarea defaultValue={data.family}
                          className={"plant-input plant-input-textarea " + (errors.family ? 'input-req' : 'input')}
                          type="text" {...register("family", {required: true})} />
                {errors?.family?.type === 'required' &&
                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">ریخت شناسی:</h5>
                <textarea defaultValue={data.morphology}
                          className={"plant-input plant-input-textarea " + (errors.morphology ? 'input-req' : 'input')}
                          type="text" {...register("morphology")} />
                {/*{errors?.morphology?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">زمان گل دهی:</h5>
                <textarea defaultValue={data.flowering_time}
                          className={"plant-input plant-input-textarea " + (errors.flowering_time ? 'input-req' : 'input')}
                          type="text" {...register("flowering_time")} />
                {/*{errors?.flowering_time?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">توزیع جغرافیایی:</h5>
                <textarea defaultValue={data.geographical_distribution}
                          className={"plant-input plant-input-textarea " + (errors.geographical_distribution ? 'input-req' : 'input')}
                          type="text" {...register("geographical_distribution")} />
                {/*{errors?.geographical_distribution?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}

            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">بوم شناسی:</h5>
                <textarea defaultValue={data.ecology}
                          className={"plant-input plant-input-textarea " + (errors.ecology ? 'input-req' : 'input')}
                          type="text" {...register("ecology")} />
                {/*{errors?.ecology?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">ویژگی های زیستگاه:</h5>
                <textarea defaultValue={data.habitat_characteristics}
                          className={"plant-input plant-input-textarea " + (errors.habitat_characteristics ? 'input-req' : 'input')}
                          type="text" {...register("habitat_characteristics")} />
                {/*{errors?.habitat_characteristics?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">اقلیم:</h5>
                <textarea defaultValue={data.climate}
                          className={"plant-input plant-input-textarea " + (errors.climate ? 'input-req' : 'input')}
                          type="text" {...register("climate")} />
                {/*{errors?.climate?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">ویژگی های خاک:</h5>
                <textarea defaultValue={data.soil_characteristics}
                          className={"plant-input plant-input-textarea " + (errors.soil_characteristics ? 'input-req' : 'input')}
                          type="text" {...register("soil_characteristics")} />
                {/*{errors?.soil_characteristics?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper">
                <h5 className="">لینک ویدیو آپارات:</h5>
                <input defaultValue={data.video_aparat_id ? `https://www.aparat.com/v/${data.video_aparat_id}` : ''} dir="ltr"
                       className={"plant-input " + (errors.aparat_video_link ? 'input-req' : 'input')} {...register("aparat_video_link", {
                    required: false,
                    pattern: urlRegex
                })}
                />
                {/*{errors?.aparat_video_link?.type === 'required' && <p role="alert" className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                {errors?.aparat_video_link?.type === 'pattern' &&
                    <p role="alert" className="mt-2" style={{color: 'red'}}>*لینک
                        نامعتبر</p>}

            </div>
            <div
                className="d-flex flex-column justify-content-center plant-input-wrapper mb-0 pb-5">
                <h5 className="">اطلاعات بیشتر:</h5>
                <textarea className="input plant-input plant-input-textarea"
                          defaultValue={data.more_info}
                          type="text" {...register("more_info")} />
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">خواص دارویی</p>
                </div>
                <div className="pt-3">
                    <Select
                        options={optionList.current}
                        placeholder="انتخاب کنید"
                        value={selectedOptions}
                        onChange={handleSelect}
                        isSearchable={true}
                        isMulti
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                primary25: 'rgb(25, 135, 84, 0.25)',
                                primary50: 'rgb(25, 135, 84, 0.5)',
                                primary75: 'rgb(25, 135, 84, 0.75)',
                                primary: 'rgb(25, 135, 84)',
                            },
                        })}
                    />
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center mt-5">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">عکس های برگ</p>
                    <div>
                        {numberOfInputs[0] >= 2 &&
                            <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        handleDeleteFileInput(0, 'leaf')
                                    }} style={{
                                color: '#00b409',
                                width: '35px'
                            }}>-</button>}
                        <button type='button' className="btn btn-light mx-2"
                                onClick={() => {
                                    handleAddFileInput(0)
                                }} style={{color: '#00b409', width: '35px'}}>+
                        </button>
                    </div>
                </div>
                <div className="mb-0 pb-0 plant-input-wrapper">
                    {
                        renderAlreadyAddedImages(data.leaf_image_set, 'leaf')
                    }
                </div>
                {
                    renderFileInputs(numberOfInputs[0], 'leaf')
                }
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">عکس های ساقه</p>
                    <div>
                        {numberOfInputs[1] >= 2 &&
                            <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        handleDeleteFileInput(1, 'stem')
                                    }} style={{
                                color: '#00b409',
                                width: '35px'
                            }}>-</button>}
                        <button type='button' className="btn btn-light mx-2"
                                onClick={() => {
                                    handleAddFileInput(1)
                                }} style={{color: '#00b409', width: '35px'}}>+
                        </button>
                    </div>
                </div>
                <div className="mb-0 pb-0 plant-input-wrapper">
                    {
                        renderAlreadyAddedImages(data.stem_image_set, 'stem')
                    }
                </div>
                {
                    renderFileInputs(numberOfInputs[1], 'stem')
                }
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">عکس های گل</p>
                    <div>
                        {numberOfInputs[2] >= 2 &&
                            <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        handleDeleteFileInput(2, 'flower')
                                    }} style={{
                                color: '#00b409',
                                width: '35px'
                            }}>-</button>}
                        <button type='button' className="btn btn-light mx-2"
                                onClick={() => {
                                    handleAddFileInput(2)
                                }} style={{color: '#00b409', width: '35px'}}>+
                        </button>
                    </div>
                </div>
                <div className="mb-0 pb-0 plant-input-wrapper">
                    {
                        renderAlreadyAddedImages(data.flower_image_set, 'flower')
                    }
                </div>
                {
                    renderFileInputs(numberOfInputs[2], 'flower')
                }
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">عکس های میوه</p>
                    <div>
                        {numberOfInputs[4] >= 2 &&
                            <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        handleDeleteFileInput(4, 'fruit')
                                    }} style={{
                                color: '#00b409',
                                width: '35px'
                            }}>-</button>}
                        <button type='button' className="btn btn-light mx-2"
                                onClick={() => {
                                    handleAddFileInput(4)
                                }} style={{color: '#00b409', width: '35px'}}>+
                        </button>
                    </div>
                </div>
                <div className="mb-0 pb-0 plant-input-wrapper">
                    {
                        renderAlreadyAddedImages(data.fruit_image_set, 'fruit')
                    }
                </div>
                {
                    renderFileInputs(numberOfInputs[4], 'fruit')
                }
            </div>
            <div className="d-flex flex-column justify-content-center mb-5">
                <div
                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                    <p className="mb-0">عکس های زیستگاه</p>
                    <div>
                        {numberOfInputs[3] >= 2 &&
                            <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        handleDeleteFileInput(3, 'habitat')
                                    }} style={{
                                color: '#00b409',
                                width: '35px'
                            }}>-</button>}
                        <button type='button' className="btn btn-light mx-2"
                                onClick={() => {
                                    handleAddFileInput(3)
                                }} style={{color: '#00b409', width: '35px'}}>+
                        </button>
                    </div>
                </div>
                <div className="mb-0 pb-0 plant-input-wrapper">
                    {
                        renderAlreadyAddedImages(data.habitat_image_set, 'habitat')
                    }
                </div>
                {
                    renderFileInputs(numberOfInputs[3], 'habitat')
                }
            </div>
            <button
                className="btn btn-success mx-auto mb-2 submit-btn">{isSubmitting ? (progress === 100 || uploadStatus === '' ? 'در حال ثبت ، لطفا صبر کنید ...' : `در حال آپلود عکس های ${uploadStatus} - ${progress}%`) : 'ثبت'}</button>
        </form>
    )
}

const urlRegex = /^(?:https?:\/\/)?(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)(([!"#$%[\]&'()*+,-.:;<=>?@^_`{|}~\\/]).*|($))/
const acceptedImageFormats = '.bmp,.dib,.gif,.tif,.tiff,.jfif,.jpe,.jpg,.jpeg,.pbm,.pgm,.ppm,.pnm,.png,.apng,.blp,.bufr,.cur,.pcx,.dcx,.dds,.ps,.eps,.fit,.fits,.fli,.flc,.ftc,.ftu,.gbr,.grib,.h5,.hdf,.jp2,.j2k,.jpc,.jpf,.jpx,.j2c,.icns,.ico,.im,.iim,.mpg,.mpeg,.mpo,.msp,.palm,.pcd,.pdf,.pxr,.psd,.bw,.rgb,.rgba,.sgi,.ras,.tga,.icb,.vda,.vst,.webp,.wmf,.emf,.xbm,.xpm'
