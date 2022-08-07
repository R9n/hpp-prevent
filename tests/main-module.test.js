const HppPrevent = require("../index");

describe("Main module", () => {
  it("Should return a correct parsed query object when any property is passed twice", () => {
    const request = {
      query: {
        id: [1, 2, 3],
        name: ["ronaldo", "ronaldo1"],
        lastName: "Modesto",
      },
    };
    const response = {
      status: (status) => {
        console.log("setando status da resposta", status);
        return {
          send: (message) => {
            console.log("enviando resposta com message", message);
            return this;
          },
        };
      },
    };

    const next = () => {
      return request;
    };

    const parsedRequest = HppPrevent.hppPrevent(request, response, next);

    expect(parsedRequest.query.id).toBe(3);
    expect(parsedRequest.query.name).toBe("ronaldo1");
    expect(parsedRequest.query.lastName).toBe("Modesto");
  });
});
