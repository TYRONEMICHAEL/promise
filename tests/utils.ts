import * as anchor from "@project-serum/anchor";
const envProvider = anchor.AnchorProvider.env();

if (!process.env.QUIET) {
  const logListener = envProvider.connection.onLogs("all", (log) =>
    console.log(log.logs)
  );

  after("Remove log listener", () => {
    envProvider.connection.removeOnLogsListener(logListener);
  });
}