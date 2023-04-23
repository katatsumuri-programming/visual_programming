import xmltodict
import json
f_json = open("test-code.json", "r")
data = json.load(f_json)

function_list = []
variable_list = []
def generate_json(add, text, attr):
    pass

def convert_xml(d, n=1, block_type=None):
    result_content = {}
    result_parent = ""
    result_type = None
    print(d["type"])
    if d["type"] == "VariableDeclaration":
        print(d)
        result_content = {"variable":[]}
        result_parent = "variables"
        for variable in d["declarations"]:
            result_content["variable"].append({
                "#text":variable["id"]["name"]
            })


    elif d["type"] == "ForStatement":
        result_parent ="block"
        if (d["test"]["operator"] == "<"):
            d["test"]["right"]["value"] = d["test"]["right"]["value"] - 1
            d["test"]["right"]["raw"] = str(d["test"]["right"]["value"])
        elif (d["test"]["operator"] != "<="):
            pass
            # Error
        if not d["test"]["left"]["name"] == d["init"]["declarations"][0]["id"]["name"]:
            pass
            # Error
        if d["update"]["operator"] == "++":
            for_update = {
                "type": "Literal",
                "value": 1,
                "raw": "1"
            }
        elif d["update"]["operator"] == "+=":
            for_update = d["update"]["right"]

        result_content = [{
                "@type": "controls_for",
                "field": {
                    "@name": "VAR",
                    "#text": d["init"]["declarations"][0]["id"]["name"]
                },
                "value": [
                    {
                        "@name": "FROM",
                        "block": convert_xml(d["init"]["declarations"][0]["init"])[0]
                    },
                    {
                        "@name": "TO",
                        "block": convert_xml(d["test"]["right"])[0]
                    },
                    {
                        "@name": "BY",
                        "block": convert_xml(for_update)[0]
                    }
                ],
                "statement": {
                    "@name": "DO",
                    "block": convert_xml(d["body"])[0]
                }
            }]
    elif d["type"] == "WhileStatement":
        result_parent = "block"
        result_content = {
            "@type": "controls_whileUntil",
            "field": {
                "@name": "MODE",
                "#text": "WHILE"
            },
            "value": {
                "@name": "BOOL",
                "block": convert_xml(d["test"])[0]
            },
            "statement": {
                "@name": "DO",
                "block": convert_xml(d["body"])[0]
            }
        }
    elif d["type"] == "Literal":
        if type(d["value"]) == int:
            result_type = int
            result_content = {
                "@type": "math_number",
                "field": {
                    "@name": "NUM",
                    "#text": str(d["value"] * n)
                }
            }
        elif type(d["value"]) == str:
            result_type = str
            result_content = {
                "@type": "text",
                "field": {
                    "@name": "TEXT",
                    "#text": d["value"]
                }
            }
        elif type(d["value"]) == bool:
            result_type = bool
            result_content = {
                "@type": "logic_boolean",
                "field": {
                    "@name": "BOOL",
                    "#text": d["raw"].upper()
                }
            }
    elif d["type"] == "BinaryExpression":
        result_parent = "block"
        logic = ""
        math = ""
        if d["operator"] == "==":
            logic = "EQ"
        elif d["operator"] == "!=":
            logic = "NEQ"
        elif d["operator"] == "<":
            logic = "LT"
        elif d["operator"] == ">":
            logic = "GT"
        elif d["operator"] == "<=":
            logic = "LTE"
        elif d["operator"] == ">=":
            logic = "GTE"

        elif d["operator"] == "+":

            if convert_xml(d["left"])[2] == str and convert_xml(d["right"])[2] == str:
                result_type = str
                result_content = {
                    "@type": "text_join",
                    "mutation": {"@items": "2"},
                    "value": [
                        {
                            "@name": "ADD0",
                            "block": convert_xml(d["left"])[0]
                        },
                        {
                            "@name": "ADD1",
                            "block": convert_xml(d["right"])[0]
                        }
                    ]
                }
            else:
                math = "ADD"

        elif d["operator"] == "-":
            math = "MINUS"
        elif d["operator"] == "*":
            math = "MULTIPLY"
        elif d["operator"] == "/":
            math = "DIVIDE"

        elif d["operator"] == "%":
            result_type = int
            result_content = {
                "@type": "math_modulo",
                "value": [
                    {
                        "@name": "DIVIDEND",
                        "block": convert_xml(d["left"])[0]
                    },
                    {
                        "@name": "DIVISOR",
                        "block": convert_xml(d["right"])[0]
                    }
                ]
            }

        if logic != "":
            result_type = bool
            result_content = {
                "@type": "logic_compare",
                "field": {
                    "@name": "OP",
                    "#text": logic
                },
                "value": [
                    {
                        "@name": "A",
                        "block": convert_xml(d["left"])[0]
                    },
                    {
                        "@name": "B",
                        "block": convert_xml(d["right"])[0]
                    }
                ]
            }
        elif math != "":
            result_type = int
            result_content = {
                "@type": "math_arithmetic",
                "field": {
                    "@name": "OP",
                    "#text": math
                },
                "value": [
                    {
                        "@name": "A",
                        "block": convert_xml(d["left"])[0]
                    },
                    {
                        "@name": "B",
                        "block": convert_xml(d["right"])[0]
                    }
                ]
            }
    elif d["type"] == "BlockStatement":
        block = None
        for el in reversed(d["body"]):
            if block == None:
                block = {"block":convert_xml(el["expression"])[0]}
            else:
                block = {"block":convert_xml(el["expression"])[0], "next":block}
        result_content = block["block"]

    elif d["type"] == "CallExpression":
        result_parent = "block"
        if "name" in d["callee"].keys():
            if d["callee"]["name"] == "output":
                result_content = {
                    "@type": "output",
                    "value": {
                        "@name": "output",
                        "block": convert_xml(d["arguments"][0])[0]
                    }
                }
            else:

                params = []
                arg = []
                for f in function_list:
                    if f["id"]["name"] == d["callee"]["name"]:
                        for p in f["params"]:
                            params.append({"@name":p["name"]})

                for i in range(len(d["arguments"])):
                    arg.append({
                        "@name": "ARG"+str(i),
                        "block": convert_xml(d["arguments"][i])[0]
                    })

                result_parent = "block"
                result_content = {
                    "@type": "procedures_callreturn",
                    "mutation": {
                        "@name": d["callee"]["name"],
                        "arg": params
                    },
                    "value": arg
                }
        else:
            if d["callee"]["type"] == "MemberExpression":
                if "name" in d["callee"]["object"].keys() and d["callee"]["object"]["name"] == "Math":
                    result_type = int
                    math_round = ""
                    math_single = ""
                    if d["callee"]["property"]["name"] == "pow":

                        result_content = {
                            "@type": "math_arithmetic",
                            "field": {
                                "@name": "OP",
                                "#text": "POWER"
                            },
                            "value": [
                                {
                                    "@name": "A",
                                    "block": convert_xml(d["arguments"][0])[0]
                                },
                                {
                                    "@name": "B",
                                    "block": convert_xml(d["arguments"][1])[0]
                                }
                            ]
                        }
                    elif d["callee"]["property"]["name"] == "random":
                        result_content = {
                            "@type": "math_random_float"
                        }
                    elif d["callee"]["property"]["name"] == "round":
                        math_round = "ROUND"
                    elif d["callee"]["property"]["name"] == "ceil":
                        math_round = "ROUNDUP"
                    elif d["callee"]["property"]["name"] == "floor":
                        math_round = "ROUNDDOWN"
                    elif d["callee"]["property"]["name"] == "sqrt":
                        math_single = "ROOT"
                    elif d["callee"]["property"]["name"] == "abs":
                        math_single = "ABS"
                    elif d["callee"]["property"]["name"] == "log":
                        math_single = "LN"
                    elif d["callee"]["property"]["name"] == "exp":
                        math_single = "EXP"


                    if math_round != "":
                        result_content = {
                            "@type": "math_round",
                            "field": {
                                "@name": "OP",
                                "#text": math_round
                            },
                            "value": {
                                "@name": "NUM",
                                "block": convert_xml(d["arguments"][0])[0]
                            }
                        }
                    elif math_single != "":
                        result_content = {
                            "@type": "math_single",
                            "field": {
                                "@name": "OP",
                                "#text": math_single
                            },
                            "value": {
                                "@name": "NUM",
                                "block": convert_xml(d["arguments"][0])[0]
                            }
                        }
                else:

                    if "property" in d["callee"].keys():

                        property = d["callee"]["property"]["name"]
                        if property == "split":
                            result_type = list
                            result_content = {
                                "@type": "lists_sprit",
                                "mutation": {"@mode": "SPLIT"},
                                "field": {"@name": "MODE","#text": "SPLIT"},
                                "value": [
                                    {
                                        "@name": "INPUT",
                                        "block": convert_xml(d["callee"]["object"])[0]
                                    },
                                    {
                                        "@name": "DELIM",
                                        "block": convert_xml(d["arguments"][0])[0]
                                    }
                                ]
                            }
                        if property == "indexOf" or property == "lastIndexOf":
                            if property == "indexOf":
                                field_txt = "FIRST"
                            elif property == "lastIndexOf":
                                field_txt = "LAST"
                            result_type = int
                            if convert_xml(d["callee"]["object"])[2] == str:
                                result_content = {
                                    "@type": "text_indexOf",
                                    "field": {"@name": "END","#text": field_txt},
                                    "value": [
                                        {
                                            "@name": "VALUE",
                                            "block": convert_xml(d["callee"]["object"])[0]
                                        },
                                        {
                                            "@name": "FIND",
                                            "block": convert_xml(d["arguments"][0])[0]
                                        }
                                    ]
                                }
                            else:
                                result_content = {
                                    "@type": "lists_indexOf",
                                    "field": {"@name": "END","#text": field_txt},
                                    "value": [
                                        {
                                            "@name": "VALUE",
                                            "block": convert_xml(d["callee"]["object"])[0]
                                        },
                                        {
                                            "@name": "FIND",
                                            "block": convert_xml(d["arguments"][0])[0]
                                        }
                                    ]
                                }
                            result_content = {
                                "@type": "math_arithmetic",
                                "field": {"@name": "OP", "#text": "MINUS"},
                                "value": [
                                    {"@name":"A", "block":result_content},
                                    {"@name":"B", "block":{"@type":"math_number", "field":{"@name":"NUM", "#text":"1"}}}
                                ]
                            }
                        if property == "charAt":
                            result_type = str
                            result_content = {
                                "@type": "text_charAt",
                                "mutation": {
                                    "@at": "true"
                                },
                                "field": {
                                    "@name": "WHERE",
                                    "#text": "FROM_START"
                                },
                                "value": [
                                    {
                                        "@name": "VALUE",
                                        "block":convert_xml(d["callee"]["object"])[0]
                                    },
                                    {
                                        "@name": "AT",
                                        "block":{
                                            "@type": "math_arithmetic",
                                            "field": {"@name": "OP", "#text": "ADD"},
                                            "value": [
                                                {"@name":"A", "block":convert_xml(d["arguments"][0])[0]},
                                                {"@name":"B", "block":{"@type":"math_number", "field":{"@name":"NUM", "#text":"1"}}}
                                            ]
                                        }
                                    }
                                ]
                            }

                        if property == "slice":
                            result_type = str
                            result_content = {
                                "@type": "text_getSubstring",
                                "mutation": {"@at1": "true","@at2": "true"},
                                "field": [{"@name": "WHERE1","#text": "FROM_START"},{"@name": "WHERE2","#text": "FROM_START"}],
                                "value": [
                                    {
                                        "@name": "STRING",
                                        "block":convert_xml(d["callee"]["object"])[0]
                                    },
                                    {
                                        "@name": "AT1",
                                        "block":{
                                            "@type": "math_arithmetic",
                                            "field": {"@name": "OP", "#text": "ADD"},
                                            "value": [
                                                {"@name":"A", "block":convert_xml(d["arguments"][0])[0]},
                                                {"@name":"B", "block":{"@type":"math_number", "field":{"@name":"NUM", "#text":"1"}}}
                                            ]
                                        }
                                    },
                                    {
                                        "@name": "AT2",
                                        "block": convert_xml(d["arguments"][1])[0]
                                    }
                                ]
                            }
                        if property == "toUpperCase":
                            result_parent = "block"
                            result_type = str
                            result_content = {
                                "@name": "text_changeCase",
                                "field": {"@name": "CASE","#text": "UPPERCASE"},
                                "value": {
                                    "@name": "TEXT",
                                    "block": convert_xml(d["callee"]["object"])[0]
                                }
                            }
                        if property == "toLowerCase":
                            result_parent = "block"
                            result_type = str
                            result_content = {
                                "@name": "text_changeCase",
                                "field": {"@name": "CASE","#text": "LOWERCASE"},
                                "value": {
                                    "@name": "TEXT",
                                    "block": convert_xml(d["callee"]["object"])[0]
                                }
                            }
                        if property == "prompt" and d["callee"]["object"]["name"] == "window":
                            result_content = {
                                "@type": "text_prompt_ext",
                                "mutation": {"@type": "TEXT"},
                                "field": {"@name": "TYPE","#text": "TEXT"},
                                "value": {
                                    "@name": "TEXT",
                                    "block": convert_xml(d["arguments"][0])[0]
                                }
                            }

    elif d["type"] == "MemberExpression":
        if "name" in d["object"].keys():
            result_parent = "block"
            if d["object"]["name"] == "Math":
                result_type = int
                result_content = {
                        "@type":"math_constant",
                        "field": {
                            "@name":"CONSTANT",
                            "#text": d["property"]["name"].upper()
                        }
                    }
            else:
                result_type = int
                result_content = {
                    "@type": "lists_getIndex",
                    "mutation": {"@statement": "false","@at": "true"},
                    "field": [
                        {"@name": "MODE","#text": "GET"},
                        {"@name": "WHERE","#text": "FROM_START"}
                    ],
                    "value": [
                        {
                            "@name": "VALUE",
                            "block": {
                                "@type": "variables_get",
                                "field": {
                                    "@name": "VAR",
                                    "#text": d["object"]["name"]
                                }
                            }
                        },
                        {
                            "@name": "AT",
                            "block": {
                                "@type": "math_arithmetic",
                                "field": {"@name": "OP", "#text": "ADD"},
                                "value": [
                                    {"@name":"A", "block":convert_xml(d["property"])[0]},
                                    {"@name":"B", "block":{"@type":"math_number", "field":{"@name":"NUM", "#text":"1"}}}
                                ]
                            }
                        }
                    ]
                }
        if "name" in d["property"]:
            if d["property"]["name"] == "length":
                    result_parent = "block"
                    result_type = int
                    if convert_xml(d["object"])[2] == str:
                        result_content = {
                            "@type": "text_length",
                            "value": {
                                "@name": "VALUE",
                                "block": convert_xml(d["object"])[0]
                            }
                        }
                    else:
                        result_content = {
                            "@type": "lists_length",
                            "value": {
                                "@name": "VALUE",
                                "block": convert_xml(d["object"])[0]
                            }
                        }




    elif d["type"] == "ExpressionStatement":
        if "name" in d["expression"].keys() and d["expression"]["name"] == "Infinity":
            result_type = int
            result_parent = "block"
            result_content = {
                "@type": "math_constant",
                "field": {
                    "@name": "CONSTANT",
                    "#text": "INFINITY"
                }
            }
        else:
            result_parent = convert_xml(d["expression"])[1]
            result_content = convert_xml(d["expression"])[0]

    elif d["type"] == "FunctionDeclaration":
        result_parent = "block"
        mutation = []
        for p in d["params"]:
            mutation.append({
                "arg": {
                    "@name": p["name"]
                }
            })

        result_content = {
            "@type": "procedures_defnoreturn",
            "mutation": mutation,
            "field": {
                "@name": "NAME",
                "#text": d["id"]["name"]
            }
        }
        function_list.append(d)
    elif d["type"] == "AssignmentExpression":
        if d["operator"] == "=":
            if "property" in d["left"].keys():
                result_parent = "block"
                result_content = {
                    "@type": "lists_setIndex",
                    "mutation": {"@at": "false"},
                    "field": [{"@name": "MODE","#text": "SET"},{"@name": "WHERE", "#text": "FROM_START"}],
                    "value": [
                        {
                            "@name": "LIST",
                            "block": {
                                "@type": "variables_get",
                                "field": {
                                    "@name": "VAR",
                                    "#text": d["left"]["object"]["name"]
                                }
                            }
                        },
                        {
                            "@name": "AT",
                            "block": {
                                "@type": "math_arithmetic",
                                "field": {"@name": "OP", "#text": "ADD"},
                                "value": [
                                    {"@name":"A", "block":convert_xml(d["left"]["property"])[0]},
                                    {"@name":"B", "block":{"@type":"math_number", "field":{"@name":"NUM", "#text":"1"}}}
                                ]


                            }
                        },
                        {
                            "@name": "TO",
                            "block": convert_xml(d["right"])[0]
                        }
                    ]
                }
            else:
                result_parent = "block"
                result_content = {
                    "@type": "variables_set",
                    "field": {
                        "@name": "VAR",
                        "#text": d["left"]["name"]
                    },
                    "value": {
                        "@name": "VALUE",
                        "block": convert_xml(d["right"])[0]
                    }
                }
        elif d["operator"] == "+=":
            result_parent = "block"
            result_content = {
                "@type": "math_change",
                "field": {
                    "@name": "VAR",
                    "#text": d["left"]["name"]
                },
                "value": {
                    "@name": "DELTA",
                    "block": convert_xml(d["right"])[0]
                }
            }

    elif d["type"] == "UnaryExpression":
        if d["operator"] == "-":
            result_type = int
            result_content = convert_xml(d["argument"], -1)[0]

    elif d["type"] == "Identifier":
        result_parent = "block"
        result_content = {
              "@type": "variables_get",
              "field": {
                "@name": "VAR",
                "#text": d["name"]
              }
            }
    elif d["type"] == "ArrayExpression":
        result_parent = "block"
        if len(d["elements"]) == 0:
            result_content = {
                "@type": "lists_create_empty",
            }
        else:
            value = []
            for el in d["elements"]:
                value.append(convert_xml(el)[0])
            result_content = {
                "@type": "lists_create_with",
                "mutation": {
                    "@items": str(len(d["elements"]))
                },
                "value":value
            }


    return (result_content, result_parent, result_type)


r = {"xml":{}}

for d in data["body"]:
    x = convert_xml(d)
    if x[1] in r["xml"].keys():
        if type(r["xml"][x[1]]) != list:
            r["xml"][x[1]] = [r["xml"][x[1]]]
        r["xml"][x[1]].append(x[0])
    else:
        r["xml"][x[1]] = x[0]
    print(r)


xml = xmltodict.unparse(r,pretty=True)
print(xml)