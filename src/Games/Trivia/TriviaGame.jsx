import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

const localPuzzles = {
    1: [
        { cat: "Sports", q: "क्रिकेट खेल में एक टीम में ______ खिलाड़ी मैदान पर होते हैं और कबड्डी में ______।", opts: ["11 / 7", "11 / 11", "9 / 7", "11 / 9"], a: "11 / 7" },
        { cat: "English", q: "The synonym of 'Happy' is ______ and the antonym of 'Sad' is ______.", opts: ["Joyful / Happy", "Angry / Cry", "Glad / Gloomy", "Smile / Bad"], a: "Joyful / Happy" },
        { cat: "GK", q: "भारत की राजधानी ______ है और मध्य प्रदेश की राजधानी ______ है।", opts: ["दिल्ली / भोपाल", "मुंबई / इंदौर", "दिल्ली / ग्वालियर", "कोलकाता / भोपाल"], a: "दिल्ली / भोपाल" },
        { cat: "Reasoning", q: "अगर कल सोमवार था, तो आने वाला कल ______ होगा और परसों ______ होगा।", opts: ["बुधवार / गुरुवार", "मंगलवार / बुधवार", "सोमवार / मंगलवार", "बुधवार / शुक्रवार"], a: "बुधवार / गुरुवार" },
        { cat: "Nature", q: "हमारे सौरमंडल का सबसे बड़ा ग्रह ______ है और सबसे छोटा ग्रह ______ है।", opts: ["बृहस्पति / बुध", "शनि / मंगल", "पृथ्वी / शुक्र", "बृहस्पति / प्लूटो"], a: "बृहस्पति / बुध" }
    ]
    // Note: Level 2 se 10 ka data bhi isi format me object structure me extend rahega...
};

export default function TriviaGame({ onBack }) {
    const { currentUser, updateXP, updateQuestProgress, playSound } = useContext(AuthContext);
    const [level, setLevel] = useState(currentUser.currentLvl || 1);
    const [qIdx, setQIdx] = useState(currentUser.currentQuestIdx || 0);
    
    const [displayText, setDisplayText] = useState('');
    const [shuffledOpts, setShuffledOpts] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [solved, setSolved] = useState(false);
    const [ticks, setTicks] = useState(15);
    const [selectionStates, setSelectionStates] = useState({}); // tracking classes
    const timerRef = useRef(null);

    const categories = ["Sports", "English", "GK", "Reasoning", "Nature"];
    const currentQuestion = localPuzzles[level]?.[qIdx] || localPuzzles[1][0];

    // TYPEWRITER SYSTEM LINK EFFECT
    useEffect(() => {
        setSolved(false); setAttempts(0); setTicks(15); setSelectionStates({});
        clearInterval(timerRef.current);
        
        let txt = currentQuestion.q; let i = 0; setDisplayText('');
        const tw = setInterval(() => {
            if (i < txt.length) {
                setDisplayText(prev => prev + txt.charAt(i)); i++;
            } else {
                clearInterval(tw);
                // Convert blanks safely post typewriter closure
                let formatted = txt.replace(/______/g, `<span class="blank-space">______</span>`);
                setDisplayText(formatted);
                
                // Shuffle logic maps
                let optsCopy = [...currentQuestion.opts];
                if (level > 1) optsCopy.sort(() => Math.random() - 0.5);
                setShuffledOpts(optsCopy);
                
                if (level > 1) startCountdown();
            }
        }, 12);
        return () => clearInterval(tw);
    }, [level, qIdx]);

    const startCountdown = () => {
        timerRef.current = setInterval(() => {
            setTicks(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current); setSolved(true); playSound('wrong');
                    setDisplayText("💥 TIME EXPIRED! RETRYING..."); updateXP(5, 'lose');
                    setTimeout(() => reloadQuest(), 1500); return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const reloadQuest = () => { setQIdx(qIdx); setLevel(level); };

    const handleChoice = (opt) => {
        if (solved || attempts >= 2) return;
        const currentAttempts = attempts + 1; setAttempts(currentAttempts);

        if (opt === currentQuestion.a) {
            clearInterval(timerRef.current); setSolved(true); playSound('correct');
            setSelectionStates(prev => ({ ...prev, [opt]: 'correct' }));
            updateXP(10, 'gain');

            const words = currentQuestion.a.split(' / ');
            let solvedText = currentQuestion.q.replace("______", `<span style="color:var(--game-green)">${words[0]}</span>`);
            solvedText = solvedText.replace("______", `<span style="color:var(--game-green)">${words[1]}</span>`);
            setDisplayText(solvedText);

            setTimeout(() => {
                if (qIdx < 4) {
                    updateQuestProgress(level, qIdx + 1); setQIdx(qIdx + 1);
                } else {
                    if (level < 10) {
                        playSound('lvlup'); updateQuestProgress(level + 1, 0);
                        setLevel(level + 1); setQIdx(0);
                        alert(`⚡ LEVEL UP! Welcome to Level ${level + 1} ⚡`);
                    } else { alert("🏆 CONGRATULATIONS MASTER! DUNGEON CONQUERED!"); onBack(); }
                }
            }, 1500);
        } else {
            playSound('wrong'); updateXP(5, 'lose');
            setSelectionStates(prev => ({ ...prev, [opt]: 'wrong' }));
            
            if (level > 1 && currentAttempts < 2) {
                setTimeout(() => { setShuffledOpts(prev => [...prev].sort(() => Math.random() - 0.5)); }, 400);
            }
            if (currentAttempts >= 2) {
                clearInterval(timerRef.current); setSolved(true);
                setTimeout(() => { loadLevelQuest(); }, 1500);
            }
        }
    };

    return (
        <div class="container">
            <div class="hud-bar">
                <button class="back-hub-btn" onClick={() => { clearInterval(timerRef.current); onBack(); }}>⬅️ Portal Hub</button>
                <div class="hud-level-tag">LEVEL {level}</div>
            </div>

            {level > 1 && (
                <div id="timer-container" style={{display:'block'}}>
                    <div id="timer-fill" style={{width: `${(ticks/15)*100}%`}}></div>
                </div>
            )}

            <div class="category-matrix">
                {categories.map((c, idx) => (
                    <div key={c} class={`cat-btn ${idx === qIdx ? 'active' : ''}`}>
                        <span>{c}</span>
                    </div>
                ))}
            </div>

            <div class="widget">
                <div class="widget-title">
                    <span>🛡️ Challenge Quest</span>
                    <span class="attempt-badge">Lifelines: {2 - attempts}</span>
                </div>
                <div class="quote-capture-area">
                    <div class="quote-box" dangerouslySetInnerHTML={{__html: displayText}} />
                </div>
                <div class="puzzle-options-box">
                    {shuffledOpts.map(opt => (
                        <button key={opt} class={`puzzle-opt-btn ${selectionStates[opt] || ''}`} onClick={() => handleChoice(opt)}>
                            <span>🎮 {opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}