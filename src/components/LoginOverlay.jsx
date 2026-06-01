import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginOverlay() {
    const { users, setUsers, setCurrentUser } = useContext(AuthContext);
    const [panel, setPanel] = useState('login'); // login, register, recover
    
    // Inputs tracking states
    const [name, setName] = useState(''); const [pin, setPin] = useState('');
    const [regName, setRegName] = useState(''); const [regPin, setRegPin] = useState(''); const [regHint, setRegHint] = useState('');
    const [recName, setRecName] = useState(''); const [recHint, setRecHint] = useState('');

    const handleLogin = () => {
        if (!name.trim() || !pin.trim()) { alert("कृपया Name और PIN दोनों भरें!"); return; }
        const uKey = name.trim().toLowerCase();
        if (!users[uKey]) { alert("⚠️ प्रोफाइल नहीं मिली! New Profile बनाएं।"); return; }
        if (users[uKey].pin !== pin.trim()) { alert("❌ गलत PIN! सही पिन दर्ज करें।"); return; }
        setCurrentUser(users[uKey]);
    };

    const handleRegister = () => {
        if (!regName.trim() || !regPin.trim() || !regHint.trim()) { alert("कृपया सभी fields भरें!"); return; }
        const uKey = regName.trim().toLowerCase();
        if (users[uKey]) { alert("⚠️ यह नाम पहले से बुक है!"); return; }
        
        const newAccount = { name: regName.trim(), pin: regPin.trim(), hint: regHint.trim(), currentLvl: 1, currentQuestIdx: 0, currentXP: 0 };
        setUsers(prev => ({ ...prev, [uKey]: newAccount }));
        setCurrentUser(newAccount);
    };

    const handleRecover = () => {
        if (!recName.trim() || !recHint.trim()) { alert("कृपया Name और Answer दोनों भरें!"); return; }
        const uKey = recName.trim().toLowerCase();
        if (!users[uKey]) { alert("⚠️ प्रोफाइल नहीं मिली!"); return; }
        
        if (users[uKey].hint.toLowerCase() === recHint.trim().toLowerCase()) {
            let newPin = prompt("✅ वेरिफिकेशन सफल! अपना नया Secret PIN डालें:");
            if (newPin && newPin.trim().length > 0) {
                setUsers(prev => {
                    const copy = { ...prev };
                    copy[uKey].pin = newPin.trim();
                    return copy;
                });
                alert("🎉 PIN बदल गया! अब लॉगिन करें।"); setPanel('login');
            }
        } else { alert("❌ गलत Security Answer!"); }
    };

    return (
        <div className="login-overlay">
            <div className="login-card">
                <h2>Trivia Dungeon 🎮</h2>
                
                {panel === 'login' && (
                    <div>
                        <p>अपना Name और Secret PIN डालकर लॉगिन करें</p>
                        <input type="text" className="name-input" placeholder="Avatar Name..." value={name} onChange={e => setName(e.target.value)} />
                        <input type="password" className="name-input" placeholder="Secret PIN..." value={pin} onChange={e => setPin(e.target.value)} />
                        <button className="start-game-btn" onClick={handleLogin}>Launch Game</button>
                        <div style={{display:'flex', justifyContent:'space-between', marginTop:'18px', fontSize:'0.75rem', fontWeight:700}}>
                            <span style={{color:'var(--game-neon)', cursor:'pointer'}} onClick={() => setPanel('register')}>🆕 New Profile</span>
                            <span style={{color:'#a0aec0', cursor:'pointer'}} onClick={() => setPanel('recover')}>❓ Forgot PIN?</span>
                        </div>
                    </div>
                )}

                {panel === 'register' && (
                    <div>
                        <p>नया Avatar बनाएं और Recovery पासवर्ड सेट करें</p>
                        <input type="text" className="name-input" placeholder="Choose Avatar Name..." value={regName} onChange={e => setRegName(e.target.value)} />
                        <input type="password" className="name-input" placeholder="Set Secret PIN..." value={regPin} onChange={e => setRegPin(e.target.value)} />
                        <input type="text" className="name-input" placeholder="Security Answer (e.g. favorite city)..." value={regHint} onChange={e => setRegHint(e.target.value)} />
                        <button className="start-game-btn" onClick={handleRegister}>Create Account</button>
                        <p style={{marginTop:'15px', fontSize:'0.75rem', color:'var(--game-neon)', cursor:'pointer', fontWeight:700}} onClick={() => setPanel('login')}>⬅️ Back to Login</p>
                    </div>
                )}

                {panel === 'recover' && (
                    <div>
                        <p>PIN रिकवर करने के लिए Security Answer डालें</p>
                        <input type="text" className="name-input" placeholder="Your Avatar Name..." value={recName} onChange={e => setRecName(e.target.value)} />
                        <input type="text" className="name-input" placeholder="Your Security Answer..." value={recHint} onChange={e => setRecHint(e.target.value)} />
                        <button className="start-game-btn" onClick={handleRecover}>Verify & Reset PIN</button>
                        <p style={{marginTop:'18px', fontSize:'0.75rem', color:'var(--game-neon)', cursor:'pointer', fontWeight:700}} onClick={() => setPanel('login')}>⬅️ Back to Login</p>
                    </div>
                )}
            </div>
        </div>
    );
}