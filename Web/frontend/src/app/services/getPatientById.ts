import { FoodLogProps, HeartValueProps, PatientInfoProps, SensorsProps } from "../types/patient";

export type PatientData = {
  patient: PatientInfoProps | null;
  patient_data: HeartValueProps[];
  food_log: FoodLogProps[];
  sensors: SensorsProps[];
};

export const getPatientById = async (id: string) => {

    const pid = Number(id);
    console.log(id)
    try {
        const response = await fetch(`http://localhost:5000/patients/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao fetch de todos os pacientes.");
        }
    
        const data = await response.json();
    
        if(!data || !data.patient || !data.patient_data || !data.food_log || !data.sensors) {
          throw new Error("Formato inesperado da resposta da API.");
        }
        const patient = data.patient.id_patient === pid ? data.patient : null
        if(!patient) {
          console.log("Nao encontramos esse paciente com esse id:", pid, "aa", id)
        }
        return {
            patient: data.patient.id_patient === pid ? data.patient : null,
            patient_data : data.patient_data.filter((pd) => pd.id_patient === pid),
            food_log: data.food_log.filter((fl) => fl.id_patient === pid),
            sensors: data.sensors.filter((s) => s.id_patient === pid)
        }        
      } catch (error) {
        console.log("Erro ao tentar obter dados do paciente:", error);
        return {
          patient: null,
          patient_data: [],
          food_log: [],
          sensors: [],
        };
      }
}