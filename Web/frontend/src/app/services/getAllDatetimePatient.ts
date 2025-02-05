
export const getAllDatetimePatient = async (idPatient: number) =>  { //dateTime glicodex, usado como medida padrão de tempo (medição de 5 em 5 min)
    const serverIp = process.env.NEXT_PUBLIC_IP_SERVER;
    const port = process.env.NEXT_PUBLIC_PORT;

    try {
        const response = await fetch(`http://${serverIp}/get_patient_all_datetime.php?id=${idPatient}`);

        if(!response.ok) {
            throw new Error("Erro ao fetch de paciente.");
        }

        const data = await response.json();

        return data;
        
    } catch (error) {
        console.log("Erro ao obter os intervalos de tempo:", error);
        return null;
    }
}