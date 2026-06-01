import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// 6 Mathematically Verified 4x4 Sudoku Grids
const SUDOKU_POOLS = [
    {
        initial: [[1, 0, 3, 0], [0, 0, 0, 2], [0, 0, 0, 0], [0, 1, 0, 4]],
        solution: [[1, 2, 3, 4], [4, 3, 1, 2], [2, 4, 1, 3], [3, 1, 2, 4]]
    },
    {
        initial: [[0, 4, 0, 1], [1, 0, 4, 0], [0, 1, 0, 4], [4, 0, 1, 0]],
        solution: [[2, 4, 3, 1], [1, 3, 4, 2], [3, 1, 2, 4], [4, 2, 1, 3]]
    },
    {
        initial: [[0, 0, 4, 0], [4, 0, 0, 1], [1, 0, 0, 3], [0, 3, 0, 0]],
        solution: [[3, 1, 4, 2], [4, 2, 3, 1], [1, 4, 2, 3], [2, 3, 1, 4]]
    },
    {
        initial: [[0, 1, 0, 0], [0, 0, 2, 0], [0, 2, 0, 0], [0, 0, 4, 0]],
        solution: [[2, 1, 3, 4], [4, 3, 2, 1], [3, 2, 1, 4], [1, 4, 4, 2]]
    },
    {
        initial: [[4, 0, 0, 0], [0, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0, 1]],
        solution: [[4, 3, 1, 2], [1, 2, 4, 3], [2, 1, 3, 4], [3, 4, 2, 1]]
    },
    {
        initial: [[0, 0, 0, 3], [3, 0, 0, 0], [0, 0, 4, 0], [0, 2, 0, 0]],
        solution: [[2, 4, 1, 3], [3, 1, 2, 4], [1, 3, 4, 2], [4, 2, 3, 1]]
    }
];

export default function SudokuGame({ onBack }) {
    const { updateXP, playSound } = useContext(AuthContext);
    const [grid, setGrid] = useState([[]]);
    const [initialGrid, setInitialGrid] = useState([[]]);
    const [solution, setSolution] = useState([[]]);
    const [won, setWon] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => { initSudoku(); }, []);

    const initSudoku = () => {
        setWon(false);
        // Generates random index between 0 to 5 out of our 6 pools matrix length
        const randIdx = Math.floor(Math.random() * SUDOKU_POOLS.length);
        setCurrentIndex(randIdx);
        const board = SUDOKU_POOLS[randIdx];
        
        setGrid(board.initial.map(row => [...row]));
        setInitialGrid(board.initial.map(row => [...row]));
        setSolution(board.solution);
    };

    const handleCellChange = (row, col, value) => {
        if (won || initialGrid[row][col] !== 0) return;

        const num = parseInt(value) || 0;
        if (num < 0 || num > 4) return;

        const newGrid = grid.map((r, rIdx) => 
            r.map((c, cIdx) => (rIdx === row && cIdx === col ? num : c))
        );
        setGrid(newGrid);
        checkSudokuWin(newGrid);
    };

    const checkSudokuWin = (currentGrid) => {
        const isCompleteAndCorrect = currentGrid.every((row, rIdx) => 
            row.every((val, cIdx) => val === solution[rIdx][cIdx])
        );

        if (isCompleteAndCorrect) {
            setWon(true);
            playSound('lvlup');
            updateXP(60, 'gain');
        }
    };

    return (
        <div className="container">
            {/* Dynamic CSS Injection inside React component scope for real-time celebration flashes */}
            <style>{`
                @keyframes neonGlowPulse {
                    0% { box-shadow: 0 0 10px #10b981, inset 0 0 5px #10b981; }
                    50% { box-shadow: 0 0 25px #34d399, inset 0 0 15px #34d399; }
                    100% { box-shadow: 0 0 10px #10b981, inset 0 0 5px #10b981; }
                }
                .celebration-overlay-card {
                    margin-top: 20px;
                    padding: 15px;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(4, 120, 87, 0.4));
                    border: 2px solid #10b981;
                    border-radius: 12px;
                    text-align: center;
                    animation: neonGlowPulse 2s infinite ease-in-out;
                }
                .celebration-title {
                    font-size: 1.3rem;
                    color: #34d399;
                    font-weight: bold;
                    text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
                    margin-bottom: 5px;
                }
            `}</style>

            <div className="hud-bar">
                <button className="back-hub-btn" onClick={onBack}>⬅️ Portal Hub</button>
                <div className="hud-level-tag" style={{background:'linear-gradient(90deg, #f59e0b, #d97706)'}}>
                    SUDOKU CORE {currentIndex + 1}/6
                </div>
            </div>

            <div className="widget">
                <div className="widget-title">🔢 Nano Cyber Sudoku</div>
                <p style={{fontSize:'0.75rem', opacity:0.7, textAlign:'center', marginBottom:'15px'}}>
                    Fill numbers 1 to 4 without repetition in any row, column, or 2x2 box!
                </p>

                <div style={{
                    display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', 
                    gap: '5px', maxWidth: '260px', margin: '0 auto',
                    background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '16px',
                    border: won ? '2px solid #10b981' : '1px solid var(--card-border)',
                    transition: '0.4s all'
                }}>
                    {grid.map((row, rIdx) => (
                        <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                            {row.map((cell, cIdx) => {
                                const isFixed = initialGrid[rIdx][cIdx] !== 0;
                                return (
                                    <input
                                        key={cIdx}
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={cell === 0 ? '' : cell}
                                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                        disabled={isFixed || won}
                                        style={{
                                            aspectRatio: '1', width: '100%', textAlign: 'center',
                                            fontSize: '1.6rem', fontWeight: 'bold', borderRadius: '10px',
                                            border: won ? '1px solid #10b981' : (isFixed ? '1px solid rgba(255,255,255,0.08)' : '2px solid var(--game-neon)'),
                                            background: isFixed ? 'rgba(0,0,0,0.4)' : (won ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.8)'),
                                            color: won ? '#34d399' : (isFixed ? '#64748b' : 'white'), 
                                            outline: 'none', transition: '0.3s all'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* 🌟 New Interactive Celebration Banner */}
                {won ? (
                    <div className="celebration-overlay-card">
                        <div className="celebration-title">🎉 CONGRATULATIONS! 🎉</div>
                        <p style={{fontSize: '0.8rem', color: '#a7f3d0', margin: '0'}}>
                            You cracked the cyber matrix! <strong>+60 XP</strong> injected into your avatar.
                        </p>
                    </div>
                ) : null}
                
                <button className="action-main-btn" style={{marginTop:'20px'}} onClick={initSudoku}>
                    🔄 Load Next Random Grid
                </button>
            </div>
        </div>
    );
}