import { computers } from "./mockData";

const STORAGE_KEY = "it_lab_room_computers";

function normalizeComputer(computer) {
  return {
    ...computer,
    name: computer.name || computer.code,
    position: computer.position || "",
    cpu: computer.cpu || "",
    ram: computer.ram || "",
    gpu: computer.gpu || "",
    mainboard: computer.mainboard || "",
    monitor: computer.monitor || "",
    keyboard: computer.keyboard || "",
    mouse: computer.mouse || "",
    hdd: computer.hdd || "",
    ssd: computer.ssd || "",
  };
}

export function getComputers() {
  const storedComputers = localStorage.getItem(STORAGE_KEY);

  if (!storedComputers) {
    return computers.map(normalizeComputer);
  }

  try {
    const parsedComputers = JSON.parse(storedComputers);
    return Array.isArray(parsedComputers) ? parsedComputers.map(normalizeComputer) : computers.map(normalizeComputer);
  } catch {
    return computers.map(normalizeComputer);
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
    position: computer.position?.trim() || "",
    cpu: computer.cpu?.trim() || "",
    ram: computer.ram?.trim() || "",
    gpu: computer.gpu?.trim() || "",
    mainboard: computer.mainboard?.trim() || "",
    monitor: computer.monitor?.trim() || "",
    keyboard: computer.keyboard?.trim() || "",
    mouse: computer.mouse?.trim() || "",
    hdd: computer.hdd?.trim() || "",
    ssd: computer.ssd?.trim() || "",
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
