/**
 * Utility functions for styling organization tree nodes
 */

/**
 * Get visual styling based on depth with improved hierarchy
 */
export const getDepthStyles = (level: number): string => {
  const styles = [
    { 
      border: 'border-l-blue-500', 
      bg: 'bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-950/40 dark:to-blue-950/10',
      shadow: 'shadow-blue-100 dark:shadow-blue-900/20'
    },
    { 
      border: 'border-l-emerald-500', 
      bg: 'bg-gradient-to-r from-emerald-50 to-emerald-25 dark:from-emerald-950/40 dark:to-emerald-950/10',
      shadow: 'shadow-emerald-100 dark:shadow-emerald-900/20'
    },
    { 
      border: 'border-l-purple-500', 
      bg: 'bg-gradient-to-r from-purple-50 to-purple-25 dark:from-purple-950/40 dark:to-purple-950/10',
      shadow: 'shadow-purple-100 dark:shadow-purple-900/20'
    },
    { 
      border: 'border-l-amber-500', 
      bg: 'bg-gradient-to-r from-amber-50 to-amber-25 dark:from-amber-950/40 dark:to-amber-950/10',
      shadow: 'shadow-amber-100 dark:shadow-amber-900/20'
    },
    { 
      border: 'border-l-rose-500', 
      bg: 'bg-gradient-to-r from-rose-50 to-rose-25 dark:from-rose-950/40 dark:to-rose-950/10',
      shadow: 'shadow-rose-100 dark:shadow-rose-900/20'
    },
    { 
      border: 'border-l-cyan-500', 
      bg: 'bg-gradient-to-r from-cyan-50 to-cyan-25 dark:from-cyan-950/40 dark:to-cyan-950/10',
      shadow: 'shadow-cyan-100 dark:shadow-cyan-900/20'
    },
    { 
      border: 'border-l-indigo-500', 
      bg: 'bg-gradient-to-r from-indigo-50 to-indigo-25 dark:from-indigo-950/40 dark:to-indigo-950/10',
      shadow: 'shadow-indigo-100 dark:shadow-indigo-900/20'
    },
    { 
      border: 'border-l-lime-500', 
      bg: 'bg-gradient-to-r from-lime-50 to-lime-25 dark:from-lime-950/40 dark:to-lime-950/10',
      shadow: 'shadow-lime-100 dark:shadow-lime-900/20'
    }
  ];
  const style = styles[level % styles.length];
  return `${style.border} ${style.bg} ${style.shadow}`;
};

/**
 * Progressive indentation based on depth with max limit
 */
export const getIndentation = (level: number): number => {
  const indentPerLevel = 16; // Reduced from 24px to 16px
  const maxIndent = 80; // Maximum indentation to keep nodes visible
  return Math.min(level * indentPerLevel, maxIndent);
};