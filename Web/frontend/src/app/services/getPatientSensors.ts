import { SensorsProps } from "../types/sensors";


export const getPatientSensors = async (id: string) => {

    const pid = Number(id);

    try {
        const response = await fetch(`http://localhost:80/get_patient_sensors.php?id=${pid}`);

        if (!response.ok) {
          throw new Error("Erro ao fetch de todos os pacientes.");
        }
    
        const data = await response.json();
    
        if (!Array.isArray(data)) {
          throw new Error("Formato de dados inesperado.");
        }
    
        const patientSensors: SensorsProps[] = data.map((patient: SensorsProps) => ({
          id_sec_data: patient.id_sec_data,
          id_patient: patient.id_patient,
          registro_date: patient.registro_date,
          registro_time: patient.registro_time,
          ibi: patient.ibi,
          eda: patient.eda,
          glicose_dex: patient.glicose_dex,
          skin_Temperature: patient.skin_Temperature,
          bvp: patient.bvp,
          acc_mean_2hr: patient.acc_mean_2hr,
          acc_std_2hr: patient.acc_std_2hr,
          acc_max_2hr: patient.acc_max_2hr,

        }));
    
        return patientSensors;
      } catch (error) {
        console.log("Erro ao tentar obter todos os pacientes:", error);
        return [];
      }
}