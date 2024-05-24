
import { createContext, useContext, useState } from "react"
import { Notification } from "@/types";

export const NotificationContext = createContext<Notification[]>([]);

export const useNotificationContext = () => useContext(NotificationContext);