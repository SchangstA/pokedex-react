import React, { useState, useEffect } from 'react';
import Pokedex from '../images/pokedexImage.webp';

const PokedexMain = () => {
    const [pokemon, setPokemon] = useState([]);
    const [nameStr, setNameStr] = useState('');
    const [typesStr, setTypesStr] = useState('');
    const [weightStr, setWeightStr] = useState('');
    const [audio] = useState(new Audio());
    const [isVisible, setIsVisible] = useState(false); // New state for visibility

    const fetchPokemon = async () => {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data = await res.json();
            const pokemonDetails = await Promise.all(
                data.results.map(async (poke) => {
                    const pokeRes = await fetch(poke.url);
                    return await pokeRes.json();
                })
            );
            setPokemon(pokemonDetails);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    const handleClick = async (name, types, weight, id) => {
        setNameStr(name);
        setTypesStr(types);
        setWeightStr(weight / 10);
        setIsVisible(true); // Set visibility to true when a Pokémon is selected

        const cryUrl = `https://pokemoncries.com/cries/${id}.mp3`;
        audio.src = cryUrl;
        audio.volume = 0.3;
        await audio.play();
    };

    return (
        <div className='pokemon-grid'>
            <ul className='pokedex'>
                {pokemon.map((poke) => {
                    const types = poke.types.map(typeInfo => typeInfo.type.name).join(', ');
                    return (
                        <button key={poke.name} onClick={() => handleClick(poke.name, types, poke.weight, poke.id)} className='pokemon-card'>
                            <li>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', alignContent: 'center', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                        {poke.name.toUpperCase()}
                                    </div>
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} 
                                        alt={poke.name} />
                                </div>
                            </li>
                        </button>
                    );
                })}
            </ul>
            <div>
                <img id='pokedex-png' src={Pokedex} alt="Pokedex" />
                {isVisible && ( // Conditionally render the content based on isVisible
                    <div style={{ display: 'block', position: 'fixed', top: '17rem', right: '25rem', textAlign: 'center' }}>
                        <div>
                            <img 
                                style={{ width: '20rem', height: '20rem' }} 
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.find(p => p.name === nameStr)?.id}.png`} 
                                alt={`${nameStr} official artwork`} 
                            />
                        </div>
                        <div>
                            <p>Name: {nameStr.toUpperCase()}</p>
                            <p>Types: {typesStr.toUpperCase()}</p>
                            <p>Weight: {weightStr} KG</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokedexMain;
