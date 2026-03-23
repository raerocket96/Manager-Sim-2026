import React from 'react';
import { useGame } from '../context/GameContext';
import { MessageSquare, Repeat, Heart, Share, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SocialFeed: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden group hover:border-zinc-700 transition-all duration-500">
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <MessageSquare className="text-blue-500" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Social Feed</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Live Reactions</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Trending</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-zinc-950/50">
        <AnimatePresence mode="popLayout">
          {(state.socialFeed || []).length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                <MessageSquare className="text-zinc-700" size={32} />
              </div>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest italic">No new posts</p>
            </motion.div>
          ) : (
            (state.socialFeed || []).map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-2xl hover:bg-zinc-900/60 transition-all group/post hover:border-zinc-700 shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 font-black text-xl italic border border-zinc-700 group-hover/post:scale-110 transition-transform shadow-inner">
                    {post.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-black text-white text-sm uppercase tracking-tighter italic truncate group-hover/post:text-red-500 transition-colors">{post.name}</span>
                        {post.isVerified && <CheckCircle2 size={14} className="text-blue-400 shrink-0" />}
                        <span className="text-zinc-600 text-[10px] font-bold truncate ml-1">{post.handle}</span>
                      </div>
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Now</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-medium italic">
                      {post.text}
                    </p>
                    <div className="flex items-center justify-between text-zinc-600 border-t border-zinc-800/50 pt-3">
                      <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn">
                        <MessageSquare size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{Math.floor(post.likes / 10)}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors group/btn">
                        <Repeat size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{post.retweets}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-red-400 transition-colors group/btn">
                        <Heart size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{post.likes}</span>
                      </button>
                      <button className="hover:text-zinc-300 transition-colors">
                        <Share size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialFeed;
