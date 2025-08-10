# Configurar Debian 13 para Audio

> Essa configuração permite produzir música na DAW e ouvir ao mesmo tempo os sons do sistema, como players de música ou vídeos, sem interrupções ou conflitos de áudio.

##### Instala suporte JACK no PipeWire:

```bash
sudo apt install pipewire-jack
```

-----

##### Instala ferramentas e bibliotecas essenciais para compilar.

```bash
sudo apt install --no-install-recommends dkms libdw-dev clang lld llvm build-essential git wget lsb_realease
```

----

##### Copia configuração para o sistema localizar as bibliotecas do JACK no PipeWire.

```bash
sudo cp /usr/share/doc/pipewire/examples/ld.so.conf.d/pipewire-jack-*.conf /etc/ld.so.conf.d/
```

---

##### Atualiza a lista de bibliotecas do sistema para reconhecer as novas configurações.

```bash
sudo ldconfig
```

----

##### Adicionar o usuário ao grupo `audio` para ter permissões especiais de áudio.

```bash
sudo usermod -aG audio "$USER"
```

---

 Abra o arquivo para definir limites de prioridade e memória para o grupo `audio`.

```bash
sudo nano /etc/security/limits.conf
```

coloque as configurações abaixo no final do arquivo antes do **\# End of file** :

```bash
@audio - rtprio 90       # maximum realtime priority
@audio - memlock unlimited  # maximum locked-in-memory address space (KB)
```

Salve e feche o editor (`Ctrl+O` para salvar, `Enter` para confirmar, `Ctrl+X` para sair no nano).

---

Crie a configuração para reduzir uso de **swap** e melhorar desempenho.

```bash
csudo nano /etc/sysctl.d/swappiness.conf
```

Insira

```bash
vm.swappiness = 10
```

Salve e saia do nano com:

Pressione `Ctrl + O` para salvar, depois `Enter` para confirmar o nome do arquivo.

Pressione `Ctrl + X` para sair.

----

Abra a configuração para otimizar o kernel para baixa latência e desempenho.

```bash
sudo nano /etc/default/grub.d/cmdline-linux-default.cfg
```

Insira:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="cpufreq.default_governor=performance mitigations=off preempt=full quiet splash threadirqs"
```

Salve e saia do editor da mesma forma (`Ctrl + O`, `Enter`, `Ctrl + X`).

----

##### Passos finais importantes:

Para aplicar a configuração do `sysctl`, rode:

```bash
sudo sysctl --system
```

----

Para aplicar as mudanças do GRUB, rode:

```bash
sudo update-grub
```

-------

##### Baixe a regra do `udev` para reduzir latência de DMA da CPU.

```bash
sudo wget -qO /etc/udev/rules.d/99-cpu-dma-latency.rules https://raw.githubusercontent.com/Ardour/ardour/master/tools/udev/99-cpu-dma-latency.rules
```

-----

##### Baixe o script para priorizar interrupções de hardware relacionadas ao áudio.

```bash
git clone -q https://github.com/jhernberg/udev-rtirq
```

depois entre na pasta do script baixado

```bash
cd udev-rtirq
```

##### Instale o script de priorização de IRQ no sistema.

```bash
sudo make install
```

depois saia da pasta:

```bash
cd ..
```

apague a pasta

```bash
rm -rf udev-rtirq
```

##### Depois reinicie o sistema para as configurações entrarem em vigor.

---

#### Instale kernel Xanmod "**Opcional**" APENAS SE QUISER!!!!

Register the PGP key:

```bash
wget -qO - https://dl.xanmod.org/archive.key | sudo gpg --dearmor -vo /etc/apt/keyrings/xanmod-archive-keyring.gpg
```

----

Add the repository:  Supported distribution codenames: **bookworm, trixie, sid, noble, oracular, plucky, questing, faye, wilma and xia**.

```bash
echo "deb [signed-by=/etc/apt/keyrings/xanmod-archive-keyring.gpg] http://deb.xanmod.org $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/xanmod-release.list
```

-----

Then update and install

```bash
sudo apt update && sudo apt install linux-xanmod-lts-x64v1
```

---

Reinicie a maquina!

---

