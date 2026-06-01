import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ParticleBg from './components/ParticleBg';
import LoginOverlay from './components/LoginOverlay';
import TriviaGame from './Games/Trivia/TriviaGame';
import SlidingPuzzle from './Games/Puzzle/SlidingPuzzle';
import SudokuGame from './Games/Sudoku/SudokuGame';
import JigsawGame from './Games/Jigsaw/JigsawGame';

// 🔥 FIXED ASSET PATH: Agar image src/assets/my_photo.jpg me hai toh relative variable import lagayenge
import my_photoImg from './assets/my_photo.jpg';

export default function App() {
    const { currentUser, leaderboard, logout } = useContext(AuthContext);
    
    // States: 'hub', 'trivia', 'puzzle', 'sudoku', 'jigsaw'
    const [gameMode, setGameMode] = useState('hub'); 

    // Guard Clause: Agar user logged in nahi hai, toh direct Login Overlay matrix trigger hoga
    if (!currentUser) {
        return (
            <>
                <ParticleBg />
                <LoginOverlay />
            </>
        );
    }

    return (
        <>
            <ParticleBg />

            {/* 🌐 MODE 1: CYBER HUB INTERFACE (Jab gameMode 'hub' hoga tabhi dikhega) */}
            {gameMode === 'hub' && (
                <div className="container">
                    <div className="hud-bar">
                        <div className="live-status">
                            <div className="pulse-dot"></div>
                            <span>SYS: AUTH_OK</span>
                        </div>
                        <button className="switch-profile-btn" onClick={logout}>🔄 Switch Player</button>
                    </div>

                    {/* Profile Section featuring imported Avatar Node */}
                    <div className="profile-card">
                        <img src={my_photoImg} alt="Avatar" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                        <div className="char-stats">
                            <h1>{currentUser.name}</h1>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 700, color: '#a0aec0', marginTop: '5px' }}>
                                <span>RANK: RETRO GAMER</span>
                                <span>{currentUser.currentXP || 0}/100 XP</span>
                            </div>
                            <div className="stat-bar-container">
                                <div className="stat-bar-fill" style={{ width: `${currentUser.currentXP || 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Games Selection Console */}
                    <div className="widget">
                        <div className="widget-title">🕹️ Select Simulation Game</div>
                        <button className="action-main-btn" onClick={() => setGameMode('trivia')}>
                            ⚔️ Enter Trivia Dungeon
                        </button>
                        <button className="action-main-btn" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} onClick={() => setGameMode('puzzle')}>
                            🧩 Sliding Matrix Puzzle
                        </button>
                        <button className="action-main-btn" style={{ background: 'linear-gradient(90deg, #f59e0b, #eab308)' }} onClick={() => setGameMode('sudoku')}>
                            🔢 Nano Cyber Sudoku
                        </button>
                        <button className="action-main-btn" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} onClick={() => setGameMode('jigsaw')}>
                            🖼️ Cyber Jigsaw Image Assembly
                        </button>
                    </div>

                    {/* Global Dungeon Hall of Fame */}
                    <div className="widget">
                        <div className="widget-title">🏆 Top Dungeon Hall of Fame</div>
                        <div className="leaderboard-list">
                            {leaderboard && leaderboard.length > 0 ? (
                                leaderboard.map((player, index) => (
                                    <div key={index} className="lb-row">
                                        <div className="lb-rank-name">
                                            <span className="lb-rank">#{index + 1}</span>
                                            <span>{player.name}</span>
                                        </div>
                                        <div className="lb-badge">LVL {player.lvl || 1} - Q{(player.quest || 0) + 1}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.75rem', padding: '10px' }}>
                                    📡 Scanning data vectors...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 🎮 MODE 2: SIMULATION EXECUTION MATRIX */}
            {gameMode === 'trivia' && <TriviaGame onBack={() => setGameMode('hub')} />}
            {gameMode === 'puzzle' && <SlidingPuzzle onBack={() => setGameMode('hub')} />}
            {gameMode === 'sudoku' && <SudokuGame onBack={() => setGameMode('hub')} />}
            {gameMode === 'jigsaw' && <JigsawGame onBack={() => setGameMode('hub')} />}
        </>
    );
}