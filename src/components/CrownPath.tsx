import React, { useState, useEffect } from 'react';
import { Crown, CheckCircle, Lock } from 'lucide-react';
import CrownWelcome from './CrownWelcome';
import SnakeLadderGame from './SnakeLadderGame';
import MemoryMatchGame from './MemoryMatchGame';
import FriendshipGame from './FriendshipGame';
import BonusBalloonGame from './BonusBalloonGame';

interface CrownPathProps {
  onComplete: () => void;
}

interface GameProgress {
  snakeLadder: boolean;
  memoryMatch: boolean;
  friendship: boolean;
  balloonPop: boolean;
}

const CrownPath: React.FC<CrownPathProps> = ({ onComplete }) => {
  const [currentView, setCurrentView] = useState<'welcome' | 'snakeLadder' | 'memoryMatch' | 'friendship' | 'balloonPop' | 'celebration'>('welcome');
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    snakeLadder: false,
    memoryMatch: false,
    friendship: false,
    balloonPop: false
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const games = [
    {
      id: 'snakeLadder' as const,
      title: 'Snake & Ladder',
      description: 'Royal ascension challenge',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'memoryMatch' as const,
      title: 'Memory Match',
      description: 'Test your royal wisdom',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'friendship' as const,
      title: 'Friendship Quest',
      description: 'Royal bonds challenge',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-pink-400 to-red-500'
    },
    {
      id: 'balloonPop' as const,
      title: 'Bonus Balloon Pop',
      description: 'Royal celebration finale',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-green-400 to-teal-500'
    }
  ];

  const handleGameComplete = (gameId: keyof GameProgress) => {
    setGameProgress(prev => ({
      ...prev,
      [gameId]: true
    }));
    
    const updatedProgress = { ...gameProgress, [gameId]: true };
    
    // Move to next game or celebration
    if (gameId === 'snakeLadder') {
      setCurrentView('memoryMatch');
    } else if (gameId === 'memoryMatch') {
      setCurrentView('friendship');
    } else if (gameId === 'friendship') {
      setCurrentView('balloonPop');
    } else if (gameId === 'balloonPop') {
      setTimeout(() => {
        setCurrentView('celebration');
        generateConfetti();
      }, 1000);
    }
  };

  const generateConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const completedGamesCount = Object.values(gameProgress).filter(Boolean).length;
  const allGamesCompleted = completedGamesCount === 4;

  // Render current view
  if (currentView === 'welcome') {
    return <CrownWelcome onStartJourney={() => setCurrentView('snakeLadder')} />;
  }

  if (currentView === 'snakeLadder') {
    return (
      <SnakeLadderGame
        onComplete={() => handleGameComplete('snakeLadder')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  if (currentView === 'memoryMatch') {
    return (
      <MemoryMatchGame
        onComplete={() => handleGameComplete('memoryMatch')}
        onBack={() => setCurrentView('snakeLadder')}
      />
    );
  }

  if (currentView === 'friendship') {
    return (
      <FriendshipGame
        onComplete={() => handleGameComplete('friendship')}
        onBack={() => setCurrentView('memoryMatch')}
      />
    );
  }

  if (currentView === 'balloonPop') {
    return (
      <BonusBalloonGame
        onComplete={() => handleGameComplete('balloonPop')}
        onBack={() => setCurrentView('friendship')}
      />
    );
  }

  if (currentView === 'celebration') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti-infinite"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="text-center animate-fadeIn max-w-4xl">
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <Crown className="w-32 h-32 mx-auto text-yellow-500 animate-bounce relative z-10" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-gradient-x">
                Crown Achieved!
              </span>
            </h1>
            
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 mb-8 shadow-xl border border-white/20">
              <p className="text-2xl text-slate-700 mb-6 font-light leading-relaxed">
                Congratulations, Your Royal Majesty!
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                You have successfully completed all four royal challenges and proven yourself worthy of the crown. 
                Your wisdom, courage, friendship, and celebration spirit have shone brightly throughout this journey.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {games.map((game) => (
                  <div key={game.id} className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-slate-800 text-sm">{game.title}</h3>
                    <p className="text-xs text-green-600">Completed ✓</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border border-yellow-200 mb-8">
                <p className="text-xl font-semibold text-slate-800 mb-2">
                  🎉 Royal Achievement Unlocked! 🎉
                </p>
                <p className="text-slate-700">
                  You are now officially crowned as the Birthday Queen/King of this special day!
                </p>
              </div>
              
              <button
                onClick={() => {
                  generateConfetti();
                  setTimeout(onComplete, 1000);
                }}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Return to Birthday Celebration
              </button>
            </div>
            
            <div className="flex justify-center space-x-4 text-4xl">
              <span className="animate-bounce">👑</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎂</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎈</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CrownPath;