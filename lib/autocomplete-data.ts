export interface BrandItem {
  name: string;
  type: "car" | "motorcycle" | "both";
}

export const popularBrands: BrandItem[] = [
  { name: "Chevrolet", type: "car" },
  { name: "Fiat", type: "car" },
  { name: "Volkswagen", type: "car" },
  { name: "Hyundai", type: "car" },
  { name: "Toyota", type: "car" },
  { name: "Honda", type: "both" },
  { name: "Yamaha", type: "motorcycle" },
  { name: "Ford", type: "car" },
  { name: "Renault", type: "car" },
  { name: "Nissan", type: "car" },
  { name: "Jeep", type: "car" },
  { name: "Peugeot", type: "car" },
  { name: "Citroën", type: "car" },
  { name: "Suzuki", type: "both" },
  { name: "Shineray", type: "motorcycle" },
  { name: "BMW", type: "both" },
  { name: "Kawasaki", type: "motorcycle" },
  { name: "BYD", type: "car" },
  { name: "GWM", type: "car" },
  { name: "Caoa Chery", type: "car" },
  { name: "Mitsubishi", type: "car" },
  { name: "Royal Enfield", type: "motorcycle" },
  { name: "Triumph", type: "motorcycle" },
];

export const popularModelsByBrand: Record<string, { car?: string[]; motorcycle?: string[] }> = {
  Chevrolet: {
    car: ["Onix", "Prisma", "Tracker", "Spin", "Cruze", "Celta", "Classic", "Cobalt", "S10", "Montana"],
  },
  Fiat: {
    car: ["Mobi", "Argo", "Cronos", "Uno", "Palio", "Siena", "Pulse", "Fastback", "Toro", "Strada", "Fiorino"],
  },
  Volkswagen: {
    car: ["Gol", "Polo", "Virtus", "T-Cross", "Nivus", "Voyage", "Fox", "Up!", "Saveiro", "Jetta"],
  },
  Hyundai: {
    car: ["HB20", "HB20S", "Creta", "Tucson", "i30", "Elantra", "Santa Fe"],
  },
  Toyota: {
    car: ["Corolla", "Etios", "Etios Sedan", "Yaris", "Yaris Sedan", "Hilux", "SW4", "Corolla Cross"],
  },
  Honda: {
    car: ["Civic", "Fit", "City", "City Sedan", "HR-V", "WR-V", "CR-V"],
    motorcycle: ["CG 160 Titan", "CG 160 Fan", "CG 160 Start", "Biz 125", "Biz 110i", "Pop 110i", "CB 250F Twister", "CB 300F Twister", "NXR 160 Bros", "XRE 190", "XRE 300", "PCX 160", "Elite 125", "Sahara 300"],
  },
  Yamaha: {
    motorcycle: ["YBR 150 Factor", "Fazer 150", "Fazer 250", "FZ25", "Crosser 150", "NMAX 160", "Lander 250", "Fluo 125", "Neo 125", "R3"],
  },
  Ford: {
    car: ["Ka", "Ka Sedan", "Fiesta", "EcoSport", "Focus", "Ranger", "Territory"],
  },
  Renault: {
    car: ["Kwid", "Sandero", "Logan", "Duster", "Oroch", "Captur", "Kardian"],
  },
  Nissan: {
    car: ["Kicks", "Versa", "March", "Sentra", "Frontier"],
  },
  Jeep: {
    car: ["Renegade", "Compass", "Commander"],
  },
  Peugeot: {
    car: ["208", "2008", "308", "3008"],
  },
  Citroën: {
    car: ["C3", "C4 Cactus", "C3 Aircross", "C4 Lounge"],
  },
  Suzuki: {
    car: ["Jimny", "Vitara", "S-Cross"],
    motorcycle: ["Intruder 125", "Yes 125", "Burgman 125", "V-Strom 650", "GSX-S750"],
  },
  Shineray: {
    motorcycle: ["XY 50", "Jet 125", "Phoenix 50", "SHI 175", "Worker 125"],
  },
  BMW: {
    car: ["320i", "X1", "X3", "330e"],
    motorcycle: ["G 310 R", "G 310 GS", "F 750 GS", "F 850 GS", "R 1250 GS", "S 1000 RR"],
  },
  Kawasaki: {
    motorcycle: ["Ninja 400", "Z400", "Versys-X 300", "Ninja 650", "Z605"],
  },
  BYD: {
    car: ["Dolphin", "Song Plus", "Seal", "Yuan Plus", "Dolphin Mini"],
  },
  GWM: {
    car: ["Haval H6", "Ora 3"],
  },
  "Caoa Chery": {
    car: ["Tiggo 5X", "Tiggo 7", "Tiggo 8", "Arrizo 6"],
  },
  Mitsubishi: {
    car: ["L200 Triton", "ASX", "Eclipse Cross", "Outlander", "Pajero Sport"],
  },
  "Royal Enfield": {
    motorcycle: ["Meteor 350", "Classic 350", "Hunter 350", "Himalayan", "Interceptor 650"],
  },
  Triumph: {
    motorcycle: ["Tiger 900", "Tiger Sport 660", "Trident 660", "Street Triple 765", "Speed Twin 900"],
  },
};
