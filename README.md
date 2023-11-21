# hybrop2p

en: Hybrid broker-person oriented file sharing on P2P networks
pt-br: Compartilhador de arquivos híbrido orientado à arquitetura broker-based sobre redes P2P

### Por que?

Este projeto inicia-se como um trabalho final do curso de Recuperação da Informação do Bacharelado em Ciências da Computação da Universidade Federal do Rio de Janeiro (UFRJ).

O volume sempre crescente de documentos acadêmicos demanda sistemas eficientes de recuperação de informação para facilitar o acesso e a busca por conteúdo relevante.

Existem várias plataformas de hospedagem de artigos acadêmicos que oferecem serviços de hospedagem e indexação para autores, pesquisadores e instituições compartilharem e acessarem trabalhos científicos, como por exemplo a ResearchGate, Academia.edu, Mendeley, entre outras. Cada plataforma pode ter um modelo de negócios diferente em termos de cobrança, e algumas delas podem oferecer planos gratuitos e pagos.

Ainda que existam fundações e órgãos governamentais que também oferecem esse tipo de serviço para universidades públicas, encontrar artigos, aulas e documentos acadêmicos em geral pode não ser uma tarefa tão simples. Dificuldades de acesso à informação podem ser aumentadas pelo grande número de plataformas, tornando a busca por itens muito distribuída.

Nesse contexto, sistemas descentralizados surgem como alternativas promissoras, proporcionando maior escalabilidade e distribuição de recursos, porém uma alternativa que possa centralizar a indexação e busca dos documentos se torna necessária.

Plataformas de busca como a solução do Google Acadêmico são ótimas soluções, mas neste trabalho, vamos propor um Sistema Descentralizado de Recuperação de Informação para a Universidade Federal do Rio de Janeiro (UFRJ), utilizando uma abordagem híbrida broker-based sobre redes peer-to-peer (P2P).

O sistema proposto terá uma arquitetura baseada na distribuição de nós na rede P2P, um ou mais para cada Centro de Ensino. Essa arquitetura pode ser escalada para que cada universidade ao redor do globo possa participar da rede como um ou mais nós P2P.

Este sistema transfere a responsabilidade de hospedagem às universidades, aumentando o risco de falta de acesso caso uma universidade perca acesso à rede, por isso, negociações entre universidades participantes para hospedarem nós replicados podem se tornar alternativas para este problema.


### O que se propoe?

Diante do exposto, propõe-se o desenvolvimento de um sistema descentralizado de recuperação de informações acadêmicas para a Universidade Federal do Rio de Janeiro (UFRJ). Este sistema será fundamentado em uma abordagem híbrida, tentando unir os benefícios do compartilhamento de arquivos sobre redes peer-to-peer (P2P) com o poder facilitador de unir operações a partir de um broker.

Iremos fundamentar uma possível arquitetura e implementar componentes que estejam mais próximos da grade da disciplina de Recuperação de Informação. Por isso, algumas partes do sistema deverão ser emuladas ou “mockadas” para que seja possível realizar testes de implementação.

#### Objetivos:

Desenvolver um sistema que permita a recuperação eficiente e facilitada de documentos acadêmicos, aulas e outros materiais relevantes para a comunidade acadêmica da UFRJ;
Utilizar a arquitetura P2P para descentralizar a infraestrutura, distribuindo responsabilidades e recursos entre os nós participantes;
Possibilitar a participação de outras universidades ao redor do mundo na rede P2P, promovendo uma colaboração global na hospedagem e compartilhamento de documentos acadêmicos de diversas nacionalidades;
Garantir a segurança e confidencialidade dos documentos através de práticas robustas de autenticação, criptografia e controle de acesso.

#### Metodologia:

Realizar um estudo detalhado sobre redes P2P, arquiteturas broker-based, e algoritmos de indexação. Compreender as nuances desses conceitos é crucial para a construção de uma solução eficiente;
Desenvolver um protótipo do sistema, incluindo a criação de módulos que permitam a comunicação entre os nós através do broker (mesmo que, inicialmente, de forma emulada), a indexação descentralizada dos documentos e a recuperação eficiente de informações a partir de consultas;
Emular situações de busca, recuperação e replicação de nós para realizar testes e identificar possíveis falhas ou pontos de melhoria;
Avaliar a eficiência do sistema e, com base nos resultados, realizar ajustes e refinamentos na arquitetura e nos algoritmos implementados.

#### Resultados Esperados:

Obter um sistema descentralizado parcialmente funcional que permita a recuperação eficiente de documentos acadêmicos, promovendo a colaboração entre instituições de ensino;
Implementar medidas de segurança para proteger a integridade e confidencialidade dos documentos armazenados e transitados na rede;
Produzir um relatório que documente a arquitetura, os algoritmos implementados e os resultados obtidos, contribuindo assim para o avanço do conhecimento na área de Recuperação de Informação.

### Fundamentação teórica

#### Redes Peer-to-Peer (P2P):

As redes Peer-to-Peer (P2P) são sistemas descentralizados em que cada participante, ou nó, tem a capacidade de atuar tanto como cliente quanto como servidor. Essa abordagem distribuída permite a comunicação direta entre os participantes, eliminando a necessidade de um servidor central para coordenar as interações.

Em uma rede P2P, não há uma entidade central controlando a comunicação ou armazenamento. Cada nó é igualmente responsável por suas próprias operações e pode interagir diretamente com outros nós. Cada nó em uma rede P2P tem autonomia para tomar decisões independentes. Isso inclui a capacidade de armazenar dados localmente, realizar processamento e participar ativamente na rede. Nesse sentido, cada Universidade (e Centro de Ensino, na parte mais baixa da escala) terá responsabilidade própria para o funcionamento de toda a rede.

A escalabilidade é uma característica chave das redes P2P. À medida que mais participantes são adicionados à rede, a capacidade de processamento e armazenamento geralmente aumenta, permitindo que a rede cresça sem a necessidade de recursos centralizados. Na arquitetura aqui proposta, universidades podem ser responsáveis por replicar conteúdos umas das outras, assim como podem replicar seus conteúdos por nós contratados de terceiros e espalhados pelo globo para garantir acesso aos seus dados mesmo em eventuais problemas com algum dos nós.

Nessa arquitetura, a segurança e a confidencialidade dos dados serão garantidas por meio de criptografia. Os usuários devem se autenticar ao broker e os nós devem se autenticar uns aos outros e ao broker para garantir a integridade das informações transmitidas.

#### Arquiteturas Broker-Based:

Arquiteturas broker-based utilizam um componente intermediário chamado "broker" para facilitar a comunicação entre diferentes entidades em um sistema distribuído. O broker atua como um ponto central que gerencia e coordena a troca de informações entre os nós participantes.

O broker atua como um ponto centralizado para gerenciamento e coordenação, reduzindo a complexidade da comunicação direta entre pares. Na nossa arquitetura ele será responsável por auxiliar a indexar os documentos que correspondem à consulta feita pelo nó requerente, direcionando as consultas aos nós que possuem documentos relevantes a consulta.

Em arquiteturas broker-based padrões, os nós se comunicam entre si indiretamente por meio do broker. Quando um nó deseja enviar uma mensagem ou acessar informações de outro nó, ele envia a mensagem para o broker, que encaminha a mensagem para o destinatário adequado. Na nossa arquitetura, a única parte da comunicação que será realizada indiretamente entre os nós, a partir do broker, será o redirecionamento da consulta aos nós relevantes, assim como o redirecionamento da resposta ao nó interessado.

O broker irá atuar como um gerenciador de serviços de indexação, autenticação, e outros serviços comuns que podem ser centralizados para simplificar a comunicação entre os nós.

Na nossa arquitetura, teremos que garantir que exista uma forma do broker possuir uma tabela hash que contenha informações de tokens relevantes dos documentos que cada nó possui. Esses tokens relevantes podem ser obtidos de diversas formas. Desenvolveremos mais acerca da obtenção destes tokens mais a frente. Essa tabela hash é essencial para que o broker consiga direcionar uma consulta apenas aos nós que possuem documentos relevantes àquela consulta, reduzindo a carga de uso evitando processamento de consultas desnecessárias, isso porque cada nó irá executar internamente o algoritmo de busca a partir das consultas recebidas.

#### Algoritmos de indexação para recuperação da informação:

Precisaremos assumir que cada nó consiga executar algoritmos de indexação a partir de consultas vindas do broker. Isso será garantido a partir de duas premissas:
1. os nós detentores de documentos têm capacidade de processar consultas e retornar uma lista com os documentos que correspondem à consulta já indexados internamente, assim como;
2. os nós interessados, que enviam a consulta ao broker, devem ser capazes de, ao receber zero ou mais respostas dos nós, unirem as respostas a partir de um algoritmo próprio para re-indexação dos documentos.

#### Possível arquitetura do projeto

Nós são entidades standalone, isso significa que terão de ter suas próprias maneiras de:
- Ao receber documentos novos, procurar palavras chaves, informações referentes ao documento e compor e atualizar o hash do nó;
- Ao enviar uma consulta, deverão construir uma consulta fantasma em formato hash;
- Ao receber uma consulta no formato original, deverão executar algoritmos de busca e retornar um conjunto de documentos já indexados por relevância;
- Ao receber um conjunto de documentos indexados como resposta de uma consulta, deverão unir os resultados e conseguir reindexar estes de forma a exibir ao usuário uma lista ordenada.

O broker deverá receber um tupla contendo id do requerente, consulta original e consulta fantasma, buscar na tabela os nós que podem ter documentos relevantes à essa consulta, checar conectividade do nó requisitado e enviar aos dois um gatilho de conexão.

O nó requisitado, então, recebe a consulta original e a executa. Após o recebimento de 0 ou mais resultados, o nó requerente re-indexa o que foi recebido.
