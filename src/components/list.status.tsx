function ListPlanStatus() {
    return (
        <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-[#FFA500] border border-black/40'></div>
                <small className={`tracking-wide`}>กำลังผลิต</small>
            </div>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-blue-500 border border-black/40'></div>
                <small className={`tracking-wide`}>ผลิตบางส่วน</small>
            </div>
            <div className='flex items-center gap-1'>
                <div className='w-3 h-3 rounded-sm bg-green-600 border border-black/40'></div>
                <small className={`tracking-wide`}>ผลิตแล้ว</small>
            </div>
        </div>
    )
}

export default ListPlanStatus