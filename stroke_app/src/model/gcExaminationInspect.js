import { ExaminationReport, LabResult, LabMaster } from '@model/commonModel'

export default function GcExaminationInspect() {
  return {
    examination: {
      firstCT: {
        ...ExaminationReport()
      },
      firstCTA: {
        ...ExaminationReport()
      },
      firstCTP: {
        ...ExaminationReport()
      },
      firstMRI: {
        ...ExaminationReport()
      },
      firstMRA: {
        ...ExaminationReport()
      },
      firstDWI: {
        ...ExaminationReport()
      },
      firstPWI: {
        ...ExaminationReport()
      }
    },
    inspection: {
      masterList: [],
      firstCTnI: {
        ...LabResult()
      },
      firstCTnT: {
        ...LabResult()
      },
      firstBNP: {
        ...LabResult()
      },
      firstMYO: {
        ...LabResult()
      },
      firstCKMB: {
        ...LabResult()
      },
      firstNTProBNP: {
        ...LabResult()
      },
      firstSCR: {
        ...LabResult()
      },
      firstDDimer: {
        ...LabResult()
      },
      firstPT: {
        ...LabResult()
      },
      firstINR: {
        ...LabResult()
      },
      firstAPTT: {
        ...LabResult()
      },
      firstTC: {
        ...LabResult()
      },
      firstTG: {
        ...LabResult()
      },
      firstHDLC: {
        ...LabResult()
      },
      firstLDLC: {
        ...LabResult()
      },
      firstGLU: {
        ...LabResult()
      },
      firstPLT: {
        ...LabResult()
      },
      firstHGB: {
        ...LabResult()
      },
      firstWBC: {
        ...LabResult()
      },
      firstAST: {
        ...LabResult()
      },
      firstALT: {
        ...LabResult()
      },
      firstBUN: {
        ...LabResult()
      },
      firstPH: {
        ...LabResult()
      },
      firstCRP: {
        ...LabResult()
      },
      firstHSCRP: {
        ...LabResult()
      },
      firstHCY: { ...LabResult() },
      firstHBALC: { ...LabResult() },
      firstBloodRT: { ...LabMaster() },
      firstBloodCRT: { ...LabMaster() },
      firstLiverFunction: { ...LabMaster() },
      firstRenalFunction: { ...LabMaster() },
      firstElectrolyte: { ...LabMaster() },
      firstBloodHCY: { ...LabMaster() }
    }
  }
}
