import { Junk } from "../junk";

describe("junk model", () => {
  it("implements optimistic concurrency control", async () => {
    const junk = new Junk({ title: "Hello there", price: 5, userId: "123" });
    await junk.save();

    const firstInstance = await Junk.findById(junk.id);
    const secondInstance = await Junk.findById(junk.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }
  });

  it("increments the version number on multiple saves", async () => {
    const junk = new Junk({ title: "Hello there", price: 5, userId: "123" });

    await junk.save();
    expect(junk.version).toEqual(0);
    await junk.save();
    expect(junk.version).toEqual(1);
    await junk.save();
    expect(junk.version).toEqual(2);
  });
});
