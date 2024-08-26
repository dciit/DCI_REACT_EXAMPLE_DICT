import { LineProps } from "./interface/aps.interface";
const base = 'aps';
const ver = 5.2;
const hrapi = 'https://scm.dci.co.th/hrapi';
const manpowerapi = 'http://dciweb.dci.daikin.co.jp/apsapi';
const checkinapi = 'http://dciweb.dci.daikin.co.jp/dcimanpowerapi'

const projectName = 'DCI Dashboard';
const imagepath = 'http://dcidmc.dci.daikin.co.jp/PICTURE/';
const dateFormat = 'DD/MM/YYYY'
const contact = 'ติดต่อ เบียร์ IT (250)'
const lines: LineProps[] = [
    { text: 'Machine', value: 'MC' },
    { text: 'Casing', value: 'CASING' },
    { text: 'Motor', value: 'MOTOR' }
]
const empcode = '41256';
const apiSoapLogin = 'http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?';
const intervalTime = 15000;
// const apsapi = 'https://localhost:7094'
const apsapi = 'http://dciweb.dci.daikin.co.jp/apsapi'

export { intervalTime,hrapi, ver, projectName, imagepath, base, manpowerapi, checkinapi, apsapi, dateFormat, contact, lines, empcode, apiSoapLogin }