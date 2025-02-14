import { Outlet } from "react-router";
import { Stack } from "@mui/material";
import ToolbarComponent from "./components/toolbar.component";
function Layout() {
    return <Stack className='h-[100%] w-[100%]'>
        <ToolbarComponent />
        <div className=' grow sm:px-[1%] md:px-[1%] xl:px-[1%] sm:py-[1%] md:py-[1%] xl:py-[1%]  flex flex-col gap-2 overflow-auto h-[100%]'>
            <Outlet />
        </div>
    </Stack >
}

export default Layout