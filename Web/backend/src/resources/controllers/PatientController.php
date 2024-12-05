<?php
// Defina as credenciais do banco de dados
$servername = "localhost"; // ou o endereço do seu servidor MySQL
$username = "seu_usuario"; // seu usuário do banco
$password = "sua_senha"; // sua senha do banco
$dbname = "seu_banco"; // nome do seu banco de dados

// Cria a conexão com o MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Define a consulta SQL
$sql = "SELECT * FROM tabela_patient"; // Substitua "tabela_patient" pelo nome correto da sua tabela
$result = $conn->query($sql);

// Verifica se há resultados
if ($result->num_rows > 0) {
    // Exibe os dados de cada linha
    while($row = $result->fetch_assoc()) {
        // Aqui, você pode acessar os campos da tabela como $row['nome_coluna']
        echo "ID: " . $row["id"] . " - Nome: " . $row["nome"] . " - Idade: " . $row["idade"] . "<br>";
    }
} else {
    echo "0 resultados encontrados.";
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
