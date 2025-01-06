import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Composant pour le texte défilant
const TextRoll = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <div style={styles.roller}>
      <AnimatePresence mode="wait">
        <motion.span
          className="baseline"
          key={currentIndex}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.textPrimary}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const styles = {
  roller: {
    height: '4.125rem',
    lineHeight: '4rem',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1D3557',
  },
  textPrimary: {
    position: 'absolute',
  },
};

export default TextRoll;