import { useEffect, useState } from 'react'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Autocomplete, TextField } from '@mui/material';
import { APSInsertPlanProps, Mdw27Props } from '../interface/aps.interface';
import { API_GET_MODEL_MASTER } from '../service/aps.service';
export interface ApsInsertPlanParam {
    param: APSInsertPlanProps
    setParam: any;
    open: boolean;
}
function ApsInsertPlan(props: ApsInsertPlanParam) {
    const { param, setParam, open } = props;
    const [models, setModels] = useState<Mdw27Props[]>([]);
    useEffect(() => {
        if (open == true) {
            initData();
        }
    }, [open])
    const initData = async () => {
        let apiGetModel = await API_GET_MODEL_MASTER();
        setModels(apiGetModel)
    }
    return (
        <div className='grid grid-cols-1 p-6 pb-9 border rounded-lg shadow-lg gap-2'>
            <div className='text-[#5c5fc8] flex items-center gap-2 mb-2'><AddCircleOutlineOutlinedIcon className='opacity-50 ' /><span className='font-semibold'>เพิ่มแผนการผลิต</span></div>
            <div>
                <div>Model</div>
                <Autocomplete
                className='z-50'
                    fullWidth
                    size='small'
                    disablePortal
                    options={models.map((item: Mdw27Props) => {
                        return {
                            label: item.modelName,
                            value: item.modelCode
                        }
                    })}
                    getOptionLabel={(option) => `${option.label} (${option.value})`}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(_, value) => setParam({ ...param, modelCode: value?.value })}
                />
            </div>
            <div>
                <div>Prd Qty</div>
                <input type="number" className='font-semibold w-full  rounded-lg  px-[16px] pt-[7px] pb-[8px] focus:outline-none hover:outline-none border-dashed border-2 border-[#5c5fc8] bg-[#5c5fc810] text-[#5c5fc8]' value={param.prdQty} onChange={(e) => setParam({ ...param, prdQty: e.target.value })} />
            </div>
        </div>
    )
}

export default ApsInsertPlan