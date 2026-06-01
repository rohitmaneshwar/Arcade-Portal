import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ParticleBg from './components/ParticleBg';
import LoginOverlay from './components/LoginOverlay';
import TriviaGame from './Games/Trivia/TriviaGame';
import SlidingPuzzle from './Games/Puzzle/SlidingPuzzle';
import SudokuGame from './Games/Sudoku/SudokuGame';
import JigsawGame from './Games/Jigsaw/JigsawGame';
// import avatarImg from './assets/my_photo.jpg';

export default function App() {
    const { currentUser, leaderboard, logout } = useContext(AuthContext);
    const [gameMode, setGameMode] = useState('hub'); // hub, trivia, puzzle

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

            {gameMode === 'hub' && (
                <div class="container">
                    <div class="hud-bar">
                        <div class="live-status"><div class="pulse-dot"></div><span>SYS: AUTH_OK</span></div>
                        <button class="switch-profile-btn" onClick={logout}>🔄 Switch Player</button>
                    </div>

                    <div class="profile-card">
                        <img src={currentUser.avatar} alt="Avatar" />
                        <div class="char-stats">
                            <h1>{currentUser.name}</h1>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 700, color: '#a0aec0', marginTop: '5px' }}>
                                <span>RANK: RETRO GAMER</span>
                                <span>{currentUser.currentXP || 0}/100 XP</span>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar-fill" style={{ width: `${currentUser.currentXP || 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div class="widget">
                        <div class="widget-title">🕹️ Select Simulation Game</div>
                        <button class="action-main-btn" onClick={() => setGameMode('trivia')}>⚔️ Enter Trivia Dungeon</button>
                        <button class="action-main-btn" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} onClick={() => setGameMode('puzzle')}>🧩 Sliding Matrix Puzzle</button>
                        <button className="action-main-btn" style={{ background: 'linear-gradient(90deg, #f59e0b, #eab308)' }} onClick={() => setGameMode('sudoku')}>🔢 Nano Cyber Sudoku</button>
                        <button className="action-main-btn" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} onClick={() => setGameMode('jigsaw')}>🖼️ Cyber Jigsaw Image Assembly</button>
                    </div>

                    <div class="widget">
                        <div class="widget-title">🏆 Top Dungeon Hall of Fame</div>
                        <div class="leaderboard-list">
                            {leaderboard.map((player, index) => (
                                <div key={index} class="lb-row">
                                    <div class="lb-rank-name">
                                        <span class="lb-rank">#{index + 1}</span>
                                        <span>{player.name}</span>
                                    </div>
                                    <div class="lb-badge">LVL {player.lvl} - Q{player.quest + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {gameMode === 'trivia' && <TriviaGame onBack={() => setGameMode('hub')} />}
            {gameMode === 'puzzle' && <SlidingPuzzle onBack={() => setGameMode('hub')} />}
            {gameMode === 'sudoku' && <SudokuGame onBack={() => setGameMode('hub')} />}
            {gameMode === 'jigsaw' && <JigsawGame onBack={() => setGameMode('hub')} />}
        </>
    );
}