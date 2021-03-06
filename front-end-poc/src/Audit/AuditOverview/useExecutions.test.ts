import { renderHook } from "@testing-library/react-hooks";
import useExecutions from "./useExecutions";
import * as api from "../../Shared/api/audit.api";
import { act } from "react-test-renderer";

const flushPromises = () => new Promise(setImmediate);
const apiMock = jest.spyOn(api, "getExecutions");
beforeEach(() => {
  apiMock.mockClear();
});
describe("useExecutions", () => {
  it("returns a list of executions retrieved from APIs", async () => {
    const executionsResponse = {
      data: {
        total: 28,
        limit: 50,
        offset: 0,
        headers: [
          {
            executionId: "b2b0ed8d-c1e2-46b5-ad4f-3ac54ff4beae",
            executionDate: "2020-06-01T12:33:57+0000",
            executionSucceeded: true,
            executorName: "testUser",
            executedModelName: "LoanEligibility",
            executionType: "DECISION",
          },
          {
            executionId: "023a0d79-2be6-4ec8-9ef7-99a6796cb319",
            executionDate: "2020-06-01T12:33:57+0000",
            executionSucceeded: true,
            executorName: "testUser",
            executedModelName: "LoanEligibility",
            executionType: "DECISION",
          },
          {
            executionId: "3a5d4a4e-7c5a-4ce7-85de-6024fbf1da39",
            executionDate: "2020-06-01T12:33:56+0000",
            executionSucceeded: true,
            executorName: "testUser",
            executedModelName: "LoanEligibility",
            executionType: "DECISION",
          },
          {
            executionId: "a4e0b8e8-9a6d-4a8e-ad5a-54e5c654a248",
            executionDate: "2020-06-01T12:33:23+0000",
            executionSucceeded: true,
            executorName: "testUser",
            executedModelName: "fraud-scoring",
            executionType: "DECISION",
          },
          {
            executionId: "f08adc80-2c2d-43f4-801c-4f08e10820a0",
            executionDate: "2020-06-01T12:33:18+0000",
            executionSucceeded: true,
            executorName: "testUser",
            executedModelName: "fraud-scoring",
            executionType: "DECISION",
          },
        ],
      },
    };

    // @ts-ignore
    apiMock.mockImplementation(() => Promise.resolve(executionsResponse));
    const { result } = renderHook(() => useExecutions("", "", "", 10, 0));
    expect(result.current.executions).toStrictEqual({ status: "LOADING" });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.executions).toStrictEqual(Object.assign({ status: "SUCCESS" }, executionsResponse));
    expect(apiMock).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.loadExecutions();
    });

    expect(result.current.executions).toStrictEqual({ status: "LOADING" });
    await act(async () => {
      await flushPromises();
    });
    expect(result.current.executions).toStrictEqual(Object.assign({ status: "SUCCESS" }, executionsResponse));
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it("returns a loading error when APIs call fails", async () => {
    // @ts-ignore
    apiMock.mockImplementation(() => Promise.reject("error"));
    const { result } = renderHook(() => useExecutions("", "", "", 10, 0));
    expect(result.current.executions).toStrictEqual({ status: "LOADING" });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.executions).toStrictEqual(Object.assign({ error: "error", status: "FAILURE" }));
    expect(apiMock).toHaveBeenCalledTimes(1);
  });
});
