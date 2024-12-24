import { input } from "./input.ts";
import { sample } from "./sample.ts";

const r = (input: string) => {
  const connections = new Set(input.split("\n").map((pair) => pair.split("-").sort().join("-")).sort());
  const triplets: Set<string> = findLans(connections);
  console.log(
    triplets.keys().filter((key) => {
      return key.split("-").some((computer) => computer.startsWith("t"));
    }).toArray().length,
  );
  const largestCluster = findLans2(connections);
  console.log(largestCluster.keys().toArray().sort().join(","));
};

const findLans = (connections: Set<string>): Set<string> => {
  const triplets: Set<string> = new Set();
  connections.forEach((connection) => {
    const [a, b] = connection.split("-");
    connections.forEach((connection2) => {
      const [c, d] = connection2.split("-");
      if (b === c && connections.has([a, d].sort().join("-"))) {
        triplets.add([a, b, d].sort().join("-"));
      }
    });
  });
  return triplets;
};

const findLans2 = (connections: Set<string>) => {
  const lans: Set<string>[] = [];
  for (const connection of connections) {
    const [a, b] = connection.split("-");
    let found = false;
    for (const lan of lans) {
      if (lan.has(a) && lan.has(b)) {
        // found a cluster do nothing
      } else if (lan.has(a)) {
        if (lan.keys().filter((key) => key != a).every((key) => connections.has([key, b].sort().join("-")))) {
          lan.add(b);
          found = true;
        }
      } else if (lan.has(b)) {
        if (lan.keys().filter((key) => key != b).every((key) => connections.has([key, a].sort().join("-")))) {
          lan.add(a);
          found = true;
        }
      }
    }
    if (!found) {
      lans.push(new Set([a, b]));
    }
  }
  return lans.sort((a, b) => b.size - a.size)[0];
};

if (import.meta.main) {
  console.time();

  // r(sample);
  r(input);
  console.timeEnd();
}
