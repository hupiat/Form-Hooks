import { useFormValidation, switchHighLevelValidation } from "../validation";
import {
  mockFlower,
  mockSchema,
  Flower,
  mockAltSchema,
  MOCK_SCHEMA_PETALS_ERROR,
} from "./mocks";
import { renderHook, RenderHookResult } from "@testing-library/react-hooks";
import { FormValidation } from "../types";
import _ from "lodash";
import { EnvironmentHandler } from "../environment";
import { ErrorsKit } from "../errors";

let container: HTMLDivElement | null;

beforeAll(() => {
  EnvironmentHandler().setEnv("test");
});

beforeEach(() => {
  switchHighLevelValidation("yup");
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container as HTMLDivElement);
  container = null;
});

const waitForResult = async (
  rendered: RenderHookResult<any, FormValidation<Flower>>
) => {
  await rendered.waitForNextUpdate();
  await rendered.waitForNextUpdate();
};

it("should be able to validate without errors", async () => {
  const expectation = async (
    rendered: RenderHookResult<unknown, FormValidation<Flower>>
  ) => {
    await rendered.wait(() => rendered.result.current.canValidate);
    expect(rendered.result.current.canValidate).toBeTruthy();
    expect(rendered.result.current.errors).toHaveLength(0);
  };

  // With a yup condition
  let rendered = renderHook(() => useFormValidation(mockSchema, mockFlower));
  expectation(rendered);

  // With a joi condition
  switchHighLevelValidation("joi");
  rendered.rerender({
    schema: mockAltSchema,
    object: _.cloneDeep(mockFlower),
  });
  expectation(rendered);
});

it("should be blocked by yup", async () => {
  const rendered = renderHook(() =>
    useFormValidation(mockSchema, {
      ...mockFlower,
      name: "",
    })
  );
  await waitForResult(rendered);

  expect(rendered.result.current.canValidate).toBeFalsy();
  expect(rendered.result.current.errors.name).toBeDefined();
});

it("should be blocked by joi", async () => {
  const rendered = renderHook(() =>
    useFormValidation(mockAltSchema, {
      ...mockFlower,
      name: "",
    })
  );
  await waitForResult(rendered);

  expect(rendered.result.current.canValidate).toBeFalsy();
  expect(Object.keys(rendered.result.current.errors)).toHaveLength(1);
});

it("should be blocked by a function", async () => {
  const rendered = renderHook(() =>
    useFormValidation(mockSchema, {
      ...mockFlower,
      petals: -1,
    })
  );
  await waitForResult(rendered);

  expect(rendered.result.current.canValidate).toBeFalsy();
  expect(rendered.result.current.errors.petals).toBe(MOCK_SCHEMA_PETALS_ERROR);
});

it("should throw a type mismatch error for high level schema", async () => {
  switchHighLevelValidation("joi");
  const rendered = renderHook(() => useFormValidation(mockSchema, mockFlower));
  await rendered.waitForNextUpdate();

  expect(ErrorsKit().lastError).toBe("Schema type mismatch : joi");
});
