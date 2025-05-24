import { frameCounter } from "./main";

export function measureTime(unit, action) {
  let result; 
  const startTime = getTimestamp();
  result = action();
  const endTime = getTimestamp();
  if (someFrames()) console.log(`${unit}: ${endTime - startTime} ms`);
  return result; 
}

export async function measureTimeAsync(unit, action) {
  let result; 
  const startTime = getTimestamp();
  result = await action();
  const endTime = getTimestamp();
  if (someFrames()) console.log(`${unit}: ${endTime - startTime} ms`);
  return result; 
}

export function getTimestamp() {
  let d = new Date();
  return d.getTime();
}

export function someFrames(messageGenerator) {
  const shouldLog = frameCounter % 100 === 0; 
  if (shouldLog && messageGenerator) {
    console.log(messageGenerator());
  }
  return shouldLog;
}
