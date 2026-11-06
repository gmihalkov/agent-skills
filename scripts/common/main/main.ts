/** Body of an entry point: gets the command-line arguments, returns the exit code. */
type Handler = (args: readonly string[]) => Promise<number>;

/** Index of the first script argument in `Bun.argv`, after the Bun binary and the script path. */
const FIRST_ARG_INDEX = 2;

/** Exit code when the handler throws. */
const FAILURE_EXIT_CODE = 1;

/** Separator between an error message and the message of its cause. */
const CAUSE_SEPARATOR = ': ';

/**
 * Joins the message of an error with the messages of its causes.
 *
 * @param error - Thrown value.
 * @param seen - Errors already printed, so a cyclic cause chain stops.
 * @returns Messages from the outermost error to the root cause.
 */
const getErrorMessage = (error: unknown, seen: ReadonlySet<unknown> = new Set()): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  if (error.cause === undefined || error.cause === error || seen.has(error.cause)) {
    return error.message;
  }

  return `${error.message}${CAUSE_SEPARATOR}${getErrorMessage(error.cause, new Set([...seen, error]))}`;
};

/**
 * Runs the body of a script entry point; the only place where script errors are caught.
 *
 * @param handler - Body of the entry point.
 */
export const main = async (handler: Handler): Promise<void> => {
  const args = Bun.argv.slice(FIRST_ARG_INDEX);

  try {
    process.exitCode = await handler(args);
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exitCode = FAILURE_EXIT_CODE;
  }
};
