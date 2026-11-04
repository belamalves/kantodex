console.log ("Iniciado KantoDex");


const form = document.querySelector(".pokemon-search");
const campoPokemon = document.querySelector("#pokemon");
const campoPeso = document.querySelector("#pokemon-peso");
const campoAltura = document.querySelector("#pokemon-altura");
const campoTipo = document.querySelector("#pokemon-tipo");
const campoFraquezas = document.querySelector("#pokemon-fraquezas");
const campoEficaz = document.querySelector("#pokemon-eficaz");
const campoDescricao = document.querySelector("#pokemon-descricao");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nomePokemon = campoPokemon.value.trim();
    console.log(nomePokemon);

    try {
        
        const resposta = await fetch (`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar o Pokémon");
        }
        const dados = await resposta.json();

        const dadosDescricao = await fetch (`https://pokeapi.co/api/v2/pokemon-species/${dados.id}`);

        if (!dadosDescricao.ok) {
            throw new Error("Erro ao buscar a descrição do Pokémon");
        }
        const dadosEspecie = await dadosDescricao.json();

        const descricao = dadosEspecie.flavor_text_entries.find(
            texto => texto.language.name)

        console.log(descricao);

        const dadosTipo = await fetch (`https://pokeapi.co/api/v2/type/${dados.types[0].type.name}`);

        if (!dadosTipo.ok) {
            throw new Error("Erro ao buscar o tipo do Pokémon");
        }
        const dadosTipoJson = await dadosTipo.json();



        const fraquezas =dadosTipoJson.damage_relations.double_damage_from;
        console.log(fraquezas);
        const nomesFraquezas = fraquezas 
            .map(tipo => tipo.name)
            .join(", ");  
        console.log(dadosTipoJson.damage_relations);
        console.log(nomesFraquezas);

        const eficaz =dadosTipoJson.damage_relations.double_damage_to;
        console.log(eficaz);
        const nomesEficaz = eficaz
            .map(tipo => tipo.name)
            .join(", ");
        console.log(nomesEficaz);
        campoPeso.textContent = dados.weight/10 + " kg";
        campoAltura.textContent = dados.height/10 + " m";
        campoTipo.textContent = dados.types
            .map(tipo => tipo.type.name)
            .join(", ");
        campoFraquezas.textContent = nomesFraquezas;
        campoEficaz.textContent = nomesEficaz;
        campoDescricao.textContent = descricao
            ? descricao.flavor_text.replace()
            : "descrição em pt-br não disponível.";
    } catch (error) {
        console.error(error.message);
    }

})

const camposPokemon = document.querySelectorAll(".team-slot-fields input");
const imagensPokemon = document.querySelectorAll(".team-pokemon-image");

camposPokemon.forEach((campo, indice) => {

    campo.addEventListener("change", async function() {

        const nomePokemon = campo.value.trim().toLowerCase();

        try {
            const resposta = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao buscar o Pokémon");
            }

            const dados = await resposta.json();

            imagensPokemon[indice].src = dados.sprites.front_default;
            imagensPokemon[indice].alt = `Imagem do ${dados.name}`;

        } catch (error) {
            console.error(error.message);
        }
    });
});