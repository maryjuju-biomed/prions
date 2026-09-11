const queue = [];
let busy = false;

export function enqueue(job) {
  queue.push(job);
  processQueue();
}

async function processQueue() {
  if (busy || queue.length === 0) return;
  busy = true;
  const current = queue.shift();

  try {
    current.onStatus('queued');
    current.onStatus('processing');
    const result = await current.handler();
    current.onComplete(result);
  } catch (error) {
    current.onError(error);
  } finally {
    busy = false;
    processQueue();
  }
}
