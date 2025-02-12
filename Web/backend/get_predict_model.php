<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}


$scriptPath = 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\teste_script_bd.py';
$csvFile = 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\resultados\predicoes_com_datetime.csv';

$pythonPath = 'C:\Users\ALUNO\anaconda3\envs\glicose_squad\python.exe';

$id_patient = $_GET['id_patient'] ?? null;
$datetime = $_GET['datetime'] ?? null;

if (!$id_patient || !$datetime) {
    throw new Exception("Parâmetros 'id_patient' e 'datetime' são obrigatórios.");
}


try {
    // Executa o script Python (que executa o modelo IA)

    $output = shell_exec("\"$pythonPath\" \"$scriptPath\" \"$id_patient\" \"$datetime\" 2>&1");
      
    // Verifica se o script Python finalizou e gerou o arquivo CSV
    if (!file_exists($csvFile)) {
        throw new Exception("Arquivo CSV não encontrado após a execução do script.");
    }

    if (!$output) {
        throw new Exception("Erro ao executar o script Python.");
    }

  // Lê o conteúdo do arquivo CSV
  // Lê o arquivo CSV e pega somente o valor da previsão
    $prediction = null;
    if (($handle = fopen($csvFile, "r")) !== false) {
      fgetcsv($handle); // Pula o cabeçalho
      if (($linha = fgetcsv($handle, 1000, ",")) !== false) {
          $prediction = trim($linha[1], "[]"); // Remove os colchetes
      }
      fclose($handle);
    }

    if ($prediction === null) {
      throw new Exception("Nenhum valor de previsao encontrado no arquivo CSV.");
    }

  // Retorna apenas a previsão em JSON
    echo json_encode(["prediction" => (float)$prediction]);
   // Retorna os dados como JSON
    error_log("ID Patient: " . $id_patient);
    error_log("Datetime: " . $datetime);
    error_log("Shell Exec Output: " . print_r($output, true));

    error_log("Comando executado: python3 $scriptPath $id_patient \"$datetime\"");
    error_log("Saída do shell_exec: " . print_r($output, true));
} catch (Exception $e) {
    // Retorna erro
    http_response_code(500);
    error_log("ID Patient: " . $id_patient);
    error_log("Datetime: " . $datetime);
    error_log("Shell Exec Output: " . print_r($output, true));

    error_log("Comando executado: python3 $scriptPath $id_patient \"$datetime\"");
    error_log("Saída do shell_exec: " . print_r($output, true));
    echo json_encode(["error" => $e->getMessage()]);
}
?>
