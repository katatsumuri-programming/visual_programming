import blockly

def js_to_blockly(js_code):
    # Blocklyのワークスペースを作成
    workspace = blockly.workspaces.Workspace(id='workspace')

    # XMLを生成するブロックのリストを作成
    blocks = []

    # JavaScriptのコードをBlocklyブロックに変換
    block = blockly.Block('javascript_code', blockly={'code': js_code})
    block.set_color('#fca5a5')
    blocks.append(block)

    # ワークスペースにブロックを追加
    for block in blocks:
        workspace.add_block(block)

    # ワークスペースからXMLを生成して返す
    return workspace.to_xml()

js_code = """
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet("World");
"""
xml = js_to_blockly(js_code)
print(xml)