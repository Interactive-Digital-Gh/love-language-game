import axios from "axios";

const TRACK_URL =
  "https://stanbic-vals-backend.interactivedigital.com.gh/api/track";

/*
|--------------------------------------------------------------------------
| Session ID (persistent per quiz attempt)
|--------------------------------------------------------------------------
*/

const getSessionId = () => {
  let id = localStorage.getItem("quiz_session_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("quiz_session_id", id);
  }

  return id;
};

/*
|--------------------------------------------------------------------------
| Basic Device Detection (Lightweight)
|--------------------------------------------------------------------------
*/

const getDeviceType = () => {
  const ua = navigator.userAgent;

  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
};

/*
|--------------------------------------------------------------------------
| Track Event
|--------------------------------------------------------------------------
*/

export const trackEvent = async (eventType, payload = {}) => {
  try {
    await axios.post(TRACK_URL, {
      event_type: eventType,
      session_id: getSessionId(),

      url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),

      // Optional browser/os extraction (basic)
      browser: navigator.userAgent,
      os: navigator.platform,

      ...payload,
    });
  } catch (err) {
    console.error("Analytics error:", err);
  }
};

/*
|--------------------------------------------------------------------------
| Reset Session (for retake)
|--------------------------------------------------------------------------
*/

export const resetSession = () => {
  localStorage.removeItem("quiz_session_id");
};
