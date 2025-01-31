// FoodDataService.ts
export interface FoodData {
    id_sec_data: number;
    id_patient: number;
    registro_date: string;
    registro_time: string;
    time_begin: string;
    time_end: string;
    logged_food: string;
    calorie: number;
    carbo: number;
    sugar: number;
    protein: number;
  }
  
  export async function getPatientFoodData(
    idPatient: number,
    datetime: string
  ): Promise<FoodData[]> {
    const serverIp = process.env.NEXT_PUBLIC_IP_SERVER;
  
    if (!serverIp) {
      throw new Error("IP do servidor não está configurado. Verifique o .env.");
    }
  
    // Verifica se os parâmetros são válidos
    if (!idPatient || !datetime) {
      throw new Error("Parâmetros inválidos: idPatient e datetime devem ser preenchidos.");
    }
  
    // Monta a URL base corretamente
    const baseUrl = `http://${serverIp}/get_patient_food_list.php`;
  
    try {
      const response = await fetch(`${baseUrl}?id=${idPatient}&datetime=${datetime}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const data: FoodData[] = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      throw error;
    }
  }
  