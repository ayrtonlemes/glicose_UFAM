
export const getPatientSensors = async (id: number, sensorType: string, dateTime: string) => {

    //const pid = Number(id);

    try {
        const response = await fetch(`http://localhost:80/get_patient_sensors.php?id=${id}&sensor=${sensorType.toLowerCase()}&datetime=${dateTime}`);

        if (!response.ok) {
          throw new Error("Erro ao fetch dos sensores do paciente.");
        }
    
        const data = await response.json();
    
//        if (!Array.isArray(data)) {
  //        throw new Error("Formato de dados inesperado.");
    //    }
        
        return data;
      } catch (error) {
        console.log("Erro ao tentar obter  o sensor do paciente:", error);
        return [];
      }
}