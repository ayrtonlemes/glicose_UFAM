<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}
//               FALTA ADICIONAR OS PATHS CORRETOS                     ///////////////////////////
// PRECISA TROCAR PYTHON PATH, SCRIPT PATH E CSV PATH
// Configurações do script Python e CSV
define('PYTHON_PATH', 'C:\Users\ALUNO\anaconda3\envs\audioglicose\Scripts\python.exe');
define('SCRIPT_PATH', 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\chatgpt.py');
define('CSV_PATH', 'C:\xampp\htdocs\Sistema-Dashboard-Glicose\glicose_super\tabela_nutricional.csv');

// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glicose";

// Parâmetros recebidos
$id_patient = $_POST['id_patient'] ?? null;
$registro_date = $_POST['registro_date'] ?? null;
$time_begin = $_POST['time_begin'] ?? null;

if (!$id_patient || !$registro_date || !$time_begin || !isset($_FILES['audio_file'])) {
    echo json_encode(["error" => "Parâmetros 'id_patient', 'registro_date', 'time_begin' e o arquivo de áudio são obrigatórios."]);
    exit();
}

try {
    // Salva o arquivo de áudio enviado
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir);
    $audio_path = $upload_dir . basename($_FILES['audio_file']['name']);
    move_uploaded_file($_FILES['audio_file']['tmp_name'], $audio_path);

    // Executa o script Python
    $output = shell_exec("\"" . PYTHON_PATH . "\" \"" . SCRIPT_PATH . "\" \"" . $audio_path . "\" 2>&1");

    if (!file_exists(CSV_PATH)) {
        throw new Exception("Arquivo CSV não encontrado após a execução do script.");
    }

    // Conecta ao banco de dados
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão com o banco de dados: " . $conn->connect_error);
    }

    // Lê o arquivo CSV e insere no banco de dados
    if (($handle = fopen(CSV_PATH, "r")) !== false) {
        fgetcsv($handle); // Pula o cabeçalho
        while (($linha = fgetcsv($handle, 1000, ",")) !== false) {
            $logged_food = $linha[0];
            $calorie = $linha[1];
            $carbo = $linha[2];
            $sugar = $linha[3];
            $protein = $linha[4];
            $stmt = $conn->prepare("INSERT INTO food_data (id_patient, registro_date, time_begin, logged_food, calorie, carbo, sugar, protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("isssdddd", $id_patient, $registro_date, $time_begin, $logged_food, $calorie, $carbo, $sugar, $protein);

            if (!$stmt->execute()) {
                throw new Exception("Erro ao inserir dados no banco: " . $stmt->error);
            }
        }
        fclose($handle);
    }

    $conn->close();

    echo json_encode(["success" => true, "message" => "Dados inseridos com sucesso."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
