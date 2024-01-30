import { spawn } from "child_process";

async function start() {
  await execute("npx prisma migrate deploy");

  console.log("Starting the Trellix application...");
  await execute("NODE_ENV=production remix-serve ./build/server/index.js");
}

start();

async function execute(command) {
  const child = spawn(command, { shell: true, stdio: "inherit" });
  await new Promise((res, rej) => {
    child.on("exit", (code) => {
      if (code === 0) {
        res();
      } else {
        rej();
      }
    });
  });
}
