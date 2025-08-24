import React, { useState, useEffect, useRef } from 'react';
import { Gift, Heart, Star, Sparkles, Music, Camera, Cake, Moon as Balloon, PartyPopper, Crown, Zap, SettingsIcon as Confetti } from 'lucide-react';
import CrownPath from './components/CrownPath';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  icon: React.ReactNode;
  delay: number;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-6 py-4 bg-slate-800 text-white text-sm rounded-lg shadow-xl z-[9999] max-w-xs sm:max-w-md md:max-w-lg text-center leading-relaxed whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

const BirthdayApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [clickedBalloons, setClickedBalloons] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showCrownPath, setShowCrownPath] = useState(false);

  const steps = [
    'Welcome',
    'Surprise Reveal',
    'Birthday Game',
    'Memory Lane',
    'Final Celebration'
  ];

  const modernColors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const paths = [
    {
      id: 'queen',
      icon: <Crown className="w-12 h-12" />,
      title: "Queen's Path",
      tooltip: "Queen's Path - Rule your journey with power and strength.",
      color: "from-yellow-400 to-orange-500",
      hoverColor: "hover:from-yellow-500 hover:to-orange-600"
    },
    {
      id: 'love',
      icon: <Heart className="w-12 h-12" />,
      title: "Love Path",
      tooltip: "Love Path - Cherish memories, connections, emotions, and affection.",
      color: "from-pink-400 to-red-500",
      hoverColor: "hover:from-pink-500 hover:to-red-600"
    },
    {
      id: 'glam',
      icon: <Star className="w-12 h-12" />,
      title: "Glam Path",
      tooltip: "Glam Path - Shine with style, sparkle, and confidence.",
      color: "from-blue-400 to-purple-500",
      hoverColor: "hover:from-blue-500 hover:to-purple-600"
    }
  ];

  // Generate confetti
  const generateConfetti = () => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 40; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: modernColors[Math.floor(Math.random() * modernColors.length)],
        delay: Math.random() * 2
      });
    }
    setConfettiPieces(pieces);
    setShowConfetti(true);
    
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Generate floating elements
  const generateFloatingElements = () => {
    const icons = [
      <Heart className="w-4 h-4" />,
      <Star className="w-4 h-4" />,
      <Sparkles className="w-4 h-4" />,
      <Gift className="w-4 h-4" />
    ];
    
    const elements: FloatingElement[] = [];
    for (let i = 0; i < 8; i++) {
      elements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        icon: icons[Math.floor(Math.random() * icons.length)],
        delay: Math.random() * 3
      });
    }
    setFloatingElements(elements);
  };

  // Start balloon popping game
  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setClickedBalloons([]);
    setTimeout(() => {
      setGameActive(false);
    }, 15000);
  };

  const popBalloon = (id: number) => {
    if (!clickedBalloons.includes(id)) {
      setClickedBalloons([...clickedBalloons, id]);
      setGameScore(gameScore + 10);
      // Play pop sound effect
      playSound(800, 0.1);
    }
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

  const handlePathSelection = (pathId: string) => {
    setSelectedPath(pathId);
    playSound(600, 0.2);
    
    if (pathId === 'queen') {
      setTimeout(() => {
        setShowCrownPath(true);
      }, 500);
    } else {
      // For other paths, continue to next step
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  };

  useEffect(() => {
    generateFloatingElements();
  }, []);

  useEffect(() => {
    if (currentStep === 1 || currentStep === 4) {
      generateConfetti();
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCrownPathComplete = () => {
    setShowCrownPath(false);
    nextStep();
  };

  if (showCrownPath) {
    return <CrownPath onComplete={handleCrownPathComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FF6B9D 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #4ECDC4 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Subtle Floating Background Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="fixed text-slate-300 opacity-30 animate-float pointer-events-none"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`
          }}
        >
          {element.icon}
        </div>
      ))}

      {/* Modern Confetti */}
      {showConfetti && confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="fixed w-2 h-2 rounded-full animate-confetti-infinite pointer-events-none"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Progress Bar */}
        <div className="w-full bg-white/20 backdrop-blur-sm h-1">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-blue-500 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center animate-fadeIn">
                <div className="mb-12">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <Cake className="w-20 h-20 mx-auto text-pink-500 relative z-10" />
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 leading-tight">
                  Happy Birthday
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    Beautiful Soul
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                  Today we celebrate you and all the joy you bring to the world. 
                  Ready for something special?
                </p>
                <div className="flex justify-center space-x-6 mb-12">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-8 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: modernColors[i],
                        animationDelay: `${i * 0.1}s` 
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Begin the Journey
                </button>
              </div>
            )}

            {/* Step 1: Surprise Reveal */}
            {currentStep === 1 && (
              <div className="text-center animate-fadeIn">
                <div className="mb-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <PartyPopper className="w-24 h-24 mx-auto text-yellow-500 animate-bounce relative z-10" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8">
                  This is Your Day
                </h2>
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 mb-8 max-w-2xl mx-auto shadow-xl border border-white/20">
                  <p className="text-xl text-slate-700 mb-6 leading-relaxed">
                    Every year, you grow more amazing. Today isn't just about getting older—
                    it's about celebrating the incredible person you've become.
                  </p>
                  <p className="text-lg text-slate-600 mb-8">
                    We've prepared something interactive and fun, just for you. 
                    Let's make this birthday unforgettable!
                  </p>
                  
                  {/* Path Selection Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      Select Your Journey
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Pick one Only
                    </p>
                    
                    <div className="flex justify-center space-x-8 mb-4">
                      {paths.map((path, index) => (
                        <Tooltip key={path.id} text={path.tooltip}>
                          <button
                            onClick={() => handlePathSelection(path.id)}
                            className={`bg-gradient-to-r ${path.color} ${path.hoverColor} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <div className="relative z-10">
                              {path.icon}
                            </div>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                    
                    <p className="text-xs text-slate-500 font-light">
                      Each Path unlocks the hidden gates to an extraordinary realm, shaping the destiny of Saarah & Sulu’s Birthday Date like never before Choose one Wisely.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={prevStep}
                    className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Birthday Game */}
            {currentStep === 2 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
                  Birthday Balloon Pop
                </h2>
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 mb-8 max-w-3xl mx-auto shadow-xl border border-white/20">
                  <p className="text-lg text-slate-700 mb-8">
                    Pop as many balloons as you can in 15 seconds! Each balloon is a wish for your special day.
                  </p>
                  
                  <div className="mb-8">
                    <div className="text-3xl font-bold text-slate-800 mb-4">
                      Score: <span className="text-pink-500">{gameScore}</span>
                    </div>
                    {!gameActive && gameScore === 0 && (
                      <button
                        onClick={startGame}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all cursor-pointer shadow-lg"
                      >
                        Start Game
                      </button>
                    )}
                    {gameActive && (
                      <div className="text-lg text-slate-600">
                        Click the balloons quickly!
                      </div>
                    )}
                  </div>

                  {/* Game Balloons */}
                  <div className="relative h-64 mb-8">
                    {[...Array(12)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => popBalloon(i)}
                        disabled={!gameActive || clickedBalloons.includes(i)}
                        className={`absolute w-12 h-12 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${
                          clickedBalloons.includes(i) 
                            ? 'opacity-30 scale-50' 
                            : 'hover:scale-110 animate-bounce'
                        }`}
                        style={{
                          left: `${(i % 4) * 25 + 10}%`,
                          top: `${Math.floor(i / 4) * 33 + 10}%`,
                          backgroundColor: modernColors[i % modernColors.length],
                          animationDelay: `${i * 0.1}s`
                        }}
                      >
                        <Balloon className="w-6 h-6 mx-auto text-white" />
                      </button>
                    ))}
                  </div>

                  {gameScore > 0 && !gameActive && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
                      <div className="text-2xl text-slate-800 font-bold">
                        Fantastic! You scored {gameScore} points!
                      </div>
                      <p className="text-slate-600 mt-2">Each balloon was a birthday wish coming true!</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={prevStep}
                    className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 cursor-pointer shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Memory Lane */}
            {currentStep === 3 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
                  Celebrating You
                </h2>
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 mb-8 max-w-4xl mx-auto shadow-xl border border-white/20">
                  <p className="text-xl text-slate-700 mb-10 leading-relaxed">
                    Every birthday is a milestone of beautiful moments, growth, and the impact you've made.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {[
                      { icon: <Camera className="w-10 h-10" />, title: "Precious Moments", desc: "Every smile captured, every memory made", color: "from-pink-400 to-rose-400" },
                      { icon: <Heart className="w-10 h-10" />, title: "Love & Connection", desc: "The bonds that make life beautiful", color: "from-red-400 to-pink-400" },
                      { icon: <Star className="w-10 h-10" />, title: "Your Bright Light", desc: "The way you illuminate every room", color: "from-yellow-400 to-orange-400" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 border border-white/30 hover:scale-105 transform">
                        <div className={`bg-gradient-to-r ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-lg text-slate-700 italic font-medium">
                      "The best birthdays aren't just about the celebration—they're about recognizing 
                      the amazing person you are and the joy you bring to everyone around you."
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={prevStep}
                    className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 cursor-pointer shadow-lg"
                  >
                    Grand Finale
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Final Celebration */}
            {currentStep === 4 && (
              <div className="text-center animate-fadeIn">
                <div className="mb-12">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <Sparkles className="w-24 h-24 mx-auto text-purple-500 animate-spin-slow relative z-10" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8">
                  You Are
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x">
                    Absolutely Amazing
                  </span>
                </h2>
                
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 mb-8 max-w-3xl mx-auto shadow-xl border border-white/20">
                  <p className="text-2xl text-slate-700 mb-6 font-light leading-relaxed">
                    Thank you for being exactly who you are.
                  </p>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Your birthday isn't just a celebration of another year—it's a celebration of your kindness, 
                    your laughter, your dreams, and all the ways you make the world brighter just by being in it.
                  </p>
                  
                  <div className="flex justify-center space-x-4 mb-8">
                    {modernColors.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-3 h-12 rounded-full animate-bounce shadow-lg" 
                        style={{ 
                          backgroundColor: color,
                          animationDelay: `${i * 0.1}s` 
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl p-6 border border-yellow-100">
                    <p className="text-2xl font-semibold text-slate-800">
                      Make a wish and let it come true! ✨
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={prevStep}
                    className="bg-white/50 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-white/70 transition-all cursor-pointer border border-white/30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      generateConfetti();
                      playSound(600, 0.5);
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    Celebrate! 🎉
                  </button>
                </div>

                <div className="text-3xl space-x-2">
                  <span className="inline-block animate-bounce">🎈</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>🎂</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>🎉</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Step Indicator */}
        <div className="p-6">
          <div className="flex justify-center space-x-3 mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentStep 
                    ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500' 
                    : index < currentStep 
                      ? 'w-6 bg-green-400' 
                      : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-slate-600 text-sm font-medium">
            {steps[currentStep]} • {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayApp;