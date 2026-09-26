import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ColorModeSwitcher = ({ className }: { className?: string }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    // Toggle Chakra UI color mode
    toggleColorMode();
    
    // Toggle next-themes
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <IconButton
      aria-label="Toggle theme"
      className={className}
      icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}
      onClick={handleToggle}
      size="sm"
      variant="ghost"
    />
  );
};