import { useFormValidation, switchHighLevelValidation } from "../validation";
import { renderHook, RenderHookResult } from "@testing-library/react-hooks";
import { FormValidation, FormValidationSchema } from "../types";
import { EnvironmentHandler } from "../environment";
import { ErrorsKit } from "../errors";
import Joi from "@hapi/joi";
import * as Yup from "yup";

type Flower = {
  name: string;
  color: string;
  petals: number;
};

const mockFlower: Flower = {
  name: "Orchid",
  color: "Purple",
  petals: 2,
};

const MOCK_SCHEMA_PETALS_ERROR: string = "A flower should have petals";

const mockSchema: FormValidationSchema<Flower> = {
  name: Yup.string().min(5),
  color: (f: Flower) => !!f.color,
  petals: (f: Flower) => f.petals > 0 || MOCK_SCHEMA_PETALS_ERROR,
};

const mockAltSchema: FormValidationSchema<Flower> = {
  ...(mockSchema as Joi.ObjectSchema),
  name: Joi.string().min(5),
};

describe("formook", () => {
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
      object: JSON.parse(JSON.stringify(mockFlower)),
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
    switchHighLevelValidation("joi");
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
    expect(rendered.result.current.errors.petals).toBe(
      MOCK_SCHEMA_PETALS_ERROR
    );
  });

  it("should throw an error for null return type", async () => {
    const rendered = renderHook(() =>
      useFormValidation(
        {
          ...mockSchema,
          name: () => null,
        },
        mockFlower
      )
    );
    await rendered.waitForNextUpdate();

    expect(ErrorsKit().lastError).toBe(
      "Return type for name should be a string or a boolean and is null"
    );
  });

  it("should throw a type mismatch error for joi high level schema", async () => {
    switchHighLevelValidation("joi");
    const rendered = renderHook(() =>
      useFormValidation(mockSchema, mockFlower)
    );
    await rendered.waitForNextUpdate();

    expect(ErrorsKit().lastError).toBe("Schema type mismatch : joi");
  });

  it("should throw a type mismatch error for yup high level schema", async () => {
    const rendered = renderHook(() =>
      useFormValidation(mockAltSchema, mockFlower)
    );
    await rendered.waitForNextUpdate();

    expect(ErrorsKit().lastError).toBe("Schema type mismatch : yup");
  });
});
