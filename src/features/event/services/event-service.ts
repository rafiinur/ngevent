import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAllEvents = async () => {
    const eventsCol = await collection(db, "events");
    const eventSnapshot = await getDocs(eventsCol);
    const events = eventSnapshot.docs.map((doc) => doc.data());
    return events;
}

export const getEventById = async (id: string) => {
    const eventDoc = await doc(db, "events", id);
    const eventSnapshot = await getDoc(eventDoc);
    if (eventSnapshot.exists()) {
        return eventSnapshot.data();
    }
    return null;
}

export const createEvent = async () => { }

export const updateEvent = async () => { }

export const deleteEvent = async () => { }

