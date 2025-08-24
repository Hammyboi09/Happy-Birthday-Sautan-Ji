import React, { useState, useRef } from 'react';
import { Crown, User, Camera, Square, Brain, HelpCircle, Clock } from 'lucide-react';

interface CrownWelcomeProps {
  onStartJourney: () => void;
}

const CrownWelcome: React.FC<CrownWelcomeProps> = ({ onStartJourney }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgb(254, 259, 237)' }}
    >
      <div className="max-w-3xl w-full">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
          {/* Crown Icon */}
          <div className="text-center mb-10">
            <Crown className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Welcome to Crown Path!
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto">
              Prove your royal skills through 4 challenging games. Each victory brings you closer to the ultimate crown!
            </p>
          </div>

          {/* Player Character Section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Your Player Character</h2>
            <div className="flex items-center justify-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-3 border-blue-300 overflow-hidden">
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <button 
                onClick={triggerFileInput}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer flex items-center space-x-2 text-lg"
              >
                <Camera className="w-5 h-5" />
                <span>Add Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* Snake & Ladders */}
            <div className="bg-yellow-100 border-3 border-yellow-300 rounded-2xl p-8 text-center">
              <Square className="w-12 h-12 mx-auto text-slate-700 mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2 text-lg">Snake & Ladders</h3>
              <p className="text-slate-600 text-base">7:00</p>
            </div>

            {/* Memory Match */}
            <div className="bg-slate-100 border-3 border-slate-300 rounded-2xl p-8 text-center">
              <Brain className="w-12 h-12 mx-auto text-slate-700 mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2 text-lg">Memory Match</h3>
              <p className="text-slate-600 text-base">0:45</p>
            </div>

            {/* Friendship Quiz */}
            <div className="bg-slate-100 border-3 border-slate-300 rounded-2xl p-8 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-700 mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2 text-lg">Friendship Quiz</h3>
              <p className="text-slate-600 text-base">1:15</p>
            </div>

            {/* Bonus Balloon Pop */}
            <div className="bg-slate-100 border-3 border-slate-300 rounded-2xl p-8 text-center">
              <Clock className="w-12 h-12 mx-auto text-slate-700 mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2 text-lg">Bonus Balloon Pop</h3>
              <p className="text-slate-600 text-base">0:30</p>
            </div>
          </div>

          {/* Total Points */}
          <div className="text-center mb-10">
            <p className="text-2xl font-semibold text-slate-800">Total Points: 0</p>
          </div>

          {/* Begin Button */}
          <div className="text-center">
            <button
              onClick={onStartJourney}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-16 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Begin Crown Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrownWelcome;