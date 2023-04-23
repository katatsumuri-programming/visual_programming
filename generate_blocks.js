var function_list = []
var code_raw = "";
function exception_block(ast_json) {
    console.log(ast_json.start)
    console.log(ast_json.end)
    const clip_code = code_raw.substring(ast_json.start, ast_json.end)
    console.log(clip_code)
    const parse_code_xml = parseCode(clip_code)
    const serializer = new XMLSerializer()
    const xml_string = serializer.serializeToString(parse_code_xml)
    const resultJson = JSON.parse(xml2json(xml_string, { compact: true }));
    console.log(resultJson)
    json_block = resultJson["xml"]["block"]
    return json_block;
}

function generate_block_json(ast_json, isstatement=false) {
    var json_block = {};
    var type = "undefined"
    var isreturn = true;
    console.log(ast_json)
    if (ast_json){
        switch (ast_json.type) {
            case "VariableDeclaration":
                break;
            case "LogicalExpression":
                var a_input = generate_block_json(ast_json.left)["block"];
                var b_input = generate_block_json(ast_json.right)["block"];
                var op;
                switch (ast_json.operator) {
                    case "&&":
                        op = "AND"
                        break;
                    case "||":
                        op = "OR"
                        break;
                    default:
                        op = "AND"
                        break;
                }
                json_block = {
                    "_attributes": {
                        "type":"logic_operation",
                    },
                    "field":{
                        "_attributes": {
                            "name": "OP"
                        },
                        "_text":op
                    },
                    "value":[
                        {
                            "_attributes": {
                                "name":"A",
                            },
                            "block":a_input,
                        },
                        {
                            "_attributes": {
                                "name":"B",
                            },
                            "block":b_input,
                        }
                    ]
                }
                type = "bool"
                break;
            case "BinaryExpression":

                var a_input = generate_block_json(ast_json.left)["block"];
                var b_input = generate_block_json(ast_json.right)["block"];
                var op;
                var type;
                switch (ast_json.operator) {
                    case "+":
                        op = "ADD";
                        type = "math_arithmetic";
                        break;
                    case "-":
                        op = "MINUS"
                        type = "math_arithmetic";
                        break;
                    case "*":
                        op = "MULTIPLY"
                        type = "math_arithmetic";
                        break;
                    case "/":
                        op = "DIVIDE"
                        type = "math_arithmetic";
                        break;
                    case "%":
                        op = "DIVIDE"
                        type = "math_arithmetic";
                        break;
                    case "==":
                        op = "EQ"
                        type = "logic_compare";
                        break;
                    case "<=":
                        op = "LTE"
                        type = "logic_compare";
                        break;
                    case ">=":
                        op = "GTE"
                        type = "logic_compare";
                        break;
                    case "!=":
                        op = "NEQ"
                        type = "logic_compare";
                        break;
                    case "<":
                        op = "LT"
                        type = "logic_compare";
                        break;
                    case ">":
                        op = "GT"
                        type = "logic_compare";
                        break;
                    default:
                        throw new Error("exceptional block");
                        break;
                }
                if (ast_json.operator == "%") {
                    json_block = {
                        "_attributes": {
                            "type":"math_modulo"
                        },
                        "value":[
                            {
                                "_attributes": {
                                    "name":"DIVIDEND"
                                },
                                "block":a_input,
                            },
                            {
                                "_attributes": {
                                    "name":"DIVISOR"
                                },
                                "block":b_input,
                            }

                        ]
                    }
                    type = "int"
                } else {
                    if (op == "ADD" && generate_block_json(ast_json.left)["type"] == "string" && generate_block_json(ast_json.left)["type"] == "string") {
                        json_block= {
                            "_attributes": {
                                "type":"text_join",
                            },
                            "mutation": {
                                "_attributes": {
                                    "items":2,
                                },
                            },
                            "value":[
                                {
                                    "_attributes": {
                                        "name": "ADD0",
                                    },
                                    "block": a_input
                                },
                                {
                                    "_attributes": {
                                        "name": "ADD1",
                                    },
                                    "block": b_input
                                }
                            ]
                        }
                        type = "string"
                    } else {
                        json_block = {
                            "_attributes": {
                                "type":type,
                            },
                            "field":{
                                "_attributes": {
                                    "name": "OP"
                                },
                                "_text":op
                            },
                            "value":[
                                {
                                    "_attributes": {
                                        "name": "A",
                                    },
                                    "block": a_input
                                },
                                {
                                    "_attributes": {
                                        "name": "B",
                                    },
                                    "block": b_input
                                }
                            ]
                        }
                        type = "int"
                    }

                }
                break;
            case "CallExpression":
                    if (ast_json.callee.name == "output") {
                        try {
                            json_block = {
                                "_attributes": {
                                    "type": "output",
                                },
                                "value": {
                                    "_attributes": {
                                        "name": "output",
                                    },
                                    "block":generate_block_json(ast_json.arguments[0])["block"],

                                }
                            }
                        } catch (e) {
                            json_block = exception_block(ast_json)
                            isreturn = false;
                        }
                        isreturn = false;
                    } else if (typeof ast_json.callee.property != "undefined"){
                        if (ast_json.callee.property.name === "prompt" && ast_json.callee.object.name == "window"){
                            json_block = {
                                "_attributes": {
                                    "type": "text_prompt_ext",
                                },
                                "mutation": {
                                    "_attributes": {"type": "TEXT"}
                                },
                                "field": {
                                    "_attributes": {"name": "TYPE"},
                                    "_text": "TEXT"
                                },
                                "value": {
                                    "_attributes": {"name": "TEXT"},
                                    "block":generate_block_json(ast_json.arguments[0])["block"]
                                }
                            }
                        } else if (ast_json.callee.property.name == "indexOf" || ast_json.callee.property.name == "lastIndexOf") {
                            type = "int"
                            switch (ast_json.callee.property.name) {
                                case "indexOf":
                                    var field_txt = "FIRST";
                                    break;
                                case "lastIndexOf":
                                    var field_txt = "LAST";
                                    break;
                            }
                            if (generate_block_json(ast_json.callee.object)["type"] == "string") {
                                var block_type = "text_indexOf"
                            } else {
                                var block_type = "lists_indexOf"
                            }
                            json_block = {
                                "_attributes": {"type": "math_arithmetic"},
                                "field":{"_attributes": {"name":"OP"},"_text":"MINUS"},
                                "value":[
                                    {
                                        "_attributes": {"name": "A"},
                                        "block":{
                                            "_attributes": {"type": block_type},
                                            "fields": {"_attributes": {"name": "END"},"_text": field_txt},
                                            "value": [
                                                {
                                                    "_attributes": {"name": "VALUE"},
                                                    "block":generate_block_json(ast_json.callee.object)["block"]
                                                },
                                                {
                                                    "_attributes": {"name": "FIND"},
                                                    "block":generate_block_json(ast_json.arguments[0])["block"]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "_attributes": {"name": "B"},
                                        "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                                    }
                                ],
                            }

                        } else if (ast_json.callee.property.name == "charAt") {
                            type = "string"
                            // ast_json.arguments[0].value++;
                            json_block = {
                                "_attributes": {"type": "text_chartAt"},
                                "mutation":{"_attributes": {"at": "true"},},
                                "field": {"_attributes": {"name": "WHERE"},"_text": 'FROM_START'},
                                "value": [
                                    {
                                        "_attributes": {"name": "VALUE"},
                                        "block":generate_block_json(ast_json.callee.object)["block"]
                                    },
                                    {
                                        "_attributes": {"name": "AT"},
                                        "block": {
                                            "_attributes": {"type": "math_arithmetic"},
                                            "field":{"_attributes": {"name":"OP"},"_text":"ADD"},
                                            "value":[
                                                {
                                                    "_attributes": {"name": "A"},
                                                    "block":generate_block_json(ast_json.arguments[0])["block"]

                                                },
                                                {
                                                    "_attributes": {"name": "B"},
                                                    "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                                                }
                                            ]
                                        }
                                    }

                                ]
                            }
                        } else if (ast_json.callee.property.name == "slice") {
                            type = "string";
                            var at2_block;
                            if (ast_json.arguments.length == 1) {
                                at2_block = {"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                            } else {
                                at2_block = generate_block_json(ast_json.arguments[1])["block"]
                            }
                            json_block = {
                                "_attributes": {"type": "text_getSubstring"},
                                "mutation": {"_attributes": {"at1": "true", "at2": "true"}},
                                "field": [{"_attributes": {"name": "WHERE1"},"_text": 'FROM_START'},{"_attributes": {"name": "WHERE2"}, "_text": 'FROM_START'}],
                                "value": [
                                    {
                                        "_attributes": {"name": "STRING"},
                                        "block": generate_block_json(ast_json.callee.object)["block"],
                                    },
                                    {
                                        "_attributes": {"name": "AT1"},
                                        "block": {
                                            "_attributes": {"type": "math_arithmetic"},
                                            "field": {"_attributes": {"name": "OP"},"_text":"ADD"},
                                            "value": [
                                                {
                                                    "_attributes": {"name": "A"},
                                                    "block":generate_block_json(ast_json.arguments[0])["block"]
                                                },
                                                {
                                                    "_attributes": {"name": "B"},
                                                    "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "_attributes": {"name": "AT2"},
                                        "block":at2_block
                                    }
                                ]

                            }
                        } else if (ast_json.callee.property.name == "toUpperCase") {
                            type = "string"
                            json_block = {
                                "_attributes": {"type": "text_changeCase"},
                                "field": {"_attributes": {"name": "CASE"},"_text": 'UPPERCASE'},
                                "value": {
                                    "_attributes": {"name": "TEXT"},
                                    "block":generate_block_json(ast_json.callee.object)["block"]
                                }
                            }
                        } else if (ast_json.callee.property.name == "toLowerCase") {
                            type = "string"
                            json_block = {
                                "_attributes": {"type": "text_changeCase"},
                                "field": {"_attributes": {"name": "CASE"},"_text": 'LOWERCASE'},
                                "value": {
                                    "_attributes": {"name": "TEXT"},
                                    "block":generate_block_json(ast_json.callee.object)["block"]
                                }
                            }
                        } else if (ast_json.callee.property.name == "split") {
                            json_block = {
                                "_attributes": {"type": "lists_split"},
                                "mutation": {"_attributes": {"mode": "SPLIT"},},
                                "field": {"_attributes": {"name": "MODE"},"_text":"SPLIT"},
                                "value": [
                                    {"_attributes": {"name": "INPUT"},"block":generate_block_json(ast_json.callee.object)["block"]},
                                    {"_attributes": {"name": "DELIM"},"block":generate_block_json(ast_json.arguments[0])["block"]}
                                ]
                            }
                        } else if (ast_json.callee.property.name == "join") {
                            type = "string";
                            json_block = {
                                "_attributes": {"type": "lists_split"},
                                "mutation": {"_attributes": {"mode": "JOIN"},},
                                "field": {"_attributes": {"name": "MODE"},"_text":"JOIN"},
                                "value": [
                                    {"_attributes": {"name": "INPUT"},"block":generate_block_json(ast_json.callee.object)["block"]},
                                    {"_attributes": {"name": "DELIM"},"block":generate_block_json(ast_json.arguments[0])["block"]}
                                ]
                            }
                        } else if (ast_json.callee.property.name == "reverse") {
                            json_block = {
                                "_attributes": {"type": "lists_reverse"},
                                "value": {"_attributes": {"name": "LIST"},"block":generate_block_json(ast_json.callee.object)["block"]}
                            }
                        } else {
                            throw new Error("exceptional block")
                        }
                    } else {
                        var issetfunction = false;
                        var params = []
                        var arg = []
                        for (var i = 0; i < function_list.length; i++) {
                            if (function_list[i].id.name == ast_json.callee.name) {
                                issetfunction = true
                                for (var j = 0; j < function_list[i].params.length; j++) {
                                    params.push({
                                        "_attributes": {"name": function_list[i].params[j].name}
                                    })
                                }
                            }
                        }
                        if (issetfunction) {


                                if (isstatement) {
                                    try {
                                        for (var i = 0; i < ast_json.arguments.length; i++) {
                                            arg.push({
                                                "_attributes": {"name": "ARG"+i},
                                                "block": generate_block_json(ast_json.arguments[i])["block"]
                                            })
                                        }
                                        json_block = {
                                            "_attributes": {"type": "procedures_callnoreturn"},
                                            "mutation": {
                                                "_attributes": {"name": ast_json.callee.name},
                                                "arg": params
                                            },
                                            "value": arg
                                        }
                                    } catch (e) {
                                        json_block = exception_block(ast_json)
                                        isreturn = false;
                                    }
                                } else {
                                    for (var i = 0; i < ast_json.arguments.length; i++) {
                                        arg.push({
                                            "_attributes": {"name": "ARG"+i},
                                            "block": generate_block_json(ast_json.arguments[i])["block"]
                                        })
                                    }
                                    json_block = {
                                        "_attributes": {"type": "procedures_callreturn"},
                                        "mutation": {
                                            "_attributes": {"name": ast_json.callee.name},
                                            "arg": params
                                        },
                                        "value": arg
                                    }
                                }

                        } else {
                            throw new Error("exceptional block");
                        }
                        isreturn = false;
                    }

                break;
            case "MemberExpression":
                if (ast_json.object.name == "Math") {
                    if (ast_json.property.name == "PI" || ast_json.property.name == "E" || ast_json.property.name == "SQRT2" || ast_json.property.name == "SQRT1_2") {
                        type = "int"
                        json_block = {
                            "_attributes": {"type": "math_constant"},
                            "field": {
                                "_attributes": {"name": "CONSTANT"},
                                "_text": String(ast_json.property.name).toUpperCase()
                            }
                        }
                    }
                } else if (ast_json.property.name == "length") {
                    type = "int"
                    if (generate_block_json(ast_json.object)["type"] == "string") {
                        json_block = {
                            "_attributes": {"type": "text_length"},
                            "value": {
                                "_attributes": {"name": "VALUE"},
                                "block":generate_block_json(ast_json.object)["block"]
                            }
                        }
                    } else {
                        json_block = {
                            "_attributes": {"type": "lists_length"},
                            "value": {
                                "_attributes": {"name": "VALUE"},
                                "block":generate_block_json(ast_json.object)["block"]
                            }
                        }
                    }
                } else if (generate_block_json(ast_json.property)["type"] != "string") {

                    json_block = {
                        "_attributes": {"type": "lists_getIndex"},
                        "mutation":{"_attributes": {"statement": "false", "at":"true"},},
                        "field":[
                            {"_attributes": {"name": "MODE"},"_text":"GET"},
                            {"_attributes": {"name": "WHERE"},"_text":"FROM_START"}
                        ],
                        "value": [
                            {
                                "_attributes": {"name": "VALUE"},
                                "block": generate_block_json(ast_json.object)["block"]
                            },
                            {
                                "_attributes": {"name": "AT"},
                                "block": {
                                    "_attributes": {"type": "math_arithmetic"},
                                    "field": {"_attributes": {"name": "OP"},"_text":"ADD"},
                                    "value":[
                                        {
                                            "_attributes": {"name": "A"},
                                            "block":generate_block_json(ast_json.property)["block"]
                                        },
                                        {
                                            "_attributes": {"name": "B"},
                                            "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                } else {
                    throw new Error("exceptional block");
                }

                break;
            case "ExpressionStatement":
                if (ast_json.expression.name == "Infinity") {
                    type = "int"
                    json_block = {
                        "_attributes": {"type": "math_constant"},
                        "field": {
                            "_attributes": {"name": "CONSTANT"},
                            "_text": "INFINITY"
                        }
                    }
                } else {
                    type = generate_block_json(ast_json.expression)["type"]
                    json_block = generate_block_json(ast_json.expression)["block"];
                    isreturn = generate_block_json(ast_json.expression)["return"];
                }
                break;
            case "UnaryExpression":
                if (ast_json.operator == "!") {
                    type = "bool"
                    var bool = generate_block_json(ast_json.argument)["block"];
                    console.log(bool)
                    json_block = {
                        "_attributes": {"type": "logic_negate"},
                        "value":{
                            "_attributes": {"name": "BOOL"},
                            "block":bool
                        }
                    }
                } else if (ast_json.operator == "-") {
                    type = "int"
                    ast_json.argument.value = ast_json.argument.value*-1;
                    json_block = {
                        "_attributes": {"type": "math_arithmetic"},
                        "field": {"_attributes": {"name": "OP"},"_text":"MULTIPLY"},
                        "value": [
                            {
                                "_attributes": {"name": "A"},
                                "block":generate_block_json(ast_json.argument)["block"]
                            },
                            {
                                "_attributes": {"name": "B"},
                                "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":-1}}
                            }
                        ]
                    }

                } else {
                    throw new Error("exceptional block");
                }
                break;
            case "AssignmentExpression":
                if (ast_json.operator == "=") {
                    if (typeof ast_json.left.name != "undefined") {
                        json_block = {
                            "_attributes": {"type": "variables_set"},
                            "field": {
                                "_attributes": {"name": "VAR"},
                                "_text": ast_json.left.name
                            },
                            "value": {
                                "_attributes": {"name": "VALUE"},
                                "block": generate_block_json(ast_json.right)["block"]
                            }
                        }
                        isreturn = false;
                    } else {
                        console.log(generate_block_json(ast_json.left.property).type)
                        if (generate_block_json(ast_json.left.property).type != "string") {
                            json_block = {
                                "_attributes": {"type": "lists_setIndex"},
                                "mutation": {"_attributes": {"at": "false"}},
                                "field": [
                                    {"_attributes": {"name": "MODE"},"_text": "SET"},
                                    {"_attributes": {"name": "WHERE"},"_text": "FROM_START"}
                                ],
                                "value": [
                                    {
                                        "_attributes": {"name": "LIST"},
                                        "block": generate_block_json(ast_json.left.object)["block"]
                                    },
                                    {
                                        "_attributes": {"name": "AT"},
                                        "block": {
                                            "_attributes": {"type": "math_arithmetic"},
                                            "field": {"_attributes": {"name": "OP"},"_text":"ADD"},
                                            "value": [
                                                {"_attributes": {"name": "A"},"block":generate_block_json(ast_json.left.property)["block"]},
                                                {"_attributes": {"name": "B"},"block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}}
                                            ]
                                        }
                                    },
                                    {
                                        "_attributes": {"name": "TO"},
                                        "block": generate_block_json(ast_json.right)["block"]
                                    }
                                ]
                            }
                            isreturn = false;
                        }
                    }
                } else if (ast_json.operator == "+=") {
                    json_block = {
                        "_attributes": {"type": "math_change"},
                        "field": {
                            "_attributes": {"name": "VAR"},
                            "_text": ast_json.left.name
                        },
                        "value": {
                            "_attributes": {"name": "DELTA"},
                            "block": generate_block_json(ast_json.right)["block"]
                        }
                    }
                    isreturn = false;
                } else if (ast_json.operator == "-=") {
                    ast_json.right.value = ast_json.right.value * -1

                    json_block = {
                        "type": "math_change",
                        "fields": {
                            "VAR": {"id":ast_json.left.name}
                        },
                        "inputs": {
                            "_attributes": {"name": "DELTA"},
                            "block": {
                                "_attributes": {"type": "math_arithmetic"},
                                "field": {"_attributes": {"name": "OP"},"_text":"MULTIPLY"},
                                "value": [
                                    {
                                        "_attributes": {"name": "A"},
                                        "block":generate_block_json(ast_json.right)["block"]
                                    },
                                    {
                                        "_attributes": {"name": "B"},
                                        "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":-1}}
                                    }
                                ]
                            }

                        }
                    }
                    isreturn = false
                } else {
                    throw new Error("exceptional block");
                }

                break;
            case "UpdateExpression":
                var num;
                switch (ast_json.operator) {
                    case "++":
                        num = 1
                        break;

                    default:
                        num = ast_json.right.value
                        break;
                }
                json_block = {
                    "_attributes": {"type": "math_number"},
                    "field":{
                        "_attributes": {"name": "NUM"},
                        "_text":num
                    }
                }
                break;
            case "Literal":
                var type;
                var fields_type;
                var value;
                switch (typeof ast_json.value) {
                    case "number":
                        type = "math_number";
                        fields_type = "NUM";
                        value = ast_json.value;
                        break;
                    case "string":
                        type = "text";
                        fields_type = "TEXT";
                        value = ast_json.value;
                        break;
                    case "boolean":
                        type = "logic_boolean";
                        fields_type = "BOOL";
                        value = String(ast_json.value).toUpperCase();
                        break;
                    default:
                        throw new Error("exceptional block");
                        break;

                }
                json_block = {
                    "_attributes": {"type": type},
                    "field": {
                        "_attributes": {"name": fields_type},
                        "_text": value
                    }
                }
                break;
            case "BlockStatement":
                json_block = {};
                for (var i = 0; i < ast_json.body.length; i++) {
                    if (i > 0) {
                        block_and_next = generate_block_json(ast_json.body[ast_json.body.length - 1 - i], true)["block"]
                        block_and_next["next"] = json_block
                        json_block = {
                            "block":block_and_next,
                        }
                        console.log(json_block)
                    } else {

                        json_block = {
                            "block":generate_block_json(ast_json.body[ast_json.body.length - 1 - i], true)["block"]
                        }
                        console.log(json_block)
                    }
                }


                break;

            case "WhileStatement":
                try {
                    var bool = generate_block_json(ast_json.test)["block"];
                    var do_block = generate_block_json(ast_json.body, true)["block"];
                    json_block = {
                        "_attributes": {"type": "controls_whileUntil"},
                        "field": {
                            "_attributes": {"name": "MODE"},
                            "_text": "WHILE"
                        },
                        "value": {
                            "_attributes": {"name": "BOOL"},
                            "block":bool,
                        },
                        "statement": {
                            "_attributes": {"name": "DO"},
                            "block":do_block["block"],
                        }
                    }
                    if (typeof do_block["next"] != "undefined") {json_block["statement"]["next"] = do_block["next"]}

                } catch (e) {
                    json_block = exception_block(ast_json)

                }
                isreturn = false;
                break;
            case "ForStatement":
                try {
                    if (ast_json.test.operator == "<") {
                        var to_block = {
                            "_attributes": {"type": "math_arithmetic"},
                            "field": {"_attributes": {"name": "OP"},"_text":"MINUS"},
                            "value": [
                                {
                                    "_attributes": {"name": "A"},
                                    "block": generate_block_json(ast_json.test.right)["block"]
                                },
                                {
                                    "_attributes": {"name": "B"},
                                    "block":{"_attributes": {"type": "math_number"},"field":{"_attributes": {"name": "NUM"}, "_text":1}}
                                }
                            ]
                        }
                    } else if (ast_json.test.operator == "<=") {
                        var to_block = generate_block_json(ast_json.test.right)["block"];
                    } else {
                        throw new Error("exceptional block");
                    }
                    var from_block = generate_block_json(ast_json.init.right)["block"];
                    var by_block = generate_block_json(ast_json.update)["block"];
                    var do_block = generate_block_json(ast_json.body, true)["block"];
                    json_block = {
                        "_attributes": {"type": "controls_for"},
                        "field": {
                            "_attributes": {"name": "VAR"},
                            "_text": ast_json.init.left.name
                        },
                        "value": [
                            {
                                "_attributes": {"name": "FROM"},
                                "block":from_block,
                            },
                            {
                                "_attributes": {"name": "TO"},
                                "block":to_block,
                            },
                            {
                                "_attributes": {"name": "BY"},
                                "block":by_block,
                            }
                        ],
                        "statement": {
                            "_attributes": {"name": "DO"},
                            "block": do_block["block"]
                        }
                    }
                    if (typeof do_block["next"] != "undefined") {json_block["statement"]["next"] = do_block["next"]}

                } catch (e) {
                    json_block = exception_block(ast_json)

                }
                isreturn = false;
                break;
            case "IfStatement":
                try{

                    var if_count = 0;
                    var value = []
                    var statements = []
                    let current = ast_json;
                    while (current) {
                        if (typeof current.test != "undefined" && typeof current.consequent != "undefined") {
                            value.push({
                                "_attributes": {"name": "IF"+if_count},
                                "block":generate_block_json(current.test)["block"],
                            })
                            do_if = {
                                "_attributes": {"name": "DO"+if_count},
                                "block":generate_block_json(current.consequent, true)["block"]["block"],
                            }
                            if (typeof generate_block_json(current.consequent)["block"]["next"] != "undefined") {do_if["next"] = generate_block_json(current.consequent)["block"]["next"]}
                            statements.push(do_if)
                            current = current.alternate;
                            if_count++;
                        } else {
                            do_if = {
                                "_attributes": {"name": "ELSE"},
                                "block":generate_block_json(current.consequent, true)["block"]["block"],
                            }
                            if (typeof generate_block_json(current.consequent, true)["block"]["next"] != "undefined") {do_if["next"] = generate_block_json(current.consequent, true)["block"]["next"]}

                            statements.push(do_if)
                            current = current.alternate;
                        }
                    }
                    json_block = {
                        "_attributes": {"type": "controls_if"},
                        "value": value,
                        "statement": statements
                    }
                } catch (e) {
                    json_block = exception_block(ast_json)
                }
                isreturn = false;
                break;
            case "FunctionDeclaration":
                try {
                    var mutation = []
                    for (var i = 0; i < ast_json.params.length; i++) {
                        mutation.push({
                            "arg": {
                                "_attributes": {"name": ast_json.params[i].name},
                            }
                        })
                    }
                    json_block = {
                        "_attributes": {"type": "procedures_defnoreturn"},
                        "mutation": mutation,
                        "field": {
                            "_attributes": {"name": "NAME"},
                            "_text": ast_json.id.name
                        },
                        "statement": {
                            "_attributes": {"name": "STACK"},
                            "block":generate_block_json(ast_json.body, true)["block"]["block"]
                        }

                    }
                    function_list.push(ast_json)
                } catch (e) {
                    json_block = exception_block(ast_json)
                    isreturn = false;
                }
                break;

            case "Identifier":
                json_block = {
                    "_attributes": {"type": "variables_get"},
                    "field":{
                        "_attributes": {"name": "VAR"},
                        "_text": ast_json.name
                    }
                }
                break;
            case "ArrayExpression":
                if (ast_json.elements.length > 0) {
                    value = []
                    for (var i = 0; i < ast_json.elements.length; i++) {
                        value.push(generate_block_json(ast_json.elements[i])["block"])
                    }
                    json_block = {
                        "_attributes": {"type": "lists_create_with"},
                        "mutation": {
                            "_attributes": {"items": value.length},
                        },
                        "value": value
                    }
                } else {
                    json_block = {
                        "_attributes": {"type": "lists_create_empty"},
                    }
                }
            default:
                console.log(ast_json.type)
                json_block = exception_block(ast_json)
                isreturn = false;
                break;
        }

        console.log(json_block)
        return {"block": json_block, "type":type, "return":isreturn};
    }

}
function generateBlock(code) {
    code_raw = code;
    var ast = acorn.parse(code, {ecmaVersion: 8});
    var ast_json = JSON.parse(JSON.stringify(ast)).body;
    console.log(Blockly.serialization.workspaces.save(workspace))
    console.log(Blockly.Xml.workspaceToDom(workspace));
    console.log(ast_json)
    var blocks = []
    for (var i = 0; i < ast_json.length; i++) {
        var block = generate_block_json(ast_json[i], true)
        if (Object.keys(block).length > 0) {
            blocks.push(block)
            console.log(block)
            console.log(ast_json[i])
        }


        console.log("---------------------------------");
    }
    console.log(blocks)
    json_block = {};
    result_json = {}
    function_results = []
    for (var i = 0; i < blocks.length; i++) {
        console.log(blocks[blocks.length -1 - i])
        // for (var j = 0; j < Object.keys(blocks[blocks.length -1 - i]).length; j++){
        //     json_block[Object.keys(blocks[blocks.length -1 - i])[j]] = blocks[blocks.length -1 - i][Object.keys(blocks[blocks.length -1 - i])[j]]
        // }
        // console.log(json_block)
        if (Object.keys(blocks[blocks.length -1 - i]["block"]).length > 0) {
            if (blocks[blocks.length -1 - i]["return"] != true ) {
                console.log(result_json)
                if (Object.keys(result_json).length > 0) {

                    blocks[blocks.length -1 - i]["block"]["next"] = result_json
                    result_json = {"block":blocks[blocks.length -1 - i]["block"]}

                } else {
                    result_json = {"block":blocks[blocks.length -1 - i]["block"]}
                }
            } else {
                function_results.push(blocks[blocks.length -1 - i]["block"])
            }
        }
        console.log(result_json)
        console.log(Object.keys(blocks[blocks.length -1 - i]["block"]).length)
    }
    console.log(function_results)

    console.log(result_json)

    if (result_json["block"]) {
        result_json = [
            {
                "_attributes": {"type": "start_block"},
                "statement": {
                    "_attributes": {"name": "DO"},
                    "block": result_json["block"]
                }
            }
        ]
    } else {
        result_json = []
    }
    for (var i = 0; i < function_results.length; i++){
        result_json.push(function_results[i])
    }


    console.log(result_json)


    result_json = {
        "xml":{
            "block":result_json
        }
    }
    console.log(result_json)
    var jsonData = JSON.stringify(result_json);
    var resultXml = json2xml(jsonData, { compact: true, spaces: 2 });
    console.log(resultXml);
    // var xmlDom = Blocklify.JavaScript.importer.codeToDom(code, 'atomic');
    // console.log(xmlDom)
    // Blockly.Xml.domToWorkspace(xmlDom, workspace);
    const parser = new DOMParser();
    const dom = parser.parseFromString(resultXml, "application/xml").documentElement;
    console.log(dom);
    return dom
}