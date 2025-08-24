import React, { useState, useEffect } from 'react';
import { Crown, Clock, Trophy, Brain, HelpCircle, CheckCircle, User, Camera, Upload } from 'lucide-react';

interface MemoryMatchGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [memoryTime, setMemoryTime] = useState(10);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [showRules, setShowRules] = useState(true);
  const [rulesTimer, setRulesTimer] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(3);
  const [gameReady, setGameReady] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [winTimer, setWinTimer] = useState(7);
  const [memoryPhaseActive, setMemoryPhaseActive] = useState(false);
  const [showRetryScreen, setShowRetryScreen] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [retryTimer, setRetryTimer] = useState(4);

  // Using emojis as placeholders - can be easily replaced with PNG images later
  const images = ['⭐', '🎂', '🎁', '🌈', '💖', '🎉', '🦄', '🎈'];

  const initializeGame = () => {
    // Initialize cards
    const gameCards = [];
    for (let i = 0; i < 8; i++) {
      gameCards.push(
        { id: i * 2, image: images[i], isFlipped: true, isMatched: false },
        { id: i * 2 + 1, image: images[i], isFlipped: true, isMatched: false }
      );
    }

    // Enhanced shuffle algorithm - becomes harder with more attempts
    const shuffled = enhancedShuffle(gameCards, attempts);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setPoints(0);
    setGameStarted(false);
    setGameCompleted(false);
    setMemoryTime(6);
    setTimeRemaining(45);
    setShowWinScreen(false);
    setWinTimer(7);
    setMemoryPhaseActive(true);
    setShowRetryScreen(false);
  };

  // Enhanced shuffle algorithm that increases difficulty with attempts
  const enhancedShuffle = (cards: Card[], attemptNumber: number) => {
    let shuffled = [...cards];
    
    // Base shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Additional complexity based on attempt number
    const extraShuffles = Math.min(attemptNumber - 1, 5); // Max 5 extra shuffles
    
    for (let round = 0; round < extraShuffles; round++) {
      // Perform more sophisticated shuffling patterns
      
      // Pattern 1: Reverse segments
      const segmentSize = 4 + (round * 2);
      for (let i = 0; i < shuffled.length; i += segmentSize) {
        const segment = shuffled.slice(i, i + segmentSize);
        segment.reverse();
        shuffled.splice(i, segmentSize, ...segment);
      }
      
      // Pattern 2: Swap pairs at different intervals
      const interval = 2 + round;
      for (let i = 0; i < shuffled.length - interval; i += interval * 2) {
        if (i + interval < shuffled.length) {
          [shuffled[i], shuffled[i + interval]] = [shuffled[i + interval], shuffled[i]];
        }
      }
      
      // Pattern 3: Rotate sections
      if (round >= 2) {
        const rotateSize = 6;
        for (let i = 0; i < shuffled.length; i += rotateSize) {
          const section = shuffled.slice(i, i + rotateSize);
          if (section.length >= 3) {
            const rotated = [...section.slice(1), section[0]];
            shuffled.splice(i, rotateSize, ...rotated);
          }
        }
      }
      
      // Pattern 4: Advanced random swaps with weighted positions
      if (round >= 3) {
        const swapCount = 8 + (round * 2);
        for (let swap = 0; swap < swapCount; swap++) {
          // Bias towards swapping cards that are further apart
          const i = Math.floor(Math.random() * shuffled.length);
          const minDistance = Math.floor(shuffled.length / 4);
          let j;
          do {
            j = Math.floor(Math.random() * shuffled.length);
          } while (Math.abs(i - j) < minDistance && swap < swapCount - 2);
          
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
    }
    
    return shuffled;
  };
  const resetGame = () => {
    setAttempts(prev => prev + 1);
    setRetryTimer(4);
    initializeGame();
  };

  // Rules timer effect
  useEffect(() => {
    if (showRules && rulesTimer > 0) {
      const timer = setTimeout(() => {
        setRulesTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showRules && rulesTimer === 0) {
      setShowRules(false);
      setShowCountdown(true);
    }
  }, [showRules, rulesTimer]);

  // Countdown timer effect
  useEffect(() => {
    if (showCountdown && countdownTimer > 0) {
      const timer = setTimeout(() => {
        setCountdownTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdownTimer === 0) {
      setShowCountdown(false);
      setGameReady(true);
    }
  }, [showCountdown, countdownTimer]);

  // Initialize game when ready
  useEffect(() => {
    if (gameReady && !gameStarted && !gameCompleted) {
      initializeGame();
    }
  }, [gameReady]);
  // Memory phase timer
  useEffect(() => {
    if (memoryPhaseActive && memoryTime > 0) {
      const timer = setTimeout(() => {
        setMemoryTime((prev) => {
          if (prev <= 1) {
            setMemoryPhaseActive(false);
            setCards((cards) =>
              cards.map((card) => ({ ...card, isFlipped: false }))
            );
            setGameStarted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [memoryPhaseActive, memoryTime]);

  // Game timer
  useEffect(() => {
    if (gameStarted && !gameCompleted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining <= 0 && gameStarted && !gameCompleted) {
      setGameCompleted(true);
      setTimeout(() => {
        setShowWinScreen(true);
      }, 1000);
    }
  }, [gameStarted, gameCompleted, timeRemaining]);

  // Win screen timer effect
  useEffect(() => {
    if (showWinScreen && winTimer > 0) {
      const timer = setTimeout(() => {
        setWinTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showWinScreen && winTimer === 0) {
      onComplete();
    }
  }, [showWinScreen, winTimer]);

  // Retry screen timer effect
  useEffect(() => {
    if (showRetryScreen && retryTimer > 0) {
      const timer = setTimeout(() => {
        setRetryTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showRetryScreen && retryTimer === 0) {
      setShowRetryScreen(false);
      initializeGame();
    }
  }, [showRetryScreen, retryTimer]);

  const flipCard = (cardId: number) => {
    if (!gameStarted || flippedCards.length >= 2 || gameCompleted) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.image === secondCard?.image) {
        // Match found
        setTimeout(() => {
          setCards((cards) =>
            cards.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c
            )
          );
          setMatches((prev) => prev + 1);
          setPoints((prev) => prev + 5);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((cards) =>
            cards.map((c) =>
              c.id === first || c.id === second ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === 8 && !gameCompleted) {
      setGameCompleted(true);
      // Check if player won or needs retry
      const canContinue = points >= 20 || matches >= 4;
      if (canContinue) {
        setTimeout(() => {
          setShowWinScreen(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setShowRetryScreen(true);
        }, 1000);
      }
    }
  }, [matches, gameCompleted]);

  // Also check when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && gameStarted && !gameCompleted) {
      setGameCompleted(true);
      const canContinue = points >= 20 || matches >= 4;
      if (canContinue) {
        setTimeout(() => {
          setShowWinScreen(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setShowRetryScreen(true);
        }, 1000);
      }
    }
  }, [timeRemaining, gameStarted, gameCompleted, points, matches]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Rules popup
  if (showRules) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgb(254, 250, 234)' }}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Memory Match</h3>
                <p className="text-sm text-slate-600">Game 2 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-semibold">0:55</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600 font-semibold">0</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="text-2xl">🧠</span>
              <h3 className="text-2xl font-bold text-slate-800">Memory Match Rules</h3>
            </div>
            <div className="text-xl font-semibold text-red-600">
              Starting in {rulesTimer} seconds...
            </div>
          </div>

          {/* Main Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Memory Phase */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-blue-800">Memory Phase (6s)</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Study all cards carefully! You have 6 seconds to memorize their positions before they flip over.
              </p>
            </div>

            {/* Game Phase */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-800">Game Phase (45s)</h4>
              </div>
              <p className="text-green-700 text-sm">
                Click cards to flip them and find matching pairs. You have 45 seconds to complete the challenge.
              </p>
            </div>

            {/* Scoring */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Trophy className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="text-lg font-semibold text-purple-800">Scoring System</h4>
              </div>
              <p className="text-purple-700 text-sm">
                Each matching pair = 5 points. Find 4+ matches to advance to the next challenge!
              </p>
            </div>

            {/* Winning */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="text-lg font-semibold text-yellow-800">Victory Condition</h4>
              </div>
              <p className="text-yellow-700 text-sm">
                Score 20+ points or find 4+ matches to prove your royal memory skills and continue your journey!
              </p>
            </div>
          </div>

          {/* Game Flow */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🎯</span>
              <h4 className="text-xl font-bold text-slate-800">Game Flow</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Memory Phase</h5>
                <p className="text-sm text-slate-600">Study all cards for 6 seconds</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Game Phase</h5>
                <p className="text-sm text-slate-600">Find matching pairs in 45 seconds</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Victory</h5>
                <p className="text-sm text-slate-600">Score 20+ points to advance</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Countdown screen
  if (showCountdown) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'rgb(254, 250, 234)' }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-4 animate-pulse">
            {countdownTimer}
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-4">Get Ready!</h3>
          <p className="text-xl text-slate-600">Memory challenge starting soon...</p>
          <div className="flex justify-center space-x-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-8 rounded-full animate-bounce"
                style={{
                  backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1'][i],
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Retry screen for failed attempts
  if (showRetryScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'rgb(254, 250, 234)' }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center relative overflow-hidden max-w-2xl w-full">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            Keep Trying, Royal Memory Master!
          </h3>
          <div className="text-2xl font-semibold text-slate-600 mb-4">
            Attempt #{attempts}
          </div>
          <div className="text-xl font-bold text-slate-800 mb-6">
            Score: {points} points | Matches: {matches}/8
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6 border border-blue-200">
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              You need <strong>20+ points</strong> or <strong>4+ matches</strong> to continue your royal journey.
            </p>
            <p className="text-slate-600">
              Don't worry - every attempt makes you stronger! The cards will be shuffled differently to challenge your memory skills.
            </p>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              Continuing in {retryTimer} seconds...
            </div>
            <p className="text-sm text-slate-500">
              Cards will be reshuffled with increased difficulty
            </p>
          </div>
          
          <div className="text-sm text-slate-500">
            💡 <strong>Pro Tip:</strong> Each attempt increases the shuffle complexity. Focus on patterns and positions!
          </div>
        </div>
      </div>
    );
  }

  // Win screen
  if (showWinScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'rgb(254, 250, 234)' }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center relative overflow-hidden max-w-2xl w-full">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            Memory Challenge Complete!
          </h3>
          <div className="text-4xl font-bold text-slate-800 mb-6">
            Final Score: {points} points
          </div>
          <div className="text-2xl font-semibold text-purple-600 mb-6">
            Matches Found: {matches}/8
          </div>
          <div className="text-lg text-slate-600 mb-4">
            Attempt #{attempts}
          </div>
          <p className="text-lg text-slate-600 mb-6">
            {points >= 20 || matches >= 5 
              ? "Outstanding memory skills! You've earned your place in the next challenge!"
              : "Good effort! Your memory skills are developing well!"
            }
          </p>
          <div className="text-2xl font-bold text-blue-600">
            Continuing in {winTimer} seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: 'rgb(254, 250, 234)' }}
    >
      {/* Game Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Memory Match</h3>
                <p className="text-sm text-slate-600">Game 2 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-semibold">
                  {memoryPhaseActive ? `${memoryTime}s` : gameStarted ? formatTime(timeRemaining) : '0:45'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600 font-semibold">{points}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Memory Match</h2>
            <p className="text-slate-600 mb-4">
              {memoryPhaseActive ? `Memorize the cards! ${memoryTime}s remaining` : gameStarted ? 'Find all matching pairs!' : 'Get ready to start!'}
            </p>
            <div className="text-sm text-slate-500 mb-2">
              Attempt #{attempts} • Need 20+ points OR 4+ matches to advance
            </div>
            <div className="text-lg">
              <span className="text-purple-600 font-semibold">Points: {points}</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-purple-600 font-semibold">Matches: {matches}/8</span>
            </div>
          </div>

          {/* Game Board - 4x4 Grid */}
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => flipCard(card.id)}
                className={`
                  aspect-square rounded-2xl cursor-pointer transform transition-all duration-300 border-2 flex items-center justify-center text-3xl font-bold relative overflow-hidden
                  ${card.isFlipped || card.isMatched
                    ? 'bg-white border-purple-200 shadow-lg'
                    : 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-300 hover:scale-105'
                  }
                  ${card.isMatched ? 'ring-4 ring-green-400 ring-opacity-50' : ''}
                  ${memoryPhaseActive || !gameStarted ? 'cursor-default' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="text-4xl">{card.image}</span>
                ) : (
                  <span className="text-slate-800 text-2xl font-bold">?</span>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            {memoryPhaseActive ? (
              <p className="text-sm text-slate-600">
                Study the cards carefully! You'll need to remember their positions.
              </p>
            ) : !gameStarted ? (
              <p className="text-sm text-slate-600">
                Game will start soon...
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                Click cards to flip them and find matching pairs. Get 4+ matches or 20+ points to continue!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto mt-6 text-center">
        <button
          onClick={onBack}
          className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default MemoryMatchGame;