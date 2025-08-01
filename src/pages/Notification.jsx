import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useSelector } from "react-redux";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import time from "../components/time/time";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);
  const [groupNotify, setGroupNotify]= useState([])

  useEffect(() => {
    const notificationRef = ref(db, "notification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.notifyReciver == data.uid) {
          arr.unshift({
            id: item.key,
            ...notification,
          });
        }
      });
      setNotifications(arr);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
  const notiRef = ref(db, "groupmessagenotification/");

  onValue(notiRef, (snapshot) => {
    let arr = [];
    snapshot.forEach((item) => {
      const notify = item.val();
      if (notify.reciverid === data.uid) {
        arr.unshift({
          id: item.key,
          ...notify,
          content: `New message in group "${notify.groupName}"`,
          type: "info",
        });
      }
    });
    setGroupNotify(arr);
  });
}, []);

console.log("groupnoti",groupNotify);



  const deleteNotification = (notificationId) => {
    remove(ref(db, "notification/" + notificationId));
  };

  const clearAllNotifications = () => {
    notifications.forEach((notification) => {
      remove(ref(db, "notification/" + notification.id));
    });
  };

  const getNotificationIcon = (type) => {
    if (type === "positive") {
      return (
        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-5 h-5 text-white" />
        </div>
      );
    } else if (type === "negative") {
      return (
        <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
          <AiOutlineCloseCircle className="w-5 h-5 text-white" />
        </div>
      );
    } else {
      return (
        <div
          className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:w-[80%] mt-[32px]  mx-auto xl:h-[85vh]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-4 mb-3"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="xl:w-[80%] mt-[32px]  mx-auto p-6 bg-gray-50 xl:h-[85vh]">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {notifications.length} total notifications
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 h-[88%] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM15 17l-5-5M15 17H10a2 2 0 01-2-2V5a2 2 0 012-2h5"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! No new notifications.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">{notification?.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  title="Delete notification"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;