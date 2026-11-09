export interface NotificationConfig {
  enabled: boolean;
  morningTime: string; // "08:00"
  afternoonTime: string; // "14:00"
  eveningTime: string; // "19:30"
  leadMinutes: number; // 0 or 5 or 10 minutes before
  soundEnabled: boolean;
  scheduledReminders: {
    [taskId: string]: {
      taskId: string;
      title: string;
      scheduledTime: string; // ISO string
    };
  };
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  morningTime: '08:00',
  afternoonTime: '14:00',
  eveningTime: '19:30',
  leadMinutes: 5,
  soundEnabled: true,
  scheduledReminders: {},
};

/**
 * Checks whether the browser supports Web Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Requests permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

/**
 * Plays an alert chime using Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Pleasant double-bell study chime
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playTone(523.25, 0, 0.4); // C5
    playTone(659.25, 0.15, 0.5); // E5
    playTone(783.99, 0.3, 0.8); // G5
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

/**
 * Sends a notification immediately or triggers in-app fallback
 */
export function sendStudyNotification(
  title: string,
  body: string,
  onInAppFallback?: (title: string, body: string) => void,
  sound: boolean = true
) {
  if (sound) {
    playNotificationSound();
  }

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'thanaweya-study-reminder',
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn('Notification error, using in-app fallback', e);
    }
  }

  // Fallback to in-app toast
  if (onInAppFallback) {
    onInAppFallback(title, body);
  }
  return false;
}
