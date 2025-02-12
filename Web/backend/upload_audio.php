<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// Configurações do script Python e CSV
define('PYTHON_PATH', 'C:\Users\ALUNO\anaconda3\envs\audioglicose\Scripts\python.exe'); // Ajuste o caminho do Python
define('SCRIPT_PATH', 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\chatgpt.py'); // Ajuste o caminho do script Python
define('CSV_PATH', 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\tabela_nutricional.csv'); // Ajuste o caminho do CSV

// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glicose";

// Parâmetros recebidos
$id_patient = $_POST['id_patient'] ?? null;
$time_begin = $_POST['time_begin'] ?? null;

if (!$id_patient || !$time_begin || !isset($_FILES['audio_file'])) {
    echo json_encode(["error" => "Parâmetros 'id_patient', 'time_begin' e o arquivo de áudio são obrigatórios."]);
    exit();
}

try {
    // Salva o arquivo de áudio enviado
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir);
    $audio_path = $upload_dir . basename($_FILES['audio_file']['name']);
    move_uploaded_file($_FILES['audio_file']['tmp_name'], $audio_path);

    // Executa o script Python
    $command = escapeshellcmd("\"" . PYTHON_PATH . "\" \"" . SCRIPT_PATH . "\" \"" . realpath($audio_path) . "\"");
    $output = shell_exec($command . " 2>&1");

    // Aguardar até que o CSV seja gerado (verificar a cada 2 segundos por até 10 tentativas)
    $csv_generated = false;
    $tries = 0;
    while (!$csv_generated && $tries < 10) {
        if (file_exists(CSV_PATH)) {
            $csv_generated = true;
        } else {
            sleep(2);  // Aguarda 2 segundos antes de tentar novamente
            $tries++;
        }
    }

    if (!$csv_generated) {
        throw new Exception("Arquivo CSV não encontrado após a execução do script Python.");
    }

    // Conecta ao banco de dados
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão com o banco de dados: " . $conn->connect_error);
    }

    // Lê o arquivo CSV e insere no banco de dados
    if (($handle = fopen(CSV_PATH, "r")) !== false) {
        fgetcsv($handle); // Ignorar cabeçalho
        while (($linha = fgetcsv($handle, 1000, ",")) !== false) {
            $logged_food = $linha[0];
            $calorie = $linha[1];
            $carbo = $linha[2];
            $sugar = $linha[3];
            $protein = $linha[4];

            // Inserir dados no banco de dados
            $stmt = $conn->prepare("INSERT INTO food_data (id_patient, time_begin, logged_food, calorie, carbo, sugar, protein) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issdddd", $id_patient, $time_begin, $logged_food, $calorie, $carbo, $sugar, $protein);

            if (!$stmt->execute()) {
                throw new Exception("Erro ao inserir dados no banco: " . $stmt->error);
            }
        }
        fclose($handle);
    }

    $conn->close();

    echo json_encode(["success" => true, "message" => "Dados inseridos com sucesso.", "python_output" => $output]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
