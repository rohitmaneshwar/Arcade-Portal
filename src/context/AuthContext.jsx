import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('rohit_trivia_users')) || {});
    const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem('rohit_trivia_lb')) || []);

    useEffect(() => {
        localStorage.setItem('rohit_trivia_users', JSON.stringify(users));
        let lbArray = [];
        for (let key in users) {
            lbArray.push({ name: users[key].name, lvl: users[key].currentLvl, quest: users[key].currentQuestIdx });
        }
        lbArray.sort((a, b) => (b.lvl * 10 + b.quest) - (a.lvl * 10 + a.quest));
        lbArray = lbArray.slice(0, 5);
        setLeaderboard(lbArray);
        localStorage.setItem('rohit_trivia_lb', JSON.stringify(lbArray));
    }, [users]);

    const playSound = (type) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            if (type === 'correct') {
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
                osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                osc.start(); osc.stop(audioCtx.currentTime + 0.2);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
                osc.start(); osc.stop(audioCtx.currentTime + 0.25);
            } else if (type === 'lvlup') {
                osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
                osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                osc.start(); osc.stop(audioCtx.currentTime + 0.3);
            }
        } catch (e) {}
    };

    const updateXP = (amount, direction) => {
        if (!currentUser) return;
        setUsers(prev => {
            const copy = { ...prev };
            const uKey = currentUser.name.toLowerCase();
            let xp = copy[uKey].currentXP || 0;
            
            if (direction === 'gain') xp = Math.min(100, xp + amount);
            else xp = Math.max(0, xp - amount);
            
            if (xp >= 100) xp = 0;
            copy[uKey].currentXP = xp;
            
            setCurrentUser(prevUser => ({ ...prevUser, currentXP: xp }));
            return copy;
        });
    };

    const updateQuestProgress = (newLvl, newQuestIdx) => {
        if (!currentUser) return;
        setUsers(prev => {
            const copy = { ...prev };
            const uKey = currentUser.name.toLowerCase();
            copy[uKey].currentLvl = newLvl;
            copy[uKey].currentQuestIdx = newQuestIdx;
            
            setCurrentUser(prevUser => ({ ...prevUser, currentLvl: newLvl, currentQuestIdx: newQuestIdx }));
            return copy;
        });
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, users, setUsers, leaderboard, updateXP, updateQuestProgress, logout, playSound }}>
            {children}
        </AuthContext.Provider>
    );
}