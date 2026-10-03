/**
 * Web Push Notification Utility for MediQueue
 * Uses Browser Native Notification API (100% Free)
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support native desktop notifications.");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNativeNotification = (title, body, icon = "/favicon.ico") => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    const notification = new Notification(title, {
      body: body,
      icon: icon,
      badge: icon,
      tag: "mediqueue-alert",
      renotify: true,
      requireInteraction: true
    });

    notification.onclick = function () {
      window.focus();
      notification.close();
    };
  } catch (err) {
    console.error("Failed to trigger native push notification:", err);
  }
};
