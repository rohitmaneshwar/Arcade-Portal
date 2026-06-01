import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function SlidingPuzzle({ onBack }) {

    const { updateXP, playSound } = useContext(AuthContext);
    const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, ""]);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => { shuffleTiles(); }, []);

    const shuffleTiles = () => {
        setIsWon(false);
        let shuffled = [1, 2, 3, 4, 5, 6, 7, 8, ""];
        // Perform algorithmic random tile swaps
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setTiles(shuffled);
    };

    const handleTileClick = (index) => {
        if (isWon) return;
        const emptyIndex = tiles.indexOf("");

        // Matrix $3 \times 3$ Coordinate shifts verification validation rules
        const validMoves = [
            emptyIndex - 1, emptyIndex + 1, // Left, Right adjacent checks
            emptyIndex - 3, emptyIndex + 3  // Up, Down adjacent checks
        ];

        // Block side borders grid wrap leaks
        if (emptyIndex % 3 === 0 && index === emptyIndex - 1) return;
        if (emptyIndex % 3 === 2 && index === emptyIndex + 1) return;

        if (validMoves.includes(index)) {
            const nextGrid = [...tiles];
            [nextGrid[emptyIndex], nextGrid[index]] = [nextGrid[index], nextGrid[emptyIndex]];
            setTiles(nextGrid);
            checkWinCondition(nextGrid);
        }
    };

    const checkWinCondition = (grid) => {
        const winState = [1, 2, 3, 4, 5, 6, 7, 8, ""];
        const match = grid.every((val, i) => val === winState[i]);
        if (match) {
            setIsWon(true); playSound('lvlup');
            updateXP(50, 'gain'); // Dispatches heavy puzzle prize rewards to state core
        }
    };

    return (
        <div class="container">
            <div class="hud-bar">
                <button class="back-hub-btn" onClick={onBack}>⬅️ Portal Hub</button>
                <div class="hud-level-tag" style={{ background: 'var(--game-green)' }}>PUZZLE TIER</div>
            </div>

            <div class="widget">
                <div class="widget-title">🧩 Sliding Matrix Solver</div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, textAlign: 'center' }}>संख्याओं को क्रम (1 से 8) में जमाकर ग्रिड हल करें!</p>

                <div class="puzzle-board-grid">
                    {tiles.map((tile, idx) => (
                        <div key={idx} class={`puzzle-tile ${tile === "" ? "empty-tile" : ""}`} onClick={() => handleTileClick(idx)}>
                            {tile}
                        </div>
                    ))}
                </div>

                {isWon && <div className="level-up-splash">🏆 MATRIX SOLVED!<br /><span style={{ fontSize: '0.8rem' }}>+50 XP RANK REWARD EXTRACTED!</span></div>}
                <button class="action-main-btn" style={{ marginTop: '20px' }} onClick={shuffleTiles}>🔄 Reshuffle Matrix</button>
            </div>
        </div>
    );
}