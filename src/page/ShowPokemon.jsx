import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "../assets/ShowPokemon.css";
function ShowPokemon() {
  const [dataPokemon, setdataPokemon] = useState([]);
  const [countAll, setcountAll] = useState(0);

  useEffect(() => {
    call_api_pokemon_data_count();
  }, []);

  useEffect(() => {
    if (countAll > 0) {
      call_api_pokemon_data_all();
    }
  }, [countAll]);

  const call_api_pokemon_data_count = async () => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
      const count = res.data.count;
      setcountAll(count);
    } catch (error) {
      console.error("Error while fetching Pokemon data:", error);
    }
  };

  const call_api_pokemon_data_all = async () => {
    console.log(countAll);
    try{
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${countAll}`
    );
    const all_name_pokemon = res.data.results;
    const allPokemonWithAbilities = await Promise.all(
      all_name_pokemon.map(async (pokemon, index) => {
        const abilityResponse = await axios.get(pokemon.url);
        const abilities = abilityResponse.data.abilities.map(
          (ability) => ability.ability.name
        );
        const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`;
        return { ...pokemon, abilities, imageURL };
      })
    );
    console.log(allPokemonWithAbilities);
    setdataPokemon(allPokemonWithAbilities);
    } catch(error){
      console.error(`Error fetching abilities for ${pokemon.name}:`, error);
    }
  };

  return (
    <div>
      <h1>Pokemon List</h1>
      <div className="pokemon-grid">
        {dataPokemon.map((pokemon, index) => (
          <div key={index} className="pokemon-card">
            <div style={{ margin: "5px 0 5px 0", fontSize: "18px" }}>
              <b>{pokemon.name}</b>
            </div>
            <img
              style={{ width: "70px" }}
              src={pokemon.imageURL}
              alt={pokemon.name}
            />
            <div>
              <b>Abilities: </b>
            </div>
            <div style={{ margin: "0px 0px 5px 0px" }}>
              {pokemon.abilities.map((ability, index) => (
                <div key={index}>- {ability}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* <ul>
        {dataPokemon.map((pokemon, index) => (
          <li key={index}>
            {pokemon.name}
            <ul>
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default ShowPokemon;
