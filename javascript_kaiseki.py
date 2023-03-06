import re

code = """
while (true) {
  output('abc');
}
"""
code = code.replace(' ', '')
code = code.replace('\n', '')
print(code)
if ("while" in code):
    position = code.find("while")
    print(position)
    print(code[position:position+5])
    print(re.search('while(?<=\().+?(?=\))', code))
    print(re.findall("(?<=\().+?(?=\))", code))
    print(re.findall("(?<=\{).+?(?=\})", code))