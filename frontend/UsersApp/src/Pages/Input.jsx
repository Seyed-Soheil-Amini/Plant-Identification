/* eslint-disable no-unused-vars */
import {Await, defer, useLoaderData, useNavigate} from "react-router-dom"
import requireAuth from "../assets/assets"
import {Suspense, useRef, useState} from "react"
import {useForm} from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {CircularProgress} from "@mui/material";


export async function loader() {
    // await requireAuth()
    // const data = await axios.get('/plants/medicine/')
    // return data.data
    await requireAuth()
    const data = axios.get('/plants/medicine/')
    return defer({
        data: data
    })
}

export default function Input() {
    // -----------------------Select---------------------------
    const medOptions = useLoaderData()
    const [selectedOptions, setSelectedOptions] = useState();
    // const optionList = medOptions.map(option => {
    //     return {value: option.id, label: option.property_name}
    // })

    function handleSelect(data) {
        setSelectedOptions(data);
    }

    // -----------------------Select---------------------------


    const [numberOfInputs, setNumberOfInputs] = useState([1, 1, 1, 1, 1])
    const {register, handleSubmit, unregister, setError, clearErrors, formState: {errors, isSubmitting}} = useForm();
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('')
    const navigate = useNavigate()

    async function onSubmit(data) {
        const formData = new FormData()
        const stemFormData = new FormData()
        const leafFormData = new FormData()
        const habitatFormData = new FormData()
        const flowerFormData = new FormData()
        const fruitFormData = new FormData()
        const numberOfImages = [0, 0, 0, 0, 0]
        var uploadErrors = []
        for (const key in data) {
            if (key.includes('flower_')) {
                numberOfImages[0] += data[key].length
            } else if (key.includes('leaf_')) {
                numberOfImages[1] += data[key].length
            } else if (key.includes('stem_')) {
                numberOfImages[2] += data[key].length
            } else if (key.includes('habitat_') && (!key.includes("characteristics"))) {
                numberOfImages[3] += data[key].length
            } else if (key.includes('fruit_')) {
                numberOfImages[4] += data[key].length
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
        for (const key in data) {
            if (key.includes('image')) {
                formData.append('image', data['image'][0])
            }
            if (key === 'habitat_characteristics') {
                formData.append(key, data[key])
            }
            if (key.includes('flower_')) {
                for (const i of data[key]) {
                    flowerFormData.append('flower_image_set', i)
                }
            } else if (key.includes('leaf_')) {
                for (const i of data[key]) {
                    leafFormData.append('leaf_image_set', i)
                }
            } else if (key.includes('stem_')) {
                for (const i of data[key]) {
                    stemFormData.append('stem_image_set', i)
                }
            } else if (key.includes('habitat_') && (!key.includes("characteristics"))) {
                for (const i of data[key]) {
                    habitatFormData.append('habitat_image_set', i)
                }
            } else if (key.includes('fruit_')) {
                for (const i of data[key]) {
                    fruitFormData.append('fruit_image_set', i)
                }
            } else if (key === 'aparat_video_link') {
                formData.append(key,data[key])
            } else {
                formData.append(key, data[key])
            }
        }
        if (selectedOptions) {
            for (const m of selectedOptions) {
                formData.append('medicinal_properties', m.value)
            }
        }
        try {
            const plant = await axios.post('/plants/data/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            stemFormData.append('plant_id', plant.data.id)
            leafFormData.append('plant_id', plant.data.id)
            fruitFormData.append('plant_id', plant.data.id)
            flowerFormData.append('plant_id', plant.data.id)
            habitatFormData.append('plant_id', plant.data.id)
            redirectUrl.current = `/dashboard/plants/${plant.data.id}`
        } catch (error) {
            console.log(error)
            if (error?.request?.response.includes("Plant with this Persian Name already exists") ||
                error?.request?.response.includes("Plant with this scientific Name already exists")) {
                setError('duplicateNameError', {
                    type: 'focus',
                    message: 'گیاهی با این نام از قبل وجود دارد!'
                }, { shouldFocus: true })
                setDialogMessage('گیاهی با این نام از قبل وجود دارد')
                setDialogColor('red')
                setOpenDialog(true)
            }
            else if (error?.response?.data === 'Video not found!') {
                setDialogMessage("ویدیوی آپارات با این لینک یافت نشد!")
                setDialogColor('red')
                setOpenDialog(true)
            }
            else if (error?.response?.data === 'Video link is not correct!') {
                setDialogMessage("لینک ویدیو آپارات نامعتبر!")
                setDialogColor('red')
                setOpenDialog(true)
            }
            else if (error?.response?.data === 'Video link already exists!') {
                setDialogMessage("گیاه دیگری با همین لینک ویدیو وجود دارد!")
                setDialogColor('red')
                setOpenDialog(true)
            }
            else {
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
            setRedirect(true)
            return
        }
        redirectUrl.current = '/dashboard'
        setDialogMessage('اطلاعات جدید با موفقیت اضافه شد')
        setDialogColor('green')
        setOpenDialog(true)
        setRedirect(true)
    }

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

    const [redirect, setRedirect] = useState()
    const redirectUrl = useRef('')
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(null)
    const [dialogColor, setDialogColor] = useState('green')

    const handleClose = () => {
        setOpenDialog(false);
        clearErrors('duplicateNameError')
        clearErrors('unhandledError')
        if (redirect) navigate(redirectUrl.current)
    };

    return (
        <Suspense fallback={<div className='d-flex w-100 h-100'><CircularProgress className='m-auto' style={{
            width: '60px',
            height: '60px'
        }} color='success'/></div>}>
            <Await resolve={medOptions.data}>
                {({data}) => {
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
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">نام فارسی:</h5>
                                <input className={"plant-input " + (errors.persian_name ? 'input-req' : 'input')}
                                       type="text" {...register("persian_name", {required: true})} />
                                {errors?.persian_name?.type === 'required' &&
                                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">عکس اصلی:</h5>
                                <input className="" type="file"
                                       accept={acceptedImageFormats} {...register("image", {required: true})} />
                                {errors?.image?.type === 'required' &&
                                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">نام علمی:</h5>
                                <input className={"plant-input " + (errors.scientific_name ? 'input-req' : 'input')}
                                       type="text" {...register("scientific_name", {required: true})} />
                                {errors?.scientific_name?.type === 'required' &&
                                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">تیره:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.family ? 'input-req' : 'input')}
                                    type="text" {...register("family", {required: true})} />
                                {errors?.family?.type === 'required' &&
                                    <p className="mt-2" style={{color: 'red'}}>*فیلد اجباری</p>}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">ریخت شناسی:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.morphology ? 'input-req' : 'input')}
                                    type="text" {...register("morphology")} />
                                {/*{errors?.morphology?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">زمان گل دهی:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.flowering_time ? 'input-req' : 'input')}
                                    type="text" {...register("flowering_time")} />
                                {/*{errors?.flowering_time?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">توزیع جغرافیایی:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.geographical_distribution ? 'input-req' : 'input')}
                                    type="text" {...register("geographical_distribution")} />
                                {/*{errors?.geographical_distribution?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">بوم شناسی:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.ecology ? 'input-req' : 'input')}
                                    type="text" {...register("ecology")} />
                                {/*{errors?.ecology?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">ویژگی های زیستگاه:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.habitat_characteristics ? 'input-req' : 'input')}
                                    type="text" {...register("habitat_characteristics")} />
                                {/*{errors?.habitat_characteristics?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">اقلیم:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.climate ? 'input-req' : 'input')}
                                    type="text" {...register("climate")} />
                                {/*{errors?.climate?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">ویژگی های خاک:</h5>
                                <textarea
                                    className={"plant-input plant-input-textarea " + (errors.soil_characteristics ? 'input-req' : 'input')}
                                    type="text" {...register("soil_characteristics")} />
                                {/*{errors?.soil_characteristics?.type === 'required' && <p className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper">
                                <h5 className="">لینک ویدیو آپارات:</h5>
                                <input dir="ltr"
                                       className={"plant-input " + (errors?.aparat_video_link?.type ? 'input-req' : 'input')} {...register("aparat_video_link", {
                                    required: false,
                                    pattern: {value: urlRegex}
                                })} placeholder='https://www.aparat.com/v/abcde'
                                />
                                {errors?.aparat_video_link?.type === 'pattern' &&
                                    <p role="alert" className="mt-2" style={{color: 'red'}}>*لینک نامعتبر</p>}
                                {/*{errors?.aparat_video_link?.type === 'required' && <p role="alert" className="mt-2" style={{ color: 'red' }}>*فیلد اجباری</p>}*/}
                            </div>
                            <div className="d-flex flex-column justify-content-center plant-input-wrapper mb-0 pb-5">
                                <h5 className="">اطلاعات بیشتر:</h5>
                                <textarea className="input plant-input plant-input-textarea"
                                          type="text" {...register("more_info")} />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <div
                                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                                    <p className="mb-0">خواص دارویی</p>
                                </div>
                                <div className="pt-3">
                                    <Select
                                        options={data.map(option => {
                                            return {value: option.id, label: option.property_name}
                                        })}
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
                                            <button type='button' className="btn btn-light" onClick={() => {
                                                handleDeleteFileInput(0, 'leaf')
                                            }} style={{color: '#00b409', width: '35px'}}>-</button>}
                                        <button type='button' className="btn btn-light mx-2" onClick={() => {
                                            handleAddFileInput(0)
                                        }} style={{color: '#00b409', width: '35px'}}>+
                                        </button>
                                    </div>
                                </div>
                                {
                                    renderFileInputs(numberOfInputs[0], 'leaf')
                                }
                                {/* {errors?.maxImageNumber?.leaf && <p className="mt-2" style={{ color: 'red' }}>*{errors.maxImageNumber.leaf.message}</p>} */}
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <div
                                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                                    <p className="mb-0">عکس های ساقه</p>
                                    <div>
                                        {numberOfInputs[1] >= 2 &&
                                            <button type='button' className="btn btn-light" onClick={() => {
                                                handleDeleteFileInput(1, 'stem')
                                            }} style={{color: '#00b409', width: '35px'}}>-</button>}
                                        <button type='button' className="btn btn-light mx-2" onClick={() => {
                                            handleAddFileInput(1)
                                        }} style={{color: '#00b409', width: '35px'}}>+
                                        </button>
                                    </div>
                                </div>
                                {
                                    renderFileInputs(numberOfInputs[1], 'stem')
                                }
                                {/* {errors?.stemMaxImageNumber && <p className="mt-2" style={{ color: 'red' }}>*{errors.stemMaxImageNumber.message}</p>} */}

                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <div
                                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                                    <p className="mb-0">عکس های گل</p>
                                    <div>
                                        {numberOfInputs[2] >= 2 &&
                                            <button type='button' className="btn btn-light" onClick={() => {
                                                handleDeleteFileInput(2, 'flower')
                                            }} style={{color: '#00b409', width: '35px'}}>-</button>}
                                        <button type='button' className="btn btn-light mx-2" onClick={() => {
                                            handleAddFileInput(2)
                                        }} style={{color: '#00b409', width: '35px'}}>+
                                        </button>
                                    </div>
                                </div>
                                {
                                    renderFileInputs(numberOfInputs[2], 'flower')
                                }
                                {/* {errors?.flowerMaxImageNumber && <p className="mt-2" style={{ color: 'red' }}>*{errors.flowerMaxImageNumber.message}</p>} */}

                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <div
                                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                                    <p className="mb-0">عکس های میوه</p>
                                    <div>
                                        {numberOfInputs[4] >= 2 &&
                                            <button type='button' className="btn btn-light" onClick={() => {
                                                handleDeleteFileInput(4, 'fruit')
                                            }} style={{color: '#00b409', width: '35px'}}>-</button>}
                                        <button type='button' className="btn btn-light mx-2" onClick={() => {
                                            handleAddFileInput(4)
                                        }} style={{color: '#00b409', width: '35px'}}>+
                                        </button>
                                    </div>
                                </div>
                                {
                                    renderFileInputs(numberOfInputs[4], 'fruit')
                                }
                                {/* {errors?.fruitMaxImageNumber && <p className="mt-2" style={{ color: 'red' }}>*{errors.fruitMaxImageNumber.message}</p>} */}

                            </div>
                            <div className="d-flex flex-column justify-content-center mb-5">
                                <div
                                    className="d-flex flex-row justify-content-between align-items-center input-section-title px-3">
                                    <p className="mb-0">عکس های زیستگاه</p>
                                    <div>
                                        {numberOfInputs[3] >= 2 &&
                                            <button type='button' className="btn btn-light" onClick={() => {
                                                handleDeleteFileInput(3, 'habitat')
                                            }} style={{color: '#00b409', width: '35px'}}>-</button>}
                                        <button type='button' className="btn btn-light mx-2" onClick={() => {
                                            handleAddFileInput(3)
                                        }} style={{color: '#00b409', width: '35px'}}>+
                                        </button>
                                    </div>
                                </div>
                                {
                                    renderFileInputs(numberOfInputs[3], 'habitat')
                                }
                            </div>
                            {/* {errors?.habitatMaxImageNumber && <p className="mt-2" style={{ color: 'red' }}>*{errors.habitatMaxImageNumber.message}</p>} */}

                            <button
                                className="btn btn-success mx-auto mb-2 submit-btn">{isSubmitting ? (progress === 100 || uploadStatus === '' ? 'در حال ثبت ، لطفا صبر کنید ...' : `در حال آپلود عکس های ${uploadStatus} - ${progress}%`) : 'ثبت'}</button>
                        </form>
                    )
                }}
            </Await>
        </Suspense>
    )
}


const acceptedImageFormats = '.bmp,.dib,.gif,.tif,.tiff,.jfif,.jpe,.jpg,.jpeg,.pbm,.pgm,.ppm,.pnm,.png,.apng,.blp,.bufr,.cur,.pcx,.dcx,.dds,.ps,.eps,.fit,.fits,.fli,.flc,.ftc,.ftu,.gbr,.grib,.h5,.hdf,.jp2,.j2k,.jpc,.jpf,.jpx,.j2c,.icns,.ico,.im,.iim,.mpg,.mpeg,.mpo,.msp,.palm,.pcd,.pdf,.pxr,.psd,.bw,.rgb,.rgba,.sgi,.ras,.tga,.icb,.vda,.vst,.webp,.wmf,.emf,.xbm,.xpm'
const urlRegex = /^(?:https?:\/\/)?(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)(([!"#$%[\]&'()*+,-.:;<=>?@^_`{|}~\\/]).*|($))/




