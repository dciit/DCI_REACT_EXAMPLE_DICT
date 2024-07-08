import React, { ChangeEvent, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DoneIcon from '@mui/icons-material/Done';
import { Autocomplete, CircularProgress, Divider, IconButton, MenuItem, TextField } from '@mui/material'
import { API_APS_NOTIFY_LOGIN, API_GET_MODEL_MASTER, API_GET_REASON, ApiApsGetPlanMachine, ApiGetPartMaster, ApiInsertPlan, ApiUpdateSequencePlan } from '../service/aps.service'
import { ApsProductionPlanProps, DictMstr, EmpProps, Mdw27Props, PropsPartMaster, PropsPlanMachine } from '../interface/aps.interface'
import LoginIcon from '@mui/icons-material/Login';
import ApsPlanMachineDND from './aps.report.dnd.plan'
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { DropResult, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { contact, dateFormat, empcode } from '../constants'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit';
import { Close } from '@mui/icons-material';
export interface DialogEditSeqParam {
  open: boolean;
  setOpen: Function;
  empProps: EmpProps;
  setEmpProps: Function;
  partGroup: DictMstr | null;
  ymd: string;
  partMasters: PropsPartMaster[];
  loadPlanComponent: Function;
}
interface PropsNewPlan {
  partNo: string;
  wcno: string;
  model: string;
  prdQty: number;
  planDate: string;
  partGroup?: string;
  empcode: string;
}
function DialogEditSeq(props: DialogEditSeqParam) {
  let textLogin: string = 'เข้าสู่ระบบ';
  let textLoading: string = 'กรุณารอสักครู่'
  const { open, setOpen, empProps, ymd, partGroup, setEmpProps, partMasters, loadPlanComponent } = props;
  const [inpEmpcode, setInpEmpcode] = useState<string>('');
  const [load, setLoad] = useState<boolean>(false);
  const [textLoad, setTextLoad] = useState<string>(textLogin);
  const [alert, setAlert] = useState<boolean>(false);
  const [editPlan, setEditPlan] = useState<boolean>(false);
  const [plan, setPlan] = useState<PropsPlanMachine[]>([]);
  const [stateUpdatePlan, setStateUpdatePlan] = useState<boolean>(false);
  const [planEdit, setPlanEdit] = useState<PropsPlanMachine | null>(null);
  const [reasons, setReasons] = useState<DictMstr[]>([]);
  const [openAddPlan, setOpenAddPlan] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<PropsNewPlan>({
    model: '',
    prdQty: 0,
    empcode: empcode,
    partGroup: '',
    planDate: '',
    partNo: '',
    wcno: ''
  });
  useEffect(() => {
    if (!open) {
      setInpEmpcode('');
      setLoad(false)
      setTextLoad(textLogin);
      setPlanEdit(null)
      setStateUpdatePlan(false);
    }
  }, [open]);
  useEffect(() => {
    setAlert(!inpEmpcode.length ? true : false);
  }, [inpEmpcode])
  const handleLogin = async () => {
    if (inpEmpcode.length >= 5) {
      setTextLoad(textLoading);
      setLoad(true);
      let empProps: EmpProps = await API_APS_NOTIFY_LOGIN(inpEmpcode);
      try {
        if (empProps.code != '') {
          let getPlan = await ApiApsGetPlanMachine({ ymd: ymd, partGroup: partGroup != null ? partGroup.code : '' });
          setPlan(getPlan)
          setEmpProps(empProps)
          setLoad(false)
          setEditPlan(true);
        }
      } catch (e) {
        setAlert(true);
      }
    } else {
      setEditPlan(false)
    }
  }
  useEffect(() => {
    if (inpEmpcode.length < 5) {
      setEditPlan(false)
      setTextLoad(textLogin)
      setPlanEdit(null)
    }
  }, [inpEmpcode])

  useEffect(() => {
    initReason();
  }, [planEdit]);
  const initReason = async () => {
    if (planEdit != null && Object.keys(planEdit).length) {
      let resReason: DictMstr[] = await API_GET_REASON();
      setReasons(resReason);
    }
  }
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    let newItems = Array.from(plan);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    newItems = newItems.map((item, index) => {
      return { ...item, prdSeq: index + 1 }
    });
    setPlan(newItems);
  };

  const handleUpdatePlan = async () => {
    setStateUpdatePlan(true);
    let ApiUpdateSequence = await ApiUpdateSequencePlan({ partGroup: partGroup?.code, empcode: empcode, plan: plan });
    if (ApiUpdateSequence.status == true) {
      toast.success('บันทึกข้อมูลสำเร็จ');
      loadPlanComponent();
    }
    setStateUpdatePlan(false)
  }

  const handleChangeStatus = async (status: number) => {
    let newPlan = Array.from(plan);
    let index: number = newPlan.findIndex(x => x.prdPlanCode == planEdit?.prdPlanCode);
    if (status == 1) {
      if (index != -1) {
        newPlan[index].prdPlanQty = newPlan[index].apsPlanQty;
        newPlan[index].reason = '';
      }
    } else {
      if (index != -1) {
        newPlan[index].prdPlanQty = 0;
      }
    }
    setPlan(newPlan)
  }

  const handleChangeReason = async (reason: string) => {
    let newPlan = Array.from(plan);
    let index: number = newPlan.findIndex(x => x.prdPlanCode == planEdit?.prdPlanCode);
    if (index != -1) {
      newPlan[index].reason = reason;
    }
    setPlan(newPlan)
  }

  const handleChangePrdPlanQty = async (prdQty: number) => {

    if (/^[0-9]*$/.test(prdQty.toString())) {
      let newPlan = Array.from(plan);
      prdQty = (prdQty > 9999) ? 9999 : prdQty < 0 ? 0 : prdQty;
      let index: number = newPlan.findIndex(x => x.prdPlanCode == planEdit?.prdPlanCode);
      if (index != -1) {
        newPlan[index].prdPlanQty = prdQty;
        newPlan[index].reason = '';
      }
      setPlan(newPlan)
    }
  }

  const handleAddPlan = async () => {
    if (newPlan.model.length != 0) {
      let oPartMaster = partMasters.filter((x => x.model_common == newPlan.model && x.part_group == (partGroup != null ? partGroup.code : '')));
      if (oPartMaster.length != 0) {
        const maxValue = plan.reduce((max, obj) => {
          return obj.prdSeq > max ? obj.prdSeq : max;
        }, plan[0].prdSeq);
        let apiInsertPlan = await ApiInsertPlan({
          model: newPlan.model, prdQty: newPlan.prdQty, planDate: ymd, empcode: empcode, partGroup: partGroup != null ? partGroup.code : '', partNo: oPartMaster[0].partno, wcno: oPartMaster[0].wcno, prdSeq: maxValue + 1, partGroupName: oPartMaster[0].part_group_name
        });
        if (apiInsertPlan.status == true) {
          toast.success('เพิ่มแผนการผลิตเรียบร้อยแล้ว')
          handleLogin();
          setOpenAddPlan(false);
          loadPlanComponent();
        } else {
          toast.error(`เกิดข้อผิดพลาดกับการเพิ่มแผนการผลิต ${contact}`);
        }
      }
    } else {

    }
  }

  return (
    <Dialog open={open} onClose={() => load ? false : setOpen(false)} fullWidth  >
      <DialogContent >
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <div className='text-[16px] font-semibold'>ข้อมูลการผลิต</div>
            <div className='text-[14px] text-gray-500'>ทำการเข้าสู่ระบบเพื่อสามารถแก้ไขแผนการผลิตได้</div>
          </div>
          <div className='border-b '></div>

          <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
            <div className='text-[14px] col-span-1'>USER ID</div>
            <input type='number' className={`col-span-2 border rounded-md px-2 py-1 focus-visible:outline-[#4f46e5] transition-all duration-300 hover:outline-none focus:bg-[#4f46e510]`} placeholder='กรุณาระบุ User ID' defaultValue={inpEmpcode == null ? '' : inpEmpcode} value={inpEmpcode} onKeyDown={(e: any) => {
              if (e.key == 'Enter') {
                handleLogin();
              }
            }} onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInpEmpcode(e.target.value.length > 5 ? (e.target.value.substring(0, 5)) : e.target.value)
            }} autoFocus={true} />
          </div>
          <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
            <div className='text-[14px] col-span-1'>PASSWORD</div>
            <input readOnly type='password' className={`bg-gray-100 select-none col-span-2 border rounded-md px-2 py-1  `} defaultValue={inpEmpcode == null ? '' : inpEmpcode} value={inpEmpcode} />
          </div>
          <div className='text-[12px] text-gray-500 text-end'>
            กรุณาใช้ UserId/Password ชุดเดียวกับที่เข้าใช้งาน E-Mail และ Share Center หรือ เข้าสู่ระบบ ALPHA)
          </div>
          <div className='flex flex-col items-end'>
            {
              editPlan == true ? <div className='bg-green-600 text-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 select-none '>
                <DoneIcon sx={{ width: '18px', height: '18px' }} />
                <span>เข้าสู่ระบบแล้ว</span>
              </div> : <button className={`bg-[#4f46e5] text-white px-3 py-1 rounded-md drop-shadow-lg opacity-90  transition-all duration-300 ${load ? 'opacity-40' : 'hover:opacity-100'}`} onClick={() => load ? false : handleLogin()} >
                <div className='flex gap-2 items-center'>
                  {
                    load && <CircularProgress size={'14px'} sx={{ color: 'white' }} />
                  }
                  <div className=' flex items-center gap-1'>
                    <LoginIcon sx={{ width: '18px', height: '18px' }} />
                    <span>{textLoad}</span>
                  </div>
                </div>
              </button>
            }
          </div>
          {
            editPlan == true && <div className='flex flex-col gap-3'>
              <div className='flex  gap-2 items-center '>
                <div className=''>ข้อมูลการผลิต</div>
                <div className='shadow-md rounded-full px-3 pt-[4px] pb-[6px]   flex gap-1 bg-[#4f46e5] opacity-80 cursor-pointer select-none hover:opacity-100 transition-all duration-300 text-white' onClick={() => {
                  setOpenAddPlan(true);
                  setPlanEdit(null)
                }}><AddIcon /><span>เพิ่มแผนการผลิต</span></div>
              </div>
              {
                openAddPlan && <div className=' grid grid-cols-1 shadow-md  rounded-md border pl-6 pr-6 pt-2 pb-4 gap-2'>
                  <div className='flex justify-end'><IconButton onClick={() => setOpenAddPlan(false)}>
                    <Close />
                  </IconButton></div>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-1'>Model</div>
                    <div className='col-span-2 flex flex-col gap-1'>
                      <select className=' px-3 pt-[7px] pb-[5px] border rounded-md focus:outline-none hover:outline-none' onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewPlan({ ...newPlan, model: e.target.value })}>
                        <option value="">--- กรุณาเลือก Model ---</option>
                        {
                          partMasters.filter((x => x.part_group == partGroup?.code)).map((o: PropsPartMaster, i: number) => <option key={i} value={o.model_common}>{o.model_common}</option>)
                        }
                      </select>
                      {
                        newPlan.model == '' && <small className='text-red-500'>* กรุณาเลือก Model</small>
                      }
                    </div>
                  </div>
                  <div className='grid grid-cols-3 '>
                    <div>Prd Qty.</div>
                    <input type='number' className='border rounded-md border-[#4f46e590] bg-[#4f46e510] font-semibold   px-3 pt-[4px] pb-[5px] ' min={0} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlan({ ...newPlan, prdQty: Number(e.target.value) })} value={newPlan?.prdQty} />
                  </div>
                  <div className='flex items-center justify-end gap-2 mt-3 mb-1'>
                    <div className='px-6 pt-[4px] pb-[5px] text-[#4f46e5] border border-[#4f46e5] rounded-full cursor-pointer select-none shadow-md' onClick={() => {
                      setOpenAddPlan(false);
                    }}>ยกเลิก</div>
                    <div className='px-6 pt-[4px] pb-[5px] bg-[#4f46e5] text-white rounded-full cursor-pointer select-none shadow-md' onClick={handleAddPlan}>ยืนยัน</div>
                  </div>
                </div>
              }
              <div className={`shadow-md ${openAddPlan == true && 'hidden'}`}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId={`droppable-${partGroup}`}>
                    {(provided) => (
                      <table  {...provided.droppableProps} ref={provided.innerRef} className={`text-[14px] w-full select-none `}>
                        <thead className='font-semibold '>
                          <tr>
                            <td className='border text-center w-[7.5%]' rowSpan={2}>Seq.</td>
                            <td className='border text-center' rowSpan={2}>Model</td>
                            <td className='border text-center py-2 w-[20%]' colSpan={2}>Plan</td>
                            <td className='border text-center' rowSpan={2}>Result</td>
                            <td className='border text-center' colSpan={2}>Stock</td>
                            <td className='border text-center w-[7.5%]' rowSpan={2}>#</td>
                          </tr>
                          <tr>
                            <td className="border text-center py-2 w-[10%]">APS</td>
                            <td className="border text-center w-[10%]">PRD</td>
                            <td className="border text-center">M/C</td>
                            <td className="border text-center">Main</td>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (plan != null && plan.length) ? plan.map((item: PropsPlanMachine, i: number) => (
                              <Draggable key={`${item.prdPlanCode}-${item.prdSeq}`} draggableId={`${item.prdPlanCode}-${item.prdSeq}`} index={i}>
                                {(provided) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <td className="border text-center py-2 font-semibold">{item.prdSeq}</td>
                                    <td className="border  pl-1 font-semibold">
                                      <div className=' flex flex-col  '>
                                        <strong>{(partMasters.filter(x => x.partno == item.partNo).length && partMasters.filter(x => x.partno == item.partNo)[0].model_common)}</strong>
                                        <span className='text-[12px] text-gray-500'>{item.partNo}</span>
                                      </div>
                                    </td>
                                    <td className="border text-center">{item.apsPlanQty.toLocaleString('en')}</td>
                                    <td className={`border text-center  font-bold ${item.prdPlanQty == 0 ? 'text-red-400' : 'text-green-600'}`}>{item.prdPlanQty.toLocaleString('en')}</td>
                                    <td className="border text-center  font-bold">-</td>
                                    <td className="border text-center">-</td>
                                    <td className="border text-center">{item.stockMain > 0 ? item.stockMain.toLocaleString('en') : '-'}</td>
                                    <td className='border text-center'>
                                      <IconButton onClick={() => setPlanEdit(item)}><EditIcon sx={{ width: '16px', height: '16px' }} /></IconButton>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            )) : <tr>
                              <td className='border py-3 text-center font-semibold' colSpan={8}>ไม่พบข้อมูล</td>
                            </tr>
                          }
                          {provided.placeholder}
                        </tbody>
                      </table>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              <div className={`mt-3 flex justify-end ${openAddPlan && 'hidden'}`}>
                <button className='bg-[#4f46e5] rounded-md text-white pl-3 pr-4 py-1 flex items-center  shadow-lg gap-2' onClick={() => stateUpdatePlan ? false : handleUpdatePlan()}>
                  {stateUpdatePlan ? <CircularProgress color='inherit' size={'16px'} /> : <SaveAltIcon sx={{ width: '16px', height: '16px' }} />}
                  <span>{stateUpdatePlan ? 'กำลังบันทึก' : 'บันทึก'}</span>
                </button>
              </div>

              {
                (planEdit != null && typeof planEdit != 'undefined' && Object.keys(planEdit).length) && <div className='flex flex-col gap-1 '>
                  <div className='mb-2'>
                    <span className=''>แก้ไขข้อมูลการผลิต</span>
                  </div>
                  <div className="border rounded-md flex flex-col gap-4 pt-6 pb-6 px-4 shadow-md select-none">
                    <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
                      <div className='text-[14px] col-span-1'>PART NO :  </div>
                      <span className='font-semibold'>{planEdit.partNo}</span>
                    </div>
                    <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
                      <div className='text-[14px]'>APS PLAN QTY :  </div>
                      <input type="number" value={planEdit.apsPlanQty} className='hover:outline-none focus:outline-none bg-gray-100 border rounded-md pr-2 py-1 text-right font-semibold select-none' />
                    </div>
                    <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
                      <div className='text-[14px] col-span-1'>PRD PLAN QTY :  </div>
                      <input type="number" min={0} max={9999} maxLength={4} value={planEdit.prdPlanQty} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePrdPlanQty(Number(e.target.value))} className='border rounded-md pr-2 py-1 text-right font-semibold' />
                    </div>
                    <div className='grid grid-cols-3 items-center gap-3 leading-none justify-between' >
                      <div className='text-[14px] col-span-1'>สถานะ :  </div>
                      <div className='flex gap-3 items-start'>
                        <div className={`bg-green-600 text-white px-3  py-[4px] pb-[6px] rounded-full  text-end cursor-pointer  ${planEdit.prdPlanQty == 0 && 'opacity-20'}  hover:opacity-100`} onClick={() => handleChangeStatus(1)}>ผลิต</div>
                        <div className='h-full border-l flex items-center justify-center'>&nbsp;</div>
                        <div className={`bg-red-500 text-white px-3 py-[4px] pb-[6px] rounded-full ${planEdit.prdPlanQty > 0 && 'opacity-20'} text-start  hover:opacity-100 cursor-pointer`} onClick={() => handleChangeStatus(0)}>ไม่ผลิต</div>
                      </div>
                    </div>
                    <div className={`grid grid-cols-3 items-center gap-1 leading-none justify-between ${planEdit.prdPlanQty > 0 && 'opacity-20'}`} >
                      <div className='text-[14px] col-span-1'>สาเหตุ :  </div>
                      <div className='flex gap-3 items-center col-span-2 '>
                        {
                          reasons.map((oReason: DictMstr, iReason: number) => <div key={iReason} className={` px-3 py-1 rounded-full cursor-pointer select-none ${planEdit.reason == oReason.code ? 'bg-red-500 text-white' : ' border border-red-500 text-red-500'}`} onClick={() => planEdit.prdPlanQty == 0 ? handleChangeReason(oReason.code) : false}>{oReason.description}</div>)
                        }
                      </div>
                    </div>
                    <div className='grid grid-cols-3 items-start gap-3 leading-none justify-between' >
                      <div className='text-[14px] col-span-1'>หมายเหตุ :  </div>
                      <textarea
                        className='shadow-inner border col-span-2 p-3   focus:outline-none rounded-lg w-full  ' placeholder='คุณสามารถระบุหมายเหตุให้กับแผนการผลิตนี้ได้ ... ' rows={4} />
                    </div>
                  </div>
                </div>
              }


            </div>
          }
        </div>
      </DialogContent>
      <DialogActions>
        <button className='min-w-[6em] px-3 py-1 border-[#4f46e5] text-[#4f46e5] border rounded-md opacity-80 hover:bg-[#4f46b510] transition-all duration-300 select-none cursor-pointer' onClick={() => load ? false : setOpen(false)}>ปิดหน้าต่าง</button>
      </DialogActions>
      <ToastContainer autoClose={3000} />
    </Dialog >
  )
}

export default DialogEditSeq