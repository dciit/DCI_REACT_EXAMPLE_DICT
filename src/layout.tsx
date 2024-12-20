import { Outlet } from "react-router";
import { Stack } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { persistor } from '../src/redux/store'
import ToolbarComponent from "./components/toolbar.comp";
// import { useEffect } from "react";
function Layout() {
    // useEffect(() => {
    //     fetch('/meta.json') // ไฟล์ meta.json ควรมีข้อมูลเวอร์ชันของแอป
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data)
    //             const currentVersion = localStorage.getItem('appVersion');
    //             if (currentVersion && currentVersion !== data.version) {
    //                 localStorage.setItem('appVersion', data.version);
    //                 window.location.reload(); // รีเฟรชหน้าเว็บ
    //             } else {
    //                 localStorage.setItem('appVersion', data.version);
    //             }
    //         });
    // }, []);
    return <Stack className='h-[100%] w-[100%]'>
        <ToolbarComponent />
        <div className=' grow sm:px-[1%] md:px-[1%] xl:px-[1%] sm:py-[1%] md:py-[1%] xl:py-[1%]  flex flex-col gap-2 overflow-auto h-[100%]'>
            <Outlet />
        </div>
    </Stack >
}

export default Layout