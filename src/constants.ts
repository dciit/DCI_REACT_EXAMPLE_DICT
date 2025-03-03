    import { LineProps } from "./interface/aps.interface";
    const base = 'aps';
    const ver = 8.6;
    const hrapi = 'https://scm.dci.co.th/hrapi';
    const manpowerapi = 'http://dciweb.dci.daikin.co.jp/apsapi';
    const checkinapi = 'http://dciweb.dci.daikin.co.jp/dcimanpowerapi'
    const projectName = 'DCI Dashboard';
    const imagepath = 'http://dcidmc.dci.daikin.co.jp/PICTURE/';
    const dateFormat = 'DD/MM/YYYY'
    const contact = 'ติดต่อ เบียร์ IT (250)'
    const lines: LineProps[] = [
        { text: 'Machine', value: 'mc' },
        { text: 'Casing', value: 'casing' },
        { text: 'Motor', value: 'motor' }
    ]
    const empcode = '41256';
    const apiSoapLogin = 'http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?';
    const intervalTime = 20000;
    const apsapi = 'https://localhost:7094'
    // const apsapi = 'http://dciweb.dci.daikin.co.jp/apsapi'
    const bgCard = 'bg-[#1e1f23]';
    const bgMain = 'bg-gradient-to-r from-violet-600/50 to-indigo-600/5';
    const bgSubline = 'bg-gradient-to-r from-sky-600/50 to-sky-600/5';
    const txtSuccess = 'text-[#26f0cb]'
    const styleTxtPrimary = 'text-[#2196f3]'
    const colorYellowMstr = 'text-[#eab308]'
    export {colorYellowMstr,styleTxtPrimary, txtSuccess, bgMain, bgSubline, bgCard, intervalTime, hrapi, ver, projectName, imagepath, base, manpowerapi, checkinapi, apsapi, dateFormat, contact, lines, empcode, apiSoapLogin }