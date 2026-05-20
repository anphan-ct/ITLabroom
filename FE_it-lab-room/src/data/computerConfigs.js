export const computerConfigs = [
  {
    id: 1,
    code: "CFG01",
    cpu: "Intel Core i5-10400",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Intel UHD Graphics",
    monitor: '22"',
    os: "Windows 10",
    status: "Đang dùng",
  },
  {
    id: 2,
    code: "CFG02",
    cpu: "Intel Core i7-10700",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    gpu: "GTX 1650",
    monitor: '24"',
    os: "Windows 11",
    status: "Đang dùng",
  },
  {
    id: 3,
    code: "CFG03",
    cpu: "AMD Ryzen 5 5600G",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Radeon Graphics",
    monitor: '22"',
    os: "Ubuntu 22.04",
    status: "Ngừng dùng",
  },
];

export function getComputerConfig(computer) {
  const configIndex = Number(computer.id - 1) % computerConfigs.length;

  return computerConfigs[configIndex];
}
