"use strict";

var expect = require("chai").expect;
var runViewer = require("../index");

describe("#runViewer", function() {
  it("should call viewer", function() {
    runViewer("I want to go [G]back to my lekua, [A7]Hawaii");
    // TODO: expect(method).to.have.been.called;
  });
});
