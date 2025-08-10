# Debian

## Virtual Box
### Adicionais de convidados
```bash
sudo apt install gcc make perl
```

## Acesso root
```bash
su -
```

## Gerenciamento de usuários

### Concede privilégio de root é um usuário
```bash
sudo usermod -aG sudo samuel
```

### Altera senha de um usuário
```bash
sudo passwd samuel
```

### Cria novo usuário
```bash
sudo adduser novo_usuario
```

### Remove um usuário 
```bash
sudo deluser novo_usuario
```

## Gerenciamento de pacotes

### Atualiza lista de pacotes
```bash
sudo apt update
```

### Atualiza todos os pacotes instalados
```bash
sudo apt upgrade
```

### Instala um pacote
```bash
sudo apt install neofetch
```

### Remove um pacote
```bash
sudo apt remove neofetch
```

### Pesquisa um pacote
```bash
sudo apt search neofetch
```

### Remove todo os pacotes não utilizados 
```bash
sudo apt autoremove
```

## Navegação no sistema de arquivos

### Mostra o diretório atual
```bash
pwd
```

### Lista arquivos e pastas
```bash
ls
```

### Muda de diretório 
```bash
cd Documentos
```

```bash
cd Documentos/'Nova Pasta'
```

### Cria pasta
```bash
mkdir Samples
```

```bash
mkdir 'Meus Samples'
```

### Remove arquivos
```bash
rm Arquivo.txt
```

```bash
rm 'Meu Arquivo'.txt
```

### Remove pasta vazia
```bash
rmdir Pasta
```

```bash
rmdir 'Nova Pasta'
```

### Remove pasta com conteúdo (recursivo)
```bash
rm -r Pasta
```

```bash
rm -r 'Nova Pasta'
```

### Remove tudo dentro do diretório atual
```bash
rm *
```

```bash
rm -r *
```

## Gerenciamento de arquivos 

### Copia um arquivo
```bash
cp /Downloads/arquivo.txt /Documentos/txt
```

```bash
cd /Downloads/
cp arquivo.txt ~/Documentos/txt/
```

### Move um arquivo
```bash
mv /Downloads/arquivo.txt /Documentos/txt
```

```bash
cd /Downloads/
mv arquivo.txt ~/Documentos/txt/
```

### Renomeia um arquivo
```bash
mv arquivo.png abc.png
```

```bash
mv arquivo.mp3 'novo nome'.mp3
```

### Criar um arquivo 
```bash
touch documento.txt
```

```bash
touch 'novo documento'.txt
```

### Criar vários arquivos
```bash
touch arquivo{1,2,3}.txt
```

### Remove um arquivo
```bash
rm foto.jpg
```

## Permissão de execução de arquivo
```bash
chmod +x script.sh
```

```
sudo cp /usr/share/doc/pipewire/examples/ld.so.conf.d/pipewire-jack-*.conf /etc/ld.so.conf.d/
```

