describe("Team", function() {
  var team;

  beforeEach(function() {
    team = new Football.Team("Redskins");
  });

  it("name returns name", function() {
    expect(team.name).toEqual("Redskins");
  });
});