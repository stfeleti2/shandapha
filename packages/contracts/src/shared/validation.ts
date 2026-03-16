export interface ContractIssue {
  path: string;
  message: string;
}

export type ContractValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      issues: ContractIssue[];
    };

export class ContractValidationError extends Error {
  readonly issues: ContractIssue[];

  constructor(contractName: string, issues: ContractIssue[]) {
    super(
      `${contractName} validation failed:\n${issues
        .map((issue) => `- ${issue.path}: ${issue.message}`)
        .join("\n")}`,
    );
    this.name = "ContractValidationError";
    this.issues = issues;
  }
}

export function addIssue(
  issues: ContractIssue[],
  path: string,
  message: string,
) {
  issues.push({ path, message });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function expectRecord(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (!isRecord(value)) {
    addIssue(issues, path, "Expected an object.");
    return undefined;
  }

  return value;
}

export function expectString(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (typeof value !== "string" || value.trim().length === 0) {
    addIssue(issues, path, "Expected a non-empty string.");
    return undefined;
  }

  return value;
}

export function expectOptionalString(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, path, issues);
}

export function expectBoolean(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (typeof value !== "boolean") {
    addIssue(issues, path, "Expected a boolean.");
    return undefined;
  }

  return value;
}

export function expectNumber(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    addIssue(issues, path, "Expected a number.");
    return undefined;
  }

  return value;
}

export function expectPositiveInteger(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  const parsed = expectNumber(value, path, issues);

  if (parsed === undefined) {
    return undefined;
  }

  if (!Number.isInteger(parsed) || parsed < 1) {
    addIssue(issues, path, "Expected a positive integer.");
    return undefined;
  }

  return parsed;
}

export function expectOptionalPositiveInteger(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (value === undefined) {
    return undefined;
  }

  return expectPositiveInteger(value, path, issues);
}

export function expectLiteral<T extends string | number | boolean>(
  value: unknown,
  expected: T,
  path: string,
  issues: ContractIssue[],
) {
  if (value !== expected) {
    addIssue(issues, path, `Expected literal value "${String(expected)}".`);
    return undefined;
  }

  return expected;
}

export function expectEnum<T extends readonly string[]>(
  value: unknown,
  options: T,
  path: string,
  issues: ContractIssue[],
) {
  if (typeof value !== "string" || !options.includes(value)) {
    addIssue(
      issues,
      path,
      `Expected one of: ${options.map((option) => `"${option}"`).join(", ")}.`,
    );
    return undefined;
  }

  return value as T[number];
}

export function expectStringArray(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "Expected an array.");
    return [];
  }

  const items: string[] = [];

  value.forEach((item, index) => {
    const parsed = expectString(item, `${path}[${index}]`, issues);

    if (parsed !== undefined) {
      items.push(parsed);
    }
  });

  return items;
}

export function expectOptionalStringArray(
  value: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (value === undefined) {
    return undefined;
  }

  return expectStringArray(value, path, issues);
}

export function expectArray<T>(
  value: unknown,
  path: string,
  issues: ContractIssue[],
  parseItem: (
    value: unknown,
    path: string,
    issues: ContractIssue[],
  ) => T | undefined,
) {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "Expected an array.");
    return [];
  }

  const items: T[] = [];

  value.forEach((item, index) => {
    const parsed = parseItem(item, `${path}[${index}]`, issues);

    if (parsed !== undefined) {
      items.push(parsed);
    }
  });

  return items;
}

export function createValidationResult<T>(
  data: T | undefined,
  issues: ContractIssue[],
): ContractValidationResult<T> {
  if (issues.length > 0 || data === undefined) {
    return {
      success: false,
      issues,
    };
  }

  return {
    success: true,
    data,
  };
}

export function assertValidationResult<T>(
  contractName: string,
  result: ContractValidationResult<T>,
) {
  if (result.success) {
    return result.data;
  }

  throw new ContractValidationError(contractName, result.issues);
}

export function cloneStringArray(value: readonly string[] = []) {
  return [...value];
}
