const pokedex = document.querySelector("#pokedex");
const searchBar = document.querySelector("#searchBar");
let pokeList = [];

searchBar.addEventListener("keyup", (event) => {
	const typedString = event.target.value.toLowerCase();
	const filteredPokemon = pokeList.filter((pokemon) => {
		return pokemon.name.includes(typedString);
	});
	displayPokemon(filteredPokemon);
});

const fetchPokemons = async () => {
	const url = "https://pokeapi.co/api/v2/pokemon/?limit=1010";
	const reponse = await fetch(url);
	const data = await reponse.json();
	pokeList = data.results.map((pokeman, index) => ({
		name: pokeman.name,
		id: index + 1,
		url: pokeman.url,
		image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
	}));
	displayPokemon(pokeList);
};

const displayPokemon = (pokemon, from, to) => {
	from = from || 0;
	to = to || 200;
	const htmlString = pokemon
		.slice(from, to)
		.map(
			(pokeman) =>
				`<div class ="card" onclick="selectPokemon(${pokeman.id})">
					<span class="card-id">#${pokeman.id}</span>
					<img class="card-image" src="${pokeman.image}"/>
					<h2 class = "card-title">${pokeman.name.toUpperCase()}</h2>
				</div>`
		)
		.join("");

	pokedex.innerHTML = htmlString;
};

function main() {
	fetchPokemons();
}
main();

const selectPokemon = async (id) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const response = await fetch(url);
	const data = await response.json();
	displayPopup(data);
};

const displayPopup = (pokeman) => {
	const stats = pokeman.stats.map((stat) => ({
		name: stat.stat.name,
		value: stat.base_stat,
	}));
	const statistics = Object.fromEntries(stats.map(({ name, value }) => [name, value]));

	const image = pokeman.sprites.front_default;
	const htmlString = `
	<div id="popupContainer">
        <div class="card innerPopup">
            <img class="card-image" src="${image}"/>
            <h2 class="card-title">${pokeman.name}</h2>
			<div class="statsContainer">
				<div class="statsContainer__barContainer">
					<span>Hp</span>
					<div class="statsContainer__barContainer__bar">
						<div class="statsContainer__barContainer__bar-inside hp" style="width:${(100 * statistics.hp) / 200}%">${statistics.hp}</div>
					</div>
				</div>
				<div class="statsContainer__barContainer">
					<span>Attack</span>
					<div class="statsContainer__barContainer__bar">
						<div class="statsContainer__barContainer__bar-inside attack" style="width:${(100 * statistics.attack) / 200}%">${statistics.attack}</div>
					</div>
				</div>
				<div class="statsContainer__barContainer">
					<span>Defense</span>
					<div class="statsContainer__barContainer__bar">
						<div class="statsContainer__barContainer__bar-inside defense" style="width:${(100 * statistics.defense) / 200}%">${statistics.defense}</div>
					</div>
				</div>
				<div class="statsContainer__barContainer">
					<span>Speed</span>
					<div class="statsContainer__barContainer__bar">
						<div class="statsContainer__barContainer__bar-inside speed" style="width:${(100 * statistics.speed) / 200}%">${statistics.speed}</div>
					</div>
				</div>
			</div>
        </div>
    </div>
		
	`;
	pokedex.innerHTML += htmlString;

	pokedex.querySelector("#popupContainer").addEventListener("click", closePopup);
	pokedex.querySelector("#popupContainer > div").addEventListener("click", (event) => {
		event.stopPropagation();
	});
};

const closePopup = (event) => {
	event.target.remove();
};
