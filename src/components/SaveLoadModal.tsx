import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, FolderOpen, Trash2, X, Clock, Calendar, Shield, Database, Plus } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SaveMetadata } from '../types';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ isOpen, onClose }) => {
  const { state, saveGame, loadGame, deleteSave, getSaveSlots } = useGame();
  const [slots, setSlots] = useState<SaveMetadata[]>([]);
  const [saveName, setSaveName] = useState('');
  const [mode, setMode] = useState<'save' | 'load'>('save');

  useEffect(() => {
    if (isOpen) {
      setSlots(getSaveSlots());
    }
  }, [isOpen, getSaveSlots]);

  const handleSave = () => {
    saveGame(saveName);
    setSaveName('');
    setSlots(getSaveSlots());
    onClose();
  };

  const handleLoad = (id: string) => {
    if (loadGame(id)) {
      onClose();
    } else {
      alert('Failed to load save. Data might be corrupted.');
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this save?')) {
      deleteSave(id);
      setSlots(getSaveSlots());
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
            <div className="flex items-center gap-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                style={{ backgroundColor: `${state.clubProfile?.primaryColor}10`, borderColor: `${state.clubProfile?.primaryColor}30` }}
              >
                {mode === 'save' ? <Save size={24} style={{ color: state.clubProfile?.primaryColor }} /> : <FolderOpen size={24} style={{ color: state.clubProfile?.primaryColor }} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {mode === 'save' ? 'Save Career' : 'Load Career'}
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  {mode === 'save' ? 'Secure your progress' : 'Continue your legacy'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button 
                  onClick={() => setMode('save')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'save' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Save
                </button>
                <button 
                  onClick={() => setMode('load')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'load' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Load
                </button>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {mode === 'save' && (
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Enter save name..."
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <Plus size={16} />
                    New Save
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {slots.length === 0 ? (
                <div className="text-center py-20 bg-zinc-950/30 border border-zinc-800/50 border-dashed rounded-[2rem]">
                  <Clock size={48} className="text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No save files found</p>
                </div>
              ) : (
                slots.map((slot) => (
                  <div 
                    key={slot.id}
                    onClick={() => mode === 'load' && handleLoad(slot.id)}
                    className={`group relative p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-[2rem] transition-all flex items-center justify-between ${mode === 'load' ? 'cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${slot.isAutosave ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
                        {slot.isAutosave ? <Clock size={24} className="text-emerald-500" /> : <Save size={24} className="text-zinc-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{slot.name}</h3>
                          {slot.isAutosave && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded">Autosave</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <Shield size={12} />
                            {slot.clubName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            Week {slot.week}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Database size={12} />
                            {slot.databaseYear}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Last Played</p>
                        <p className="text-xs font-bold text-zinc-600">{new Date(slot.timestamp).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, slot.id)}
                        className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-500 hover:border-red-500/50 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {mode === 'load' && (
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-zinc-800 bg-zinc-950/50 text-center">
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
              Saves are stored locally in your browser
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SaveLoadModal;
