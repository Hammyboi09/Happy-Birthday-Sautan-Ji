import React, { useState, useEffect } from 'react';
import { Crown, Zap, Star, Heart } from 'lucide-react';

interface BonusBalloonGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  points: number;
  type: 'normal' | 'bonus' | 'special';
}

const BonusBalloonGame: React.FC<BonusBalloonGameProps> = ({ onComplete, onBack }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastPopTime, setLastPopTime] = useState(0);

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#98FB98'];

  const generateBalloon = (): Balloon => {
    const rand = Math.random();
    let type: 'normal' | 'bonus' | 'special' = 'normal';
    let points = 10;
    let size = 40;
    
    if (rand < 0.1) {
      type = 'special';
      points = 50;
      size = 60;
    } else if (rand < 0.3) {
      type = 'bonus';
      points = 25;
      size = 50;
    }

    return {
      id: Math.random(),
      x: Math.random() * 90,
      y: 110,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1.5,
      size,
      points,
      type
    };
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setGameCompleted(false);
    setBalloons([]);
  };

  const popBalloon = (balloonId: number) => {
    const currentTime = Date.now();
    const balloon = balloons.find(b => b.id === balloonId);
    
    if (!balloon) return;

    // Calculate combo bonus
    let finalPoints = balloon.points;
    if (currentTime - lastPopTime < 1000) {
      setCombo(combo + 1);
      finalPoints += combo * 5;
    } else {
      setCombo(0);
    }

    setScore(score + finalPoints);
    setLastPopTime(currentTime);
    
    // Remove popped balloon
    setBalloons(balloons.filter(b => b.id !== balloonId));
    
    // Play pop sound effect
    playSound(800 + (combo * 100), 0.1);
  };

  const playSound = (frequency: number, duration: number) => {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }
  };

  // Game loop
  useEffect(() => {
    if (!gameActive) return;

    const gameInterval = setInterval(() => {
      // Move balloons up
      setBalloons(prevBalloons => 
        prevBalloons
          .map(balloon => ({
            ...balloon,
            y: balloon.y - balloon.speed
          }))
          .filter(balloon => balloon.y > -10)
      );

      // Add new balloons
      if (Math.random() < 0.3) {
        setBalloons(prevBalloons => [...prevBalloons, generateBalloon()]);
      }

      // Update timer
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setGameActive(false);
          setGameCompleted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [gameActive]);

  const getBalloonIcon = (type: string) => {
    switch (type) {
      case 'special':
        return <Crown className="w-6 h-6 text-white" />;
      case 'bonus':
        return <Star className="w-5 h-5 text-white" />;
      default:
        return <Heart className="w-4 h-4 text-white" />;
    }
  };

  const getScoreRating = () => {
    if (score >= 500) return { rating: "Royal Master!", color: "text-yellow-600", crown: true };
    if (score >= 300) return { rating: "Balloon Champion!", color: "text-purple-600", crown: false };
    if (score >= 200) return { rating: "Great Popper!", color: "text-blue-600", crown: false };
    if (score >= 100) return { rating: "Good Job!", color: "text-green-600", crown: false };
    return { rating: "Keep Practicing!", color: "text-slate-600", crown: false };
  };

  if (gameCompleted) {
    const rating = getScoreRating();
    const canContinue = score >= 200;

    return (
      <div className="text-center animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
          Royal Balloon Challenge
        </h2>
        
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 mb-8 max-w-3xl mx-auto shadow-xl border border-white/20">
          <div className="mb-6">
            {rating.crown ? (
              <Crown className="w-20 h-20 mx-auto text-yellow-500 animate-bounce mb-4" />
            ) : (
              <Zap className="w-20 h-20 mx-auto text-blue-500 animate-pulse mb-4" />
            )}
          </div>
          
          <h3 className={`text-3xl font-bold mb-4 ${rating.color}`}>
            {rating.rating}
          </h3>
          
          <div className="text-4xl font-bold text-slate-800 mb-6">
            Final Score: {score}
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6 border border-blue-200">
            <p className="text-lg text-slate-700 leading-relaxed">
              {canContinue 
                ? "Outstanding performance! You've shown royal reflexes and earned your place in the celebration!"
                : "Good effort! Every balloon popped was a moment of joy. Try again to improve your royal skills!"
              }
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            {canContinue ? (
              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg cursor-pointer"
              >
                Complete Royal Journey
              </button>
            ) : (
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onBack}
            className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
        Royal Balloon Challenge
      </h2>
      
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 mb-8 max-w-4xl mx-auto shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <p className="text-2xl font-bold text-slate-800">Score: {score}</p>
            {combo > 0 && (
              <p className="text-lg text-purple-600 font-semibold">
                Combo x{combo}! 🔥
              </p>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">Time: {timeLeft}s</p>
          </div>
          
          <div className="text-right">
            {!gameActive && !gameCompleted && (
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg cursor-pointer"
              >
                Start Challenge
              </button>
            )}
          </div>
        </div>
        
        {/* Game Area */}
        <div className="relative h-96 bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl overflow-hidden border-4 border-blue-300">
          {balloons.map((balloon) => (
            <button
              key={balloon.id}
              onClick={() => popBalloon(balloon.id)}
              className="absolute rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 cursor-pointer flex items-center justify-center"
              style={{
                left: `${balloon.x}%`,
                bottom: `${balloon.y}%`,
                width: `${balloon.size}px`,
                height: `${balloon.size}px`,
                backgroundColor: balloon.color,
                border: balloon.type === 'special' ? '3px solid gold' : balloon.type === 'bonus' ? '2px solid silver' : 'none'
              }}
            >
              {getBalloonIcon(balloon.type)}
            </button>
          ))}
          
          {!gameActive && !gameCompleted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-slate-700 mb-4">
                  Pop balloons to score points!
                </p>
                <p className="text-sm text-slate-600">
                  💝 Normal (10pts) • ⭐ Bonus (25pts) • 👑 Special (50pts)
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Pop balloons quickly for combo bonuses!
                </p>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-slate-600 mt-4">
          Score 200+ points to complete the royal challenge!
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
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

export default BonusBalloonGame;