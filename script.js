const API_URL = "https://api.pokemontcg.io/v2";
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=";

const cardsContainer = document.getElementById("cards");
const setList = document.getElementById("setList");
const feedback = document.getElementById("feedback");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Evento de busca
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

// Função para mostrar cartas + todos os GIFs
function showCards(cards) {
  cardsContainer.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");

    // Info básica
    div.innerHTML = `
      <h3>${card.name}</h3>
      <p><b>Raridade:</b> ${card.rarity || "Desconhecida"}</p>
      <p><b>Tipo:</b> ${card.types ? card.types.join(", ") : "N/A"}</p>
      <div class="card-images">
        <img src="${card.images.small}" alt="${card.name}">
      </div>
      <div class="card-gifs">
        <p>GIFs:</p>
      </div>
    `;
    cardsContainer.appendChild(div);

    const gifContainer = div.querySelector(".card-gifs");

    // Buscar todos os GIFs do Pokémon
    fetch(`${GIPHY_URL}${encodeURIComponent(card.name + " pokemon")}`)
      .then(res => res.json())
      .then(gifData => {
        if (gifData.data.length === 0) {
          gifContainer.innerHTML += `<p>Nenhum GIF encontrado.</p>`;
          return;
        }
        gifData.data.forEach(gif => {
          const img = document.createElement("img");
          img.src = gif.images.fixed_height.url;
          img.alt = card.name;
          gifContainer.appendChild(img);
        });
      })
      .catch(() => {
        gifContainer.innerHTML += `<p>Erro ao carregar GIFs.</p>`;
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
