interface PropsButtonMtr {
    text: string;
    event: string;
    icon?: any;
}
function ButtonMtr(props: PropsButtonMtr) {
    const { text, event, icon } = props;
    let bgColor = '';
    if (event == 'red') {
        bgColor = 'bg-red-500';
    } else {
        bgColor = 'bg-blue-500';
    }
    return (
        <div className={`${bgColor} cursor-pointer select-none hover:scale-105 transition-all duration-150 text-white ${icon != null ? ' pl-3 pr-4' : 'px-3'} py-1 rounded-md shadow-md min-w-[5em] text-center cursor-pointer`}>
            {
                icon
            }
            <span>{text}</span>
        </div>
    )
}

export default ButtonMtr