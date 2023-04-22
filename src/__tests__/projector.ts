import path from "path";
import Projector from "../projector";

function getData() {
  return {
    projector: {
      "/": {
        foo: "bar1",
        fem: "is great",
      },
      "/foo": {
        foo: "baz",
        bar: "baz",
      },
      "/foo/bar": {
        foo: "bar3",
      },
      [__dirname as any]: {
        hey: "there",
      },
    },
  };
}

function getProjector(pwd: string, data = getData()): Projector {
  return new Projector({ args: [], config: "", operation: "Print", pwd }, data);
}

test("get all values", function () {
  const projector = getProjector("/foo/bar");

  expect(projector.getValues()).toEqual({
    fem: "is great",
    foo: "bar3",
    bar: "baz",
  });
});

test("get value", function () {
  let projector = getProjector("/foo/bar");

  expect(projector.getValue("foo")).toEqual("bar3"); // keep most recent value
  expect(projector.getValue("bar")).toEqual("baz");
  expect(projector.getValue("baz")).toEqual(undefined);

  projector = getProjector(__dirname);

  expect(projector.getValue("fem")).toEqual("is great"); // keep most recent value
  expect(projector.getValue("foo")).toEqual("bar1");
  expect(projector.getValue("hey")).toEqual("there");
});

test("set value", function () {
  const data = getData();
  let projector = getProjector("/foo/bar", data);
  projector.setValue("foo", "baz");

  expect(projector.getValue("foo")).toEqual("baz");
  projector.setValue("fem", "is awesome");

  expect(projector.getValue("fem")).toEqual("is awesome");

  projector = getProjector("/", data);

  expect(projector.getValue("fem")).toEqual("is great");
});

test("remove value", function () {
  const projector = getProjector("/foo/bar");

  projector.removeValue("fem");
  expect(projector.getValue("fem")).toBe("is great");

  projector.removeValue("foo");
  expect(projector.getValue("foo")).toBe("baz"); // removes foo from `/foo/bar`, so it will find foo at `/foo`
});
