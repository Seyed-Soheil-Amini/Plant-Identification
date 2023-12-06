/* eslint-disable no-unused-vars */
// import { useState } from "react"
import axios from "axios"
import requireAuth from "../assets/assets"
import {Await, defer, Link, useAsyncValue, useLoaderData} from "react-router-dom"
import {Suspense, useState} from "react"
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {CircularProgress} from "@mui/material";

export async function loader({request}) {
    await requireAuth()
    const data = axios.get('/plants/data/', {
        withCredentials: true
    })
    return defer({data: data})
}


export default function Dashboard() {
    //-----------------------checkbox-----------------------
    const [selectedItems, setSelectedItems] = useState([])


    //-----------------------checkbox-----------------------
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm();

    async function onSubmit() {
        const formData = new FormData()
        for (const id of selectedItems) {
            formData.append('id', id)
        }
        try {
            const deleteData = await axios.delete('/plants/delete/', {data: formData})
            setSelectedItems([])
            setDialogMessage('حذف با موفقیت انجام شد')
            setOpenDialog(true)
        } catch (error) {
            console.log(error)
        }
    }


    const data = useLoaderData()

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(null)

    const handleClose = () => {
        setOpenDialog(false);
        navigate(0)
    };


    return (
        <Suspense fallback={<div className='d-flex w-100 h-100'><CircularProgress className='m-auto' style={{
            width: '60px',
            height: '60px'
        }} color='success'/></div>}>
            <form onSubmit={handleSubmit(onSubmit)} method="post" className="mx-auto w-100 fade-in">
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
                                {dialogMessage}
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="d-flex flex-column h-100 w-100 mt-5">
                    <div className="d-flex dashboard-top-flex justify-content-between mx-auto align-items-stretch">
                        <input onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }} className="input search-input" type="text" placeholder="جست و جو در گیاهان"/>
                        <div className='dashboard-buttons-flex'>
                            <button type="button" onClick={() => navigate('./plants/add')}
                                    className="btn btn-success mt-0 p-3 addBtn">گیاه جدید
                            </button>
                            {selectedItems.length > 0 && <button style={{marginRight: '5px'}}
                                                                 className="btn btn-danger mt-0 p-3 addBtn">{isSubmitting ? 'در حال حذف' : 'حذف موارد انتخاب شده'}</button>}
                        </div>
                    </div>
                    <div className="table-responsive mx-auto mt-4 table-wrapper">
                        <Await resolve={data.data}>
                            <Table searchQuery={searchQuery} selectedItems={selectedItems}
                                   setSelectedItems={setSelectedItems} register={register}/>
                        </Await>
                    </div>
                </div>
            </form>
        </Suspense>
    )
}


function Table({searchQuery, selectedItems, register, setSelectedItems}) {
    const {data} = useAsyncValue()
    data.allIds = data.map(p => p.id)
    const filteredData = data.filter(row => {
        return Object.values(row).filter(value => typeof value === 'string').some(value =>
            // eslint-disable-next-line react/prop-types
            value.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleItemSelection = (event, itemId) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        }
    };

    function handleSelectAll(event) {
        if (event.target.checked) setSelectedItems(data.allIds)
        else setSelectedItems([])
    }

    const renderTableItems = filteredData.map((item, index) => {
        return (
            <tr key={item.id}
                style={selectedItems.includes(item.id) ? {backgroundColor: 'rgb(100, 233, 134,0.3)'} : {}}>
                <th><input type="checkbox" name={`plant_${item.id}`}
                           checked={selectedItems.includes(item.id)}
                           onChange={(event) => handleItemSelection(event, item.id)}
                /></th>
                <th scope="row">{index + 1}</th>
                <td>{item.persian_name}</td>
                <td>{item.scientific_name}</td>
                <td>
                    <button type="button" className="btn btn-success my-0 p-2"><Link
                        to={`plants/${item.id}`}>ویرایش</Link></button>
                </td>
            </tr>
        )
    })
    return (
        <>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th><input type="checkbox" {...register("selectAll")} onChange={handleSelectAll}/></th>
                    <th scope="col">شماره</th>
                    <th scope="col">نام فارسی</th>
                    <th scope="col">نام علمی</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {renderTableItems}
                </tbody>
            </table>
            <p>تعداد کل : {data.length}</p>
        </>
    )
}




