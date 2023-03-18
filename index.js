const fs = require("fs");

switch (process.argv[2]) {
  case "setup":
    gitscSetup();
    break;

  case "u":
  case "use":
    useConfig();
    break;

  case "l":
  case "ls":
  case "list":
    listConfigs();
    break;

  default:
    console.log("Not a valid command...\n");
  case undefined:
  case "h":
  case "help":
    showHelp();
    break;
}

function gitscSetup() {
  console.log("Setting up GitSC");
  if (!process.env.HOME) {
    console.log("Please set the $HOME env variable");
    process.exit(-1);
  }

  fs.lstat(process.env.HOME + "/.config/git/config", (err, _) => {
    if (err && err.errno !== -2) {
      console.log("Error reading old git config");
      console.log(err);
      process.exit(-1);
    } else if (err && err.errno === -2) {
      // If git config doesn't exists ensure a default config and ~/.config/git exists
      fs.appendFileSync(__dirname + "/configs/default", "");
      fs.mkdirSync(process.env.HOME + "/.config/git", { recursive: true });
    } else {
      // Move old config to config.old and copy it to gitsc/configs/default
      fs.copyFileSync(
        process.env.HOME + "/.config/git/config",
        process.env.HOME + "/.config/git/config.old"
      );
      fs.rmSync(process.env.HOME + "/.config/git/config");
      try {
        fs.copyFileSync(
          process.env.HOME + "/.config/git/config.old",
          __dirname + "/configs/default"
        );
      } catch {}
    }
    fs.symlinkSync(
      __dirname + "/curconfig",
      process.env.HOME + "/.config/git/config"
    );
    console.log(
      "Successfully set up GitSC! Run 'gitsc use default' to use your old config."
    );
    console.log("Place new configs in the 'configs' folder.");
    console.log("See 'gitsc help' or read the README.md for more.");
  });
}

function useConfig() {
  if (process.argv.length <= 3) {
    console.log("Not enough arguments for this command");
    console.log("See 'gitsc help' for usage");
    process.exit(-1);
  }

  const configName = process.argv[3];
  fs.lstat(`${__dirname}/configs/${configName}`, (err, stats) => {
    if (err || !stats.isFile()) {
      console.log("Not a valid config. See 'gitsc list' for available configs");
      process.exit(-1);
    }

    // If curconfig file exists, remove it
    fs.rm(__dirname + "/curconfig", (err) => {
      // Error code -2 is ignored (File doesn't exist)
      if (err && !err.code === -2) {
        console.log("Couldn't remove curconfig file");
        console.log(err);
        process.exit(-1);
      }
      // Make symlink
      fs.symlink(
        `${__dirname}/configs/${configName}`,
        `${__dirname}/curconfig`,
        (err) => {
          if (err) {
            console.log("Couldn't make symlink to that config");
            console.log(err.message);
            process.exit(-1);
          } else {
            console.log(`Done. Using config: '${configName}'`);
          }
        }
      );
    });
  });
}

function listConfigs() {
  fs.readdir(
    __dirname + "/configs",
    { withFileTypes: true },
    (err, dirFiles) => {
      if (err) {
        console.log(
          "There was an error reading the '<INSTALDIR>/gitsc/configs' folder. (was it deleted?)"
        );
        console.log(err);
        process.exit(-1);
      }

      let files = dirFiles.filter((f) => f.isFile() && f.name !== ".gitkeep");

      console.log(`Configs (found ${files.length}):`);
      files.forEach((file, i) => {
        console.log(`${i + 1}: ${file.name}`);
      });
    }
  );
}

function showHelp() {
  console.log("GitSC usage:");
  console.log("\tgitsc help\r\t\t\t\tShow this help message (alias: gitsc h)");
  console.log("\tgitsc setup\r\t\t\t\tSetup GitSC. Should only be used once.");
  console.log(
    "\tgitsc list\r\t\t\t\tList available configs to pick from (aliases: gitsc [l, ls])"
  );
  console.log(
    "\tgitsc use [config]\r\t\t\t\tPick which config to use (alias: gitsc u)"
  );
}
