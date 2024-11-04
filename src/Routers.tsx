import { BrowserRouter, Routes, Route } from "react-router-dom";
import { base } from "./constants";
// import { version } from '../package.json';

import Layout from "./layout";
import ApsCheckIn from "./pages/aps.checkin";
import Manpower from "./pages/manpower";
import ApsMain from "./pages/aps.main";
import ApsBackflush from "./pages/aps.backflush";
import ApsSubLine from "./pages/aps.subline";
import AdjStock from "./pages/aps.adj.stock";
// import CacheBuster from 'react-cache-buster';
// import Loading from "./components/loading";
import ApsInOut from "./pages/aps.in.out";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { persistor } from "./redux/store";
import emptyCache from "./service/aps.service";
// import APSMonitor from "./pages/aps.monitor";
// import ApsTest2 from "./pages/aps.test2";
// import SaleForecaseDev from "../pages/saleforecase-dev";
const Routers = () => {
    let VER = import.meta.env.VITE_VERSION;
    const redux = useSelector((state: any) => state.redux);
    const dispatch = useDispatch();
    useEffect(() => {
        if (typeof redux.rev == 'undefined' || redux.rev != VER) {
            localStorage.clear();
            emptyCache();
            persistor.purge();
            dispatch({ type: 'RESET' });
            dispatch({ type: 'SET_VERSION', payload: VER });
        }
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={`/${base}/*`} element={<ApsMain />} />
                    <Route path={`/${base}/checkin`} element={<ApsCheckIn />} />
                    <Route path={`/${base}/manpower`} element={<Manpower />} />
                    <Route path={`/${base}/main`} element={<ApsMain />} />
                    <Route path={`/${base}/backflush`} element={<ApsBackflush />} />
                    <Route path={`/${base}/subline`} element={<ApsSubLine />} />
                    <Route path={`/${base}/adjstock`} element={<AdjStock />} />
                    <Route path={`/${base}/inout`} element={<ApsInOut />} />
                </Route>
                {/* <Route path={`/${base}/test`} element={<APSMonitor />} /> */}
                {/* <Route path={`/${base}/test2`} element={<ApsTest2 />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;