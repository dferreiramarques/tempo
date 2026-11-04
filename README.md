# Tempo · Metrónomo

Metrónomo em português, pensado para telemóvel e para converter indicações de andamento da partitura numa pulsação audível. Funciona no navegador e pode ser instalado como aplicação web no Android, com utilização offline após a primeira abertura.

## Como usar

- Toque ou clique na imagem do metrónomo para iniciar ou parar. Com a imagem selecionada, também pode usar Enter ou a barra de espaço.
- Escolha um dos 19 andamentos, de Larghissimo a Prestissimo. A aplicação começa no BPM médio do intervalo; ajuste com o slider ou os botões − e +.
- Escreva diretamente no campo BPM para definir um tempo manual entre 20 e 300. O seletor passa a mostrar o valor introduzido.
- Use **Tap Tempo** para marcar o andamento com vários toques. O seletor mostra «Tap Tempo».
- Abra **Definições**, ao lado do Tap Tempo, para escolher compasso, figura musical, ponto de aumentação, tipo de clique, acento e volume.

Os intervalos dos andamentos são orientativos e podem sobrepor-se. A indicação da figura é essencial: semínima = 60 BPM e semínima com ponto = 60 BPM representam durações musicais diferentes.

### Pulsação e unidade do compasso

Em **Pulsação**, cada clique corresponde à figura escolhida. Em **Unidade do compasso**, cada clique corresponde à figura indicada pelo denominador do compasso, com a velocidade convertida automaticamente.

Por exemplo, em 6/8 com semínima com ponto = 60 BPM, a pulsação dá dois cliques por compasso, a 60 cliques/minuto. A unidade do compasso dá seis cliques por compasso, a 180 cliques/minuto.

Há três sons: **Madeira**, **Metal** e **Digital**. O acento, quando ativado, destaca o início do compasso. A escala desenhada no metrónomo vai de 40 a 208 BPM; fora desse intervalo, o peso fica no limite e surge uma indicação. O BPM numérico continua a definir o áudio.

## Publicar no GitHub Pages

Não é necessário Railway, servidor próprio, instalação de dependências ou compilação.

1. Extraia o conteúdo de `tempo-app-offline.zip`.
2. Coloque os ficheiros extraídos na raiz do repositório, incluindo `index.html`, os dois ficheiros JavaScript, o manifesto, o service worker, os ícones e `tempo-offline.html`. Não carregue apenas o ZIP.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
5. Escolha a branch que contém os ficheiros, por exemplo `main`, e a pasta **/(root)**. Grave em **Save**.
6. Aguarde a publicação e abra o endereço apresentado nessa página. Use o endereço HTTPS do site, não a página do repositório.

Os caminhos são relativos, permitindo publicar também num endereço de projeto como `https://UTILIZADOR.github.io/REPOSITORIO/`.

Consulte as [instruções oficiais do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Instalar no Android e usar offline

1. Abra o site publicado no **Chrome do Android**, com ligação à internet.
2. Entre em **Definições → Descarregar / instalar offline**.
3. Aguarde a mensagem **«Pronto para usar offline neste dispositivo»**.
4. Se aparecer, toque em **Instalar no Android**. Em alternativa, use o menu **⋮** do Chrome e procure **Adicionar ao ecrã principal** ou **Instalar aplicação**; a designação pode variar.
5. Abra a aplicação pelo ícone e confirme o funcionamento com o modo de avião ativado.

A instalação é uma aplicação web (PWA), não um APK. Precisa de HTTPS para a instalação e preparação offline. Depois de os recursos ficarem guardados no dispositivo, os controlos e os três sons funcionam sem ligação. Limpar os dados do site pode apagar essa cópia offline.

Também pode descarregar **`tempo-offline.html`**, que inclui a interface e o áudio num único ficheiro. Abra-o num navegador compatível. A abertura de ficheiros locais no Android depende do navegador; para ter um ícone de aplicação, use a versão publicada e instalada.

Saiba mais sobre [instalação de aplicações web](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## Ficheiros

| Ficheiro | Função |
| --- | --- |
| `index.html` | Interface, estilos e desenho do metrónomo |
| `app.js` | Andamentos, conversões, controlos e geração do áudio |
| `offline.js` | Painéis de definições e instalação |
| `sw.js` | Cache para utilização offline |
| `manifest.webmanifest` | Nome, ícones e apresentação da aplicação instalada |
| `icon-192.png`, `icon-512.png` | Ícones da aplicação |
| `tempo-offline.html` | Versão autónoma para descarregar |
| `.nojekyll` | Indica ao GitHub Pages que publique os ficheiros estáticos diretamente |
| `README.md` | Este guia |

## Desenvolvimento e atualizações

A aplicação usa HTML, CSS e JavaScript, com Web Audio API para sintetizar os cliques. Não depende de serviços externos, ficheiros de som remotos ou bibliotecas de terceiros.

Para testar a instalação e a cache localmente, sirva a pasta por HTTP em `localhost`, por exemplo, com Python instalado:

```sh
python -m http.server 8000
```

Abra `http://localhost:8000`. Abrir `index.html` diretamente como ficheiro não permite testar o service worker.

Ao publicar alterações:

1. Atualize os ficheiros do site.
2. Altere a versão da constante `CACHE` em `sw.js`, para renovar os recursos offline.
3. Atualize também `tempo-offline.html` se disponibilizar a versão autónoma. Este ficheiro tem os estilos e os scripts incorporados e não acompanha automaticamente as edições dos outros ficheiros.
4. Abra o site com internet e volte a abri-lo se ainda apresentar a versão anterior.

## Limitações

- A aplicação interrompe a reprodução quando a página fica oculta, incluindo ao mudar de aplicação ou bloquear o ecrã. Destina-se a funcionar com o ecrã ativo.
- O primeiro toque no metrónomo permite ao navegador ativar o áudio.
- A precisão depende do navegador e do dispositivo. A instalação e a reprodução devem ser confirmadas no Android de destino.
- Os andamentos e a animação são referências de estudo; o desenho não simula a física de um mecanismo real.


## Ícones e atualizações instaladas

Os PNG 192 e 512 derivam de tempo-icon.svg; o maskable tem fundo opaco e símbolo reduzido à área segura. Os URLs usam ?v=20261104: altere a versão no manifesto, HTML e ASSETS ao substituir ícones. Preserve o URL do manifesto, id, start_url e scope.

A cache v11 substitui a v10 apenas depois de guardar todos os recursos. Há verificações ao abrir, voltar ao primeiro plano e recuperar ligação. A versão nova fica disponível na abertura seguinte, sem recarregar o metrónomo em uso. Continue a aumentar CACHE quando alterar os recursos offline.

O Chrome/WebAPK e o launcher gerem separadamente o ícone instalado no Android. Abra com internet, feche e reabra; a mudança pode demorar ou pedir confirmação. Se persistir o ícone antigo, remover e reinstalar é uma alternativa manual, não um requisito. Valide num dispositivo real. Referência: https://developer.chrome.com/blog/improvements-to-web-app-updates.
