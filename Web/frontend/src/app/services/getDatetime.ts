
//limitando a consulta de 10 em 10 vezes
export const getDatetime = async (idPatient: number, min: number, limit: number) =>  { //dateTime glicodex, usado como medida padrão de tempo (medição de 5 em 5 min)

    try {
        const response = await fetch(`http://localhost:80/get_patient_datetime.php?id=${idPatient}&min=${min}&limit=${limit}`);

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