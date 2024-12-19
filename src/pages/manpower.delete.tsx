
import moment from "moment";
// import { fa } from "@faker-js/faker";
import React, { useEffect, useState } from "react";
import ApsDialogManpower from "../components/aps.display.manpower";
import { ManpowerLineTitleInfo, MPEmpOTInfo, ManpowerInfo, MPDisplayInfo, EmployeeInfo } from "../interface/mp.interface";
import { API_GET_EMP_OT, API_GET_MANPOWER_TITLE, API_GET_MANPOWER } from "../service/manpower.service";
import ApsCheckIn from "./aps.checkin.delete";

function Manpower() {
  const [isInitial, setisInitial] = useState<boolean>(false);
  const [isInitialMP, setisInitialMP] = useState<boolean>(false);
  const [oMPTitles, setoMPTitles] = useState<ManpowerLineTitleInfo[]>([]);
  const [oMPEmpOTs, setoMPEmpOTs] = useState<MPEmpOTInfo[]>([]);
  const [oMPLNTitles, setoMPLNTitles] = useState<string[]>([]);
  const [oMPs, setoMPs] = useState<ManpowerInfo[]>([]);
  //   const [oMstrs, setoMstrs] = useState<MPDisplayInfo[]>([]);

  // const [OpenMPDialog, setOpenMPDialog] = useState<boolean>(false);
  const [DialogHeader, setDialogHeader] = useState<string>("");
  const [DialogEmpList, setDialogEmpList] = useState<MPEmpOTInfo[]>([]);
  const [DialogOpen, setDialogOpen] = useState<boolean>(false);

  const oMstrs: MPDisplayInfo[] = [
    // { key: "mpPDPlan", value: "MP-PD" },
    // { key: "mpStandard", value: "MP-STD" },
    // { key: "mpRegis", value: "MP-HR" },
    // { key: "mpActual", value: "MP-ACT" },
    // { key: "mpDiff", value: "MP-DIFF" },
    { key: "attWork", value: "=>  WORK" },
    { key: "mpAbsent", value: "=>  ABSENSE" },
    { key: "mpAnnual", value: "=>  ANNUAL" },    
    { key: "attOT", value: "=>  OT" },
    { key: "attCheckIn", value: "CHECK-IN" },
    { key: "attNoCheckIn", value: "NOT CHECK-IN" },
  ];

  useEffect(() => {
    if (!isInitial) {
      initData();
    } else {
      if (!isInitialMP) {
        initMP();
      }
    }
  }, [isInitial, isInitialMP]);
  const initData = async () => {
    //=== Employee List With OT ===
    const oEmpOTs = await API_GET_EMP_OT();
    setoMPEmpOTs(oEmpOTs);

    //=== Manpower Title ===
    const oGrapMPTitle = await API_GET_MANPOWER_TITLE("LINE4");

    const oMPLns = [...new Set(oGrapMPTitle.map((oData) => oData.lineTitle))];
    setoMPLNTitles(oMPLns);
    setoMPTitles(oGrapMPTitle);
    // console.table(oGrapMPTitle);
    setisInitial(true);
  };

  const initMP = async () => {
    //=== Manpower Std/Act data ===
    const oGrapMP = await API_GET_MANPOWER();
    setoMPs(oGrapMP);
    // console.table(oGrapMP);
    setisInitialMP(true);
  };

  useEffect(() => {
    if (DialogHeader != "" && DialogEmpList.length > 0) {
      setDialogOpen(true);
    }
  }, [DialogHeader, DialogEmpList]);

  useEffect(() => {
    if (!DialogOpen) {
      setDialogHeader("");
      setDialogEmpList([]);
    }
  }, [DialogOpen]);

  const selectEmp = (oHead: string, oSelEmp: EmployeeInfo[]) => {
    if (oSelEmp != null) {
      const oAryEmp = Array.from(DialogEmpList);
      oSelEmp.map((oEmp: EmployeeInfo) => {
        const oMPEmpOT = oMPEmpOTs.filter((f) => f.code == oEmp.empCode);
        if (oMPEmpOT.length > 0) {          
          
          oAryEmp.push(oMPEmpOT[0]);          
        }
      });


      console.log(oAryEmp)
      setDialogEmpList(oAryEmp);
          
      setDialogHeader(oHead);
    }
  };

  //
  const DisplayByKey = (oRow: MPDisplayInfo, oMP: ManpowerInfo) => {
    let res = "";
    switch (oRow.key) {
      case "mpPDPlan":
        res = oMP.mpPDPlan;
        break;
      case "mpStandard":
        res = oMP.mpStandard;
        break;
      case "mpRegis":
        res = oMP.mpRegis;
        break;
      case "mpActual":
        res = oMP.mpActual;
        break;
      case "mpDiff":
        res = oMP.mpDiff;
        break;
      case "mpAbsent":
        res = oMP.mpAbsent;
        break;
      case "mpAnnual":
        res = oMP.mpAnnual;
        break;
      case "attWork":
        res = oMP.attWork;
        break;
      case "attOT":
        res = oMP.attOT;
        break;
      case "attCheckIn":
        res = oMP.attCheckIn;
        break;
      case "attNoCheckIn":
        res = oMP.attNoCheckIn;
        break;
    }
    return res;
  };

  const dataDate: moment.Moment = moment();
  const dataShift: string =
    dataDate.subtract(8, "hours").hour() < 8 ? "Day" : "Night";
  return (
    <div>
      <ApsDialogManpower
        dataHeader={DialogHeader}
        empLists={DialogEmpList}
        open={DialogOpen}
        setDialogOpen={setDialogOpen}
      />
      {/* {JSON.stringify(oMPLNTitles)} */}
      <p className="mb-2">
        <span
          className="text-xl font-bold "
          onClick={() => setDialogHeader("test")}
        >
          Manpower Monitoring
        </span>
        <span className="text-sm mx-50">
          {" "}
          ({dataDate.format("DD/MMM/YYYY ")} {dataShift} )
        </span>
      </p>
      <ApsCheckIn/>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="border p3 text-sm bg-[#1233B1] text-[#547AD4]"
                rowSpan={2}
              >
                #
              </th>
              {oMPLNTitles.map((oLN: string,i:number) => {
                return (
                  <th key={i}
                    className="border bg-[#1233B1] text-white"
                    colSpan={
                      oMPTitles.filter((o) => o.lineTitle == oLN).length + 1
                    }
                  >
                    {oLN}
                  </th>
                );
              })}
              {/* <th className="border">Total</th> */}
            </tr>
            <tr>
              {oMPLNTitles.map((oLN: string, idx:number) => {
                const TitleOfDvcd: ManpowerLineTitleInfo[] = oMPTitles.filter(
                  (oCol: ManpowerLineTitleInfo) => oCol.lineTitle == oLN
                );
                const countTitleOfDvcd: number = TitleOfDvcd.length;
                return TitleOfDvcd.map(
                  (oItem: ManpowerLineTitleInfo, i: number) => {
                    return (
                      <>
                        <th key={`${idx}${i}`} className="border p-1 text-xs bg-[#1233B1] text-white">
                          {oItem.lineSubCode}
                        </th>
                        {i == countTitleOfDvcd - 1 && (
                          <th className="border bg-[#7DC4F1] text-white">
                            Total
                          </th>
                        )}
                      </>
                    );
                  }
                );
              })}
            </tr>
          </thead>
          <tbody>
            {oMstrs.map((oMstr: MPDisplayInfo) => {
              let stlyHD: string = "";

              switch (oMstr.key) {
                case "mpDiff":
                  stlyHD = " text-red-800 bg-red-100 ";
                  break;
                case "mpAbsent":
                  stlyHD = " text-red-800 bg-red-100 ";
                  break;
                // case 'attWork' : stlyHD = ' text-green-800 bg-green-100 '; break;
                case "attOT":
                  stlyHD = " text-yellow-800 bg-yellow-100 ";
                  break;
                case "attCheckIn":
                  stlyHD = " text-green-800 bg-green-100 ";
                  break;
                case "attNoCheckIn":
                  stlyHD = " text-red-800 bg-red-100 ";
                  break;
                default:
                  stlyHD = " text-[#074F7D] ";
                  break;
              }
              return (
                <tr>
                  <td className={`border text-[10px] font-medium  ${stlyHD}`}>
                    {oMstr.value}
                  </td>

                  {oMPLNTitles.map((oTitleLns: string) => {
                    let LnCodeTTL: number = 0;
                    const filLineType: ManpowerLineTitleInfo[] =
                      oMPTitles.filter((f) => f.lineTitle == oTitleLns);

                    return filLineType.map(
                      (oCols: ManpowerLineTitleInfo, idx: number) => {
                        const oMPData = oMPs.filter(
                          (oMP) =>
                            oMP.dvcd == oCols.dvcd &&
                            oMP.lineSubCode == oCols.lineSubCode
                        );
                        const result =
                          oMPData.length > 0
                            ? DisplayByKey(oMstr, oMPData[0])
                            : "";

                        let empLists:EmployeeInfo[] = [];
                        

                          switch(oMstr.key){                            
                            case "attWork" : empLists = oMPData.length > 0 ? oMPData[0].attWorkLists : []; break;
                            case "mpAbsent" : empLists = oMPData.length > 0 ? oMPData[0].mpAbsentLists : []; break;
                            case "mpAnnual" : empLists = oMPData.length > 0 ? oMPData[0].mpActualLists : []; break;
                            case "attOT" : empLists = oMPData.length > 0 ? oMPData[0].attOTLists : []; break;
                            case "attCheckIn" : empLists = oMPData.length > 0 ? oMPData[0].attCheckInLists : []; break;
                            case "attNoCheckIn" : empLists = oMPData.length > 0 ? oMPData[0].attNoCheckInLists : []; break;
                          }

                        LnCodeTTL =
                          Number.isNaN(parseInt(result)) == false
                            ? LnCodeTTL + parseInt(result)
                            : LnCodeTTL;
                          const cursor = result != "0" && result != "" ? " cursor-pointer hover:bg-sky-100 hover:border-dashed hover:border-2 hover:border-indigo-600 " : "";
                        return (
                          <React.Fragment key={`${oMstr.key}${idx}`}>
                            <td
                              key={idx}
                              className={`border text-sm text-right ${cursor}  `}
                              onClick={() => selectEmp(`${oTitleLns} (${oCols.lineSubCode})`, empLists)}
                            >
                              {result != "0" ? result : ""}
                            </td>
                            {idx == filLineType.length - 1 && (
                              <td className="border-2 border-indigo-200  text-sm text-right">
                                {LnCodeTTL}
                              </td>
                            )}
                          </React.Fragment>
                        );
                      }
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Manpower;
