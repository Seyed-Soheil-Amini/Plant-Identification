import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
import axios from "axios";

export default function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    async function handleLogout() {
        localStorage.removeItem('lr')
        localStorage.removeItem('username')
        try {
            await axios.post('/logout/')
        } catch (e) {
            console.log(e)
        }
        navigate('/login')
    }
    return (
        <div className="d-flex flex-column h-100 mx-auto pt-0 dashboard-wrapper">
            <div className="d-flex dashboard-header mb-1 mt-0 justify-content-center">
                <div className="d-flex dashboard-header-flex h-100 text-center align-items-center justify-content-between">
                        <div className="dropdown">
                            <span className="mb-0">{localStorage.getItem('username')}</span>
                            <div className="dropdown-content">
                                <button type="button" className="backbtn myDropdown-item" onClick={handleLogout}>خروج</button>
                            </div>
                        </div>
                    <div className="text-center">
                        <Link className="text-center" reloadDocument to={window.location.origin}>صفحه اصلی سایت</Link>
                        {location.pathname !== '/dashboard' && <><span> |</span><button type="button" className="backbtn" onClick={() => { navigate(-1) }} >بازگشت</button></>}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-grow-1 align-items-center w-100" style={{ marginTop: '25px' }}>
                <Outlet />
            </div>
        </div>
    )
}