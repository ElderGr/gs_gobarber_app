# Semana 3 GoStack: Mobile Gobarber
Projeto desenvolvido durante a Semana 3 do bootcamp GoStack, construindo a aplicação Gomarketplace, explorando conceitos de React Native como:
- [x] React Hooks
- [x] Styled-components
- [x] Context-api
- [x] Componentização
- [x] Estado e imutabilidade

## ⚙ Pré-requisitos
Para a execução do projeto em seu ambiente local é necessário possuir instalado:

- NodeJS em sua versão LTS
> https://nodejs.org/en/

- Configurar o ambiente local mobile, seguindo os passos abaixo
> https://react-native.rocketseat.dev/

## 🛠 Guia de instalação do projeto
1. Faça download do projeto do github
2. Após ter feito download do projeto, acesse o diretorio raiz do mesmo via linha de comando
3. No terminal, execute o comando npm install para instalar as dependências do projeto (Caso você tenha o yarn instalado em sua máquina, execute apenas yarn para a instalação das dependencias)
4. Com o ambiente mobile configurado e com um emulador android/ios em execução, ou um device conectado via usb, execute o comando `react-native run-android` ou `react-native run-ios` para IOS. Caso você possua mais de um device conectado ou emulador em execução passe o nome do dispositivo no final dos comandos citados acima.

## 📃 Guia de utilização
Link para a API que o APP está consumindo
> https://github.com/ElderGr/gs-gobarber-backend

No caminho src/services/api.js teremos o arquivo de configuração para as requisições a API. Será necessário realizar alterações no valor de _baseURL_ baseado na forma que o ambiente mobile está sendo utilizado

**Device USB IOS/Android**:
Caso você esteja com um device conectado via USB tanto Android quanto IOS, a string deverá seguir o padrão http://_ip_:_port_, onde ip é o ip do pc que está sendo executada a api e port a porta que está sendo utilizada. É necessário que o device esteja na mesma rede da pc.

**Device Android**:
Execute o comando adb reverse tcp:5000 tcp:5000 e defina o valor da _baseURL_ como http://localhost:5000

**Device IOS**:
Defina o valor da _baseURL_ como http://localhost:5000

## 📋 Comandos disponíveis
* start: execução do app em seu device ou emulador após o bundle ter sido gerado
