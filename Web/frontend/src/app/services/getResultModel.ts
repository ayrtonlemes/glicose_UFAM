


export const getResultModel  = async(idPatient?: string, datetime?: string ) => {

    try {

        const response = await fetch(`http://localhost:80/get_predict_model.php`);

        const data = await response.json();
        return data;
    }catch(error) {
        console.log("Erro ao obter o resultado do modelo", error)
    }
}