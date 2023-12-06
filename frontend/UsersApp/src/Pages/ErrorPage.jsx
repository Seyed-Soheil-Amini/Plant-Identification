import {Link, useRouteError} from "react-router-dom"
import {useNavigate} from "react-router-dom";

export default function Notfound() {
    const error = useRouteError()
    const navigate = useNavigate()
    console.log(error)
    function renderError () {
        if(error?.message === 'Network Error') {
            return (
                <div className="d-flex flex-column align-items-center justify-content-center mx-auto"  >
                    <h3 className="w-100 text-center px-5">مشکلی در ارتباط جود دارد، اتصال اینترنت خود را چک کرده و بار دیگر تلاش کنید!</h3>
                    <button type='button' onClick={() => navigate(0)} className="btn btn-danger">تلاش دوباره</button>
                </div>
            )
        }
        else if(error?.response?.status === 404) {
            return (
                <div className="d-flex flex-column align-items-center justify-content-center mx-auto">
                    <h2 className="w-100 text-center px-5" >404 - صفحه مورد نظر یافت نشد</h2>
                    <Link to="/dashboard" className="link-danger">بازگشت به داشبورد</Link>
                </div>
            )
        }
        else {
            return (
                <div className="d-flex flex-column align-items-center justify-content-center w-100" >
                    <h2 className="mx-auto text-center w-100 text-center px-5" >خطای برنامه - با تیم پشتیبانی تماس حاصل کنید</h2>
                </div>
            )
        }
    }
    return (
        renderError()
    )
}