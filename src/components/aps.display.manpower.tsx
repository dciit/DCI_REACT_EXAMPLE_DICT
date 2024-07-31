import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { PropsDialogManpower, MPEmpOTInfo } from "../interface/mp.interface";

const ApsDialogManpower = (props: PropsDialogManpower) => {
  const { open, dataHeader, empLists, setDialogOpen } = props;

  return (
    <Dialog
      open={open}
      onClose={() => setDialogOpen(false)}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        {"รายชื่อพนักงาน"} {dataHeader}
      </DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-flow-row-dense lg:grid-cols-6 sm:grid-cols-3 gap-3">
          {empLists.map((oEmp: MPEmpOTInfo, idx: number) => {
            const otstyle =
              oEmp.otStatus == "APPROVE" ? " bg-green-200 text-green-900  " : " bg-yellow-200  text-yellow-900 ";
            return (
              <div key={idx} className="border p-2 ">
                <div className="flex flex-row">
                  <div className="text-sm text-[#0D1FB7]">
                    {`รหัส : ${oEmp.code} `}
                  </div>
                  <div className="text-[12px] font-bold">{` - ${oEmp.posit} `}</div>
                </div>
                <div className="text-[12px]">ชื่อ : {oEmp.fName}</div>

                <div className="text-center">
                  <img
                    src={`http://websrv01.dci.daikin.co.jp/pic/${oEmp.code}.JPG`}
                    className="h-24 w-24"
                  />
                </div>
                <div className={`font-bold text-[12px] text-center my-1 p-1 rounded-lg ${otstyle} `}>
                  OT : {oEmp.otStatus == "APPROVE" ? "อนุมัติแล้ว" : "รอการอนุมัติ"}
                  </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions></DialogActions>
      {/* <ToastContainer autoClose={3000} /> */}
    </Dialog>
  );
};

export default ApsDialogManpower;
