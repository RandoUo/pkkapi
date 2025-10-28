const API_URL_OFFICIAL = "https://api.pokemontcg.io/v2";
const API_URL_TCGDEX = "https://api.tcgdex.net/v2";

const cardsContainer = document.getElementById("cards");
const setList = document.getElementById("setList");
const feedback = document.getElementById("feedback");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Buscar cartas nas duas APIs
searchBtn.addEventListener("click", () => {
  const name = searchInput.value.trim();
  if (!name) {
    showFeedback("Digite o nome de um Pokémon para buscar.");
    return;
  }

  showFeedback("🔍 Buscando cartas nas APIs...");

  // 1️⃣ API oficial
  const officialFetch = fetch(`${API_URL_OFFICIAL}/cards?q=name:${name}`)
    .then(res => res.json())
    .then(data => data.data || [])
    .catch(() => []);

  // 2️⃣ TCGdex
  const tcgdexFetch = fetch(`${API_URL_TCGDEX}/cards?search=${name}`)
    .then(res => res.json())
    .then(data => data.data || [])
    .catch(() => []);

  Promise.all([officialFetch, tcgdexFetch])
    .then(([officialCards, tcgdexCards]) => {
      if (officialCards.length === 0 && tcgdexCards.length === 0) {
        showFeedback("Nenhuma carta encontrada nas APIs. Tente outro nome!");
        cardsContainer.innerHTML = "";
      } else {
        showFeedback(
          `Cartas encontradas — Oficial: ${officialCards.length}, TCGdex: ${tcgdexCards.length}`
        );
        showCards(officialCards, "official");
        showCards(tcgdexCards, "tcgdex");
      }
    });
});

// Mostrar cartas com tag de origem
function showCards(cards, source) {
  cards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");

    // Pega a imagem (diferença entre APIs)
    const imgSrc = card.images?.small || card.image || "";

    div.innerHTML = `
      <span class="source source-${source}">${source.toUpperCase()}</span>
      <img src="${imgSrc}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p><b>Raridade:</b> ${card.rarity || "Desconhecida"}</p>
      <p><b>Tipo:</b> ${card.types ? card.types.join(", ") : "N/A"}</p>
    `;
    cardsContainer.appendChild(div);
  });
}

function showFeedback(msg) {
  feedback.textContent = msg;
}

// Carregar sets da API oficial
function loadSets() {
  fetch(`${API_URL_OFFICIAL}/sets`)
    .then(res => res.json())
    .then(data => {
      setList.innerHTML = "";
      data.data.slice(0, 8).forEach(set => {
        const li = document.createElement("li");
        li.textContent = set.name;
        setList.appendChild(li);
      });
    })
    .catch(() => showFeedback("Erro ao carregar coleções."));
}

// Carregar cartas iniciais da API oficial
function loadRandomCards() {
  showFeedback("Carregando cartas iniciais...");
  fetch(`${API_URL_OFFICIAL}/cards?pageSize=6`)
    .then(res => res.json())
    .then(data => {
      showFeedback("");
      showCards(data.data, "official");
    })
    .catch(() => showFeedback("Erro ao carregar cartas."));
}

loadRandomCards();
loadSets();
