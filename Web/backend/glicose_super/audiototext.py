import whisper
import torch
import sys

class Audio:
    def __init__(self, arquivo_audio: str, modelo: str = "small"):
        """
        Inicializa a classe Audio.

        :param arquivo_audio: Caminho do arquivo de áudio (m4a, mp3, wav, etc.).
        :param modelo: Modelo Whisper a ser usado (tiny, base, small, medium, large).
        """
        self.arquivo_audio = arquivo_audio
        self.modelo = modelo
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        print(f"Carregando modelo '{modelo}' no dispositivo: {self.device}...")
        self.model = whisper.load_model(modelo, device=self.device)

    def transcrever(self) -> str:
        """
        Transcreve o áudio usando Whisper.

        :return: Texto transcrito.
        """
        print(f"Transcrevendo '{self.arquivo_audio}'...")
        result = self.model.transcribe(self.arquivo_audio)
        print("\nTranscrição concluída!\n")
        return result["text"]

    def salvar_transcricao(self, nome_arquivo: str):
        """
        Salva a transcrição em um arquivo de texto.

        :param nome_arquivo: Nome do arquivo onde a transcrição será salva.
        """
        texto = self.transcrever()
        with open(nome_arquivo, "w", encoding="utf-8") as f:
            f.write(texto)
        print(f"Transcrição salva em '{nome_arquivo}'.")


# Verifica se recebeu o argumento do caminho do áudio
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Erro: Caminho do arquivo de áudio não fornecido.")
        sys.exit(1)

    caminho_audio = sys.argv[1]  # Pega o caminho do áudio passado pelo PHP
    nome_arquivo_transcricao = caminho_audio.replace(".m4a", ".txt").replace(".mp3", ".txt").replace(".wav", ".txt")

    audio = Audio(caminho_audio, modelo="base")  # Define o modelo desejado
    texto = audio.transcrever()
    
    print("\nTexto transcrito:\n", texto)

    # Salvar transcrição em um arquivo com nome baseado no áudio
    audio.salvar_transcricao(nome_arquivo_transcricao)
