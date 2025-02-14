export interface PropsBackflushFilter {
    ymd?: string;
    line?: string;
}
export interface MRedux {
    login: boolean;
    empcode: string;
    img: string;
    name: string;
    surn: string;
    fullName: string;
    backflush?: PropsBackflushFilter;
    page?: string;
    rev?: string;
    plant: string;
    line: string;
    filter: any;
}
const initialState: MRedux = {
    login: false,
    empcode: '',
    img: '',
    fullName: '',
    name: '',
    surn: '',
    rev: '',
    plant: '',
    line: '',
    filter: { plant: '', line: '' },
}

const IndexReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'RESET':
            return { ...initialState };
        case 'LOGIN':
            return {
                ...state,
                login: true,
                empcode: action.payload.empcode,
                img: action.payload.img,
                name: action.payload.name,
                surn: action.payload.surn,
                fullName: action.payload.fullName
            }
        case 'SET_VERSION':
            return {
                ...state,
                rev: action.payload
            }

        case 'BACKFLUSH_SET_FILTER':
            return {
                ...state,
                backflush: {
                    ymd: action.payload.ymd,
                    line: action.payload.line
                }
            }
        case 'SET_PAGE':
            return {
                ...state,
                page: action.payload.page
            }
        case 'LOGOUT':
            return {
                ...state,
                login: false,
                empcode: '',
                img: '',
                name: '',
                surn: '',
                fullName: ''
            }
        case 'RESET':
            return initialState
        case 'SET_PLANT':
            return {
                ...state,
                filter: { ...state.filter, plant: action.payload, line: state.filter.line == '' ? 'MAIN' : 'SUBLINE' }
            }
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            }
        default:
            return state
    }
}
export default IndexReducer;
