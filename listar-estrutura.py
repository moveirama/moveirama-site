import os

def listar_arquivos_e_pastas():
    # Nome do arquivo de saída
    arquivo_saida = "estrutura_pastas.txt"
    
    # Obtém o caminho da pasta onde o script está sendo executado
    diretorio_raiz = os.getcwd()
    
    with open(arquivo_saida, "w", encoding="utf-8") as f:
        f.write(f"ESTRUTURA DE PASTAS E ARQUIVOS - MOVEIRAMA\n")
        f.write(f"Raiz: {diretorio_raiz}\n")
        f.write("-" * 50 + "\n\n")
        
        # Percorre as pastas e arquivos
        for raiz, pastas, arquivos in os.walk(diretorio_raiz):
            # Ignora pastas de sistema ou virtuais (opcional)
            pastas[:] = [p for p in pastas if not p.startswith(('.', '__'))]
            
            # Calcula o nível de profundidade para a indentação
            nivel = raiz.replace(diretorio_raiz, '').count(os.sep)
            indentacao = ' ' * 4 * (nivel)
            
            # Escreve o nome da pasta
            pasta_atual = os.path.basename(raiz)
            if pasta_atual == '':
                f.write(f"[RAIZ]\n")
            else:
                f.write(f"{indentacao}📂 {pasta_atual}/\n")
            
            # Escreve os arquivos dentro daquela pasta
            sub_indentacao = ' ' * 4 * (nivel + 1)
            for arquivo in arquivos:
                if arquivo != arquivo_saida and arquivo != os.path.basename(__file__):
                    f.write(f"{sub_indentacao}📄 {arquivo}\n")

    print(f"Sucesso! A estrutura foi salva em: {arquivo_saida}")

if __name__ == "__main__":
    listar_arquivos_e_pastas()