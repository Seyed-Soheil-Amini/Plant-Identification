// import React from 'react'
import {Form, Link, redirect, useActionData, useLoaderData, useNavigation} from "react-router-dom";
import { loginAxios, refreshAxios } from '../assets/assets'

export async function loader({ request }) {
    if(!localStorage.getItem('lr') || !localStorage.getItem('username')){
        return new URL(request.url).searchParams.get("message")
    }
    try {
        if(Date.parse(localStorage.getItem('lr')) < ((new Date()) - 5*60000)){
            const data = await refreshAxios.post('/refresh/token/')
            if (data?.status === 200) return redirect('/dashboard')
        }
        else {
            return redirect('/dashboard')
        }
    }
    catch (error) {
        if (!error?.response) return "مشکلی در ارتباط وجود دارد، اتصال اینترنت خود را بررسی کنید!"
        else if (error?.response?.status === 401) return null
    }
}

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")
    if (password === "" || username === "") {
        return 'فیلد های نام کاربری و گذرواژه نمیتوانند خالی باشند!'
    }
    try {
        const data = await loginAxios.post('/login/', {
            'username': username,
            'password': password
        })
        localStorage.setItem('username', data.data.username)
        localStorage.setItem('lr', new Date())
        return redirect('/dashboard')
    }
    catch (error) {
        if (error?.response?.status === 401) return "نام کاربری یا گذرواژه اشتباه است!"
        else if (!error?.response) return "مشکلی در ارتباط وجود دارد، اتصال اینترنت خود را بررسی کنید!"
    }
}

export default function Login() {
    const error = useActionData()
    var message = useLoaderData()
    const navigation = useNavigation()
    if(message === 'You must log in first!'){
        message = 'ابتدا باید وارد حساب کاربری خود شوید!'
    }
    else if(message === 'There was some problem.You must log in again!'){
        message = 'مشکلی رخ داده است، لطفا مجدد وارد شوید!'
    }


    return (
        <div className="d-flex flex-column h-100 w-100 justify-content-center" style={{minHeight: '100vh'}} >
            <Form method="post" className="d-flex mx-auto mb-4 login-form fade-in" replace>
                <div className="m-auto w-75">
                    <label htmlFor="username" className="mx-auto" >نام کاربری :</label>
                    <input dir="ltr" name="username" type="text" id="username" className="input mb-3 mx-auto mt-1" />
                    <label htmlFor="password" className="mx-auto">گذرواژه :</label>
                    <input dir="ltr" name="password" type="password" id="password" className="input mx-auto mt-1" />
                    <button disabled={navigation.state === "submitting"} className="d-block btn btn-success mt-5 mx-auto" style={{height: '50px', minWidth: '100px'}}>{navigation.state === "submitting"
                        ? "در حال ورود ..."
                        : "ورود"
                    }</button>
                    {error && <p className="pt-3 text-center">{error}</p>}
                    {(message && !error) && <p className="pt-3 text-center">{message}</p>}
                </div>
            </Form>
            <Link className="text-center mx-auto myDropdown-item" reloadDocument to={window.location.origin}>صفحه اصلی سایت</Link>
        </div>
    )
}