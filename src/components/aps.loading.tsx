import { CircularProgress } from '@mui/material'
interface ParamLoading {
    message: string;
}
function ApsLoading(props: ParamLoading) {
    const { message } = props;
    return (
        <div className='flex flex-col items-center gap-2'>
            <CircularProgress />
            <small>{message}</small>
        </div>
    )
}

export default ApsLoading