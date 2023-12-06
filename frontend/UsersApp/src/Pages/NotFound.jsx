import { Link } from "react-router-dom"

export default function Notfound() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }} >
            <h1 className="w-100 text-center" >404 - صفحه مورد نظر یافت نشد!</h1>
            <Link to="/dashboard" className="link-success">بازگشت به داشبورد</Link>
        </div>

    )
}