function generate_block_json(ast_json, i) {
    var json_block = {};
    console.log(ast_json)
    switch (ast_json.type) {
        case "LogicalExpression":
            var a_input = generate_block_json(ast_json.left);
            var b_input = generate_block_json(ast_json.right);
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
            json_block["block"] = {
                "type":"logic_operation",
                "fields":{
                    "OP":op
                },
                "inputs":{
                    "A":a_input,
                    "B":b_input,
                }
            }
            break;
        case "BinaryExpression":

            var a_input = generate_block_json(ast_json.left);
            var b_input = generate_block_json(ast_json.right);
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

            }
            if (ast_json.operator == "%") {
                json_block["block"] = {
                    "type":"math_modulo",
                    "inputs":{
                        "DIVIDEND":a_input,
                        "DIVISOR":b_input,
                    }
                }
            } else {
                if (op == "ADD" && typeof a_input.value == "string" && typeof b_input.value == "string") {
                    json_block["block"] = {
                        "type":"text_join",
                        "extraState": {
                            "itemCount": 2
                        },
                        "inputs":{
                            "ADD0":a_input,
                            "ADD1":b_input,
                        }
                    }
                } else {
                    json_block["block"] = {
                        "type":type,
                        "fields":{
                            "OP":op
                        },
                        "inputs":{
                            "A":a_input,
                            "B":b_input,
                        }
                    }
                }

            }
            break;
        case "CallExpression":
            if (ast_json.callee.name == "output") {
                json_block["block"] = {
                    "type":ast_json.callee.name,
                    "inputs": {
                        "output":generate_block_json(ast_json.arguments[0]),

                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "indexOf") {
                json_block["block"] = {
                    "type":"math_arithmetic",
                    "fields":{
                        "OP":"MINUS"
                    },
                    "inputs":{
                        "A":{"block":{
                            "fields": {"END": "FIRST"},
                            "type":"text_indexOf",
                            "inputs": {
                                "FIND":generate_block_json(ast_json.callee.object),
                                "VALUE":generate_block_json(ast_json.arguments[0])

                            }
                        }},
                        "B":{"block":{
                            "type": "math_number",
                            "fields": {
                                "NUM": 1
                            }
                        }},
                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "lastIndexOf") {
                json_block["block"] = {
                    "type":"math_arithmetic",
                    "fields":{
                        "OP":"MINUS"
                    },
                    "inputs":{
                        "A":{"block":{
                            "fields": {"END": "LAST"},
                            "type":"text_indexOf",
                            "inputs": {
                                "FIND":generate_block_json(ast_json.callee.object),
                                "VALUE":generate_block_json(ast_json.arguments[0])

                            }
                        }},
                        "B":{"block":{
                            "type": "math_number",
                            "fields": {
                                "NUM": 1
                            }
                        }},
                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "charAt") {
                ast_json.arguments[0].value++;
                json_block["block"] = {
                    "type":"text_chartAt",
                    "fields": {"WHERE": 'FROM_START'},
                    "inputs": {
                        "VALUE":generate_block_json(ast_json.callee.object),
                        "AT":generate_block_json(ast_json.arguments[0])

                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "slice") {
                var at2_block;
                if (ast_json.arguments.length == 1) {
                    at2_block = {"block":{"type": 'math_number', "fields": {"NUM": ast_json.callee.object.value.length}}}
                } else {
                    at2_block = generate_block_json(ast_json.arguments[1])
                }
                json_block["block"] = {
                    "type":"text_getSubstring",
                    "fields": {"WHERE1": 'FROM_START', "WHERE2": 'FROM_START'},
                    "inputs": {
                        "STRING":generate_block_json(ast_json.callee.object),
                        "AT1":generate_block_json(ast_json.arguments[0]),
                        "AT2":at2_block

                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "toUpperCase") {
                json_block["block"] = {
                    "type":"text_changeCase",
                    "fields": {"CASE": 'UPPERCASE'},
                    "inputs": {
                        "TEXT":generate_block_json(ast_json.callee.object)
                    }
                }
            } else if (typeof ast_json.callee.property != "undefined" && ast_json.callee.property.name == "toLowerCase") {
                json_block["block"] = {
                    "type":"text_changeCase",
                    "fields": {"CASE": 'LOWERCASE'},
                    "inputs": {
                        "TEXT":generate_block_json(ast_json.callee.object)
                    }
                }
            }
            break;
        case "MemberExpression":
            if (ast_json.property.name == "length") {
                json_block["block"] = {
                    "type":"text_length",
                    "inputs": {
                        "VALUE":generate_block_json(ast_json.object),

                    }
                }
            }
            break;
        case "ExpressionStatement":
            json_block = generate_block_json(ast_json.expression);
            break;
        case "UnaryExpression":
            if (ast_json.operator == "!") {
                var bool = generate_block_json(ast_json.argument);
                json_block["block"] = {
                    "type":"logic_negate",
                    "inputs":{
                        "BOOL":bool
                    }
                }
            } else if (ast_json.operator == "-") {
                ast_json.argument.value = ast_json.argument.value*-1;
                json_block = generate_block_json(ast_json.argument);
            }
            break;
        case "AssignmentExpression":
            if (ast_json.operator == "=") {
                json_block["block"] = {
                    "type": "variables_set",
                    "fields": {
                        "VAR": {"id":ast_json.left.name}
                    },
                    "inputs": {
                        "VALUE": generate_block_json(ast_json.right)
                    }
                }
            } else if (ast_json.operator == "+=") {
                json_block["block"] = {
                    "type": "math_change",
                    "fields": {
                        "VAR": {"id":ast_json.left.name}
                    },
                    "inputs": {
                        "VALUE": generate_block_json(ast_json.right)
                    }
                }
            } else if (ast_json.operator == "-=") {
                ast_json.right.value = ast_json.right.value * -1
                json_block["block"] = {
                    "type": "math_change",
                    "fields": {
                        "VAR": {"id":ast_json.left.name}
                    },
                    "inputs": {
                        "VALUE": generate_block_json(ast_json.right)
                    }
                }
            }

            break
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
            json_block["block"] = {
                "type": "math_number",
                "fields": {
                    "NUM": num
                }
            }
            break;
        case "Literal":
            var type;
            var fields_type;
            switch (typeof ast_json.value) {
                case "number":
                    type = "math_number";
                    fields_type = "NUM";
                    break;
                case "string":
                    type = "text";
                    fields_type = "TEXT";
                    break;
                case "boolean":
                    type = "logic_boolean";
                    fields_type = "BOOL";
                    break;
                default:
                    break;

            }
            json_block["block"] = {
                "type": type,
                "fields": {
                    [fields_type]: ast_json.value
                }
            }
            break;
        case "BlockStatement":
            if (0 < ast_json.body.length) {
                var last = generate_block_json(ast_json.body[0]);
                for (var j = 1; j < ast_json.body.length; j++) {
                    last["block"]["next"] = generate_block_json(ast_json.body[j])
                }
                json_block = last;
            } else {
                json_block = {};
            }

            break;

        case "WhileStatement":
            var bool = generate_block_json(ast_json.test);
            var do_block = generate_block_json(ast_json.body);

            json_block["block"] = {
                "type": "controls_whileUntil",
                "fields": {
                    "MODE": "WHILE"
                },
                "inputs": {
                    "BOOL":bool,
                    "DO":do_block,
                }
            }


            break;
        case "ForStatement":


            var by_block = generate_block_json(ast_json.update);
            if (ast_json.test.operator == "<") {
                ast_json.test.right.value--;
            } else if (!(ast_json.test.operator == "<=")) {
                console.log("error")
            }
            var from_block = generate_block_json(ast_json.init.right);
            var to_block = generate_block_json(ast_json.test.right);
            var do_block = generate_block_json(ast_json.body);
            json_block["block"] = {
                "type": "controls_for",
                "fields": {
                    "VAR": {
                        "id":ast_json.init.left.name
                    }
                },
                "inputs": {
                    "FROM":from_block,
                    "TO":to_block,
                    "BY":by_block,
                    "DO":do_block
                }
            }
            break;
        case "IfStatement":
            var bool = generate_block_json(ast_json.test);
            var do_block = generate_block_json(ast_json.consequent);
            json_block["block"] = {
                "type": "controls_if",
                "inputs": {
                    "IF0":bool,
                    "DO0":do_block,
                }
            }
            break;
        case "FunctionDeclaration":
            break;
        default:
            console.log(ast_json.type)
            break;
    }

    console.log(json_block)
    return json_block;

}
function generateBlock(code) {
    var ast = acorn.parse(code, {ecmaVersion: 8});
    var ast_json = JSON.parse(JSON.stringify(ast)).body;
    console.log(Blockly.serialization.workspaces.save(workspace))
    console.log(Blockly.Xml.workspaceToDom(workspace));
    console.log(ast_json)
    for (var i = 0; i < ast_json.length; i++) {
        generate_block_json(ast_json[i], 0)
        console.log("---------------------------------");
    }
    // var xmlDom = Blocklify.JavaScript.importer.codeToDom(code, 'atomic');
    // console.log(xmlDom)
    // Blockly.Xml.domToWorkspace(xmlDom, workspace);
}