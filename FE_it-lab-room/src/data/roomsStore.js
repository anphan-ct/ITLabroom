import { rooms } from "./mockData";

const STORAGE_KEY = "it_lab_room_rooms";

export function getRooms() {
  const storedRooms = localStorage.getItem(STORAGE_KEY);

  if (!storedRooms) {
    return rooms;
  }

  try {
    const parsedRooms = JSON.parse(storedRooms);
    return Array.isArray(parsedRooms) ? parsedRooms : rooms;
  } catch {
    return rooms;
  }
}

export function saveRooms(nextRooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRooms));
}

export function upsertRoom(room) {
  const normalizedRoom = {
    ...room,
    code: room.code.trim().toUpperCase(),
    name: room.name.trim(),
    location: room.location.trim(),
    computers: Number(room.computers),
    status: room.status,
  };
  const currentRooms = getRooms();
  const existedRoom = currentRooms.find((item) => item.id === normalizedRoom.id);
  const nextRooms = existedRoom
    ? currentRooms.map((item) => (item.id === normalizedRoom.id ? normalizedRoom : item))
    : [...currentRooms, { ...normalizedRoom, id: Date.now() }];

  saveRooms(nextRooms);
  return nextRooms;
}

export function updateRoomStatus(roomId, status) {
  const nextRooms = getRooms().map((room) => {
    return room.id === roomId ? { ...room, status } : room;
  });

  saveRooms(nextRooms);
  return nextRooms;
}

export function deleteRoom(roomId) {
  const nextRooms = getRooms().filter((room) => room.id !== roomId);
  saveRooms(nextRooms);
  return nextRooms;
}
