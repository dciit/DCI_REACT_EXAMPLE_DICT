export interface PropsStockSubline {
    ym: string; // Year and Month (YYYYMM)
    ymd: string; // Year, Month, and Day (YYYYMMDD)
    wcno: string; // Work Center Number
    hhmm: string; // Hour and Minute (HHMM)
    modelcode: string; // Model Code
    modelname: string; // Model Name
    apsPlan?: number | null; // APS Plan (nullable number)
    apsResult?: number | null; // APS Result (nullable number)
    apsRemainPlan?: number | null; // APS Remaining Plan (nullable number)
    fsMain: number; // FS Main
    fsSubline: number; // FS Subline
    hsMain: number; // HS Main
    hsSubline: number; // HS Subline
    lwMain: number; // LW Main
    lwSubline: number; // LW Subline
    csMain: number; // CS Main
    csSubline: number; // CS Subline
    bodyMain: number; // Body Main
    bodySubline: number; // Body Subline
    bottomMain: number; // Bottom Main
    bottomSubline: number; // Bottom Subline
    topMain: number; // Top Main
    topSubline: number; // Top Subline
    statorMain: number; // Stator Main
    statorSubline: number; // Stator Subline
    rotorMain: number; // Rotor Main
    rotorSubline: number; // Rotor Subline
    createDate: string; // Date and Time of Creation (YYYY-MM-DDTHH:MM:SS.sssZ)
}