import time
import argparse
import mysql.connector
import pandas as pd
import numpy as np
from scipy import signal
from scipy.interpolate import interp1d
from datetime import timedelta, datetime
from numpy import trapz
import os
from tensorflow.keras.models import load_model  # Para carregar o modelo
from sklearn.preprocessing import MinMaxScaler  

# Função para recuperar dados de uma tabela por intervalo de tempo
def get_data_batch(table_name, cursor, id_patient):
    query = f"""
        SELECT * FROM {table_name}
        WHERE id_patient = %s
    """
    try:
        cursor.execute(query, (id_patient,))
        result = cursor.fetchall()
        if result:
            columns = [desc[0] for desc in cursor.description]
            return pd.DataFrame(result, columns=columns)
        else:
            return pd.DataFrame()
    except mysql.connector.Error as err:
        print(f"Erro ao recuperar dados da tabela {table_name}: {err}")
        return pd.DataFrame()

# Configuração do banco de dados
db_config = {
    'host': '10.224.1.56',
    'user': 'root',
    'password': '',
    'database': 'glicose'
}

#Aceitando parâmetros na linha de comando
parser = argparse.ArgumentParser(description="Script para processar dados para o modelo e realizar previsões.")
parser.add_argument("id_patient", type=int, help="ID do paciente selecionado")
parser.add_argument("datetime", type=str, help="Datetime do momento da previsão")

args = parser.parse_args()
id_patient = float(args.id_patient)
datetime_str = args.datetime

datetime_obj = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
try:
    # Conexão com o banco
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Recuperando dados das tabelas
    #id_patient = 1  # Substituir pelo ID correto do paciente
    glicodex_data = get_data_batch('glicodex_data', cursor, id_patient)
    ibi_data = get_data_batch('ibi_data', cursor, id_patient)
    hr_data = get_data_batch('hr_data', cursor, id_patient)

    if glicodex_data.empty or ibi_data.empty:
        print("Os dados de glicose ou IBI estão ausentes.")
    else:
        glicodex_data['datetime'] = pd.to_datetime(glicodex_data['datetime'])
        ibi_data['datetime'] = pd.to_datetime(ibi_data['datetime'])
        hr_data['datetime'] = pd.to_datetime(hr_data['datetime'])

        results = []

        # Carregar o modelo treinado
        model = load_model(r'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\mlp_model_ecg_standard_seed9.keras')  

        glicose_time = datetime_obj
        start_time = glicose_time - timedelta(minutes=5)

        ibi_subset = ibi_data[(ibi_data['datetime'] >= start_time) & (ibi_data['datetime'] <= glicose_time)]
        hr_subset = hr_data[(hr_data['datetime'] >= start_time) & (hr_data['datetime'] <= glicose_time)]

        if len(ibi_subset) > 0:
            rr_intervals = ibi_subset['ibi'].values * 1000  # Converter de segundos para milissegundos
            if len(rr_intervals) >= 226:  # Critério mínimo de duração

                # Cálculo de métricas
                sdnn = np.std(rr_intervals)
                rmssd = np.sqrt(np.mean(np.square(np.diff(rr_intervals))))
                nn50 = np.sum(np.abs(np.diff(rr_intervals)) > 50)
                pnn50 = (nn50 / len(rr_intervals)) * 100

                # Calcular SDANN e ASDNN (5 minutos)
                # Agrupando as métricas por 5minutos
                ibi_data_5min = ibi_data[(ibi_data['datetime'] >= glicose_time - timedelta(minutes=5)) & (ibi_data['datetime'] <= glicose_time)]
                rr_intervals_5min = ibi_data_5min['ibi'].values * 1000  # Converter de segundos para milissegundos

                if len(rr_intervals_5min) > 0:
                    # SDANN: Desvio padrão das médias de RR intervalos por 5 minutos
                    sdann_values = []
                    for i in range(0, len(rr_intervals_5min), 300):  # Janelas de 300 segundos (5 minutos)
                        window = rr_intervals_5min[i:i + 300]
                        if len(window) > 0:
                            sdann_values.append(np.mean(window))
                    sdann = np.std(sdann_values)

                    # ASDNN: Desvio padrão das diferenças de RR intervalos
                    asdnn_values = []
                    for i in range(0, len(rr_intervals_5min), 300):  # Janelas de 300 segundos (5 minutos)
                        window = rr_intervals_5min[i:i + 300]
                        if len(window) > 0:
                            asdnn_values.append(np.std(np.diff(window)))
                    asdnn = np.mean(asdnn_values)

                hr = hr_subset['hr'].values
                hr_max = np.max(hr)
                hr_min = np.min(hr)
                hr_max_min = hr_max - hr_min

                # Interpolação e análise de frequência
                x = np.cumsum(rr_intervals) / 1000
                f = interp1d(x, rr_intervals, kind='linear', fill_value="extrapolate")

                fs = 4.0  # Frequência de amostragem
                steps = 1 / fs
                xx = np.arange(np.min(x), np.max(x), steps)
                rr_interpolated = f(xx)

                # Realizando a análise espectral
                fxx, pxx = signal.welch(x=rr_interpolated, fs=fs, window='hann', nfft=4096)

                cond_vlf = (fxx >= 0.003) & (fxx < 0.04)
                cond_lf = (fxx >= 0.04) & (fxx < 0.15)
                cond_hf = (fxx >= 0.15) & (fxx < 0.4)

                vlf = trapz(pxx[cond_vlf], fxx[cond_vlf])
                lf = trapz(pxx[cond_lf], fxx[cond_lf])
                hf = trapz(pxx[cond_hf], fxx[cond_hf])

                lf_peak = fxx[cond_lf][np.argmax(pxx[cond_lf])]
                hf_peak = fxx[cond_hf][np.argmax(pxx[cond_hf])]

                lf_hf_ratio = lf / hf
                lf_hf_peak_ratio = lf_peak / hf_peak

                # Organizando as métricas em um array
                input_features = np.array([sdnn, nn50, pnn50, rmssd, hr_max_min, vlf, lf, hf, lf_hf_peak_ratio, lf_hf_ratio, sdann, asdnn])

                # Normalizando as features de entrada usando MinMaxScaler
                scaler = MinMaxScaler()  
                input_features_scaled = scaler.fit_transform(input_features.reshape(-1, 1)).flatten()

                # Imprimindo as features de entrada normalizadas
                #print(f"Input features (normalizadas): {input_features_scaled}")

                # Fazendo a previsão usando o modelo
                prediction = model.predict(input_features_scaled.reshape(1, -1))  # Ajustar para o formato correto

                # Salvando os resultados
                results.append({
                    'datetime': glicose_time,
                    'SDNN': sdnn,
                    'RMSSD': rmssd,
                    'NN50': nn50,
                    'PNN50': pnn50,
                    'HRmax - HRmin': hr_max_min,
                    'VLF Power': vlf,
                    'LF Power': lf,
                    'HF Power': hf,
                    'LFPeak/HFPeak': lf_hf_peak_ratio,
                    'LF/HF': lf_hf_ratio,
                    'SDANN 24h': sdann,   # Adicionando SDANN 24h
                    'ASDNN 24h': asdnn,   # Adicionando ASDNN 24h
                    'Prediction': prediction[0]  # Adicionando a previsão do modelo
                })

    results_df = pd.DataFrame(results)
    print(results_df)

    # Configuração do caminho para salvar o CSV com todas as métricas e previsões
    output_directory = "resultados"
    output_file = "resultados_com_metricas_previsao.csv"
    output_path = os.path.join(output_directory, output_file)

    # Criar o diretório, se não existir
    os.makedirs(output_directory, exist_ok=True)

    # Salvando todas as métricas e previsões em um CSV
    if not results_df.empty:
        results_df.to_csv(output_path, index=False)
        print(f"Resultados com métricas e previsões salvos com sucesso em: {output_path}")
    else:
        print("Nenhum resultado para salvar.")

    # Salvando as predições com os datetimes em um novo CSV
    predictions_df = results_df[['datetime', 'Prediction']]

    # Configuração do caminho para salvar o CSV com predições
    output_file_predictions = "predicoes_com_datetime.csv"
    output_path_predictions = os.path.join(output_directory, output_file_predictions)

    # Salvando as predições em um CSV
    if not predictions_df.empty:
        predictions_df.to_csv(output_path_predictions, index=False)
        print(f"Predições com datetimes salvas com sucesso em: {output_path_predictions}")
        #print("glicodex",glicodex_data['datetime'])
        #print(ibi_data['datetime'])
        #print(hr_data['datetime'])

        #print()
    else:
        print("Nenhuma predição para salvar.")


except mysql.connector.Error as err:
    print(f"Erro na conexão com o banco de dados: {err}")

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
