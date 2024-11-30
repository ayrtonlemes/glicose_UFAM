import { MedicalValuesProps, PatientInfoProps } from "../types/patient";

export interface PatientProps {
  id: number;
  name: string;
  age: number;
  gender: string;
  metrics: MedicalValuesProps[];
}

export const getAllPatients = async (): Promise<PatientProps[]> => {
  try {
    const response = await fetch("http://localhost:5000/patients");
    if (!response.ok) {
      throw new Error("Erro ao fetch de todos os pacientes.");
    }

    const data = await response.json();

    const patients: PatientProps[] = data.patient.map((patient: any) => ({
      id: patient.id_patient,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      metrics: mapMetricsForPatient(patient.id_patient, data),
    }));

    return patients;
  } catch (error) {
    console.log("Erro ao tentar obter todos os pacientes:", error);
    return [];
  }
};

const mapMetricsForPatient = (patientId: number, data: any): MedicalValuesProps[] => {
  const patientData = data.patient_data.filter(
    (entry: any) => entry.id_patient === patientId
  );
  const sensorsData = data.sensors.filter(
    (entry: any) => entry.id_patient === patientId
  );

  return patientData.map((entry: any, index: number) => ({
    heartRate: sensorsData[index]?.HR || "N/A",
    bloodPressure: "N/A", // Placeholder (adicionar caso aplicável)
    oxygenSaturation: "N/A", // Placeholder (adicionar caso aplicável)
  }));
};
