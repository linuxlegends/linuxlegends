# JJazzLab

Instale o fluidsynth:

```plaintext
sudo pacman -S fluidsynth soundfont-fluid
```

Baixe o `.zip` do JazzLab em: https://www.jjazzlab.org/en/download/

Extraia o arquivo `JJazzLab-4.1.2-linux-x64.tar.xz`:

```plaintext
tar -xf JJazzLab-4.1.2-linux-x64.tar.xz
```

Mova a pasta extraída para a pasta `/opt/jjazzlab`:

```plaintext
cd Downloads
```

```plaintext
sudo mv JJazzLab-4.1.2 /opt/jjazzlab
```

Crie um link simbólico (atalho) para o programa:

```plaintext
sudo ln -sf /opt/jjazzlab/bin/jjazzlab /usr/bin/jjazzlab
```

Criar atalho no menu: Crie um arquivo com o **nano** em `/usr/share/applications/` e escreva isso no arquivo:

```plaintext
sudo nano /usr/share/applications/jjazzlab.desktop
```

```plaintext
[Desktop Entry]
Name=JJazzLab
Exec=/usr/bin/jjazzlab
Icon=/opt/jjazzlab/jazzlab.png
Type=Application
Categories=Audio;Music;
```
