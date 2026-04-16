import React from 'react'
import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #065f46 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      {/* Rotating ring container */}
      <div style={{ position: 'relative', width: 176, height: 176, marginBottom: 40 }}>
        {/* Outer dashed ring - rotates */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '4px dashed rgba(134,239,172,0.7)',
          animation: 'spinRing 8s linear infinite'
        }} />
        {/* Inner ring - counter rotates */}
        <div style={{
          position: 'absolute', inset: 8,
          borderRadius: '50%',
          border: '2px solid rgba(52,211,153,0.4)',
          animation: 'spinRing 12s linear infinite reverse'
        }} />
        {/* Profile image */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: 176, height: 176,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid white',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <img
            src="/src/assets/download.jpg"
            alt="Dr. Kalpesh Pashte"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {/* Leaf decorations */}
        {['🌿','🍃','🌱','🌿'].map((leaf, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: 20, zIndex: 20,
            top: `${50 + 58 * Math.sin((i * Math.PI) / 2)}%`,
            left: `${50 + 58 * Math.cos((i * Math.PI) / 2)}%`,
            transform: 'translate(-50%, -50%)'
          }}>{leaf}</span>
        ))}
      </div>

      {/* Clinic name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        style={{ fontSize: 48, fontWeight: 700, color: 'white', marginBottom: 12, fontFamily: 'Georgia, serif' }}
      >
        Hari Om Clinic
      </motion.h1>

      {/* Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        style={{ color: '#86efac', fontSize: 18, fontStyle: 'italic', letterSpacing: 2 }}
      >
        "Health is Wealth"
      </motion.p>

      {/* Bouncing dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ display: 'flex', gap: 8, marginTop: 40 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{ width: 12, height: 12, background: '#86efac', borderRadius: '50%' }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>

      <style>{`
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
