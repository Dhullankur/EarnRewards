import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../util/logger";

describe("logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes errors to the console and keeps an in-memory history", () => {
    logger.error("Data loading failed", { message: "Network failed" });

    expect(console.error).toHaveBeenCalledWith("[ERROR] Data loading failed", {
      message: "Network failed",
    });
    expect(logger.getLogs()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "error",
          message: "Data loading failed",
          meta: { message: "Network failed" },
        }),
      ]),
    );
  });
});
