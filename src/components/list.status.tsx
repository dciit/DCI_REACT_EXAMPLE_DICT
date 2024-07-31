function ListPlanStatus() {
    return (
        <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-gray-400 border border-black/40'></div>
                <small className={`tracking-wide`}>รอผลิต</small>
            </div>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-[#FFA500] border border-black/40'></div>
                <small className={`tracking-wide`}>กำลังผลิต</small>
            </div>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-green-600 border border-black/40'></div>
                <small className={`tracking-wide`}>ผลิตเรียบร้อยแล้ว</small>
            </div>
        </div>
    )
}

export default ListPlanStatus