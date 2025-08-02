import React from "react";
import "../App.css";

function Card({ pokemon, onClick, disabled, flipping }) {
    const handleClick = () => {
    if (!disabled) {
      onClick();
    }

  };

  return (
    <div key={pokemon.id} className={`card-container ${flipping ? 'flipping' : ''}`} onClick={handleClick}>
      <div className="card-image-container">
        <img src={pokemon.image} alt={pokemon.name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
      </div>
    </div>
  );
}

export default Card;
