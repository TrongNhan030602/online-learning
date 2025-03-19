import Pusher from "pusher-js";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  encrypted: true,
});

export default pusher;
