import { PatientInfoProps } from "../types/patient";


export const getPatientById = async (id: string) => {

    const pid = Number(id);
    console.log(id)
    try {
      const response = await fetch(`http://localhost:80/get_patient.php?id=${pid}`);
      
      if (!response.ok) {
        throw new Error("Erro ao fetch de paciente.");
      }
  
      const data = await response.json();
  
      const patient: PatientInfoProps = data.map((patient: PatientInfoProps) => ({
        id: patient.id_patient,
        name: patient.name ? patient.name : `0${patient.id_patient}`,
        age: patient.age ? patient.age : "N/A",
        gender: patient.gender,
      }));
  
      return patient;
    } catch (error) {
      console.log("Erro ao tentar obter dados do paciente:", error);
      return null;
    }
}