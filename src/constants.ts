import { LineProps } from "./interface/aps.interface";

const base = 'dashboard';
const hrapi = 'https://scm.dci.co.th/hrapi';
const manpowerapi = 'https://localhost:7094';
const apsapi = 'https://localhost:7094'
const projectName = 'DCI Dashboard';
const imagepath = 'http://dcidmc.dci.daikin.co.jp/PICTURE/';
const dateFormat = 'DD/MM/YYYY'
const contact = 'ติดต่อ เบียร์ IT (250)'
const lines:LineProps[] = [
    { text: 'Machine', value: 'MC' },
    { text: 'Casing', value: 'CASING' },
    { text: 'Motor', value: 'MOTOR' }
]
export { hrapi, projectName, imagepath, base, manpowerapi, apsapi, dateFormat, contact, lines }