

data = {
            "type": "IfStatement",
            "start": 0,
            "end": 134,
            "test": {
                "type": "BinaryExpression",
                "start": 4,
                "end": 10,
                "left": {
                    "type": "Literal",
                    "start": 4,
                    "end": 5,
                    "value": 1,
                    "raw": "1"
                },
                "operator": "==",
                "right": {
                    "type": "Literal",
                    "start": 9,
                    "end": 10,
                    "value": 1,
                    "raw": "1"
                }
            },
            "consequent": {
                "type": "BlockStatement",
                "start": 12,
                "end": 32,
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "start": 16,
                        "end": 30,
                        "expression": {
                            "type": "CallExpression",
                            "start": 16,
                            "end": 29,
                            "callee": {
                                "type": "Identifier",
                                "start": 16,
                                "end": 22,
                                "name": "output"
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "start": 23,
                                    "end": 28,
                                    "value": "abc",
                                    "raw": "'abc'"
                                }
                            ]
                        }
                    }
                ]
            },
            "alternate": {
                "type": "IfStatement",
                "start": 38,
                "end": 134,
                "test": {
                    "type": "BinaryExpression",
                    "start": 42,
                    "end": 48,
                    "left": {
                        "type": "Literal",
                        "start": 42,
                        "end": 43,
                        "value": 2,
                        "raw": "2"
                    },
                    "operator": "==",
                    "right": {
                        "type": "Literal",
                        "start": 47,
                        "end": 48,
                        "value": 2,
                        "raw": "2"
                    }
                },
                "consequent": {
                    "type": "BlockStatement",
                    "start": 50,
                    "end": 70,
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "start": 54,
                            "end": 68,
                            "expression": {
                                "type": "CallExpression",
                                "start": 54,
                                "end": 67,
                                "callee": {
                                    "type": "Identifier",
                                    "start": 54,
                                    "end": 60,
                                    "name": "output"
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "start": 61,
                                        "end": 66,
                                        "value": "def",
                                        "raw": "'def'"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "alternate": {
                    "type": "IfStatement",
                    "start": 76,
                    "end": 134,
                    "test": {
                        "type": "BinaryExpression",
                        "start": 80,
                        "end": 86,
                        "left": {
                            "type": "Literal",
                            "start": 80,
                            "end": 81,
                            "value": 3,
                            "raw": "3"
                        },
                        "operator": "==",
                        "right": {
                            "type": "Literal",
                            "start": 85,
                            "end": 86,
                            "value": 3,
                            "raw": "3"
                        }
                    },
                    "consequent": {
                        "type": "BlockStatement",
                        "start": 88,
                        "end": 108,
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "start": 92,
                                "end": 106,
                                "expression": {
                                    "type": "CallExpression",
                                    "start": 92,
                                    "end": 105,
                                    "callee": {
                                        "type": "Identifier",
                                        "start": 92,
                                        "end": 98,
                                        "name": "output"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "start": 99,
                                            "end": 104,
                                            "value": "ghi",
                                            "raw": "'ghi'"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "alternate": {
                        "type": "BlockStatement",
                        "start": 114,
                        "end": 134,
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "start": 118,
                                "end": 132,
                                "expression": {
                                    "type": "CallExpression",
                                    "start": 118,
                                    "end": 131,
                                    "callee": {
                                        "type": "Identifier",
                                        "start": 118,
                                        "end": 124,
                                        "name": "output"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "start": 125,
                                            "end": 130,
                                            "value": "jkl",
                                            "raw": "'jkl'"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }

result = []
value = []
statements = []
if_count = 0
while data:
    if ("test" in data.keys() and "consequent" in data.keys()):
        value.append({"_attributes": {"name": "IF"+str(if_count)},"block":data["test"]})
        statements.append({"_attributes": {"name": "DO"+str(if_count)},"block":data["consequent"]})
        # item = {"test": data["test"], "consequent": data["consequent"], "name": "IF"}
        # result.append(item)
        data = data.get("alternate")
        print("IF")
        if_count += 1
    else:
        # item = {"consequent": data, "name":"ELSE"}
        # result.append(item)
        statements.append({"_attributes": {"name": "ELSE"},"block":data})
        data = data.get("alternate")
        print("ELSE")

print(value)
print(statements)
print(if_count-1)