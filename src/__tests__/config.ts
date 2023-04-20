import getConfig from "../config";

test("simple print all", function () {
  const config = getConfig({});
  expect(config.operation).toEqual("Print");
  expect(config.args).toEqual([]);
});

test("print key", function () {
  const config = getConfig({ args: ["foo"] });
  expect(config.operation).toEqual("Print");
  expect(config.args).toEqual(["foo"]);
});

test("add key value pair", function () {
  const config = getConfig({ args: ["add", "foo", "bar"] });
  expect(config.operation).toEqual("Add");
  expect(config.args).toEqual(["foo", "bar"]);
});

test("remove a key", function () {
  const config = getConfig({ args: ["rm", "foo"] });
  expect(config.operation).toEqual("Remove");
  expect(config.args).toEqual(["foo"]);
});
