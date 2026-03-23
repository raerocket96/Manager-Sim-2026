import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-20 ${type === 'danger' ? 'bg-red-600' : 'bg-yellow-600'}`}></div>
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${type === 'danger' ? 'bg-red-600/10 border-red-500/20 text-red-600' : 'bg-yellow-600/10 border-yellow-500/20 text-yellow-600'}`}>
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">{title}</h3>
            <p className="text-zinc-500 font-bold italic mb-8 leading-relaxed">{message}</p>

            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                className="flex-1 py-4 bg-zinc-950 hover:bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-xl border border-zinc-800 transition-all"
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-4 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg ${type === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
