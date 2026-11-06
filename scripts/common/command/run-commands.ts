import type { Command } from './command.ts';

/** Exit code of a successful command. */
const SUCCESS_EXIT_CODE = 0;

/** Exit code reported when any command failed. */
const FAILURE_EXIT_CODE = 1;

/**
 * Runs one command with the parent's standard streams and waits for it.
 *
 * @param command - Program and its arguments.
 * @returns The command's exit code.
 * @throws When the program cannot be started.
 */
const runCommand = async (command: Command): Promise<number> => {
  try {
    const subprocess = Bun.spawn([...command], { stdio: ['inherit', 'inherit', 'inherit'] });

    return await subprocess.exited;
  } catch (cause) {
    throw new Error(`Cannot run ${command[0]}`, { cause });
  }
};

/**
 * Runs every command in order, continuing after a failure.
 *
 * @param commands - Argument vectors to run.
 * @returns `0` if every command succeeded, otherwise `1`.
 * @throws When a program cannot be started.
 */
export const runCommands = async (commands: readonly Command[]): Promise<number> => {
  let exitCode = SUCCESS_EXIT_CODE;

  for (const command of commands) {
    const commandExitCode = await runCommand(command);

    if (commandExitCode !== SUCCESS_EXIT_CODE) {
      exitCode = FAILURE_EXIT_CODE;
    }
  }

  return exitCode;
};
