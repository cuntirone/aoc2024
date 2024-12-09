import { input } from "./input.ts";
import { sample } from "./sample.ts";

type MFT = { address: number; fileName: number; size: number }[];
const r = (input: string) => {
  // 10k files
  const mft = loadMft(input);
  //   console.table(mft);
  //   compact(mft);
  defrag(mft);
  //   console.table(mft);
  console.log(checkSum(mft));
};

const loadMft = (input: string) => {
  const mft: MFT = [];
  let fileName = 0;
  let address = 0;
  input.split("").forEach((bit, index) => {
    const size = parseInt(bit);
    if (index % 2 === 0) {
      // file
      mft.push({ address, fileName, size });
      fileName++;
    } else {
      // free space
      mft.push({ address, fileName: -1, size });
    }
    address += size;
  });
  return mft;
};

const compact = (mft: MFT) => {
  let space = freeSpace(mft);
  let last = mft[mft.length - 1];
  let readHead = 0;
  while (space > 0) {
    if (last.fileName === -1) {
      // remove space from end of the drive
      space = space - last.size;
      mft.splice(-1);
      last = mft[mft.length - 1];
    } else {
      while (mft[readHead].fileName !== -1) {
        readHead++;
      }
      // found space
      const freeChunk = mft[readHead];
      if (last.size < freeChunk.size) {
        mft.splice(readHead, 0, { ...last, address: freeChunk.address });
        freeChunk.address = freeChunk.address + last.size;
        freeChunk.size = freeChunk.size - last.size;
        mft.splice(-1);
        space = space - last.size;
        readHead++;
        last = mft[mft.length - 1];
      } else {
        freeChunk.fileName = last.fileName;
        last.size = last.size - freeChunk.size;
        // if exact fit
        if (last.size === 0) {
          mft.splice(-1);
          last = mft[mft.length - 1];
        }
        space = space - freeChunk.size;
      }
    }
  }
};

const defrag = (mft: MFT) => {
  let readBack = mft.length - 1;
  let last = mft[readBack];
  const unavailableSizes: { [size: number]: number } = {};
  while (readBack) {
    if (last.fileName !== -1) {
      const someSpaceAt = mft.findIndex((record) => record.fileName === -1 && record.address < last.address && record.size >= last.size);
      if (someSpaceAt === -1) {
        unavailableSizes[last.size] = last.size;
      } else {
        const freeChunk = mft[someSpaceAt];
        mft.splice(someSpaceAt, 0, { ...last, address: freeChunk.address });
        last.fileName = -1;
        freeChunk.size = freeChunk.size - last.size;
        if (freeChunk.size === 0) {
          mft.splice(someSpaceAt + 1, 1);
          readBack--;
        } else {
          freeChunk.address = freeChunk.address + last.size;
        }
      }
    }
    readBack--;
    last = mft[readBack];
  }
};

const freeSpace = (mft: MFT) => {
  return mft.reduce((space, record) => space + (record.fileName === -1 ? record.size : 0), 0);
};

const printFile = (mft: MFT) => {
  let file = "";
  mft.forEach((record) => {
    if (record.fileName === -1) {
      file = file + ".".repeat(record.size);
    } else {
      file = file + (record.fileName.toString()).repeat(record.size);
    }
  });
  console.log(file);
};
const checkSum = (mft: MFT) => {
  let sum = 0;
  mft.forEach((record) => {
    if (record.fileName === -1) {
      return;
    }
    for (let i = 0; i < record.size; i++) {
      sum = sum + (record.address + i) * record.fileName;
    }
  });
  return sum;
};
if (import.meta.main) {
  console.time();
  r(input);
  console.timeEnd();
}
