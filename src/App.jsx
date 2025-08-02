import React, { useState, useEffect } from "react";
import Scoreboard from "./Components/ScoreBoard.jsx";
import GameBoard from "./Components/GameBoard.jsx";
import "./App.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const [flipping, setFlipping] = useState(false);


  // Fetch Pokemon data when component mounts
  useEffect(() => {
    fetchPokemonData();
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem("pokemonMemoryBestScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Save best score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemonMemoryBestScore", bestScore.toString());
  }, [bestScore]);

  const fetchPokemonData = async () => {
    setLoading(true);
    try {
      const pokemonPromises = [];
      // Get 12 random Pokemon
      const fetchedIds = [];
      while (fetchedIds.length < 12) {
        const randomId = Math.floor(Math.random() * 150) + 1; // First 150 Pokemon

        if(fetchedIds.includes(randomId)){
          continue;
        }
        fetchedIds.push(randomId);

        pokemonPromises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then(
            (response) => response.json()
          )
        );
      }

      const pokemonResults = await Promise.all(pokemonPromises);
      const formattedData = pokemonResults.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        image:
          pokemon.sprites.other["official-artwork"].front_default ||
          pokemon.sprites.front_default,
        types: pokemon.types.map((type) => type.type.name),
      }));

      setPokemonData(shuffleArray(formattedData));
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
    setLoading(false);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardClick = (pokemonId) => {
    if (gameOver) return;

    // Check if card was already clicked
    if (clickedCards.includes(pokemonId)) {
      // Game over
      setGameOver(true);
      if (currentScore > bestScore) {
        setBestScore(currentScore);
      }
    } else {
      // Add card to clicked cards and increase score
      const newClickedCards = [...clickedCards, pokemonId];
      setClickedCards(newClickedCards);
      const newScore = currentScore + 1;
      setCurrentScore(newScore);

      // Check if all cards have been clicked (perfect game)
      if (newClickedCards.length === pokemonData.length) {
        setGameOver(true);
        if (newScore > bestScore) {
          setBestScore(newScore);
        }
      } else {
        // Shuffle the cards
        setFlipping(true);
        setTimeout(() => {
          setPokemonData(shuffleArray(pokemonData));
          setFlipping(false);
        }, 600); 
      }
    }
  };

  const resetGame = () => {
    setClickedCards([]);
    setCurrentScore(0);
    setGameOver(false);
    setPokemonData(shuffleArray(pokemonData));
  };

  const startNewGame = () => {
    resetGame();
    fetchPokemonData();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="pokeball-loader"></div>
          <p>Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="game-title">Pokemon Memory Game</h1>
        <p className="game-description">
          Click on each Pokemon card only once! Try to get the highest score
          possible.
        </p>
      </header>

      <Scoreboard currentScore={currentScore} bestScore={bestScore} />

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Final Score: {' '}{currentScore}</p>
            {currentScore === pokemonData.length && (
              <p className="perfect-game">
                🎉 Perfect Game! You caught them all! 🎉
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={resetGame} className="btn btn-secondary">
                Try Again
              </button>
              <button onClick={startNewGame} className="btn btn-primary">
                New Pokemon
              </button>
            </div>
          </div>
        </div>
      )}

      <GameBoard
        pokemonData={pokemonData}
        onCardClick={handleCardClick}
        gameOver={gameOver}
        flipping={flipping}
      />

      <footer className="app-footer">
        <p></p>
      </footer>
    </div>
  );
}

export default App;
