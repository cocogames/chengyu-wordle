import { useEffect, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const [playingCount, setPlayingCount] = useState(0);
  useEffect(() => {
    let fetchTimer, fetchRAF;
    const fetchPlayingCount = () => {
      
    };
    fetchPlayingCount();
    return () => {
      
    };
  }, []);

  if (playingCount <= 1) return null;

  return (
    <div id="current-playing">
      {t('ui.countPlaying', { count: playingCount })}
    </div>
  );
};
