import React, { useState, useEffect, useRef } from 'react';
import { Crown, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ArrowUp, ArrowDown, Trophy, Clock, User, Camera, Upload } from 'lucide-react';

interface SnakeLadderGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const SnakeLadderGame: React.FC<SnakeLadderGameProps> = ({ onComplete, onBack }) => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [computerPosition, setComputerPosition] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'computer'>('player');
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameMessage, setGameMessage] = useState('Your turn! Roll the dice');
  const [sixCount, setSixCount] = useState(0);
  const [computerSixCount, setComputerSixCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [rulesTimer, setRulesTimer] = useState(10);
  const [showWinConfetti, setShowWinConfetti] = useState(false);
  const [winTimer, setWinTimer] = useState(5);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showTurnPopup, setShowTurnPopup] = useState(false);
  const [turnPopupText, setTurnPopupText] = useState('');
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(3);
  const [gameReady, setGameReady] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(420); // 7 minutes
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Snakes and Ladders positions
  const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  };

  const ladders = {
    4: 14,
    9: 21,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
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
      showTurnIndicator('YOUR TURN!!');
    }
  }, [showCountdown, countdownTimer]);

  // Game timer effect
  useEffect(() => {
    if (gameReady && !gameEnded && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining <= 0 && !gameEnded) {
      setGameEnded(true);
      if (playerPosition > computerPosition) {
        setGameMessage('🎉 Time up! You were ahead - You Win!');
        setTimeout(() => {
          setShowWinConfetti(true);
          setTimeout(() => {
            setShowWinConfetti(false);
            setShowWinScreen(true);
          }, 5000);
        }, 1000);
      } else if (playerPosition === computerPosition) {
        setGameMessage('⏰ Time up! It\'s a tie - Good effort!');
        setTimeout(() => onComplete(), 3000);
      } else {
        setGameMessage('⏰ Time up! Computer was ahead - Try again!');
        setTimeout(() => onComplete(), 3000);
      }
    }
  }, [gameReady, gameEnded, timeRemaining, playerPosition, computerPosition]);

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

  // Show turn indicator popup
  const showTurnIndicator = (text: string) => {
    setTurnPopupText(text);
    setShowTurnPopup(true);
    setTimeout(() => {
      setShowTurnPopup(false);
    }, 2000);
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-8 h-8" />;
  };

  const rollDice = () => {
    if (
      currentPlayer !== 'player' ||
      isRolling ||
      gameEnded ||
      showRules ||
      showCountdown ||
      !gameReady ||
      showTurnPopup
    )
      return;

    setIsRolling(true);
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        movePlayer(finalValue);
      }
    }, 100);
  };

  const movePlayer = (steps: number) => {
    const newPosition = Math.min(playerPosition + steps, 100);
    setPlayerPosition(newPosition);

    if (steps === 6) {
      setSixCount((prev) => prev + 1);
      if (sixCount + 1 >= 3) {
        setPlayerPosition(1);
        setGameMessage('Three 6s! Back to start!');
        setSixCount(0);
        setTimeout(() => {
          setCurrentPlayer('computer');
          showTurnIndicator("COMPUTER'S TURN!!");
          computerTurn();
        }, 800);
        return;
      } else {
        setGameMessage(`You got a 6! Roll again (${sixCount + 1}/3)`);
        return;
      }
    } else {
      setSixCount(0);
    }

    // Check for snakes or ladders
    let finalPosition = newPosition;
    if (snakes[newPosition as keyof typeof snakes]) {
      finalPosition = snakes[newPosition as keyof typeof snakes];
      setPlayerPosition(finalPosition);
      setGameMessage('Oops! Snake bite!');
    } else if (ladders[newPosition as keyof typeof ladders]) {
      finalPosition = ladders[newPosition as keyof typeof ladders];
      setPlayerPosition(finalPosition);
      setGameMessage('Great! Climbed a ladder!');
    }

    if (finalPosition >= 100) {
      setGameEnded(true);
      setGameMessage('🎉 You Won! Amazing!');
      setShowWinConfetti(true);
      setTimeout(() => {
        setShowWinConfetti(false);
        setShowWinScreen(true);
      }, 5000);
      return;
    }

    setTimeout(() => {
      setCurrentPlayer('computer');
      showTurnIndicator("COMPUTER'S TURN!!");
      computerTurn();
    }, 1200);
  };

  const computerTurn = () => {
    setTimeout(() => {
      const computerRoll = Math.floor(Math.random() * 6) + 1;
      let newComputerPosition = Math.min(computerPosition + computerRoll, 100);

      // Computer has only 25-30% chance to land on green tiles (ladders)
      if (ladders[newComputerPosition as keyof typeof ladders]) {
        if (Math.random() > 0.275) {
          const alternatives = [];
          for (let offset = -2; offset <= 2; offset++) {
            if (offset === 0) continue;
            const altPos = newComputerPosition + offset;
            if (
              altPos > computerPosition &&
              altPos <= 100 &&
              !ladders[altPos as keyof typeof ladders]
            ) {
              alternatives.push(altPos);
            }
          }
          if (alternatives.length > 0) {
            newComputerPosition =
              alternatives[Math.floor(Math.random() * alternatives.length)];
          }
        }
      }

      // Handle computer's 6 logic
      if (computerRoll === 6) {
        setComputerSixCount((prev) => prev + 1);
        if (computerSixCount + 1 >= 3) {
          setComputerPosition(1);
          setComputerSixCount(0);
          setTimeout(() => {
            setCurrentPlayer('player');
            setGameMessage('Computer got 3 sixes! Your turn!');
            showTurnIndicator('YOUR TURN!!');
          }, 800);
          return;
        } else {
          setTimeout(() => {
            computerTurn();
          }, 800);
          return;
        }
      } else {
        setComputerSixCount(0);
      }

      // Handle snakes and ladders for computer
      let finalPosition = newComputerPosition;
      if (snakes[newComputerPosition as keyof typeof snakes]) {
        finalPosition = snakes[newComputerPosition as keyof typeof snakes];
        setComputerPosition(finalPosition);
      } else if (ladders[newComputerPosition as keyof typeof ladders]) {
        finalPosition = ladders[newComputerPosition as keyof typeof ladders];
        setComputerPosition(finalPosition);
      } else {
        setComputerPosition(newComputerPosition);
      }

      if (finalPosition >= 100) {
        setGameEnded(true);
        setGameMessage('Computer won! Try again!');
        setTimeout(() => onComplete(), 2000);
        return;
      }

      setCurrentPlayer('player');
      setGameMessage('Your turn! Roll the dice');
      showTurnIndicator('YOUR TURN!!');
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPlayerImage(e.target?.result as string);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate confetti for win
  const generateWinConfetti = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-3 h-3 rounded-full animate-confetti-infinite pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: [
            '#FF6B9D',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
          ][Math.floor(Math.random() * 6)],
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ));
  };

  // Rules popup
  if (showRules) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Snake & Ladders</h3>
                <p className="text-sm text-slate-600">Game 1 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-semibold">6:55</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600 font-semibold">0</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="text-2xl">🎲</span>
              <h3 className="text-2xl font-bold text-slate-800">Snake & Ladders Rules</h3>
            </div>
            <div className="text-xl font-semibold text-red-600">
              Starting in {rulesTimer} seconds...
            </div>
          </div>

          {/* Main Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Ladders */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <ArrowUp className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-800">Ladders (Green)</h4>
              </div>
              <p className="text-green-700 text-sm">
                Land on a green box to climb up! Ladders help you reach the top faster.
              </p>
            </div>

            {/* Snakes */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <ArrowDown className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="text-lg font-semibold text-red-800">Snakes (Red)</h4>
              </div>
              <p className="text-red-700 text-sm">
                Avoid red boxes! Snakes will slide you down the board.
              </p>
            </div>

            {/* Rolling 6 */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Dice6 className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-blue-800">Rolling 6</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Roll a 6 to get another turn! But 3 sixes in a row sends you back to start.
              </p>
            </div>

            {/* Winning */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Crown className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="text-lg font-semibold text-purple-800">Winning</h4>
              </div>
              <p className="text-purple-700 text-sm">
                First to reach box 100 wins! You must land exactly on 100.
              </p>
            </div>
          </div>

          {/* Points System */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
              <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
              <h4 className="text-xl font-bold text-yellow-800">Points System</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Winning Scenarios */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🏆</span>
                  <h5 className="font-semibold text-slate-800">Winning Scenarios</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Reach 100 first: 100 points</li>
                  <li>• Time up & you're ahead: 75 points</li>
                  <li>• Time up & it's a tie: 50 points</li>
                </ul>
              </div>

              {/* Losing Scenarios */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💔</span>
                  <h5 className="font-semibold text-slate-800">Losing Scenarios</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Computer reaches 100: 0 points</li>
                  <li>• Time up & you're behind: 0 points</li>
                </ul>
              </div>

              {/* Time Limit */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">⏰</span>
                  <h5 className="font-semibold text-slate-800">Time Limit</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Game duration: 7 minutes</li>
                  <li>• Timer counts down in real-time</li>
                  <li>• Game ends when timer reaches 0</li>
                  <li>• Points awarded based on final positions</li>
                </ul>
              </div>

              {/* Strategy Tips */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🎮</span>
                  <h5 className="font-semibold text-slate-800">Strategy Tips</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Play quickly but carefully</li>
                  <li>• Use 6s wisely for bonus turns</li>
                  <li>• Avoid consecutive 6s (max 2 safe)</li>
                  <li>• Watch the timer and your position</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center">
                <span className="text-lg mr-2">💡</span>
                <p className="text-sm text-slate-700 font-medium">
                  <strong>Pro Tip:</strong> Even if you don't win, you can still earn points by staying ahead when time runs out!
                </p>
              </div>
            </div>
          </div>

          {/* Dice Roll Rules */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🎲</span>
              <h4 className="text-xl font-bold text-yellow-800">Dice Roll Rules</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Turn System */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🔄</span>
                  <h5 className="font-semibold text-slate-800">Turn System</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Players take turns rolling the dice</li>
                  <li>• Move forward by the number shown</li>
                  <li>• Turn passes to opponent after move</li>
                  <li>• Button becomes inactive during opponent's turn</li>
                </ul>
              </div>

              {/* Special Rule: Rolling 6 */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">❄️</span>
                  <h5 className="font-semibold text-slate-800">Special Rule: Rolling 6</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Roll a 6 = Get another turn immediately</li>
                  <li>• Button stays active for bonus roll</li>
                  <li>• Can roll multiple 6s in a row</li>
                  <li>• 3 consecutive 6s = Back to start + turn ends!</li>
                </ul>
              </div>

              {/* Button States */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🔘</span>
                  <h5 className="font-semibold text-slate-800">Button States</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span> Active: Your turn to roll</li>
                  <li>• <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span> Inactive: Computer's turn</li>
                  <li>• <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span> Rolling: Dice animation in progress</li>
                  <li>• <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span> Bonus: You rolled a 6, roll again!</li>
                </ul>
              </div>

              {/* Game Flow */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🎯</span>
                  <h5 className="font-semibold text-slate-800">Game Flow</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1 ml-6">
                  <li>• Roll dice → Move piece → Check snakes/ladders</li>
                  <li>• If not 6: Turn ends, wait for computer</li>
                  <li>• If 6: Keep rolling (max 3 times)</li>
                  <li>• If 3 sixes: Back to start, turn passes to computer</li>
                  <li>• First to 100 wins the game!</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-lg mr-2">💡</span>
                <p className="text-sm text-slate-700 font-medium">
                  <strong>Pro Tip:</strong> The dice button will automatically become inactive when it's not your turn, preventing multiple rolls and ensuring fair gameplay!
                </p>
              </div>
            </div>
          </div>

          {/* Player Image Section - Simplified */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 text-center">
              Your Player Character
            </h4>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full border-3 border-blue-400 flex items-center justify-center bg-blue-50 overflow-hidden">
                {playerImage ? (
                  <img
                    src={playerImage}
                    alt="Player"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer flex items-center space-x-2 text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>{playerImage ? 'Change Photo' : 'Add Photo'}</span>
              </button>
            </div>

            {showImageUpload && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-blue-200">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-700 px-3 py-2 rounded-lg font-medium hover:bg-slate-50 transition-all cursor-pointer shadow border flex items-center space-x-2 mx-auto text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Optional: Add your photo to personalize your character
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (showCountdown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-4 animate-pulse">
            {countdownTimer}
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-4">Get Ready!</h3>
          <p className="text-xl text-slate-600">Game starting soon...</p>
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

  // Win screen with confetti
  if (showWinScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center relative overflow-hidden">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            CONGRATULATIONS!
          </h3>
          <p className="text-2xl text-green-600 font-bold mb-4">
            You Won the Snake & Ladders!
          </p>
          <div className="text-6xl mb-4">
            {playerImage ? (
              <img
                src={playerImage}
                alt="Player"
                className="w-16 h-16 rounded-full mx-auto border-4 border-yellow-400"
              />
            ) : (
              '👑'
            )}
          </div>
          <p className="text-lg text-slate-600 mb-6">
            You've earned 100 points!
          </p>
          <div className="text-2xl font-bold text-blue-600">
            Continuing in {winTimer} seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      {/* Game Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Snake & Ladders
                </h3>
                <p className="text-slate-600">Game 1 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto text-red-500 mb-1" />
                <div className="text-lg font-bold text-red-600">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
                <div className="text-lg font-bold text-yellow-600">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Turn Popup Overlay */}
      {showTurnPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-400 animate-pulse">
            <div
              className={`text-5xl font-black text-center ${
                turnPopupText.includes('YOUR')
                  ? 'text-blue-600'
                  : 'text-red-600'
              }`}
            >
              {turnPopupText}
            </div>
          </div>
        </div>
      )}

      {/* Confetti overlay for win */}
      {showWinConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {generateWinConfetti()}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Snake & Ladders
            </h3>
            <p className="text-slate-600">{gameMessage}</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  {playerImage ? (
                    <img
                      src={playerImage}
                      alt="Player"
                      className="w-8 h-8 rounded-full border-2 border-blue-400"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                  <div className="text-lg font-semibold text-blue-600">
                    You: {playerPosition}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🤖</span>
                  <div className="text-lg font-semibold text-red-600">
                    Computer: {computerPosition}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-10 gap-1 mb-6 bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-2xl">
            {Array.from({ length: 100 }, (_, i) => {
              const position = 100 - i;
              const isPlayerHere = playerPosition === position;
              const isComputerHere = computerPosition === position;
              const snakeDestination = snakes[position as keyof typeof snakes];
              const ladderDestination = ladders[position as keyof typeof ladders];
              const isStartTile = position === 1;
              const isEndTile = position === 100;

              return (
                <div
                  key={position}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-xs font-semibold rounded-lg border-2 relative
                    ${snakeDestination ? 'bg-red-200 border-red-400' : ''}
                    ${ladderDestination ? 'bg-green-200 border-green-400' : ''}
                    ${isStartTile ? 'bg-blue-200 border-blue-400' : ''}
                    ${
                      isEndTile
                        ? 'bg-gradient-to-br from-purple-200 to-purple-300 border-purple-400'
                        : ''
                    }
                    ${
                      !snakeDestination &&
                      !ladderDestination &&
                      !isStartTile &&
                      !isEndTile
                        ? 'bg-amber-50 border-amber-200'
                        : ''
                    }
                    ${isPlayerHere ? 'ring-4 ring-blue-400' : ''}
                    ${isComputerHere ? 'ring-4 ring-red-400' : ''}
                  `}
                >
                  <div
                    className={`text-xs font-semibold ${
                      isEndTile
                        ? 'text-purple-800'
                        : isStartTile
                        ? 'text-blue-800'
                        : snakeDestination
                        ? 'text-red-800'
                        : ladderDestination
                        ? 'text-green-800'
                        : 'text-amber-800'
                    }`}
                  >
                    {position}
                  </div>

                  {/* Snake/Ladder destination */}
                  {snakeDestination && (
                    <div className="text-red-600 text-xs flex items-center">
                      <ArrowDown className="w-2 h-2 mr-1" />
                      {snakeDestination}
                    </div>
                  )}
                  {ladderDestination && (
                    <div className="text-green-600 text-xs flex items-center">
                      <ArrowUp className="w-2 h-2 mr-1" />
                      {ladderDestination}
                    </div>
                  )}

                  {/* Player indicators */}
                  <div className="flex space-x-1 mt-1">
                    {isPlayerHere && (
                      <div className="text-blue-600 font-bold text-xs">
                        {playerImage ? (
                          <img
                            src={playerImage}
                            alt="Player"
                            className="w-3 h-3 rounded-full"
                          />
                        ) : (
                          '👤'
                        )}
                      </div>
                    )}
                    {isComputerHere && (
                      <div className="text-red-600 font-bold text-xs">🤖</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dice Section */}
          <div className="text-center">
            <div className="mb-4">
              <div
                className={`inline-block p-4 bg-white rounded-2xl shadow-lg border-4 border-slate-200 ${
                  isRolling ? 'animate-bounce' : ''
                }`}
              >
                {getDiceIcon(diceValue)}
              </div>
            </div>
            <button
              onClick={rollDice}
              disabled={
                currentPlayer !== 'player' ||
                isRolling ||
                gameEnded ||
                showRules ||
                showCountdown ||
                !gameReady ||
                showTurnPopup
              }
              className={`px-8 py-3 rounded-xl font-semibold transform transition-all duration-300 shadow-lg ${
                currentPlayer !== 'player' ||
                isRolling ||
                gameEnded ||
                showRules ||
                showCountdown ||
                !gameReady ||
                showTurnPopup
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 cursor-pointer'
              }`}
            >
              {isRolling
                ? 'Rolling...'
                : currentPlayer !== 'player'
                ? "Computer's Turn"
                : 'Roll Dice'}
            </button>

            {/* Turn Indicator */}
            <div className="mt-3">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  currentPlayer === 'player'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {currentPlayer === 'player' ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Your Turn
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    Computer's Turn
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
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

export default SnakeLadderGame;