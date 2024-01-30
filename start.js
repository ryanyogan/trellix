import { spawn } from "child_process";
import { getInstanceInfo } from "litefs-js";

async function start() {
  let { currentIsPrimary, currentInstance, primaryInstance } =
    await getInstanceInfo();

  if (currentIsPrimary) {
    console.log(
      `Instance (${currentInstance}) in ${process.env.FLY_REGION} is primary. Deploying migrations.`,
    );
    await execute("npx prisma migrate deploy");
  } else {
    console.log(
      `Instance (${currentInstance}) in ${process.env.FLY_REGION} is not primary (the primary instance is ${primaryInstance}). Skipping migrations.`,
    );
  }

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
