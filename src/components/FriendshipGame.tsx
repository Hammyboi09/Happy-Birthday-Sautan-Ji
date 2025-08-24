import React, { useState, useEffect } from 'react';
import { Heart, Star, Crown, Sparkles, HelpCircle, Clock, Trophy, Brain, Target } from 'lucide-react';

interface FriendshipGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'input';
  options?: string[];
  correctAnswer?: number | number[] | string;
  hint: string;
}

const FriendshipGame: React.FC<FriendshipGameProps> = ({ onComplete, onBack }) => {
  const [showRules, setShowRules] = useState(true);
  const [rulesTimer, setRulesTimer] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(3);
  const [gameReady, setGameReady] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | string | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<number[]>([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showRetryScreen, setShowRetryScreen] = useState(false);
  const [retryTimer, setRetryTimer] = useState(4);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  const [points, setPoints] = useState(0);

  // All 20 questions with different types
  const allQuestions: Question[] = [
    {
      id: 1,
      question: "What makes a friendship truly royal and special?",
      type: 'single',
      options: [
        "Always agreeing with each other",
        "Being honest, supportive, and celebrating each other's growth",
        "Only spending time together when convenient",
        "Competing to see who's better"
      ],
      correctAnswer: 1,
      hint: "True friendship is built on honesty, support, and celebrating each other's journey!"
    },
    {
      id: 2,
      question: "How should a queen treat her friends during difficult times?",
      type: 'single',
      options: [
        "Avoid them until things get better",
        "Give advice only when asked",
        "Listen with compassion and offer support without judgment",
        "Tell them what they did wrong"
      ],
      correctAnswer: 2,
      hint: "A true queen-friend listens with her heart and supports without judgment."
    },
    {
      id: 3,
      question: "What are the most precious gifts you can give a friend? (Select all that apply)",
      type: 'multiple',
      options: [
        "Your time and attention",
        "Expensive presents",
        "Genuine care and understanding",
        "Social media likes",
        "Trust and loyalty"
      ],
      correctAnswer: [0, 2, 4],
      hint: "The most valuable gifts come from the heart, not the wallet."
    },
    {
      id: 4,
      question: "How do royal friends celebrate each other's successes?",
      type: 'single',
      options: [
        "Feel jealous secretly",
        "Compare their own achievements",
        "Genuinely celebrate and feel proud of their friend",
        "Try to one-up them"
      ],
      correctAnswer: 2,
      hint: "Royal friends lift each other up and celebrate successes as if they were their own!"
    },
    {
      id: 5,
      question: "Complete this sentence: 'The crown jewel of friendship is...'",
      type: 'input',
      correctAnswer: "trust",
      hint: "It's something that takes time to build but can be broken in an instant."
    },
    {
      id: 6,
      question: "What qualities make someone a true friend? (Select all that apply)",
      type: 'multiple',
      options: [
        "Reliability and consistency",
        "Being popular",
        "Empathy and understanding",
        "Having lots of money",
        "Being a good listener"
      ],
      correctAnswer: [0, 2, 4],
      hint: "True friendship qualities come from character, not circumstances."
    },
    {
      id: 7,
      question: "When friends disagree, what's the royal way to handle it?",
      type: 'single',
      options: [
        "Stop talking to them",
        "Talk it out with respect and understanding",
        "Get other friends to take sides",
        "Pretend nothing happened"
      ],
      correctAnswer: 1,
      hint: "Royal friends communicate openly and respectfully, even during disagreements."
    },
    {
      id: 8,
      question: "What does 'being there' for a friend really mean?",
      type: 'input',
      correctAnswer: "support",
      hint: "It's about offering emotional presence and help when they need it most."
    },
    {
      id: 9,
      question: "Which actions show you truly care about a friend? (Select all that apply)",
      type: 'multiple',
      options: [
        "Remembering important dates",
        "Only calling when you need something",
        "Checking in during tough times",
        "Being genuinely interested in their life",
        "Gossiping about them"
      ],
      correctAnswer: [0, 2, 3],
      hint: "Caring friends show interest and support consistently, not just when convenient."
    },
    {
      id: 10,
      question: "What's the best way to apologize to a friend?",
      type: 'single',
      options: [
        "Send a text message",
        "Have a sincere face-to-face conversation",
        "Buy them something expensive",
        "Wait for them to get over it"
      ],
      correctAnswer: 1,
      hint: "Sincere apologies require genuine conversation and taking responsibility."
    },
    {
      id: 11,
      question: "Fill in the blank: 'A true friend accepts you for _____ you are.'",
      type: 'input',
      correctAnswer: "who",
      hint: "True friends love and accept your authentic self."
    },
    {
      id: 12,
      question: "What are signs of a healthy friendship? (Select all that apply)",
      type: 'multiple',
      options: [
        "Mutual respect",
        "One person always giving",
        "Open communication",
        "Jealousy and competition",
        "Supporting each other's dreams"
      ],
      correctAnswer: [0, 2, 4],
      hint: "Healthy friendships are balanced and supportive, not one-sided or competitive."
    },
    {
      id: 13,
      question: "How should friends handle secrets?",
      type: 'single',
      options: [
        "Share them with everyone",
        "Keep them safe and private",
        "Use them when you're angry",
        "Forget about them immediately"
      ],
      correctAnswer: 1,
      hint: "Trust is the foundation of friendship - secrets should be kept safe."
    },
    {
      id: 14,
      question: "What's the most important thing in maintaining long-distance friendships?",
      type: 'input',
      correctAnswer: "communication",
      hint: "It's about staying connected despite the physical distance."
    },
    {
      id: 15,
      question: "Which behaviors can damage a friendship? (Select all that apply)",
      type: 'multiple',
      options: [
        "Being honest about feelings",
        "Breaking promises repeatedly",
        "Gossiping behind their back",
        "Supporting their decisions",
        "Being unreliable"
      ],
      correctAnswer: [1, 2, 4],
      hint: "Friendship-damaging behaviors involve breaking trust and being unreliable."
    },
    {
      id: 16,
      question: "What's the best way to make new friends?",
      type: 'single',
      options: [
        "Pretend to be someone you're not",
        "Be genuine and show interest in others",
        "Only talk about yourself",
        "Wait for others to approach you"
      ],
      correctAnswer: 1,
      hint: "Authenticity and genuine interest in others attracts real friendships."
    },
    {
      id: 17,
      question: "Complete this: 'Good friends help you become the _____ version of yourself.'",
      type: 'input',
      correctAnswer: "best",
      hint: "True friends inspire and encourage your growth and improvement."
    },
    {
      id: 18,
      question: "What should you do when a friend is going through a hard time? (Select all that apply)",
      type: 'multiple',
      options: [
        "Listen without trying to fix everything",
        "Avoid them until they feel better",
        "Offer practical help when appropriate",
        "Tell them to get over it",
        "Be patient and understanding"
      ],
      correctAnswer: [0, 2, 4],
      hint: "Supporting friends through difficulties requires patience, listening, and practical help."
    },
    {
      id: 19,
      question: "What's the difference between a friend and an acquaintance?",
      type: 'single',
      options: [
        "Friends are people you see every day",
        "Friends are deeper connections with mutual care and trust",
        "Acquaintances are more important",
        "There's no real difference"
      ],
      correctAnswer: 1,
      hint: "Friendship involves deeper emotional connection and mutual investment."
    },
    {
      id: 20,
      question: "The golden rule of friendship is to treat others how you want to be _____.",
      type: 'input',
      correctAnswer: "treated",
      hint: "It's about reciprocity and mutual respect in relationships."
    }
  ];

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
      selectRandomQuestions();
    }
  }, [showCountdown, countdownTimer]);

  // Question timer effect
  useEffect(() => {
    if (gameReady && !gameCompleted && !showResult && questionTimer > 0) {
      const timer = setTimeout(() => {
        setQuestionTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (questionTimer <= 0 && gameReady && !showResult) {
      handleTimeUp();
    }
  }, [gameReady, gameCompleted, showResult, questionTimer]);

  // Retry screen timer effect
  useEffect(() => {
    if (showRetryScreen && retryTimer > 0) {
      const timer = setTimeout(() => {
        setRetryTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showRetryScreen && retryTimer === 0) {
      setShowRetryScreen(false);
      resetGame();
    }
  }, [showRetryScreen, retryTimer]);

  const selectRandomQuestions = () => {
    const availableQuestions = allQuestions.filter(q => !answeredQuestions.has(q.id));
    
    if (availableQuestions.length < 5) {
      // If less than 5 questions available, reset answered questions
      setAnsweredQuestions(new Set());
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      setSelectedQuestions(shuffled.slice(0, 5));
    } else {
      const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
      setSelectedQuestions(shuffled.slice(0, 5));
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSelectedMultiple([]);
    setInputAnswer('');
    setCorrectAnswers(0);
    setQuestionsAnswered(0);
    setPoints(0);
    setShowResult(false);
    setQuestionTimer(15);
    setShowTimeUp(false);
    setAttempts(prev => prev + 1);
    setRetryTimer(4);
    setAllQuestionsCompleted(false);
    setCurrentQuestionAnswered(false);
    selectRandomQuestions();
  };

  const handleTimeUp = () => {
    // Mark current question as answered (incorrectly due to timeout)
    setCurrentQuestionAnswered(true);
    setQuestionsAnswered(prev => prev + 1);
    
    setShowTimeUp(true);
    setTimeout(() => {
      setShowTimeUp(false);
      
      // Check if all 5 questions are completed
      if (questionsAnswered + 1 >= 5) {
        setAllQuestionsCompleted(true);
        // Check win condition: 3 or more correct answers
        if (correctAnswers >= 3) {
          setGameCompleted(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
        } else {
          setShowRetryScreen(true);
        }
      } else {
        // Move to next question
        nextQuestion();
      }
    }, 2000);
  };

  const handleAnswerSubmit = () => {
    if (currentQuestionAnswered) return;
    
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === 'single') {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'multiple') {
      const correctAnswers = currentQuestion.correctAnswer as number[];
      isCorrect = selectedMultiple.length === correctAnswers.length && 
                 selectedMultiple.every(ans => correctAnswers.includes(ans));
    } else if (currentQuestion.type === 'input') {
      const correctAnswer = (currentQuestion.correctAnswer as string).toLowerCase();
      isCorrect = inputAnswer.toLowerCase().trim() === correctAnswer;
    }

    setCurrentQuestionAnswered(true);
    setQuestionsAnswered(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setPoints(prev => prev + 10);
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
      
      // Show confetti for 3 seconds
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        
        // Check if all 5 questions are completed
        if (questionsAnswered + 1 >= 5) {
          setAllQuestionsCompleted(true);
          // Check win condition: 3 or more correct answers OR 30+ points
          if (correctAnswers + 1 >= 3 || points + 10 >= 30) {
            setGameCompleted(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          } else {
            setShowRetryScreen(true);
          }
        } else {
          nextQuestion();
        }
      }, 3000);
    } else {
      // Wrong answer - continue to next question or end if all 5 completed
      setTimeout(() => {
        // Check if all 5 questions are completed
        if (questionsAnswered >= 5) {
          setAllQuestionsCompleted(true);
          // Check win condition: 3 or more correct answers OR 30+ points
          if (correctAnswers >= 3 || points >= 30) {
            setGameCompleted(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          } else {
            setShowRetryScreen(true);
          }
        } else {
          nextQuestion();
        }
      }, 1000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedMultiple([]);
      setInputAnswer('');
      setQuestionTimer(15);
      setShowResult(false);
      setCurrentQuestionAnswered(false);
    }
  };

  const handleMultipleSelect = (optionIndex: number) => {
    if (selectedMultiple.includes(optionIndex)) {
      setSelectedMultiple(selectedMultiple.filter(i => i !== optionIndex));
    } else {
      setSelectedMultiple([...selectedMultiple, optionIndex]);
    }
  };

  const generateConfetti = () => {
    return Array.from({ length: 30 }, (_, i) => (
      <div
        key={i}
        className="absolute w-3 h-3 rounded-full animate-confetti-infinite pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
          animationDelay: `${Math.random() * 2}s`
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
                <h3 className="text-lg font-semibold text-slate-800">Friendship Quiz</h3>
                <p className="text-sm text-slate-600">Game 3 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-semibold">1:15</span>
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
              <h3 className="text-2xl font-bold text-slate-800">Friendship Quiz Rules</h3>
            </div>
            <div className="text-xl font-semibold text-red-600">
              Starting in {rulesTimer} seconds...
            </div>
          </div>

          {/* Main Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Question Types */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-blue-800">Question Types</h4>
              </div>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Single Choice: Pick one correct answer</li>
                <li>• Multiple Choice: Select all correct options</li>
                <li>• Fill in the Blank: Type the correct word</li>
              </ul>
            </div>

            {/* Timer System */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="text-lg font-semibold text-red-800">Timer System</h4>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• 15 seconds per question</li>
                <li>• Time up = Failed attempt</li>
                <li>• Must restart with new questions</li>
              </ul>
            </div>

            {/* Scoring */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-800">Scoring System</h4>
              </div>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Each correct answer = 10 points</li>
                <li>• Need 3 correct answers OR 30+ points</li>
                <li>• All 5 questions must be attempted</li>
                <li>• Less than 3 correct AND under 30 points = Retry</li>
                <li>• New random questions each attempt</li>
              </ul>
            </div>

            {/* Hints */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="text-lg font-semibold text-purple-800">Hint System</h4>
              </div>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Hover over hint icon for help</li>
                <li>• Each question has a unique hint</li>
                <li>• Use hints to guide your thinking</li>
              </ul>
            </div>
          </div>

          {/* Game Flow */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🎯</span>
              <h4 className="text-xl font-bold text-slate-800">Game Flow</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Random Selection</h5>
                <p className="text-sm text-slate-600">5 questions chosen randomly</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Answer Questions</h5>
                <p className="text-sm text-slate-600">15 seconds per question</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Complete All 5</h5>
                <p className="text-sm text-slate-600">Answer all questions</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-yellow-600">4</span>
                </div>
                <h5 className="font-semibold text-slate-800 mb-1">Win Condition</h5>
                <p className="text-sm text-slate-600">3+ correct OR 30+ points</p>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">💡</span>
              <h4 className="text-lg font-bold text-slate-800">Pro Tips</h4>
            </div>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Read questions carefully - some require multiple selections</li>
              <li>• Use hints when you're unsure about an answer</li>
              <li>• For fill-in-the-blank, think of simple, common words</li>
              <li>• Each correct answer earns you 10 points</li>
              <li>• Take your time but watch the timer</li>
              <li>• Each retry gives you different questions to learn from</li>
            </ul>
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
          <p className="text-xl text-slate-600">Friendship quiz starting soon...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center relative overflow-hidden max-w-2xl w-full">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            Keep Learning, Royal Friend!
          </h3>
          <div className="text-2xl font-semibold text-slate-600 mb-4">
            Attempt #{attempts}
          </div>
          <div className="text-xl font-bold text-slate-800 mb-6">
            Score: {points} points ({correctAnswers}/5 questions correct)
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6 border border-blue-200">
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              You need to answer <strong>3 out of 5 questions correctly</strong> OR earn <strong>30+ points</strong> to continue your royal journey.
            </p>
            <p className="text-slate-600">
              You earned {points} points and answered {correctAnswers} out of {questionsAnswered} questions correctly. You'll get 5 new random questions to try again.
            </p>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              New questions loading in {retryTimer} seconds...
            </div>
            <p className="text-sm text-slate-500">
              Questions will be randomly selected from our friendship wisdom collection
            </p>
          </div>
          
          <div className="text-sm text-slate-500">
            💡 <strong>Pro Tip:</strong> Use the hints to guide your thinking about friendship values!
          </div>
        </div>
      </div>
    );
  }

  // Time up screen
  if (showTimeUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-red-500/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center text-white">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-4xl font-bold mb-4">Time's Up!</h3>
          <p className="text-xl">Let's try again with new questions...</p>
        </div>
      </div>
    );
  }

  // Game completed successfully
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center relative overflow-hidden max-w-2xl w-full">
          <div className="text-6xl mb-4">👑</div>
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            Friendship Mastery Achieved!
          </h3>
          <div className="text-2xl font-semibold text-green-600 mb-6">
            Success: {points} Points ({correctAnswers}/5 Questions Correct)!
          </div>
          <div className="text-lg text-slate-600 mb-4">
            Attempt #{attempts}
          </div>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6 border border-green-200">
            <p className="text-lg text-slate-700 leading-relaxed">
             Outstanding! You've earned {points} points by answering {correctAnswers} out of 5 questions correctly, showing true understanding of royal friendship values. Your heart knows the way to build lasting, meaningful connections.
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            Continuing to final challenge...
          </div>
        </div>
      </div>
    );
  }

  if (!gameReady || selectedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-2xl font-bold text-slate-800">Loading Questions...</h3>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {generateConfetti()}
        </div>
      )}

      {/* Game Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Friendship Quiz</h3>
                <p className="text-sm text-slate-600">Game 3 of 4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-semibold">{questionTimer}s</span>
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
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Royal Friendship Challenge</h2>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-slate-800 mb-4">
                Progress: <span className="text-pink-500">{points} Points ({correctAnswers}/5 Correct)</span>
              </div>
              <div className="text-lg text-slate-600 mb-4">
                Questions Answered: {questionsAnswered}/5
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-600">Question {currentQuestionIndex + 1} of 5</span>
                <span className="text-sm text-slate-600">Attempt #{attempts}</span>
              </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionsAnswered / 5) * 100}%` }}
              />
            </div>
          </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800 leading-relaxed flex-1">
                {currentQuestion.question}
              </h3>
              <div className="relative ml-4">
                <HelpCircle 
                  className="w-6 h-6 text-blue-500 cursor-help"
                  onMouseEnter={() => setShowHint(true)}
                  onMouseLeave={() => setShowHint(false)}
                />
                {showHint && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-800 text-white text-sm rounded-lg p-3 shadow-xl z-10">
                    {currentQuestion.hint}
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </div>
            </div>
            
            {currentQuestion.type === 'single' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all duration-300 cursor-pointer border-2
                      ${selectedAnswer === index
                        ? 'bg-blue-100 border-blue-400 text-blue-800'
                        : 'bg-white/50 hover:bg-white/70 border-white/30 hover:scale-102'
                      }
                    `}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-3">Select all correct answers:</p>
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMultipleSelect(index)}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all duration-300 cursor-pointer border-2
                      ${selectedMultiple.includes(index)
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-white/50 hover:bg-white/70 border-white/30 hover:scale-102'
                      }
                    `}
                  >
                    <span className="font-medium">
                      {selectedMultiple.includes(index) ? '✓' : '☐'}
                    </span> {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'input' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 rounded-xl border-2 border-white/30 bg-white/50 focus:bg-white focus:border-blue-400 outline-none transition-all duration-300 text-lg"
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleAnswerSubmit}
              disabled={
                currentQuestionAnswered ||
                (currentQuestion.type === 'single' && selectedAnswer === null) ||
                (currentQuestion.type === 'multiple' && selectedMultiple.length === 0) ||
                (currentQuestion.type === 'input' && inputAnswer.trim() === '')
              }
              className={`px-8 py-3 rounded-xl font-semibold transform transition-all duration-300 shadow-lg ${
                currentQuestionAnswered ||
                (currentQuestion.type === 'single' && selectedAnswer === null) ||
                (currentQuestion.type === 'multiple' && selectedMultiple.length === 0) ||
                (currentQuestion.type === 'input' && inputAnswer.trim() === '')
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 cursor-pointer'
              }`}
            >
              {currentQuestionAnswered ? 'Answer Submitted' : 'Submit Answer'}
            </button>
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

export default FriendshipGame;