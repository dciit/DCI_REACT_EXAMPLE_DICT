import { Outlet } from "react-router";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from '../src/redux/store'
import ToolbarComponent from "./components/toolbar.comp";
function Layout() {
    const dispatch = useDispatch();
    const VITE_REV = parseFloat(import.meta.env.VITE_VERSION);
    const reducer = useSelector((state: any) => state.reducer);
    const redexRev = reducer?.rev;
    try {
        if (redexRev != VITE_REV) {
            persistor.purge();
            dispatch({ type: 'SET_REV', payload: VITE_REV });
        }
    } catch {
        persistor.purge();
        location.reload();
    }
    return <Stack className='h-[100%] w-[100%]'>
        <ToolbarComponent />
        <div className='grow sm:px-[2.75%] md:px-[2.75%] xl:px-[2.75%] py-10  flex flex-col gap-2 overflow-auto'>
            <Outlet />
        </div>
    </Stack >
}

export default Layout