jest.mock("common", () => {
  const original = jest.requireActual("common");
  return {
    __esmodule: true,
    ...original,
    natsWrapper: {
      client: {
        publish: jest
          .fn()
          .mockImplementation(
            (subject: string, data: string, callback: () => void) => {
              callback();
            }
          ),
      },
    },
  };
});

beforeEach(async () => {
  jest.clearAllMocks();
});
