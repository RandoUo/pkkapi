const API_URL = "https://api.pokemontcg.io/v2";
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=1&q="; // Public Beta
const cardsContainer = document.getElementById("cards");
const setList = document.getElementById("setList");
const feedback = document.getElementById("feedback");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Evento de busca por nome
searchBtn.addEventListener("click", () => {
  const name = searchInput.value.trim();
  if (!name) {
    showFeedback("Digite o nome de um Pokémon para buscar.");
    return;
  }
  showFeedback("🔍 Buscando cartas...");
  fetch(`${API_URL}/cards?q=name:${name}`)
    .then(res => res.json())
    .then(data => {
      if (data.data.length === 0) {
        showFeedback("Nenhuma carta encontrada. Tente outro nome!");
        cardsContainer.innerHTML = "";
      } else {
        showFeedback(`Foram encontradas ${data.data.length} cartas.`);
        showCards(data.data);
      }
    })
    .catch(() => showFeedback("Erro ao buscar dados. Tente novamente mais tarde."));
});

// Carrega coleções
function loadSets() {
  fetch(`${API_URL}/sets`)
    .then(res => res.json())
    .then(data => {
      setList.innerHTML = "";
      data.data.slice(0, 8).forEach(set => {
        const li = document.createElement("li");
        li.textContent = `${set.name}`;
        setList.appendChild(li);
      });
    })
    .catch(() => showFeedback("Erro ao carregar coleções."));
}

// Cartas iniciais
function loadRandomCards() {
  showFeedback("Carregando cartas iniciais...");
  fetch(`${API_URL}/cards?pageSize=6`)
    .then(res => res.json())
    .then(data => {
      showFeedback("");
      showCards(data.data);
    })
    .catch(() => showFeedback("Erro ao carregar cartas."));
}

// Função para mostrar cartas + GIF
function showCards(cards) {
  cardsContainer.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");

    // Busca GIF da carta pelo nome do Pokémon
    fetch(`${GIPHY_URL}${encodeURIComponent(card.name)}`)
      .then(res => res.json())
      .then(gifData => {
        const gifUrl = gifData.data[0]?.images?.downsized_medium?.url || card.images.small;

        div.innerHTML = `
          <img src="${gifUrl}" alt="${card.name}">
          <h3>${card.name}</h3>
          <p><b>Raridade:</b> ${card.rarity || "Desconhecida"}</p>
          <p><b>Tipo:</b> ${card.types ? card.types.join(", ") : "N/A"}</p>
        `;
        cardsContainer.appendChild(div);
      })
      .catch(() => {
        // Caso o GIF não carregue, usa a imagem da carta
        div.innerHTML = `
          <img src="${card.images.small}" alt="${card.name}">
          <h3>${card.name}</h3>
          <p><b>Raridade:</b> ${card.rarity || "Desconhecida"}</p>
          <p><b>Tipo:</b> ${card.types ? card.types.join(", ") : "N/A"}</p>
        `;
        cardsContainer.appendChild(div);
      });
  });
}

// Feedback
function showFeedback(msg) {
  feedback.textContent = msg;
}

// Inicialização
loadRandomCards();
loadSets();
