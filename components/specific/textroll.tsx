import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TextRollProps {
  words: string[];
}

// Composant pour le texte défilant
const TextRoll = ({ words }: TextRollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words]);

  if (!words || words.length === 0) return null;

  return (
    <span style={styles.roller}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut"
          }}
          style={styles.textPrimary}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const styles = {
  roller: {
    display: 'inline-flex',
    position: 'relative' as const,
    height: '1.2em',
    overflow: 'hidden',
    verticalAlign: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPrimary: {
    display: 'block',
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
  },
};

export default TextRoll;