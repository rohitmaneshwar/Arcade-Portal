import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import gokuImg from '../../assets/goku.jpg';
import narutoImg from '../../assets/naruto.jpg';
import spidermanImg from '../../assets/spiderman.jpg';
import luffyImg from '../../assets/luffy.jpg';
import pikachuImg from '../../assets/pikachu.jpg';

const GRID_SIZE = 3; // Exactly 9 boxes ($3 \times 3$)
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE; 

// 🔥 100% Stable Static Anime and Cartoon Images Pool (Direct High-Speed Global CDN Links)
const JIGSAW_LEVELS = [
    { name: "Goku (Dragon Ball Z) ☄️", url: gokuImg },
    { name: "Naruto Uzumaki 🦊", url: narutoImg },
    { name: "Spider-Man (Spider-Verse) 🕷️", url: spidermanImg },
    { name: "Monkey D. Luffy 🏴‍☠️", url: luffyImg },
    { name: "Cute Pikachu ⚡", url: pikachuImg }
];

export default function JigsawGame({ onBack }) {
    const { updateXP, playSound } = useContext(AuthContext);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [pieces, setPieces] = useState([]);
    const [won, setWon] = useState(false);
    const [draggedIdx, setDraggedIdx] = useState(null);
    const [campaignFinished, setCampaignFinished] = useState(false);

    useEffect(() => { loadLevel(currentLevel); }, [currentLevel]);

    const loadLevel = (lvlIdx) => {
        setWon(false);
        let arr = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
        let shuffled = [...arr].sort(() => Math.random() - 0.5);
        if (shuffled.every((val, idx) => val === idx)) {
            shuffled = [...arr].reverse();
        }
        setPieces(shuffled);
    };

    const handleSwap = (index1, index2) => {
        if (won || campaignFinished) return;
        let newPieces = [...pieces];
        let temp = newPieces[index1];
        newPieces[index1] = newPieces[index2];
        newPieces[index2] = temp;
        setPieces(newPieces);
        playSound('correct');
        checkWin(newPieces);
    };

    const checkWin = (currentPieces) => {
        const isSolved = currentPieces.every((val, idx) => val === idx);
        if (isSolved) {
            setWon(true);
            playSound('lvlup');
            updateXP(75, 'gain');
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < JIGSAW_LEVELS.length - 1) {
            setCurrentLevel(prev => prev + 1);
        } else {
            setCampaignFinished(true);
        }
    };

    const handleForceChangeLevel = () => {
        if (campaignFinished) return;
        const nextIdx = currentLevel < JIGSAW_LEVELS.length - 1 ? currentLevel + 1 : 0;
        setCurrentLevel(nextIdx);
        loadLevel(nextIdx); 
    };

    const restartCampaign = () => {
        setCampaignFinished(false);
        setCurrentLevel(0);
        loadLevel(0);
    };

    const activeImg = JIGSAW_LEVELS[currentLevel].url;

    return (
        <div className="container" style={{maxWidth: '850px'}}>
            <style>{`
                @keyframes neonPulseCyan {
                    0% { box-shadow: 0 0 10px #06b6d4, inset 0 0 5px #06b6d4; }
                    50% { box-shadow: 0 0 25px #22d3ee, inset 0 0 15px #22d3ee; }
                    100% { box-shadow: 0 0 10px #06b6d4, inset 0 0 5px #06b6d4; }
                }
                .jigsaw-celebration-card {
                    margin-top: 25px;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(30, 64, 175, 0.4));
                    border: 2px solid #06b6d4;
                    border-radius: 12px;
                    text-align: center;
                    animation: neonPulseCyan 2s infinite ease-in-out;
                }
                .control-btn-group {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 25px;
                    flex-wrap: wrap;
                }
                .jigsaw-tile-3x3 {
                    background-repeat: no-repeat;
                    border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
                    box-sizing: border-box;
                    transition: border-color 0.2s, transform 0.1s;
                }
                .jigsaw-tile-3x3:hover {
                    border-color: var(--game-neon) !important;
                    transform: scale(1.02);
                    z-index: 5;
                }
            `}</style>

            <div className="hud-bar">
                <button className="back-hub-btn" onClick={onBack}>⬅️ Portal Hub</button>
                <div className="hud-level-tag" style={{background:'linear-gradient(90deg, #06b6d4, #3b82f6)'}}>
                    ANIME TIER {currentLevel + 1}/5
                </div>
            </div>

            <div className="widget" style={{background: 'rgba(15, 23, 42, 0.4)'}}>
                <div className="widget-title">🖼️ {JIGSAW_LEVELS[currentLevel].name}</div>
                
                {campaignFinished ? (
                    <div style={{textAlign: 'center', padding: '40px 20px'}}>
                        <h2 style={{color: 'var(--game-neon)'}}>👑 ANIME REALM CONQUERED! 👑</h2>
                        <p style={{margin: '15px 0', opacity: 0.8}}>Congratulations! All 5 matrices structured.</p>
                        <button className="action-main-btn" onClick={restartCampaign}>🔄 Replay Campaign</button>
                    </div>
                ) : (
                    <>
                        <p style={{fontSize:'0.75rem', opacity:0.7, textAlign:'center', marginBottom:'20px'}}>
                            Tukdon ko drag karke right side ki real image jaisa jodein!
                        </p>

                        <div style={{
                            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                            justifyContent: 'center', gap: '30px', alignItems: 'center'
                        }}>
                            {/* LEFT: 3x3 Active Puzzle Playground (9 Boxes) */}
                            <div>
                                <p style={{fontSize: '0.8rem', color: 'var(--game-neon)', textAlign: 'center', fontWeight: 'bold'}}>🧩 3x3 PUZZLE MATRIX</p>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                                    gap: '2px', width: '300px', height: '300px',
                                    background: 'rgba(0,0,0,0.6)', padding: '5px', borderRadius: '8px',
                                    border: won ? '3px solid #06b6d4' : '1px solid var(--card-border)'
                                }}>
                                    {pieces.map((pieceValue, currentIdx) => {
                                        const row = Math.floor(pieceValue / GRID_SIZE);
                                        const col = pieceValue % GRID_SIZE;
                                        
                                        const bgX = (col / (GRID_SIZE - 1)) * 100;
                                        const bgY = (row / (GRID_SIZE - 1)) * 100;

                                        return (
                                            <div
                                                key={currentIdx}
                                                draggable={!won}
                                                onDragStart={() => setDraggedIdx(currentIdx)}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => {
                                                    if (draggedIdx !== null) handleSwap(draggedIdx, currentIdx);
                                                }}
                                                className="jigsaw-tile-3x3"
                                                style={{
                                                    backgroundImage: `url(${activeImg})`,
                                                    backgroundSize: '300% 300%', 
                                                    backgroundPosition: `${bgX}% ${bgY}%`,
                                                    cursor: won ? 'default' : 'grab',
                                                    backgroundColor: 'rgba(255,255,255,0.05)'
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* RIGHT: Real Image Preview */}
                            <div>
                                <p style={{fontSize: '0.8rem', color: '#a0aec0', textAlign: 'center', fontWeight: 'bold'}}>👁️ REAL IMAGE</p>
                                <div style={{
                                    width: '300px', height: '300px',
                                    backgroundImage: `url(${activeImg})`,
                                    backgroundSize: '100% 100%', backgroundPosition: 'center', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)', opacity: 0.9,
                                    backgroundColor: 'rgba(0,0,0,0.6)'
                                }} />
                            </div>
                        </div>

                        {won && (
                            <div className="jigsaw-celebration-card">
                                <h3 style={{color: '#22d3ee', margin: '0 0 5px 0'}}>🎉 LEVEL CLEARED! PERFECT ASSEMBLY 🎉</h3>
                                <p style={{fontSize: '0.8rem', margin: '0 0 15px 0', color: '#cbd5e1'}}>
                                    Image decrypted seamlessly! <strong>+75 XP</strong> successfully wired.
                                </p>
                                <button className="start-game-btn" style={{maxWidth: '220px', margin: '0 auto'}} onClick={handleNextLevel}>
                                    {currentLevel < JIGSAW_LEVELS.length - 1 ? "🚀 Next Anime Image" : "👑 Finish Campaign"}
                                </button>
                            </div>
                        )}

                        {!won && (
                            <div className="control-btn-group">
                                <button className="action-main-btn" style={{margin: '0', maxWidth: '240px'}} onClick={() => loadLevel(currentLevel)}>
                                    🔄 Reshuffle Current
                                </button>
                                <button className="action-main-btn" style={{margin: '0', maxWidth: '240px', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)'}} onClick={handleForceChangeLevel}>
                                    ⏭️ Skip / Change Image
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}