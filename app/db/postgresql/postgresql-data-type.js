"use strict";

function PostgreSQLDataType() {

  return {
    1082 : "date",
    1114 : "timestampWithoutTimezone",
    1184 : "timestamp"
  }

}

module.exports = new PostgreSQLDataType();
