
import KeywordManager from './../db/keyword-manager';

ace.define("ace/mode/querybox_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(acequire, exports, module) {
  "use strict";

  var oop = acequire("../lib/oop");
  var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

  var SqlHighlightRules = function() {

    var keywords = KeywordManager.getKeywords().join("|");
    var builtinConstants = KeywordManager.getConstants().join("|");
    var builtinFunctions = KeywordManager.getFunctions().join("|");
    var dataTypes = KeywordManager.getTypes().join("|");

    var keywordMapper = this.createKeywordMapper({
      "support.function": builtinFunctions,
      "keyword": keywords,
      "constant.language": builtinConstants,
      "storage.type": dataTypes
    }, "identifier", true);

    this.$rules = {
      "start" : [ {
        token : "comment",
        regex : "--.*$"
      },  {
        token : "comment",
        start : "/\\*",
        end : "\\*/"
      }, {
        token : "string",           // " string
        regex : '".*?"'
      }, {
        token : "string",           // ' string
        regex : "'.*?'"
      }, {
        token : "constant.numeric", // float
        regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      }, {
        token : keywordMapper,
        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      }, {
        token : "keyword.operator",
        regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
      }, {
        token : "paren.lparen",
        regex : "[\\(]"
      }, {
        token : "paren.rparen",
        regex : "[\\)]"
      }, {
        token : "text",
        regex : "\\s+"
      } ]
    };
    this.normalizeRules();
  };

  oop.inherits(SqlHighlightRules, TextHighlightRules);

  exports.SqlHighlightRules = SqlHighlightRules;
});

ace.define("ace/mode/querybox",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/querybox_highlight_rules"], function(acequire, exports, module) {
  "use strict";

  var oop = acequire("../lib/oop");
  var TextMode = acequire("./text").Mode;
  var SqlHighlightRules = acequire("./querybox_highlight_rules").SqlHighlightRules;

  var Mode = function() {
    this.HighlightRules = SqlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function() {

    this.lineCommentStart = "--";

    this.$id = "ace/mode/querybox";
  }).call(Mode.prototype);

  exports.Mode = Mode;

});
