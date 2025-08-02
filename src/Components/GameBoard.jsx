import React from "react";
import Card from "./Card.jsx";
import "../App.css";

function GameBoard({ pokemonData, onCardClick, gameOver, flipping }) {
  return (
    <div className="game-board">
      {pokemonData.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          onClick={() => onCardClick(pokemon.id)}
          disabled={gameOver}
          flipping={flipping}
        />
      ))}
    </div>
  );
}

export default GameBoard;
