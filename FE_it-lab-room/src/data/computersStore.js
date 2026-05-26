import { computers } from "./mockData";

const STORAGE_KEY = "it_lab_room_computers";

export function getComputers() {
  const storedComputers = localStorage.getItem(STORAGE_KEY);

  if (!storedComputers) {
    return computers;
  }

  try {
    const parsedComputers = JSON.parse(storedComputers);
    return Array.isArray(parsedComputers) ? parsedComputers : computers;
  } catch {
    return computers;
  }
}

export function saveComputers(nextComputers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextComputers));
}

export function upsertComputer(computer) {
  const normalizedComputer = {
    ...computer,
    code: computer.code.trim().toUpperCase(),
    name: computer.name.trim(),
    room: computer.room,
    configId: Number(computer.configId),
    ip: computer.ip.trim(),
    mac: computer.mac.trim().toUpperCase(),
    status: computer.status,
  };
  const currentComputers = getComputers();
  const existedComputer = currentComputers.find((item) => item.id === normalizedComputer.id);
  const nextComputers = existedComputer
    ? currentComputers.map((item) => (item.id === normalizedComputer.id ? normalizedComputer : item))
    : [...currentComputers, { ...normalizedComputer, id: Date.now() }];

  saveComputers(nextComputers);
  return nextComputers;
}

export function deleteComputer(computerId) {
  const nextComputers = getComputers().filter((computer) => computer.id !== computerId);
  saveComputers(nextComputers);
  return nextComputers;
}
