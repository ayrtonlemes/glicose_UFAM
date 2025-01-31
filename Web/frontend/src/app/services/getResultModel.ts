

export const getResultModel  = async(idPatient: string, datetime: string ) => {

    const serverIp = process.env.NEXT_PUBLIC_IP_SERVER;
    const port = process.env.NEXT_PUBLIC_PORT;

    if (!idPatient || !datetime) {
        console.log("idPatiend ou datetime nao foram passados.");
    }
    try {

        const response = await fetch(`http://${serverIp}/get_predict_model.php?id_patient=${idPatient}&datetime=${datetime}`, {
            headers: {
                "Content-Type": "application/json", 
            }
        }
        );

        const data = await response.json();
        console.log(data.prediction)
        return data.prediction;
    }catch(error) {
        console.log("Erro ao obter o resultado do modelo", error);
        return error;
    }
}