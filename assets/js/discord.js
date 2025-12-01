document.addEventListener("DOMContentLoaded", () => {
    if (!window.Crate) return;

    const crate = new Crate({
        server: "1361196873045643344",
        channel: "1361196873045643348",
        color: "#7E56C2",
    });

    const AVATAR_URL = "/assets/img/avatar.jpg";
    const AUDIO_URL = "/assets/js/notif.mp3";

    // =========================
    // UTILS
    // =========================

    const playSound = () => {
        const audio = new Audio(AUDIO_URL);
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Erro ao tocar som:", e));
    };

    const notify = (message) => {
        playSound();
        crate.notify({
            content: message,
            avatar: AVATAR_URL,
            timeout: 5000,
        });
    };

    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    const save = (key, value = "true") => localStorage.setItem(key, value);
    const load = (key) => localStorage.getItem(key);

    const now = () => Date.now();

    // =========================
    // CONFIG
    // =========================

    const CONFIG = {
        firstVisitGlobal: {
        probability: 1.0,
        messages: [
            "🎉 Bem-vindo pela primeira vez ao site! Já conhece nosso Discord pra ajudar com os Ultra Boss?",
                "👋 Olá! Primeira visita? Fica à vontade! Nosso Discord tá cheio de gente pronta pra ajudar nos Ultras!",
                "🌟 Chegou agora? Show! Temos um canal no Discord para ajudar você a derrotar Ultras rapidinho!",
                "⚔️ Primeira vez aqui? Se prepara que os Ultras não vão saber o que te atingiu! Cola no nosso Discord!",
                "🔥 Bem-vindo! Se precisar de ajuda com Ultra Boss, temos um time pronto no Discord!",
                "🎊 Primeira visita detectada! Entre no nosso Discord e receba ajuda com Ultras!",
                "🚀 Olá! Você acaba de pousar no nosso site! Bora ganhar uns Ultras no Discord?",
                "🛡️ Seja bem-vindo! Se estiver travado em algum Ultra, o Discord salva!",
                "✨ Primeira vez por aqui? Já deixa salvo: nosso Discord ajuda com TODOS os Ultras!",
                "🏹 Opa! Primeira visita? Se quiser ajuda com Ultra Boss, é só colar no Discord!",
                "🧭 Bem-vindo, viajante! Que tal uma ajudinha com Ultras no nosso Discord?",
                "💬 Chegando agora? Temos dicas, squads e ajuda com Ultras no nosso Discord!",
                "🌐 Primeira visita! Explore o site e passe no Discord para derrotar Ultras!",
                "🎯 Olá, recruta! Precisando derrotar Ultras? O Discord é o ponto de encontro!",
                "⚡ Primeira vez? Você desbloqueou o bônus: ajuda grátis com Ultras no Discord!",
                "👑 Bem-vindo! Derrotar Ultra Boss nunca foi tão fácil — só entrar no Discord!",
                "🔮 Primeira visita! Quer aprender mecânicas de ultras? A galera do Discord manja!",
                "📢 Ei você! Primeira vez aqui, né? Nosso Discord tá aberto pra te ajudar nos Ultras!",
                "💎 Seja bem-vindo! Ultra bosses não perdoam… mas nosso Discord ajuda você a perdoar eles!",
                "🦾 Primeira visita registrada! Quer montar grupo pros Ultras? Discord te espera!",
                "🏆 Bem-vindo ao guia definitivo! No Discord você encontra ajuda para qualquer Ultra Boss!",
                "🌌 Primeira visita? Então já anota: no Discord a gente ajuda com qualquer ultra!",
                "🗡️ Opa! Novo por aqui? Cola no Discord pra dominar os Ultras sem estresse!",
                "🛕 Primeira vez? Então receba nossas bênçãos… e ajuda com Ultras no Discord!",
                "🧙‍♂️ Bem-vindo, aventureiro! Se os Ultras forem fortes demais, o Discord resolve!",
                "📜 Primeira visita ao reino dos guias! Precisa formar um time pros Ultras? Discord neles!",
                "🎒 Novo por aqui? Equipa seu Discord e vem derrotar uns Ultras!",
                "🚨 Alerta de novo visitante! Entre no Discord e receba assistência anti-ultras!",
                "🌠 Primeira visita? Fique à vontade — o Discord é seu aliado contra Ultras!",
                "💥 Chegando agora? Os Ultra Boss não vão saber o que aconteceu depois que você entrar no Discord!",
                "🎇 Bem-vindo! Ultra Bosses são difíceis… mas com nosso Discord ficam moleza!",
                "🎭 Novo visitante apareceu! Precisa de ajuda com Ultra Boss? Discord tá aí pra isso!",
                "🏹 Primeira vez? Quer loadouts ou mecânicas de ultras? Discord resolve!",
                "📦 Bem-vindo! Aqui entregamos guias… e no Discord entregamos ajuda contra ultras!",
                "⚙️ Primeira visita! Ajuste seu equipamento e passe no Discord para caçar Ultras!",
                "🌄 Seja bem-vindo! Começando agora? O Discord te ajuda a atropelar qualquer Ultra!",
                "🛰️ Primeira conexão estabelecida! Baixe apoio aéreo no Discord contra Ultra Boss!",
                "🌈 Oi! Primeira visita? No nosso Discord você nunca enfrenta ultras sozinho!",
                "🔔 Bem-vindo! Se o Ultra Boss tá difícil, o Discord toca o sino e ajuda você!",
                "🧩 Chegando agora? Complete seu puzzle com ajuda do Discord nos Ultras!",
                "⭐ Primeira visita! Bora transformar Ultras em loot? Só colar no Discord!",
            ],
        },

        pageSpecific: {
            "/index.html": {
                probability: 0.3,
                messages: [
                    "🌟 Bem-vindo à página inicial!",
                    "🚀 Explore os nossos guias, notícias e ferramentas!",
                    "📌 Dica: confira os Ultra Boss em destaque!",
                ],
            },

            "/sobre.html": {
                probability: 0.2,
                messages: [
                    "👤 Aqui você descobre mais sobre o projeto e a comunidade!",
                    "📘 Saiba quem mantém tudo isso funcionando!",
                ],
            },

            // GUIAS GERAL
            "/guias/index.html": {
                probability: 0.25,
                messages: [
                    "Aqui você encontra todos os guias organizados!",
                    "Procurando uma classe, boss ou item? Comece por aqui!",
                ],
            },

            // ULTRA BOSSES (mesmo que seja diretório)
            "/guias/ultra-bosses": {
                probability: 0.2,
                messages: [
                    "Tá precisando de ajuda com Ultra Boss?",
                    "Ainda tendo problemas com ultras? Talvez nossos guias ajudem!",
                    "Quer aprender a derrotar qualquer Ultra Boss sem stress?",
                ],
            },

            // CLASSES (diretório)
            "/guias/classes": {
                probability: 0.15,
                messages: [
                    "📚 Aprenda tudo sobre as classes de AQW!",
                    "⚔️ Qual classe você quer dominar hoje?",
                ],
            },

            // CONSUMÍVEIS
            "/guias/consumiveis": {
                probability: 0.15,
                messages: [
                    "💊 Quer saber qual consumível usar nos Ultras?",
                    "🍲 Consumíveis certos = batalha vencida!",
                ],
            },

            // ENHANCEMENTS
            "/guias/enhancements": {
                probability: 0.15,
                messages: [
                    "✨ Procurando o melhor enhancement para sua classe?",
                    "💠 Powerword Die hoje? 😎",
                ],
            },

            // DUNGEONS
            "/guias/dungeons": {
                probability: 0.15,
                messages: [
                    "⚔️ Preparado para explorar uma dungeon complicada?",
                    "🕳️ As dungeons de AQW sempre escondem segredos…",
                ],
            },

            // ITENS
            "/guias/itens": {
                probability: 0.15,
                messages: [
                    "🔷 Procurando Blade of Awe ou itens especiais?",
                    "🎁 Itens poderosos podem mudar seu gameplay!",
                ],
            },

            // REPUTAÇÃO
            "/guias/reputacao/index.html": {
                probability: 0.15,
                messages: [
                    "📈 Dica: pegar rank 10 de rep abre muitas portas no AQW!",
                    "🔰 Quer upar reputação mais rápido? Temos métodos eficientes!",
                ],
            },

            // *BLOG (JORNAL)*
            "/jornal": {
                probability: 0.2,
                messages: [
                    "📰 Fique por dentro das novidades, dicas e comparativos!",
                    "📜 Tem artigo novo saindo toda semana!",
                ],
            },

            // ULTRAHUB
            "/ultrahub": {
                probability: 0.25,
                messages: [
                    "⚙️ Bem-vindo ao UltraHub — ferramentas para Ultras!",
                    "🤖 Bots, informações e guias tudo em um só lugar!",
                ],
            },
        },

        generic: {
            probability: 0.2,
            messages: [
                "Participe da conversa no nosso servidor!",
                "Tá precisando de ajuda com algum boss?",
                "Mulheres solteiras na sua região... mentira!",
                "Voltou a jogar e não sabe pra onde ir?",

                "Você já tomou sua poção de café hoje?",
                "Coragem! Até o Nulgath já falhou um merge.",
                "A aventura te chama… provavelmente pra farmar.",
                "Nada como um pouco de RNG pra destruir seu dia!",
                "Se cansar, respira… e tenta de novo, aventureiro.",
                "Twilly te mandou um abraço (e um heal).",
                "Dica secreta: farmar sem sono aumenta o drop… mentira outra vez!",
                "Seu inventário já lotou hoje?",
                "Se quiser ajuda, a comunidade tá sempre por perto!",
                "Os Ultra Boss não vão se derrotar sozinhos… infelizmente.",
                "Você já bebeu sua Health Potion hoje?",
                "Se o drop não veio, a culpa é do servidor. Sempre.",
                "Sorte no jogo hoje! Ou pelo menos tentativa.",
                "Respire fundo… é só mais uma quest de 500 itens.",
                "Hoje é um bom dia para upar reputação!",
                "A história de AQW é longa… mas seu farm pode ser mais ainda.",
                "Cuidado: procrastinar no jogo também conta como gameplay.",
                "Já bateu aquele cansaço de tanto farm? Normal.",
                "Se o boss tá difícil, chama os amigos!",
                "O Moglin Verde te observa 👀",
                "Que tal revisar suas classes hoje? Sempre tem uma esquecida!",
                "Aposto que você esqueceu de aceitar a quest… de novo.",
                "O verdadeiro Ultra Boss é o RNG.",
                "Você já deu /join party hoje?",
                "Farmar sozinho é triste. Chama alguém!",
                "O universo conspira… pra você não pegar o drop.",
                "A aventura sempre continua — a energia nem sempre.",
                "Sorria! Mesmo que o drop não venha.",
                "30 minutos jogando… e 2h arrumando o inventário.",
                "Você sabia que AQW também tem uma história?",
                "Boatos que quem participa do Discord dropa mais.",
                "Cuidado: usar Powerword Die sem querer é perigoso.",
                "Se organize: um bom farm começa com um café.",
                "Nulgath aprovou essa mensagem. Talvez.",
                "Alguém aí disse ultra? 👀",
                "Hoje o dia promete… ou não.",
                "Farmar com música melhora o drop. Confia.",
                "Você tá indo bem! Mesmo se o boss diga o contrário.",
            ],
        },

        settings: {
            cooldownMinutes: 30,
        },
    };

    // =========================
    // LOGIC
    // =========================

    const currentPath = window.location.pathname.replace(/\/$/, "");
    const lastNotificationKey = `lastNotification_${currentPath}`;
    const pageVisitKey = `visitedPage_${currentPath}`;
    const isFirstVisitGlobal = !load("visitedBefore");
    const isFirstVisitPage = !load(pageVisitKey);

    // 1) Primeira visita global
    if (isFirstVisitGlobal) {
        save("visitedBefore");
        notify(pickRandom(CONFIG.firstVisitGlobal.messages));
        return;
    }

    // 2) Cooldown
    const lastNotification = load(lastNotificationKey);
    const cooldownMs = CONFIG.settings.cooldownMinutes * 60 * 1000;

    if (lastNotification && now() - lastNotification < cooldownMs) return;

    // 3) Verificar se página tem mensagens específicas
    const pageConfig =
        Object.entries(CONFIG.pageSpecific).find(([path]) =>
            currentPath.startsWith(path.replace(/\/$/, ""))
        )?.[1] || null;

    // 4) Primeira visita da página
    if (isFirstVisitPage) {
        save(pageVisitKey);

        const messages =
            pageConfig?.messages || CONFIG.generic.messages;

        notify(pickRandom(messages));
        save(lastNotificationKey, now());
        return;
    }

    // 5) Mensagens específicas (probabilidade)
    if (pageConfig && Math.random() < pageConfig.probability) {
        notify(pickRandom(pageConfig.messages));
        save(lastNotificationKey, now());
        return;
    }

    // 6) Mensagens genéricas (probabilidade)
    if (Math.random() < CONFIG.generic.probability) {
        notify(pickRandom(CONFIG.generic.messages));
        save(lastNotificationKey, now());
        return;
    }
});
